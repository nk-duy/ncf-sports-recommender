export interface PromotionProductItem {
  id?: string;
  product_id?: string;
  name: string;
  price: number;
  image_url: string;
  product_type?: string;
  sport_type?: string;
  category?: string[];
  brand?: string;
  rating?: number;
  reviews_count?: number;
  discount_percent?: number;
  sold?: number;
  stock?: number;
  sizes?: string[];
  colors?: string[];
}

export interface VoucherItem {
  _id?: string;
  id?: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order_value: number;
  max_discount?: number | null;
  usage_limit: number;
  used_count: number;
  is_active: boolean;
  valid_until?: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  title: string;
  sub: string;
  status: "ended" | "active" | "upcoming";
}

export const SPORTS = [
  { label: "Tất cả môn", value: "" },
  { label: "Pickleball", value: "Pickleball" },
  { label: "Cầu lông", value: "Cầu lông" },
  { label: "Bóng đá", value: "Đá bóng" },
  { label: "Chạy bộ", value: "Chạy bộ" },
  { label: "Bóng chuyền", value: "Bóng chuyền" },
  { label: "Dã ngoại", value: "Dã ngoại" },
  { label: "Gym & Đa dụng", value: "Đa dụng" },
];

export const PRODUCT_TYPES = [
  { label: "Tất cả", value: "" },
  { label: "Quần áo", value: "Quần áo" },
  { label: "Giày dép", value: "Giày dép" },
  { label: "Thiết bị", value: "Thiết bị" },
  { label: "Phụ kiện", value: "Phụ kiện" },
];

export const PRICE_RANGES: { label: string; min: number | null; max: number | null }[] = [
  { label: "Tất cả mức giá", min: null, max: null },
  { label: "Dưới 300.000đ", min: 0, max: 300000 },
  { label: "300.000đ - 700.000đ", min: 300000, max: 700000 },
  { label: "700.000đ - 1.500.000đ", min: 700000, max: 1500000 },
  { label: "Trên 1.500.000đ", min: 1500000, max: null },
];

export const COLOR_PALETTE = [
  { name: "Đen", hex: "#111827" },
  { name: "Trắng", hex: "#FFFFFF" },
  { name: "Xanh Navy", hex: "#1E3A8A" },
  { name: "Xanh Dương", hex: "#2563EB" },
  { name: "Đỏ", hex: "#DC2626" },
  { name: "Xám", hex: "#6B7280" },
  { name: "Vàng", hex: "#EAB308" },
  { name: "Cam", hex: "#F97316" },
  { name: "Xanh Lá", hex: "#16A34A" },
  { name: "Hồng", hex: "#EC4899" },
];

export const PROMO_FALLBACK_IMG =
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80";
