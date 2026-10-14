import "dotenv/config";

export interface QuantityTier {
  quantity: number;
  totalPrice: number;
  avgPrice: number;
  avgPriceFormatted: string;
  label: string;
}

export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 10;

export const QUANTITY_PRICE_TIERS: Record<number, QuantityTier> = {
  1: { quantity: 1, totalPrice: 88, avgPrice: 88, avgPriceFormatted: "88", label: "1 حبة" },
  2: { quantity: 2, totalPrice: 170, avgPrice: 85, avgPriceFormatted: "85", label: "2 حبتان" },
  3: { quantity: 3, totalPrice: 250, avgPrice: 83.33, avgPriceFormatted: "83.33", label: "3 حبات" },
  4: { quantity: 4, totalPrice: 330, avgPrice: 82.5, avgPriceFormatted: "82.5", label: "4 حبات" },
  5: { quantity: 5, totalPrice: 410, avgPrice: 82, avgPriceFormatted: "82", label: "5 حبات" },
  6: { quantity: 6, totalPrice: 490, avgPrice: 81.67, avgPriceFormatted: "81.67", label: "6 حبات" },
  7: { quantity: 7, totalPrice: 570, avgPrice: 81.43, avgPriceFormatted: "81.43", label: "7 حبات" },
  8: { quantity: 8, totalPrice: 650, avgPrice: 81.25, avgPriceFormatted: "81.25", label: "8 حبات" },
  9: { quantity: 9, totalPrice: 725, avgPrice: 80.56, avgPriceFormatted: "80.56", label: "9 حبات" },
  10: { quantity: 10, totalPrice: 800, avgPrice: 80, avgPriceFormatted: "80", label: "10 حبات" },
};

export interface OrderPayload {
  customerName?: unknown;
  phone?: unknown;
  governorate?: unknown;
  quantity?: unknown;
  selectedColor?: unknown;
  notes?: unknown;
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
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

export const ALLOWED_COLORS = ["برتقالي", "سكني", "أسود"] as const;
export const PRODUCT_NAME = "MAXTAB Ultimate 70 Pro 5G";

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
 * Redacts secrets from logs
 */
export function redactSecrets(message: string, token?: string): string {
  let clean = message;
  if (token && token.trim()) {
    clean = clean.split(token.trim()).join("[REDACTED_BOT_TOKEN]");
  }
  clean = clean.replace(/bot\d{8,11}:[a-zA-Z0-9_-]{30,45}/g, "bot[REDACTED_TOKEN]");
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
 * Converts Arabic-Indic numerals (٠-٩) to standard Latin numerals (0-9)
 */
export function normalizeArabicDigits(str: string): string {
  return String(str || "").replace(/[٠-٩]/g, (d) =>
    String("٠١٢٣٤٥٦٧٨٩".indexOf(d))
  );
}

/**
 * Validates the raw request payload strictly
 */
export function validateOrder(payload: any): ValidationResult {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { valid: false, error: "صيغة بيانات الطلب غير صالحة." };
  }

  // 1. Customer Name
  const rawName = typeof payload.customerName === "string" ? payload.customerName.trim() : "";
  if (!rawName || rawName.length < 2) {
    return {
      valid: false,
      error: "يرجى إدخال الاسم الكامل بشكل صحيح (ثنائي أو ثلاثي لتسهيل التسليم).",
    };
  }
  if (rawName.length > 100) {
    return {
      valid: false,
      error: "الاسم المدخل طويل جداً.",
    };
  }

  // 2. Phone Number (handles Arabic numerals, optional spaces, dashes, +)
  const normalizedPhone = normalizeArabicDigits(
    typeof payload.phone === "string" ? payload.phone : String(payload.phone || "")
  ).replace(/[\s\-()]/g, "");

  if (!normalizedPhone || normalizedPhone.length < 8) {
    return {
      valid: false,
      error: "يرجى إدخال رقم هاتف فعال للتواصل والتأكيد (مثال: 07XXXXXXXX).",
    };
  }
  if (normalizedPhone.length > 20) {
    return {
      valid: false,
      error: "رقم الهاتف المدخل طويل جداً.",
    };
  }
  if (!/^\+?[0-9]{8,18}$/.test(normalizedPhone)) {
    return {
      valid: false,
      error: "يرجى إدخال رقم هاتف صالح يحتوي على أرقام فقط (مثال: 07XXXXXXXX).",
    };
  }

  // 3. Governorate
  const governorate = typeof payload.governorate === "string" ? payload.governorate.trim() : "";
  if (!governorate || governorate.length < 2) {
    return { valid: false, error: "يرجى تحديد المحافظة لتسهيل التوصيل." };
  }

  // 4. Quantity (strictly 1 to 10)
  const rawQty = payload.quantity;
  if (rawQty === null || rawQty === undefined || rawQty === "") {
    return { valid: false, error: "يرجى تحديد كمية صحيحة بين 1 و 10 أجهزة فقط." };
  }
  const parsedQty = typeof rawQty === "number" ? rawQty : parseInt(String(rawQty).trim(), 10);
  if (isNaN(parsedQty) || !Number.isInteger(parsedQty) || parsedQty < MIN_QUANTITY || parsedQty > MAX_QUANTITY) {
    return { valid: false, error: "يرجى تحديد كمية صحيحة بين 1 و 10 أجهزة فقط." };
  }

  const tier = QUANTITY_PRICE_TIERS[parsedQty];
  if (!tier) {
    return { valid: false, error: "الكمية المحددة غير مدعومة ضمن جدول الأسعار (1 إلى 10 أجهزة فقط)." };
  }

  // 5. Selected Color
  const rawColor = typeof payload.selectedColor === "string" ? payload.selectedColor.trim() : "برتقالي";
  const color = (ALLOWED_COLORS.includes(rawColor as any) ? rawColor : "برتقالي") as "برتقالي" | "سكني" | "أسود";

  // 6. Notes
  let notes = typeof payload.notes === "string" ? payload.notes.trim() : "";
  if (notes.length > 500) {
    notes = notes.slice(0, 500);
  }

  const orderId = `MAX-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const order: ValidatedOrder = {
    id: orderId,
    customerName: rawName,
    phone: normalizedPhone,
    governorate,
    quantity: parsedQty,
    selectedColor: color,
    notes,
    product: PRODUCT_NAME,
    price: tier.avgPrice,
    totalPrice: tier.totalPrice,
    currency: "JOD",
    timestamp: new Date().toISOString(),
    orderStatus: "New",
  };

  return { valid: true, order };
}

/**
 * Sends Telegram notification using official Telegram Bot API sendMessage.
 */
export async function sendTelegramOrderNotification(
  order: ValidatedOrder
): Promise<{ ok: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!botToken || !chatId) {
    console.error("[Telegram Error] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing from server environment.");
    return {
      ok: false,
      error: "إعدادات إشعار تيليجرام غير مهيأة على الخادم. يرجى مراجعة إدارة الموقع.",
    };
  }

  const notesHtml = order.notes ? escapeTelegramHtml(order.notes) : "لا توجد ملاحظات";
  const notesPlain = order.notes ? order.notes : "لا توجد ملاحظات";

  const htmlMessage = [
    `🛒 <b>طلب جديد - MAXTAB</b>`,
    ``,
    `🆔 <b>رقم الطلب:</b> <code>${escapeTelegramHtml(order.id)}</code>`,
    `👤 <b>الاسم:</b> ${escapeTelegramHtml(order.customerName)}`,
    `📞 <b>الهاتف:</b> <code>${escapeTelegramHtml(order.phone)}</code>`,
    `📍 <b>المحافظة:</b> ${escapeTelegramHtml(order.governorate)}`,
    `📦 <b>الكمية:</b> ${order.quantity} جهاز`,
    `🎨 <b>اللون:</b> ${escapeTelegramHtml(order.selectedColor)}`,
    `📝 <b>الملاحظات:</b>`,
    `${notesHtml}`,
    ``,
    `📱 <b>المنتج:</b> ${order.product}`,
    `💰 <b>معدل سعر الحبة:</b> ${order.price} دينار`,
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
    `📦 الكمية: ${order.quantity} جهاز`,
    `🎨 اللون: ${order.selectedColor}`,
    `📝 الملاحظات:`,
    `${notesPlain}`,
    ``,
    `📱 المنتج: ${order.product}`,
    `💰 معدل سعر الحبة: ${order.price} دينار`,
    `💵 الإجمالي: ${order.totalPrice} دينار`,
    `🔵 الحالة: ${order.orderStatus}`,
  ].join("\n");

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: "HTML",
      }),
      signal: AbortSignal.timeout(10000),
    });

    const data: any = await response.json().catch(() => null);

    if (response.ok && data?.ok) {
      console.log(`[Telegram Success] Delivered order notification for ID ${order.id}`);
      return { ok: true };
    }

    // Fallback if HTML parse mode had an issue
    if (response.status === 400) {
      console.warn("[Telegram Notice] Retrying message as plain text...");
      const fallbackResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: plainMessage,
        }),
        signal: AbortSignal.timeout(8000),
      });
      const fallbackData: any = await fallbackResponse.json().catch(() => null);
      if (fallbackResponse.ok && fallbackData?.ok) {
        console.log(`[Telegram Success] Delivered plain text for ID ${order.id}`);
        return { ok: true };
      }
    }

    const safeErr = redactSecrets(data?.description || `HTTP ${response.status}`, botToken);
    console.error(`[Telegram Error] API rejected message: ${safeErr}`);
    return {
      ok: false,
      error: "تعذر إرسال الإشعار إلى تيليجرام حالياً. يرجى المحاولة بعد قليل.",
    };
  } catch (err: any) {
    const safeMsg = redactSecrets(err instanceof Error ? err.message : String(err), botToken);
    console.error("[Telegram Network Error]", safeMsg);
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
  const sendJson = (statusCode: number, payload: any) => {
    if (typeof res.setHeader === "function") {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    if (typeof res.status === "function" && typeof res.json === "function") {
      return res.status(statusCode).json(payload);
    }

    res.statusCode = statusCode;
    res.end(JSON.stringify(payload));
  };

  // Preflight
  if (req.method === "OPTIONS") {
    if (typeof res.status === "function") {
      res.status(204).end();
    } else {
      res.statusCode = 204;
      res.end();
    }
    return;
  }

  // Reject methods other than POST
  if (req.method !== "POST") {
    sendJson(405, {
      success: false,
      error: "الطريقة غير مسموح بها. يقبل هذا المسار طلبات POST فقط.",
    });
    return;
  }

  // Safe body extraction
  let body = req.body;
  if (!body && typeof req.on === "function" && !req.readableEnded) {
    try {
      const chunks: any[] = [];
      let totalBytes = 0;
      const MAX_BYTES = 64 * 1024;

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
        body = JSON.parse(rawText);
      }
    } catch (parseErr) {
      console.warn("[Body Read Error]", parseErr);
      sendJson(400, { success: false, error: "صيغة بيانات JSON غير صالحة." });
      return;
    }
  } else if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      sendJson(400, { success: false, error: "صيغة بيانات JSON غير صالحة." });
      return;
    }
  }

  // Validation
  const validation = validateOrder(body);
  if (validation.valid === false) {
    sendJson(400, { success: false, error: validation.error });
    return;
  }

  const { order } = validation;

  // Telegram Notification
  const telegramResult = await sendTelegramOrderNotification(order);
  if (!telegramResult.ok) {
    sendJson(502, {
      success: false,
      error: telegramResult.error || "تعذر إرسال الطلب إلى تيليجرام. يرجى المحاولة مرة أخرى.",
    });
    return;
  }

  // Local persistence callback if registered (in server.ts)
  if (onSuccess) {
    try {
      onSuccess(order);
    } catch (err) {
      console.warn("[Order Persistence Warning]", err);
    }
  }

  // Success response
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

/**
 * Vercel Serverless Function Entry Point for /api/order
 */
export default async function handler(req: any, res: any): Promise<void> {
  await handleOrderSubmission(req, res);
}
