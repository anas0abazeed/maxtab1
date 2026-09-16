import React from "react";
import { Monitor, Cpu, HardDrive, Wifi } from "lucide-react";
import { QUICK_BENEFITS } from "../data/productData";

export const QuickBenefits: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Monitor":
        return <Monitor className="w-6 h-6 text-[#DE6426]" />;
      case "Cpu":
        return <Cpu className="w-6 h-6 text-[#DE6426]" />;
      case "HardDrive":
        return <HardDrive className="w-6 h-6 text-[#DE6426]" />;
      case "Wifi":
        return <Wifi className="w-6 h-6 text-[#DE6426]" />;
      default:
        return <Monitor className="w-6 h-6 text-[#DE6426]" />;
    }
  };

  return (
    <section className="bg-[#F2EFE9] py-10 md:py-14 border-b border-[#E2DDD0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-8">
          <h2 className="text-xs font-bold tracking-wider text-[#5C626A] uppercase mb-1">
            أبرز المزايا الأساسية
          </h2>
          <p className="text-xl sm:text-2xl font-black text-[#1A1D20]">
            مواصفات عملية صُممت لخدمة يومك
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {QUICK_BENEFITS.map((item, index) => (
            <div
              key={index}
              className="bg-[#FAF8F5] rounded-xl p-5 border border-[#E0DBD0] shadow-xs hover:border-[#D65A1D]/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-lg bg-[#FAF0E6] flex items-center justify-center border border-[#F2D8C6] shrink-0">
                  {getIcon(item.icon)}
                </div>
                <div>
                  <div className="text-xl font-extrabold text-[#1A1D20] leading-none mb-1">
                    {item.value}
                  </div>
                  <div className="text-xs font-bold text-[#DE6426]">
                    {item.label}
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#525861] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
