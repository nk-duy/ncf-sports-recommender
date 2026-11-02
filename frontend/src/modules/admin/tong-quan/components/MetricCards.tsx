'use client';

import { ArrowUpRight, DollarSign, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import type { DashboardStats } from '../types';

interface MetricCardsProps {
  stats: DashboardStats;
  formatPrice: (price: number) => string;
}

export default function MetricCards({ stats, formatPrice }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Doanh thu */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between hover:shadow-sm hover:border-blue-200 transition-all h-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Doanh thu
          </span>
          <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <DollarSign size={20} />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xl lg:text-2xl font-bold text-slate-900 tabular-nums tracking-tight font-sans">
            {formatPrice(stats.revenue)}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <span className="text-emerald-600 font-bold flex items-center tabular-nums">
              <ArrowUpRight size={14} /> +15.2%
            </span>
            <span className="text-slate-400">so với kỳ trước</span>
          </div>
        </div>
      </div>

      {/* Đơn hàng */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between hover:shadow-sm hover:border-emerald-200 transition-all h-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Đơn hàng
          </span>
          <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShoppingCart size={20} />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xl lg:text-2xl font-bold text-slate-900 tabular-nums tracking-tight font-sans">
            {stats.totalOrders.toLocaleString('vi-VN')}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <span className="text-emerald-600 font-bold flex items-center tabular-nums">
              <ArrowUpRight size={14} /> +8.4%
            </span>
            <span className="text-slate-400">hoàn tất</span>
          </div>
        </div>
      </div>

      {/* Giá trị đơn TB (AOV) */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between hover:shadow-sm hover:border-indigo-200 transition-all h-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Đơn trung bình (AOV)
          </span>
          <div className="size-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <TrendingUp size={20} />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xl lg:text-2xl font-bold text-slate-900 tabular-nums tracking-tight font-sans">
            {formatPrice(stats.aov)}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <span className="text-indigo-600 font-bold">Mỗi lượt mua</span>
          </div>
        </div>
      </div>

      {/* Sản phẩm */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between hover:shadow-sm hover:border-amber-200 transition-all h-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Sản phẩm
          </span>
          <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Package size={20} />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xl lg:text-2xl font-bold text-slate-900 tabular-nums tracking-tight font-sans">
            {stats.totalProducts.toLocaleString('vi-VN')}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
            <span>Đang lưu hành kho</span>
          </div>
        </div>
      </div>

      {/* Khách hàng */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between hover:shadow-sm hover:border-purple-200 transition-all h-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Khách hàng
          </span>
          <div className="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xl lg:text-2xl font-bold text-slate-900 tabular-nums tracking-tight font-sans">
            {stats.totalUsers.toLocaleString('vi-VN')}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <span className="text-purple-600 font-bold">Hội viên thể thao</span>
          </div>
        </div>
      </div>
    </div>
  );
}
