"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { useNotificationStore } from "@/shared/store/notificationStore";
import { useAuthStore } from "@/shared/store/authStore";
import NotificationItemCard from "./NotificationItemCard";

export default function NotificationsManager() {
  const { user } = useAuthStore();
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();
  const [filterType, setFilterType] = useState<string>("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    void fetchNotifications(user?.id || user?.email);
  }, [user, fetchNotifications]);

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filterType === "all") return true;
    return item.type === filterType;
  });

  const filterTabs = [
    { key: "all", label: "Tất cả", count: notifications.length },
    { key: "order", label: "Đơn hàng", count: notifications.filter((n) => n.type === "order").length },
    { key: "promotion", label: "Ưu đãi & Voucher", count: notifications.filter((n) => n.type === "promotion").length },
    { key: "ai_recommend", label: "Gợi ý AI", count: notifications.filter((n) => n.type === "ai_recommend").length },
    { key: "admin_message", label: "Thông báo hệ thống", count: notifications.filter((n) => n.type === "admin_message").length },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Bell size={22} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                Thông báo của tôi
                {unreadCount > 0 && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold font-sans tabular-nums">
                    {unreadCount} chưa đọc
                  </span>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Xem toàn bộ lịch sử thông báo đơn hàng, gợi ý AI và mã ưu đãi độc quyền từ Kady Sport
              </p>
            </div>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => markAllAsRead(user?.id || user?.email)}
            className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 border border-gray-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <CheckCheck size={16} />
            <span>Đánh dấu tất cả đã đọc</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = filterType === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterType(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer border ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono tabular-nums ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading && notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
            <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
            <span className="text-sm">Đang tải danh sách thông báo...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
              <Inbox size={26} />
            </div>
            <h3 className="text-base font-bold text-gray-800">Không có thông báo nào</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Bạn chưa có thông báo nào trong mục này. Khi Admin gửi thông báo hoặc có đơn hàng mới, thông tin sẽ được cập nhật tại đây.
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <NotificationItemCard
              key={item.notification_id || item.id}
              item={item}
              copiedCode={copiedCode}
              onCopyVoucher={handleCopyVoucher}
              onMarkAsRead={markAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
}
