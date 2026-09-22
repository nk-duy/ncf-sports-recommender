"use client";

import React, { useState } from "react";
import { 
  ChevronRight, Download, Megaphone, Plus, Users, 
  ArrowUp, UserCheck, Award, Infinity as InfinityIcon,
  Search, Filter, RotateCcw, Diamond, Medal, Shield, 
  Star, Eye, MoreVertical, X, Mail, Phone, MapPin, 
  Sparkles, Gift, Edit3, ChevronLeft
} from "lucide-react";

// Mock Data for Customers
const mockCustomers = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    phone: "0912.345.456",
    code: "#KH-0101",
    email: "an.nguyen@gmail.com",
    address: "Tầng 12, Tòa Keangnam Landmark 72, Nam Từ Liêm, Hà Nội",
    joinDate: "14/03/2023",
    initials: "AN",
    tier: "Kim Cương",
    tierIcon: Diamond,
    tierColors: { bg: "bg-emerald-100", text: "text-emerald-800", icon: "text-emerald-600", badge: "bg-emerald-500", badgeText: "text-white" },
    sports: ["Chạy bộ", "Marathon"],
    orders: 8,
    spent: "14.250.000 đ",
    spentShort: "14.25 tr",
    lastPurchase: "2 giờ trước",
    returnRate: "0%",
    aiProfile: "Chạy bộ Marathon",
    aiScore: 98,
    shoeSize: "42 EU / 8.5 US",
    colors: ["bg-blue-600", "bg-white", "bg-gray-900"],
    colorNames: "Xanh / Trắng / Đen"
  },
  {
    id: 2,
    name: "Trần Thị Mai",
    phone: "0988.112.233",
    code: "#KH-0102",
    email: "mai.tran@gmail.com",
    address: "Quận 1, TP. Hồ Chí Minh",
    joinDate: "20/05/2023",
    initials: "TM",
    tier: "Vàng",
    tierIcon: Medal,
    tierColors: { bg: "bg-amber-100", text: "text-amber-800", icon: "text-amber-600", badge: "bg-amber-500", badgeText: "text-white" },
    sports: ["Yoga", "Gym"],
    orders: 5,
    spent: "6.850.000 đ",
    spentShort: "6.85 tr",
    lastPurchase: "Hôm qua",
    returnRate: "5%",
    aiProfile: "Yoga Cơ bản",
    aiScore: 95,
    shoeSize: "38 EU / 7 US",
    colors: ["bg-pink-500", "bg-gray-900"],
    colorNames: "Hồng / Đen"
  },
  {
    id: 3,
    name: "Lê Hoàng Nam",
    phone: "0903.789.012",
    code: "#KH-0103",
    email: "nam.le@gmail.com",
    address: "Hải Châu, Đà Nẵng",
    joinDate: "05/01/2023",
    initials: "LN",
    tier: "Vàng",
    tierIcon: Medal,
    tierColors: { bg: "bg-amber-100", text: "text-amber-800", icon: "text-amber-600", badge: "bg-amber-500", badgeText: "text-white" },
    sports: ["Camping", "Dã ngoại"],
    orders: 4,
    spent: "8.120.000 đ",
    spentShort: "8.12 tr",
    lastPurchase: "3 ngày trước",
    returnRate: "0%",
    aiProfile: "Dã ngoại Gia đình",
    aiScore: 92,
    shoeSize: "43 EU / 9.5 US",
    colors: ["bg-green-600", "bg-gray-900"],
    colorNames: "Xanh lá / Đen"
  },
  {
    id: 4,
    name: "Phạm Minh Đức",
    phone: "0934.321.654",
    code: "#KH-0104",
    email: "duc.pham@gmail.com",
    address: "Thanh Xuân, Hà Nội",
    joinDate: "12/08/2023",
    initials: "PĐ",
    tier: "Bạc",
    tierIcon: Shield,
    tierColors: { bg: "bg-gray-200", text: "text-gray-800", icon: "text-gray-600", badge: "bg-gray-400", badgeText: "text-white" },
    sports: ["Gym", "Kháng lực"],
    orders: 2,
    spent: "1.030.000 đ",
    spentShort: "1.03 tr",
    lastPurchase: "1 tuần trước",
    returnRate: "10%",
    aiProfile: "Thể hình Cơ bản",
    aiScore: 88,
    shoeSize: "41 EU / 8 US",
    colors: ["bg-gray-900", "bg-white"],
    colorNames: "Đen / Trắng"
  },
  {
    id: 5,
    name: "Vũ Hoàng Yến",
    phone: "0971.654.987",
    code: "#KH-0105",
    email: "yen.vu@gmail.com",
    address: "Quận 7, TP. Hồ Chí Minh",
    joinDate: "02/11/2022",
    initials: "VY",
    tier: "Kim Cương",
    tierIcon: Diamond,
    tierColors: { bg: "bg-emerald-100", text: "text-emerald-800", icon: "text-emerald-600", badge: "bg-emerald-500", badgeText: "text-white" },
    sports: ["Trail Running", "Giày"],
    orders: 7,
    spent: "11.900.000 đ",
    spentShort: "11.9 tr",
    lastPurchase: "5 ngày trước",
    returnRate: "0%",
    aiProfile: "Trail Running Nâng cao",
    aiScore: 96,
    shoeSize: "39 EU / 7.5 US",
    colors: ["bg-orange-500", "bg-gray-500"],
    colorNames: "Cam / Xám"
  },
  {
    id: 6,
    name: "Đặng Quốc Bảo",
    phone: "0918.999.321",
    code: "#KH-0106",
    email: "bao.dang@gmail.com",
    address: "Gò Vấp, TP. Hồ Chí Minh",
    joinDate: "01/10/2023",
    initials: "ĐB",
    tier: "Đồng (Mới)",
    tierIcon: Star,
    tierColors: { bg: "bg-orange-100", text: "text-orange-800", icon: "text-orange-600", badge: "bg-orange-400", badgeText: "text-white" },
    sports: ["Quần áo"],
    orders: 1,
    spent: "1.050.000 đ",
    spentShort: "1.05 tr",
    lastPurchase: "2 tuần trước",
    returnRate: "0%",
    aiProfile: "Thể thao Chung",
    aiScore: 75,
    shoeSize: "40 EU / 7.5 US",
    colors: ["bg-blue-500", "bg-gray-900"],
    colorNames: "Xanh dương / Đen"
  }
];

export default function AdminCustomersList() {
  const [activeCustomerId, setActiveCustomerId] = useState<number | null>(mockCustomers[0].id);

  const activeCustomer = mockCustomers.find(c => c.id === activeCustomerId);

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
            <button className="h-9 px-3 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm text-sm font-semibold flex items-center gap-1.5 transition-all">
              <Download size={16} />
              <span>Xuất Excel</span>
            </button>
            <button className="h-9 px-3 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm text-sm font-semibold flex items-center gap-1.5 transition-all">
              <Megaphone size={16} />
              <span>Gửi thông báo / Voucher</span>
            </button>
            <button className="h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-sm font-semibold flex items-center gap-1.5 transition-all">
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
              <span className="text-2xl text-gray-900 font-bold tracking-tight">1.250</span>
              <span className="text-xs text-green-600 font-semibold flex items-center">
                <ArrowUp size={14} />12.8%
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-semibold text-blue-600">+15</span> người mới hôm nay
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
              <span className="text-2xl text-gray-900 font-bold tracking-tight">864</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-800 font-bold">69.1%</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Hoạt động trong 30 ngày qua
            </p>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-green-500 h-full rounded-full" style={{ width: '69.1%' }}></div>
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
              <span className="text-2xl text-gray-900 font-bold tracking-tight">128</span>
              <span className="text-xs text-gray-500 font-medium">thành viên</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              TB: <span className="font-semibold text-gray-900">12.500.000 đ</span>/người
            </p>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: '88%' }}></div>
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
              <span className="text-2xl text-gray-900 font-bold tracking-tight">3.450.000</span>
              <span className="text-sm text-gray-500 font-medium">đ</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Tần suất mua: <span className="font-semibold text-gray-900">2.8 lần</span>/năm
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
            Tất cả <span className="ml-1 text-[11px] opacity-75 font-mono">(1.250)</span>
          </button>
          <button className="px-4 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-900 font-medium text-sm whitespace-nowrap transition-colors">
            Hội viên VIP <span className="ml-1 text-[11px] font-mono">(128)</span>
          </button>
          <button className="px-4 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-900 font-medium text-sm whitespace-nowrap transition-colors">
            Khách hàng mới <span className="ml-1 text-[11px] font-mono">(215)</span>
          </button>
          <button className="px-4 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-900 font-medium text-sm whitespace-nowrap transition-colors">
            Tiềm năng <span className="ml-1 text-[11px] font-mono">(450)</span>
          </button>
          <button className="px-4 py-1.5 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 font-medium text-sm whitespace-nowrap transition-colors">
            Nguy cơ rời bỏ <span className="ml-1 text-[11px] font-mono">(57)</span>
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
                {mockCustomers.map((customer) => {
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
                          {customer.sports.map(sport => (
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
              Hiển thị <span className="font-semibold text-gray-900">1 - 6</span> của <span className="font-semibold text-gray-900">1.250</span> khách hàng
            </div>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 flex items-center justify-center cursor-not-allowed" disabled>
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-sm font-semibold flex items-center justify-center shadow-sm">
                1
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-700 text-sm font-semibold flex items-center justify-center transition-colors">
                2
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-700 text-sm font-semibold flex items-center justify-center transition-colors">
                3
              </button>
              <span className="px-1 text-gray-400 text-sm font-semibold">...</span>
              <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-700 text-sm font-semibold flex items-center justify-center transition-colors">
                209
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center transition-colors">
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
                    {activeCustomer.colors.map((c, i) => (
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
