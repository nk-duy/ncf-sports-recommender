"use client";

import { Gift, ShieldCheck, Sparkles } from "lucide-react";

interface PromotionsPerkCardsProps {
  mounted: boolean;
  savedVouchers: string[];
  onSavePromo: (code: string, desc: string) => void;
}

export default function PromotionsPerkCards({
  mounted,
  savedVouchers,
  onSavePromo,
}: PromotionsPerkCardsProps) {
  const isVnpaySaved = mounted && savedVouchers.includes("VNPAY10");
  const isFreeshipSaved = mounted && savedVouchers.includes("FREESHIP0D");

  return (
    <div className="w-full lg:w-5/12 flex flex-col justify-between gap-3">
      {/* Card 1: VNPAY / MOMO */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase text-red-700 tracking-wider">
                Thanh toán trực tuyến
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm leading-snug">
              Giảm 10% qua VNPay & MoMo
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tối đa 100K cho đơn từ 600K
            </p>
          </div>
        </div>
        <button
          onClick={() => onSavePromo("VNPAY10", "Giảm 10% qua VNPay")}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
            isVnpaySaved
              ? "bg-red-50 border-red-300 text-red-700 font-bold"
              : "bg-white hover:bg-red-50 border-slate-200 hover:border-red-200 text-slate-800 hover:text-red-600"
          }`}
        >
          {isVnpaySaved ? "Đã lưu ✓" : "Lưu mã"}
        </button>
      </div>

      {/* Card 2: Free Gift */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase text-blue-700 tracking-wider">
                Quà tặng đơn hàng
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm leading-snug">
              Tặng bình nước thể thao 750ml
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Áp dụng tự động cho đơn từ 1.200.000đ
            </p>
          </div>
        </div>
        <span className="shrink-0 px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-600 bg-slate-200/70">
          Tự động tặng
        </span>
      </div>

      {/* Card 3: Free Shipping */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase text-emerald-700 tracking-wider">
                Miễn phí vận chuyển
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm leading-snug">
              Mã FREESHIP0D (Giảm 40K ship)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Miễn phí toàn quốc cho đơn từ 500K
            </p>
          </div>
        </div>
        <button
          onClick={() => onSavePromo("FREESHIP0D", "Giảm 40K phí vận chuyển")}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
            isFreeshipSaved
              ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold"
              : "bg-white hover:bg-emerald-50 border-slate-200 hover:border-emerald-200 text-slate-800 hover:text-emerald-600"
          }`}
        >
          {isFreeshipSaved ? "Đã lưu ✓" : "Lưu mã"}
        </button>
      </div>
    </div>
  );
}
