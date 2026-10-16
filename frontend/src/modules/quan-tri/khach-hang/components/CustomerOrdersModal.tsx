"use client";

import React, { useState, useEffect } from "react";
import { X, ShoppingBag, Calendar, CreditCard, ChevronRight } from "lucide-react";

interface CustomerOrdersModalProps {
  opened: boolean;
  onClose: () => void;
  customer: any | null;
}

export default function CustomerOrdersModal({
  opened,
  onClose,
  customer
}: CustomerOrdersModalProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (opened && customer?.id) {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const res = await fetch(`http://localhost:8000/api/v1/customers/${customer.id}/orders`);
          if (res.ok) {
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
          }
        } catch (e) {
          console.error("Failed to load customer orders:", e);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [opened, customer?.id]);

  if (!opened || !customer) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
      case "delivered":
      case "Hoàn tất":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-100 text-green-800">Hoàn tất</span>;
      case "shipping":
      case "Đang giao":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">Đang giao</span>;
      case "cancelled":
      case "Đã hủy":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800">Đã hủy</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">Đang xử lý</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Lịch sử đơn hàng: {customer.name}
              </h3>
              <p className="text-xs text-gray-500 font-mono">
                {customer.code} • Tổng {orders.length} đơn hàng • Chi tiêu: {customer.spent}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Orders list */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-sm text-gray-400 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
              <span>Đang tải danh sách đơn hàng...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Khách hàng chưa có đơn hàng nào trong hệ thống.
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order.id}
                className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xs transition-all flex items-center justify-between gap-4 bg-white"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-blue-600">{order.code}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {order.created_at}
                    </span>
                    <span>•</span>
                    <span className="truncate">{order.first_item_name} {order.items_count > 1 ? `(+${order.items_count - 1} món)` : ""}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="font-mono font-bold text-base text-gray-900">
                      {order.total_amount?.toLocaleString("vi-VN")} đ
                    </div>
                    <span className="text-[11px] text-gray-400 uppercase font-medium">
                      {order.payment_method || "COD"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <span className="text-xs text-gray-500">
            Hiển thị {orders.length} đơn hàng
          </span>
          <button
            onClick={onClose}
            className="px-4 h-9 rounded-lg border border-gray-200 text-gray-700 hover:bg-white text-sm font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
