import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { handleOrderSubmission } from "./src/server/orderService";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

const ordersFilePath = path.join(process.cwd(), "data", "orders.json");

interface Order {
  id: string;
  customerName: string;
  phone: string;
  governorate: string;
  quantity: number;
  selectedColor: string;
  notes?: string;
  product: string;
  price: number;
  totalPrice: number;
  currency: string;
  timestamp: string;
  orderStatus: "New" | "Confirmed" | "Processing" | "Delivered" | "Cancelled";
}

function loadOrders(): Order[] {
  try {
    if (fs.existsSync(ordersFilePath)) {
      const data = fs.readFileSync(ordersFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading orders file:", err);
  }
  return [];
}

function saveOrders(orders: Order[]): void {
  try {
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing orders file:", err);
  }
}

// API Routes
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// GET all orders
app.get("/api/orders", (_req: Request, res: Response) => {
  const orders = loadOrders();
  res.json({ success: true, count: orders.length, orders });
});

// POST a new order (compatible with both /api/order and /api/orders)
const onOrderSuccess = (order: any) => {
  const existingOrders = loadOrders();
  existingOrders.unshift(order);
  saveOrders(existingOrders);
  console.log(
    `[Order Created & Notified via Telegram] ID: ${order.id} - ${order.customerName} - ${order.quantity}x ${order.selectedColor} - ${order.totalPrice} JOD`
  );
};

app.all("/api/order", async (req: Request, res: Response) => {
  await handleOrderSubmission(req, res, onOrderSuccess);
});

app.post("/api/orders", async (req: Request, res: Response) => {
  await handleOrderSubmission(req, res, onOrderSuccess);
});

// Image upload helper to allow saving real uploaded photos to both /public/assets/ and /public/images/
app.post("/api/upload-asset", (req: Request, res: Response) => {
  try {
    const { filename, base64Data, aliasNames = [] } = req.body;
    if (!filename || !base64Data) {
      res.status(400).json({ success: false, error: "Missing filename or base64Data" });
      return;
    }

    const targetDirs = [
      path.join(process.cwd(), "public", "assets"),
      path.join(process.cwd(), "public", "images"),
      path.join(process.cwd(), "dist", "assets"),
      path.join(process.cwd(), "dist", "images"),
    ];

    for (const dir of targetDirs) {
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      } catch {
        // ignore if cannot create dist during dev
      }
    }

    const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    const buffer = matches ? Buffer.from(matches[2], "base64") : Buffer.from(base64Data, "base64");

    const safeFilename = path.basename(filename);

    const allNames = new Set<string>();
    allNames.add(safeFilename);
    if (Array.isArray(aliasNames)) {
      for (const alias of aliasNames) {
        if (alias && typeof alias === "string") {
          allNames.add(path.basename(alias));
        }
      }
    }

    for (const dir of targetDirs) {
      if (fs.existsSync(dir)) {
        for (const name of allNames) {
          try {
            fs.writeFileSync(path.join(dir, name), buffer);
          } catch (e) {
            console.warn(`Failed to write image to ${dir}/${name}`, e);
          }
        }
      }
    }

    console.log(`[Asset Saved] Saved ${safeFilename} to assets and images directories`);
    res.json({ success: true, url: `/assets/${safeFilename}` });
  } catch (err: any) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve static assets from public/ directory
app.use(express.static(path.join(process.cwd(), "public")));

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
