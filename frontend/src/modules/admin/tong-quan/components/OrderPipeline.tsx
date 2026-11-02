'use client';

import { Layers } from 'lucide-react';
import type { OrderStatusPipeline } from '../types';

interface OrderPipelineProps {
  orderStatusPipeline: OrderStatusPipeline;
}

export default function OrderPipeline({ orderStatusPipeline }: OrderPipelineProps) {
  const total = orderStatusPipeline.total || 1;

  return (
    <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col gap-3.5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">
            Tiến trình Xử lý &amp; Vận hành Đơn hàng
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Tổng cộng:{' '}
          <strong className="text-slate-700 tabular-nums font-sans">
            {orderStatusPipeline.total}
          </strong>{' '}
          đơn hàng
        </span>
      </div>

      {/* Multi-segmented Progress Bar */}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
        <div
          style={{ width: `${(orderStatusPipeline.completed / total) * 100}%` }}
          className="bg-emerald-500 h-full transition-all duration-300"
          title={`Hoàn thành: ${orderStatusPipeline.completed}`}
        />
        <div
          style={{ width: `${(orderStatusPipeline.shipping / total) * 100}%` }}
          className="bg-purple-500 h-full transition-all duration-300"
          title={`Đang giao: ${orderStatusPipeline.shipping}`}
        />
        <div
          style={{ width: `${(orderStatusPipeline.processing / total) * 100}%` }}
          className="bg-blue-500 h-full transition-all duration-300"
          title={`Đang xử lý: ${orderStatusPipeline.processing}`}
        />
        <div
          style={{ width: `${(orderStatusPipeline.pending / total) * 100}%` }}
          className="bg-amber-400 h-full transition-all duration-300"
          title={`Chờ duyệt: ${orderStatusPipeline.pending}`}
        />
        <div
          style={{ width: `${(orderStatusPipeline.cancelled / total) * 100}%` }}
          className="bg-rose-400 h-full transition-all duration-300"
          title={`Đã hủy: ${orderStatusPipeline.cancelled}`}
        />
      </div>

      {/* Legend Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1 text-xs">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
          <span className="size-2.5 rounded-full bg-emerald-500 shrink-0" />
          <div className="flex flex-col">
            <span className="text-slate-500 text-[11px] font-medium">Hoàn thành</span>
            <span className="font-bold text-slate-900 tabular-nums font-sans">
              {orderStatusPipeline.completed} đơn
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
          <span className="size-2.5 rounded-full bg-purple-500 shrink-0" />
          <div className="flex flex-col">
            <span className="text-slate-500 text-[11px] font-medium">Đang giao</span>
            <span className="font-bold text-slate-900 tabular-nums font-sans">
              {orderStatusPipeline.shipping} đơn
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
          <span className="size-2.5 rounded-full bg-blue-500 shrink-0" />
          <div className="flex flex-col">
            <span className="text-slate-500 text-[11px] font-medium">Đang xử lý</span>
            <span className="font-bold text-slate-900 tabular-nums font-sans">
              {orderStatusPipeline.processing} đơn
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
          <span className="size-2.5 rounded-full bg-amber-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-slate-500 text-[11px] font-medium">Chờ xác nhận</span>
            <span className="font-bold text-slate-900 tabular-nums font-sans">
              {orderStatusPipeline.pending} đơn
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
          <span className="size-2.5 rounded-full bg-rose-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-slate-500 text-[11px] font-medium">Đã hủy</span>
            <span className="font-bold text-slate-900 tabular-nums font-sans">
              {orderStatusPipeline.cancelled} đơn
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
