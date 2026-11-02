import type { AIExplanation } from '@/shared/types/aiExplanation';

export interface PublicOrderItem {
  product_id?: string;
  id?: string;
  _id?: string;
  product_name?: string;
  name?: string;
  quantity?: number;
  price?: number;
  size?: string;
  color?: string;
  image_url?: string;
  image?: string;
}

export interface PublicOrderData {
  _id?: string;
  id?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  payment_method?: string;
  items?: PublicOrderItem[];
  total_amount?: number;
  shipping_fee?: number;
  subtotal?: number;
  voucher_code?: string;
  discount_amount?: number;
  status?: string;
  rejection_reason?: string;
  tracking_code?: string;
  carrier?: string;
  shipping_method?: string;
  created_at?: string;
}

export interface PostPurchaseRecProduct {
  product_id?: string;
  _id?: string;
  id?: string;
  name: string;
  price?: number;
  image_url?: string;
  sport_type?: string;
  category?: string[];
  rating?: number;
  reviews_count?: number;
  colors?: string[];
  sizes?: string[];
  ai_explanation?: AIExplanation;
}
