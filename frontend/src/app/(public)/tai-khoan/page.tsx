"use client";

import React from "react";
import { useAuthStore } from "@/shared/store/authStore";
import SummaryCards from "@/modules/tai-khoan/dashboard/components/SummaryCards";
import RecentOrders from "@/modules/tai-khoan/dashboard/components/RecentOrders";
import AccountRecommendations from "@/modules/tai-khoan/dashboard/components/Recommendations";
import { mockUserProfile } from "@/modules/tai-khoan/data/mockAccountData";

export default function AccountOverviewPage() {
  const { user } = useAuthStore();
  
  return (
    <div className="space-y-6">
      {/* Greeting Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Xin chào, {user?.full_name || user?.username || mockUserProfile.name}!
          </h1>
          <p className="text-gray-500 text-sm">
            Chào mừng bạn quay trở lại! Quản lý thông tin cá nhân và lịch sử đơn hàng của bạn tại đây.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full flex items-center text-sm font-bold border border-yellow-200">
            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
            Hạng thành viên: {mockUserProfile.memberRank}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Recent Orders */}
      <RecentOrders />

      {/* AI Recommendations */}
      <AccountRecommendations />
    </div>
  );
}
