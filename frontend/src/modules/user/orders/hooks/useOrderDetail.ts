"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "@/shared/store/authStore";
import type { OrderData, ReviewingItem } from "../components/types";
import { reorderItemsToCart } from "../utils/reorderHelper";

export function useOrderDetail(id: string) {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  const [reviewingItem, setReviewingItem] = useState<ReviewingItem | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const customerToken =
        (typeof window !== "undefined" ? localStorage.getItem("kady_customer_token") : null) ||
        token;
      const res = await fetch(`${apiUrl}/api/v1/orders/${id}`, {
        headers: {
          ...(customerToken ? { Authorization: `Bearer ${customerToken}` } : {}),
        },
      });
      if (res.ok) {
        const data: OrderData = await res.json();
        setOrder(data);
      } else {
        notifications.show({
          title: "Không tìm thấy đơn hàng",
          message: "Mã đơn hàng không hợp lệ hoặc bạn không có quyền xem đơn hàng này",
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
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    void fetchOrder();
  }, [fetchOrder, isAuthenticated]);

  const handleReorder = () => {
    reorderItemsToCart(order, (href) => router.push(href));
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;

    try {
      setIsCancelling(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const customerToken = localStorage.getItem("kady_customer_token") || token;
      const res = await fetch(`${apiUrl}/api/v1/orders/${order._id || id}/cancel`, {
        method: "PUT",
        headers: {
          ...(customerToken ? { Authorization: `Bearer ${customerToken}` } : {}),
        },
      });

      if (res.ok) {
        notifications.show({
          title: "Thành công",
          message: "Đã hủy đơn hàng thành công!",
          color: "green",
        });
        await fetchOrder();
      } else {
        const errorData = await res.json().catch(() => ({}));
        notifications.show({
          title: "Thất bại",
          message: errorData.detail || "Không thể hủy đơn hàng này",
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
      const customerToken = localStorage.getItem("kady_customer_token") || token;
      const res = await fetch(`${apiUrl}/api/v1/reviews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customerToken ? { Authorization: `Bearer ${customerToken}` } : {}),
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
          message: data.detail || "Đã có lỗi xảy ra khi gửi đánh giá.",
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

  return {
    order,
    loading,
    isCancelling,
    reviewingItem,
    setReviewingItem,
    reviewRating,
    setReviewRating,
    reviewComment,
    setReviewComment,
    isSubmittingReview,
    handleReorder,
    handleCancelOrder,
    handleSubmitReview,
  };
}
