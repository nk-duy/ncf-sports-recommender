"use client";

import React, { useState } from "react";
import { CheckCircle2, Copy, MailCheck, Truck } from "lucide-react";

export default function OrderSuccessHero() {
  const [copied, setCopied] = useState(false);
  const orderId = "DH-8942";

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="text-center max-w-2xl mx-auto flex flex-col items-center">
      {/* Pulse Checkmark Icon */}
      <div className="w-16 h-16 rounded-full bg-green-50 text-green-700 flex items-center justify-center mb-4">
        <CheckCircle2 size={36} className="text-green-600 fill-green-100" />
      </div>
      
      <span className="text-xs font-semibold text-green-700 tracking-widest uppercase bg-green-50/80 px-3 py-1 rounded-full mb-3">
        Giao dịch đã xác thực thành công
      </span>
      
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
        Đặt hàng thành công!
      </h1>
      
      <p className="text-sm sm:text-base text-gray-600 max-w-md mb-5 leading-relaxed">
        Cảm ơn bạn đã lựa chọn mua sắm tại SportsAI. Đơn hàng của bạn đang được hệ thống phân loại tự động tại kho trung tâm.
      </p>

      {/* Order ID Pill + Copy Micro-interaction */}
      <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-2 rounded-lg">
        <span className="text-sm font-semibold text-gray-500">Mã đơn hàng:</span>
        <span className="font-mono font-bold text-gray-900 text-base">#{orderId}</span>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors" 
          title="Sao chép mã đơn" 
          type="button"
        >
          <Copy size={16} />
          <span>Copy</span>
        </button>
      </div>
      
      <span className={`text-[11px] font-semibold text-green-700 mt-1 transition-opacity ${copied ? 'opacity-100' : 'opacity-0'}`}>
        Đã lưu mã đơn vào bộ nhớ tạm!
      </span>

      {/* Delivery Notice Subtext */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-gray-500 font-medium">
        <span className="flex items-center gap-1.5">
          <MailCheck size={16} className="text-blue-600" />
          Email gửi tới: <strong className="font-semibold text-gray-900">khanhduy.nguyen@email.com</strong>
        </span>
        <span className="hidden sm:inline text-gray-300">•</span>
        <span className="flex items-center gap-1.5">
          <Truck size={16} className="text-green-700" />
          Dự kiến giao: <strong className="font-semibold text-gray-900">2 - 3 ngày làm việc</strong>
        </span>
      </div>
    </section>
  );
}
