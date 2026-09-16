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

const ALLOWED_COLORS = ["برتقالي", "سكني", "أسود"] as const;
const FIXED_PRICE_JOD = 88;
const PRODUCT_NAME = "MAXTAB Ultimate 70 PRO 5G";

function escapeTelegramHtml(str: string): string {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export type ValidationResult =
  | { valid: true; order: ValidatedOrder; error?: never }
  | { valid: false; error: string; order?: never };

function validateOrder(payload: OrderPayload): ValidationResult {
  if (!payload || typeof payload !== "object") {
    return { valid: false, error: "بيانات الطلب غير صالحة." };
  }

  const name = typeof payload.customerName === "string" ? payload.customerName.trim() : "";
  if (!name || name.length < 2) {
    return {
      valid: false,
      error: "يرجى إدخال الاسم الكامل بشكل صحيح (ثلاثي أو رباعي لتسهيل التسليم).",
    };
  }

  const rawPhone = typeof payload.phone === "string" ? payload.phone.trim() : "";
  if (!rawPhone || rawPhone.length < 8) {
    return {
      valid: false,
      error: "يرجى إدخال رقم هاتف فعال للتواصل والتأكيد (مثال: 07XXXXXXXX).",
    };
  }

  const governorate = typeof payload.governorate === "string" ? payload.governorate.trim() : "";
  if (!governorate) {
    return { valid: false, error: "يرجى تحديد المحافظة." };
  }

  const rawQty = payload.quantity;
  const parsedQty = typeof rawQty === "number" ? rawQty : parseInt(String(rawQty || "1"), 10);
  if (isNaN(parsedQty) || !Number.isInteger(parsedQty) || parsedQty < 1) {
    return { valid: false, error: "يرجى تحديد كمية صحيحة (1 أو أكثر)." };
  }

  const color = typeof payload.selectedColor === "string" ? payload.selectedColor.trim() : "";
  if (!ALLOWED_COLORS.includes(color as any)) {
    return {
      valid: false,
      error: "اللون المختار غير صالح. الألوان المتاحة هي: برتقالي، سكني، أسود.",
    };
  }

  const notes = typeof payload.notes === "string" ? payload.notes.trim() : "";
  const orderId = `MAX-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const order: ValidatedOrder = {
    id: orderId,
    customerName: name,
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

async function sendTelegramOrderNotification(order: ValidatedOrder): Promise<{ ok: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!botToken || !chatId) {
    console.error("[Telegram Error] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing from environment variables.");
    return {
      ok: false,
      error: "إعدادات إشعار تيليجرام غير مكتملة على الخادم (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID).",
    };
  }

  const notesHtml = order.notes ? escapeTelegramHtml(order.notes) : "لا توجد ملاحظات";
  const notesPlain = order.notes ? order.notes : "لا توجد ملاحظات";

  const htmlMessage = [
    `🛒 <b>طلب جديد - MAXTAB</b>`,
    ``,
    `👤 <b>الاسم:</b> ${escapeTelegramHtml(order.customerName)}`,
    ``,
    `📞 <b>الهاتف:</b> <code>${escapeTelegramHtml(order.phone)}</code>`,
    ``,
    `📍 <b>المحافظة:</b> ${escapeTelegramHtml(order.governorate)}`,
    ``,
    `📦 <b>الكمية:</b> ${order.quantity}`,
    ``,
    `🎨 <b>اللون:</b> ${escapeTelegramHtml(order.selectedColor)}`,
    ``,
    `📝 <b>الملاحظات:</b>`,
    `${notesHtml}`,
    ``,
    `📱 <b>المنتج:</b> ${order.product}`,
    ``,
    `💰 <b>سعر الوحدة:</b> ${order.price} دينار`,
    ``,
    `💵 <b>الإجمالي:</b> <b>${order.totalPrice} دينار</b>`,
    ``,
    `🔵 <b>الحالة:</b> ${order.orderStatus}`,
  ].join("\n");

  const plainMessage = [
    `🛒 طلب جديد - MAXTAB`,
    ``,
    `👤 الاسم: ${order.customerName}`,
    ``,
    `📞 الهاتف: ${order.phone}`,
    ``,
    `📍 المحافظة: ${order.governorate}`,
    ``,
    `📦 الكمية: ${order.quantity}`,
    ``,
    `🎨 اللون: ${order.selectedColor}`,
    ``,
    `📝 الملاحظات:`,
    `${notesPlain}`,
    ``,
    `📱 المنتج: ${order.product}`,
    ``,
    `💰 سعر الوحدة: ${order.price} دينار`,
    ``,
    `💵 الإجمالي: ${order.totalPrice} دينار`,
    ``,
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
    });

    const data: any = await response.json().catch(() => null);

    if (response.ok && data?.ok) {
      console.log(`[Telegram Success] Order notification sent for ${order.id}`);
      return { ok: true };
    }

    // Fallback to plain text if HTML parsing failed
    const fallbackResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: plainMessage,
      }),
    });

    const fallbackData: any = await fallbackResponse.json().catch(() => null);

    if (fallbackResponse.ok && fallbackData?.ok) {
      console.log(`[Telegram Success] Plain text order notification sent for ${order.id}`);
      return { ok: true };
    }

    const errorDetail = fallbackData?.description || data?.description || `HTTP ${fallbackResponse.status}`;
    return {
      ok: false,
      error: `فشل إرسال الإشعار إلى تيليجرام: ${errorDetail}`,
    };
  } catch (err: any) {
    return {
      ok: false,
      error: "تعذر الاتصال بخوادم تيليجرام. يرجى التحقق من الاتصال بالإنترنت.",
    };
  }
}

export default async function handler(req: any, res: any): Promise<void> {
  const sendJson = (statusCode: number, payload: any) => {
    if (typeof res.status === "function" && typeof res.json === "function") {
      return res.status(statusCode).json(payload);
    }
    res.statusCode = statusCode;
    if (typeof res.setHeader === "function") {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
    }
    res.end(JSON.stringify(payload));
  };

  // CORS headers
  if (typeof res.setHeader === "function") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  if (req.method === "OPTIONS") {
    if (typeof res.status === "function") {
      res.status(200).end();
    } else {
      res.statusCode = 200;
      res.end();
    }
    return;
  }

  if (req.method !== "POST") {
    if (typeof res.setHeader === "function") {
      res.setHeader("Allow", ["POST"]);
    }
    sendJson(405, {
      success: false,
      error: "الطريقة غير مسموح بها (Method Not Allowed)",
    });
    return;
  }

  // Parse body safely
  let body = req.body;
  if (!body && typeof req.on === "function") {
    try {
      const chunks: any[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
      }
      const rawText = Buffer.concat(chunks).toString("utf-8");
      if (rawText) {
        try {
          body = JSON.parse(rawText);
        } catch {
          body = rawText;
        }
      }
    } catch {
      // ignore
    }
  } else if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      // ignore
    }
  }

  // 1. Validation
  const validation = validateOrder(body);
  if (!validation.valid) {
    sendJson(400, { success: false, error: validation.error });
    return;
  }

  const { order } = validation;

  // 2. Telegram Notification
  const telegramResult = await sendTelegramOrderNotification(order);

  if (!telegramResult.ok) {
    sendJson(502, {
      success: false,
      error: telegramResult.error || "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.",
    });
    return;
  }

  // 3. Success response
  sendJson(200, {
    success: true,
    message: "تم إرسال طلبك بنجاح ✅",
    orderId: order.id,
    order,
  });
}
