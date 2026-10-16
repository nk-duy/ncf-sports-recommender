'use client';

import React from 'react';

interface CheckoutSummaryProps {
  total: number;
  shippingFee: number;
  discountAmount: number;
  finalTotal: number;
  loading: boolean;
  onPlaceOrder: () => void;
}

export default function CheckoutSummary({
  total,
  shippingFee,
  discountAmount,
  finalTotal,
  loading,
  onPlaceOrder
}: CheckoutSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <>
      <div className="bg-gray-50/50 border-t border-gray-100 p-6 flex justify-end">
        <div className="w-[400px]">
          <div className="flex justify-between items-center py-2 text-sm">
            <span className="text-gray-500 font-medium">Tổng tiền hàng</span>
            <span className="text-gray-800 font-medium">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between items-center py-2 text-sm">
            <span className="text-gray-500 font-medium">Phí vận chuyển</span>
            <span className="text-gray-800 font-medium">{formatPrice(shippingFee)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between items-center py-2 text-sm">
              <span className="text-gray-500 font-medium">Giảm giá voucher</span>
              <span className="text-green-600 font-medium">- {formatPrice(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-3 mt-2 border-t border-gray-200">
            <span className="text-gray-500 font-medium">Tổng thanh toán</span>
            <span className="text-3xl text-blue-600 font-bold">{formatPrice(finalTotal)}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 p-6 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo <span className="text-blue-600 cursor-pointer">Điều khoản KADY</span>
        </div>
        <button 
          onClick={onPlaceOrder}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3.5 rounded-lg text-lg font-bold transition-all shadow-md min-w-[200px]"
        >
          {loading ? "Đang xử lý..." : "Đặt Hàng"}
        </button>
      </div>
    </>
  );
}
