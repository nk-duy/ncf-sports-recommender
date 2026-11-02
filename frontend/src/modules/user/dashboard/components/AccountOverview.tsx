"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Bell, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/shared/store/authStore";
import { useNotificationStore } from "@/shared/store/notificationStore";
import SummaryCards from "./SummaryCards";
import RecentOrders from "./RecentOrders";
import AccountRecommendations from "./Recommendations";

export default function AccountOverview() {
  const { user } = useAuthStore();
  const { unreadCount, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    void fetchNotifications(user?.id || user?.email);
  }, [user, fetchNotifications]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Xin chào, {user?.full_name || user?.username || "Quý khách"}!
          </h1>
          <p className="text-gray-500 text-sm">
            Chào mừng bạn quay trở lại! Quản lý thông tin cá nhân và lịch sử đơn hàng của bạn tại đây.
          </p>
        </div>

        {unreadCount > 0 && (
          <Link
            href="/tai-khoan/notifications"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-bold transition shadow-xs shrink-0"
          >
            <Bell size={16} className="text-blue-600 animate-bounce" />
            <span>Bạn có {unreadCount} thông báo mới</span>
            <ArrowRight size={14} />
          </Link>
        )}
      </div>

      <SummaryCards />
      <RecentOrders />
      <AccountRecommendations />
    </div>
  );
}
