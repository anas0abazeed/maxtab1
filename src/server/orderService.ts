import { checkRateLimit, getClientIp } from "./rateLimiter";

export interface OrderPayload {
  customerName?: unknown;
  phone?: unknown;
  governorate?: unknown;
  quantity?: unknown;
  selectedColor?: unknown;
  notes?: unknown;
  website?: unknown; // Honeypot field
  company?: unknown; // Honeypot field
  _hp_check?: unknown; // Honeypot field
}

export interface ValidatedOrder {
  id: string;
  customerName: string;
  phone: string;
  governorate: string;
  quantity: number;
  selectedColor: "برتقالي" | "سكني" | "أسود";
  notes: string;
  product: string;
  price: number;
  totalPrice: number;
  currency: string;
  timestamp: string;
  orderStatus: "New";
}

export interface ValidationSuccess {
  valid: true;
  order: ValidatedOrder;
}

export interface ValidationFailure {
  valid: false;
  error: string;
  isBot?: boolean;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

const ALLOWED_COLORS = ["برتقالي", "سكني", "أسود"] as const;
const FIXED_PRICE_JOD = 88;
const PRODUCT_NAME = "MAXTAB Ultimate 70 PRO 5G";

const VALID_GOVERNORATES = [
  "عمان (العاصمة)",
  "عمان",
  "إربد",
  "الزرقاء",
  "البلقاء (السلط)",
  "البلقاء",
  "العقبة",
  "مادبا",
  "جرش",
  "عجلون",
  "الكرك",
  "الطفيلة",
  "معان",
  "المفرق",
];

// Short-term deduplication cache (prevents duplicate submission within 20s)
const recentOrdersCache = new Map<string, number>();

// Clean up cache periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, ts] of recentOrdersCache.entries()) {
      if (now - ts > 30000) {
        recentOrdersCache.delete(key);
      }
    }
  }, 15000).unref?.();
}

/**
 * Escapes characters for Telegram HTML parse_mode
 */
export function escapeTelegramHtml(str: string): string {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Redacts secrets (e.g. Telegram bot token) and sensitive personal data from strings / logs
 */
export function redactSecrets(message: string, token?: string): string {
  let clean = message;
  if (token && token.trim()) {
    clean = clean.split(token.trim()).join("[REDACTED_BOT_TOKEN]");
  }
  // Redact potential bot tokens matching Telegram pattern
  clean = clean.replace(/bot\d{8,10}:[a-zA-Z0-9_-]{35}/g, "bot[REDACTED_TOKEN]");
  return clean;
}

/**
 * Masks phone numbers for secure logging (e.g., 0789526199 -> 078***6199)
 */
export function maskPhone(phone: string): string {
  const clean = String(phone || "").replace(/\s+/g, "");
  if (clean.length <= 6) return "***";
  return clean.slice(0, 3) + "***" + clean.slice(-4);
}

/**
 * Validates the raw request payload strictly against production security constraints.
 */
export function validateOrder(payload: OrderPayload): ValidationResult {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { valid: false, error: "صيغة بيانات الطلب غير صالحة." };
  }

  // 1. Honeypot check: automated spam bots fill invisible fields
  const honeypot = payload.website || payload.company || payload._hp_check;
  if (honeypot && typeof honeypot === "string" && honeypot.trim().length > 0) {
    return {
      valid: false,
      error: "تم رفض الطلب.",
      isBot: true,
    };
  }

  // 2. Customer Name validation
  const rawName = typeof payload.customerName === "string" ? payload.customerName.trim() : "";
  if (!rawName || rawName.length < 2) {
    return {
      valid: false,
      error: "يرجى إدخال الاسم الكامل بشكل صحيح (ثلاثي أو رباعي لتسهيل التسليم).",
    };
  }
  if (rawName.length > 70) {
    return {
      valid: false,
      error: "الاسم المدخل طويل جداً (الحد الأقصى 70 حرفاً).",
    };
  }
  // Disallow suspicious control characters
  if (/[\u0000-\u001F\u007F]/.test(rawName)) {
    return { valid: false, error: "الاسم يحتوي على رموز غير صالحة." };
  }

  // 3. Phone Number validation
  const rawPhone = typeof payload.phone === "string" ? payload.phone.trim().replace(/[\s\-()]/g, "") : "";
  if (!rawPhone || rawPhone.length < 8) {
    return {
      valid: false,
      error: "يرجى إدخال رقم هاتف فعال للتواصل والتأكيد (مثال: 07XXXXXXXX).",
    };
  }
  if (rawPhone.length > 20) {
    return {
      valid: false,
      error: "رقم الهاتف المدخل طويل جداً.",
    };
  }
  // Check valid phone characters (optional leading +, followed by digits)
  if (!/^\+?[0-9]{8,18}$/.test(rawPhone)) {
    return {
      valid: false,
      error: "يرجى إدخال رقم هاتف صالح يحتوي على أرقام فقط (مثال: 07XXXXXXXX).",
    };
  }

  // 4. Governorate validation (strictly in Jordan governorates list)
  const governorate = typeof payload.governorate === "string" ? payload.governorate.trim() : "";
  if (!governorate || !VALID_GOVERNORATES.includes(governorate)) {
    return { valid: false, error: "يرجى تحديد المحافظة من القائمة المعتمدة." };
  }

  // 5. Quantity validation (strictly 1 to 10 integer)
  const rawQty = payload.quantity;
  const parsedQty = typeof rawQty === "number" ? rawQty : parseInt(String(rawQty || "1"), 10);
  if (isNaN(parsedQty) || !Number.isInteger(parsedQty) || parsedQty < 1 || parsedQty > 10) {
    return { valid: false, error: "يرجى تحديد كمية صحيحة بين 1 و 10 أجهزة." };
  }

  // 6. Selected Color validation (strictly from allowed enum)
  const color = typeof payload.selectedColor === "string" ? payload.selectedColor.trim() : "";
  if (!ALLOWED_COLORS.includes(color as any)) {
    return {
      valid: false,
      error: "اللون المختار غير صالح. الألوان المتاحة هي: برتقالي، سكني، أسود.",
    };
  }

  // 7. Notes validation (optional, max 300 chars, no control chars)
  let notes = typeof payload.notes === "string" ? payload.notes.trim() : "";
  if (notes.length > 300) {
    notes = notes.slice(0, 300);
  }
  if (/[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/.test(notes)) {
    notes = notes.replace(/[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g, "");
  }

  // Generate safe server-authoritative order ID
  const orderId = `MAX-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const order: ValidatedOrder = {
    id: orderId,
    customerName: rawName,
    phone: rawPhone,
    governorate,
    quantity: parsedQty,
    selectedColor: color as "برتقالي" | "سكني" | "أسود",
    notes,
    product: PRODUCT_NAME,
    price: FIXED_PRICE_JOD,
    totalPrice: parsedQty * FIXED_PRICE_JOD,
    currency: "JOD",
    timestamp: new Date().toISOString(),
    orderStatus: "New",
  };

  return { valid: true, order };
}

/**
 * Sends Telegram notification using official Telegram Bot API sendMessage.
 * Securely enforces timeout, redacts tokens from errors, and handles failures cleanly.
 */
export async function sendTelegramOrderNotification(
  order: ValidatedOrder
): Promise<{ ok: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!botToken || !chatId) {
    console.error(
      "[Telegram Config Error] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing from server environment."
    );
    return {
      ok: false,
      error: "إعدادات إشعار تيليجرام غير مهيأة على الخادم. يرجى التواصل مع الإدارة.",
    };
  }

  // Basic format check for Bot Token (123456789:ABCdef...)
  if (!/^\d{8,11}:[a-zA-Z0-9_-]{30,45}$/.test(botToken)) {
    console.error("[Telegram Config Error] TELEGRAM_BOT_TOKEN format appears invalid.");
    return {
      ok: false,
      error: "إعدادات مفتاح بوت تيليجرام غير صالحة على الخادم.",
    };
  }

  const notesHtml = order.notes
    ? escapeTelegramHtml(order.notes)
    : "لا توجد ملاحظات";
  const notesPlain = order.notes ? order.notes : "لا توجد ملاحظات";

  // Formatted HTML message
  const htmlMessage = [
    `🛒 <b>طلب جديد - MAXTAB</b>`,
    ``,
    `🆔 <b>رقم الطلب:</b> <code>${escapeTelegramHtml(order.id)}</code>`,
    `👤 <b>الاسم:</b> ${escapeTelegramHtml(order.customerName)}`,
    `📞 <b>الهاتف:</b> <code>${escapeTelegramHtml(order.phone)}</code>`,
    `📍 <b>المحافظة:</b> ${escapeTelegramHtml(order.governorate)}`,
    `📦 <b>الكمية:</b> ${order.quantity}`,
    `🎨 <b>اللون:</b> ${escapeTelegramHtml(order.selectedColor)}`,
    `📝 <b>الملاحظات:</b>`,
    `${notesHtml}`,
    ``,
    `📱 <b>المنتج:</b> ${order.product}`,
    `💰 <b>سعر الوحدة:</b> ${order.price} دينار`,
    `💵 <b>الإجمالي:</b> <b>${order.totalPrice} دينار</b>`,
    `🔵 <b>الحالة:</b> ${order.orderStatus}`,
  ].join("\n");

  const plainMessage = [
    `🛒 طلب جديد - MAXTAB`,
    ``,
    `🆔 رقم الطلب: ${order.id}`,
    `👤 الاسم: ${order.customerName}`,
    `📞 الهاتف: ${order.phone}`,
    `📍 المحافظة: ${order.governorate}`,
    `📦 الكمية: ${order.quantity}`,
    `🎨 اللون: ${order.selectedColor}`,
    `📝 الملاحظات:`,
    `${notesPlain}`,
    ``,
    `📱 المنتج: ${order.product}`,
    `💰 سعر الوحدة: ${order.price} دينار`,
    `💵 الإجمالي: ${order.totalPrice} دينار`,
    `🔵 الحالة: ${order.orderStatus}`,
  ].join("\n");

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    // 1. Send HTML message with 8-second timeout
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: "HTML",
      }),
      signal: AbortSignal.timeout(8000),
    });

    const data: any = await response.json().catch(() => null);

    if (response.ok && data?.ok) {
      console.log(
        `[Telegram Success] Order notification delivered for ID ${order.id} (Phone: ${maskPhone(
          order.phone
        )})`
      );
      return { ok: true };
    }

    // If specifically HTML parsing failed, retry once with plain text
    const isParseError =
      response.status === 400 &&
      typeof data?.description === "string" &&
      data.description.toLowerCase().includes("parse");

    if (isParseError) {
      console.warn("[Telegram Notice] HTML formatting failed, retrying plain text...");
      const fallbackResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: plainMessage,
        }),
        signal: AbortSignal.timeout(6000),
      });

      const fallbackData: any = await fallbackResponse.json().catch(() => null);
      if (fallbackResponse.ok && fallbackData?.ok) {
        console.log(`[Telegram Success] Plain text delivered for ID ${order.id}`);
        return { ok: true };
      }
    }

    // Safely log the failure without leaking secrets
    const safeErrorMsg = redactSecrets(
      data?.description || `HTTP ${response.status}`,
      botToken
    );
    console.error(`[Telegram Error] API rejected message: ${safeErrorMsg}`);

    return {
      ok: false,
      error: "تعذر إرسال الإشعار إلى تيليجرام حالياً. يرجى المحاولة بعد قليل.",
    };
  } catch (err: any) {
    const rawMsg = err instanceof Error ? err.message : String(err);
    const safeMsg = redactSecrets(rawMsg, botToken);
    console.error("[Telegram Network Error]", safeMsg);

    if (err.name === "TimeoutError") {
      return {
        ok: false,
        error: "انتهت مهلة الاتصال بخوادم تيليجرام. يرجى المحاولة مرة أخرى.",
      };
    }

    return {
      ok: false,
      error: "تعذر الاتصال بخوادم تيليجرام. يرجى المحاولة بعد قليل.",
    };
  }
}

/**
 * Universal handler used by both Express (server.ts) and Vercel Serverless Function (api/order.ts)
 */
export async function handleOrderSubmission(
  req: any,
  res: any,
  onSuccess?: (order: ValidatedOrder) => void
): Promise<void> {
  const sendJson = (
    statusCode: number,
    payload: any,
    extraHeaders: Record<string, string> = {}
  ) => {
    // Standard security headers for API responses
    const headers: Record<string, string> = {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      ...extraHeaders,
    };

    if (typeof res.setHeader === "function") {
      for (const [key, value] of Object.entries(headers)) {
        res.setHeader(key, value);
      }
    }

    if (typeof res.status === "function" && typeof res.json === "function") {
      return res.status(statusCode).json(payload);
    }

    res.statusCode = statusCode;
    res.end(JSON.stringify(payload));
  };

  // Restrict CORS: only allow same-origin or preflight
  if (typeof res.setHeader === "function") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  // Handle preflight
  if (req.method === "OPTIONS") {
    if (typeof res.status === "function") {
      res.status(204).end();
    } else {
      res.statusCode = 204;
      res.end();
    }
    return;
  }

  // Reject unsupported HTTP methods
  if (req.method !== "POST") {
    if (typeof res.setHeader === "function") {
      res.setHeader("Allow", "POST, OPTIONS");
    }
    sendJson(405, {
      success: false,
      error: "الطريقة غير مسموح بها. يقبل هذا المسار طلبات POST فقط.",
    });
    return;
  }

  // Extract client IP safely
  const clientIp = getClientIp(req);

  // 1. Rate Limiting Check
  try {
    const rateLimit = await checkRateLimit(clientIp, {
      maxRequests: 5,
      windowSeconds: 600, // 5 requests per 10 minutes
    });

    if (!rateLimit.allowed) {
      console.warn(
        `[Rate Limit Exceeded] IP ${clientIp} exceeded order rate limit. Retry-After: ${rateLimit.retryAfterSeconds}s`
      );
      sendJson(
        429,
        {
          success: false,
          error:
            "تم استلام عدد كبير من الطلبات من هذا الجهاز خلال وقت قصير. يرجى الانتظار بضع دقائق قبل المحاولة مجدداً.",
        },
        {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        }
      );
      return;
    }
  } catch (rateErr) {
    console.warn("[Rate Limit Error]", rateErr);
    // Proceed safely if rate limiter experiences an unexpected internal error
  }

  // 2. Parse request body safely with size bounds
  let body = req.body;
  if (!body && typeof req.on === "function") {
    try {
      const chunks: any[] = [];
      let totalBytes = 0;
      const MAX_BYTES = 64 * 1024; // 64 KB maximum payload limit

      for await (const chunk of req) {
        totalBytes += chunk.length;
        if (totalBytes > MAX_BYTES) {
          sendJson(413, {
            success: false,
            error: "حجم الطلب المرسل أكبر من الحد المسموح به.",
          });
          return;
        }
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
      }

      const rawText = Buffer.concat(chunks).toString("utf-8");
      if (rawText) {
        try {
          body = JSON.parse(rawText);
        } catch {
          sendJson(400, {
            success: false,
            error: "صيغة بيانات JSON غير صالحة.",
          });
          return;
        }
      }
    } catch (streamErr) {
      console.warn("[Body Read Error]", streamErr);
      sendJson(400, { success: false, error: "تعذر قراءة بيانات الطلب." });
      return;
    }
  } else if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      sendJson(400, {
        success: false,
        error: "صيغة بيانات JSON غير صالحة.",
      });
      return;
    }
  }

  // 3. Validation
  const validation = validateOrder(body);
  if (validation.valid === false) {
    if (validation.isBot) {
      // Silently discard spam bots with 400
      sendJson(400, { success: false, error: "فشل التحقق من الطلب." });
      return;
    }
    sendJson(400, { success: false, error: validation.error });
    return;
  }

  const { order } = validation;

  // 4. Duplicate Submission Guard (Idempotency check within 20s)
  const dedupKey = `${order.phone}:${order.governorate}:${order.selectedColor}:${order.quantity}`;
  const lastSubmitted = recentOrdersCache.get(dedupKey);
  const now = Date.now();

  if (lastSubmitted && now - lastSubmitted < 20000) {
    console.warn(
      `[Duplicate Guard] Prevented immediate duplicate order for phone ${maskPhone(
        order.phone
      )}`
    );
    sendJson(429, {
      success: false,
      error: "تم استلام هذا الطلب بالفعل للتو! سنتواصل معك هاتفياً قريباً لتأكيده.",
    });
    return;
  }
  recentOrdersCache.set(dedupKey, now);

  // 5. Telegram Notification
  const telegramResult = await sendTelegramOrderNotification(order);

  if (!telegramResult.ok) {
    // Clean up cache entry so user can retry legitimately
    recentOrdersCache.delete(dedupKey);

    sendJson(502, {
      success: false,
      error: telegramResult.error || "حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.",
    });
    return;
  }

  // 6. Local persistence callback (if enabled, with privacy-conscious logging)
  if (onSuccess) {
    try {
      onSuccess(order);
    } catch (cbErr) {
      console.warn("[Order Persistence Warning]", cbErr);
    }
  }

  // 7. Sanitized Success response (does NOT expose server internals or tokens)
  sendJson(200, {
    success: true,
    message: "تم إرسال طلبك بنجاح ✅",
    orderId: order.id,
    order: {
      id: order.id,
      customerName: order.customerName,
      governorate: order.governorate,
      quantity: order.quantity,
      selectedColor: order.selectedColor,
      product: order.product,
      price: order.price,
      totalPrice: order.totalPrice,
      currency: order.currency,
      timestamp: order.timestamp,
      orderStatus: order.orderStatus,
    },
  });
}
