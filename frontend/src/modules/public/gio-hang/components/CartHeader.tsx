import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface CartHeaderProps {
  itemsCount: number;
}

export function CartHeader({ itemsCount }: CartHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200/80 shadow-xs sticky top-0 z-20">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-18 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-blue-700 font-extrabold text-2xl tracking-tighter group-hover:text-blue-800 transition-colors">KADY</span>
            <span className="text-gray-300 text-xl font-light">|</span>
            <span className="text-gray-900 text-lg font-bold">Giỏ Hàng</span>
          </Link>
          {itemsCount > 0 && (
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              {itemsCount} món
            </span>
          )}
        </div>
        <Link 
          href="/san-pham" 
          className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Tiếp tục mua sắm</span>
        </Link>
      </div>
    </div>
  );
}
