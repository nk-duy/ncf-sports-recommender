'use client';

import React from 'react';

interface QRPaymentModalProps {
  paymentMethod: string;
  finalTotal: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function QRPaymentModal({ paymentMethod, finalTotal, onCancel, onConfirm }: QRPaymentModalProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Quét mã QR để thanh toán</h3>
        <p className="text-gray-500 mb-6 text-center text-sm">
          Sử dụng Ứng dụng {paymentMethod === 'MOMO' ? 'MoMo' : paymentMethod === 'VNPAY' ? 'Ngân hàng / VNPAY' : 'Ngân hàng'} để quét mã.
        </p>
        
        <div className="w-64 h-64 bg-gray-100 rounded-xl mb-6 p-4 border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
           <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR" className="w-full h-full opacity-80" />
           <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
              <div className="bg-white px-4 py-2 rounded-full font-bold text-blue-600 shadow-md">
                {formatPrice(finalTotal)}
              </div>
           </div>
        </div>

        <div className="flex w-full gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Đã thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
