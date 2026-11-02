import type React from "react";
import type { AIExplanation } from "@/shared/types/aiExplanation";

export interface HomeRecProduct {
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

export interface SportProduct {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  category?: string[];
  product_type?: string;
  sport_type?: string;
  rating?: number;
  reviews_count?: number;
  discount_percent?: number;
  sizes?: string[];
  colors?: string[];
  stock?: number;
}

export interface SportMeta {
  id: string;
  name: string;
  dbSportType: string;
  tag: string;
  slogan: string;
  description: string;
  bannerImage: string;
  colorGradient: string;
  accentColor: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

export interface FlashSaleProduct {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  discount_percent?: number;
  category?: string[];
  product_type?: string;
  sport_type?: string;
  sold?: number;
  stock?: number;
  sizes?: string[];
  colors?: string[];
}

export interface BannerItem {
  _id: string;
  title: string;
  image_url: string;
  link?: string;
  subtitle?: string;
  badge?: string;
}

export const HOME_FALLBACK_SPORT_IMG =
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80";
