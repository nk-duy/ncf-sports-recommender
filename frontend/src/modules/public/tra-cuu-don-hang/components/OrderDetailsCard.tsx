'use client';

import { Calendar, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';
import type { TrackedOrder } from '../types';
import OrderTimelineStepper from './OrderTimelineStepper';
import OrderRecipientGrid from './OrderRecipientGrid';
import OrderItemsBreakdown from './OrderItemsBreakdown';

interface OrderDetailsCardProps {
  order: TrackedOrder;
}

export default function OrderDetailsCard({ order }: OrderDetailsCardProps) {
  const statusRaw = (order.status || '').toLowerCase().trim();

  // Status mapping
  const isCancelled =
    statusRaw === 'cancelled' ||
    statusRaw === 'canceled' ||
    statusRaw === 'rejected' ||
    statusRaw === 'đã hủy';
  const isConfirmed =
    statusRaw === 'confirmed' ||
    statusRaw === 'đã xác nhận' ||
    statusRaw === 'shipping' ||
    statusRaw === 'delivered' ||
    statusRaw === 'completed';
  const isShipping =
    statusRaw === 'shipping' ||
    statusRaw === 'shipped' ||
    statusRaw === 'đang giao' ||
    statusRaw === 'đang vận chuyển' ||
    statusRaw === 'delivered' ||
    statusRaw === 'completed';
  const isDelivered =
    statusRaw === 'delivered' ||
    statusRaw === 'completed' ||
    statusRaw === 'đã giao' ||
    statusRaw === 'hoàn tất';

  const getStatusDisplay = () => {
    if (isCancelled) {
      return {
        text: 'Đã hủy đơn',
        color: 'text-red-700 bg-red-50 border-red-200',
        icon: <XCircle size={18} className="text-red-600" />,
      };
    }
    if (isDelivered) {
      return {
        text: 'Giao thành công',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        icon: <CheckCircle2 size={18} className="text-emerald-600" />,
      };
    }
    if (isShipping) {
      return {
        text: 'Đang vận chuyển',
        color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
        icon: <Truck size={18} className="text-indigo-600" />,
      };
    }
    if (isConfirmed) {
      return {
        text: 'Đã xác nhận',
        color: 'text-blue-700 bg-blue-50 border-blue-200',
        icon: <CheckCircle2 size={18} className="text-blue-600" />,
      };
    }
    return {
      text: 'Chờ xác nhận',
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      icon: <Clock size={18} className="text-amber-600" />,
    };
  };

  const statusDisplay = getStatusDisplay();
  const shortCode = order._id ? `ORD-${order._id.slice(-6).toUpperCase()}` : '';

  return (
    <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs divide-y divide-slate-100">
      {/* 1. Header: Order ID & Live Status */}
      <div className="bg-slate-50/80 p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mã đơn hàng:</span>
            <span className="font-mono font-black text-blue-600 text-base sm:text-lg tracking-wide tabular-nums">
              #{shortCode}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden md:inline tabular-nums">
              ({order._id})
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <Calendar size={13} className="text-slate-400 shrink-0" />
            <span>Ngày đặt:</span>
            <span className="font-semibold text-slate-700 tabular-nums">
              {order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : 'Vừa xong'}
            </span>
          </div>
        </div>

        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider shadow-2xs ${statusDisplay.color}`}
        >
          {statusDisplay.icon}
          <span>{statusDisplay.text}</span>
        </div>
      </div>

      {/* 2. Order Timeline Stepper */}
      <OrderTimelineStepper
        order={order}
        isCancelled={isCancelled}
        isConfirmed={isConfirmed}
        isShipping={isShipping}
        isDelivered={isDelivered}
      />

      {/* 3. Customer & Shipping Info Grid */}
      <OrderRecipientGrid order={order} />

      {/* 4-6. Products, Cost Breakdown & Footer Actions */}
      <OrderItemsBreakdown order={order} />
    </div>
  );
}
