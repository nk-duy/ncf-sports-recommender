"use client";

import React, { useEffect, useState } from "react";
import { Truck, Heart, CircleDollarSign } from "lucide-react";
import { useAuthStore } from "@/shared/store/authStore";

export default function SummaryCards() {
  const { token, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState({
    processing: 0,
    packaging: 0,
    delivering: 0
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
        setStats({
          processing: orders.filter((o: any) => ['pending', 'processing', 'shipping'].includes(o.status)).length,
          packaging: orders.filter((o: any) => ['pending', 'processing'].includes(o.status)).length,
          delivering: orders.filter((o: any) => o.status === 'shipping').length
        });
      }
    } catch (err) {}
  };

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
            {stats.processing}
          </span>
          <span className="text-sm font-medium text-blue-600">Đơn hàng</span>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          <span className="text-blue-500 mr-1">•</span>
          {stats.delivering} đơn đang giao, {stats.packaging} đơn đóng gói
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
            0
          </span>
          <span className="text-sm font-medium text-red-500">Mặt hàng</span>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          <span className="text-red-500 mr-1">•</span>
          Có 0 sản phẩm đang có Flash Sale
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
            0
          </span>
          <span className="text-sm font-medium text-yellow-600">Điểm thưởng</span>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          <span className="text-yellow-500 mr-1">•</span>
          Đổi được Voucher giảm 0 đ
        </p>
      </div>
    </div>
  );
}
