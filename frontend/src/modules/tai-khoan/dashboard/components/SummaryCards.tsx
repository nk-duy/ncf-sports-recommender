"use client";

import React, { useEffect, useState } from "react";
import { Truck, Heart, CircleDollarSign } from "lucide-react";
import { useAuthStore } from "@/shared/store/authStore";
import { useWishlistStore } from "@/shared/store/wishlistStore";
import Link from "next/link";

export default function SummaryCards() {
  const { token, isAuthenticated } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const [stats, setStats] = useState({
    processing: 0,
    packaging: 0,
    delivering: 0,
    deliveredCount: 0,
    totalSpent: 0
  });

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchOrders();
    }
  }, [isAuthenticated, token]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/orders/my-orders", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const orders = await res.json();
        const deliveredOrders = orders.filter((o: any) => o.status === 'delivered');
        const totalDelivered = deliveredOrders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);

        setStats({
          processing: orders.filter((o: any) => ['pending', 'processing', 'confirmed', 'shipping'].includes(o.status)).length,
          packaging: orders.filter((o: any) => ['pending', 'confirmed'].includes(o.status)).length,
          delivering: orders.filter((o: any) => o.status === 'shipping').length,
          deliveredCount: deliveredOrders.length,
          totalSpent: totalDelivered
        });
      }
    } catch (err) {}
  };

  // 10,000 VND spent = 1 point
  const loyaltyPoints = Math.floor(stats.totalSpent / 10000);
  const voucherDiscountEstimate = Math.min(100000, loyaltyPoints * 1000);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Pending Orders Card */}
      <Link href="/tai-khoan/orders" className="block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-blue-200 transition-colors">
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
            {stats.processing}
          </span>
          <span className="text-sm font-medium text-blue-600">Đơn hàng</span>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          <span className="text-blue-500 mr-1">•</span>
          {stats.delivering} đơn đang giao, {stats.packaging} đơn chuẩn bị
        </p>
      </Link>

      {/* Wishlist Card */}
      <Link href="/tai-khoan/wishlist" className="block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-red-200 transition-colors">
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
            {wishlistItems.length}
          </span>
          <span className="text-sm font-medium text-red-500">Mặt hàng</span>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          <span className="text-red-500 mr-1">•</span>
          {wishlistItems.length > 0 ? "Bấm để xem danh sách quan tâm" : "Chưa có sản phẩm nào được lưu"}
        </p>
      </Link>

      {/* Reward Points Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Điểm tích lũy thể thao
          </h3>
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <CircleDollarSign size={16} />
          </div>
        </div>
        <div className="flex items-baseline mb-2">
          <span className="text-3xl font-bold text-gray-900 mr-2">
            {loyaltyPoints}
          </span>
          <span className="text-sm font-medium text-amber-600">Điểm thưởng</span>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          <span className="text-amber-500 mr-1">•</span>
          {voucherDiscountEstimate > 0 
            ? `Quy đổi voucher giảm ~${voucherDiscountEstimate.toLocaleString('vi-VN')} đ` 
            : "Tích 1 điểm cho mỗi 10.000 đ mua sắm"}
        </p>
      </div>
    </div>
  );
}
