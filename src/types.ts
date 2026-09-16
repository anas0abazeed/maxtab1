export interface OrderFormData {
  customerName: string;
  phone: string;
  governorate: string;
  quantity: number;
  selectedColor: "برتقالي" | "سكني" | "أسود";
  notes?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  governorate: string;
  quantity: number;
  selectedColor: string;
  notes?: string;
  product: string;
  price: number;
  totalPrice: number;
  currency: string;
  timestamp: string;
  orderStatus: "New" | "Confirmed" | "Processing" | "Delivered" | "Cancelled";
}

export interface ProductImageItem {
  id: string;
  title: string;
  description: string;
  src: string;
  alternativeSources?: string[];
  originalUploadName?: string;
  alt: string;
  tag?: string;
}

export interface TechSpec {
  label: string;
  value: string;
  category?: string;
}

export interface PracticalBenefit {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface IncludedItem {
  id: string;
  name: string;
  description: string;
  badge?: string;
}
