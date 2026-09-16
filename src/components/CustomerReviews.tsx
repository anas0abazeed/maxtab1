import React from "react";
import { MessageSquare, Clock } from "lucide-react";
import { PLACEHOLDER_REVIEWS } from "../data/productData";

export const CustomerReviews: React.FC = () => {
  return (
    <section className="bg-[#F8F6F1] py-14 md:py-20 border-b border-[#E8E4DC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFEBE3] text-[#5C626A] text-xs font-bold rounded-full mb-3 border border-[#E0DBD0]">
            <MessageSquare className="w-3.5 h-3.5 text-[#DE6426]" />
            <span>الشفافية والمصداقية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1D20] mb-3">
            آراء العملاء
          </h2>
          <p className="text-sm sm:text-base text-[#525861]">
            نلتزم بالمصداقية التامة؛ ستُعرض هنا التجارب الفعلية للعملاء الكرام بعد استلام الطلبات وتجربة الجهاز في الأردن.
          </p>
        </div>

        {/* Placeholder cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLACEHOLDER_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E5DFC8] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#8C7A68] bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#ECE7DC]">
                    {review.placeholderTitle}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#A0A5AA]">
                    <Clock className="w-3 h-3" />
                    <span>{review.statusText}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-dashed border-[#DDD7C8] mb-4 text-center">
                  <p className="text-sm text-[#444A52] font-medium leading-relaxed italic">
                    "{review.quote}"
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0EEEA] flex items-center justify-between text-xs text-[#6B7280]">
                <span>المحافظة: {review.city}</span>
                <span className="text-[11px] text-[#A0A5AA]">(مساحة قابلة للتحديث)</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
