'use client';

import React from 'react';
import { Eye, EyeOff, Trash2, Tag, X, CheckSquare, RefreshCcw } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  totalVisibleCount: number;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  onClearSelection: () => void;
  onBulkHide: () => void;
  onBulkShow: () => void;
  onBulkSoftDelete: () => void;
  onBulkRestore?: () => void;
  onBulkDiscount: () => void;
  activeTab: 'all' | 'promo' | 'hidden' | 'trash';
  isProcessing?: boolean;
}

export default function BulkActionsBar({
  selectedCount,
  totalVisibleCount,
  isAllSelected,
  onToggleSelectAll,
  onClearSelection,
  onBulkHide,
  onBulkShow,
  onBulkSoftDelete,
  onBulkRestore,
  onBulkDiscount,
  activeTab,
  isProcessing = false,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-20 z-30 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-blue-950 text-white px-4 sm:px-6 py-3 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 border border-gray-700/60 backdrop-blur-md">

        {/* Left: Count & Select All */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-xl border border-blue-500/30 text-xs font-bold">
            <CheckSquare className="w-4 h-4 text-blue-400" />
            <span>Đã chọn: <strong className="text-white text-sm">{selectedCount}</strong> / {totalVisibleCount} sản phẩm</span>
          </div>

          <button
            onClick={onToggleSelectAll}
            className="text-xs text-gray-300 hover:text-white underline underline-offset-4 font-medium transition"
          >
            {isAllSelected ? 'Bỏ chọn trang này' : 'Chọn toàn bộ trang'}
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === 'trash' ? (
            <>
              {onBulkRestore && (
                <button
                  disabled={isProcessing}
                  onClick={onBulkRestore}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                  title="Khôi phục các sản phẩm đã chọn về kho"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục ({selectedCount})</span>
                </button>
              )}
            </>
          ) : (
            <>
              {/* Nút Ẩn / Hiện */}
              {activeTab === 'hidden' ? (
                <button
                  disabled={isProcessing}
                  onClick={onBulkShow}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                  title="Hiện lại các sản phẩm này ra cửa hàng"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Hiện bán ({selectedCount})</span>
                </button>
              ) : (
                <button
                  disabled={isProcessing}
                  onClick={onBulkHide}
                  className="px-3.5 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                  title="Tạm ẩn khỏi khách hàng mà không xóa dữ liệu"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Tạm ẩn ({selectedCount})</span>
                </button>
              )}

              {/* Nút Áp dụng giảm giá đồng loạt */}
              <button
                disabled={isProcessing}
                onClick={onBulkDiscount}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                title="Áp dụng cùng mức giảm giá cho tất cả sản phẩm được chọn"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Thiết lập % Giảm giá</span>
              </button>

              {/* Nút Thùng rác */}
              <button
                disabled={isProcessing}
                onClick={onBulkSoftDelete}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                title="Chuyển vào thùng rác (xóa mềm)"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cho vào thùng rác ({selectedCount})</span>
              </button>
            </>
          )}

          {/* Nút Hủy chọn */}
          <button
            onClick={onClearSelection}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition ml-1"
            title="Bỏ chọn tất cả"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
