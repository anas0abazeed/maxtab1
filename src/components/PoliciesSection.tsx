import React, { useState } from "react";
import { Shield, ChevronDown, FileText, Truck, RefreshCw } from "lucide-react";
import { POLICIES_DATA } from "../data/productData";

export const PoliciesSection: React.FC = () => {
  const [openPolicy, setOpenPolicy] = useState<string | null>(null);

  const togglePolicy = (key: string) => {
    setOpenPolicy((prev) => (prev === key ? null : key));
  };

  const policies = [
    {
      key: "privacy",
      title: POLICIES_DATA.privacy.title,
      icon: <Shield className="w-5 h-5 text-[#DE6426]" />,
      content: POLICIES_DATA.privacy.content,
    },
    {
      key: "shipping",
      title: POLICIES_DATA.shipping.title,
      icon: <Truck className="w-5 h-5 text-[#DE6426]" />,
      content: POLICIES_DATA.shipping.content,
    },
    {
      key: "returns",
      title: POLICIES_DATA.returns.title,
      icon: <RefreshCw className="w-5 h-5 text-[#DE6426]" />,
      content: POLICIES_DATA.returns.content,
    },
  ];

  return (
    <section id="policies" className="bg-[#FAF8F5] py-12 md:py-16 border-b border-[#E8E4DC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-[#8C7A68] uppercase tracking-wider block mb-1">
            السياسات والشروط المعتمدة
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#1A1D20]">
            السياسات العامة للطلب والتوصيل
          </h2>
        </div>

        <div className="space-y-3">
          {policies.map((item) => {
            const isOpen = openPolicy === item.key;
            return (
              <div
                key={item.key}
                className="bg-[#FFFFFF] rounded-xl border border-[#E5DFC8] overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => togglePolicy(item.key)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-right hover:bg-[#FAF8F5] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-base font-bold text-[#1A1D20]">
                      {item.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#8C7A68] transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#DE6426]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-[#525861] leading-relaxed border-t border-[#F2EEE4] bg-[#FAF8F5]/50 whitespace-pre-line">
                    {item.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
