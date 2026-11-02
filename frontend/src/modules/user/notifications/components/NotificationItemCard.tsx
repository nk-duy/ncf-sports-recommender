"use client";

import Link from "next/link";
import {
  Bell,
  Package,
  Gift,
  Sparkles,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";
import type { NotificationItem } from "@/shared/store/notificationStore";

interface NotificationItemCardProps {
  item: NotificationItem;
  copiedCode: string | null;
  onCopyVoucher: (code: string) => void;
  onMarkAsRead: (notificationId: string) => void;
}

function formatDateTime(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function getTypeMeta(type: string) {
  switch (type) {
    case "order":
      return {
        icon: <Package size={18} className="text-emerald-600" />,
        label: "Đơn hàng",
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        cardBorder: "hover:border-emerald-200",
      };
    case "promotion":
      return {
        icon: <Gift size={18} className="text-amber-600" />,
        label: "Ưu đãi & Voucher",
        badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
        cardBorder: "hover:border-amber-200",
      };
    case "ai_recommend":
      return {
        icon: <Sparkles size={18} className="text-purple-600" />,
        label: "Gợi ý AI",
        badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
        cardBorder: "hover:border-purple-200",
      };
    default:
      return {
        icon: <Bell size={18} className="text-blue-600" />,
        label: "Hệ thống",
        badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
        cardBorder: "hover:border-blue-200",
      };
  }
}

export default function NotificationItemCard({
  item,
  copiedCode,
  onCopyVoucher,
  onMarkAsRead,
}: NotificationItemCardProps) {
  const isUnread = !item.is_read;
  const meta = getTypeMeta(item.type);
  const targetId = item.notification_id || item.id;

  return (
    <div
      className={`bg-white rounded-2xl border p-5 transition-all duration-200 ${
        isUnread
          ? "border-blue-200 bg-blue-50/20 shadow-xs"
          : "border-gray-100 shadow-2xs hover:shadow-xs"
      } ${meta.cardBorder}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
          {meta.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.badgeBg}`}>
                {meta.label}
              </span>
              {isUnread && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                  Mới
                </span>
              )}
              <span className="text-xs text-gray-400 font-mono">
                {formatDateTime(item.created_at)}
              </span>
            </div>

            {isUnread && (
              <button
                type="button"
                onClick={() => onMarkAsRead(targetId)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 shrink-0 cursor-pointer"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <h3 className={`text-base font-bold mt-2 leading-snug ${isUnread ? "text-gray-900" : "text-gray-800"}`}>
            {item.title}
          </h3>

          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.message}</p>

          {item.voucher_code && (
            <div className="mt-3.5 p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                  <Gift size={16} />
                </div>
                <div>
                  <span className="text-xs text-amber-900 font-medium block">
                    Mã giảm giá độc quyền dành cho bạn:
                  </span>
                  <span className="text-sm font-black font-mono text-amber-950 tracking-wider">
                    {item.voucher_code}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onCopyVoucher(item.voucher_code!)}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              >
                {copiedCode === item.voucher_code ? (
                  <>
                    <Check size={14} className="text-white" />
                    <span>Đã sao chép!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Sao chép mã</span>
                  </>
                )}
              </button>
            </div>
          )}

          {item.link && (
            <div className="mt-4 pt-3 border-t border-gray-100/80 flex items-center justify-end">
              <Link
                href={item.link}
                onClick={() => {
                  if (!item.is_read) onMarkAsRead(targetId);
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
              >
                <span>Xem chi tiết điều hướng</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
