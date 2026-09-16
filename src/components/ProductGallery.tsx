import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Maximize, X } from "lucide-react";
import { DEFAULT_PRODUCT_IMAGES } from "../utils/assetManager";
import { ProductImageDisplay } from "./ProductImageDisplay";

export const ProductGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const images = DEFAULT_PRODUCT_IMAGES;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const activeImage = images[currentIndex];

  return (
    <section className="bg-[#FAF8F5] py-14 md:py-20 border-b border-[#E8E4DC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#DE6426] tracking-wider uppercase mb-1 block">
            معرض الصور الحقيقية
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1D20] mb-3">
            صور واقعية للمنتج وتفاصيله
          </h2>
          <p className="text-sm sm:text-base text-[#525861]">
            صور فوتوغرافية حقيقية 100% للجهاز والألوان المتاحة والملحقات وصندوق التغليف.
          </p>
        </div>

        {/* Gallery Interactive Viewer */}
        <div className="max-w-4xl mx-auto">
          
          {/* Main Viewer Card */}
          <div className="relative bg-[#FFFFFF] rounded-2xl border-2 border-[#E5DFC8] p-3 sm:p-5 shadow-xs">
            
            {/* Active image display container */}
            <div className="relative aspect-4/3 sm:aspect-16/10 w-full rounded-xl overflow-hidden bg-[#F4F2ED]">
              <ProductImageDisplay
                imageId={activeImage.id as any}
                className="w-full h-full"
                aspectRatio="aspect-full"
              />

              {/* Fullscreen view trigger */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                aria-label="تكبير الصورة"
                className="absolute top-3 left-3 p-2 bg-[#1A1D20]/75 hover:bg-[#1A1D20] text-white rounded-lg transition-colors shadow-sm"
              >
                <Maximize className="w-4 h-4" />
              </button>

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="الصورة السابقة"
                className="absolute top-1/2 -translate-y-1/2 right-3 w-10 h-10 rounded-full bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] text-[#1A1D20] flex items-center justify-center shadow-md transition-all active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="الصورة التالية"
                className="absolute top-1/2 -translate-y-1/2 left-3 w-10 h-10 rounded-full bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] text-[#1A1D20] flex items-center justify-center shadow-md transition-all active:scale-95"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            {/* Caption & Indicator */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 px-1">
              <div>
                <h3 className="text-base font-bold text-[#1A1D20]">
                  {activeImage.title}
                </h3>
                <p className="text-xs text-[#525861]">
                  {activeImage.description}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-[#8C7A68]">
                <span>{currentIndex + 1}</span>
                <span>/</span>
                <span>{images.length}</span>
              </div>
            </div>

          </div>

          {/* Thumbnails row */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-4">
            {images.map((img, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative p-1.5 rounded-xl text-right transition-all bg-[#FFFFFF] border-2 ${
                    isSelected
                      ? "border-[#DE6426] shadow-sm ring-2 ring-[#DE6426]/20"
                      : "border-[#E5DFC8] hover:border-[#C4B8A0] opacity-80"
                  }`}
                >
                  <div className="aspect-square w-full rounded-lg overflow-hidden bg-[#F0EEEA] mb-1.5 pointer-events-none">
                    <ProductImageDisplay
                      imageId={img.id as any}
                      className="w-full h-full pointer-events-none"
                    />
                  </div>
                  <span className="block text-[11px] font-bold text-[#1A1D20] truncate px-1">
                    {img.title}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1A1D20]/95 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center">
            
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-12 left-0 p-2 text-white hover:text-[#DE6426] transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="w-full h-[75vh] flex items-center justify-center bg-[#111315] rounded-2xl overflow-hidden border border-[#333]">
              <ProductImageDisplay
                imageId={activeImage.id as any}
                className="w-full h-full"
                aspectRatio="aspect-full"
              />
            </div>

            <div className="mt-4 text-center text-white">
              <h4 className="text-lg font-bold">{activeImage.title}</h4>
              <p className="text-xs text-[#A0A5AA]">{activeImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
