'use client';

import React from 'react';
import { Save, RotateCcw, Info } from 'lucide-react';

interface AttributesHeaderProps {
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onResetDefaults: () => void;
  onSave: () => void;
}

export default function AttributesHeader({
  hasUnsavedChanges,
  isSaving,
  onResetDefaults,
  onSave,
}: AttributesHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Quản lý Thuộc tính Sản phẩm
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Cấu hình Thương hiệu, Thông số kỹ thuật, Bảng màu mã HEX và Phân loại kích cỡ đồng bộ toàn cửa hàng.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onResetDefaults}
            className="h-10 px-3.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 rounded-xl shadow-2xs text-sm font-semibold inline-flex items-center gap-2 transition cursor-pointer"
            title="Khôi phục các thuộc tính thể thao chuẩn mặc định"
          >
            <RotateCcw size={15} />
            <span>Mặc định</span>
          </button>

          <button
            onClick={onSave}
            disabled={isSaving}
            className={`h-10 px-4 font-semibold text-sm rounded-xl transition shadow-2xs hover:shadow-xs inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white disabled:opacity-50 cursor-pointer ${
              hasUnsavedChanges ? 'ring-2 ring-blue-500/30 animate-pulse' : ''
            }`}
          >
            <Save size={16} />
            <span>{isSaving ? 'Đang lưu DB...' : hasUnsavedChanges ? 'Lưu thay đổi *' : 'Lưu tất cả'}</span>
          </button>
        </div>
      </div>

      {hasUnsavedChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-amber-600 shrink-0" />
            <span>Bạn có một số thay đổi thuộc tính chưa lưu. Nhấn <strong>"Lưu thay đổi"</strong> ở góc trên để cập nhật vào hệ thống.</span>
          </div>
          <button
            onClick={onSave}
            className="text-xs font-bold text-amber-900 underline hover:no-underline ml-4 whitespace-nowrap cursor-pointer"
          >
            Lưu ngay
          </button>
        </div>
      )}
    </div>
  );
}
