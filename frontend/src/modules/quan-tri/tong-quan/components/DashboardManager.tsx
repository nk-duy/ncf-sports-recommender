'use client';
import React, { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, Users, Download, AlertTriangle, Clock, ArrowRight, Eye, Calendar } from 'lucide-react';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#14b8a6'];

export default function DashboardManager() {
  const [dateRange, setDateRange] = useState('allTime'); // '7days', 'thisMonth', 'allTime'
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allUsersCount, setAllUsersCount] = useState(0);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    totalUsers: 0
  });

  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch('http://localhost:8000/api/v1/products?limit=1000'),
          fetch('http://localhost:8000/api/v1/orders?limit=1000')
        ]);

        const products = productsRes.ok ? await productsRes.json() : [];
        const orders = ordersRes.ok ? await ordersRes.json() : [];
        
        let usersCount = 0;
        try {
          const usersRes = await fetch('http://localhost:8000/api/v1/users?limit=1000');
          if (usersRes.ok) {
            const users = await usersRes.json();
            usersCount = users.length || 0;
          }
        } catch(e) {}

        setAllProducts(products);
        setAllOrders(orders);
        setAllUsersCount(usersCount);

        // Calculate low stock products
        const lowStock = products
          .filter((p: any) => p.stock !== undefined && p.stock <= 5)
          .sort((a: any, b: any) => a.stock - b.stock)
          .slice(0, 5);
        setLowStockProducts(lowStock);

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const now = new Date();
    let filteredOrders = [...allOrders];

    if (dateRange === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      filteredOrders = allOrders.filter(o => o.created_at && new Date(o.created_at) >= sevenDaysAgo);
    } else if (dateRange === 'thisMonth') {
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filteredOrders = allOrders.filter(o => o.created_at && new Date(o.created_at) >= firstDayOfMonth);
    }

    const revenue = filteredOrders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);

    setStats({
      totalProducts: allProducts.length || 0,
      totalOrders: filteredOrders.length || 0,
      revenue: revenue || 0,
      totalUsers: allUsersCount || 0
    });

    // Recent orders (latest 5)
    const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    setRecentOrders(sortedOrders.slice(0, 5));

    // Chart Data: Last 7 months
    const months = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        monthStr: `${d.getMonth() + 1}/${d.getFullYear()}`,
        name: `T${d.getMonth() + 1}`,
        revenue: 0,
        orders: 0
      });
    }

    filteredOrders.forEach((order: any) => {
      if (!order.created_at) return;
      const d = new Date(order.created_at);
      const monthStr = `${d.getMonth() + 1}/${d.getFullYear()}`;
      const targetMonth = months.find(m => m.monthStr === monthStr);
      if (targetMonth) {
        targetMonth.revenue += (order.total_amount || 0);
        targetMonth.orders += 1;
      }
    });
    setRevenueData(months);

    // Category Pie Chart
    const catStats: Record<string, number> = {};
    allProducts.forEach((p: any) => {
      const category = p.category && p.category.length > 0 ? p.category[0] : 'Khác';
      if (catStats[category] === undefined) {
        catStats[category] = 0;
      }
    });

    filteredOrders.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        const product = allProducts.find((p: any) => p.product_id === item.product_id);
        const category = product?.category && product.category.length > 0 ? product.category[0] : 'Khác';
        if (catStats[category] === undefined) {
          catStats[category] = 0;
        }
        catStats[category] += (item.quantity || 1);
      });
    });
    
    const catArray = Object.entries(catStats)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0) // Only show categories with sales
      .sort((a, b) => b.value - a.value)
      .slice(0, 7); // Top 7 categories

    setCategoryData(catArray);
  }, [allOrders, allProducts, allUsersCount, dateRange, isLoading]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { 
      year: 'numeric', month: '2-digit', day: '2-digit', 
      hour: '2-digit', minute: '2-digit' 
    }).format(date);
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Chờ duyệt</span>;
      case 'PROCESSING': return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Đang xử lý</span>;
      case 'SHIPPED': return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">Đang giao</span>;
      case 'DELIVERED': return <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Hoàn thành</span>;
      case 'CANCELLED': return <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Đã hủy</span>;
      default: return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">{status || 'Mới'}</span>;
    }
  };

  const handleExportReport = () => {
    let csv = "Báo cáo Tổng Quan KADY\n\n";
    csv += `Thời gian lọc: ${dateRange === '7days' ? '7 ngày qua' : dateRange === 'thisMonth' ? 'Tháng này' : 'Toàn thời gian'}\n`;
    csv += `Tổng Doanh Thu: ${stats.revenue}\n`;
    csv += `Tổng Đơn Hàng: ${stats.totalOrders}\n`;
    csv += `Tổng Sản Phẩm: ${stats.totalProducts}\n`;
    csv += `Tổng Khách Hàng: ${stats.totalUsers}\n\n`;
    csv += "Doanh thu theo tháng:\nTháng,Doanh Thu,Số đơn\n";
    revenueData.forEach(d => {
      csv += `${d.name},${d.revenue},${d.orders}\n`;
    });
    csv += "\nSố lượng bán theo danh mục:\nDanh Mục,Số Lượng Bán\n";
    categoryData.forEach(d => {
      csv += `${d.name},${d.value}\n`;
    });

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `BaoCao_KADY_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-sm">
          <p className="font-bold text-gray-800 mb-2">{label || payload[0].name}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 font-medium" style={{ color: entry.color || entry.payload.fill }}>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color || entry.payload.fill }}></span>
              {entry.name === 'Doanh thu' ? formatPrice(entry.value) : `${entry.name}: ${entry.value}`}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <div className="flex h-96 items-center justify-center text-gray-500 animate-pulse font-medium">Đang tải dữ liệu thực tế...</div>;
  }

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tổng quan hệ thống</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi hoạt động kinh doanh và vận hành cửa hàng</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={16} className="text-gray-400" />
            </div>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer hover:bg-gray-100 transition"
            >
              <option value="7days">7 ngày qua</option>
              <option value="thisMonth">Tháng này</option>
              <option value="allTime">Toàn thời gian</option>
            </select>
          </div>
          
          <button 
            onClick={handleExportReport}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl shadow-sm hover:bg-gray-800 transition font-semibold text-sm"
          >
            <Download size={16} />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition group cursor-default">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-0.5">Doanh thu</p>
            <p className="text-xl font-black text-gray-900">{formatPrice(stats.revenue)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-emerald-200 transition group cursor-default">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
            <ShoppingCart size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-0.5">Đơn hàng</p>
            <p className="text-2xl font-black text-gray-900">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-amber-200 transition group cursor-default">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
            <Package size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-0.5">Sản phẩm</p>
            <p className="text-2xl font-black text-gray-900">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-purple-200 transition group cursor-default">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-0.5">Khách hàng</p>
            <p className="text-2xl font-black text-gray-900">{stats.totalUsers}</p>
          </div>
        </div>
      </div>

      {/* Middle Section: Recent Orders & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Đơn hàng mới nhất</h2>
            </div>
            <Link href="/admin/don-hang" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Xem tất cả <ArrowRight size={16} />
            </Link>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Mã Đơn</th>
                  <th className="px-5 py-3">Khách Hàng</th>
                  <th className="px-5 py-3">Thời Gian</th>
                  <th className="px-5 py-3">Tổng Tiền</th>
                  <th className="px-5 py-3">Trạng Thái</th>
                  <th className="px-5 py-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.length > 0 ? recentOrders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-medium text-gray-900">#{order.order_id?.substring(0, 8)}...</td>
                    <td className="px-5 py-3">{order.shipping_address?.full_name || 'Khách Vãng Lai'}</td>
                    <td className="px-5 py-3 text-gray-500">{formatDate(order.created_at)}</td>
                    <td className="px-5 py-3 font-bold text-blue-600">{formatPrice(order.total_amount || 0)}</td>
                    <td className="px-5 py-3">{getOrderStatusBadge(order.status)}</td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/admin/don-hang?id=${order.order_id}`} className="p-1.5 bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 rounded-lg inline-flex items-center justify-center transition shadow-sm">
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-500">Không có đơn hàng nào trong thời gian này.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 flex flex-col">
          <div className="p-5 border-b border-red-100 bg-red-50/50 flex items-center gap-2 rounded-t-2xl">
            <AlertTriangle size={20} className="text-red-500" />
            <h2 className="text-lg font-bold text-red-700">Cảnh báo sắp hết hàng</h2>
          </div>
          <div className="p-5 flex-1 flex flex-col gap-4">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map(product => (
                <div key={product.product_id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate" title={product.name}>{product.name}</p>
                    <p className="text-xs font-semibold text-red-500 mt-0.5">Chỉ còn {product.stock} sản phẩm</p>
                  </div>
                  <Link href={`/admin/san-pham`} className="shrink-0 p-1.5 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg">
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-3 text-green-500">
                  <Package size={24} />
                </div>
                <p className="font-medium text-gray-600">Tồn kho ổn định</p>
                <p className="text-sm text-gray-500">Không có sản phẩm nào sắp hết hàng.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Area Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Biểu đồ Doanh thu (7 Tháng)</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `${val / 1000000}tr`} width={50} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Tỷ trọng Danh mục Bán ra</h2>
          <p className="text-sm text-gray-500 mb-6">Theo số lượng sản phẩm đã bán ({dateRange === '7days' ? '7 ngày qua' : dateRange === 'thisMonth' ? 'Tháng này' : 'Toàn thời gian'})</p>
          
          <div className="flex-1 min-h-[300px] w-full flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400 font-medium flex flex-col items-center">
                <Package size={48} className="mb-3 opacity-20" />
                Chưa có dữ liệu bán hàng trong kỳ
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
