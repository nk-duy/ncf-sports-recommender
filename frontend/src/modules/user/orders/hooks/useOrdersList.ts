"use client";

import { useState, useEffect, useCallback } from "react";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "@/shared/store/authStore";
import {
  normalizeOrderStatus,
  type OrderData,
  type ReviewingItem,
} from "../components/types";

export function useOrdersList() {
  const { token, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState<boolean>(() => Boolean(isAuthenticated && token));
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [reviewingItem, setReviewingItem] = useState<ReviewingItem | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: OrderData[] = await res.json();
        setOrders(data);
      }
    } catch {
      // keep existing orders on transient network error
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (active) await fetchOrders();
    };
    void run();
    return () => {
      active = false;
    };
  }, [fetchOrders]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;

    try {
      setIsCancelling(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        notifications.show({
          title: "Thành công",
          message: "Đã hủy đơn hàng thành công",
          color: "green",
        });
        await fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(null);
        }
      } else {
        const errorData = await res.json();
        notifications.show({
          title: "Thất bại",
          message: errorData.detail || "Không thể hủy đơn hàng",
          color: "red",
        });
      }
    } catch {
      notifications.show({
        title: "Lỗi kết nối",
        message: "Không thể kết nối đến máy chủ",
        color: "red",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingItem || !reviewComment.trim()) return;

    try {
      setIsSubmittingReview(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/reviews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          product_id: reviewingItem.productId,
          rating: reviewRating,
          comment: reviewComment,
          size_bought: reviewingItem.size,
          color_bought: reviewingItem.color,
        }),
      });

      if (res.ok) {
        notifications.show({
          title: "Đánh giá thành công!",
          message: `Cảm ơn bạn đã đóng góp đánh giá cho sản phẩm ${reviewingItem.productName}.`,
          color: "green",
        });
        setReviewingItem(null);
        setReviewComment("");
        setReviewRating(5);
      } else {
        const data = await res.json().catch(() => ({}));
        notifications.show({
          title: "Không thể gửi đánh giá",
          message: data.detail || "Đã có lỗi xảy ra khi gửi nhận xét.",
          color: "red",
        });
      }
    } catch {
      notifications.show({
        title: "Lỗi kết nối",
        message: "Không thể kết nối đến máy chủ",
        color: "red",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleResetFilter = () => {
    setSearchQuery("");
    setTimeFilter("all");
    setActiveTab("all");
    setCurrentPage(1);
  };

  const filteredOrders = orders.filter((order) => {
    const norm = normalizeOrderStatus(order.status);
    if (activeTab !== "all" && norm !== activeTab) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase().replace(/^#/, "");
      const rawQ = searchQuery.trim().toLowerCase();
      const matchId = order._id.toLowerCase().includes(q);
      const matchItem = order.items.some((item) =>
        item.product_name.toLowerCase().includes(rawQ)
      );
      if (!matchId && !matchItem) return false;
    }

    if (timeFilter !== "all") {
      const orderDate = new Date(order.created_at);
      const now = new Date();
      if (timeFilter === "3months") {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        if (orderDate < threeMonthsAgo) return false;
      } else if (timeFilter === "6months") {
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        if (orderDate < sixMonthsAgo) return false;
      } else if (timeFilter === "thisYear") {
        if (orderDate.getFullYear() !== now.getFullYear()) return false;
      }
    }

    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    orders,
    loading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    timeFilter,
    setTimeFilter,
    selectedOrder,
    setSelectedOrder,
    isCancelling,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    filteredOrders,
    totalPages,
    paginatedOrders,
    reviewingItem,
    setReviewingItem,
    reviewRating,
    setReviewRating,
    reviewComment,
    setReviewComment,
    isSubmittingReview,
    handleCancelOrder,
    handleSubmitReview,
    handleResetFilter,
  };
}
