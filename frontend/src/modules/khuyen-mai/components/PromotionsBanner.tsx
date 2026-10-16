"use client";

import React, { useState, useEffect } from "react";
import { Zap, Clock, Flame, Ticket, Gift, ArrowRight, ShieldCheck, Sparkles, Check } from "lucide-react";
import { notifications } from "@mantine/notifications";

export default function PromotionsBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 38,
    seconds: 52
  });
  
  const [mounted, setMounted] = useState(false);
  const [copiedPromo, setCopiedPromo] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Countdown target date
    let targetStr = localStorage.getItem("kadyMegaSaleTarget");
    let targetDate = targetStr ? parseInt(targetStr) : 0;
    
    if (!targetDate || targetDate < new Date().getTime()) {
      targetDate = new Date().getTime() + (2 * 24 * 60 * 60 * 1000) + (8 * 60 * 60 * 1000) + (45 * 60 * 1000);
      localStorage.setItem("kadyMegaSaleTarget", targetDate.toString());
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        targetDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);
        localStorage.setItem("kadyMegaSaleTarget", targetDate.toString());
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNum = (num: number) => num.toString().padStart(2, "0");

  const handleCopyCode = (code: string, desc: string) => {
    navigator.clipboard.writeText(code);
    setCopiedPromo(code);
    notifications.show({
      title: "Đã sao chép mã ưu đãi!",
      message: `Mã ${code} (${desc}) đã được lưu vào bộ nhớ tạm. Dán khi thanh toán!`,
      color: "red",
      icon: <Check size={16} />,
      autoClose: 2500,
    });
    setTimeout(() => setCopiedPromo(null), 2500);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm mb-10">
      {/* Subtle athletic dynamic backdrop accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-100/60 via-amber-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-slate-100/80 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-stretch justify-between gap-8 lg:gap-10">
        {/* Left Column: Hero Headline & Timer */}
        <div className="w-full lg:w-7/12 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-600 text-white text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-white" />
                Đại tiệc siêu sale
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                Giảm đến 50% hàng ngàn sản phẩm
              </span>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                Mùa Thể Thao Đỉnh Cao <br />
                <span className="text-red-600">Ưu Đãi Lớn Nhất Năm</span>
              </h1>
              <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
                Sở hữu giày chạy, vợt pickleball, cầu lông và trang phục thể thao chính hãng với giá tốt nhất cùng combo quà tặng độc quyền.
              </p>
            </div>

            {/* Countdown Bar */}
            <div className="inline-flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide pr-2 border-r border-slate-200">
                <Clock className="w-4 h-4 text-red-600" />
                <span>Kết thúc sau</span>
              </div>

              <div className="flex items-center gap-1.5 font-mono">
                <div className="flex items-baseline gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                  <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
                    {mounted ? formatNum(timeLeft.days) : "02"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">ngày</span>
                </div>
                <span className="text-slate-400 font-bold">:</span>

                <div className="flex items-baseline gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                  <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
                    {mounted ? formatNum(timeLeft.hours) : "14"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">giờ</span>
                </div>
                <span className="text-slate-400 font-bold">:</span>

                <div className="flex items-baseline gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                  <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
                    {mounted ? formatNum(timeLeft.minutes) : "38"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">phút</span>
                </div>
                <span className="text-slate-400 font-bold">:</span>

                <div className="flex items-baseline gap-1 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 shadow-xs">
                  <span className="text-base sm:text-lg font-black text-red-600 leading-none">
                    {mounted ? formatNum(timeLeft.seconds) : "52"}
                  </span>
                  <span className="text-[10px] font-bold text-red-500 uppercase">giây</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-6">
            <button
              onClick={() => scrollToSection("khuyen-mai-products")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide transition-colors shadow-sm cursor-pointer"
            >
              Xem ngay sản phẩm sale
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollToSection("kho-voucher")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-slate-500" />
              Kho voucher toàn sàn
            </button>
          </div>
        </div>

        {/* Right Column: Special Retail Perks */}
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
              onClick={() => handleCopyCode("VNPAY10", "Giảm 10% qua VNPay")}
              className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-800 hover:text-red-600 transition-colors cursor-pointer"
            >
              {copiedPromo === "VNPAY10" ? "Đã lưu" : "Lưu mã"}
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
                  Freeship toàn quốc 0Đ
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Áp dụng đồng thời voucher giảm giá
                </p>
              </div>
            </div>
            <button
              onClick={() => handleCopyCode("FREESHIP0D", "Freeship toàn sàn")}
              className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-800 hover:text-emerald-600 transition-colors cursor-pointer"
            >
              {copiedPromo === "FREESHIP0D" ? "Đã lưu" : "Lưu mã"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
