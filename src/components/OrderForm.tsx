import React, { useState, useRef } from "react";
import { CheckCircle2, AlertCircle, ShoppingBag, Plus, Minus, Send, Phone, User, MapPin, Tag } from "lucide-react";
import {
  PRODUCT_PRICE,
  PRODUCT_CURRENCY,
  PRODUCT_CURRENCY_SHORT,
  JORDAN_GOVERNORATES,
  QUANTITY_PRICE_TIERS,
  MIN_QUANTITY,
  MAX_QUANTITY,
} from "../data/productData";
import { OrderFormData, Order } from "../types";
import { getColorImageInfo } from "../utils/assetManager";
import { ProductImageDisplay } from "./ProductImageDisplay";

export const OrderForm: React.FC = () => {
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: "",
    phone: "",
    governorate: JORDAN_GOVERNORATES[0],
    quantity: 1,
    selectedColor: "برتقالي",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const submitErrorRef = useRef<HTMLDivElement | null>(null);

  const colors = [
    {
      id: "برتقالي",
      name: "البرتقلي الترند",
      badge: "اللون المميز",
      colorHex: "#DE6426",
    },
    {
      id: "سكني",
      name: "سلفر",
      badge: "كلاسيكي",
      colorHex: "#8A9098",
    },
    {
      id: "أسود",
      name: "رمادي",
      badge: "أنيق",
      colorHex: "#1E2022",
    },
  ] as const;

  const handleColorChange = (color: "برتقالي" | "سكني" | "أسود") => {
    setFormData((prev) => ({ ...prev, selectedColor: color }));
  };

  const handleQuantityChange = (delta: number) => {
    setFormData((prev) => ({
      ...prev,
      quantity: Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, prev.quantity + delta)),
    }));
  };

  const handleSelectQuantity = (qty: number) => {
    if (qty >= MIN_QUANTITY && qty <= MAX_QUANTITY) {
      setFormData((prev) => ({ ...prev, quantity: qty }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. Validate customer name
    const cleanName = formData.customerName.trim();
    if (!cleanName || cleanName.length < 2) {
      const msg = "يرجى كتابة الاسم الكامل (الاسم واللقب على الأقل) لتسليم الطلب.";
      setErrorMsg(msg);
      console.warn("[OrderForm Validation Failed] Invalid name:", cleanName);
      setTimeout(() => {
        submitErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }

    // 2. Validate phone number (normalize Arabic digits, allow optional spaces, dashes, or +962)
    const rawPhone = formData.phone.trim();
    const normalizedDigits = rawPhone.replace(/[٠-٩]/g, (d) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(d))
    );
    const cleanPhone = normalizedDigits.replace(/[\s\-()]/g, "");
    if (!cleanPhone || cleanPhone.length < 8) {
      const msg = "يرجى إدخال رقم هاتف فعال داخل الأردن للتواصل معك والتأكيد (مثال: 07XXXXXXXX).";
      setErrorMsg(msg);
      console.warn("[OrderForm Validation Failed] Invalid phone:", rawPhone);
      setTimeout(() => {
        submitErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }

    // 3. Validate governorate
    if (!formData.governorate) {
      const msg = "يرجى تحديد المحافظة لتسهيل التوصيل.";
      setErrorMsg(msg);
      return;
    }

    // 4. Validate quantity (strictly between 1 and 10)
    if (formData.quantity < MIN_QUANTITY || formData.quantity > MAX_QUANTITY) {
      const msg = "يرجى تحديد كمية صحيحة بين 1 و 10 أجهزة فقط.";
      setErrorMsg(msg);
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      customerName: cleanName,
      phone: cleanPhone,
      governorate: formData.governorate,
      quantity: formData.quantity,
      selectedColor: formData.selectedColor,
      notes: formData.notes ? formData.notes.trim() : "",
    };

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      let data: any = null;
      const rawText = await response.text();
      try {
        data = JSON.parse(rawText);
      } catch {
        // Safe fallback
      }

      if (!response.ok || !data?.success) {
        const errorMessage =
          data?.error ||
          `حدث خطأ أثناء إرسال الطلب (${response.status}). يرجى المحاولة مرة أخرى.`;
        throw new Error(errorMessage);
      }

      // Reset form fields back to normal clean state
      setFormData({
        customerName: "",
        phone: "",
        governorate: JORDAN_GOVERNORATES[0],
        quantity: 1,
        selectedColor: "برتقالي",
        notes: "",
      });
      setErrorMsg(null);
      setSubmittedOrder(data.order);

      // Scroll to order confirmation section
      const section = document.getElementById("order-form");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err: any) {
      console.error("[OrderForm Submission Exception]", err);
      const displayMsg =
        err?.message || "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.";
      setErrorMsg(displayMsg);
      setTimeout(() => {
        submitErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentTier = QUANTITY_PRICE_TIERS[formData.quantity] || QUANTITY_PRICE_TIERS[1];
  const totalPrice = currentTier.totalPrice;
  const singleItemBaseTotal = formData.quantity * PRODUCT_PRICE;
  const savings = singleItemBaseTotal - currentTier.totalPrice;

  return (
    <section id="order-form" className="bg-[#FAF8F5] py-14 md:py-24 border-b border-[#E8E4DC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF2EA] text-[#DE6426] text-xs font-bold rounded-full mb-3 border border-[#FAD8C4]">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>طلب مباشر بدون تعقيد</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1A1D20] mb-3">
            اطلب MAXTAB الآن
          </h2>
          <p className="text-sm sm:text-base text-[#525861]">
            الدفع نقداً عند الاستلام بعد فحص الشحنة • التوصيل متاح لجميع مدن ومحافظات الأردن.
          </p>
        </div>

        {/* Success Card */}
        {submittedOrder ? (
          <div className="bg-[#FFFFFF] rounded-2xl border-2 border-[#52B788] p-6 sm:p-10 shadow-md text-center animate-fade-in">
            <div className="w-16 h-16 bg-[#EBF8F2] text-[#2D6A4F] rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-[#B7E4C7]">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-[#1A1D20] mb-3">
              تم إرسال طلبك بنجاح ✅
            </h3>

            <p className="text-base sm:text-lg text-[#3E454F] mb-6 max-w-lg mx-auto font-medium">
              شكرًا لطلبك من MAXTAB، سنتواصل معك قريبًا لتأكيد الطلب.
            </p>

            {/* Order Summary Details Box */}
            <div className="bg-[#FAF8F5] rounded-xl p-5 border border-[#E5DFC8] max-w-md mx-auto text-right mb-6 text-sm">
              <div className="flex justify-between py-2 border-b border-[#EAE5D8]">
                <span className="text-[#6B7280]">رقم الطلب المرجعي:</span>
                <span className="font-mono font-bold text-[#1A1D20]">{submittedOrder.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EAE5D8]">
                <span className="text-[#6B7280]">الاسم:</span>
                <span className="font-bold text-[#1A1D20]">{submittedOrder.customerName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EAE5D8]">
                <span className="text-[#6B7280]">المحافظة:</span>
                <span className="font-bold text-[#1A1D20]">{submittedOrder.governorate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EAE5D8]">
                <span className="text-[#6B7280]">اللون المختار:</span>
                <span className="font-bold text-[#DE6426]">
                  {colors.find((c) => c.id === submittedOrder.selectedColor)?.name || submittedOrder.selectedColor}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EAE5D8]">
                <span className="text-[#6B7280]">الكمية:</span>
                <span className="font-bold text-[#1A1D20]">
                  {submittedOrder.quantity} {submittedOrder.quantity === 1 ? "جهاز" : "أجهزة"}
                  {submittedOrder.quantity > 1 && (
                    <span className="text-xs text-[#525861] font-normal mr-1">
                      (بمعدل {(submittedOrder.totalPrice / submittedOrder.quantity).toFixed(2).replace(/\.00$/, "")} د.أ للحبة)
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-bold text-[#1A1D20]">المبلغ الإجمالي عند الاستلام:</span>
                <span className="font-black text-lg text-[#DE6426]">
                  {submittedOrder.totalPrice} {PRODUCT_CURRENCY}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSubmittedOrder(null);
                setFormData({
                  customerName: "",
                  phone: "",
                  governorate: JORDAN_GOVERNORATES[0],
                  quantity: 1,
                  selectedColor: "برتقالي",
                  notes: "",
                });
              }}
              className="px-6 py-2.5 bg-[#F0EEEA] hover:bg-[#E4DFD5] text-[#1A1D20] text-sm font-bold rounded-lg transition-colors border border-[#D5CDBD]"
            >
              تقديم طلب جديد
            </button>
          </div>
        ) : (
          /* Real Form Container */
          <div className="bg-[#FFFFFF] rounded-2xl border-2 border-[#E5DFC8] p-6 sm:p-10 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Banner */}
              {errorMsg && (
                <div className="p-4 rounded-xl bg-[#FFF1F0] border border-[#FFCCC7] flex items-start gap-3 text-red-800 text-sm font-medium">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Color Selector Section */}
              <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#E5DFC8]">
                <label className="block text-base font-bold text-[#1A1D20] mb-1">
                  اختر اللون *
                </label>
                <p className="text-xs text-[#6B7280] mb-3">
                  حدد اللون المفضل لديك (لون البرتقلي الترند هو اللون الأساسي المعتمد في التصوير)
                </p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {colors.map((color) => {
                    const isSelected = formData.selectedColor === color.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => handleColorChange(color.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all text-center ${
                          isSelected
                            ? "border-[#DE6426] bg-[#FFFFFF] shadow-sm ring-2 ring-[#DE6426]/25"
                            : "border-[#DCD6C7] bg-[#FAF8F5] hover:border-[#BDB5A2]"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="w-4 h-4 rounded-full border border-black/20"
                            style={{ backgroundColor: color.colorHex }}
                          />
                          <span className="text-base font-bold text-[#1A1D20]">
                            {color.name}
                          </span>
                        </div>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            isSelected
                              ? "bg-[#FDF2EA] text-[#C24C12]"
                              : "bg-[#EFECE5] text-[#6A7079]"
                          }`}
                        >
                          {color.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Color preview card respecting authentic photography rules */}
                {(() => {
                  const colorInfo = getColorImageInfo(formData.selectedColor);
                  return (
                    <div className="p-3 sm:p-4 rounded-xl bg-[#FFFFFF] border border-[#E5DFC8] flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-[#F0EEEA] border border-[#E2DDD0]">
                        <ProductImageDisplay
                          key={colorInfo.imageId}
                          imageId={colorInfo.imageId}
                          className="w-full h-full"
                          aspectRatio="aspect-square"
                        />
                      </div>
                      <div className="text-right flex-1 w-full">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="inline-block px-2.5 py-0.5 text-xs font-bold text-[#DE6426] bg-[#FDF2EA] rounded-md border border-[#FAD8C4]">
                            {colorInfo.badgeText}
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-[#1A1D20] mb-1">
                          تابلت MAXTAB Ultimate 70 Pro — لون {colorInfo.colorName}
                        </h4>
                        <p className="text-xs text-[#525861] leading-relaxed">
                          {colorInfo.description}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 2. Customer Name */}
              <div>
                <label
                  htmlFor="customerName"
                  className="block text-base font-bold text-[#1A1D20] mb-2"
                >
                  الاسم الكامل *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="customerName"
                    required
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    placeholder="أدخل اسمك الثلاثي أو الرباعي"
                    className="w-full h-13 px-4 pl-11 text-base text-[#1A1D20] bg-[#FAF8F5] border border-[#D5CDBD] rounded-xl focus:bg-white focus:outline-none focus:border-[#DE6426] focus:ring-2 focus:ring-[#DE6426]/20 transition-colors"
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C939E] pointer-events-none" />
                </div>
              </div>

              {/* 3. Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-base font-bold text-[#1A1D20] mb-2"
                >
                  رقم الهاتف *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    required
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="07XXXXXXXX"
                    className="w-full h-13 px-4 pl-11 text-base text-[#1A1D20] bg-[#FAF8F5] border border-[#D5CDBD] rounded-xl text-right focus:bg-white focus:outline-none focus:border-[#DE6426] focus:ring-2 focus:ring-[#DE6426]/20 transition-colors"
                  />
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C939E] pointer-events-none" />
                </div>
                <span className="block text-xs text-[#6B7280] mt-1">
                  سنقوم بالاتصال بك لتأكيد موعد ومكان التوصيل قبل انطلاق المندوب.
                </span>
              </div>

              {/* 4. Governorate Dropdown */}
              <div>
                <label
                  htmlFor="governorate"
                  className="block text-base font-bold text-[#1A1D20] mb-2"
                >
                  المحافظة *
                </label>
                <div className="relative">
                  <select
                    id="governorate"
                    required
                    value={formData.governorate}
                    onChange={(e) =>
                      setFormData({ ...formData, governorate: e.target.value })
                    }
                    className="w-full h-13 px-4 pl-11 text-base text-[#1A1D20] bg-[#FAF8F5] border border-[#D5CDBD] rounded-xl focus:bg-white focus:outline-none focus:border-[#DE6426] focus:ring-2 focus:ring-[#DE6426]/20 transition-colors cursor-pointer appearance-none"
                  >
                    {JORDAN_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C939E] pointer-events-none" />
                </div>
              </div>

              {/* 5. Quantity Counter & Tier Pricing */}
              <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#E5DFC8]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <label className="block text-base font-bold text-[#1A1D20]">
                      الكمية وعروض الأسعار *
                    </label>
                    <p className="text-xs text-[#6B7280]">
                      الحد الأدنى 1 والحد الأقصى 10 أجهزة • خصم إضافي عند زيادة الكمية
                    </p>
                  </div>

                  {/* Quantity Counter */}
                  <div className="inline-flex items-center self-start sm:self-auto bg-[#FFFFFF] border border-[#D5CDBD] rounded-xl p-1 shadow-xs">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={formData.quantity <= MIN_QUANTITY}
                      className="w-10 h-10 flex items-center justify-center text-[#1A1D20] hover:bg-[#F0EEEA] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="إنقاص الكمية"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="w-12 text-center font-black text-xl text-[#1A1D20]">
                      {formData.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleQuantityChange(1)}
                      disabled={formData.quantity >= MAX_QUANTITY}
                      className="w-10 h-10 flex items-center justify-center text-[#1A1D20] hover:bg-[#F0EEEA] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="زيادة الكمية"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Current Active Selection Banner */}
                <div className="p-3.5 bg-[#FFFFFF] rounded-xl border border-[#E5DFC8] mb-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-extrabold text-[#1A1D20] text-base">
                        {currentTier.label}:
                      </span>
                      <span className="font-black text-xl text-[#DE6426]">
                        {currentTier.totalPrice} {PRODUCT_CURRENCY_SHORT}
                      </span>
                    </div>
                    <span className="text-xs text-[#525861] block mt-0.5">
                      للحبة {currentTier.avgPriceFormatted} {PRODUCT_CURRENCY_SHORT} بالمعدل (شامل الملحقات والتوصيل)
                    </span>
                  </div>

                  {savings > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2D6A4F] bg-[#EBF8F2] px-3 py-1.5 rounded-lg border border-[#B7E4C7]">
                      <Tag className="w-3.5 h-3.5" />
                      <span>توفير {savings} دينار</span>
                    </span>
                  )}
                </div>

                {/* Quick Selection Grid (Tiers 1 to 10) */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {Object.values(QUANTITY_PRICE_TIERS).map((tier) => {
                    const isSelected = formData.quantity === tier.quantity;
                    const tierSavings = (tier.quantity * PRODUCT_PRICE) - tier.totalPrice;
                    return (
                      <button
                        key={tier.quantity}
                        type="button"
                        onClick={() => handleSelectQuantity(tier.quantity)}
                        className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-[#DE6426] bg-[#FFFFFF] ring-2 ring-[#DE6426]/30 shadow-sm"
                            : "border-[#DCD6C7] bg-[#FFFFFF]/80 hover:bg-[#FFFFFF] hover:border-[#BDB5A2]"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className={`text-xs font-extrabold ${isSelected ? "text-[#1A1D20]" : "text-[#2D3136]"}`}>
                            {tier.label}
                          </span>
                          <span className="text-xs font-black text-[#DE6426]">
                            {tier.totalPrice} د.أ
                          </span>
                        </div>
                        <div className="flex items-center justify-between w-full text-[11px] text-[#6B7280]">
                          <span>{tier.avgPriceFormatted} د.أ/حبة</span>
                          {tierSavings > 0 && (
                            <span className="text-[10px] font-bold text-[#2D6A4F] bg-[#EBF8F2] px-1 rounded">
                              وفر {tierSavings}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Notes (Optional) */}
              <div>
                <label
                  htmlFor="notes"
                  className="block text-base font-bold text-[#1A1D20] mb-2"
                >
                  ملاحظات إضافية (اختياري)
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="أي تفاصيل خاصة بالعنوان أو وقت الاستلام المفضل..."
                  className="w-full p-4 text-sm text-[#1A1D20] bg-[#FAF8F5] border border-[#D5CDBD] rounded-xl focus:bg-white focus:outline-none focus:border-[#DE6426] focus:ring-2 focus:ring-[#DE6426]/20 transition-colors"
                />
              </div>

              {/* Price Calculation Summary */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFC8] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#6B7280] block">المجموع النهائي للدفع عند الاستلام</span>
                  <span className="text-xs font-semibold text-[#2D3136]">
                    {currentTier.label} — لون {colors.find((c) => c.id === formData.selectedColor)?.name || formData.selectedColor}
                  </span>
                  <span className="block text-xs text-[#525861] mt-0.5 font-medium">
                    معدل سعر الجهاز: {currentTier.avgPriceFormatted} {PRODUCT_CURRENCY_SHORT}
                    {savings > 0 && (
                      <span className="text-[#2D6A4F] font-bold mr-1.5">
                        (إجمالي التوفير: {savings} د.أ)
                      </span>
                    )}
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-2xl sm:text-3xl font-black text-[#DE6426]">
                    {totalPrice}
                  </span>
                  <span className="text-sm font-bold text-[#1A1D20] mr-1">
                    {PRODUCT_CURRENCY}
                  </span>
                </div>
              </div>

              {/* Error Notice Directly Above Submit Button */}
              {errorMsg && (
                <div
                  ref={submitErrorRef}
                  className="p-4 rounded-xl bg-[#FFF1F0] border-2 border-[#FFCCC7] flex items-start gap-3 text-red-800 text-sm font-medium animate-fade-in"
                  role="alert"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1 text-right">
                    <p className="font-bold text-red-900">{errorMsg}</p>
                    <p className="text-xs text-red-700 mt-1">
                      يرجى مراجعة البيانات المدخلة والمحاولة مرة أخرى.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-15 bg-[#DE6426] hover:bg-[#C24C12] text-white text-lg font-black rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-wait"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>جاري إرسال الطلب...</span>
                  </span>
                ) : (
                  <>
                    <span>إرسال الطلب</span>
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-xs text-[#6B7280]">
                  بالضغط على إرسال الطلب، تؤكد رغبتك بشراء المنتج والتواصل معك هاتفياً.
                </span>
              </div>

            </form>
          </div>
        )}

      </div>
    </section>
  );
};
