import React from 'react';
import Link from 'next/link';
import { Truck, Sparkles } from 'lucide-react';
import { formatVND, FREESHIP_THRESHOLD } from '@/shared/lib/cart';

interface CartFreeshipProgressProps {
  subtotal: number;
}

export function CartFreeshipProgress({ subtotal }: CartFreeshipProgressProps) {
  const isQualified = subtotal >= FREESHIP_THRESHOLD;
  const progressPercent = Math.min(100, Math.round((subtotal / FREESHIP_THRESHOLD) * 100));

  return (
    <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-emerald-50/50 rounded-2xl shadow-xs p-4 sm:p-5 border border-blue-100/80 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 w-full sm:w-auto">
        <div className="w-11 h-11 rounded-2xl bg-white shadow-xs border border-blue-200/60 flex items-center justify-center text-blue-600 shrink-0">
          <Truck size={22} />
        </div>
        <div className="flex-1">
          {isQualified ? (
            <p className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
              <Sparkles size={16} className="text-emerald-600 shrink-0 animate-pulse" />
              Chúc mừng! Bạn đã đủ điều kiện Miễn Phí Vận Chuyển toàn quốc.
            </p>
          ) : (
            <p className="text-sm text-gray-800">
              Mua thêm <strong className="font-extrabold text-blue-600">{formatVND(FREESHIP_THRESHOLD - subtotal)}</strong> để nhận <strong className="font-bold text-emerald-700">Freeship toàn quốc</strong>!
            </p>
          )}
          <div className="w-full sm:w-80 bg-gray-200/70 h-2.5 rounded-full overflow-hidden mt-2 p-0.5">
            <div 
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
      {!isQualified && (
        <Link 
          href="/san-pham" 
          className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-white px-3.5 py-2 rounded-xl shadow-xs border border-blue-100 hover:border-blue-300 transition-all shrink-0"
        >
          + Chọn thêm sản phẩm
        </Link>
      )}
    </div>
  );
}
