import React, { useState, useEffect, useRef } from "react";
import { Upload, Image as ImageIcon, CheckCircle2, RefreshCw } from "lucide-react";
import { getSavedAsset, saveLocalAsset, DEFAULT_PRODUCT_IMAGES } from "../utils/assetManager";

interface ProductImageDisplayProps {
  imageId: "hero-tablet" | "colors-stack" | "retail-box" | "gift-box" | "color-orange" | "color-gray" | "color-black";
  className?: string;
  aspectRatio?: string;
  showCaption?: boolean;
  onAssetLoaded?: (url: string) => void;
}

export const ProductImageDisplay: React.FC<ProductImageDisplayProps> = ({
  imageId,
  className = "w-full h-full",
  aspectRatio = "aspect-square",
  showCaption = false,
}) => {
  const defaultInfo =
    DEFAULT_PRODUCT_IMAGES.find((img) => img.id === imageId) ||
    DEFAULT_PRODUCT_IMAGES[0];

  const candidateSources = [
    defaultInfo.src,
    ...(defaultInfo.alternativeSources || []),
  ];

  const [sourceIndex, setSourceIndex] = useState<number>(0);
  const [currentSrc, setCurrentSrc] = useState<string>(defaultInfo.src);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Default to the physical production asset first
    setSourceIndex(0);
    setCurrentSrc(defaultInfo.src);
    setHasError(false);
  }, [imageId, defaultInfo]);

  const handleImageError = () => {
    // If we have alternative candidate paths, try next
    const nextIndex = sourceIndex + 1;
    if (nextIndex < candidateSources.length) {
      setSourceIndex(nextIndex);
      setCurrentSrc(candidateSources[nextIndex]);
    } else {
      // All candidate paths failed, show authentic upload card
      setHasError(true);
    }
  };

  const processFile = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCurrentSrc(dataUrl);
        saveLocalAsset(imageId, dataUrl);
        setHasError(false);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);

        // Upload to server and save with both clean name and original WhatsApp name
        try {
          const aliasNames: string[] = [];
          if (defaultInfo.originalUploadName) {
            aliasNames.push(defaultInfo.originalUploadName);
          }
          if (defaultInfo.src) {
            aliasNames.push(defaultInfo.src.replace(/^\/(assets|images)\//, ""));
          }

          await fetch("/api/upload-asset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: `${imageId}.jpg`,
              base64Data: dataUrl,
              aliasNames,
            }),
          });
        } catch (err) {
          console.error("Server upload skipped", err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div
      className={`relative group overflow-hidden rounded-xl bg-[#F0EEEA] border border-[#E5DFC8]/80 flex flex-col items-center justify-center transition-all ${
        isDragging ? "ring-2 ring-[#DE6426] bg-[#FFF8F2]" : ""
      } ${aspectRatio} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {!hasError ? (
        <img
          src={currentSrc}
          alt={defaultInfo.alt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain p-2 select-none transition-transform duration-300 hover:scale-[1.02]"
          onError={handleImageError}
        />
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#FAF8F5] cursor-pointer hover:bg-[#FDFBF7] transition-colors"
        >
          <div className="w-14 h-14 rounded-full bg-[#FAF0E6] flex items-center justify-center mb-3 border border-[#F2D6C4] shadow-xs">
            <ImageIcon className="w-7 h-7 text-[#DE6426]" />
          </div>
          <span className="inline-block px-2.5 py-1 mb-2 text-xs font-bold text-[#DE6426] bg-[#FDF2EA] rounded-full border border-[#F8D4C0]">
            {defaultInfo.tag || "صورة المنتج المعتمدة"}
          </span>
          <h4 className="text-base font-bold text-[#1A1D20] mb-1">
            {defaultInfo.title}
          </h4>
          <p className="text-xs text-[#5C626A] max-w-xs mb-3 line-clamp-2">
            {defaultInfo.description}
          </p>

          {defaultInfo.originalUploadName && (
            <span className="text-[10px] font-mono text-[#8C939E] mb-3 px-2 py-0.5 bg-[#EFECE5] rounded truncate max-w-xs">
              {defaultInfo.originalUploadName}
            </span>
          )}

          <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#DE6426] hover:bg-[#C24C12] text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
            <Upload className="w-4 h-4" />
            <span>رفع ملف الصورة الأصلية</span>
          </div>
          <span className="text-[11px] text-[#8C939E] mt-2">
            اسحب الصورة هنا أو اضغط للاختيار
          </span>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* Quick change hover control */}
      {!hasError && (
        <div
          className={`absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 bg-[#1A1D20]/85 backdrop-blur-sm text-white rounded-lg transition-opacity duration-200 ${
            isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <span className="text-[11px] font-medium truncate max-w-[65%] px-1">
            {defaultInfo.title}
          </span>
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#DE6426] hover:bg-[#C24C12] text-white text-[11px] font-bold rounded transition-colors">
            <RefreshCw className="w-3 h-3" />
            <span>تحديث</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}

      {uploadSuccess && (
        <div className="absolute top-3 left-3 bg-[#1A1D20] text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 shadow-lg animate-fade-in z-10">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>تم اعتماد الصورة بنجاح</span>
        </div>
      )}

      {showCaption && (
        <div className="w-full py-2 px-3 bg-[#F0EEEA] border-t border-[#E5DFC8] text-center">
          <p className="text-xs font-medium text-[#2D3136]">{defaultInfo.title}</p>
        </div>
      )}
    </div>
  );
};
