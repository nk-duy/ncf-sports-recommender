import React from "react";
import { Truck, Heart, CircleDollarSign } from "lucide-react";
import { mockSummaryStats } from "../data/mockAccountData";

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Pending Orders Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Đơn hàng đang xử lý
          </h3>
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Truck size={16} />
          </div>
        </div>
        <div className="flex items-baseline mb-2">
          <span className="text-3xl font-bold text-gray-900 mr-2">
            {mockSummaryStats.processingOrders.count}
          </span>
          <span className="text-sm font-medium text-blue-600">Đơn hàng</span>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          <span className="text-blue-500 mr-1">•</span>
          {mockSummaryStats.processingOrders.delivering} đơn đang giao, {mockSummaryStats.processingOrders.packaging} đơn đóng gói
        </p>
      </div>

      {/* Wishlist Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Sản phẩm yêu thích
          </h3>
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <Heart size={16} className="fill-red-500" />
          </div>
        </div>
        <div className="flex items-baseline mb-2">
          <span className="text-3xl font-bold text-gray-900 mr-2">
            {mockSummaryStats.wishlist.count}
          </span>
          <span className="text-sm font-medium text-red-500">Mặt hàng</span>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          <span className="text-red-500 mr-1">•</span>
          Có {mockSummaryStats.wishlist.flashSale} sản phẩm đang có Flash Sale
        </p>
      </div>

      {/* Reward Points Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Điểm tích lũy
          </h3>
          <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
            <CircleDollarSign size={16} />
          </div>
        </div>
        <div className="flex items-baseline mb-2">
          <span className="text-3xl font-bold text-gray-900 mr-2">
            {mockSummaryStats.rewardPoints.points.toLocaleString("vi-VN")}
          </span>
          <span className="text-sm font-medium text-yellow-600">Điểm thưởng</span>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          <span className="text-yellow-500 mr-1">•</span>
          Đổi được Voucher giảm {mockSummaryStats.rewardPoints.voucherValue.toLocaleString("vi-VN")} đ
        </p>
      </div>
    </div>
  );
}
