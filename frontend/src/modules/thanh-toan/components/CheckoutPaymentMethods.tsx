'use client';

import React from 'react';
import { useCheckoutStore } from '@/shared/store/checkoutStore';

export default function CheckoutPaymentMethods() {
  const { payment_method, setField } = useCheckoutStore();

  return (
    <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-8">
      <h3 className="text-lg text-gray-900 font-medium">Phương thức thanh toán</h3>
      <div className="flex gap-2 flex-wrap">
        <button 
          onClick={() => setField('payment_method', 'COD')}
          className={`px-4 py-2 text-sm border rounded-md flex items-center gap-2 transition-colors ${payment_method === 'COD' ? 'border-blue-600 text-blue-600 bg-blue-50 font-medium' : 'border-gray-300 text-gray-700 hover:border-blue-400'}`}
        >
          Thanh toán khi nhận hàng
        </button>
        <button 
          onClick={() => setField('payment_method', 'VNPAY')}
          className={`px-4 py-2 text-sm border rounded-md flex items-center gap-2 transition-colors ${payment_method === 'VNPAY' ? 'border-blue-600 text-blue-600 bg-blue-50 font-medium' : 'border-gray-300 text-gray-700 hover:border-blue-400'}`}
        >
          VNPAY / Thẻ Tín Dụng
        </button>
        <button 
          onClick={() => setField('payment_method', 'MOMO')}
          className={`px-4 py-2 text-sm border rounded-md flex items-center gap-2 transition-colors ${payment_method === 'MOMO' ? 'border-[#A50064] text-[#A50064] bg-pink-50 font-medium' : 'border-gray-300 text-gray-700 hover:border-[#A50064]'}`}
        >
          Ví MoMo
        </button>
        <button 
          onClick={() => setField('payment_method', 'BANK_TRANSFER')}
          className={`px-4 py-2 text-sm border rounded-md flex items-center gap-2 transition-colors ${payment_method === 'BANK_TRANSFER' ? 'border-blue-600 text-blue-600 bg-blue-50 font-medium' : 'border-gray-300 text-gray-700 hover:border-blue-400'}`}
        >
          Chuyển khoản Ngân hàng
        </button>
      </div>
    </div>
  );
}
