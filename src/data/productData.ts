import { TechSpec, PracticalBenefit, IncludedItem } from "../types";

export const PRODUCT_NAME = "MAXTAB Ultimate 70 Pro 5G";
export const PRODUCT_PRICE = 88;
export const PRODUCT_CURRENCY = "دينار أردني";
export const PRODUCT_CURRENCY_SHORT = "د.أ";

export interface QuantityTier {
  quantity: number;
  totalPrice: number;
  avgPrice: number;
  avgPriceFormatted: string;
  label: string;
}

export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 10;

export const QUANTITY_PRICE_TIERS: Record<number, QuantityTier> = {
  1: { quantity: 1, totalPrice: 88, avgPrice: 88, avgPriceFormatted: "88", label: "1 حبة" },
  2: { quantity: 2, totalPrice: 170, avgPrice: 85, avgPriceFormatted: "85", label: "2 حبتان" },
  3: { quantity: 3, totalPrice: 250, avgPrice: 83.33, avgPriceFormatted: "83.33", label: "3 حبات" },
  4: { quantity: 4, totalPrice: 330, avgPrice: 82.5, avgPriceFormatted: "82.5", label: "4 حبات" },
  5: { quantity: 5, totalPrice: 410, avgPrice: 82, avgPriceFormatted: "82", label: "5 حبات" },
  6: { quantity: 6, totalPrice: 490, avgPrice: 81.67, avgPriceFormatted: "81.67", label: "6 حبات" },
  7: { quantity: 7, totalPrice: 570, avgPrice: 81.43, avgPriceFormatted: "81.43", label: "7 حبات" },
  8: { quantity: 8, totalPrice: 650, avgPrice: 81.25, avgPriceFormatted: "81.25", label: "8 حبات" },
  9: { quantity: 9, totalPrice: 725, avgPrice: 80.56, avgPriceFormatted: "80.56", label: "9 حبات" },
  10: { quantity: 10, totalPrice: 800, avgPrice: 80, avgPriceFormatted: "80", label: "10 حبات" },
};

export function getTierForQuantity(quantity: number): QuantityTier | null {
  return QUANTITY_PRICE_TIERS[quantity] || null;
}

export const JORDAN_GOVERNORATES = [
  "عمان (العاصمة)",
  "إربد",
  "الزرقاء",
  "البلقاء (السلط)",
  "العقبة",
  "مادبا",
  "جرش",
  "عجلون",
  "الكرك",
  "الطفيلة",
  "معان",
  "المفرق",
];

export const QUICK_BENEFITS = [
  {
    value: "12 بوصة",
    label: "شاشة كبيرة",
    description: "شاشة IPS واسعة ومريحة للعين لقراءة النصوص ومتابعة المحتوى بوضوح فائق.",
    icon: "Monitor",
  },
  {
    value: "16GB",
    label: "ذاكرة RAM",
    description: "أداء سريع واستجابة فورية لتشغيل عدة تطبيقات في آن واحد دون بطء.",
    icon: "Cpu",
  },
  {
    value: "1TB",
    label: "مساحة تخزين",
    description: "سعة تخزين هائلة تتسع لآلاف الصور والمستندات والملفات دون الحاجة لمسح شيء.",
    icon: "HardDrive",
  },
  {
    value: "5G + Dual SIM",
    label: "اتصال مرن",
    description: "دعم شريحتي اتصال متزامنتين وسرعات إنترنت الجيل الخامس الفائقة أينما كنت.",
    icon: "Wifi",
  },
];

export const WHY_MAXTAB = [
  {
    title: "استخدام يومي مريح",
    description: "شاشة واسعة بحجم 12 بوصة مع خطوط واضحة وقراءة سلسة، مصممة خصيصاً لتوفير راحة تامة للعين أثناء العمل أو القراءة أو التصفح المنزلي الطويل.",
    icon: "Eye",
  },
  {
    title: "مساحة تخزين واسعة",
    description: "بفضل سعة 1TB الضخمة وذاكرة 16GB RAM، يمكنك الاحتفاظ بجميع ألبومات العائلة ومستندات العمل وملفات الفيديو لسنوات مقبلة دون القلق من امتلاء الذاكرة.",
    icon: "Database",
  },
  {
    title: "اتصال 5G وDual SIM",
    description: "مرونة كاملة مع شريحتي اتصال 5G لتفصل بين خط العمل وخط العائلة، مع إمكانية إجراء المكالمات والاتصال بالإنترنت عالي السرعة في أي مكان بالمملكة.",
    icon: "Radio",
  },
  {
    title: "مناسب للعمل والدراسة والترفيه",
    description: "جهاز متعدد المهام يجمع بين إنتاجية الحاسوب بفضل لوحة المفاتيح والماوس المرفقين، وسهولة التابلت لمتابعة الأخبار والقراءة والترفيه العائلي.",
    icon: "Briefcase",
  },
];

export const PRACTICAL_BENEFITS: PracticalBenefit[] = [
  {
    id: "screen",
    title: "شاشة كبيرة 12 بوصة",
    description: "مساحة عرض واسعة IPS تجعل تصفح الجرائد والمواقع وقراءة الكتب والملفات مريحاً تماماً للنظر دون إجهاد.",
    iconName: "Maximize2",
  },
  {
    id: "performance",
    title: "أداء قوي للاستخدام اليومي",
    description: "معالج Snapdragon 8 Elite ثماني النواة مع 16GB RAM يضمن تنقلاً سريعاً بين التطبيقات اليومية وتشغيلاً موثوقاً.",
    iconName: "Zap",
  },
  {
    id: "storage",
    title: "مساحة تخزين واسعة",
    description: "سعة 1TB عملاقة توفر أريحية مطلقة لحفظ الملفات المهمة والصور ومقاطع الفيديو دون الحاجة لاشتراكات سحابية.",
    iconName: "HardDrive",
  },
  {
    id: "connectivity",
    title: "اتصال 5G وشرائح Dual SIM",
    description: "اتصال شبكي حديث يدعم شبكات الجيل الخامس وشريحتي اتصال لتواصل دائم وتغطية ممتازة أثناء التنقل في الأردن.",
    iconName: "Smartphone",
  },
  {
    id: "versatile",
    title: "مناسب للعمل والدراسة والترفيه",
    description: "تكامل حقيقي بين أدوات الإنجاز والملحقات الكاملة لتأدية المهام المكتبية والدراسية والاستمتاع بالمحتوى في وقت الفراغ.",
    iconName: "Layers",
  },
];

export const TECH_SPECS: TechSpec[] = [
  { label: "الشاشة", value: "12 بوصة IPS" },
  { label: "المعالج", value: "Snapdragon 8 Elite، ثماني النواة" },
  { label: "ذاكرة RAM", value: "16GB" },
  { label: "سعة التخزين (Storage)", value: "1TB" },
  { label: "نظام التشغيل", value: "Android 17" },
  { label: "الشبكة والاتصال", value: "5G + Dual SIM" },
  { label: "الكاميرات", value: "20MP + 30MP" },
  { label: "المنفذ والتوصيل", value: "USB Type-C + OTG" },
  { label: "دعم الشبكات", value: "الشبكات الأوروبية والآسيوية" },
  { label: "الضمان", value: "سنة من الوكيل الرسمي في الأردن" },
];

export const WHATS_INCLUDED: IncludedItem[] = [
  {
    id: "tablet",
    name: "جهاز تابلت MAXTAB Ultimate 70 Pro",
    description: "الجهاز اللوحي الرئيسي بشاشة 12 بوصة وتصميم برونزي دافئ وأنيق.",
    badge: "الجهاز الأساسي",
  },
  {
    id: "keyboard",
    name: "لوحة مفاتيح بلوتوث عربية / إنجليزية",
    description: "لوحة مفاتيح مخصصة للكتابة المريحة والسريعة باللغتين العربية والإنجليزية.",
    badge: "ملحق عملي",
  },
  {
    id: "mouse",
    name: "ماوس لاسلكي مريح",
    description: "فأرة لاسلكية سوداء أنيقة للتحكم الدقيق وتجربة استخدام تشبه الحاسوب المحمول.",
    badge: "ملحق عملي",
  },
  {
    id: "case",
    name: "حافظة حماية فاخرة بنقشة مربعات",
    description: "غطاء حماية أنيق بتصميم مميز لحماية الشاشة والجهاز وتثبيته بوضعيات مريحة.",
    badge: "حماية وأناقة",
  },
  {
    id: "earbuds",
    name: "سماعات أذن لاسلكية مع علبة شحن",
    description: "سماعات ستيريو مريحة للمكالمات الواضحة والاستماع اليومي.",
    badge: "صوتيات",
  },
  {
    id: "stylus",
    name: "قلم لمس دقيق (Stylus)",
    description: "قلم معدني أنيق لتسهيل التصفح والكتابة والتوقيع على المستندات.",
    badge: "دقة",
  },
  {
    id: "screen-protector",
    name: "لاصق حماية زجاجي للشاشة",
    description: "حامي شاشة زجاجي لحماية الشاشة من الخدوش والصدمات اليومية.",
    badge: "حماية",
  },
  {
    id: "adapter",
    name: "محول USB Type-C + OTG",
    description: "وصلة لتوصيل وحدات الذاكرة الخارجية والملحقات مباشرة بالتابلت.",
    badge: "توصيل",
  },
];

export const PLACEHOLDER_REVIEWS = [
  {
    id: 1,
    author: "مصطفى كامل",
    placeholderTitle: "مصطفى كامل",
    quote: "والله العظيم جميل جدا وامكانية عالية والله والبطارية بتطول ومساحة ما شاء الله ربنا يوفقطم جميعا",
    city: "تقييم موثق",
    statusText: "عميل موثق",
  },
  {
    id: 2,
    author: "محمد بدوي بوجاسم",
    placeholderTitle: "محمد بدوي بوجاسم",
    quote: "تسلم جهاز ممتاز جدا وانتم صادقين في العرض وصلني الجهازكامل مع كلشي",
    city: "تقييم موثق",
    statusText: "عميل موثق",
  },
  {
    id: 3,
    author: "sa118848",
    placeholderTitle: "sa118848",
    quote: "ما شاء الله تاب مرتب كثير بجنن",
    city: "تقييم موثق",
    statusText: "عميل موثق",
  },
];

export const POLICIES_DATA = {
  privacy: {
    title: "سياسة الخصوصية",
    content: `نحن نحترم خصوصية عملائنا الكرام في المملكة الأردنية الهاشمية. 
يتم استخدام البيانات المدخلة في نموذج الطلب (الاسم، رقم الهاتف، والمحافظة) حصرياً لغايات التواصل معك وتأكيد الطلب وتوصيل المنتج عبر مندوب التوصيل المعتمد.
لا يتم بيع أو مشاركة أي بيانات شخصية مع أي جهات خارجية غير معنية بعملية الشحن والتسليم.
(محتوى قابل للتعديل والإضافة من قبل إدارة المتجر).`,
  },
  shipping: {
    title: "سياسة الشحن والتوصيل",
    content: `خدمة التوصيل تغطي جميع محافظات المملكة الأردنية الهاشمية من الشمال إلى الجنوب.
يتم التواصل مع العميل هاتفياً بعد تقديم الطلب لتأكيد العنوان وموعد التسليم المناسب.
يتم دفع قيمة الطلب (88 دينار أردني) عند الاستلام مباشرة بعد استلام الصندوق والتأكد من سلامته.
(محتوى قابل للتعديل والإضافة من قبل إدارة المتجر).`,
  },
  returns: {
    title: "سياسة الاستبدال والاسترجاع",
    content: `يحق للعميل معاينة الشحنة خارجياً عند استلامها من مندوب التوصيل.
المنتج مشمول بضمان سنة من الوكيل الرسمي في الأردن ضد العيوب المصنعية.
في حال وجود أي ملاحظة مصنعية يتم التنسيق مباشرة مع قسم خدمة العملاء وفقاً للشروط المعتمدة من الوكيل.
(محتوى قابل للتعديل والإضافة من قبل إدارة المتجر).`,
  },
};
