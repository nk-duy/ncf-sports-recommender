"use client";

import {
  X,
  MapPin,
  CreditCard,
  Package,
  Star,
  AlertCircle,
  XCircle,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { OrderData, ReviewingItem, normalizeOrderStatus } from "./types";
import OrderStatusBadge from "./OrderStatusBadge";
import {
  SPORTS_ORDER_FALLBACK_IMG,
  reorderItemsToCart,
} from "../utils/reorderHelper";

interface OrderDetailModalProps {
  order: OrderData | null;
  onClose: () => void;
  onCancelOrder: (orderId: string) => void;
  isCancelling: boolean;
  onOpenReview: (item: ReviewingItem) => void;
  onViewReview?: (order: OrderData, item?: ReviewingItem) => void;
}

export default function OrderDetailModal({
  order,
  onClose,
  onCancelOrder,
  isCancelling,
  onOpenReview,
  onViewReview,
}: OrderDetailModalProps) {
  const router = useRouter();
  if (!order) return null;

  const shortId = order._id.substring(order._id.length - 8).toUpperCase();
  const normStatus = normalizeOrderStatus(order.status);

  const handleReorder = () => {
    reorderItemsToCart(order, (href) => router.push(href), onClose);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Chi tiết đơn hàng{" "}
              <span className="font-mono tabular-nums text-blue-600">#{shortId}</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Ngày đặt: {new Date(order.created_at).toLocaleString("vi-VN")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-xs"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {normStatus === "rejected" && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-900">Đơn hàng này đã bị hủy hoặc từ chối</p>
                <p className="mt-1 text-red-700 text-xs">
                  <span className="font-semibold text-red-800">Lý do:</span>{" "}
                  {order.rejection_reason ||
                    "Đơn hàng đã được hủy theo yêu cầu của bạn hoặc quyết định từ phía quản trị viên cửa hàng."}
                </p>
              </div>
            </div>
          )}

          {/* Delivery & Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin size={14} className="text-blue-600" />
                Địa chỉ nhận hàng
              </div>
              <p className="text-sm font-bold text-gray-900">{order.customer_name}</p>
              <p className="text-xs text-gray-600 mt-0.5">{order.customer_phone}</p>
              <p className="text-xs text-gray-600 mt-1">{order.customer_address}</p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CreditCard size={14} className="text-blue-600" />
                Thanh toán &amp; Vận chuyển
              </div>
              <div className="mb-2">
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-xs text-gray-600">
                PTTT: <span className="font-semibold text-gray-900">{order.payment_method}</span>
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Đơn vị:{" "}
                <span className="font-semibold text-gray-900">
                  {order.carrier || "Giao Hàng Nhanh (GHN)"}
                </span>
              </p>
              {order.tracking_code && (
                <p className="text-xs text-indigo-700 mt-1.5 flex items-center gap-1 font-semibold bg-indigo-50 px-2 py-1 rounded border border-indigo-200">
                  <span>Mã vận đơn:</span>
                  <span className="font-mono font-bold">{order.tracking_code}</span>
                </p>
              )}
            </div>
          </div>

          {/* Items List */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
              Danh sách sản phẩm ({order.items.length})
            </h4>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4 bg-white">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-blue-500 shrink-0 overflow-hidden relative shadow-xs">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_name || "Sản phẩm"}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = SPORTS_ORDER_FALLBACK_IMG;
                          }}
                        />
                      ) : (
                        <Package size={20} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.size ? `Size: ${item.size}` : ""}
                        {item.color ? ` • ${item.color}` : ""}
                        {` • SL: x${item.quantity}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                    <p className="text-sm font-bold text-gray-900">
                      {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.price.toLocaleString("vi-VN")} đ / cái
                    </p>
                    {normStatus === "delivered" && !order.is_reviewed && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenReview({
                            productId: item.product_id,
                            productName: item.product_name,
                            size: item.size,
                            color: item.color,
                            imageUrl: item.image_url,
                            orderId: order._id,
                          });
                        }}
                        className="mt-1 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                      >
                        <Star size={13} className="fill-amber-500 text-amber-500" />
                        Đánh giá
                      </button>
                    )}

                    {normStatus === "delivered" && order.is_reviewed && (
                      <button
                        type="button"
                        onClick={() => {
                          onViewReview?.(order, {
                            productId: item.product_id,
                            productName: item.product_name,
                            size: item.size,
                            color: item.color,
                            imageUrl: item.image_url,
                            orderId: order._id,
                          });
                        }}
                        className="mt-1 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        <CheckCircle size={13} className="text-emerald-600" />
                        Xem lại đánh giá
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Tiền hàng (tạm tính):</span>
              <span>
                {(order.subtotal && order.subtotal > 0
                  ? order.subtotal
                  : order.total_amount
                ).toLocaleString("vi-VN")}{" "}
                đ
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển:</span>
              <span>{(order.shipping_fee || 0).toLocaleString("vi-VN")} đ</span>
            </div>
            {order.discount_amount && order.discount_amount > 0 ? (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Mã giảm giá ({order.voucher_code}):</span>
                <span>-{order.discount_amount.toLocaleString("vi-VN")} đ</span>
              </div>
            ) : null}
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-base">
              <span>Tổng thanh toán:</span>
              <span className="text-blue-600">{order.total_amount.toLocaleString("vi-VN")} đ</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReorder}
              className="px-4 py-2 border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg transition-colors flex items-center shadow-xs cursor-pointer"
            >
              <RotateCcw size={16} className="mr-1.5 text-blue-600" />
              Mua lại toàn bộ
            </button>
            {normStatus === "pending" && (
              <button
                type="button"
                onClick={() => onCancelOrder(order._id)}
                disabled={isCancelling}
                className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-lg transition-colors flex items-center cursor-pointer"
              >
                <XCircle size={16} className="mr-1.5 text-red-500" />
                Hủy đơn hàng này
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 text-white hover:bg-gray-800 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}