"use client";

import { useEffect, useState, useCallback } from "react";
import { Truck, Heart, CircleDollarSign } from "lucide-react";
import { useAuthStore } from "@/shared/store/authStore";
import { useWishlistStore } from "@/shared/store/wishlistStore";
import Link from "next/link";
import type { OrderData } from "@/modules/user/orders/components/types";

function getTierInfo(spent: number) {
  if (spent >= 10000000) {
    return {
      tier: "Kim Cương (VIP)",
      nextText: "Đã đạt hạng thành viên cao nhất (VIP)",
    };
  }
  if (spent >= 5000000) {
    const remaining = 10000000 - spent;
    return {
      tier: "Vàng",
      nextText: `Còn thiếu ${remaining.toLocaleString("vi-VN")} đ để thăng hạng tiếp theo`,
    };
  }
  if (spent >= 2000000) {
    const remaining = 5000000 - spent;
    return {
      tier: "Bạc",
      nextText: `Còn thiếu ${remaining.toLocaleString("vi-VN")} đ để thăng hạng tiếp theo`,
    };
  }
  const remaining = 2000000 - spent;
  return {
    tier: "Đồng",
    nextText: `Còn thiếu ${remaining.toLocaleString("vi-VN")} đ để thăng hạng tiếp theo`,
  };
}

export default function SummaryCards() {
  const { token, isAuthenticated } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const [stats, setStats] = useState({
    processing: 0,
    packaging: 0,
    delivering: 0,
    deliveredCount: 0,
    totalSpent: 0,
  });

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const orders: OrderData[] = await res.json();
        const isCancelled = (s?: string) =>
          ["cancelled", "canceled", "rejected", "đã hủy", "từ chối"].includes(
            (s || "").toLowerCase()
          );
        const validOrders = orders.filter((o) => !isCancelled(o.status));
        const totalValidSpent = validOrders.reduce(
          (sum, o) => sum + (o.total_amount || 0),
          0
        );

        const isDelivered = (s?: string) =>
          ["delivered", "completed", "đã giao", "hoàn tất"].includes(
            (s || "").toLowerCase()
          );
        const deliveredOrders = orders.filter((o) => isDelivered(o.status));

        setStats({
          processing: orders.filter((o) =>
            [
              "pending",
              "processing",
              "confirmed",
              "shipping",
              "chờ duyệt",
              "đang giao",
            ].includes((o.status || "").toLowerCase())
          ).length,
          packaging: orders.filter((o) =>
            ["pending", "confirmed", "chờ duyệt"].includes(
              (o.status || "").toLowerCase()
            )
          ).length,
          delivering: orders.filter((o) =>
            ["shipping", "shipped", "đang giao"].includes(
              (o.status || "").toLowerCase()
            )
          ).length,
          deliveredCount: deliveredOrders.length,
          totalSpent: totalValidSpent,
        });
      }
    } catch {
      // ignore transient network errors
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      void fetchOrders();
      void useWishlistStore.getState().syncWithBackend();
    }
  }, [isAuthenticated, token, fetchOrders]);

  // 10,000 VND spent = 1 point
  const loyaltyPoints = Math.floor(stats.totalSpent / 10000);
  const tierInfo = getTierInfo(stats.totalSpent);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Link
        href="/tai-khoan/orders"
        className="block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-blue-200 transition-colors"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Đơn hàng đang xử lý
          </h3>
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Truck size={16} />
          </div>
        </div>
        <div className="flex items-baseline mb-2">
          <span className="text-3xl font-bold text-gray-900 mr-2 tabular-nums">
            {stats.processing}
          </span>
          <span className="text-sm font-medium text-blue-600">Đơn hàng</span>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          <span className="text-blue-500 mr-1">•</span>
          {stats.delivering} đơn đang giao, {stats.packaging} đơn chuẩn bị
        </p>
      </Link>

      <Link
        href="/tai-khoan/wishlist"
        className="block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-red-200 transition-colors"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Sản phẩm yêu thích
          </h3>
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <Heart size={16} className="fill-red-500" />
          </div>
        </div>
        <div className="flex items-baseline mb-2">
          <span className="text-3xl font-bold text-gray-900 mr-2 tabular-nums">
            {wishlistItems.length}
          </span>
          <span className="text-sm font-medium text-red-500">Mặt hàng</span>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          <span className="text-red-500 mr-1">•</span>
          {wishlistItems.length > 0
            ? "Bấm để xem danh sách quan tâm"
            : "Chưa có sản phẩm nào được lưu"}
        </p>
      </Link>

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
          <span className="text-3xl font-bold text-gray-900 mr-2 tabular-nums">
            {loyaltyPoints}
          </span>
          <span className="text-sm font-medium text-amber-600">Điểm thưởng</span>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          <span className="text-amber-500 mr-1">•</span>
          {tierInfo.nextText}
        </p>
      </div>
    </div>
  );
}
