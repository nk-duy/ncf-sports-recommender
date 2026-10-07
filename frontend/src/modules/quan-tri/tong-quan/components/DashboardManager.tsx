'use client';
import React, { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

// Mock data for the charts since we don't have time-series API right now
const revenueData = [
  { name: 'Tháng 1', revenue: 15000000, orders: 12 },
  { name: 'Tháng 2', revenue: 22000000, orders: 18 },
  { name: 'Tháng 3', revenue: 18000000, orders: 15 },
  { name: 'Tháng 4', revenue: 28000000, orders: 24 },
  { name: 'Tháng 5', revenue: 35000000, orders: 30 },
  { name: 'Tháng 6', revenue: 42000000, orders: 35 },
  { name: 'Tháng 7', revenue: 38000000, orders: 32 }
];

export default function DashboardManager() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch('http://localhost:8000/api/v1/products?limit=1'),
          fetch('http://localhost:8000/api/v1/orders?limit=100')
        ]);

        const orders = await ordersRes.json();
        const revenue = orders.reduce((sum: number, order: any) => sum + order.total_amount, 0);

        setStats({
          totalProducts: 158, // mocked total as API limit=1 doesn't return count
          totalOrders: orders.length,
          revenue: revenue
        });
      } catch (error) {
        console.error("Failed to fetch stats");
      }
    };
    fetchStats();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-100 text-sm">
          <p className="font-bold text-gray-800 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {entry.name}: {entry.name === 'Doanh thu' ? formatPrice(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tổng quan hệ thống</h1>
        <p className="text-sm text-gray-500 mt-1">Theo dõi hoạt động kinh doanh và hiệu suất cửa hàng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Doanh thu</p>
            <p className="text-2xl font-black text-gray-900 font-mono">{formatPrice(stats.revenue)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShoppingCart size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Đơn hàng</p>
            <p className="text-2xl font-black text-gray-900 font-mono">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Package size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Sản phẩm</p>
            <p className="text-2xl font-black text-gray-900 font-mono">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Khách hàng</p>
            <p className="text-2xl font-black text-gray-900 font-mono">24</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Area Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Biểu đồ doanh thu 7 tháng gần nhất</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `${val / 1000000}tr`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Lượt đặt hàng 7 tháng gần nhất</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="orders" name="Đơn hàng" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Lối tắt thao tác nhanh</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/san-pham" className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition shadow-sm flex items-center gap-2">
            <Package size={18} />
            Quản lý Sản phẩm
          </Link>
          <Link href="/admin/don-hang" className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition shadow-sm flex items-center gap-2">
            <ShoppingCart size={18} />
            Duyệt Đơn hàng
          </Link>
          <Link href="/admin/khuyen-mai" className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition shadow-sm flex items-center gap-2">
            <DollarSign size={18} />
            Quản lý Khuyến mãi
          </Link>
        </div>
      </div>
    </div>
  );
}
