import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { QuickBenefits } from "./components/QuickBenefits";
import { WhyMaxtab } from "./components/WhyMaxtab";
import { PracticalBenefits } from "./components/PracticalBenefits";
import { TechSpecs } from "./components/TechSpecs";
import { WhatsIncluded } from "./components/WhatsIncluded";
import { ProductGallery } from "./components/ProductGallery";
import { CustomerReviews } from "./components/CustomerReviews";
import { FinalCTA } from "./components/FinalCTA";
import { OrderForm } from "./components/OrderForm";
import { PoliciesSection } from "./components/PoliciesSection";
import { Footer } from "./components/Footer";
import { ArrowUp, ShoppingBag } from "lucide-react";
import { PRODUCT_PRICE, PRODUCT_CURRENCY_SHORT } from "./data/productData";

export const App: React.FC = () => {
  const [showStickyBar, setShowStickyBar] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past 500px
      if (window.scrollY > 500) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E2022] font-sans antialiased selection:bg-[#FCE8DB] selection:text-[#B84A12]">
      {/* 0. Minimal Header */}
      <Header />

      {/* Main Page Flow - Strictly matching requested sequence */}
      <main>
        {/* 1. Hero / Product (Immediate main focus) */}
        <Hero />

        {/* 2. Quick Benefits (4 Icons) */}
        <QuickBenefits />

        {/* 3. لماذا MAXTAB؟ (Customer-focused benefit cards) */}
        <WhyMaxtab />

        {/* 4. مميزات عملية تخدم يومك (Structured grid) */}
        <PracticalBenefits />

        {/* 5. المواصفات التقنية (10 Strict specifications only) */}
        <TechSpecs />

        {/* 6. ماذا يوجد في الصندوق؟ (Warm beige visual treatment) */}
        <WhatsIncluded />

        {/* 7. Product Gallery (Interactive carousel using uploaded assets) */}
        <ProductGallery />

        {/* 8. آراء العملاء (Editable placeholders) */}
        <CustomerReviews />

        {/* 9. Final CTA (Dark charcoal background) */}
        <FinalCTA />

        {/* 10. Order Form (Functional with Color Selector & Server API) */}
        <OrderForm />

        {/* 11. Policies (Privacy, Shipping, Returns) */}
        <PoliciesSection />
      </main>

      {/* 12. Share / Footer */}
      <Footer />

      {/* Mobile Sticky Quick-Order Bar */}
      {showStickyBar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1A1D20]/95 backdrop-blur-md border-t border-[#333] px-4 py-3 flex items-center justify-between shadow-2xl animate-fade-in">
          <div>
            <span className="text-[11px] text-[#A0A5AA] block leading-tight">
              MAXTAB Ultimate 70 Pro
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-[#DE6426] leading-none">
                {PRODUCT_PRICE}
              </span>
              <span className="text-xs font-bold text-white">
                {PRODUCT_CURRENCY_SHORT}
              </span>
              <span className="text-[10px] text-[#A0A5AA] mr-1">
                (شامل الملحقات)
              </span>
            </div>
          </div>

          <a
            href="#order-form"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#DE6426] hover:bg-[#C24C12] text-white text-sm font-extrabold rounded-xl shadow-md active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>اطلب الآن</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default App;
