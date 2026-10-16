'use client';
import React from 'react';
import { Layers } from 'lucide-react';

interface OrderPipelineProps {
  orderStatusPipeline: {
    pending: number;
    processing: number;
    shipping: number;
    completed: number;
    cancelled: number;
    total: number;
  };
}

export default function OrderPipeline({ orderStatusPipeline }: OrderPipelineProps) {
  const total = orderStatusPipeline.total || 1;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-2xs border border-gray-100 flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-blue-600" />
          <h3 className="font-bold text-gray-900 text-sm">Tiến trình Xử lý &amp; Vận hành Đơn hàng</h3>
        </div>
        <span className="text-xs text-gray-400">
          Tổng cộng: <strong className="text-gray-700">{orderStatusPipeline.total}</strong> đơn hàng
        </span>
      </div>

      {/* Multi-segmented Progress Bar */}
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
        <div
          style={{ width: `${(orderStatusPipeline.completed / total) * 100}%` }}
          className="bg-green-500 h-full"
          title={`Hoàn thành: ${orderStatusPipeline.completed}`}
        />
        <div
          style={{ width: `${(orderStatusPipeline.shipping / total) * 100}%` }}
          className="bg-purple-500 h-full"
          title={`Đang giao: ${orderStatusPipeline.shipping}`}
        />
        <div
          style={{ width: `${(orderStatusPipeline.processing / total) * 100}%` }}
          className="bg-blue-500 h-full"
          title={`Đang xử lý: ${orderStatusPipeline.processing}`}
        />
        <div
          style={{ width: `${(orderStatusPipeline.pending / total) * 100}%` }}
          className="bg-amber-400 h-full"
          title={`Chờ duyệt: ${orderStatusPipeline.pending}`}
        />
        <div
          style={{ width: `${(orderStatusPipeline.cancelled / total) * 100}%` }}
          className="bg-red-400 h-full"
          title={`Đã hủy: ${orderStatusPipeline.cancelled}`}
        />
      </div>

      {/* Legend Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-xs">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50/70 border border-green-100">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"></span>
          <div className="flex flex-col">
            <span className="text-gray-500 text-[11px]">Hoàn thành</span>
            <span className="font-bold text-gray-900">{orderStatusPipeline.completed} đơn</span>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50/70 border border-purple-100">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0"></span>
          <div className="flex flex-col">
            <span className="text-gray-500 text-[11px]">Đang giao</span>
            <span className="font-bold text-gray-900">{orderStatusPipeline.shipping} đơn</span>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50/70 border border-blue-100">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
          <div className="flex flex-col">
            <span className="text-gray-500 text-[11px]">Đang xử lý</span>
            <span className="font-bold text-gray-900">{orderStatusPipeline.processing} đơn</span>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/70 border border-amber-100">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0"></span>
          <div className="flex flex-col">
            <span className="text-gray-500 text-[11px]">Chờ xác nhận</span>
            <span className="font-bold text-gray-900">{orderStatusPipeline.pending} đơn</span>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50/70 border border-red-100">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0"></span>
          <div className="flex flex-col">
            <span className="text-gray-500 text-[11px]">Đã hủy</span>
            <span className="font-bold text-gray-900">{orderStatusPipeline.cancelled} đơn</span>
          </div>
        </div>
      </div>
    </div>
  );
}
