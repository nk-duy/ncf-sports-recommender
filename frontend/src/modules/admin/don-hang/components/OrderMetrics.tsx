'use client';
import React from 'react';
import { Package, Clock, Truck, CheckCircle } from 'lucide-react';

interface OrderMetricsProps {
  metrics: {
    totalCount: number;
    pendingCount: number;
    shippingCount: number;
    deliveredCount: number;
  };
}

export default function OrderMetrics({ metrics }: OrderMetricsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
      <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Package size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Tổng đơn hàng</p>
          <p className="text-lg font-black text-gray-900">{metrics.totalCount}</p>
        </div>
      </div>

      <div
        className={`bg-white p-3.5 rounded-2xl border shadow-2xs flex items-center gap-3 transition ${
          metrics.pendingCount > 0 ? 'border-amber-200 bg-amber-50/20' : 'border-gray-100'
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Clock size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Cần duyệt ngay</p>
          <p className="text-lg font-black text-amber-600">{metrics.pendingCount}</p>
        </div>
      </div>

      <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <Truck size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Đang giao hàng</p>
          <p className="text-lg font-black text-indigo-600">{metrics.shippingCount}</p>
        </div>
      </div>

      <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Đã giao hoàn tất</p>
          <p className="text-lg font-black text-emerald-600">{metrics.deliveredCount}</p>
        </div>
      </div>
    </div>
  );
}
