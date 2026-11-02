export interface TrackedOrderItem {
  product_id?: string;
  name?: string;
  product_name?: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image_url?: string;
}

export interface TrackedOrder {
  _id: string;
  status: string;
  created_at?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  payment_method?: string;
  payment_status?: string;
  carrier?: string;
  tracking_code?: string;
  rejection_reason?: string;
  items: TrackedOrderItem[];
  subtotal?: number;
  shipping_fee?: number;
  discount_amount?: number;
  voucher_code?: string;
  total_amount: number;
  shipping_method?: string;
}

export const SPORTS_TRACKING_FALLBACK_IMG =
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80';

export function formatOrderPrice(price?: number): string {
  if (price === undefined || price === null) return '0 ₫';
  return `${price.toLocaleString('vi-VN')} ₫`;
}
