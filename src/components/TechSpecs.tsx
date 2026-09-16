import React from "react";
import { CheckCircle2, Shield } from "lucide-react";
import { TECH_SPECS } from "../data/productData";

export const TechSpecs: React.FC = () => {
  return (
    <section id="specs" className="bg-[#FAF8F5] py-14 md:py-20 border-b border-[#E8E4DC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#DE6426] tracking-wider uppercase mb-1 block">
            دقة البيانات والوضوح
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1D20] mb-3">
            المواصفات التقنية
          </h2>
          <p className="text-sm sm:text-base text-[#525861]">
            جميع المواصفات المذكورة حقيقية ومطابقة للنسخة الرسمية المعتمدة في الأردن.
          </p>
        </div>

        {/* 10 Specifications in clean grid */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5DFC8] p-6 sm:p-8 shadow-xs max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {TECH_SPECS.map((spec, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] hover:border-[#DE6426]/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#DE6426] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-[#6B7280] block mb-1">
                      {spec.label}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-[#1A1D20] leading-snug">
                      {spec.value}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Warranty Badge footer inside specs */}
          <div className="mt-6 pt-5 border-t border-[#E8E4DC] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#525861]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#DE6426]" />
              <span className="font-semibold text-[#1A1D20]">الضمان المعتمد:</span>
              <span>سنة كاملة ضد العيوب المصنعية لدى الوكيل الرسمي في المملكة الأردنية الهاشمية.</span>
            </div>
            <span className="text-[11px] text-[#8C7A68] bg-[#F4F1EA] px-2.5 py-1 rounded">
              Android 17 • 5G • 1TB
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
