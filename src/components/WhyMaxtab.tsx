import React from "react";
import { Eye, HardDrive, Radio, Briefcase } from "lucide-react";
import { WHY_MAXTAB } from "../data/productData";

export const WhyMaxtab: React.FC = () => {
  const getIcon = (icon: string) => {
    switch (icon) {
      case "Eye":
        return <Eye className="w-5 h-5 text-[#DE6426]" />;
      case "Database":
      case "HardDrive":
        return <HardDrive className="w-5 h-5 text-[#DE6426]" />;
      case "Radio":
        return <Radio className="w-5 h-5 text-[#DE6426]" />;
      case "Briefcase":
        return <Briefcase className="w-5 h-5 text-[#DE6426]" />;
      default:
        return <Eye className="w-5 h-5 text-[#DE6426]" />;
    }
  };

  return (
    <section className="bg-[#FAF8F5] py-14 md:py-20 border-b border-[#E8E4DC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="inline-block px-3 py-1 bg-[#F0EEEA] text-[#DE6426] text-xs font-bold rounded-full mb-3 border border-[#E2DDD2]">
            قيمة حقيقية وموثوقة
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1D20] mb-4">
            لماذا MAXTAB؟
          </h2>
          <p className="text-sm sm:text-base text-[#525861] leading-relaxed">
            اختيار ذكي يمنحك تجربة استخدام متوازنة تجمع بين الشاشة الكبيرة، السعة الضخمة، والملحقات الكاملة بسعر 88 دينار فقط.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WHY_MAXTAB.map((card, idx) => (
            <div
              key={idx}
              className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-7 border border-[#E5DFC8] shadow-xs relative overflow-hidden transition-all duration-200 hover:shadow-sm"
            >
              {/* Top orange accent indicator line */}
              <div className="w-12 h-1 bg-[#DE6426] rounded-full mb-5" />

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#FAF0E6] flex items-center justify-center border border-[#F2D8C6] shrink-0 mt-0.5">
                  {getIcon(card.icon)}
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1A1D20] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[#525861] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
