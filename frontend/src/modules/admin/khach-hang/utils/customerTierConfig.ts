import { Diamond, Medal, Shield, Star, UserCheck } from "lucide-react";
import type { CustomerItem, RawCustomerApiItem, TierVisualConfig } from "../types";

export const tierConfig: Record<string, TierVisualConfig> = {
  "Kim Cương (VIP)": {
    icon: Diamond,
    colors: { bg: "bg-emerald-100", text: "text-emerald-800", icon: "text-emerald-600", badge: "bg-emerald-500", badgeText: "text-white" },
  },
  "Kim Cương": {
    icon: Diamond,
    colors: { bg: "bg-emerald-100", text: "text-emerald-800", icon: "text-emerald-600", badge: "bg-emerald-500", badgeText: "text-white" },
  },
  "Vàng": {
    icon: Medal,
    colors: { bg: "bg-amber-100", text: "text-amber-800", icon: "text-amber-600", badge: "bg-amber-500", badgeText: "text-white" },
  },
  "Bạc": {
    icon: Shield,
    colors: { bg: "bg-gray-200", text: "text-gray-800", icon: "text-gray-600", badge: "bg-gray-400", badgeText: "text-white" },
  },
  "Đồng": {
    icon: Star,
    colors: { bg: "bg-orange-100", text: "text-orange-800", icon: "text-orange-600", badge: "bg-orange-400", badgeText: "text-white" },
  },
  "Đồng (Mới)": {
    icon: Star,
    colors: { bg: "bg-orange-100", text: "text-orange-800", icon: "text-orange-600", badge: "bg-orange-400", badgeText: "text-white" },
  },
  default: {
    icon: UserCheck,
    colors: { bg: "bg-blue-100", text: "text-blue-800", icon: "text-blue-600", badge: "bg-blue-500", badgeText: "text-white" },
  },
};

export function mapCustomerWithTier(c: RawCustomerApiItem): CustomerItem {
  const tConfig = tierConfig[c.tier] || tierConfig.default;
  const spentNum = Number(c.spent) || 0;
  return {
    ...c,
    sports: Array.isArray(c.sports) ? c.sports : [],
    tierIcon: tConfig.icon,
    tierColors: tConfig.colors,
    spentShort: `${(spentNum / 1000000).toFixed(2)} tr`,
    spentFormatted: `${spentNum.toLocaleString("vi-VN")} đ`,
  };
}
