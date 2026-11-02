"use client";

import { Edit2, Trash2, Copy, CheckCircle2 } from "lucide-react";
import { VoucherItem } from "../types";

interface VoucherTableRowProps {
  voucher: VoucherItem;
  copiedId: string | null;
  onCopy: (code: string, id: string) => void;
  onToggleStatus: (voucher: VoucherItem) => void;
  onEdit: (voucher: VoucherItem) => void;
  onDelete: (id: string) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatDate(dateString?: string | null): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function VoucherTableRow({
  voucher,
  copiedId,
  onCopy,
  onToggleStatus,
  onEdit,
  onDelete,
}: VoucherTableRowProps) {
  const usedCount = voucher.used_count || 0;

  return (
    <tr className="hover:bg-slate-50/70 transition-colors">
      <td className="px-3.5 py-3 font-bold text-slate-900">
        <div className="flex items-center gap-2">
          <span className="font-sans tabular-nums font-bold bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-md tracking-wider text-slate-900">
            {voucher.code}
          </span>
          <button
            onClick={() => onCopy(voucher.code, voucher._id)}
            className={`size-8 inline-flex items-center justify-center rounded-lg transition-colors duration-150 ${
              copiedId === voucher._id
                ? "bg-emerald-100 text-emerald-600"
                : "text-slate-400 hover:text-blue-600 hover:bg-slate-100"
            }`}
            title="Copy mã code"
            aria-label="Copy mã code"
          >
            {copiedId === voucher._id ? <CheckCircle2 size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </td>
      <td className="px-3.5 py-3">
        <span className="font-bold text-rose-600 tabular-nums">
          {voucher.discount_type === "percent"
            ? `${voucher.discount_value}%`
            : voucher.discount_type === "freeship"
            ? "Miễn phí vận chuyển"
            : formatCurrency(voucher.discount_value)}
        </span>
        {voucher.max_discount && (
          <div className="text-[11px] font-medium text-slate-500 mt-0.5 tabular-nums">
            Tối đa {formatCurrency(voucher.max_discount)}
          </div>
        )}
      </td>
      <td className="px-3.5 py-3 text-slate-600 font-medium">
        <div className="tabular-nums">Đơn từ {formatCurrency(voucher.min_order_value)}</div>
        {voucher.applicable_categories && voucher.applicable_categories.length > 0 && (
          <div className="text-[11px] text-blue-600 bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5 w-max mt-1 font-medium">
            Áp dụng: {voucher.applicable_categories.join(", ")}
          </div>
        )}
      </td>
      <td className="px-3.5 py-3">
        <div className="flex flex-col gap-1.5 w-24">
          <div className="text-xs font-semibold text-slate-700 flex justify-between tabular-nums">
            <span>{usedCount}</span>
            <span className="text-slate-400">
              / {voucher.usage_limit ? voucher.usage_limit : "∞"}
            </span>
          </div>
          {voucher.usage_limit && (
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  usedCount / voucher.usage_limit >= 1 ? "bg-rose-500" : "bg-blue-600"
                }`}
                style={{
                  width: `${Math.min((usedCount / voucher.usage_limit) * 100, 100)}%`,
                }}
              ></div>
            </div>
          )}
        </div>
      </td>
      <td className="px-3.5 py-3">
        {!voucher.valid_from && !voucher.valid_until ? (
          <span className="whitespace-nowrap inline-flex items-center px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md text-xs font-medium border border-purple-100">
            Vĩnh viễn
          </span>
        ) : (
          <div className="flex flex-col text-xs text-slate-600 gap-1 tabular-nums">
            {voucher.valid_from && (
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500"></span>
                <span className="font-medium text-slate-700">
                  {formatDate(voucher.valid_from)}
                </span>
              </span>
            )}
            {voucher.valid_until && (
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-rose-500"></span>
                <span className="font-medium text-slate-700">
                  {formatDate(voucher.valid_until)}
                </span>
              </span>
            )}
          </div>
        )}
      </td>
      <td className="px-3.5 py-3 text-center">
        <button
          onClick={() => onToggleStatus(voucher)}
          className={`whitespace-nowrap inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-medium transition-colors min-w-[95px] mx-auto cursor-pointer ${
            voucher.is_active
              ? "bg-emerald-50 text-emerald-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 group border border-emerald-200/60"
              : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 group border border-slate-200/60"
          }`}
          title={voucher.is_active ? "Nhấn để tạm dừng" : "Nhấn để kích hoạt lại"}
        >
          <span className="group-hover:hidden">
            {voucher.is_active ? "Đang chạy" : "Đã dừng"}
          </span>
          <span className="hidden group-hover:block">
            {voucher.is_active ? "Tạm dừng" : "Kích hoạt"}
          </span>
        </button>
      </td>
      <td className="px-3.5 py-3">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(voucher)}
            className="size-8 inline-flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors duration-150"
            title="Chỉnh sửa voucher"
            aria-label="Chỉnh sửa voucher"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => onDelete(voucher._id)}
            className="size-8 inline-flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-150"
            title="Xóa voucher"
            aria-label="Xóa voucher"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
