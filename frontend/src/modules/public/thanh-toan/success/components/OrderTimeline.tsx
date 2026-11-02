'use client';

import { CheckCircle2, Home, Package, Truck } from 'lucide-react';
import type { PublicOrderData } from '../../types';

export default function OrderTimeline({ order }: { order?: PublicOrderData | null }) {
  const status = (order?.status || 'pending').toLowerCase();
  const isConfirmed =
    status === 'confirmed' || status === 'shipping' || status === 'delivered' || status === 'completed';
  const isShipping = status === 'shipping' || status === 'delivered' || status === 'completed';
  const isDelivered = status === 'delivered' || status === 'completed';

  const shippingMethod =
    order?.shipping_method ||
    (order?.shipping_fee === 60000
      ? 'Hỏa Tốc 24H'
      : order?.shipping_fee === 35000
        ? 'Giao Hàng Nhanh'
        : 'Tiêu chuẩn');

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 print:border-slate-400">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">Tiến trình xử lý đơn hàng</h3>
          <p className="text-xs text-slate-500 mt-0.5">Hệ thống cập nhật tự động theo thời gian thực</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          {shippingMethod}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="size-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-2 shadow-xs">
            <CheckCircle2 size={22} className="fill-emerald-500 text-white" />
          </div>
          <span className="text-xs font-bold text-slate-900">1. Đã đặt đơn</span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5">Hoàn tất</span>
        </div>

        <div className="flex flex-col items-center text-center relative z-10">
          <div
            className={`size-11 rounded-xl flex items-center justify-center mb-2 shadow-xs transition-all ${
              isConfirmed
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-blue-50 text-blue-600 border border-blue-300 ring-4 ring-blue-50 animate-pulse'
            }`}
          >
            <Package size={20} />
          </div>
          <span className="text-xs font-bold text-slate-900">2. Tiếp nhận &amp; Kiểm kho</span>
          <span className={`text-[11px] font-semibold mt-0.5 ${isConfirmed ? 'text-emerald-600' : 'text-blue-600'}`}>
            {isConfirmed ? 'Đã sẵn sàng' : 'Đang kiểm tra'}
          </span>
        </div>

        <div className="flex flex-col items-center text-center relative z-10">
          <div
            className={`size-11 rounded-xl flex items-center justify-center mb-2 shadow-xs transition-all ${
              isShipping
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-slate-50 text-slate-400 border border-slate-200'
            }`}
          >
            <Truck size={20} />
          </div>
          <span className="text-xs font-bold text-slate-900">3. Bàn giao vận chuyển</span>
          <span className={`text-[11px] font-semibold mt-0.5 ${isShipping ? 'text-emerald-600' : 'text-slate-400'}`}>
            {order?.carrier ? `${order.carrier}` : 'Bưu cục KADY'}
          </span>
        </div>

        <div className="flex flex-col items-center text-center relative z-10">
          <div
            className={`size-11 rounded-xl flex items-center justify-center mb-2 shadow-xs transition-all ${
              isDelivered
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-slate-50 text-slate-400 border border-slate-200'
            }`}
          >
            <Home size={20} />
          </div>
          <span className="text-xs font-bold text-slate-900">4. Giao tận tay bạn</span>
          <span className={`text-[11px] font-semibold mt-0.5 ${isDelivered ? 'text-emerald-600' : 'text-slate-400'}`}>
            {isDelivered ? 'Đã giao thành công' : 'Dự kiến 2-3 ngày'}
          </span>
        </div>
      </div>
    </div>
  );
}
