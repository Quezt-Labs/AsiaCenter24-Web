export interface Product {
  id: string;
  name: string;
  nameHi: string;
  brand: string;
  category: string;
  categorySlug: string;
  description: string;
  descriptionHi: string;
  price: number;
  originalPrice: number;
  discount: number;
  unit: string;
  weightOptions: WeightOption[];
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  nutritionalInfo?: NutritionalInfo;
  storageInstructions?: string;
  tags: string[];
}

export interface WeightOption {
  weight: string;
  price: number;
  originalPrice: number;
}

export interface NutritionalInfo {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
}

export interface Category {
  id: string;
  name: string;
  nameHi: string;
  slug: string;
  icon: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWeight: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  selectedWeight: string;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: Address;
  paymentMethod: string;
  createdAt: Date;
  estimatedDelivery: Date;
}

export type OrderStatus =
  | "confirmed"
  | "packed"
  | "out_for_delivery"
  | "delivered";

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface DeliverySlot {
  id: string;
  date: string;
  timeSlot: string;
  available: boolean;
}

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  weights: string[];
}

export type SortOption =
  | "popularity"
  | "price_low_high"
  | "price_high_low"
  | "newest"
  | "rating";

// Auth types
export interface User {
  id: string;
  phone: string;
  name?: string;
  isVerified: boolean;
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  isActive: boolean;
}
