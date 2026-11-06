"use client";

import { useState, useEffect, useCallback } from "react";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "@/shared/store/authStore";
import {
  normalizeOrderStatus,
  type OrderData,
  type ReviewingItem,
} from "../components/types";
import type { SubmittedReviewData } from "../components/ViewReviewModal";

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

  // Review creation state
  const [reviewingItem, setReviewingItem] = useState<ReviewingItem | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // View submitted review state
  const [viewingItem, setViewingItem] = useState<ReviewingItem | null>(null);
  const [viewReviewData, setViewReviewData] = useState<SubmittedReviewData | null>(null);
  const [isViewReviewOpen, setIsViewReviewOpen] = useState(false);
  const [isLoadingReview, setIsLoadingReview] = useState(false);

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
      const customerToken =
        (typeof window !== "undefined" ? localStorage.getItem("kady_customer_token") : null) ||
        token;
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

        // Cập nhật trạng thái is_reviewed vào danh sách đơn
        if (reviewingItem.orderId) {
          setOrders((prev) =>
            prev.map((ord) =>
              ord._id === reviewingItem.orderId ? { ...ord, is_reviewed: true } : ord
            )
          );
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

  const handleViewReview = async (order: OrderData, item?: ReviewingItem) => {
    const targetItem: ReviewingItem = item || {
      productId: order.items?.[0]?.product_id || "",
      productName: order.items?.[0]?.product_name || "Sản phẩm",
      size: order.items?.[0]?.size,
      color: order.items?.[0]?.color,
      imageUrl: order.items?.[0]?.image_url || order.items?.[0]?.image,
      orderId: order._id,
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

      const orderParam = encodeURIComponent(order._id);
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
          order_id: order._id,
        });
      } else {
        // Fallback: truy vấn GET /api/v1/reviews/me
        const myRes = await fetch(`${apiUrl}/api/v1/reviews/me`, {
          headers: {
            ...(customerToken ? { Authorization: `Bearer ${customerToken}` } : {}),
          },
        });
        if (myRes.ok) {
          const myReviews: any[] = await myRes.json();
          const cleanOrderId = order._id.replace("#", "").trim();
          const matched = myReviews.find(
            (r) =>
              (r.order_id && (r.order_id === order._id || r.order_id === cleanOrderId)) ||
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
              order_id: order._id,
            });
          } else {
            notifications.show({
              title: "Thông báo",
              message: "Chưa tìm thấy dữ liệu đánh giá cho đơn hàng này.",
              color: "orange",
            });
          }
        } else {
          notifications.show({
            title: "Không thể tải đánh giá",
            message: "Đã có lỗi xảy ra khi lấy nội dung đánh giá.",
            color: "red",
          });
        }
      }
    } catch (err) {
      console.error("Lỗi xem đánh giá:", err);
      notifications.show({
        title: "Lỗi kết nối",
        message: "Không thể kết nối đến máy chủ để lấy đánh giá.",
        color: "red",
      });
    } finally {
      setIsLoadingReview(false);
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
    reviewTitle,
    setReviewTitle,
    reviewComment,
    setReviewComment,
    reviewImages,
    isUploadingImage,
    handleUploadReviewImage,
    handleRemoveReviewImage,
    isSubmittingReview,
    handleCancelOrder,
    handleSubmitReview,
    handleResetFilter,
    // View review states & handlers
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