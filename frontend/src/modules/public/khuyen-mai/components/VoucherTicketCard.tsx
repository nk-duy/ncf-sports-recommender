"use client";

import { Check, Copy, Percent, Sparkles, Truck, Users } from "lucide-react";
import type { VoucherItem } from "../types";

function formatVoucherCurrency(val: number): string {
  if (val >= 1000000) return `${val / 1000000}Tr`;
  if (val >= 1000) return `${val / 1000}K`;
  return `${val}đ`;
}

function getVoucherStyle(v: VoucherItem) {
  if (v.code.includes("FREESHIP")) {
    return {
      badgeBg: "bg-blue-100 text-blue-700 border-blue-200",
      tag: "FREESHIP TOÀN SÀN",
      accent: "from-blue-600 to-cyan-600",
      btnColor: "bg-blue-600 hover:bg-blue-700",
      icon: Truck,
      iconColor: "text-blue-500",
    };
  }
  if (v.code.includes("WELCOME") || v.code.includes("NEWBIE")) {
    return {
      badgeBg: "bg-emerald-100 text-emerald-700 border-emerald-200",
      tag: "KHÁCH HÀNG MỚI",
      accent: "from-emerald-600 to-teal-600",
      btnColor: "bg-emerald-600 hover:bg-emerald-700",
      icon: Users,
      iconColor: "text-emerald-500",
    };
  }
  if (v.code.includes("MEGA") || v.discount_value >= 100000) {
    return {
      badgeBg: "bg-purple-100 text-purple-700 border-purple-200",
      tag: "SIÊU VOUCHER",
      accent: "from-purple-600 to-indigo-600",
      btnColor: "bg-purple-600 hover:bg-purple-700",
      icon: Sparkles,
      iconColor: "text-purple-500",
    };
  }
  return {
    badgeBg: "bg-red-100 text-red-700 border-red-200",
    tag: "VOUCHER HOT",
    accent: "from-red-600 to-amber-600",
    btnColor: "bg-red-600 hover:bg-red-700",
    icon: Percent,
    iconColor: "text-red-500",
  };
}

interface VoucherTicketCardProps {
  voucher: VoucherItem;
  isSaved: boolean;
  onSave: (v: VoucherItem) => void;
}

export default function VoucherTicketCard({
  voucher,
  isSaved,
  onSave,
}: VoucherTicketCardProps) {
  const style = getVoucherStyle(voucher);
  const IconComp = style.icon;
  const usagePercent = voucher.usage_limit
    ? Math.min(Math.round(((voucher.used_count || 0) / voucher.usage_limit) * 100), 100)
    : null;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${style.accent}`} />

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${style.badgeBg}`}
          >
            {style.tag}
          </span>
          <span className="text-slate-400">
            <IconComp className={`w-5 h-5 ${style.iconColor}`} />
          </span>
        </div>

        <div className="mb-2">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
            {voucher.discount_type === "percent"
              ? `GIẢM ${voucher.discount_value}%`
              : `GIẢM ${formatVoucherCurrency(voucher.discount_value)}`}
          </h3>
          <p className="text-xs text-slate-600 font-medium mt-1">
            {voucher.min_order_value > 0
              ? `Đơn tối thiểu ${formatVoucherCurrency(voucher.min_order_value)}`
              : "Áp dụng cho mọi đơn hàng"}
          </p>
          {voucher.max_discount && (
            <p className="text-[11px] text-slate-400">
              Giảm tối đa {formatVoucherCurrency(voucher.max_discount)}
            </p>
          )}
        </div>

        {usagePercent !== null && (
          <div className="my-2 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Đã dùng {usagePercent}%</span>
              {usagePercent >= 80 && <span className="text-red-500 font-black">SẮP CHÁY HÀNG</span>}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${style.accent}`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-dashed border-slate-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-mono text-xs font-bold">
            <span>{voucher.code}</span>
          </div>

          <button
            onClick={() => onSave(voucher)}
            className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm ${
              isSaved
                ? "bg-emerald-600 text-white"
                : `${style.btnColor} text-white hover:shadow-md transform hover:-translate-y-0.5`
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                ĐÃ LƯU
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                LƯU MÃ
              </>
            )}
          </button>
        </div>
      </div>

      {/* Serrated Ticket Cutout Notches on Left & Right */}
      <div className="absolute top-1/2 -left-2.5 w-5 h-5 bg-slate-50 rounded-full border-r border-slate-200 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 -right-2.5 w-5 h-5 bg-slate-50 rounded-full border-l border-slate-200 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}
