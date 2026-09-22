"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, Download, Upload, Plus, Package, 
  ArrowUp, CheckCircle2, AlertTriangle, XCircle,
  Search, ChevronDown, Filter, RotateCcw,
  Tag, EyeOff, Trash2, X, Pencil, Eye, MoreVertical,
  ChevronLeft
} from "lucide-react";

// Mock Data matching the HTML exactly
const initialProducts = [
  {
    id: 1,
    name: "Giày Alpha Marathon Đệm Khí Carbon",
    sku: "RUN-MAR-001",
    category: "Giày thể thao",
    price: "2.450.000 đ",
    originalPrice: "3.200.000 đ",
    stock: 28,
    stockStatusLabel: "Đủ hàng",
    stockPercent: 70,
    status: "Đang bán",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhuC-LZqHsSCsGRYBzBC5QQ3OG0f5-3kSp2i_GknsuSEqiJbWtoeiY_keJF9YE-qjah6IsneobUF-PqDhscnQQalriHld-dT_W8YTvigwuqOknZZBhkQblhwcNS8kiQOLsmJWyfQ4fwS6sDhgZ3Nt1BhrQU6Rw89Rnr4W4ZfPp2iOUtEFj3ABjiYDMmDJnfHQKo9gvOH3fP_6gXL8MNFaNtF8RyAnorF97EfWqQiSaO58eFQLfIe91"
  },
  {
    id: 2,
    name: "Áo Thun Thể Thao Dry-Fit Pro Venturs",
    sku: "CLO-DRY-012",
    category: "Quần áo",
    price: "350.000 đ",
    originalPrice: null,
    stock: 142,
    stockStatusLabel: "Tồn cao",
    stockPercent: 95,
    status: "Đang bán",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeC2UHvie5wOkMGfehU_vZeOf8T06ARpAnF7OSAf8SgthiwXnliWaux3IDnXD5PUwP5zyE4nIvNrmbPwhtHNgYO6khgRMYCSNWtEPQQ2MwkQJlWGekhec22yG0-CAPw2MJxBKeg82-Y2i9LVBu9hZEwjLU-HAitLHGxD2ZZyGZWDxLcyqUztYCoR-jxobnaZ7BzDXu9B-8HjrRE4YDeA32R15rEDh_6874veF4yaRsm-FhK4l81Kjr"
  },
  {
    id: 3,
    name: "Bộ Tạ Tay Thông Minh Đa Năng 25LB",
    sku: "GYM-DB-025",
    category: "Dụng cụ Gym",
    price: "1.850.000 đ",
    originalPrice: "2.300.000 đ",
    stock: 6,
    stockStatusLabel: "Sắp hết",
    stockPercent: 15,
    status: "Sắp hết hàng",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCis28Kkio5-39PvB-sEAL3ZeNf0J2fqP3wObiz-q3u1f2gcTJ1ggUkx6xjfOa4a-vJgEl0MBPnKxKzO9gQxRgS3eeVWEifLt9qQcw8kltA8AQAyJ0PGVyUJcD96qp-lbDhWrHAUBwdEMbLriUVA1la-4cpzLY49Cg-u7Jxv2UjJe20IlMsb1Lm0eAepqOoRDMXtmEBpIEHNhCqnbBsjvd0vmRrUaXp3hCN4wXqMAFrOSt-IgGoFptT"
  },
  {
    id: 4,
    name: "Lều Cắm Trại 2-3 Người Chống Nước Summit",
    sku: "OUT-TNT-301",
    category: "Dã ngoại",
    price: "1.450.000 đ",
    originalPrice: null,
    stock: 18,
    stockStatusLabel: "Đủ hàng",
    stockPercent: 45,
    status: "Đang bán",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIJ7kU88LY4EmSVutQ_s2vvMPsbWCtkmYJDFhN827r-fKzkJNLS8O0pRpfC8zTH2HE4wnON_HC-y_vWqDla6ndFYX-YBNH4aNt5OInRC9mqk-b22-04zPwqK_dEphOuAksXLLkp6PLHI3grQnZUwz1-gvtLnPBaIiP9orrLzCQ4Jx_Gux72R_Q9tdc-DKDn_mfeNRT06GffmI2U6NRSdNTNxK5Xxr8vYxN10GrAD1Y5_qwwBpjSFXc"
  },
  {
    id: 5,
    name: "Thảm Tập Yoga Cao Su Sinh Thái Cao Cấp",
    sku: "GYM-YOG-008",
    category: "Dụng cụ Gym",
    price: "680.000 đ",
    originalPrice: null,
    stock: 45,
    stockStatusLabel: "Đủ hàng",
    stockPercent: 60,
    status: "Đang bán",
    image: "https://lh3.googleusercontent.com/aida/AEtjO1WtY9qOnUifM5ST8YLZu9hZd48vSPAQ1jBNqgDNdW5TjY6dp6SeCGXkuiLuTTl8_J9TlggVTfPIP8CrQA5LRb4HPLhh2pjbCOpM4nLLYuBFhs62Gh28m2eKjiCb_MTOTFvtG42-OMTlYtSo8sCfmo946fE7eLeytSfptEpD41AeIArJJVquDFx-Loyie-_Evtk5q_q6fkE-zoMbxvJTAY4jsddYpY_jyOuvawD-7JUU7eGwvrxsKSplwQ"
  },
  {
    id: 6,
    name: "Giày Trail Running Chống Nước Cross-6",
    sku: "RUN-TRL-089",
    category: "Giày thể thao",
    price: "2.190.000 đ",
    originalPrice: null,
    stock: 0,
    stockStatusLabel: "Hết hàng",
    stockPercent: 0,
    status: "Hết hàng",
    image: "https://lh3.googleusercontent.com/aida/AEtjO1W99qj6J_pZwocUq67enn2HnnVDL-4NGDNvJojRYStbiaEJItrjFFEKyu-_VRQww2mXgCG63V5OwljNMgkh8jpYL4jgOCYysZy023zUAjgsd4Xk2gnW9osG9AtoiDTTk0nblvA4OQsBgnmuPtE63D7doeC5CrJD52oK0-6-02CZRIhF_ZCyunlkySJUAq9ucsaq8nMOgs4sllYhrQ6k89OpDf05pI05Wt9CV2rArvIKiGflUwHMNbVxc88"
  }
];

export default function AdminProductsList() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(initialProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedIds([]);

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Page Header / Breadcrumb & Action Group */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold mb-1">
            <span className="hover:text-blue-600 transition-colors cursor-pointer">Thương mại điện tử</span>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-900 font-bold">Quản lý Sản phẩm</span>
          </nav>
          <h1 className="text-2xl text-gray-900 font-bold tracking-tight">Danh sách Sản phẩm</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý danh mục, giá bán, tồn kho và trạng thái các mặt hàng thể thao của hệ thống.
          </p>
        </div>
        
        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button className="h-9 px-3 bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded text-sm font-semibold flex items-center gap-1.5 shadow-sm">
            <Download size={16} />
            <span>Xuất Excel / CSV</span>
          </button>
          <button className="h-9 px-3 bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded text-sm font-semibold flex items-center gap-1.5 shadow-sm">
            <Upload size={16} />
            <span>Nhập file (Import)</span>
          </button>
          <button className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white transition-colors rounded text-sm font-semibold flex items-center gap-1.5 shadow-sm">
            <Plus size={16} />
            <span>Thêm sản phẩm mới</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Mini Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Tổng số SKU</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl text-gray-900 font-bold leading-tight">168</span>
              <span className="text-xs text-green-600 font-semibold flex items-center">
                <ArrowUp size={14} />
                +12 mới
              </span>
            </div>
            <span className="text-[13px] text-gray-500 mt-0.5">Tất cả danh mục thể thao</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gray-50 text-blue-600 flex items-center justify-center border border-gray-100">
            <Package size={22} />
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Đang kinh doanh</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl text-gray-900 font-bold leading-tight">154</span>
              <span className="text-xs text-gray-500 font-medium">/ 168</span>
            </div>
            <span className="text-[13px] text-green-600 mt-0.5 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>Đang mở trên website
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Sắp hết hàng</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl text-gray-900 font-bold leading-tight">11</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold tracking-wide uppercase">Cảnh báo</span>
            </div>
            <span className="text-[13px] text-gray-500 mt-0.5">Tồn kho dưới 10 đơn vị</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <AlertTriangle size={22} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Hết hàng</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl text-red-600 font-bold leading-tight">3</span>
              <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold tracking-wide uppercase">Khẩn cấp</span>
            </div>
            <span className="text-[13px] text-red-600 mt-0.5 font-medium">Cần nhập hàng ngay</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
            <XCircle size={22} />
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col gap-4 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-4 relative flex items-center">
            <Search className="absolute left-3 text-gray-400 pointer-events-none" size={16} />
            <input 
              type="text" 
              placeholder="Tìm theo tên sản phẩm, mã SKU, thương hiệu..." 
              className="w-full h-9 pl-9 pr-3 rounded border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          
          {/* Category Dropdown */}
          <div className="md:col-span-2 relative">
            <select className="w-full h-9 px-3 rounded border border-gray-200 bg-gray-50 text-gray-700 text-sm outline-none cursor-pointer focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8">
              <option value="">Tất cả danh mục</option>
              <option value="shoes">Giày thể thao</option>
              <option value="apparel">Quần áo</option>
              <option value="gym">Dụng cụ Gym</option>
              <option value="outdoor">Dã ngoại</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" size={16} />
          </div>

          {/* Status Dropdown */}
          <div className="md:col-span-2 relative">
            <select className="w-full h-9 px-3 rounded border border-gray-200 bg-gray-50 text-gray-700 text-sm outline-none cursor-pointer focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8">
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang bán</option>
              <option value="low">Sắp hết hàng</option>
              <option value="out">Hết hàng</option>
              <option value="hidden">Tạm ẩn</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" size={16} />
          </div>

          {/* Sport Filter Dropdown */}
          <div className="md:col-span-2 relative">
            <select className="w-full h-9 px-3 rounded border border-gray-200 bg-gray-50 text-gray-700 text-sm outline-none cursor-pointer focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8">
              <option value="">Môn thể thao</option>
              <option value="running">Chạy bộ</option>
              <option value="fitness">Gym / Fitness</option>
              <option value="hiking">Leo núi / Outdoor</option>
              <option value="other">Khác</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" size={16} />
          </div>

          {/* Filter Buttons */}
          <div className="md:col-span-2 flex items-center gap-2 justify-end">
            <button className="h-9 px-4 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 flex-1">
              <Filter size={16} />
              <span>Lọc</span>
            </button>
            <button className="h-9 w-9 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded flex items-center justify-center transition-colors" title="Đặt lại bộ lọc">
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Bulk Action Strip (Active Selection) */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-blue-50 rounded border border-blue-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-blue-600 text-white font-bold text-xs">
                {selectedIds.length}
              </div>
              <span className="text-sm font-semibold text-blue-800">Đã chọn {selectedIds.length} sản phẩm trên trang này</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-8 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5">
                <Tag size={14} />
                <span>Cập nhật giá</span>
              </button>
              <button className="h-8 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5">
                <EyeOff size={14} />
                <span>Ẩn sản phẩm</span>
              </button>
              <button className="h-8 px-3 bg-red-50 border border-red-100 hover:bg-red-100 text-red-700 rounded text-xs font-semibold transition-colors flex items-center gap-1.5">
                <Trash2 size={14} />
                <span>Xóa</span>
              </button>
              <div className="w-px h-5 bg-blue-200 mx-1"></div>
              <button 
                onClick={clearSelection}
                className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors" 
                title="Bỏ chọn"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Data Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider h-11 select-none border-b border-gray-200">
                <th className="w-12 px-4 py-2 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                    checked={selectedIds.length === initialProducts.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-2 min-w-[280px]">Sản phẩm &amp; SKU</th>
                <th className="px-4 py-2 min-w-[130px]">Danh mục</th>
                <th className="px-4 py-2 min-w-[150px]">Giá bán</th>
                <th className="px-4 py-2 min-w-[160px]">Tồn kho</th>
                <th className="px-4 py-2 min-w-[130px]">Trạng thái</th>
                <th className="px-4 py-2 w-28 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-900 text-sm">
              {initialProducts.map((product) => {
                const isSelected = selectedIds.includes(product.id);
                const isOutOfStock = product.stock === 0;
                const isLowStock = product.stock > 0 && product.stock <= 10;
                
                return (
                  <tr 
                    key={product.id}
                    className={`transition-colors group ${
                      isSelected 
                        ? 'bg-blue-50/50 hover:bg-blue-50' 
                        : isOutOfStock 
                          ? 'bg-red-50/30 hover:bg-red-50/50' 
                          : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={isSelected}
                        onChange={() => handleSelectRow(product.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded bg-white border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center p-1 ${isOutOfStock ? 'opacity-75' : ''}`}>
                          <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-gray-900 truncate hover:text-blue-600 cursor-pointer">
                            {product.name}
                          </span>
                          <span className="font-mono text-xs text-gray-500 uppercase tracking-wider mt-0.5">
                            {product.sku}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {product.price}
                        </span>
                        <span className={`text-xs mt-0.5 ${product.originalPrice ? 'text-gray-400 line-through' : 'text-gray-500'}`}>
                          {product.originalPrice || 'Niêm yết'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1.5 w-32">
                        <div className={`flex items-center justify-between text-xs font-semibold ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-gray-700'}`}>
                          <span>{product.stock} {product.category === 'Giày thể thao' ? 'đôi' : product.category === 'Quần áo' ? 'chiếc' : 'bộ'}</span>
                          <span className={isOutOfStock ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-green-600'}>
                            {product.stockStatusLabel}
                          </span>
                        </div>
                        <div className={`w-full h-1.5 rounded-full overflow-hidden ${isOutOfStock ? 'bg-red-100' : isLowStock ? 'bg-amber-100' : 'bg-gray-100'}`}>
                          <div 
                            className={`h-full rounded-full ${isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-amber-500' : 'bg-green-500'}`} 
                            style={{ width: `${product.stockPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          Hết hàng
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Sắp hết hàng
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          Đang bán
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors" title="Chỉnh sửa">
                          <Pencil size={16} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors" title="Xem chi tiết">
                          <Eye size={16} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors" title="Thao tác khác">
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
        
        {/* Pagination Bar */}
        <div className="p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Hiển thị <span className="font-semibold text-gray-900">1 - 6</span> của <span className="font-semibold text-gray-900">168</span> sản phẩm
          </div>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white text-sm font-semibold shadow-sm">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-gray-100 text-sm font-semibold transition-colors">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-gray-100 text-sm font-semibold transition-colors">
              3
            </button>
            <span className="w-6 text-center text-gray-400 text-sm font-semibold">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-gray-100 text-sm font-semibold transition-colors">
              28
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
