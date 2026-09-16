import React from "react";
import { Package, Check } from "lucide-react";
import { WHATS_INCLUDED } from "../data/productData";
import { ProductImageDisplay } from "./ProductImageDisplay";

export const WhatsIncluded: React.FC = () => {
  return (
    <section className="bg-[#EFE7DC] py-14 md:py-20 border-b border-[#D8CCB8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E4DACB] text-[#5A4532] text-xs font-bold rounded-full mb-3 border border-[#D5C7B5]">
            <Package className="w-3.5 h-3.5 text-[#DE6426]" />
            <span>الباقة الكاملة بدون تكاليف إضافية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#262019] mb-3">
            ماذا يوجد في الصندوق؟
          </h2>
          <p className="text-sm sm:text-base text-[#5A4F42] leading-relaxed">
            علبة متكاملة تضم الجهاز اللوحي وجميع الملحقات الأساسية والعملية لتكون جاهزاً للاستخدام الفوري فور استلام الطلب.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left/Visual column: Luxury presentation box photo */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="bg-[#FAF8F5] p-3 sm:p-4 rounded-2xl border-2 border-[#D5C7B5] shadow-sm">
              <ProductImageDisplay
                imageId="gift-box"
                aspectRatio="aspect-square sm:aspect-4/3"
                className="rounded-xl border border-[#D8CCB8]"
              />
              <div className="mt-3 text-center">
                <span className="text-xs font-bold text-[#5A4532]">
                  صورة حقيقية لصندوق العرض الفاخر ومحتويات التعبئة
                </span>
              </div>
            </div>
          </div>

          {/* Right/List column: 8 verified accessories */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {WHATS_INCLUDED.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-[#F8F4EE] rounded-xl p-3.5 sm:p-4 border border-[#DCD0BE] flex items-start gap-3 shadow-xs hover:border-[#DE6426]/60 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#E5D7C3] flex items-center justify-center shrink-0 mt-0.5 text-[#DE6426]">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-extrabold text-[#262019]">
                        {item.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6A5E50] leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price reminder card */}
            <div className="mt-5 p-4 rounded-xl bg-[#FAF6F0] border border-[#D5C7B5] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#3C3228]">
                <span>جميع هذه الملحقات مشمولة بسعر التابلت:</span>
                <span className="font-black text-base text-[#DE6426]">88 دينار</span>
              </div>
              <a
                href="#order-form"
                className="px-4 py-2 bg-[#DE6426] hover:bg-[#C24C12] text-white text-xs font-bold rounded-lg transition-colors"
              >
                اطلب الباقة
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
