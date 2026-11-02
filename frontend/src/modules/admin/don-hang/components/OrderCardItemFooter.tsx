'use client';

import { Truck, Eye, Printer, CheckCircle, CheckCircle2 } from 'lucide-react';
import type { OrderItem } from '../types';

interface OrderCardItemFooterProps {
  order: OrderItem;
  isDelivered: boolean;
  setSelectedOrder: (order: OrderItem) => void;
  handlePrintInvoice: (order: OrderItem) => void;
  handleUpdateStatus: (id: string, status: string) => void;
  handleUpdatePaymentStatus?: (id: string, paymentStatus: string) => void;
  setShippingModalOrder: (order: OrderItem) => void;
  setRejectModalOrder: (order: OrderItem) => void;
  setSelectedRejectPreset: (preset: string) => void;
  setCustomRejectReason: (reason: string) => void;
}

export default function OrderCardItemFooter({
  order,
  isDelivered,
  setSelectedOrder,
  handlePrintInvoice,
  handleUpdateStatus,
  handleUpdatePaymentStatus,
  setShippingModalOrder,
  setRejectModalOrder,
  setSelectedRejectPreset,
  setCustomRejectReason,
}: OrderCardItemFooterProps) {
  return (
    <div className="p-3 bg-gray-50/80 border-t border-gray-100 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedOrder(order)}
          className="flex-1 py-1.5 px-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 hover:bg-gray-50 hover:text-blue-600 transition shadow-2xs"
        >
          <Eye size={13} />
          <span>Chi tiết</span>
        </button>

        <button
          type="button"
          onClick={() => handlePrintInvoice(order)}
          className="py-1.5 px-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg text-xs flex items-center justify-center gap-1 hover:bg-gray-50 hover:text-gray-900 transition shadow-2xs"
          title="In phiếu giao hàng"
        >
          <Printer size={13} />
          <span className="hidden sm:inline">In</span>
        </button>

        {/* Quick Payment Action Button */}
        {handleUpdatePaymentStatus &&
          (order.payment_status === 'paid' ? (
            <button
              type="button"
              onClick={() => handleUpdatePaymentStatus(order._id, 'unpaid')}
              className="py-1.5 px-2 bg-emerald-50 hover:bg-amber-50 text-emerald-700 hover:text-amber-800 border border-emerald-200 font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition shadow-2xs cursor-pointer"
              title="Đã thanh toán (Bấm để chuyển về Chưa thu tiền)"
            >
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span className="hidden sm:inline">Đã thu</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleUpdatePaymentStatus(order._id, 'paid')}
              className="py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition shadow-2xs cursor-pointer"
              title="Xác nhận đã thu tiền đơn hàng"
            >
              <CheckCircle2 size={13} />
              <span>Thu tiền</span>
            </button>
          ))}

        {/* Status switcher select */}
        <div className="relative">
          <select
            value={order.status === 'completed' ? 'delivered' : order.status}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'shipping') {
                setShippingModalOrder(order);
              } else if (val === 'rejected') {
                setRejectModalOrder(order);
                setSelectedRejectPreset('Hết hàng tồn kho / Tạm ngừng kinh doanh mẫu');
                setCustomRejectReason(order.rejection_reason || '');
              } else {
                handleUpdateStatus(order._id, val);
              }
            }}
            className="text-xs font-bold py-1.5 pl-2.5 pr-6 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer appearance-none"
            title="Chuyển trạng thái đơn hàng"
          >
            <option value="pending">Chờ duyệt</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipping">Giao hàng...</option>
            <option value="delivered">Đã giao</option>
            <option value="rejected">Từ chối đơn</option>
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            ▾
          </div>
        </div>
      </div>

      {/* Primary Contextual Action Button */}
      <div>
        {order.status === 'pending' && (
          <button
            type="button"
            onClick={() => handleUpdateStatus(order._id, 'confirmed')}
            className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
          >
            <CheckCircle size={13} />
            <span>Duyệt đơn hàng</span>
          </button>
        )}

        {order.status === 'confirmed' && (
          <button
            type="button"
            onClick={() => setShippingModalOrder(order)}
            className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
          >
            <Truck size={13} />
            <span>Tạo vận đơn &amp; Giao hàng</span>
          </button>
        )}

        {order.status === 'shipping' && (
          <button
            type="button"
            onClick={() => handleUpdateStatus(order._id, 'delivered')}
            className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
          >
            <CheckCircle size={13} />
            <span>Xác nhận Đã giao</span>
          </button>
        )}

        {isDelivered && (
          <div className="py-1 px-2 text-center text-xs font-bold text-emerald-700 bg-emerald-50/80 rounded-lg border border-emerald-200/60">
            ✓ Đơn hàng đã hoàn tất
          </div>
        )}

        {order.status === 'rejected' && (
          <div className="py-1 px-2 text-center text-xs font-bold text-rose-700 bg-rose-50/80 rounded-lg border border-rose-200/60">
            ✕ Đơn hàng đã từ chối
          </div>
        )}
      </div>
    </div>
  );
}
