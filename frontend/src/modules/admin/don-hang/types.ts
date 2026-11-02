export interface OrderLineItem {
  product_id?: string;
  product_name?: string;
  name?: string;
  color?: string;
  size?: string;
  quantity: number;
  price: number;
  image_url?: string;
}

export interface OrderItem {
  _id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address: string;
  created_at?: string;
  status: string;
  payment_method?: string;
  payment_status?: string;
  paid_at?: string | null;
  subtotal?: number;
  shipping_fee?: number;
  shipping_method?: string;
  discount_amount?: number;
  voucher_code?: string;
  total_amount: number;
  carrier?: string;
  tracking_code?: string;
  rejection_reason?: string;
  items?: OrderLineItem[];
}

export interface OrderMetricsData {
  totalCount: number;
  pendingCount: number;
  shippingCount: number;
  deliveredCount: number;
}

export type OrderViewMode = 'grid' | 'table';
