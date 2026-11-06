"use client";

import Link from "next/link";
import {
  ArrowLeft,
  RotateCcw,
  XCircle,
  Star,
  AlertCircle,
  Truck,
  CheckCircle,
} from "lucide-react";
import OrderSummary from "@/modules/public/thanh-toan/success/components/OrderSummary";
import OrderMetadata from "@/modules/public/thanh-toan/success/components/OrderMetadata";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderReviewModal from "./OrderReviewModal";
import ViewReviewModal from "./ViewReviewModal";
import { normalizeOrderStatus } from "./types";
import { useOrderDetail } from "../hooks/useOrderDetail";

interface OrderDetailViewProps {
  id: string;
}

export default function OrderDetailView({ id }: OrderDetailViewProps) {
  const {
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
    viewReviewData,
    isViewReviewOpen,
    setIsViewReviewOpen,
    isLoadingReview,
    handleViewReview,
  } = useOrderDetail(id);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy đơn hàng</h2>
        <p className="text-sm text-gray-500 mb-6">
          Đơn hàng không tồn tại hoặc bạn không có quyền truy cập.
        </p>
        <Link
          href="/tai-khoan/orders"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
        >
          <ArrowLeft size={16} className="mr-2" />
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  const rawId = order._id || id;
  const shortId = rawId.substring(rawId.length - 8).toUpperCase();
  const normStatus = normalizeOrderStatus(order.status);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/tai-khoan/orders"
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
            title="Quay lại danh sách"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">
                Chi tiết đơn hàng{" "}
                <span className="font-mono tabular-nums text-blue-600">#{shortId}</span>
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
              <span>Ngày đặt: {new Date(order.created_at).toLocaleString("vi-VN")}</span>
              <span>•</span>
              <span className="flex items-center">
                <Truck size={13} className="mr-1 text-gray-400" />
                {order.carrier || order.shipping_method || "Giao Hàng Nhanh"}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleReorder}
            className="px-4 py-2 border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg transition-colors flex items-center shadow-xs cursor-pointer"
          >
            <RotateCcw size={16} className="mr-1.5 text-blue-600" />
            Mua lại
          </button>

          {normStatus === "pending" && (
            <button
              type="button"
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-lg transition-colors flex items-center disabled:opacity-50 cursor-pointer"
            >
              <XCircle size={16} className="mr-1.5 text-red-500" />
              {isCancelling ? "Đang hủy..." : "Hủy đơn hàng"}
            </button>
          )}

          {normStatus === "delivered" && !order.is_reviewed && order.items && order.items.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const first = order.items[0];
                setReviewingItem({
                  productId: first.product_id,
                  productName: first.product_name,
                  size: first.size,
                  color: first.color,
                  imageUrl: first.image_url || first.image,
                  orderId: order._id,
                });
              }}
              className="px-4 py-2 border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 text-sm font-semibold rounded-lg transition-colors flex items-center shadow-xs cursor-pointer"
            >
              <Star size={16} className="mr-1.5 fill-amber-500 text-amber-500" />
              Đánh giá sản phẩm
            </button>
          )}

          {normStatus === "delivered" && order.is_reviewed && order.items && order.items.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const first = order.items[0];
                handleViewReview(order, {
                  productId: first.product_id,
                  productName: first.product_name,
                  size: first.size,
                  color: first.color,
                  imageUrl: first.image_url || first.image,
                  orderId: order._id,
                });
              }}
              className="px-4 py-2 border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-semibold rounded-lg transition-colors flex items-center shadow-xs cursor-pointer"
            >
              <CheckCircle size={16} className="mr-1.5 text-emerald-600" />
              Xem lại đánh giá
            </button>
          )}
        </div>
      </div>

      {/* Rejection / Cancellation Alert */}
      {normStatus === "rejected" && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-3 shadow-xs">
          <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-900">Đơn hàng này đã bị hủy hoặc từ chối</p>
            <p className="mt-1 text-red-700 text-xs">
              <span className="font-semibold text-red-800">Lý do:</span>{" "}
              {order.rejection_reason ||
                "Đơn hàng đã được hủy theo yêu cầu của khách hàng hoặc do quản trị viên."}
            </p>
          </div>
        </div>
      )}

      {/* Main Order Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <OrderSummary order={order} />
        <OrderMetadata order={order} />
      </div>

      {/* Review Submission Modal */}
      <OrderReviewModal
        reviewingItem={reviewingItem}
        onClose={() => setReviewingItem(null)}
        onSubmit={handleSubmitReview}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        reviewTitle={reviewTitle}
        setReviewTitle={setReviewTitle}
        reviewComment={reviewComment}
        setReviewComment={setReviewComment}
        reviewImages={reviewImages}
        isUploadingImage={isUploadingImage}
        onUploadImage={handleUploadReviewImage}
        onRemoveImage={handleRemoveReviewImage}
        isSubmittingReview={isSubmittingReview}
      />

      {/* View Submitted Review Modal */}
      <ViewReviewModal
        isOpen={isViewReviewOpen}
        onClose={() => setIsViewReviewOpen(false)}
        reviewData={viewReviewData}
        itemData={viewingItem}
        loading={isLoadingReview}
      />
    </div>
  );
}