import React from "react";
import { ShieldCheck, PhoneCall } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-[#FAF8F5]/95 border-b border-[#E8E4DC] sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Minimal Brand Area */}
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <span className="text-xl font-black tracking-wider text-[#1A1D20]">MAX</span>
            <span className="text-xl font-black text-[#DE6426] tracking-wider">TAB</span>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-medium text-[#5C626A] border-r border-[#D8D4C8] pr-3 mr-1">
            الوكيل المعتمد في الأردن
          </span>
        </div>

        {/* Action and Price snippet */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-[#5C626A] bg-[#F0EEEA] px-2.5 py-1 rounded-md border border-[#E2DDD2]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DE6426]" />
            <span className="font-semibold text-[#1A1D20]">88 دينار</span>
            <span className="hidden md:inline text-[11px]">شامل الملحقات</span>
          </div>

          <a
            href="#order-form"
            className="inline-flex items-center justify-center px-4 py-1.5 bg-[#DE6426] hover:bg-[#C24C12] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            اطلب الآن
          </a>
        </div>
      </div>
    </header>
  );
};
