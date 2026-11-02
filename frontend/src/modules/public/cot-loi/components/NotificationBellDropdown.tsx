"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, ChevronRight } from "lucide-react";
import { useNotificationStore, NotificationItem } from "@/shared/store/notificationStore";
import { useAuthStore } from "@/shared/store/authStore";
import NotificationItemRow from "./NotificationItemRow";

const emptySubscribe = () => () => {};

export default function NotificationBellDropdown() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Nếu chưa đăng nhập: Tuyệt đối không gọi API lấy thông báo cá nhân, xóa badge số đếm
    if (!user) {
      clearNotifications();
      return;
    }

    const userIdOrEmail = user.id || user.email;
    if (userIdOrEmail) {
      fetchNotifications(userIdOrEmail);
      const interval = setInterval(() => {
        fetchNotifications(userIdOrEmail);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications, clearNotifications]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopyVoucher = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.is_read) {
      await markAsRead(notif.notification_id || notif.id);
    }
    setIsOpen(false);
    router.push(notif.link || "/tai-khoan");
  };

  const activeUnreadCount = mounted && user ? unreadCount : 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center ${
          isOpen
            ? "bg-blue-50 text-blue-600 border-blue-200 shadow-xs"
            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 border-gray-200"
        }`}
        title="Thông báo"
        aria-label="Thông báo"
      >
        <Bell size={20} className={activeUnreadCount > 0 ? "text-blue-600" : "text-gray-700"} />

        {activeUnreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-red-600 border-2 border-white text-white text-[11px] font-bold rounded-full flex items-center justify-center font-sans tabular-nums shadow-xs animate-in zoom-in-75 duration-200">
            {activeUnreadCount > 99 ? "99+" : activeUnreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-white to-white">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">Thông báo</span>
              {user && activeUnreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 font-sans tabular-nums">
                  {activeUnreadCount} mới
                </span>
              )}
            </div>

            {user && activeUnreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead(user?.id || user?.email)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition cursor-pointer"
              >
                <CheckCheck size={14} />
                <span>Đã đọc tất cả</span>
              </button>
            )}
          </div>

          {!user ? (
            <div className="py-8 px-6 text-center flex flex-col items-center">
              <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3.5 shadow-xs border border-blue-100/80">
                <Bell size={24} className="text-blue-600" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-1.5">Thông báo của bạn</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-5 max-w-[270px]">
                Đăng nhập để theo dõi tiến độ đơn hàng, mã giảm giá và gợi ý AI dành riêng cho bạn
              </p>
              <Link
                href="/dang-nhap"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-2"
              >
                <span>Đăng nhập ngay</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          ) : (
            <>
              <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="py-10 px-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-2">
                      <Bell size={22} />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">Chưa có thông báo nào</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Các thông báo về đơn hàng &amp; ưu đãi sẽ xuất hiện tại đây
                    </p>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <NotificationItemRow
                      key={item.notification_id || item.id}
                      item={item}
                      copiedCode={copiedCode}
                      onSelect={handleNotificationClick}
                      onCopyVoucher={handleCopyVoucher}
                    />
                  ))
                )}
              </div>

              <div className="p-2.5 bg-gray-50 border-t border-gray-100 text-center">
                <Link
                  href="/tai-khoan/notifications"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition inline-flex items-center gap-1 py-1"
                >
                  <span>Xem tất cả thông báo của tôi</span>
                  <ChevronRight size={13} />
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
