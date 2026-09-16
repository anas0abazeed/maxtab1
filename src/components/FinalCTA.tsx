import React from "react";
import { ArrowLeft, ShieldCheck, Check } from "lucide-react";
import { PRODUCT_PRICE, PRODUCT_CURRENCY } from "../data/productData";

export const FinalCTA: React.FC = () => {
  return (
    <section className="bg-[#1A1D20] text-[#FAF8F5] py-16 md:py-24 border-t border-b border-[#2D3136]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Subtle accent badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#282C30] text-[#DE6426] text-xs font-bold mb-4 border border-[#3E4348]">
          <ShieldCheck className="w-4 h-4" />
          <span>العرض المباشر والوكيل الرسمي</span>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          جاهز تطلب MAXTAB؟
        </h2>

        {/* Text */}
        <p className="text-lg sm:text-xl text-[#D0D4D8] mb-8 font-medium">
          احصل على MAXTAB Ultimate 70 Pro بسعر{" "}
          <span className="text-[#DE6426] font-black text-2xl sm:text-3xl mx-1">
            {PRODUCT_PRICE}
          </span>{" "}
          {PRODUCT_CURRENCY}.
        </p>

        {/* Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="#order-form"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#DE6426] hover:bg-[#C24C12] text-white text-lg font-extrabold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.99]"
          >
            <span>اطلب الآن</span>
            <ArrowLeft className="w-5 h-5" />
          </a>
        </div>

        {/* Simple trust bullets */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#9DA3A9]">
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#DE6426]" />
            <span>الدفع عند الاستلام بعد المعاينة</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#DE6426]" />
            <span>باقة الملحقات الثمانية مجاناً</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#DE6426]" />
            <span>ضمان رسمي معتمد لمدة عام</span>
          </div>
        </div>

      </div>
    </section>
  );
};
