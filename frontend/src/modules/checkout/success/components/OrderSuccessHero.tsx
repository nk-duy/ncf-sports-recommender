"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Copy, MailCheck, Truck } from "lucide-react";
import confetti from "canvas-confetti";

export default function OrderSuccessHero({ order }: { order?: any }) {
  const [copied, setCopied] = useState(false);
  // Fallback order ID if not passed
  const orderId = order?._id || order?.id || "DH-8942";
  const email = order?.customer_email || "khanhduy.nguyen@email.com"; // using fallback since we didn't collect email during checkout

  useEffect(() => {
    // Fire confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random() - 0.2, y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random() + 0.2, y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 sm:p-12 text-center shadow-lg border border-blue-800 mb-8 max-w-4xl mx-auto flex flex-col items-center">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-blue-400 blur-3xl"></div>
      </div>

      {/* Pulse Checkmark Icon */}
      <div className="relative z-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center mb-6 shadow-xl border border-white/20">
        <CheckCircle2 size={44} className="text-white fill-green-500" />
      </div>
      
      <span className="relative z-10 text-[11px] font-bold text-blue-900 tracking-widest uppercase bg-green-400 px-3 py-1 rounded-full mb-4 shadow-sm">
        Giao dịch đã xác thực thành công
      </span>
      
      <h1 className="relative z-10 text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
        Chúc mừng! Đặt hàng thành công
      </h1>
      
      <p className="relative z-10 text-sm sm:text-base text-blue-100 max-w-lg mb-6 leading-relaxed">
        Cảm ơn bạn đã tin tưởng SportsAI. Đơn hàng của bạn đang được hệ thống phân loại tự động tại kho trung tâm.
      </p>

      {/* Order ID Pill + Copy Micro-interaction */}
      <div className="relative z-10 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2.5 rounded-xl shadow-inner">
        <span className="text-sm font-medium text-blue-200">Mã đơn hàng:</span>
        <span className="font-mono font-bold text-white text-lg tracking-wider">#{orderId}</span>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-white hover:text-green-300 font-semibold text-sm transition-colors ml-2 bg-white/10 px-2 py-1 rounded" 
          title="Sao chép mã đơn" 
          type="button"
        >
          <Copy size={14} />
          <span>Copy</span>
        </button>
      </div>
      
      <span className={`relative z-10 text-[11px] font-bold text-green-300 mt-2 transition-opacity ${copied ? 'opacity-100' : 'opacity-0'}`}>
        Đã lưu mã đơn vào bộ nhớ tạm!
      </span>

      {/* Delivery Notice Subtext */}
      <div className="relative z-10 mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-blue-100 font-medium">
        <span className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg">
          <MailCheck size={16} className="text-blue-300" />
          Email: <strong className="font-bold text-white">{email}</strong>
        </span>
        <span className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg">
          <Truck size={16} className="text-blue-300" />
          Dự kiến giao: <strong className="font-bold text-white">2 - 3 ngày làm việc</strong>
        </span>
      </div>
    </section>
  );
}
