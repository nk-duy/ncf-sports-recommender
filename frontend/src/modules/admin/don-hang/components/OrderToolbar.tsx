'use client';
import React from 'react';
import { LayoutGrid, List, Calendar, Search, X, Download } from 'lucide-react';

interface OrderToolbarProps {
  ordersCount: number;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleExportExcel: () => void;
  isExporting: boolean;
}

export default function OrderToolbar({
  ordersCount,
  viewMode,
  setViewMode,
  dateFilter,
  setDateFilter,
  searchTerm,
  setSearchTerm,
  handleExportExcel,
  isExporting,
}: OrderToolbarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Duyệt &amp; Quản lý Đơn hàng</h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            {ordersCount} đơn
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Xử lý tiến trình giao hàng, in phiếu xuất kho &amp; theo dõi vận chuyển
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* View Mode Toggle */}
        <div className="h-10 bg-gray-100 p-1 rounded-xl flex items-center border border-gray-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`h-full px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'grid'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
            title="Xem dạng thẻ lưới (Grid View)"
          >
            <LayoutGrid size={15} />
            <span className="hidden sm:inline">Thẻ lưới</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`h-full px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'table'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
            title="Xem dạng bảng danh sách (Table View)"
          >
            <List size={15} />
            <span className="hidden sm:inline">Bảng danh sách</span>
          </button>
        </div>

        {/* Date Filter */}
        <div className="relative min-w-[140px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Calendar size={15} />
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-10 pl-9 pr-7 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none cursor-pointer hover:bg-gray-50 transition shadow-2xs w-full"
          >
            <option value="all">Mọi thời gian</option>
            <option value="today">Hôm nay</option>
            <option value="week">7 ngày qua</option>
            <option value="month">Tháng này</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Mã đơn, SĐT, Tên, Mã Vận đơn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 pl-9 pr-3 w-full border border-gray-200 bg-gray-50/50 focus:bg-white rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition shadow-2xs"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Export Excel Button */}
        <button
          type="button"
          onClick={handleExportExcel}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 h-10 px-3.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl shadow-2xs transition cursor-pointer shrink-0 disabled:opacity-50"
          title="Xuất danh sách đơn hàng ra file Excel (.csv)"
        >
          <Download size={16} className="text-emerald-600" />
          <span>Xuất Excel</span>
        </button>
      </div>
    </div>
  );
}
