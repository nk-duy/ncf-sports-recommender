import type { AIExplanation } from "@/shared/types/aiExplanation";

export interface RecProduct {
  product_id: string;
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
  sizes?: string[];
  colors?: string[];
  stock?: number;
  is_hidden?: boolean;
  is_deleted?: boolean;
  ai_explanation?: AIExplanation;
}

export interface LatentRadarAxis {
  sport_type: string;
  ncf_affinity: number;
  visual_affinity: number;
  combined_affinity: number;
  sample_count?: number;
  is_interested?: boolean;
}

export interface FilterTab {
  id: string;
  label: string;
}

export const SPORT_TABS: FilterTab[] = [
  { id: "all", label: "Tất cả" },
  { id: "Pickleball", label: "Pickleball" },
  { id: "Cầu lông", label: "Cầu lông" },
  { id: "Chạy bộ", label: "Chạy bộ" },
  { id: "Đá bóng", label: "Bóng đá" },
  { id: "Dã ngoại", label: "Dã ngoại" },
  { id: "Đa dụng", label: "Gym & Fitness" },
];

export const TYPE_TABS: FilterTab[] = [
  { id: "all", label: "Tất cả loại" },
  { id: "equipment", label: "Dụng cụ / Thiết bị" },
  { id: "shoes", label: "Giày dép" },
  { id: "clothes", label: "Quần áo" },
  { id: "accessories", label: "Phụ kiện" },
];

export const DEFAULT_SPORTS_IMAGE =
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80";
