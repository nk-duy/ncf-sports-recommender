'use client';
import React from 'react';
import { Plus, Search, Eye, RotateCcw, Save, ChevronsUpDown, ChevronsDownUp, X } from 'lucide-react';

interface CategoryToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  newSport: string;
  onNewSportChange: (val: string) => void;
  onAddSport: () => void;
  onSaveMenu: () => void;
  onOpenPreview: () => void;
  onResetDefault: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  saving?: boolean;
  isAllExpanded?: boolean;
}

export default function CategoryToolbar({
  searchQuery,
  onSearchChange,
  newSport,
  onNewSportChange,
  onAddSport,
  onSaveMenu,
  onOpenPreview,
  onResetDefault,
  onExpandAll,
  onCollapseAll,
  saving = false,
  isAllExpanded = false,
}: CategoryToolbarProps) {
  return (
    <div className="space-y-4">
      {/* Row 1: Header Title & Main Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Quản lý Cây Danh mục
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Thiết lập cấu trúc môn thể thao, loại sản phẩm và danh mục chi tiết hiển thị trên MegaMenu khách hàng
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Nút Xem trước Live MegaMenu */}
          <button
            type="button"
            onClick={onOpenPreview}
            className="h-10 px-3.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 shadow-2xs hover:border-gray-300 inline-flex items-center gap-2 transition"
          >
            <Eye size={16} className="text-blue-600" />
            <span>Xem trước Menu</span>
          </button>

          {/* Nút Khôi phục mặc định */}
          <button
            type="button"
            onClick={onResetDefault}
            className="h-10 px-3.5 bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 text-sm font-semibold rounded-xl border border-gray-200 shadow-2xs hover:border-red-200 inline-flex items-center gap-2 transition"
            title="Khôi phục lại cây menu mẫu chuẩn cho cửa hàng thể thao"
          >
            <RotateCcw size={15} />
            <span>Khôi phục mẫu</span>
          </button>

          {/* Nút Lưu thay đổi */}
          <button
            type="button"
            onClick={onSaveMenu}
            disabled={saving}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-2xs hover:shadow-xs inline-flex items-center gap-2 transition disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
          </button>
        </div>
      </div>

      {/* Row 2: Search Box & Expand/Collapse Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Input Tìm kiếm danh mục thời gian thực */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm môn thể thao, loại sản phẩm, danh mục con..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full h-10 pl-9 pr-9 border border-gray-200 rounded-xl text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-2xs outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Nút Mở rộng / Thu gọn tất cả */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {isAllExpanded ? (
              <button
                type="button"
                onClick={onCollapseAll}
                className="h-10 px-3.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl shadow-2xs transition inline-flex items-center gap-2"
              >
                <ChevronsDownUp size={15} />
                <span>Thu gọn tất cả</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onExpandAll}
                className="h-10 px-3.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl shadow-2xs transition inline-flex items-center gap-2"
              >
                <ChevronsUpDown size={15} />
                <span>Mở rộng tất cả</span>
              </button>
            )}
          </div>
        </div>

        {/* Bar Thêm Môn thể thao / Nhóm lớn mới */}
        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Nhập tên Môn thể thao / Nhóm danh mục mới (VD: Tennis, Bơi lội, Pilates...)"
            value={newSport}
            onChange={e => onNewSportChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') onAddSport();
            }}
            className="flex-1 h-10 px-4 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs outline-none transition"
          />
          <button
            type="button"
            onClick={onAddSport}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition shadow-2xs shrink-0"
          >
            <Plus size={16} />
            <span>Thêm Môn thể thao</span>
          </button>
        </div>
      </div>
    </div>
  );
}
