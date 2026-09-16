import React, { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

export const Footer: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleShare = async () => {
    const shareData = {
      title: "MAXTAB Ultimate 70 Pro 5G",
      text: "اطلب تابلت MAXTAB Ultimate 70 Pro 5G في الأردن بسعر 88 دينار مع باقة الملحقات الكاملة",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        fallbackCopy();
      }
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <footer className="bg-[#1A1D20] text-[#FAF8F5] py-10 border-t border-[#2C3035]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-wider text-white">MAX</span>
            <span className="text-2xl font-black text-[#DE6426] tracking-wider">TAB</span>
            <span className="text-xs text-[#8C939E] mr-2">المملكة الأردنية الهاشمية</span>
          </div>

          {/* Links: Policies */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#B5BAC0]">
            <a
              href="#policies"
              className="hover:text-[#DE6426] transition-colors py-1"
            >
              سياسة الخصوصية
            </a>
            <span className="text-[#40464E]">•</span>
            <a
              href="#policies"
              className="hover:text-[#DE6426] transition-colors py-1"
            >
              سياسة الشحن
            </a>
            <span className="text-[#40464E]">•</span>
            <a
              href="#policies"
              className="hover:text-[#DE6426] transition-colors py-1"
            >
              سياسة الاستبدال والاسترجاع
            </a>
          </div>

          {/* Share Button */}
          <div className="relative">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#282C32] hover:bg-[#32373F] text-[#F0EEEA] text-xs font-bold rounded-lg border border-[#3E454E] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>تم نسخ الرابط!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#DE6426]" />
                  <span>مشاركة الصفحة</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Bottom copyright notice */}
        <div className="mt-8 pt-6 border-t border-[#2A2E33] text-center text-xs text-[#727882]">
          <p>© {new Date().getFullYear()} MAXTAB. جميع الحقوق محفوظة للوكيل المعتمد في الأردن.</p>
        </div>
      </div>
    </footer>
  );
};
