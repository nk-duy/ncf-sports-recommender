'use client';

import { useEffect, useState } from 'react';
import type { RawVoucherResponse } from '../types';
import { resolveApiBaseUrl } from '@/shared/lib/apiUrl';

interface VoucherItem {
  code: string;
  discount_type: 'amount' | 'percent';
  discount_value: number;
  min_order_value?: number;
  description?: string;
}

export default function ProductVouchersSection() {
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch(`${resolveApiBaseUrl()}/vouchers`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: RawVoucherResponse[] | null) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: VoucherItem[] = data.map((v) => ({
            code: v.code,
            discount_type: v.discount_type || 'amount',
            discount_value: v.discount_value,
            min_order_value: v.min_order_value || 0,
            description:
              v.discount_type === 'percent'
                ? `Giảm ${v.discount_value}% đơn từ ${v.min_order_value?.toLocaleString('vi-VN')}đ`
                : `Giảm ${v.discount_value?.toLocaleString('vi-VN')}đ đơn từ ${v.min_order_value?.toLocaleString('vi-VN')}đ`,
          }));
          setVouchers(mapped);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  if (vouchers.length === 0) return null;

  return (
    <div className="relative">
      {/* Thanh Voucher kiểu Ticket gọn gàng 1 dòng ngang */}
      <div className="flex items-center justify-between bg-slate-50/80 border border-slate-200/80 rounded-xl px-3 py-2 transition-all text-xs">
        <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0 mr-2">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold shrink-0">
            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2 2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 00-2-2 2 2 0 002-2V7a2 2 0 00-2-2H5z" />
            </svg>
            <span className="text-xs font-bold text-slate-700">Mã giảm giá:</span>
          </div>

          <div className="flex items-center gap-2 overflow-hidden">
            {vouchers.slice(0, 3).map((v) => (
              <span
                key={v.code}
                onClick={() => handleCopy(v.code)}
                title="Bấm để lưu mã"
                className="inline-flex items-center gap-1 border border-dashed border-blue-500 bg-blue-50/70 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded cursor-pointer hover:bg-blue-100 transition-colors shrink-0 shadow-2xs"
              >
                {copiedCode === v.code ? 'Đã chép ✓' : v.code}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 shrink-0 ml-auto cursor-pointer"
        >
          <span>{isOpen ? 'Thu gọn' : `Xem tất cả (${vouchers.length})`}</span>
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-blue-100 p-3 z-30 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 text-xs">
            <span className="font-bold text-gray-800">Chọn hoặc lưu mã giảm giá</span>
            <span className="text-gray-400 text-[11px]">{vouchers.length} mã khả dụng</span>
          </div>
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
            {vouchers.map((v) => (
              <div
                key={v.code}
                className="flex items-center justify-between bg-gray-50/70 hover:bg-blue-50/50 border border-gray-200/80 hover:border-blue-200 rounded-lg p-2 transition-all"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-2 py-1 bg-blue-600 text-white font-bold text-[10px] rounded uppercase tracking-wider shrink-0 shadow-2xs">
                    {v.code}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-gray-800 font-semibold truncate" title={v.description}>
                      {v.description}
                    </span>
                    {v.min_order_value ? (
                      <span className="text-[10px] text-gray-400">
                        Đơn tối thiểu {v.min_order_value.toLocaleString('vi-VN')}đ
                      </span>
                    ) : null}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(v.code)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors shrink-0 ml-2 ${
                    copiedCode === v.code
                      ? 'bg-green-600 text-white'
                      : 'bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  {copiedCode === v.code ? 'Đã lưu ✓' : 'Lưu mã'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
