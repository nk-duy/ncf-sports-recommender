"use client";

import { useState } from "react";
import {
  Truck,
  Package,
  AlertCircle,
  CheckCircle,
  Eye,
  XCircle,
  Star,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { OrderData, ReviewingItem, normalizeOrderStatus } from "./types";
import OrderStatusBadge from "./OrderStatusBadge";
import { reorderItemsToCart } from "../utils/reorderHelper";

interface OrderCardProps {
  order: OrderData;
  onSelectOrder: (order: OrderData) => void;
  onCancelOrder: (orderId: string) => void;
  isCancelling: boolean;
  onOpenReview: (item: ReviewingItem) => void;
  onViewReview?: (order: OrderData, item?: ReviewingItem) => void;
}

export default function OrderCard({
  order,
  onSelectOrder,
  onCancelOrder,
  isCancelling,
  onOpenReview,
  onViewReview,
}: OrderCardProps) {
  const router = useRouter();
  const shortId = order._id.substring(order._id.length - 8).toUpperCase();
  const dateStr = new Date(order.created_at).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const timeStr = new Date(order.created_at).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const firstItem = order.items[0];
  const remainingCount = order.items.length - 1;
  const normStatus = normalizeOrderStatus(order.status);
  const carrierName = order.carrier || order.shipping_method || "Giao Hàng Nhanh";
  const itemImageUrl = firstItem?.image_url || firstItem?.image;
  const [imgError, setImgError] = useState(false);

  const handleReorder = (e: React.MouseEvent) => {
    e.stopPropagation();
    reorderItemsToCart(order, (href) => router.push(href));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-gray-200 transition-all">
      {/* Order Card Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center text-sm gap-x-2 gap-y-1">
          <span className="font-bold text-gray-900">
            Mã đơn: <span className="font-mono tabular-nums text-blue-600">#{shortId}</span>
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500">Ngày đặt: {dateStr} lúc {timeStr}</span>
          <span className="text-gray-300 hidden sm:inline">•</span>
          <span className="text-gray-500 flex items-center">
            <Truck size={14} className="mr-1 text-gray-400" />
            {carrierName}
          </span>
        </div>
        <div>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Order Card Body */}
      <div className="p-6 flex flex-col md:flex-row gap-6">
        <div className="w-20 h-20 rounded-lg bg-gray-50 border border-gray-100 shrink-0 flex items-center justify-center text-blue-500 overflow-hidden relative shadow-xs">
          {itemImageUrl && !imgError ? (
            <img
              src={itemImageUrl}
              alt={firstItem?.product_name || "Sản phẩm"}
              className="w-full h-full object-cover rounded-lg"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Package size={32} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 mb-1.5 truncate">
            {firstItem?.product_name || "Sản phẩm thể thao"}
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            {firstItem?.size ? `Size: ${firstItem.size}` : ""}
            {firstItem?.color ? ` • Màu: ${firstItem.color}` : ""}
            {` • Số lượng: ${firstItem?.quantity || 1}`}
            {remainingCount > 0 && (
              <span className="text-blue-600 font-medium ml-2">
                (+{remainingCount} sản phẩm khác)
              </span>
            )}
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 font-medium">
              Người nhận: {order.customer_name} ({order.customer_phone})
            </span>
            {order.voucher_code && (
              <span className="inline-flex items-center px-2 py-1 rounded bg-green-50 text-green-700 font-medium border border-green-200">
                Mã ưu đãi: {order.voucher_code} (-{(order.discount_amount || 0).toLocaleString("vi-VN")} đ)
              </span>
            )}
          </div>

          {normStatus === "rejected" && (
            <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-red-800">Lý do từ chối / hủy:</span>{" "}
                <span>{order.rejection_reason || "Đơn hàng đã bị hủy theo yêu cầu hoặc do cửa hàng."}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end justify-start min-w-[130px]">
          <div className="font-bold text-gray-900 text-lg">
            {order.total_amount.toLocaleString("vi-VN")} đ
          </div>
          {order.discount_amount && order.discount_amount > 0 ? (
            <div className="text-xs text-green-600 font-medium mt-0.5">
              Đã tiết kiệm {order.discount_amount.toLocaleString("vi-VN")} đ
            </div>
          ) : null}
        </div>
      </div>

      {/* Order Card Footer */}
      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col text-sm w-full md:w-auto">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-500">Tổng thanh toán:</span>
            <span className="font-bold text-gray-900 text-lg">
              {order.total_amount.toLocaleString("vi-VN")} đ
            </span>
          </div>
          <div className="text-gray-500 flex items-center text-xs">
            {order.payment_method?.includes("VNPAY") || order.payment_method?.includes("MoMo") ? (
              <CheckCircle size={14} className="mr-1.5 text-green-500" />
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2" />
            )}
            Phương thức: {order.payment_method}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => onSelectOrder(order)}
            className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg transition-colors flex items-center shadow-sm cursor-pointer"
          >
            <Eye size={16} className="mr-1.5 text-gray-500" />
            Chi tiết đơn
          </button>

          <button
            type="button"
            onClick={handleReorder}
            className="px-4 py-2 border border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg transition-colors flex items-center shadow-sm cursor-pointer"
          >
            <RotateCcw size={16} className="mr-1.5 text-blue-600" />
            Mua lại
          </button>

          {normStatus === "pending" && (
            <button
              type="button"
              onClick={() => onCancelOrder(order._id)}
              disabled={isCancelling}
              className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-lg transition-colors flex items-center cursor-pointer"
            >
              <XCircle size={16} className="mr-1.5 text-red-500" />
              Hủy đơn hàng
            </button>
          )}

          {normStatus === "delivered" && !order.is_reviewed && (
            <button
              type="button"
              onClick={() => {
                if (order.items && order.items.length > 0) {
                  const it = order.items[0];
                  onOpenReview({
                    productId: it.product_id,
                    productName: it.product_name,
                    size: it.size,
                    color: it.color,
                    imageUrl: it.image_url || it.image,
                    orderId: order._id,
                  });
                }
              }}
              className="px-4 py-2 border border-amber-300 bg-amber-50/60 text-amber-700 hover:bg-amber-100 text-sm font-semibold rounded-lg transition-colors flex items-center shadow-sm cursor-pointer"
            >
              <Star size={16} className="mr-1.5 fill-amber-500 text-amber-500" />
              Đánh giá sản phẩm
            </button>
          )}

          {normStatus === "delivered" && order.is_reviewed && (
            <button
              type="button"
              onClick={() => {
                if (order.items && order.items.length > 0) {
                  const it = order.items[0];
                  onViewReview?.(order, {
                    productId: it.product_id,
                    productName: it.product_name,
                    size: it.size,
                    color: it.color,
                    imageUrl: it.image_url || it.image,
                    orderId: order._id,
                  });
                }
              }}
              className="px-4 py-2 border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-semibold rounded-lg transition-colors flex items-center shadow-sm cursor-pointer"
            >
              <CheckCircle size={16} className="mr-1.5 text-emerald-600" />
              Xem lại đánh giá
            </button>
          )}
        </div>
      </div>
    </div>
  );
}