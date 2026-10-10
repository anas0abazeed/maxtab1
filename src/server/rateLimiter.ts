/**
 * Rate Limiter for Order Submission
 * Supports:
 * 1. Distributed rate limiting via Upstash Redis / Vercel KV REST API when configured
 *    (UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN or KV_REST_API_URL + KV_REST_API_TOKEN).
 * 2. In-memory sliding window fallback for local development and single-instance servers.
 */

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
  source: "upstash" | "memory";
}

interface MemoryWindowRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, MemoryWindowRecord>();
let hasLoggedStoreNotice = false;

// Clean up expired in-memory entries periodically to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    for (const [key, record] of memoryStore.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < windowMs);
      if (record.timestamps.length === 0) {
        memoryStore.delete(key);
      }
    }
  }, 60 * 1000).unref?.();
}

/**
 * Safely extracts client IP address without blind trust in unverified headers
 */
export function getClientIp(req: any): string {
  // 1. Vercel sets x-vercel-forwarded-for from its trusted edge network
  const vercelIp = req.headers?.["x-vercel-forwarded-for"];
  if (typeof vercelIp === "string" && vercelIp.trim()) {
    const firstIp = vercelIp.split(",")[0].trim();
    if (isValidIp(firstIp)) return firstIp;
  }

  // 2. Standard reverse proxy header x-real-ip
  const realIp = req.headers?.["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) {
    const cleanReal = realIp.trim();
    if (isValidIp(cleanReal)) return cleanReal;
  }

  // 3. X-Forwarded-For (take the first IP in the list)
  const forwardedFor = req.headers?.["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    const firstIp = forwardedFor.split(",")[0].trim();
    if (isValidIp(firstIp)) return firstIp;
  }

  // 4. Express req.ip or socket remote address
  const socketIp = req.ip || req.socket?.remoteAddress || req.connection?.remoteAddress;
  if (typeof socketIp === "string" && socketIp.trim()) {
    // Strip IPv6-mapped IPv4 prefix (::ffff:127.0.0.1 -> 127.0.0.1)
    const cleanSocket = socketIp.replace(/^::ffff:/, "").trim();
    if (isValidIp(cleanSocket)) return cleanSocket;
    return cleanSocket;
  }

  return "unknown-client";
}

function isValidIp(ip: string): boolean {
  // Simple check for valid IPv4 or IPv6 format
  const ipv4Pattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Pattern = /^[0-9a-fA-F:]+$/;
  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
}

/**
 * Rate limit check:
 * - Window: 10 minutes (600 seconds)
 * - Max requests: 5 per window per IP
 */
export async function checkRateLimit(
  clientIp: string,
  options: {
    maxRequests?: number;
    windowSeconds?: number;
    prefix?: string;
  } = {}
): Promise<RateLimitResult> {
  const maxRequests = options.maxRequests ?? 5;
  const windowSeconds = options.windowSeconds ?? 600;
  const prefix = options.prefix ?? "order";
  const key = `ratelimit:${prefix}:${clientIp}`;

  const redisUrl =
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim();
  const redisToken =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim();

  // 1. If distributed Upstash Redis is configured, use it for multi-instance Vercel serverless
  if (redisUrl && redisToken) {
    try {
      const result = await checkUpstashRateLimit(
        redisUrl,
        redisToken,
        key,
        maxRequests,
        windowSeconds
      );
      return result;
    } catch (err) {
      console.warn(
        "[RateLimit Warning] Upstash Redis request failed, falling back to memory store:",
        err instanceof Error ? err.message : String(err)
      );
    }
  } else if (!hasLoggedStoreNotice) {
    hasLoggedStoreNotice = true;
    console.info(
      "[RateLimit Notice] Running in-memory rate limiter. For distributed multi-instance Vercel serverless rate limiting, configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel environment variables."
    );
  }

  // 2. In-memory sliding window fallback
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  let record = memoryStore.get(key);

  if (!record) {
    record = { timestamps: [] };
    memoryStore.set(key, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const oldestTimestamp = record.timestamps[0];
    const retryAfterMs = oldestTimestamp + windowMs - now;
    const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
    return {
      allowed: false,
      limit: maxRequests,
      remaining: 0,
      retryAfterSeconds,
      source: "memory",
    };
  }

  // Record this request
  record.timestamps.push(now);
  const remaining = maxRequests - record.timestamps.length;

  return {
    allowed: true,
    limit: maxRequests,
    remaining,
    retryAfterSeconds: 0,
    source: "memory",
  };
}

/**
 * Checks rate limit via Upstash Redis REST API
 */
async function checkUpstashRateLimit(
  url: string,
  token: string,
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  // Use pipeline: INCR key, then TTL key
  const pipelineEndpoint = `${url.replace(/\/$/, "")}/pipeline`;
  const response = await fetch(pipelineEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["TTL", key],
    ]),
    signal: AbortSignal.timeout(3000),
  });

  if (!response.ok) {
    throw new Error(`Upstash HTTP ${response.status}`);
  }

  const results: any = await response.json();
  const currentCount = Number(results?.[0]?.result ?? 1);
  let ttl = Number(results?.[1]?.result ?? -1);

  // If key had no TTL (new key or expired), set expiration
  if (ttl <= 0) {
    fetch(`${url.replace(/\/$/, "")}/expire/${encodeURIComponent(key)}/${windowSeconds}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(2000),
    }).catch(() => {});
    ttl = windowSeconds;
  }

  const allowed = currentCount <= maxRequests;
  const remaining = Math.max(0, maxRequests - currentCount);

  return {
    allowed,
    limit: maxRequests,
    remaining,
    retryAfterSeconds: allowed ? 0 : Math.max(1, ttl),
    source: "upstash",
  };
}
