'use client';

import { useEffect, useState } from 'react';
import { Check, CheckCircle2, Copy, CreditCard, ShieldCheck, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { PublicOrderData } from '../../types';

export default function OrderSuccessHero({ order }: { order?: PublicOrderData | null }) {
  const [copied, setCopied] = useState(false);

  const orderId = order?._id || order?.id || '';
  const shortCode = orderId ? `ORD-${orderId.slice(-6).toUpperCase()}` : 'ORD-KADY';
  const customerName = order?.customer_name || 'Quý khách';
  const shippingMethod =
    order?.shipping_method ||
    (order?.shipping_fee === 60000
      ? 'Hỏa Tốc 24H'
      : order?.shipping_fee === 35000
        ? 'Giao Hàng Nhanh'
        : 'VNExpress Tiêu chuẩn');

  const deliveryEta = shippingMethod.includes('Hỏa Tốc')
    ? 'Trong 24 giờ tới'
    : shippingMethod.includes('Nhanh')
      ? '2 - 3 ngày làm việc'
      : '3 - 5 ngày làm việc';

  const paymentLabel =
    order?.payment_method === 'BANK_TRANSFER'
      ? 'Chuyển khoản Ngân hàng'
      : order?.payment_method === 'VNPAY'
        ? 'VNPAY-QR'
        : 'Thanh toán khi nhận hàng (COD)';

  useEffect(() => {
    try {
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

      const interval: ReturnType<typeof setInterval> = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }
        const particleCount = 40 * (timeLeft / duration);
        void confetti({
          ...defaults,
          particleCount,
          origin: { x: Math.random() * 0.4 + 0.3, y: 0.3 },
        });
      }, 250);

      return () => clearInterval(interval);
    } catch {
      // Ignore if confetti not supported
    }
  }, []);

  const handleCopy = () => {
    if (orderId) {
      void navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-2xl py-6 px-6 sm:px-8 text-center shadow-lg border border-blue-600/40 w-full flex flex-col items-center">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-cyan-400 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-blue-500 blur-3xl" />
      </div>

      <div className="relative z-10 size-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center mb-2.5 shadow-md border border-white/20">
        <CheckCircle2 size={26} className="text-white fill-emerald-500" />
      </div>

      <div className="relative z-10 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold tracking-wide mb-2">
        <ShieldCheck size={13} />
        <span>GIAO DỊCH ĐÃ ĐƯỢC XÁC THỰC THÀNH CÔNG</span>
      </div>

      <h1 className="relative z-10 text-xl md:text-2xl font-bold text-balance text-white tracking-tight mb-1.5">
        Cảm ơn {customerName}! Đặt hàng thành công
      </h1>

      <p className="relative z-10 text-xs sm:text-sm text-blue-100 max-w-lg mb-4 leading-relaxed">
        KADY đã tiếp nhận đơn hàng của bạn. Đội ngũ nhân viên kho đang tiến hành đóng gói và sẽ bàn giao cho đối tác vận
        chuyển sớm nhất.
      </p>

      <div className="relative z-10 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md border border-white/25 px-4 sm:px-5 py-2 rounded-xl shadow-inner">
        <span className="text-xs sm:text-sm font-medium text-blue-200">Mã đơn hàng:</span>
        <span className="font-sans font-semibold text-white text-base sm:text-lg tracking-wider tabular-nums">
          #{shortCode}
        </span>
        <span className="text-xs font-sans text-blue-300 hidden md:inline tabular-nums">({orderId})</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs font-semibold bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer ml-1"
          title="Sao chép mã đơn"
          type="button"
        >
          {copied ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
          <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
        </button>
      </div>

      <div className="relative z-10 mt-4 pt-3.5 border-t border-white/15 w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-medium text-blue-100">
        <div className="flex items-center justify-center gap-2 bg-black/20 backdrop-blur-xs py-2 px-3.5 rounded-xl border border-white/10">
          <Truck size={15} className="text-cyan-300 shrink-0" />
          <span>
            Gói giao: <strong className="text-white font-semibold">{shippingMethod}</strong> ({deliveryEta})
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 bg-black/20 backdrop-blur-xs py-2 px-3.5 rounded-xl border border-white/10">
          <CreditCard size={15} className="text-cyan-300 shrink-0" />
          <span>
            Thanh toán: <strong className="text-white font-semibold">{paymentLabel}</strong>
          </span>
        </div>
      </div>
    </section>
  );
}
