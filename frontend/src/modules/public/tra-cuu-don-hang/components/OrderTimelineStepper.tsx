'use client';

import { CheckCircle2, Home, Package, Truck, XCircle } from 'lucide-react';
import type { TrackedOrder } from '../types';

interface OrderTimelineStepperProps {
  order: TrackedOrder;
  isCancelled: boolean;
  isConfirmed: boolean;
  isShipping: boolean;
  isDelivered: boolean;
}

export default function OrderTimelineStepper({
  order,
  isCancelled,
  isConfirmed,
  isShipping,
  isDelivered,
}: OrderTimelineStepperProps) {
  return (
    <div className="p-5 sm:p-6 bg-white">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Package size={15} className="text-blue-600" />
          Tiến Trình Xử Lý Đơn Hàng
        </h3>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
          {order.shipping_method ||
            (order.shipping_fee && order.shipping_fee > 40000 ? 'Hỏa Tốc 24H' : 'Giao Hàng Tiêu Chuẩn')}
        </span>
      </div>

      {isCancelled ? (
        <div className="p-4 bg-red-50/80 rounded-2xl border border-red-200 text-sm text-red-800 flex items-start gap-3">
          <XCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-900">Đơn hàng này đã bị hủy hoặc từ chối xử lý</p>
            {order.rejection_reason && (
              <p className="text-xs text-red-700 mt-1">
                <strong>Lý do:</strong> {order.rejection_reason}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 relative pt-2">
          {/* Step 1: Placed */}
          <div className="flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-2 shadow-2xs">
              <CheckCircle2 size={22} className="fill-emerald-500 text-white" />
            </div>
            <span className="text-xs font-bold text-slate-900">1. Đã đặt đơn</span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5">Hoàn tất</span>
          </div>

          {/* Step 2: Confirmed */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-2 shadow-2xs transition-all ${
                isConfirmed
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-blue-50 text-blue-600 border border-blue-300 ring-4 ring-blue-50'
              }`}
            >
              {isConfirmed ? (
                <CheckCircle2 size={22} className="fill-emerald-500 text-white" />
              ) : (
                <Package size={20} />
              )}
            </div>
            <span className="text-xs font-bold text-slate-900">2. Tiếp nhận &amp; Kiểm kho</span>
            <span className={`text-[11px] font-semibold mt-0.5 ${isConfirmed ? 'text-emerald-600' : 'text-blue-600'}`}>
              {isConfirmed ? 'Đã sẵn sàng' : 'Đang kiểm kho'}
            </span>
          </div>

          {/* Step 3: Shipping */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-2 shadow-2xs transition-all ${
                isShipping
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : isConfirmed
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-300 ring-4 ring-indigo-50'
                    : 'bg-slate-50 text-slate-400 border border-slate-200'
              }`}
            >
              {isShipping ? (
                <CheckCircle2 size={22} className="fill-emerald-500 text-white" />
              ) : (
                <Truck size={20} />
              )}
            </div>
            <span className="text-xs font-bold text-slate-900">3. Bàn giao vận chuyển</span>
            <span className={`text-[11px] font-semibold mt-0.5 ${isShipping ? 'text-emerald-600' : 'text-slate-400'}`}>
              {order.carrier ? `${order.carrier}` : isShipping ? 'Đang giao hàng' : 'Chờ bưu cục'}
            </span>
          </div>

          {/* Step 4: Delivered */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-2 shadow-2xs transition-all ${
                isDelivered
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-slate-50 text-slate-400 border border-slate-200'
              }`}
            >
              {isDelivered ? (
                <CheckCircle2 size={22} className="fill-emerald-500 text-white" />
              ) : (
                <Home size={20} />
              )}
            </div>
            <span className="text-xs font-bold text-slate-900">4. Giao tận tay bạn</span>
            <span className={`text-[11px] font-semibold mt-0.5 ${isDelivered ? 'text-emerald-600' : 'text-slate-400'}`}>
              {isDelivered ? 'Đã giao thành công' : 'Dự kiến 2-3 ngày'}
            </span>
          </div>
        </div>
      )}

      {/* Carrier Info Ribbon */}
      {(order.carrier || order.tracking_code) && (
        <div className="mt-4 p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-blue-950 font-medium">
            <Truck size={15} className="text-blue-600" />
            <span>
              Đối tác vận chuyển: <strong>{order.carrier || 'KADY Express'}</strong>
            </span>
          </div>
          {order.tracking_code && (
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-blue-600">Mã vận đơn:</span>
              <strong className="text-blue-900 font-bold tabular-nums">#{order.tracking_code}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
