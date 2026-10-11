'use client';

import React, { useState, useEffect } from 'react';

interface VoucherItem {
  code: string;
  discount_type: 'amount' | 'percent';
  discount_value: number;
  min_order_value?: number;
  description?: string;
}

export default function ProductVouchersSection() {
  const [vouchers, setVouchers] = useState<VoucherItem[]>([
    {
      code: 'KADY30K',
      discount_type: 'amount',
      discount_value: 30000,
      min_order_value: 300000,
      description: 'Giảm 30.000đ cho đơn từ 300.000đ',
    },
    {
      code: 'FREESHIP',
      discount_type: 'amount',
      discount_value: 25000,
      min_order_value: 500000,
      description: 'Miễn phí vận chuyển toàn quốc',
    },
    {
      code: 'KADYSPORTS10',
      discount_type: 'percent',
      discount_value: 10,
      min_order_value: 800000,
      description: 'Giảm 10% tối đa 100.000đ',
    },
  ]);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    // Fetch vouchers from API if available
    fetch('http://localhost:8000/api/v1/vouchers')
      ? fetch('http://localhost:8000/api/v1/vouchers')
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
              const mapped = data.map((v: any) => ({
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
          .catch((err) => console.error(err))
      : null;
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="mb-6 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-blue-50/70 p-4 rounded-xl border border-blue-100">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2 2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 00-2-2 2 2 0 002-2V7a2 2 0 00-2-2H5z" />
        </svg>
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Mã giảm giá dành cho bạn</h4>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {vouchers.map((v) => (
          <div
            key={v.code}
            className="flex items-center bg-white border border-blue-200 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-shadow group"
          >
            <div className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider border-r border-blue-500 flex items-center justify-center">
              {v.code}
            </div>
            <div className="px-3 py-1.5 flex items-center gap-3">
              <span className="text-xs text-gray-700 font-medium">{v.description}</span>
              <button
                onClick={() => handleCopy(v.code)}
                className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors ${
                  copiedCode === v.code
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                {copiedCode === v.code ? 'Đã lưu ✓' : 'Lưu mã'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
