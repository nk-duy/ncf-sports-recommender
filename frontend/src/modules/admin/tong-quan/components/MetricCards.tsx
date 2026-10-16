'use client';
import React from 'react';
import { DollarSign, ShoppingCart, TrendingUp, Package, Users, ArrowUpRight } from 'lucide-react';

interface MetricCardsProps {
  stats: {
    revenue: number;
    totalOrders: number;
    aov: number;
    totalProducts: number;
    totalUsers: number;
  };
  formatPrice: (price: number) => string;
}

export default function MetricCards({ stats, formatPrice }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      {/* Doanh thu */}
      <div className="bg-white p-5 rounded-2xl shadow-2xs border border-gray-100 flex flex-col justify-between hover:shadow-xs hover:border-blue-200 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Doanh thu</span>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign size={20} />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xl font-black text-gray-900">{formatPrice(stats.revenue)}</p>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <span className="text-green-600 font-bold flex items-center">
              <ArrowUpRight size={14} /> +15.2%
            </span>
            <span className="text-gray-400">so với kỳ trước</span>
          </div>
        </div>
      </div>

      {/* Đơn hàng */}
      <div className="bg-white p-5 rounded-2xl shadow-2xs border border-gray-100 flex flex-col justify-between hover:shadow-xs hover:border-emerald-200 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Đơn hàng</span>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShoppingCart size={20} />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xl font-black text-gray-900">{stats.totalOrders.toLocaleString('vi-VN')}</p>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <span className="text-green-600 font-bold flex items-center">
              <ArrowUpRight size={14} /> +8.4%
            </span>
            <span className="text-gray-400">hoàn tất</span>
          </div>
        </div>
      </div>

      {/* Giá trị đơn TB (AOV) */}
      <div className="bg-white p-5 rounded-2xl shadow-2xs border border-gray-100 flex flex-col justify-between hover:shadow-xs hover:border-indigo-200 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Đơn trung bình (AOV)</span>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xl font-black text-gray-900">{formatPrice(stats.aov)}</p>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <span className="text-indigo-600 font-bold">Mỗi lượt mua</span>
          </div>
        </div>
      </div>

      {/* Sản phẩm */}
      <div className="bg-white p-5 rounded-2xl shadow-2xs border border-gray-100 flex flex-col justify-between hover:shadow-xs hover:border-amber-200 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sản phẩm</span>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Package size={20} />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xl font-black text-gray-900">{stats.totalProducts.toLocaleString('vi-VN')}</p>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
            <span>Đang lưu hành kho</span>
          </div>
        </div>
      </div>

      {/* Khách hàng */}
      <div className="bg-white p-5 rounded-2xl shadow-2xs border border-gray-100 flex flex-col justify-between hover:shadow-xs hover:border-purple-200 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Khách hàng</span>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xl font-black text-gray-900">{stats.totalUsers.toLocaleString('vi-VN')}</p>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <span className="text-purple-600 font-bold">Hội viên thể thao</span>
          </div>
        </div>
      </div>
    </div>
  );
}
