'use client';
import React, { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
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
        
        // We just estimate total products here by reading length if we had it, but we only fetched 1. 
        // Ideally we need a count API, but we'll just mock for now.
        const orders = await ordersRes.json();
        const revenue = orders.reduce((sum: number, order: any) => sum + order.total_amount, 0);

        setStats({
          totalProducts: 158, // mocked total
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tổng quan hệ thống</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Doanh thu</p>
            <p className="text-2xl font-black text-gray-900 font-mono">{formatPrice(stats.revenue)}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShoppingCart size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Đơn hàng</p>
            <p className="text-2xl font-black text-gray-900 font-mono">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Package size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Sản phẩm</p>
            <p className="text-2xl font-black text-gray-900 font-mono">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Khách hàng</p>
            <p className="text-2xl font-black text-gray-900 font-mono">24</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Lối tắt thao tác</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/products" className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 hover:border-gray-300 transition shadow-sm">
            Quản lý Sản phẩm
          </Link>
          <Link href="/admin/orders" className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 hover:border-gray-300 transition shadow-sm">
            Duyệt Đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
