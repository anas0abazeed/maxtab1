import React from "react";
import { ArrowLeft, Check, ShieldCheck, Truck, PackageOpen } from "lucide-react";
import { ProductImageDisplay } from "./ProductImageDisplay";
import { PRODUCT_PRICE, PRODUCT_CURRENCY } from "../data/productData";

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-8 pb-14 md:pt-12 md:pb-20 border-b border-[#E8E4DC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Right Column: Text & Value proposition (RTL) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Tag / Category Badge */}
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 bg-[#F0EEEA] border border-[#E0DBD0] rounded-full text-xs font-semibold text-[#2D3136] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#DE6426]" />
              <span>جهاز لوحي متكامل للعمل والدراسة والمنزل</span>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1D20] tracking-tight leading-[1.2] mb-4">
              MAXTAB <span className="text-[#DE6426]">Ultimate 70 Pro</span> 5G
            </h1>

            {/* Short Benefit-focused description */}
            <p className="text-base sm:text-lg text-[#4A5058] leading-relaxed mb-6 max-w-2xl font-normal">
              شاشة كبيرة 12 بوصة مريحة للعين، وسعة تخزين هائلة 1TB مع ذاكرة 16GB، وشبكة 5G مزدوجة.
              يصلك في صندوق فاخر مع مجموعة متكاملة تضم لوحة مفاتيح وماوس وقلم وحافظة وسماعات لاسلكية.
            </p>

            {/* Price Box */}
            <div className="bg-[#FFFFFF] border border-[#E5DFC8] rounded-xl p-4 sm:p-5 mb-6 max-w-xl shadow-xs">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-[#666D77] block mb-0.5">
                    السعر الرسمي للمجموعة الكاملة
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-[#DE6426] tracking-tight">
                      {PRODUCT_PRICE}
                    </span>
                    <span className="text-base font-bold text-[#1A1D20]">
                      {PRODUCT_CURRENCY}
                    </span>
                  </div>
                </div>

                <div className="text-left">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF2EA] text-[#C24C12] text-xs font-bold rounded-md border border-[#F6D0BA]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    شامل باقة الملحقات الثمانية
                  </span>
                </div>
              </div>
            </div>

            {/* CTA and Trust indicators */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
              <a
                href="#order-form"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#DE6426] hover:bg-[#C24C12] text-white text-lg font-extrabold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.99] text-center"
              >
                <span>اطلب الآن</span>
                <ArrowLeft className="w-5 h-5" />
              </a>

              <a
                href="#specs"
                className="inline-flex items-center justify-center px-6 py-4 bg-[#F0EEEA] hover:bg-[#E8E4DD] text-[#1A1D20] text-sm font-bold rounded-xl transition-colors text-center border border-[#DCD6C7]"
              >
                عرض المواصفات التقنية
              </a>
            </div>

            {/* Quick Guarantees (Literal, honest, no exaggerated saas hype) */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E8E4DC] max-w-xl text-xs text-[#525861]">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#DE6426] shrink-0" />
                <span>توصيل لكافة المحافظات</span>
              </div>
              <div className="flex items-center gap-1.5">
                <PackageOpen className="w-4 h-4 text-[#DE6426] shrink-0" />
                <span>الدفع عند الاستلام</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#DE6426] shrink-0" />
                <span>ضمان سنة رسمية</span>
              </div>
            </div>

          </div>

          {/* Left Column: Real Product Visual */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-md lg:max-w-none">
              <ProductImageDisplay
                imageId="hero-tablet"
                aspectRatio="aspect-4/3 sm:aspect-square"
                className="shadow-sm border-2 border-[#E5DFC8]"
              />

              {/* Product Color Palette Preview underneath */}
              <div className="mt-3 flex items-center justify-between px-3 py-2 bg-[#FFFFFF] rounded-lg border border-[#E8E4DC] text-xs text-[#525861]">
                <span className="font-semibold text-[#1A1D20]">الألوان الرسمية المتاحة:</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-medium text-[#DE6426]">
                    <span className="w-3 h-3 rounded-full bg-[#DE6426] border border-[#B84A12]" />
                    برتقالي برونزي
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-[#8E9399] border border-[#72777D]" />
                    سكني
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-[#1A1D20] border border-[#000000]" />
                    أسود
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
