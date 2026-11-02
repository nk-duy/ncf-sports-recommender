'use client';

import type React from 'react';
import { Clock, Loader2, Search } from 'lucide-react';
import type { TrackedOrder } from '../types';

interface OrderTrackingFormProps {
  orderId: string;
  setOrderId: (id: string) => void;
  loading: boolean;
  error?: string;
  onSearch: (e: React.FormEvent) => void;
  recentOrders?: TrackedOrder[];
  onSelectRecent?: (code: string, order: TrackedOrder) => void;
}

export default function OrderTrackingForm({
  orderId,
  setOrderId,
  loading,
  onSearch,
  recentOrders = [],
  onSelectRecent,
}: OrderTrackingFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Preserve input value while stripping leading whitespace
    setOrderId(e.target.value.trimStart());
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    setOrderId(pasted);
  };

  return (
    <div className="max-w-xl mx-auto mb-6">
      <form onSubmit={onSearch} className="relative">
        <div className="relative flex items-center">
          <input
            value={orderId}
            onChange={handleChange}
            onPaste={handlePaste}
            className="w-full h-10 pl-4 pr-32 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
            placeholder="Nhập mã đơn: #ORD-18C309 hoặc ID..."
            type="text"
            disabled={loading}
          />
          <button
            disabled={loading || !orderId.trim()}
            type="submit"
            className="absolute right-1 top-1 bottom-1 h-8 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang tra cứu...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Tra cứu</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Suggestions: Đơn hàng gần đây của bạn (Smart Authenticated UX) */}
      {recentOrders && recentOrders.length > 0 && (
        <div className="mt-4 pt-3.5 border-t border-slate-100">
          <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Đơn hàng gần đây của bạn:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentOrders.slice(0, 5).map((ro) => {
              const code = `ORD-${(ro._id || '').slice(-6).toUpperCase()}`;
              const isSelected = orderId.toUpperCase().includes(code);

              const statusRaw = (ro.status || '').toLowerCase();
              const statusBadge =
                statusRaw === 'shipping'
                  ? { text: 'Đang giao', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
                  : statusRaw === 'confirmed'
                    ? { text: 'Đã duyệt', bg: 'bg-blue-50 text-blue-700 border-blue-200' }
                    : statusRaw === 'completed' || statusRaw === 'delivered'
                      ? { text: 'Thành công', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
                      : statusRaw === 'cancelled' || statusRaw === 'rejected'
                        ? { text: 'Đã hủy', bg: 'bg-red-50 text-red-700 border-red-200' }
                        : { text: 'Chờ duyệt', bg: 'bg-amber-50 text-amber-700 border-amber-200' };

              return (
                <button
                  key={ro._id}
                  type="button"
                  onClick={() => onSelectRecent && onSelectRecent(code, ro)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono tabular-nums transition-all cursor-pointer shadow-2xs border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-blue-400'
                  }`}
                  title={`Bấm để tra cứu đơn #${code}`}
                >
                  <span className="font-bold">#{code}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md border font-sans font-semibold ${
                      isSelected ? 'bg-blue-700/60 text-white border-transparent' : statusBadge.bg
                    }`}
                  >
                    {statusBadge.text}
                  </span>
                  {ro.total_amount ? (
                    <span
                      className={`text-[11px] font-sans tabular-nums font-semibold ${
                        isSelected ? 'text-blue-100' : 'text-slate-500'
                      }`}
                    >
                      {ro.total_amount.toLocaleString('vi-VN')}₫
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
