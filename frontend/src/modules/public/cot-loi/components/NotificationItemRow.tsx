"use client";

import { Bell, Package, Gift, Sparkles, Copy, Check, ChevronRight } from "lucide-react";
import { NotificationItem } from "@/shared/store/notificationStore";

interface NotificationItemRowProps {
  item: NotificationItem;
  copiedCode: string | null;
  onSelect: (item: NotificationItem) => void;
  onCopyVoucher: (e: React.MouseEvent, code: string) => void;
}

function formatTimeAgo(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffSecs = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffSecs < 60) return "Vừa xong";
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
  } catch {
    return "";
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "order":
      return <Package size={15} className="text-emerald-600" />;
    case "promotion":
      return <Gift size={15} className="text-amber-600" />;
    case "ai_recommend":
      return <Sparkles size={15} className="text-purple-600" />;
    default:
      return <Bell size={15} className="text-blue-600" />;
  }
}

function getTypeBg(type: string): string {
  switch (type) {
    case "order":
      return "bg-emerald-50 border-emerald-100";
    case "promotion":
      return "bg-amber-50 border-amber-100";
    case "ai_recommend":
      return "bg-purple-50 border-purple-100";
    default:
      return "bg-blue-50 border-blue-100";
  }
}

export default function NotificationItemRow({
  item,
  copiedCode,
  onSelect,
  onCopyVoucher,
}: NotificationItemRowProps) {
  const isUnread = !item.is_read;

  return (
    <div
      onClick={() => onSelect(item)}
      className={`p-3.5 hover:bg-gray-50 transition-colors cursor-pointer flex items-start gap-3 relative ${
        isUnread ? "bg-blue-50/35" : "bg-white"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border ${getTypeBg(item.type)} mt-0.5`}
      >
        {getTypeIcon(item.type)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <h4
            className={`text-xs font-bold leading-snug line-clamp-2 ${
              isUnread ? "text-gray-900" : "text-gray-700"
            }`}
          >
            {item.title}
          </h4>
          {isUnread && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />}
        </div>

        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {item.message}
        </p>

        {item.voucher_code && (
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-mono text-[11px] font-bold">
              Mã: {item.voucher_code}
            </span>
            <button
              type="button"
              onClick={(e) => onCopyVoucher(e, item.voucher_code!)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 transition cursor-pointer"
            >
              {copiedCode === item.voucher_code ? (
                <>
                  <Check size={11} className="text-green-600" />
                  <span>Đã chép</span>
                </>
              ) : (
                <>
                  <Copy size={11} />
                  <span>Sao chép mã</span>
                </>
              )}
            </button>
          </div>
        )}

        <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
          <span>{formatTimeAgo(item.created_at)}</span>
          <span className="text-blue-600 hover:underline flex items-center gap-0.5">
            Chi tiết <ChevronRight size={11} />
          </span>
        </div>
      </div>
    </div>
  );
}
