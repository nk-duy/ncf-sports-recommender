'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Download, 
  Wallet, 
  ShoppingBag, 
  Users, 
  Brain, 
  TrendingUp, 
  Activity, 
  Calendar, 
  ChevronDown, 
  ArrowRight 
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_products: 0,
    total_orders: 0,
    total_revenue: 0,
    pending_orders: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/admin/dashboard-stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      }
    };
    fetchStats();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="flex flex-col w-full space-y-8">
      {/* Page Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-blue-600 tracking-wider uppercase font-semibold">Thương mại điện tử</span>
            <span className="text-gray-300 text-xs">•</span>
            <span className="font-mono text-[11px] text-gray-500">Cập nhật realtime</span>
          </div>
          <h1 className="text-3xl text-gray-900 font-bold tracking-tight">Tổng quan hệ thống</h1>
          <p className="text-sm text-gray-600 mt-1">Theo dõi chỉ số bán hàng và hiệu suất thương mại điện tử SportsAI</p>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Period Selector Toggle */}
          <div className="inline-flex p-1 bg-gray-100 rounded-lg shadow-inner">
            <button className="px-4 py-1.5 rounded-md bg-white text-blue-600 text-sm font-semibold shadow-sm transition-all">
              7 ngày qua
            </button>
            <button className="px-4 py-1.5 rounded-md text-gray-600 hover:text-gray-900 text-sm font-semibold transition-all">
              Tháng này
            </button>
          </div>
          {/* Export Action Button */}
          <button className="inline-flex items-center gap-2 px-4 py-1.5 h-9 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all">
            <Download size={18} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Row 1: Key Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Revenue */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider block">Tổng doanh thu</span>
              <div className="mt-2 text-2xl text-gray-900 font-bold tracking-tight">
                {formatPrice(stats.total_revenue)}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Wallet size={22} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 text-green-600 text-xs font-semibold">
              <TrendingUp size={16} />
              <span>Cập nhật liên tục</span>
            </div>
          </div>
        </div>

        {/* Stat 2: New Orders */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider block">Số đơn hàng</span>
              <div className="mt-2 text-2xl text-gray-900 font-bold tracking-tight">
                {stats.total_orders} <span className="text-sm font-normal text-gray-500">đơn</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <ShoppingBag size={22} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 text-gray-600 text-xs font-semibold">
              <span className="text-orange-500">{stats.pending_orders}</span>
              <span className="text-gray-500 font-normal ml-1">đang chờ xử lý</span>
            </div>
          </div>
        </div>

        {/* Stat 3: Total Customers */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider block">Số khách hàng</span>
              <div className="mt-2 text-2xl text-gray-900 font-bold tracking-tight">
                {stats.total_users} <span className="text-sm font-normal text-gray-500">người</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
              <Users size={22} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 text-gray-600 text-xs font-semibold">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span className="text-gray-500 font-normal ml-1">Đã đăng ký</span>
            </div>
          </div>
        </div>

        {/* Stat 4: Total Products */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider block">Số sản phẩm</span>
              <div className="mt-2 text-2xl text-gray-900 font-bold tracking-tight">
                {stats.total_products} <span className="text-sm font-normal text-gray-500">món</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <ShoppingBag size={22} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-semibold">
              <Activity size={16} />
              <span>Sản phẩm đang bán</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Analytics Bar Chart & Recent Orders Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7/12 col on lg): Weekly Revenue Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between border border-gray-100">
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between pb-2 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg text-gray-900 font-bold">Doanh thu 7 ngày qua</h2>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">Tuần 42</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Tổng ghi nhận: <span className="font-semibold text-gray-900 font-mono">128.450.000 đ</span></p>
            </div>
            <div className="flex items-center gap-1">
              <button className="h-8 px-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium flex items-center gap-1.5 transition-colors">
                <Calendar size={16} className="text-gray-500" />
                <span>14/10 - 20/10</span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Chart Content Area (HTML/CSS Bar Chart) */}
          <div className="pt-6 pb-2">
            <div className="relative h-64 w-full flex flex-col justify-between">
              {/* Background Grid Lines & Y-Axis Labels */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-gray-400 font-mono text-[11px]">
                {/* 30M Line */}
                <div className="flex items-center w-full gap-3">
                  <span className="w-8 text-right shrink-0">30M</span>
                  <div className="h-px bg-gray-100 flex-1"></div>
                </div>
                {/* 20M Line */}
                <div className="flex items-center w-full gap-3">
                  <span className="w-8 text-right shrink-0">20M</span>
                  <div className="h-px bg-gray-100 flex-1"></div>
                </div>
                {/* 10M Line */}
                <div className="flex items-center w-full gap-3">
                  <span className="w-8 text-right shrink-0">10M</span>
                  <div className="h-px bg-gray-100 flex-1"></div>
                </div>
                {/* 0M Line Base */}
                <div className="flex items-center w-full gap-3">
                  <span className="w-8 text-right shrink-0">0</span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
              </div>
              
              {/* Active Interactive Bars Grid */}
              <div className="relative pl-12 pr-2 h-full flex items-end justify-between gap-2 z-10 pt-4">
                {/* Day 1: T2 (14.2M ~ 47%) */}
                <div className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-8 bg-gray-900 text-white text-[11px] font-mono px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-20">
                    14.200.000 đ
                  </div>
                  <div className="w-full max-w-[38px] bg-blue-300 group-hover:bg-blue-600 rounded-t transition-colors duration-200" style={{ height: '47.3%' }}></div>
                  <span className="mt-3 text-xs font-semibold text-gray-500 group-hover:text-blue-600 transition-colors">T2</span>
                </div>
                
                {/* Day 2: T3 (16.8M ~ 56%) */}
                <div className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-8 bg-gray-900 text-white text-[11px] font-mono px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-20">
                    16.800.000 đ
                  </div>
                  <div className="w-full max-w-[38px] bg-blue-300 group-hover:bg-blue-600 rounded-t transition-colors duration-200" style={{ height: '56.0%' }}></div>
                  <span className="mt-3 text-xs font-semibold text-gray-500 group-hover:text-blue-600 transition-colors">T3</span>
                </div>
                
                {/* Day 3: T4 (19.5M ~ 65%) */}
                <div className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-8 bg-gray-900 text-white text-[11px] font-mono px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-20">
                    19.500.000 đ
                  </div>
                  <div className="w-full max-w-[38px] bg-blue-300 group-hover:bg-blue-600 rounded-t transition-colors duration-200" style={{ height: '65.0%' }}></div>
                  <span className="mt-3 text-xs font-semibold text-gray-500 group-hover:text-blue-600 transition-colors">T4</span>
                </div>
                
                {/* Day 4: T5 (15.1M ~ 50%) */}
                <div className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-8 bg-gray-900 text-white text-[11px] font-mono px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-20">
                    15.100.000 đ
                  </div>
                  <div className="w-full max-w-[38px] bg-blue-300 group-hover:bg-blue-600 rounded-t transition-colors duration-200" style={{ height: '50.3%' }}></div>
                  <span className="mt-3 text-xs font-semibold text-gray-500 group-hover:text-blue-600 transition-colors">T5</span>
                </div>
                
                {/* Day 5: T6 (22.4M ~ 74.6%) */}
                <div className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-8 bg-gray-900 text-white text-[11px] font-mono px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-20">
                    22.400.000 đ
                  </div>
                  <div className="w-full max-w-[38px] bg-blue-300 group-hover:bg-blue-600 rounded-t transition-colors duration-200" style={{ height: '74.6%' }}></div>
                  <span className="mt-3 text-xs font-semibold text-gray-500 group-hover:text-blue-600 transition-colors">T6</span>
                </div>
                
                {/* Day 6: T7 (24.8M ~ 82.6% - Peak) */}
                <div className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-8 bg-gray-900 text-white text-[11px] font-mono px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-20">
                    24.800.000 đ (Đỉnh tuần)
                  </div>
                  <div className="w-full max-w-[38px] bg-blue-600 rounded-t transition-colors duration-200 shadow-sm" style={{ height: '82.6%' }}></div>
                  <span className="mt-3 text-xs font-bold text-blue-600">T7</span>
                </div>
                
                {/* Day 7: CN (15.65M ~ 52%) */}
                <div className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-8 bg-gray-900 text-white text-[11px] font-mono px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-20">
                    15.650.000 đ
                  </div>
                  <div className="w-full max-w-[38px] bg-blue-300 group-hover:bg-blue-600 rounded-t transition-colors duration-200" style={{ height: '52.1%' }}></div>
                  <span className="mt-3 text-xs font-semibold text-gray-500 group-hover:text-blue-600 transition-colors">CN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Footer Legend & Average */}
          <div className="pt-4 mt-2 border-t border-gray-50 flex items-center justify-between text-gray-500 text-xs font-medium">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span>
                <span>Doanh thu thực nhận</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-300"></span>
                <span>Ngày thường</span>
              </div>
            </div>
            <div className="font-mono">
              TB: <strong className="text-gray-900">18.350.000 đ</strong> / ngày
            </div>
          </div>
        </div>

        {/* Right Column (5/12 col on lg): Recent Orders Table */}
        <div className="lg:col-span-5 bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between border border-gray-100">
          <div>
            {/* Card Header */}
            <div className="flex items-center justify-between pb-4">
              <div>
                <h2 className="text-lg text-gray-900 font-bold">Đơn hàng mới nhất</h2>
                <p className="text-sm text-gray-500 mt-0.5">Xử lý trong ngày hôm nay</p>
              </div>
              <Link href="/admin/orders" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
                Xem tất cả
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Table Container */}
            <div className="w-full overflow-x-auto rounded-lg border border-gray-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Mã ĐH</th>
                    <th className="py-3 px-4">Khách hàng</th>
                    <th className="py-3 px-4 text-right">Tổng tiền</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {/* Order 1 */}
                  <tr className="hover:bg-gray-50 transition-colors group">
                    <td className="py-3 px-4 font-mono font-medium text-blue-600">#DH-8801</td>
                    <td className="py-3 px-4 font-medium text-gray-900">Nguyễn Văn An</td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-gray-900">1.450.000 đ</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                        Đang giao
                      </span>
                    </td>
                  </tr>
                  {/* Order 2 */}
                  <tr className="hover:bg-gray-50 transition-colors group">
                    <td className="py-3 px-4 font-mono font-medium text-blue-600">#DH-8802</td>
                    <td className="py-3 px-4 font-medium text-gray-900">Trần Thị Mai</td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-gray-900">680.000 đ</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-800">
                        Hoàn tất
                      </span>
                    </td>
                  </tr>
                  {/* Order 3 */}
                  <tr className="hover:bg-gray-50 transition-colors group">
                    <td className="py-3 px-4 font-mono font-medium text-blue-600">#DH-8803</td>
                    <td className="py-3 px-4 font-medium text-gray-900">Lê Hoàng Nam</td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-gray-900">2.350.000 đ</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-800">
                        Hoàn tất
                      </span>
                    </td>
                  </tr>
                  {/* Order 4 */}
                  <tr className="hover:bg-gray-50 transition-colors group">
                    <td className="py-3 px-4 font-mono font-medium text-blue-600">#DH-8804</td>
                    <td className="py-3 px-4 font-medium text-gray-900">Phạm Minh Đức</td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-gray-900">350.000 đ</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                        Đang giao
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Summary Footer */}
          <div className="mt-4 pt-3 flex items-center justify-between text-gray-500 text-xs font-semibold bg-gray-50 -mx-6 -mb-6 px-6 py-3 rounded-b-xl border-t border-gray-100">
            <span>4 đơn gần nhất được đồng bộ</span>
            <span className="text-blue-600 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              Tự động làm mới
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
