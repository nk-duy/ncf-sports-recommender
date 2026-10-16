'use client';
import React from 'react';
import { Plus, Search, RefreshCcw, Download } from 'lucide-react';

interface ProductToolbarProps {
  activeTab: 'all' | 'promo' | 'hidden' | 'trash';
  setActiveTab: (tab: 'all' | 'promo' | 'hidden' | 'trash') => void;
  counts: { all: number; promo: number; hidden: number; trash: number; low_stock?: number };
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  allCategories: string[];
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  availableBrands: string[];
  selectedStockStatus: string;
  setSelectedStockStatus: (status: string) => void;
  handleCreate: () => void;
  handleResetFilters: () => void;
  onExportExcel?: () => void;
}

export default function ProductToolbar({
  activeTab,
  setActiveTab,
  counts,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  allCategories,
  selectedBrand,
  setSelectedBrand,
  availableBrands,
  selectedStockStatus,
  setSelectedStockStatus,
  handleCreate,
  handleResetFilters,
  onExportExcel,
}: ProductToolbarProps) {
  const isFiltering = !!(selectedCategory || selectedBrand || selectedStockStatus || searchQuery);

  const switchTab = (tab: 'all' | 'promo' | 'hidden' | 'trash') => {
    setActiveTab(tab);
    handleResetFilters();
  };

  return (
    <div className="space-y-4">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Sản phẩm</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý kho hàng, thông số thể thao, giá bán và khuyến mãi</p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          {onExportExcel && (
            <button
              type="button"
              onClick={onExportExcel}
              className="flex items-center justify-center gap-2 h-10 px-3.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl shadow-2xs transition cursor-pointer"
              title="Xuất danh sách sản phẩm ra file Excel (.csv)"
            >
              <Download size={16} className="text-emerald-600" />
              <span>Xuất Excel</span>
            </button>
          )}
          <button
            suppressHydrationWarning
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 h-10 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-2xs hover:shadow-xs transition cursor-pointer whitespace-nowrap"
          >
            <Plus size={16} />
            <span>Thêm Sản phẩm</span>
          </button>
        </div>
      </div>

      {/* Tabs & Filter Bar Box */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => switchTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'all'
                ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            Tất cả sản phẩm
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => switchTab('promo')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'promo'
                ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            Đang giảm giá
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'promo' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {counts.promo}
            </span>
          </button>

          <button
            onClick={() => switchTab('hidden')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'hidden'
                ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-600/20'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            Đang ẩn
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'hidden' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {counts.hidden}
            </span>
          </button>

          <button
            onClick={() => switchTab('trash')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'trash'
                ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            Thùng rác
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'trash' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {counts.trash}
            </span>
          </button>

          {/* Quick Filter: Cảnh báo sắp hết kho */}
          {counts.low_stock !== undefined && counts.low_stock > 0 && (
            <button
              onClick={() => {
                setSelectedStockStatus(selectedStockStatus === 'low_stock' ? '' : 'low_stock');
              }}
              className={`ml-auto px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border ${selectedStockStatus === 'low_stock'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
              title="Lọc nhanh các sản phẩm còn ≤ 5 chiếc trong kho để kịp thời nhập thêm"
            >
              <span>⚠️ Cảnh báo tồn kho</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${selectedStockStatus === 'low_stock' ? 'bg-white text-amber-600' : 'bg-amber-500 text-white'
                }`}>
                {counts.low_stock}
              </span>
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm theo tên sản phẩm hoặc mã ASIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50/50 hover:bg-white transition shadow-2xs"
            />
          </div>

          {/* Category Filter */}
          <select
            suppressHydrationWarning
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 px-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white cursor-pointer hover:border-gray-300 transition text-gray-700 shadow-2xs font-medium"
          >
            <option value="">Tất cả danh mục</option>
            {allCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            suppressHydrationWarning
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="h-10 px-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white cursor-pointer hover:border-gray-300 transition text-gray-700 shadow-2xs font-medium"
          >
            <option value="">Tất cả thương hiệu</option>
            {availableBrands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            suppressHydrationWarning
            value={selectedStockStatus}
            onChange={(e) => setSelectedStockStatus(e.target.value)}
            className="h-10 px-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white cursor-pointer hover:border-gray-300 transition text-gray-700 shadow-2xs font-medium"
          >
            <option value="">Tất cả kho hàng</option>
            <option value="in_stock">Còn hàng (&gt;10)</option>
            <option value="low_stock">Sắp hết hàng (1-10)</option>
            <option value="out_of_stock">Hết hàng (0)</option>
          </select>

          {/* Clear Filter Button */}
          {isFiltering && (
            <button
              onClick={handleResetFilters}
              className="h-10 px-3.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition border border-rose-200 flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <RefreshCcw size={13} />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
