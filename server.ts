import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { handleOrderSubmission, maskPhone, ValidatedOrder } from "./src/server/orderService";

const app = express();
const PORT = 3000;

// Trust first proxy (Google Cloud Run / Vercel Edge / Reverse Proxy)
app.set("trust proxy", 1);

// Prevent software fingerprint disclosure
app.disable("x-powered-by");

// Global Security Headers Middleware
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'self' https://*.run.app https://*.google.com; base-uri 'self'; form-action 'self';"
  );
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  next();
});

// Enforce strict request body size limits to prevent Denial of Service attacks
app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true, limit: "64kb" }));

// Safe JSON parser error handler (prevents stack trace disclosure)
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      success: false,
      error: "صيغة بيانات JSON غير صالحة.",
    });
    return;
  }
  if (err?.type === "entity.too.large") {
    res.status(413).json({
      success: false,
      error: "حجم الطلب المرسل أكبر من الحد المسموح به (الحد الأقصى 64 كيلوبايت).",
    });
    return;
  }
  next(err);
});

const ordersFilePath = path.join(process.cwd(), "data", "orders.json");

function loadOrders(): ValidatedOrder[] {
  try {
    if (fs.existsSync(ordersFilePath)) {
      const data = fs.readFileSync(ordersFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("[Orders Store] Error reading orders file:", err);
  }
  return [];
}

function saveOrders(orders: ValidatedOrder[]): void {
  try {
    const dir = path.dirname(ordersFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    console.error("[Orders Store] Error writing orders file:", err);
  }
}

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-cache");
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// GET /api/orders: Strictly protected against unauthorized customer data leakage
app.get("/api/orders", (req: Request, res: Response) => {
  const adminKey = process.env.ADMIN_API_KEY?.trim();
  const authHeader = req.headers.authorization;

  // Only allow access if an explicit ADMIN_API_KEY is configured and matches the bearer token
  if (adminKey && authHeader === `Bearer ${adminKey}`) {
    const orders = loadOrders();
    res.json({ success: true, count: orders.length, orders });
    return;
  }

  // Deny public unauthenticated access
  res.status(403).json({
    success: false,
    error: "غير مصرح بالوصول إلى سجل الطلبات.",
  });
});

// Order creation callback
const onOrderSuccess = (order: ValidatedOrder) => {
  const existingOrders = loadOrders();
  existingOrders.unshift(order);
  saveOrders(existingOrders);
  console.log(
    `[Order Created & Telegram Notified] ID: ${order.id} - ${order.quantity}x ${order.selectedColor} (Phone: ${maskPhone(
      order.phone
    )}) - ${order.totalPrice} JOD`
  );
};

// POST order endpoints (supported on both /api/order and /api/orders)
app.all("/api/order", async (req: Request, res: Response) => {
  await handleOrderSubmission(req, res, onOrderSuccess);
});

app.all("/api/orders", async (req: Request, res: Response) => {
  if (req.method === "GET") {
    // Already handled above
    return;
  }
  await handleOrderSubmission(req, res, onOrderSuccess);
});

// Persistent asset storage helper
const ASSET_STORE_FILE = path.join(process.cwd(), "data", "assets_store.json");

function restoreStoredAssets() {
  try {
    if (!fs.existsSync(ASSET_STORE_FILE)) return;
    const raw = fs.readFileSync(ASSET_STORE_FILE, "utf-8");
    const store = JSON.parse(raw);
    if (!store || typeof store !== "object") return;

    const targetDirs = [
      path.join(process.cwd(), "public", "assets"),
      path.join(process.cwd(), "public", "images"),
      path.join(process.cwd(), "dist", "assets"),
      path.join(process.cwd(), "dist", "images"),
    ];

    for (const dir of targetDirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    for (const [filename, base64Data] of Object.entries(store)) {
      if (typeof base64Data === "string") {
        const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        const buffer = matches ? Buffer.from(matches[2], "base64") : Buffer.from(base64Data, "base64");
        for (const dir of targetDirs) {
          try {
            fs.writeFileSync(path.join(dir, filename), buffer);
          } catch {
            // ignore
          }
        }
      }
    }
  } catch (err) {
    console.warn("[Asset Restore] Could not restore assets", err);
  }
}

// Restore assets on boot
restoreStoredAssets();

// Secure asset upload helper (restricted to admin with secret key)
app.post("/api/upload-asset", (req: Request, res: Response) => {
  const assetSecret = process.env.ADMIN_ASSET_SECRET?.trim();
  const providedKey = req.headers["x-asset-key"];

  // Deny if not authorized or in production without key
  if (!assetSecret || providedKey !== assetSecret) {
    res.status(403).json({
      success: false,
      error: "غير مصرح برفع الملفات.",
    });
    return;
  }

  try {
    const { filename, base64Data } = req.body;
    if (!filename || !base64Data || typeof filename !== "string" || typeof base64Data !== "string") {
      res.status(400).json({ success: false, error: "بيانات الملف غير مكتملة." });
      return;
    }

    // Sanitize filename to prevent path traversal
    const safeFilename = path.basename(filename);
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".svg"];
    const ext = path.extname(safeFilename).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      res.status(400).json({ success: false, error: "نوع الملف غير مدعوم." });
      return;
    }

    const targetDirs = [
      path.join(process.cwd(), "public", "assets"),
      path.join(process.cwd(), "public", "images"),
    ];

    const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    const buffer = matches ? Buffer.from(matches[2], "base64") : Buffer.from(base64Data, "base64");

    for (const dir of targetDirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(path.join(dir, safeFilename), buffer);
    }

    res.json({ success: true, url: `/assets/${safeFilename}` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "فشل حفظ الملف." });
  }
});

// Serve static assets from public/ directory
app.use(
  express.static(path.join(process.cwd(), "public"), {
    dotfiles: "ignore",
    index: false,
  })
);

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { dotfiles: "ignore" }));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Hardened server running on port ${PORT}`);
  });
}

startServer();
