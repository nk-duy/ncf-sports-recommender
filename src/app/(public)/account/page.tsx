import React from "react";
import SummaryCards from "@/modules/account/components/SummaryCards";
import RecentOrders from "@/modules/account/components/RecentOrders";
import AccountRecommendations from "@/modules/account/components/AccountRecommendations";
import { mockUserProfile } from "@/modules/account/data/mockAccountData";

export default function AccountOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Greeting Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Xin chào, {mockUserProfile.name}!
          </h1>
          <p className="text-gray-500 text-sm">
            Chào mừng bạn quay trở lại! Bạn đang có 2 đơn hàng đang trong tiến trình giao nhận.
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
