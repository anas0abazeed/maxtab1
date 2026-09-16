import React from "react";
import { Maximize2, Zap, HardDrive, Smartphone, Layers } from "lucide-react";
import { PRACTICAL_BENEFITS } from "../data/productData";

export const PracticalBenefits: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Maximize2":
        return <Maximize2 className="w-5 h-5 text-[#DE6426]" />;
      case "Zap":
        return <Zap className="w-5 h-5 text-[#DE6426]" />;
      case "HardDrive":
        return <HardDrive className="w-5 h-5 text-[#DE6426]" />;
      case "Smartphone":
        return <Smartphone className="w-5 h-5 text-[#DE6426]" />;
      case "Layers":
        return <Layers className="w-5 h-5 text-[#DE6426]" />;
      default:
        return <Zap className="w-5 h-5 text-[#DE6426]" />;
    }
  };

  return (
    <section className="bg-[#F6F4EE] py-14 md:py-20 border-b border-[#E5DFC8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#DE6426] tracking-wider uppercase mb-1 block">
            الاستخدام الفعلي
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1D20] mb-3">
            مميزات عملية تخدم يومك
          </h2>
          <p className="text-sm sm:text-base text-[#525861]">
            كل تفصيلة في التابلت تم تصميمها لتلبي الاحتياجات الحقيقية للمستخدم الباحث عن جهاز عملي وموثوق.
          </p>
        </div>

        {/* 5 structured cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRACTICAL_BENEFITS.map((item, index) => (
            <div
              key={item.id}
              className={`bg-[#FAF8F5] rounded-xl p-6 border border-[#E0DBD0] shadow-xs flex flex-col justify-between transition-all hover:border-[#DE6426]/50 ${
                index === 4 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#FAF0E6] flex items-center justify-center border border-[#F2D8C6] mb-4">
                  {getIcon(item.iconName)}
                </div>
                <h3 className="text-lg font-bold text-[#1A1D20] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#525861] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#EAE5D8] flex items-center text-xs font-semibold text-[#8C7A68]">
                <span>ميزة قياسية أساسية</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
