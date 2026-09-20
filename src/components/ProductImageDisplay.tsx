import React, { useState, useEffect } from "react";
import { Image as ImageIcon } from "lucide-react";
import { getSavedAsset, DEFAULT_PRODUCT_IMAGES } from "../utils/assetManager";

interface ProductImageDisplayProps {
  imageId:
    | "hero-tablet"
    | "colors-stack"
    | "retail-box"
    | "gift-box"
    | "color-orange"
    | "color-gray"
    | "color-black";
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

  const savedLocal = getSavedAsset(imageId);

  const candidateSources = [
    defaultInfo.src,
    ...(savedLocal ? [savedLocal] : []),
    ...(defaultInfo.alternativeSources || []),
  ];

  const [sourceIndex, setSourceIndex] = useState<number>(0);
  const [currentSrc, setCurrentSrc] = useState<string>(
    savedLocal || defaultInfo.src
  );
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const saved = getSavedAsset(imageId);
    if (saved && saved.startsWith("data:image")) {
      setCurrentSrc(saved);
      setHasError(false);
      setIsLoading(false);

      // Silently sync to backend to ensure file exists on server disk
      const aliasNames: string[] = [];
      if (defaultInfo.originalUploadName) {
        aliasNames.push(defaultInfo.originalUploadName);
      }
      if (defaultInfo.src) {
        aliasNames.push(defaultInfo.src.replace(/^\/(assets|images)\//, ""));
      }

      fetch("/api/upload-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: `${imageId}.jpg`,
          base64Data: saved,
          aliasNames,
        }),
      }).catch(() => {});
    } else {
      setSourceIndex(0);
      setCurrentSrc(defaultInfo.src);
      setHasError(false);
      setIsLoading(true);
    }
  }, [imageId, defaultInfo]);

  const handleImageError = () => {
    const nextIndex = sourceIndex + 1;
    if (nextIndex < candidateSources.length) {
      setSourceIndex(nextIndex);
      setCurrentSrc(candidateSources[nextIndex]);
    } else {
      // If all candidates failed, display the fixed static card
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#F0EEEA] border border-[#E5DFC8]/80 flex flex-col items-center justify-center select-none ${aspectRatio} ${className}`}
    >
      {!hasError ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F4F2ED] animate-pulse z-0">
              <ImageIcon className="w-8 h-8 text-[#A49A8D] mb-2 opacity-50" />
              <span className="text-[11px] font-bold text-[#72675A]">
                {defaultInfo.title}
              </span>
            </div>
          )}
          <img
            src={currentSrc}
            alt={defaultInfo.alt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`w-full h-full object-contain p-2 transition-transform duration-300 hover:scale-[1.01] ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
          />
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#FAF8F5]">
          <div className="w-12 h-12 rounded-full bg-[#FAF0E6] flex items-center justify-center mb-2.5 border border-[#F2D6C4]">
            <ImageIcon className="w-6 h-6 text-[#DE6426]" />
          </div>
          <span className="inline-block px-2.5 py-0.5 mb-1.5 text-[11px] font-bold text-[#DE6426] bg-[#FDF2EA] rounded-full border border-[#F8D4C0]">
            {defaultInfo.tag}
          </span>
          <h4 className="text-sm font-bold text-[#1A1D20] mb-1">
            {defaultInfo.title}
          </h4>
          <p className="text-[11px] text-[#5C626A] max-w-xs leading-relaxed">
            {defaultInfo.description}
          </p>
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
