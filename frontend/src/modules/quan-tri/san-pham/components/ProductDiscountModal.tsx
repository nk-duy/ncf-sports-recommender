'use client';
import React from 'react';

interface ProductDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: any;
  discountValue: number;
  setDiscountValue: (val: number) => void;
  discountEndDate: string;
  setDiscountEndDate: (val: string) => void;
  onSave: () => void;
}

export default function ProductDiscountModal({
  isOpen,
  onClose,
  selectedProduct,
  discountValue,
  setDiscountValue,
  discountEndDate,
  setDiscountEndDate,
  onSave,
}: ProductDiscountModalProps) {
  if (!isOpen || !selectedProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Thiết lập Giảm giá Sản phẩm</h2>
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{selectedProduct.name}</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mức giảm giá (%)</label>
            <input 
              type="number" 
              min="0" 
              max="100" 
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-2">Đặt 0% để xóa khuyến mãi cho sản phẩm này.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Hết hạn vào lúc (tùy chọn)</label>
            <input 
              type="datetime-local" 
              value={discountEndDate}
              onChange={(e) => setDiscountEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-2">Bỏ trống nếu khuyến mãi là vô thời hạn.</p>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg transition"
          >
            Hủy
          </button>
          <button 
            type="button"
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
