import type { LucideIcon } from "lucide-react";

export type CustomerTabType = "all" | "vip" | "new" | "potential" | "churn_risk";

export interface TierColorSet {
  bg: string;
  text: string;
  icon: string;
  badge: string;
  badgeText: string;
}

export interface TierVisualConfig {
  icon: LucideIcon;
  colors: TierColorSet;
}

export interface RawCustomerApiItem {
  id: string;
  code?: string;
  name: string;
  full_name?: string;
  initials: string;
  email: string;
  phone: string;
  address: string;
  tier: string;
  sports: string[];
  orders: number;
  spent: number;
  lastPurchase: string;
  joinDate: string;
  loyalty_points?: number;
  returnRate?: string;
  aiScore?: number;
  aiProfile?: string;
  shoeSize?: string;
  colors?: string[];
  colorNames?: string;
}

export interface CustomerItem extends RawCustomerApiItem {
  tierIcon: LucideIcon;
  tierColors: TierColorSet;
  spentShort: string;
  spentFormatted: string;
}

export interface CustomerStats {
  total: number;
  active: number;
  vip: number;
  new: number;
  potential: number;
  churn_risk: number;
  clv: number;
}

export interface CustomerOrderSummary {
  id: string;
  code: string;
  created_at: string;
  first_item_name: string;
  items_count?: number;
  total_amount?: number;
  status: string;
  payment_method?: string;
}

export interface VoucherOptionItem {
  id?: string;
  _id?: string;
  code: string;
  discount_type: string;
  discount_value: number;
}

export type NotificationType = "admin_message" | "ai_recommend" | "order";

export interface NotificationTemplate {
  label: string;
  title: string;
  message: string;
  link: string;
}

export interface VoucherTarget {
  count: number;
  ids?: string[];
  name?: string;
}
