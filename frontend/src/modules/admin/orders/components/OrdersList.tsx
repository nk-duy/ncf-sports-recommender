"use client";

import React, { useState } from "react";
import { 
  ChevronRight, Download, Printer, PlusCircle, ShoppingBag, 
  TrendingUp, Clock, Truck, CheckCircle2, Search, SlidersHorizontal, 
  RotateCcw, MoreVertical, Phone, Gift, CheckCircle, FileEdit, XCircle, 
  ChevronLeft, Tent, Dumbbell, Activity, Shirt, User
} from "lucide-react";

// Mock Data for Orders
const mockOrders = [
  {
    id: 1,
    code: "#DH-8801",
    time: "Hôm nay 10:24",
    customerName: "Nguyễn Văn An",
    customerContact: "0912***456 • Hà Nội",
    productTitle: "Giày Alpha Marathon Đệm Khí Carbon (x1)",
    productImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA86kvttpBsLwxJvIJIgTakl6PdwoImr9PI3KrFDYwEjpCIZgO4Ynw2lDHVGP5su_MMo0Iqbd6zeZlzd_W0XaaWUDfj0p5eLuRc0r8Xby5ny1oMoxJo5qlQOgIUyLl020ZvkvHVIpWWIyNOt4s5WKQ5flxG2syqwkgzAOBzi4wGJO8i5xLbvoL_t_h_1KFnEx2WrbHRdLwbA67OvQ_3nzdFbmheOMoRLjW_OcOWkDu-WXjB82Fya-8a",
    productIcon: null,
    total: "2.450.000 ₫",
    paymentStatus: "Đã thanh toán",
    paymentMethod: "VNPAY QR",
    paymentColor: "text-green-600",
    paymentDot: "bg-green-600",
    statusLabel: "Đang giao hàng",
    statusBadge: "bg-blue-100 text-blue-700",
    
    // Details for Inspector
    shippingCode: "GHN-VN-889104",
    fullPhone: "0912.345.456",
    fullAddress: "Tầng 12, Tòa Keangnam Landmark 72, Mễ Trì, Quận Nam Từ Liêm, Hà Nội",
    carrier: "Giao Hàng Nhanh (GHN Standard Express)",
    timelineIndex: 2, // 0-based, so 2 means step 3 is active
    subtotal: "2.450.000 ₫",
    shippingFee: "30.000 ₫",
    discount: "-30.000 ₫",
    voucher: "-0 ₫"
  },
  {
    id: 2,
    code: "#DH-8802",
    time: "Hôm nay 09:15",
    customerName: "Trần Thị Mai",
    customerContact: "0988***112 • TP.HCM",
    productTitle: "Bộ Tạ Tay Thông Minh Đa Năng 25LB (x1)",
    productImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW1IrVhhzvNoXorZP-ow_sxta5qqhYU_fohhZqrXKiPfcG3W2VXIP4uJUyvMiBN9xfspT2X33lEW0SWAAI1bATD2MEz-4ojQZK_ReYOEOxsuSYmYK1iToyaD3HT2fFpmIC06Tv3btVd5szMnsw6EtsjfgnBUnbPx_0UnsN1OYXijkpQ1wwcqf0Y-Vx_HURI-O1sMTUtFaZLj2faw2AtR3ObyhPHvC2giheur9A99TzIrFpaELiX2F5",
    productIcon: null,
    total: "1.850.000 ₫",
    paymentStatus: "Đã thanh toán",
    paymentMethod: "Ví MoMo",
    paymentColor: "text-green-600",
    paymentDot: "bg-green-600",
    statusLabel: "Hoàn tất",
    statusBadge: "bg-green-100 text-green-700",
    
    shippingCode: "GHTK-HCM-8802",
    fullPhone: "0988.112.233",
    fullAddress: "Quận 1, TP. Hồ Chí Minh",
    carrier: "Giao Hàng Tiết Kiệm (GHTK)",
    timelineIndex: 4,
    subtotal: "1.850.000 ₫",
    shippingFee: "25.000 ₫",
    discount: "-25.000 ₫",
    voucher: "-0 ₫"
  },
  {
    id: 3,
    code: "#DH-8803",
    time: "Hôm nay 08:40",
    customerName: "Lê Hoàng Nam",
    customerContact: "0903***789 • Đà Nẵng",
    productTitle: "Lều Cắm Trại 2-3 Người Summit (x1)...",
    productImage: null,
    productIcon: Tent,
    total: "2.150.000 ₫",
    paymentStatus: "COD (Chưa thu)",
    paymentMethod: "Viettel Post",
    paymentColor: "text-gray-500",
    paymentDot: "bg-gray-500",
    statusLabel: "Chờ xác nhận",
    statusBadge: "bg-gray-200 text-gray-700",
    
    shippingCode: "VTP-DN-8803",
    fullPhone: "0903.789.012",
    fullAddress: "Hải Châu, Đà Nẵng",
    carrier: "Viettel Post",
    timelineIndex: 0,
    subtotal: "2.150.000 ₫",
    shippingFee: "45.000 ₫",
    discount: "-0 ₫",
    voucher: "-0 ₫"
  },
  {
    id: 4,
    code: "#DH-8804",
    time: "Hôm nay 08:12",
    customerName: "Phạm Minh Đức",
    customerContact: "0934***321 • Cần Thơ",
    productTitle: "Thảm Tập Yoga Cao Su Sinh Thái (x1)",
    productImage: null,
    productIcon: Dumbbell,
    total: "680.000 ₫",
    paymentStatus: "COD",
    paymentMethod: "GHN Express",
    paymentColor: "text-gray-500",
    paymentDot: "bg-gray-500",
    statusLabel: "Đang đóng gói",
    statusBadge: "bg-blue-50 text-blue-600",
    
    shippingCode: "GHN-CT-8804",
    fullPhone: "0934.321.654",
    fullAddress: "Ninh Kiều, Cần Thơ",
    carrier: "Giao Hàng Nhanh",
    timelineIndex: 1,
    subtotal: "680.000 ₫",
    shippingFee: "35.000 ₫",
    discount: "-15.000 ₫",
    voucher: "-0 ₫"
  },
  {
    id: 5,
    code: "#DH-8805",
    time: "Hôm qua 18:30",
    customerName: "Vũ Hoàng Yến",
    customerContact: "0971***654 • Hải Phòng",
    productTitle: "Giày Trail Running Cross-6 (x1)",
    productImage: null,
    productIcon: Activity,
    total: "2.190.000 ₫",
    paymentStatus: "Đã thanh toán",
    paymentMethod: "VNPAY QR",
    paymentColor: "text-green-600",
    paymentDot: "bg-green-600",
    statusLabel: "Đang giao hàng",
    statusBadge: "bg-blue-100 text-blue-700",
    
    shippingCode: "GHN-HP-8805",
    fullPhone: "0971.654.987",
    fullAddress: "Lê Chân, Hải Phòng",
    carrier: "Giao Hàng Nhanh",
    timelineIndex: 2,
    subtotal: "2.190.000 ₫",
    shippingFee: "30.000 ₫",
    discount: "-30.000 ₫",
    voucher: "-0 ₫"
  },
  {
    id: 6,
    code: "#DH-8806",
    time: "Hôm qua 15:10",
    customerName: "Đặng Quốc Bảo",
    customerContact: "0918***999 • Bình Dương",
    productTitle: "Áo Thun Dry-Fit Pro (x3)",
    productImage: null,
    productIcon: Shirt,
    total: "1.050.000 ₫",
    paymentStatus: "Hoàn tiền (Đổi size)",
    paymentMethod: "GHTK Trả hàng",
    paymentColor: "text-red-600",
    paymentDot: "bg-red-600",
    statusLabel: "Đã hoàn trả",
    statusBadge: "bg-red-100 text-red-700",
    
    shippingCode: "GHTK-BD-8806-RET",
    fullPhone: "0918.999.321",
    fullAddress: "Dĩ An, Bình Dương",
    carrier: "GHTK Trả hàng",
    timelineIndex: 4,
    subtotal: "1.050.000 ₫",
    shippingFee: "0 ₫",
    discount: "0 ₫",
    voucher: "0 ₫"
  }
];

export default function AdminOrdersList() {
  const [activeOrderId, setActiveOrderId] = useState<number | null>(mockOrders[0].id);

  const activeOrder = mockOrders.find(o => o.id === activeOrderId);

  return (
    <div className="flex flex-col w-full space-y-6 pb-8">
      {/* Top Navigation & Action Bar */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
            <span className="hover:text-blue-600 transition-colors cursor-pointer">Thương mại điện tử</span>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-blue-600 font-bold">Quản lý Đơn hàng</span>
          </nav>
          <h1 className="text-2xl text-gray-900 font-bold tracking-tight">Danh sách Đơn hàng &amp; Vận chuyển</h1>
          <p className="text-sm text-gray-500">
            Theo dõi xử lý đơn hàng, điều phối giao vận và kiểm tra trạng thái thanh toán thời gian thực
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button className="h-9 px-3 rounded bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-sm shadow-sm flex items-center gap-1.5 transition-colors">
            <Download size={16} />
            <span>Xuất Excel / Báo cáo</span>
          </button>
          <button className="h-9 px-3 rounded bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-sm shadow-sm flex items-center gap-1.5 transition-colors">
            <Printer size={16} />
            <span>In phiếu hàng loạt</span>
          </button>
          <button className="h-9 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm flex items-center gap-1.5 transition-colors">
            <PlusCircle size={16} />
            <span>Tạo đơn tại quầy (POS)</span>
          </button>
        </div>
      </section>

      {/* Metric Statistics Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Stat Card 1 */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between group relative overflow-hidden">
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Tổng đơn hôm nay</span>
            <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">142</span>
            <span className="text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
              <TrendingUp size={12} /> +14.2%
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-gray-500 text-sm">
            <span>Doanh thu thu về:</span>
            <span className="font-mono font-bold text-gray-900">86.450.000 ₫</span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between group relative overflow-hidden">
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Chờ xác nhận</span>
            <div className="w-9 h-9 rounded bg-gray-50 text-gray-500 flex items-center justify-center">
              <Clock size={20} className="text-red-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">18</span>
            <span className="text-[10px] text-red-700 bg-red-50 px-1.5 py-0.5 rounded font-bold">Ưu tiên cao</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-red-600 text-sm font-medium">
            <span className="flex items-center gap-1">
              <Clock size={14} /> Cần duyệt gấp &lt;30p:
            </span>
            <span className="font-mono font-bold">05 đơn</span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between group relative overflow-hidden">
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Đang giao hàng</span>
            <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">65</span>
            <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-bold">GHN, GHTK, Viettel</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-gray-500 text-sm">
            <span>Giao hỏa tốc Ahamove:</span>
            <span className="font-mono font-bold text-blue-600">12 đơn</span>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between group relative overflow-hidden">
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Hoàn tất &amp; Đã thu COD</span>
            <div className="w-9 h-9 rounded bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">56</span>
            <span className="text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded font-bold">Thành công: 98.2%</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-gray-500 text-sm">
            <span>Tỷ lệ hoàn trả thấp:</span>
            <span className="font-mono font-bold text-green-600">1.8%</span>
          </div>
        </div>
      </section>

      {/* Filter, Segmented Tabs & Search Strip */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col gap-4">
        {/* Mantine-style Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-sm flex items-center gap-2 whitespace-nowrap shadow-sm transition-colors">
            <span>Tất cả đơn</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[11px]">142</span>
          </button>
          <button className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold text-sm flex items-center gap-2 whitespace-nowrap transition-colors">
            <span>Chờ xác nhận</span>
            <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[11px]">18</span>
          </button>
          <button className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold text-sm flex items-center gap-2 whitespace-nowrap transition-colors">
            <span>Đang đóng gói</span>
            <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[11px]">24</span>
          </button>
          <button className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold text-sm flex items-center gap-2 whitespace-nowrap transition-colors">
            <span>Đang giao</span>
            <span className="bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded text-[11px]">65</span>
          </button>
          <button className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold text-sm flex items-center gap-2 whitespace-nowrap transition-colors">
            <span>Đã giao</span>
            <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[11px]">32</span>
          </button>
          <button className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold text-sm flex items-center gap-2 whitespace-nowrap transition-colors">
            <span>Đã hủy / Hoàn trả</span>
            <span className="bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded text-[11px]">3</span>
          </button>
        </div>

        {/* Inputs & Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
            <input 
              type="text" 
              placeholder="Tìm theo mã ĐH (#DH-...), tên khách, SĐT..." 
              className="w-full h-9 pl-9 pr-3 rounded border border-gray-200 bg-gray-50 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <select className="w-full h-9 px-3 rounded border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 appearance-none">
              <option>Phương thức: Tất cả</option>
              <option>COD (Tiền mặt)</option>
              <option>VNPAY QR</option>
              <option>Ví MoMo</option>
              <option>Thẻ tín dụng / Visa</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <select className="w-full h-9 px-3 rounded border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 appearance-none">
              <option>Đơn vị: Tất cả ĐVVC</option>
              <option>Giao Hàng Nhanh (GHN)</option>
              <option>Giao Hàng Tiết Kiệm (GHTK)</option>
              <option>Viettel Post</option>
              <option>Ahamove Hỏa tốc</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <select className="w-full h-9 px-3 rounded border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 appearance-none">
              <option>Kho: Tất cả chi nhánh</option>
              <option>Kho A - Cầu Giấy, Hà Nội</option>
              <option>Kho B - Quận 7, TP.HCM</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-center gap-2 justify-end">
            <button className="h-9 px-4 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm flex items-center gap-1.5 transition-colors">
              <SlidersHorizontal size={16} className="text-gray-500" />
              <span>Lọc</span>
            </button>
            <button className="h-9 w-9 rounded bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors" title="Làm mới bộ lọc">
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Main Content 2-Column Edge Partition */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Data Grid Table */}
        <div className={`flex flex-col bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${activeOrder ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3 px-4 w-10 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4" />
                  </th>
                  <th className="py-3 px-3 font-semibold">Mã ĐH &amp; Thời gian</th>
                  <th className="py-3 px-3 font-semibold">Khách hàng</th>
                  <th className="py-3 px-3 font-semibold">Sản phẩm tóm tắt</th>
                  <th className="py-3 px-3 font-semibold text-right">Tổng tiền</th>
                  <th className="py-3 px-3 font-semibold">Thanh toán</th>
                  <th className="py-3 px-4 font-semibold text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-900">
                {mockOrders.map((order) => {
                  const isActive = activeOrderId === order.id;
                  const IconComp = order.productIcon;
                  return (
                    <tr 
                      key={order.id} 
                      onClick={() => setActiveOrderId(order.id)}
                      className={`cursor-pointer transition-colors ${isActive ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-gray-50'}`}
                    >
                      <td className="py-3 px-4 text-center align-middle" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4" />
                      </td>
                      <td className="py-3 px-3 align-middle">
                        <div className="flex flex-col">
                          <span className={`font-mono font-bold ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>{order.code}</span>
                          <span className="text-[11px] text-gray-500 mt-0.5">{order.time}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 align-middle">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{order.customerName}</span>
                          <span className="text-[11px] text-gray-500 mt-0.5">{order.customerContact}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 align-middle">
                        <div className="flex items-center gap-2">
                          {order.productImage ? (
                            <img src={order.productImage} className="w-8 h-8 object-cover rounded bg-gray-100" alt="product" />
                          ) : (
                            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                              {IconComp && <IconComp size={16} />}
                            </div>
                          )}
                          <span className="line-clamp-1 max-w-[140px] text-[13px] text-gray-600 font-medium">
                            {order.productTitle}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 align-middle text-right font-mono font-bold text-gray-900 whitespace-nowrap">
                        {order.total}
                      </td>
                      <td className="py-3 px-3 align-middle">
                        <div className="flex flex-col">
                          <span className={`text-[11px] ${order.paymentColor} font-semibold flex items-center gap-1.5`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${order.paymentDot}`}></span> 
                            {order.paymentStatus}
                          </span>
                          <span className="text-[11px] text-gray-500 mt-0.5">{order.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 align-middle text-center whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${order.statusBadge}`}>
                          {order.statusLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">Hiển thị <span className="font-semibold text-gray-900">1 - 6</span> của <span className="font-semibold text-gray-900">142</span> đơn hàng</span>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-50 border border-gray-200 text-gray-400 cursor-not-allowed">
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white font-semibold text-sm shadow-sm">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-700 font-semibold text-sm transition-colors">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-700 font-semibold text-sm transition-colors">3</button>
              <span className="px-1 text-gray-400 text-xs">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-700 font-semibold text-sm transition-colors">24</button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 border border-gray-200 text-gray-700 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Detail Inspector Card */}
        {activeOrder && (
          <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
            {/* Card Top Bar */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">Đơn {activeOrder.code}</h2>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${activeOrder.statusBadge}`}>
                    {activeOrder.statusLabel}
                  </span>
                </div>
                <span className="font-mono text-xs text-gray-500 mt-1">Mã vận đơn: {activeOrder.shippingCode}</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900 flex items-center justify-center transition-colors" title="In phiếu vận đơn">
                  <Printer size={16} />
                </button>
                <button 
                  className="w-8 h-8 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900 flex items-center justify-center transition-colors" 
                  title="Đóng chi tiết"
                  onClick={() => setActiveOrderId(null)}
                >
                  <XCircle size={18} />
                </button>
              </div>
            </div>

            {/* Customer & Delivery Brief */}
            <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Khách hàng nhận</span>
                <span className="text-xs text-blue-600 font-bold flex items-center gap-1">
                  <Phone size={12} /> {activeOrder.fullPhone}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">{activeOrder.customerName}</span>
              <p className="text-sm text-gray-600 leading-relaxed">{activeOrder.fullAddress}</p>
              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-200 text-[11px] text-gray-500 font-medium">
                <Truck size={14} className="text-blue-600" />
                <span>Đơn vị: {activeOrder.carrier}</span>
              </div>
            </div>

            {/* Tracking Stepper / Timeline */}
            <div className="flex flex-col gap-3 pt-2">
              <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Tiến trình vận đơn</span>
              <div className="relative pl-6 space-y-4 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-gray-200">
                {/* Step 1 */}
                <div className={`relative ${activeOrder.timelineIndex >= 0 ? '' : 'opacity-50'}`}>
                  <span className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] text-white z-10 ${activeOrder.timelineIndex >= 0 ? 'bg-green-600' : 'bg-gray-300'}`}>✓</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">Đã tạo đơn &amp; Thanh toán</span>
                    <span className="font-mono text-[11px] text-gray-500 mt-0.5">10:24 • Giao dịch #VNP88910401</span>
                  </div>
                </div>
                {/* Step 2 */}
                <div className={`relative ${activeOrder.timelineIndex >= 1 ? '' : 'opacity-50'}`}>
                  <span className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] text-white z-10 ${activeOrder.timelineIndex >= 1 ? 'bg-green-600' : 'bg-gray-300'}`}>
                    {activeOrder.timelineIndex > 1 ? '✓' : '●'}
                  </span>
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold ${activeOrder.timelineIndex === 1 ? 'text-blue-600' : 'text-gray-900'}`}>Kho xử lý đóng gói &amp; bàn giao</span>
                    <span className={`font-mono text-[11px] mt-0.5 ${activeOrder.timelineIndex === 1 ? 'text-blue-600' : 'text-gray-500'}`}>11:15 • Nhân viên kho: TranKiem-WH</span>
                  </div>
                </div>
                {/* Step 3 */}
                <div className={`relative ${activeOrder.timelineIndex >= 2 ? '' : 'opacity-50'}`}>
                  <span className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] text-white z-10 ${activeOrder.timelineIndex >= 2 ? (activeOrder.timelineIndex > 2 ? 'bg-green-600' : 'bg-blue-600') : 'bg-gray-300'}`}>
                    {activeOrder.timelineIndex > 2 ? '✓' : '●'}
                  </span>
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold ${activeOrder.timelineIndex === 2 ? 'text-blue-600' : 'text-gray-900'}`}>Đang phát tới tay người nhận</span>
                    <span className={`font-mono text-[11px] mt-0.5 ${activeOrder.timelineIndex === 2 ? 'text-blue-600' : 'text-gray-500'}`}>14:30 • Dự kiến phát trong ngày</span>
                  </div>
                </div>
                {/* Step 4 */}
                <div className={`relative ${activeOrder.timelineIndex >= 3 ? '' : 'opacity-50'}`}>
                  <span className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] text-white z-10 ${activeOrder.timelineIndex >= 3 ? 'bg-green-600' : 'bg-gray-300'}`}>
                    {activeOrder.timelineIndex >= 3 ? '✓' : '●'}
                  </span>
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold ${activeOrder.timelineIndex >= 3 ? 'text-green-600' : 'text-gray-600'}`}>Khách hàng đã Ký nhận kiện hàng</span>
                    <span className={`font-mono text-[11px] mt-0.5 ${activeOrder.timelineIndex >= 3 ? 'text-green-600' : 'text-gray-500'}`}>Hoàn tất</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ordered Item List */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Chi tiết kiện hàng</span>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                {activeOrder.productImage ? (
                  <img src={activeOrder.productImage} className="w-12 h-12 rounded object-cover bg-gray-200" alt="prod" />
                ) : (
                  <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-gray-500">
                    {activeOrder.productIcon && React.createElement(activeOrder.productIcon, { size: 24 })}
                  </div>
                )}
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-900 line-clamp-1">{activeOrder.productTitle}</span>
                  <span className="text-xs text-gray-500 mt-0.5">Size / Màu sắc tiêu chuẩn</span>
                </div>
                <span className="font-mono font-bold text-gray-900">{activeOrder.subtotal}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="w-12 h-12 rounded bg-green-50 flex items-center justify-center text-green-600">
                  <Gift size={24} />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-900 line-clamp-1">Quà tặng đính kèm</span>
                  <span className="text-xs text-green-600 font-medium mt-0.5">Voucher / Phụ kiện</span>
                </div>
                <span className="font-mono font-semibold text-gray-500">0 ₫</span>
              </div>
            </div>

            {/* Settlement Summary */}
            <div className="p-4 rounded-lg bg-gray-50 flex flex-col gap-2 text-sm border border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Tiền hàng</span>
                <span className="font-mono">{activeOrder.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="font-mono">{activeOrder.shippingFee}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Giảm giá / Freeship</span>
                <span className="font-mono">{activeOrder.discount}</span>
              </div>
              <div className="pt-3 mt-1 border-t border-gray-200 flex justify-between items-baseline font-bold text-gray-900">
                <span className="text-sm">Tổng thanh toán:</span>
                <div className="flex flex-col items-end">
                  <span className="text-xl text-blue-600 font-mono font-bold leading-none">{activeOrder.total}</span>
                  <span className="text-[10px] text-gray-500 font-semibold mt-1 uppercase">
                    {activeOrder.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Operational Actions */}
            <div className="flex flex-col gap-2 pt-2">
              <button className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
                <CheckCircle size={18} />
                <span>Xác nhận đã giao hàng thành công</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="h-9 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                  <FileEdit size={16} className="text-gray-500" />
                  <span>Đổi mã vận đơn</span>
                </button>
                <button className="h-9 bg-red-50 hover:bg-red-100 border border-red-100 text-red-700 font-semibold text-sm rounded flex items-center justify-center gap-1.5 transition-colors">
                  <XCircle size={16} />
                  <span>Hủy / Đổi trả</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
