import { formatVND } from '@/shared/lib/cart';
import { ArrowRight, Trash2 } from 'lucide-react';

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
  handleCheckout,
}: CartFooterProps) {
  if (itemsLength === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-[0_-8px_25px_rgba(0,0,0,0.06)] z-30 transition-all lg:hidden">
      <div className="w-full mx-auto px-4 sm:px-8 py-2.5 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left: Select all & Bulk delete */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              checked={allSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <span className="text-xs sm:text-sm font-semibold text-gray-800">
              Chọn tất cả <span className="text-gray-500 font-normal">({itemsLength})</span>
            </span>
          </label>
          <button
            onClick={setConfirmBulk}
            disabled={!hasSelected}
            className="text-xs font-semibold text-gray-500 hover:text-red-600 disabled:opacity-30 disabled:hover:text-gray-500 disabled:cursor-not-allowed flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Xóa đã chọn</span>
          </button>
        </div>

        {/* Right: Price & CTA */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 w-full sm:w-auto">
          <div className="text-left sm:text-right">
            <div className="text-[11px] text-gray-500 font-medium">Tổng thanh toán ({totalCount} món):</div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl text-blue-600 font-extrabold tracking-tight tabular-nums">
                {formatVND(finalTotal)}
              </span>
              {totalSavings > 0 && (
                <span className="hidden sm:inline-block text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Tiết kiệm {formatVND(totalSavings)}
                </span>
              )}
            </div>
            {totalSavings > 0 && (
              <div className="sm:hidden text-[10px] font-semibold text-emerald-600">
                Tiết kiệm {formatVND(totalSavings)}
              </div>
            )}
          </div>

          <button
            onClick={handleCheckout}
            disabled={!canCheckout}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 h-10 rounded-xl text-sm font-bold tracking-wide transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] min-w-[140px] sm:min-w-[180px] flex items-center justify-center gap-1.5 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
          >
            <span>Mua hàng</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
