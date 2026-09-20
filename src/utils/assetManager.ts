import { ProductImageItem } from "../types";

export const DEFAULT_PRODUCT_IMAGES: ProductImageItem[] = [
  {
    id: "hero-tablet",
    title: "تابلت MAXTAB Ultimate 70 Pro 5G",
    description: "الجهاز اللوحي مع كافة الملحقات الأساسية: لوحة المفاتيح والماوس والقلم والسماعات والحافظة",
    src: "/assets/maxtab-flatlay.jpg",
    originalUploadName: "WhatsApp Image 2026-09-10 at 9.24.05 PM (1).jpeg",
    alternativeSources: [
      "/assets/maxtab-flatlay.jpg",
      "/assets/WhatsApp Image 2026-09-10 at 9.24.05 PM (1).jpeg",
      "/images/maxtab-flatlay.jpg",
      "/images/WhatsApp Image 2026-09-10 at 9.24.05 PM (1).jpeg",
      "/WhatsApp Image 2026-09-10 at 9.24.05 PM (1).jpeg",
      "/assets/hero-tablet.jpg",
      "/images/hero-tablet.jpg",
      "/assets/maxtab-hero.jpg",
      "/images/maxtab-hero.jpg",
    ],
    alt: "تابلت MAXTAB Ultimate 70 Pro 5G برتقالي مع الملحقات ولوحة المفاتيح",
    tag: "الصورة الرئيسية والملحقات",
  },
  {
    id: "colors-stack",
    title: "خيارات الألوان: برتقالي، سكني، أسود",
    description: "الألوان الثلاثة الأصلية لتابلت MAXTAB بتشطيب معدني فاخر",
    src: "/assets/maxtab-colors.jpg",
    originalUploadName: "WhatsApp Image 2026-09-10 at 9.24.05 PM.jpeg",
    alternativeSources: [
      "/assets/maxtab-colors.jpg",
      "/assets/WhatsApp Image 2026-09-10 at 9.24.05 PM.jpeg",
      "/images/maxtab-colors.jpg",
      "/images/WhatsApp Image 2026-09-10 at 9.24.05 PM.jpeg",
      "/WhatsApp Image 2026-09-10 at 9.24.05 PM.jpeg",
      "/assets/colors-stack.jpg",
      "/images/colors-stack.jpg",
      "/assets/colors.jpg",
      "/images/colors.jpg",
    ],
    alt: "خيارات ألوان تابلت MAXTAB الأصلية: برتقالي، سكني، أسود",
    tag: "الألوان الرسمية",
  },
  {
    id: "retail-box",
    title: "علبة التغليف الرسمية المعتمدة",
    description: "كرتونة التعبئة الأصلية مع شارات الشاشة العملاقة 12 بوصة وشبكة 5G+",
    src: "/assets/maxtab-box.jpg",
    originalUploadName: "WhatsApp Image 2026-09-10 at 9.24.03 PM.jpeg",
    alternativeSources: [
      "/assets/maxtab-box.jpg",
      "/assets/WhatsApp Image 2026-09-10 at 9.24.03 PM.jpeg",
      "/images/maxtab-box.jpg",
      "/images/WhatsApp Image 2026-09-10 at 9.24.03 PM.jpeg",
      "/WhatsApp Image 2026-09-10 at 9.24.03 PM.jpeg",
      "/assets/retail-box.jpg",
      "/images/retail-box.jpg",
    ],
    alt: "علبة تابلت MAXTAB Ultimate 70 Pro شاشة 12 بوصة وشبكة 5G+",
    tag: "التغليف الرسمي",
  },
  {
    id: "gift-box",
    title: "صندوق العرض الفاخر ومحتويات الصندوق",
    description: "الصندوق الفاخر المبطن مع الترتيب الكامل للتابلت والملحقات الثمانية",
    src: "/assets/maxtab-giftbox.jpg",
    originalUploadName: "WhatsApp Image 2026-09-10 at 9.24.02 PM (1).jpeg",
    alternativeSources: [
      "/assets/maxtab-giftbox.jpg",
      "/assets/WhatsApp Image 2026-09-10 at 9.24.02 PM (1).jpeg",
      "/images/maxtab-giftbox.jpg",
      "/images/WhatsApp Image 2026-09-10 at 9.24.02 PM (1).jpeg",
      "/WhatsApp Image 2026-09-10 at 9.24.02 PM (1).jpeg",
      "/assets/gift-box.jpg",
      "/images/gift-box.jpg",
      "/assets/whats-included.jpg",
      "/images/whats-included.jpg",
    ],
    alt: "صندوق تابلت MAXTAB الفاخر والمحتويات الكاملة المرفقة",
    tag: "صندوق العرض والمحتويات",
  },
];

// Helper to get local stored images if available
export function getSavedAsset(id: string): string | null {
  try {
    return localStorage.getItem(`maxtab_asset_${id}`);
  } catch {
    return null;
  }
}

export function saveLocalAsset(id: string, dataUrl: string): void {
  try {
    localStorage.setItem(`maxtab_asset_${id}`, dataUrl);
  } catch (e) {
    console.warn("Storage quota exceeded or unavailable", e);
  }
}

// Color asset helper respecting:
// - Orange = use the actual uploaded orange product image.
// - Gray = use the authentic 3-colors stack photo (shows gray).
// - Black = use the authentic 3-colors stack photo (shows black).
// - Never recolor the orange image to create gray or black.
export function getColorImageInfo(color: "برتقالي" | "سكني" | "أسود") {
  if (color === "برتقالي") {
    return {
      imageId: "hero-tablet" as const,
      colorName: "برتقالي",
      customSrc: null,
      badgeText: "اللون البرتقالي البرونزي المعتمد (اللون الأساسي)",
      description: "الصورة الحقيقية المعتمدة للجهاز باللون البرتقالي مع كامل الملحقات.",
      isAuthenticColorPhoto: true,
    };
  }

  if (color === "سكني") {
    return {
      imageId: "colors-stack" as const,
      colorName: "سكني",
      customSrc: null,
      badgeText: "صورة الألوان الثلاثة الأصلية (يتوفر باللون السكني)",
      description: "صورة واقعية تعرض الألوان الثلاثة الأصلية دون أي تعديل رقمي على لون الجهاز.",
      isAuthenticColorPhoto: true,
    };
  }

  if (color === "أسود") {
    return {
      imageId: "colors-stack" as const,
      colorName: "أسود",
      customSrc: null,
      badgeText: "صورة الألوان الثلاثة الأصلية (يتوفر باللون الأسود)",
      description: "صورة واقعية تعرض الألوان الثلاثة الأصلية دون أي تعديل رقمي على لون الجهاز.",
      isAuthenticColorPhoto: true,
    };
  }

  return {
    imageId: "hero-tablet" as const,
    colorName: "برتقالي",
    customSrc: null,
    badgeText: "الصورة الرسمية المعتمدة",
    description: "تابلت MAXTAB مع الملحقات الكاملة.",
    isAuthenticColorPhoto: true,
  };
}
