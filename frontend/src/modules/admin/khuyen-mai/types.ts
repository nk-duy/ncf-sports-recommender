export interface VoucherItem {
  _id: string;
  code: string;
  title?: string;
  description?: string;
  name?: string;
  discount_type: string;
  discount_value: number;
  max_discount?: number | null;
  min_order_value: number;
  usage_limit?: number | null;
  used_count?: number;
  valid_from?: string | null;
  valid_until?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  expiry_date?: string | null;
  expired_at?: string | null;
  created_at?: string | null;
  applicable_categories?: string[] | null;
  is_active: boolean;
}
