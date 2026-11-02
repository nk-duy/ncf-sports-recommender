import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { SavedForLater } from './SavedForLater';
import { CartItem } from '@/shared/store/cartStore';

interface EmptyCartStateProps {
  savedItems: CartItem[];
  moveSavedToCart: (key: string) => void;
  removeSaved: (key: string) => void;
  showNotification: (msg: string) => void;
}

export function EmptyCartState({
  savedItems,
  moveSavedToCart,
  removeSaved,
  showNotification
}: EmptyCartStateProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-6">
      <div className="w-16 h-16 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center mb-4 text-blue-600 shadow-inner">
        <ShoppingBag size={32} className="stroke-[1.5]" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Giỏ hàng của bạn đang trống</h2>
      <p className="text-gray-500 text-xs sm:text-sm max-w-md mb-6 leading-relaxed">
        Bạn chưa thêm sản phẩm thể thao nào vào giỏ. Hãy dạo quanh cửa hàng và khám phá những trang bị mới nhất từ KADY!
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
        <Link 
          href="/san-pham" 
          className="h-10 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-md shadow-blue-500/20 active:scale-95 text-sm inline-flex items-center justify-center"
        >
          Khám phá sản phẩm ngay
        </Link>
        <Link 
          href="/khuyen-mai" 
          className="h-10 px-5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition text-sm inline-flex items-center justify-center"
        >
          Săn Voucher ưu đãi
        </Link>
      </div>

      {savedItems.length > 0 && (
        <div className="w-full mt-10 pt-8 border-t border-gray-100 text-left">
          <SavedForLater
            savedItems={savedItems}
            moveSavedToCart={moveSavedToCart}
            removeSaved={removeSaved}
            showNotification={showNotification}
          />
        </div>
      )}
    </div>
  );
}
