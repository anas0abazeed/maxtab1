import React from "react";
import { MessageSquare, Star, CheckCircle } from "lucide-react";
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
            تجارب وانطباعات حقيقية من عملائنا الكرام بعد استلام جهاز MAXTAB وتجربته.
          </p>
        </div>

        {/* Customer reviews cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLACEHOLDER_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E5DFC8] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FAF3EC] text-[#DE6426] font-bold text-sm flex items-center justify-center border border-[#E8DACB]">
                      {review.placeholderTitle.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-[#1A1D20]">
                      {review.placeholderTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full font-medium">
                    <CheckCircle className="w-3 h-3" />
                    <span>مشتري موثق</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3 text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#ECE7DC] mb-4">
                  <p className="text-sm text-[#374151] font-medium leading-relaxed">
                    "{review.quote}"
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0EEEA] flex items-center justify-between text-xs text-[#6B7280]">
                <span className="font-medium text-[#4B5563]">تجربة استخدام مؤكدة</span>
                <span className="text-[11px] text-[#9CA3AF]">MAXTAB 10.1"</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
