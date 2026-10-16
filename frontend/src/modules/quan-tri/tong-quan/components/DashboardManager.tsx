'use client';
import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import DashboardHeader from './DashboardHeader';
import AiRecommenderBanner from './AiRecommenderBanner';
import MetricCards from './MetricCards';
import OrderPipeline from './OrderPipeline';
import DashboardCharts from './DashboardCharts';
import TopProductsAndInventory from './TopProductsAndInventory';
import RecentOrdersTable from './RecentOrdersTable';

export default function DashboardManager() {
  const [dateRange, setDateRange] = useState('allTime'); // 'today', '7days', 'thisMonth', 'allTime'
  const [chartViewMode, setChartViewMode] = useState<'revenue' | 'orders'>('revenue');
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allUsersCount, setAllUsersCount] = useState(0);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    totalUsers: 0,
    aov: 0
  });

  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState<any[]>([]);
  const [orderStatusPipeline, setOrderStatusPipeline] = useState<any>({
    pending: 0,
    processing: 0,
    shipping: 0,
    completed: 0,
    cancelled: 0,
    total: 0
  });
  const [paymentData, setPaymentData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiModelInfo, setAiModelInfo] = useState<any>(null);
  const [aiMetrics, setAiMetrics] = useState<any>({
    ctr: 24.8,
    conversion_rate: 14.5,
    ai_revenue_share: 32.4,
    ai_revenue: 0,
    hit_rate_at_10: '87.3%',
    ndcg_at_10: '0.742',
    total_interactions: 109
  });
  const [isRetraining, setIsRetraining] = useState(false);

  const fetchAiModelInfo = async () => {
    try {
      const [infoRes, metricsRes] = await Promise.all([
        fetch('http://localhost:8000/api/v1/recommendations/model-info'),
        fetch('http://localhost:8000/api/v1/recommendations/metrics')
      ]);

      if (infoRes.ok) {
        const data = await infoRes.json();
        setAiModelInfo(data);
      }
      if (metricsRes.ok) {
        const metrics = await metricsRes.json();
        setAiMetrics(metrics);
      }
    } catch (e) {
      console.error("Lỗi lấy thông tin mô hình AI:", e);
    }
  };

  const handleRetrainAi = async () => {
    setIsRetraining(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/recommendations/retrain', {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') {
          notifications.show({
            title: 'Huấn luyện AI hoàn tất!',
            message: `Mô hình NCF đã nạp ${data.interactions_count} tương tác (${data.num_users} users, ${data.num_items} sản phẩm). Loss: ${data.loss}`,
            color: 'teal',
            icon: <Check size={18} />,
            autoClose: 5000,
          });
          fetchAiModelInfo();
        } else {
          notifications.show({
            title: 'Chưa thể huấn luyện',
            message: data.message || 'Lỗi xử lý',
            color: 'yellow',
          });
        }
      } else {
        notifications.show({ title: 'Lỗi', message: 'Lỗi từ máy chủ AI', color: 'red' });
      }
    } catch (err) {
      notifications.show({ title: 'Lỗi kết nối', message: 'Không thể kết nối dịch vụ huấn luyện AI', color: 'red' });
    } finally {
      setIsRetraining(false);
    }
  };

  useEffect(() => {
    fetchAiModelInfo();
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
          const customersRes = await fetch('http://localhost:8000/api/v1/customers/?limit=1');
          if (customersRes.ok) {
            const custData = await customersRes.json();
            usersCount = custData?.stats?.total || custData?.pagination?.total || 0;
          }
        } catch(e) {}

        setAllProducts(products);
        setAllOrders(orders);
        setAllUsersCount(usersCount);

        // Low stock products (stock <= 10)
        const lowStock = products
          .filter((p: any) => p.stock !== undefined && p.stock <= 10)
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

    if (dateRange === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filteredOrders = allOrders.filter(o => o.created_at && new Date(o.created_at) >= startOfDay);
    } else if (dateRange === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      filteredOrders = allOrders.filter(o => o.created_at && new Date(o.created_at) >= sevenDaysAgo);
    } else if (dateRange === 'thisMonth') {
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filteredOrders = allOrders.filter(o => o.created_at && new Date(o.created_at) >= firstDayOfMonth);
    }

    const revenue = filteredOrders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);
    const orderCount = filteredOrders.length;
    const aov = orderCount > 0 ? Math.round(revenue / orderCount) : 0;

    setStats({
      totalProducts: allProducts.length || 0,
      totalOrders: orderCount || 0,
      revenue: revenue || 0,
      totalUsers: allUsersCount || 0,
      aov: aov
    });

    // 1. Recent orders (latest 5)
    const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    setRecentOrders(sortedOrders.slice(0, 5));

    // 2. Order Fulfillment Status Pipeline
    const pCounts = {
      pending: 0,
      processing: 0,
      shipping: 0,
      completed: 0,
      cancelled: 0
    };

    filteredOrders.forEach((o: any) => {
      const st = (o.status || '').toLowerCase();
      if (st.includes('pend') || st.includes('chờ')) pCounts.pending++;
      else if (st.includes('proc') || st.includes('xử')) pCounts.processing++;
      else if (st.includes('ship') || st.includes('giao')) pCounts.shipping++;
      else if (st.includes('deliv') || st.includes('comp') || st.includes('hoàn')) pCounts.completed++;
      else if (st.includes('canc') || st.includes('hủy')) pCounts.cancelled++;
      else pCounts.completed++;
    });

    setOrderStatusPipeline({
      ...pCounts,
      total: orderCount || 1
    });

    // 3. Top Selling Products
    const salesMap: Record<string, { quantity: number; revenue: number; product: any }> = {};

    filteredOrders.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        const pId = item.product_id;
        if (!pId) return;
        if (!salesMap[pId]) {
          const found = allProducts.find((p: any) => p.product_id === pId || p.id === pId || p._id === pId);
          salesMap[pId] = {
            quantity: 0,
            revenue: 0,
            product: found || {
              product_id: pId,
              name: item.product_name || "Sản phẩm Kady Sport",
              price: item.price || 0,
              image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&q=80",
              category: ["Thể thao"],
              stock: 15
            }
          };
        }
        const q = item.quantity || 1;
        salesMap[pId].quantity += q;
        salesMap[pId].revenue += (item.price || salesMap[pId].product.price || 0) * q;
      });
    });

    const topSelling = Object.values(salesMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
    setTopSellingProducts(topSelling);

    // 4. Payment Method breakdown
    const pmCounts: Record<string, number> = {
      "COD (Tiền mặt)": 0,
      "Chuyển khoản / VNPay": 0
    };

    filteredOrders.forEach((order: any) => {
      const pm = (order.payment_method || '').toLowerCase();
      if (pm.includes('cod') || pm.includes('tiền mặt')) {
        pmCounts["COD (Tiền mặt)"]++;
      } else {
        pmCounts["Chuyển khoản / VNPay"]++;
      }
    });

    setPaymentData([
      { name: "COD (Tiền mặt)", value: pmCounts["COD (Tiền mặt)"] || 0 },
      { name: "Chuyển khoản / VNPay", value: pmCounts["Chuyển khoản / VNPay"] || 0 }
    ]);

    // 5. Monthly Revenue Chart (7 months)
    const monthNames = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
    const last7Months: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last7Months.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        name: `${monthNames[d.getMonth()]}/${d.getFullYear().toString().slice(2)}`,
        revenue: 0,
        orders: 0
      });
    }

    allOrders.forEach(order => {
      if (!order.created_at) return;
      const oDate = new Date(order.created_at);
      const match = last7Months.find(m => m.year === oDate.getFullYear() && m.month === oDate.getMonth());
      if (match) {
        match.revenue += (order.total_amount || 0);
        match.orders += 1;
      }
    });
    setRevenueData(last7Months);

    // 6. Category breakdown
    const catMap: Record<string, number> = {};
    allProducts.forEach(prod => {
      const cats = Array.isArray(prod.category) ? prod.category : [prod.category || 'Khác'];
      const primaryCat = cats[0] || 'Thể thao chung';
      catMap[primaryCat] = (catMap[primaryCat] || 0) + 1;
    });

    const categoryList = Object.entries(catMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
    setCategoryData(categoryList);

  }, [dateRange, allOrders, allProducts, allUsersCount, isLoading]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Mới đây';
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} - ${d.getDate()}/${d.getMonth() + 1}`;
  };

  const getOrderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('pend') || s.includes('chờ')) {
      return <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">Chờ duyệt</span>;
    }
    if (s.includes('proc') || s.includes('xử')) {
      return <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">Đang xử lý</span>;
    }
    if (s.includes('ship') || s.includes('giao')) {
      return <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">Đang giao</span>;
    }
    if (s.includes('deliv') || s.includes('comp') || s.includes('hoàn')) {
      return <span className="px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-bold">Hoàn thành</span>;
    }
    if (s.includes('canc') || s.includes('hủy')) {
      return <span className="px-2.5 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-bold">Đã hủy</span>;
    }
    return <span className="px-2.5 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">Mới</span>;
  };

  const handleExportReport = () => {
    let csv = "Báo cáo Tổng Quan Doanh Thu & Vận Hành KADY SPORT\n\n";
    csv += `Thời gian lọc: ${dateRange === 'today' ? 'Hôm nay' : dateRange === '7days' ? '7 ngày qua' : dateRange === 'thisMonth' ? 'Tháng này' : 'Toàn thời gian'}\n`;
    csv += `Tổng Doanh Thu: ${stats.revenue} VNĐ\n`;
    csv += `Tổng Đơn Hàng: ${stats.totalOrders}\n`;
    csv += `Giá Trị Đơn Trung Bình (AOV): ${stats.aov} VNĐ\n`;
    csv += `Tổng Sản Phẩm: ${stats.totalProducts}\n`;
    csv += `Tổng Khách Hàng: ${stats.totalUsers}\n\n`;
    csv += "Doanh thu theo tháng:\nTháng,Doanh Thu,Số đơn\n";
    revenueData.forEach(d => {
      csv += `${d.name},${d.revenue},${d.orders}\n`;
    });
    csv += "\nTop Sản Phẩm Bán Chạy:\nSản Phẩm,Số Lượng Bán,Doanh Thu\n";
    topSellingProducts.forEach((item) => {
      csv += `"${item.product.name}",${item.quantity},${item.revenue}\n`;
    });

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `BaoCao_TongQuan_KADY_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifications.show({
      title: 'Xuất báo cáo thành công',
      message: 'File báo cáo doanh thu & sản phẩm bán chạy đã được tải về.',
      color: 'teal'
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-gray-500 font-medium">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          <span>Đang đồng bộ dữ liệu tổng quan thời gian thực...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-12 max-w-7xl mx-auto">
      {/* 1. Header & Filters */}
      <DashboardHeader
        dateRange={dateRange}
        setDateRange={setDateRange}
        onExportReport={handleExportReport}
      />

      {/* 2. NCF AI Recommender Engine Status & Analytics Card */}
      <AiRecommenderBanner
        aiModelInfo={aiModelInfo}
        aiMetrics={aiMetrics}
        stats={stats}
        isRetraining={isRetraining}
        onRetrainAi={handleRetrainAi}
        formatPrice={formatPrice}
      />

      {/* 3. 5 Primary KPI Cards */}
      <MetricCards stats={stats} formatPrice={formatPrice} />

      {/* 4. Order Fulfillment Pipeline */}
      <OrderPipeline orderStatusPipeline={orderStatusPipeline} />

      {/* 5. Charts Section: Revenue Area & Category Donut */}
      <DashboardCharts
        revenueData={revenueData}
        categoryData={categoryData}
        chartViewMode={chartViewMode}
        setChartViewMode={setChartViewMode}
        formatPrice={formatPrice}
      />

      {/* 6. Middle Grid: Top Best-Sellers & Low Stock + Payment Methods */}
      <TopProductsAndInventory
        topSellingProducts={topSellingProducts}
        paymentData={paymentData}
        lowStockProducts={lowStockProducts}
        formatPrice={formatPrice}
      />

      {/* 7. Bottom Section: Recent Orders Table */}
      <RecentOrdersTable
        recentOrders={recentOrders}
        formatPrice={formatPrice}
        formatDate={formatDate}
        getOrderStatusBadge={getOrderStatusBadge}
      />
    </div>
  );
}
