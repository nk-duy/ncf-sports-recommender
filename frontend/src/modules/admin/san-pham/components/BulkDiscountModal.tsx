'use client';

import React, { useState } from 'react';
import { Tag, X, Calendar, Percent, Sparkles } from 'lucide-react';

interface BulkDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  onApply: (discountPercent: number, endDate: string | null) => void;
}

export default function BulkDiscountModal({
  isOpen,
  onClose,
  selectedCount,
  onApply,
}: BulkDiscountModalProps) {
  const [percent, setPercent] = useState<number>(10);
  const [endDate, setEndDate] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(Number(percent), endDate ? new Date(endDate).toISOString() : null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Thiết lập Giảm giá hàng loạt</h2>
              <p className="text-xs text-amber-800 font-medium">Áp dụng cho {selectedCount} sản phẩm đã chọn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Chọn nhanh mức giảm giá (%)</label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 10, 20, 30, 40, 50].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setPercent(val)}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    percent === val
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  {val === 0 ? 'Xóa giảm' : `-${val}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Hoặc nhập phần trăm cụ thể (0% - 90%)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="90"
                value={percent}
                onChange={(e) => setPercent(Math.max(0, Math.min(90, Number(e.target.value))))}
                className="w-full pl-9 pr-12 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">%</span>
            </div>
          </div>

          {/* Expiration date */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>Thời gian hết hạn khuyến mãi (Tùy chọn)</span>
            </label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
            <p className="text-[11px] text-gray-400 mt-1">Để trống nếu muốn áp dụng giảm giá không giới hạn thời gian.</p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-600/20 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cập nhật cho {selectedCount} sản phẩm</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
