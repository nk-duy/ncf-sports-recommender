"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "@/shared/store/authStore";
import type { OrderData, ReviewingItem } from "../components/types";
import type { SubmittedReviewData } from "../components/ViewReviewModal";
import { reorderItemsToCart } from "../utils/reorderHelper";

export function useOrderDetail(id: string) {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  // Review states
  const [reviewingItem, setReviewingItem] = useState<ReviewingItem | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // View review states
  const [viewingItem, setViewingItem] = useState<ReviewingItem | null>(null);
  const [viewReviewData, setViewReviewData] = useState<SubmittedReviewData | null>(null);
  const [isViewReviewOpen, setIsViewReviewOpen] = useState(false);
  const [isLoadingReview, setIsLoadingReview] = useState(false);

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

  const handleUploadReviewImage = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (reviewImages.length >= 4) return;

    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const customerToken =
        (typeof window !== "undefined" ? localStorage.getItem("kady_customer_token") : null) ||
        token;
      const res = await fetch(`${apiUrl}/api/v1/uploads/`, {
        method: "POST",
        headers: {
          ...(customerToken ? { Authorization: `Bearer ${customerToken}` } : {}),
        },
        body: formData,
      });
      if (res.ok) {
        const data: { url?: string } = await res.json();
        if (data.url) {
          setReviewImages((prev) => [...prev, data.url as string]);
        }
      }
    } catch (err) {
      console.error("Lỗi tải ảnh đánh giá:", err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveReviewImage = (index: number) => {
    setReviewImages((prev) => prev.filter((_, i) => i !== index));
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
          title: reviewTitle.trim() || undefined,
          comment: reviewComment.trim(),
          size_bought: reviewingItem.size,
          color_bought: reviewingItem.color,
          images: reviewImages,
          order_id: reviewingItem.orderId,
        }),
      });

      if (res.ok) {
        notifications.show({
          title: "Đánh giá thành công!",
          message: `Cảm ơn bạn đã đóng góp đánh giá cho sản phẩm ${reviewingItem.productName}.`,
          color: "green",
        });

        // Ẩn hoàn toàn nút Đánh giá sản phẩm của đơn hàng đó
        if (order && reviewingItem.orderId && order._id === reviewingItem.orderId) {
          setOrder({ ...order, is_reviewed: true });
        }
        setReviewingItem(null);
        setReviewTitle("");
        setReviewComment("");
        setReviewImages([]);
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

  const handleViewReview = async (ord: OrderData, item?: ReviewingItem) => {
    const targetItem: ReviewingItem = item || {
      productId: ord.items?.[0]?.product_id || "",
      productName: ord.items?.[0]?.product_name || "Sản phẩm",
      size: ord.items?.[0]?.size,
      color: ord.items?.[0]?.color,
      imageUrl: ord.items?.[0]?.image_url || ord.items?.[0]?.image,
      orderId: ord._id,
    };

    setViewingItem(targetItem);
    setViewReviewData(null);
    setIsViewReviewOpen(true);
    setIsLoadingReview(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const customerToken =
        (typeof window !== "undefined" ? localStorage.getItem("kady_customer_token") : null) ||
        token;

      const orderParam = encodeURIComponent(ord._id);
      const prodParam = targetItem.productId ? `?product_id=${encodeURIComponent(targetItem.productId)}` : "";
      const res = await fetch(`${apiUrl}/api/v1/reviews/order/${orderParam}${prodParam}`, {
        headers: {
          ...(customerToken ? { Authorization: `Bearer ${customerToken}` } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        setViewReviewData({
          id: data.id,
          rating: data.rating,
          title: data.title,
          comment: data.comment,
          size_bought: data.size_bought,
          color_bought: data.color_bought,
          images: data.images,
          timestamp: data.timestamp,
          product_name: targetItem.productName,
          product_id: targetItem.productId,
          order_id: ord._id,
        });
      } else {
        const myRes = await fetch(`${apiUrl}/api/v1/reviews/me`, {
          headers: {
            ...(customerToken ? { Authorization: `Bearer ${customerToken}` } : {}),
          },
        });
        if (myRes.ok) {
          const myReviews: any[] = await myRes.json();
          const cleanOrderId = ord._id.replace("#", "").trim();
          const matched = myReviews.find(
            (r) =>
              (r.order_id && (r.order_id === ord._id || r.order_id === cleanOrderId)) ||
              (targetItem.productId && r.product_id === targetItem.productId)
          );
          if (matched) {
            setViewReviewData({
              id: matched.id,
              rating: matched.rating,
              title: matched.title,
              comment: matched.comment,
              size_bought: matched.size_bought,
              color_bought: matched.color_bought,
              images: matched.images,
              timestamp: matched.timestamp,
              product_name: targetItem.productName,
              product_id: targetItem.productId,
              order_id: ord._id,
            });
          } else {
            notifications.show({
              title: "Thông báo",
              message: "Chưa tìm thấy dữ liệu đánh giá cho đơn hàng này.",
              color: "orange",
            });
          }
        }
      }
    } catch {
      notifications.show({
        title: "Lỗi kết nối",
        message: "Không thể kết nối đến máy chủ để lấy đánh giá.",
        color: "red",
      });
    } finally {
      setIsLoadingReview(false);
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
    reviewTitle,
    setReviewTitle,
    reviewComment,
    setReviewComment,
    reviewImages,
    isUploadingImage,
    handleUploadReviewImage,
    handleRemoveReviewImage,
    isSubmittingReview,
    handleReorder,
    handleCancelOrder,
    handleSubmitReview,
    // View review states
    viewingItem,
    setViewingItem,
    viewReviewData,
    setViewReviewData,
    isViewReviewOpen,
    setIsViewReviewOpen,
    isLoadingReview,
    handleViewReview,
  };
}