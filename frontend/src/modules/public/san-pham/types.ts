import type { AIExplanation } from '@/shared/types/aiExplanation';

export interface ProductVariant {
  size?: string;
  color?: string;
  stock?: number;
  sku?: string;
  price?: number;
}

export interface ProductDetail {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  images?: string[];
  category?: string[];
  sport_type?: string;
  product_type?: string;
  sub_category?: string;
  brand?: string;
  rating?: number;
  reviews_count?: number;
  sold_count?: number;
  sizes?: string[];
  colors?: string[];
  stock?: number;
  description?: string;
  discount_percent?: number;
  variants?: ProductVariant[];
}

export interface RawReviewResponse {
  id?: string;
  _id?: string;
  user_name?: string;
  avatar_url?: string;
  rating?: number;
  comment?: string;
  timestamp?: string;
  images?: string[];
  size_bought?: string;
  color_bought?: string;
}

export interface RawRecommendationItem {
  product_id: string;
  name: string;
  category?: string[];
  sport_type?: string;
  price: number;
  discount_percent?: number;
  rating?: number;
  reviews_count?: number;
  image_url?: string;
  ai_explanation?: AIExplanation;
}

export interface RawVoucherResponse {
  code: string;
  discount_type?: 'amount' | 'percent';
  discount_value: number;
  min_order_value?: number;
}
