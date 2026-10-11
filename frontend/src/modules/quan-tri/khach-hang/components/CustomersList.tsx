"use client";

import React, { useState } from "react";
import { 
  ChevronRight, Download, Megaphone, Plus, Users, 
  ArrowUp, UserCheck, Award, Infinity as InfinityIcon,
  Search, Filter, RotateCcw, Diamond, Medal, Shield, 
  Star, Eye, MoreVertical, X, Mail, Phone, MapPin, 
  Sparkles, Gift, Edit3, ChevronLeft
} from "lucide-react";
import { notifications } from "@mantine/notifications";

const tierConfig: any = {
  "Kim Cương": { icon: Diamond, colors: { bg: "bg-emerald-100", text: "text-emerald-800", icon: "text-emerald-600", badge: "bg-emerald-500", badgeText: "text-white" } },
  "Vàng": { icon: Medal, colors: { bg: "bg-amber-100", text: "text-amber-800", icon: "text-amber-600", badge: "bg-amber-500", badgeText: "text-white" } },
  "Bạc": { icon: Shield, colors: { bg: "bg-gray-200", text: "text-gray-800", icon: "text-gray-600", badge: "bg-gray-400", badgeText: "text-white" } },
  "Đồng": { icon: Star, colors: { bg: "bg-orange-100", text: "text-orange-800", icon: "text-orange-600", badge: "bg-orange-400", badgeText: "text-white" } },
  "Đồng (Mới)": { icon: Star, colors: { bg: "bg-orange-100", text: "text-orange-800", icon: "text-orange-600", badge: "bg-orange-400", badgeText: "text-white" } },
  "default": { icon: UserCheck, colors: { bg: "bg-blue-100", text: "text-blue-800", icon: "text-blue-600", badge: "bg-blue-500", badgeText: "text-white" } }
};

export default function AdminCustomersList() {
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, vip: 0, clv: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  React.useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // Replace with actual API token
        const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
        const res = await fetch(`http://localhost:8000/api/v1/customers/?page=${page}&limit=10`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          const mappedCustomers = data.customers.map((c: any) => {
            const tConfig = tierConfig[c.tier] || tierConfig["default"];
            return {
              ...c,
              tierIcon: tConfig.icon,
              tierColors: tConfig.colors,
              spentShort: (c.spent / 1000000).toFixed(2) + " tr",
              spent: c.spent.toLocaleString("vi-VN") + " đ"
            };
          });
          setCustomers(mappedCustomers);
          setStats(data.stats);
          setTotalPages(data.pagination.total_pages);
          if (mappedCustomers.length > 0 && !activeCustomerId) {
            setActiveCustomerId(mappedCustomers[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [page]);

  const activeCustomer = customers.find(c => c.id === activeCustomerId);

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Section 1: Breadcrumb & Title Area */}
      <div className="flex flex-col gap-2 pb-2">
        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Thương mại điện tử</span>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-bold">Quản lý Khách hàng</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl text-gray-900 font-bold tracking-tight">
              Danh sách Khách hàng &amp; Phân hạng Hội viên
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý thông tin tài khoản, lịch sử mua hàng thể thao, phân nhóm RFM và gắn thẻ sở thích bộ môn.
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <button 
              onClick={() => notifications.show({ title: 'Đang phát triển', message: 'Tính năng Xuất Excel đang được phát triển', color: 'blue' })} 
              className="h-9 px-3 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm text-sm font-semibold flex items-center gap-1.5 transition-all"
            >
              <Download size={16} />
              <span>Xuất Excel</span>
            </button>
            <button 
              onClick={() => notifications.show({ title: 'Đang phát triển', message: 'Tính năng Gửi thông báo / Voucher đang được phát triển', color: 'blue' })} 
              className="h-9 px-3 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm text-sm font-semibold flex items-center gap-1.5 transition-all"
            >
              <Megaphone size={16} />
              <span>Gửi thông báo / Voucher</span>
            </button>
            <button 
              onClick={() => notifications.show({ title: 'Đang phát triển', message: 'Tính năng Thêm khách hàng mới đang được phát triển', color: 'blue' })} 
              className="h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-sm font-semibold flex items-center gap-1.5 transition-all"
            >
              <Plus size={16} />
              <span>Thêm khách hàng mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Four Horizontal KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Tổng khách hàng</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-gray-900 font-bold tracking-tight">{stats.total.toLocaleString("vi-VN")}</span>
              <span className="text-xs text-green-600 font-semibold flex items-center">
                <ArrowUp size={14} />12.8%
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-semibold text-blue-600">+{Math.ceil(stats.total * 0.05)}</span> người mới tuần này
            </p>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: '78%' }}></div>
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Hội viên tích cực</span>
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <UserCheck size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-gray-900 font-bold tracking-tight">{stats.active.toLocaleString("vi-VN")}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-800 font-bold">
                {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Hoạt động trong 30 ngày qua
            </p>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-green-500 h-full rounded-full" style={{ width: stats.total > 0 ? `${(stats.active / stats.total) * 100}%` : '0%' }}></div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Khách hàng VIP / Platinum</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Award size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-gray-900 font-bold tracking-tight">{stats.vip.toLocaleString("vi-VN")}</span>
              <span className="text-xs text-gray-500 font-medium">thành viên</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              TB: <span className="font-semibold text-gray-900">{((stats.clv || 0) * 1.5).toLocaleString("vi-VN")} đ</span>/người
            </p>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: stats.total > 0 ? `${(stats.vip / stats.total) * 100}%` : '0%' }}></div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Giá trị vòng đời TB (CLV)</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
              <InfinityIcon size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-gray-900 font-bold tracking-tight">{Math.round(stats.clv || 0).toLocaleString("vi-VN")}</span>
              <span className="text-sm text-gray-500 font-medium">đ</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Tần suất mua: <span className="font-semibold text-gray-900">{((stats.active || 1) / (stats.total || 1) * 5).toFixed(1)} lần</span>/năm
            </p>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: '55%' }}></div>
          </div>
        </div>
      </div>

      {/* Section 3: Toolbar & Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-4">
        {/* Quick Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button className="px-4 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold text-sm whitespace-nowrap transition-colors">
            Tất cả <span className="ml-1 text-[11px] opacity-75 font-mono">({stats.total.toLocaleString("vi-VN")})</span>
          </button>
          <button className="px-4 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-900 font-medium text-sm whitespace-nowrap transition-colors">
            Hội viên VIP <span className="ml-1 text-[11px] font-mono">({stats.vip.toLocaleString("vi-VN")})</span>
          </button>
          <button className="px-4 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-900 font-medium text-sm whitespace-nowrap transition-colors">
            Khách hàng mới <span className="ml-1 text-[11px] font-mono">({Math.floor(stats.total * 0.15)})</span>
          </button>
          <button className="px-4 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-900 font-medium text-sm whitespace-nowrap transition-colors">
            Tiềm năng <span className="ml-1 text-[11px] font-mono">({Math.floor(stats.total * 0.4)})</span>
          </button>
          <button className="px-4 py-1.5 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 font-medium text-sm whitespace-nowrap transition-colors">
            Nguy cơ rời bỏ <span className="ml-1 text-[11px] font-mono">({Math.floor(stats.total * 0.05)})</span>
          </button>
        </div>
        
        {/* Search and Select Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Box (Span 4) */}
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
            <input 
              type="text" 
              placeholder="Tìm theo tên, email, SĐT, mã KH (#KH-...)" 
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          
          {/* Dropdown 1: Tier (Span 2) */}
          <div className="md:col-span-2">
            <select className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 appearance-none">
              <option value="">Phân hạng: Tất cả</option>
              <option value="diamond">Kim Cương</option>
              <option value="gold">Vàng</option>
              <option value="silver">Bạc</option>
              <option value="bronze">Đồng</option>
            </select>
          </div>
          
          {/* Dropdown 2: Sport Category (Span 2) */}
          <div className="md:col-span-2">
            <select className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 appearance-none">
              <option value="">Bộ môn: Tất cả</option>
              <option value="running">Chạy bộ</option>
              <option value="gym">Gym / Fitness</option>
              <option value="camping">Camping / Dã ngoại</option>
              <option value="football">Bóng đá</option>
            </select>
          </div>
          
          {/* Dropdown 3: Region (Span 2) */}
          <div className="md:col-span-2">
            <select className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 appearance-none">
              <option value="">Khu vực: Tất cả</option>
              <option value="hanoi">Hà Nội</option>
              <option value="hcm">TP. Hồ Chí Minh</option>
              <option value="danang">Đà Nẵng</option>
              <option value="other">Khác</option>
            </select>
          </div>
          
          {/* Actions Buttons (Span 2) */}
          <div className="md:col-span-2 flex items-center gap-2 justify-end">
            <button className="h-9 px-4 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold text-sm flex items-center justify-center gap-1.5 flex-1 transition-colors">
              <Filter size={16} />
              <span>Lọc</span>
            </button>
            <button className="h-9 w-9 rounded-lg bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 flex items-center justify-center transition-colors" title="Làm mới bộ lọc">
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Split Layout (65% Table / 35% Quick View) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Data Table */}
        <div className={`flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${activeCustomer ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3 px-3 w-10 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  </th>
                  <th className="py-3 px-4">Khách hàng</th>
                  <th className="py-3 px-4">Hạng TV</th>
                  <th className="py-3 px-4">Bộ môn quan tâm</th>
                  <th className="py-3 px-4 text-center">Đơn</th>
                  <th className="py-3 px-4 text-right">Tổng chi tiêu</th>
                  <th className="py-3 px-4">Lần cuối mua</th>
                  <th className="py-3 px-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      Đang tải danh sách khách hàng...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      Không tìm thấy khách hàng nào.
                    </td>
                  </tr>
                ) : customers.map((customer) => {
                  const isActive = activeCustomerId === customer.id;
                  const TierIcon = customer.tierIcon;
                  return (
                    <tr 
                      key={customer.id} 
                      onClick={() => setActiveCustomerId(customer.id)}
                      className={`cursor-pointer transition-colors ${isActive ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-gray-50'}`}
                    >
                      <td className="py-3 px-3 text-center" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${customer.tierColors.badge} ${customer.tierColors.badgeText} font-bold flex items-center justify-center text-xs shrink-0`}>
                            {customer.initials}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-gray-900 truncate">{customer.name}</span>
                            <span className="font-mono text-[11px] text-gray-500">{customer.code} • {customer.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${customer.tierColors.bg} ${customer.tierColors.text} text-[11px] font-bold`}>
                          <TierIcon size={12} className={customer.tierColors.icon} /> 
                          {customer.tier}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {customer.sports.map((sport: string) => (
                            <span key={sport} className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[11px] font-medium border border-gray-200">
                              {sport}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-semibold text-gray-900">
                        {customer.orders}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-gray-900">
                        {activeCustomer ? customer.spentShort : customer.spent}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-500 text-xs font-medium">
                        {customer.lastPurchase}
                      </td>
                      <td className="py-3 px-3 text-center" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1 rounded hover:bg-gray-200 text-blue-600 transition-colors" title="Xem chi tiết" onClick={() => setActiveCustomerId(customer.id)}>
                            <Eye size={16} />
                          </button>
                          <button className="p-1 rounded hover:bg-gray-200 text-gray-500 transition-colors" title="Cài đặt">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="px-4 py-3 bg-white border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <div className="text-sm text-gray-500">
              Hiển thị <span className="font-semibold text-gray-900">
                {stats.total === 0 ? 0 : (page - 1) * 10 + 1} - {Math.min(page * 10, stats.total)}
              </span> của <span className="font-semibold text-gray-900">{stats.total.toLocaleString("vi-VN")}</span> khách hàng
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${page === 1 ? 'border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100 border border-gray-200 text-gray-700'}`}
              >
                <ChevronLeft size={16} />
              </button>
              
              <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-sm font-semibold flex items-center justify-center shadow-sm">
                {page}
              </button>
              
              {page < totalPages && (
                <button 
                  onClick={() => setPage(page + 1)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-700 text-sm font-semibold flex items-center justify-center transition-colors"
                >
                  {page + 1}
                </button>
              )}
              
              {page + 1 < totalPages && (
                <>
                  <span className="px-1 text-gray-400 text-sm font-semibold">...</span>
                  <button 
                    onClick={() => setPage(totalPages)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-700 text-sm font-semibold flex items-center justify-center transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${page === totalPages || totalPages === 0 ? 'border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100 border border-gray-200 text-gray-700'}`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Profile Quick View */}
        {activeCustomer && (
          <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
            {/* Profile Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${activeCustomer.tierColors.badge} ${activeCustomer.tierColors.badgeText} flex items-center justify-center font-bold text-lg shrink-0 shadow-sm`}>
                  {activeCustomer.initials}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-bold text-gray-900">{activeCustomer.name}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${activeCustomer.tierColors.bg} ${activeCustomer.tierColors.text} text-[10px] font-bold`}>
                      {React.createElement(activeCustomer.tierIcon, { size: 12, className: activeCustomer.tierColors.icon })}
                      {activeCustomer.tier}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-gray-500 mt-0.5">Mã: {activeCustomer.code} • Tham gia: {activeCustomer.joinDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors" title="Tùy chọn">
                  <MoreVertical size={18} />
                </button>
                <button 
                  className="p-1 rounded text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" 
                  title="Đóng bảng"
                  onClick={() => setActiveCustomerId(null)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Contact Info Section */}
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex flex-col gap-2 text-sm text-gray-700">
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-gray-400" />
                <span className="font-mono">{activeCustomer.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-gray-400" />
                <span className="font-mono">{activeCustomer.phone}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{activeCustomer.address}</span>
              </div>
            </div>

            {/* Customer KPI Mini Grid */}
            <div className="grid grid-cols-3 gap-2 bg-blue-50/50 border border-blue-100 p-3 rounded-lg text-center">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Tổng đơn</span>
                <span className="text-lg font-bold text-gray-900 mt-0.5">{activeCustomer.orders}</span>
              </div>
              <div className="flex flex-col border-x border-blue-100/50">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Chi tiêu</span>
                <span className="text-lg font-bold text-blue-600 mt-0.5">{activeCustomer.spentShort}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Hoàn trả</span>
                <span className="text-lg font-bold text-green-600 mt-0.5">{activeCustomer.returnRate}</span>
              </div>
            </div>

            {/* AI Profile Tags Section */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Sparkles size={16} className="text-blue-600" /> Hồ sơ sở thích AI
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">Độ tin cậy {activeCustomer.aiScore}%</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Bộ môn ưu tiên:</span>
                  <span className="font-semibold text-gray-900">{activeCustomer.aiProfile}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Cỡ giày tiêu chuẩn:</span>
                  <span className="font-semibold text-gray-900 font-mono">{activeCustomer.shoeSize}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Gam màu ưa thích:</span>
                  <div className="flex items-center gap-1.5">
                    {activeCustomer.colors.map((c: string, i: number) => (
                      <span key={i} className={`w-3.5 h-3.5 rounded-full ${c} inline-block shadow-[0_0_2px_rgba(0,0,0,0.2)]`}></span>
                    ))}
                    <span className="text-xs font-medium text-gray-500 ml-1">{activeCustomer.colorNames}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders List */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Lịch sử đơn gần nhất</span>
                <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">Xem tất cả</a>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 font-mono">#ORD-99214</span>
                    <span className="text-[11px] text-gray-500 mt-0.5">18/10/2023 • 2 sản phẩm</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-gray-900 font-mono">3.450.000 đ</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 mt-0.5">Đang giao</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 font-mono">#ORD-98012</span>
                    <span className="text-[11px] text-gray-500 mt-0.5">02/09/2023 • Giày Nike Alphafly</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-gray-900 font-mono">6.890.000 đ</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 mt-0.5">Hoàn tất</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col gap-2 mt-2">
              <button className="w-full h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                <Mail size={16} />
                <span>Gửi Email thông báo</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="h-9 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                  <Gift size={16} className="text-green-600" />
                  <span>Tặng Voucher</span>
                </button>
                <button className="h-9 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                  <Edit3 size={16} />
                  <span>Chỉnh sửa hồ sơ</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
