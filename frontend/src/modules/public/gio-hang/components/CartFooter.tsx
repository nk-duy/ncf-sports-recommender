import React from "react";
import { formatVND } from "@/shared/lib/cart";

interface CartFooterProps {
  itemsLength: number;
  allSelected: boolean;
  handleSelectAll: (checked: boolean) => void;
  hasSelected: boolean;
  setConfirmBulk: () => void;
  totalCount: number;
  finalTotal: number;
  totalSavings: number;
  canCheckout: boolean;
  handleCheckout: () => void;
}

export function CartFooter({
  itemsLength,
  allSelected,
  handleSelectAll,
  hasSelected,
  setConfirmBulk,
  totalCount,
  finalTotal,
  totalSavings,
  canCheckout,
  handleCheckout
}: CartFooterProps) {
  if (itemsLength === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 accent-blue-600 rounded-sm"
              checked={allSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <span className="text-sm font-medium text-gray-700">Chọn Tất Cả ({itemsLength})</span>
          </label>
          <button
            onClick={setConfirmBulk}
            disabled={!hasSelected}
            className="text-sm font-medium text-gray-500 hover:text-red-600 disabled:opacity-40 disabled:hover:text-gray-500 disabled:cursor-not-allowed"
          >
            Xóa
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700">
              Tổng thanh toán ({totalCount} Sản phẩm): <span className="text-xl text-gray-900 font-bold ml-2">{formatVND(finalTotal)}</span>
            </div>
            {totalSavings > 0 && (
              <div className="text-xs text-green-600 font-medium">Tiết kiệm {formatVND(totalSavings)}</div>
            )}
          </div>
          <button 
            onClick={handleCheckout}
            disabled={!canCheckout}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 h-12 rounded-lg text-sm font-bold transition-all shadow-md min-w-[200px] disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed"
          >
            Tiếp tục thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
