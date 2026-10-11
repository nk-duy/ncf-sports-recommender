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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#0B1528] to-[#1a0a1e] text-white shadow-2xl border border-slate-800/80 mb-10">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-red-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-20 left-10 w-[350px] h-[350px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none" 
        style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />

      <div className="relative z-10 p-6 sm:p-10 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Column: Hero Headline & Timer */}
        <div className="w-full lg:w-3/5 space-y-6">
          {/* Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white text-xs font-black tracking-wider uppercase shadow-lg shadow-red-500/25 animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-white" />
              ĐẠI TIỆC SIÊU SALE THỂ THAO
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-amber-300 text-xs font-semibold backdrop-blur-sm">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Hơn 200+ Sản Phẩm Giảm Sốc
            </span>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[1.08]">
              MEGA SPORTS <span className="bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300 bg-clip-text text-transparent">FESTIVAL</span>
            </h1>
            <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-100 uppercase tracking-tight flex items-center gap-2">
              GIẢM ĐẾN <span className="text-red-500 underline decoration-amber-400 decoration-wavy decoration-2">50% TOÀN BỘ</span> SẢN PHẨM
            </p>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
            Cơ hội sở hữu giày thể thao, vợt pickleball & cầu lông, trang phục Dry-fit cùng thiết bị tập luyện chính hãng với mức giá hời nhất năm. Số lượng giới hạn theo từng khung giờ!
          </p>

          {/* Live Countdown Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md max-w-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wide">
                <Clock className="w-4 h-4 animate-spin text-amber-400" style={{ animationDuration: "12s" }} />
                Thời gian ưu đãi còn lại
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                Flash Sale Kết Thúc Sớm
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex-1 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-xl py-2 px-1 text-center shadow-inner">
                <span className="block text-2xl sm:text-3xl font-black text-white leading-none font-mono">
                  {mounted ? formatNum(timeLeft.days) : "02"}
                </span>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">NGÀY</span>
              </div>
              <span className="text-xl font-bold text-red-500">:</span>

              <div className="flex-1 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-xl py-2 px-1 text-center shadow-inner">
                <span className="block text-2xl sm:text-3xl font-black text-white leading-none font-mono">
                  {mounted ? formatNum(timeLeft.hours) : "14"}
                </span>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">GIỜ</span>
              </div>
              <span className="text-xl font-bold text-red-500">:</span>

              <div className="flex-1 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-xl py-2 px-1 text-center shadow-inner">
                <span className="block text-2xl sm:text-3xl font-black text-white leading-none font-mono">
                  {mounted ? formatNum(timeLeft.minutes) : "38"}
                </span>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">PHÚT</span>
              </div>
              <span className="text-xl font-bold text-red-500">:</span>

              <div className="flex-1 bg-gradient-to-b from-red-950 to-red-900 border border-red-700/80 rounded-xl py-2 px-1 text-center shadow-inner">
                <span className="block text-2xl sm:text-3xl font-black text-amber-300 leading-none font-mono">
                  {mounted ? formatNum(timeLeft.seconds) : "52"}
                </span>
                <span className="block text-[10px] font-bold text-red-300 uppercase tracking-wider mt-1">GIÂY</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => scrollToSection("khuyen-mai-products")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-sm sm:text-base tracking-wide uppercase shadow-lg shadow-red-600/40 hover:shadow-red-600/60 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <Flame className="w-5 h-5 fill-white" />
              Săn Deal Ngay
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => scrollToSection("kho-voucher")}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-bold text-sm tracking-wide uppercase backdrop-blur-sm transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-amber-400" />
              Lấy Mã Toàn Sàn
            </button>
          </div>
        </div>

        {/* Right Column: Special Perks & Fast Copy Cards */}
        <div className="w-full lg:w-2/5 flex flex-col gap-4">
          {/* Card 1: VNPAY / MOMO */}
          <div className="group relative rounded-2xl bg-gradient-to-r from-slate-900/90 to-red-950/60 p-5 border border-slate-800 hover:border-red-500/50 shadow-xl backdrop-blur-md transition-all duration-300">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 mb-1">
                    Ưu Đãi Thanh Toán
                  </span>
                  <h3 className="font-bold text-slate-100 text-base leading-tight">
                    Giảm thêm 10% qua VNPay & MoMo
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Giảm tối đa 100.000đ khi thanh toán đơn từ 600.000đ
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleCopyCode("VNPAY10", "Giảm 10% qua VNPay")}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer"
              >
                {copiedPromo === "VNPAY10" ? "Đã lưu" : "Lưu mã"}
              </button>
            </div>
          </div>

          {/* Card 2: Free Gift */}
          <div className="group relative rounded-2xl bg-gradient-to-r from-slate-900/90 to-blue-950/60 p-5 border border-slate-800 hover:border-blue-500/50 shadow-xl backdrop-blur-md transition-all duration-300">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-1">
                    Quà Tặng Thể Thao 0Đ
                  </span>
                  <h3 className="font-bold text-slate-100 text-base leading-tight">
                    Tặng Bình Nước Thể Thao 750ml
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Áp dụng tự động cho mọi đơn hàng giá trị từ 1.200.000đ
                  </p>
                </div>
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded-md text-[11px] font-bold text-blue-300 bg-blue-950/80 border border-blue-800">
                Tự động
              </span>
            </div>
          </div>

          {/* Card 3: Free Shipping */}
          <div className="group relative rounded-2xl bg-gradient-to-r from-slate-900/90 to-emerald-950/60 p-5 border border-slate-800 hover:border-emerald-500/50 shadow-xl backdrop-blur-md transition-all duration-300">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-1">
                    Vận Chuyển Hỏa Tốc
                  </span>
                  <h3 className="font-bold text-slate-100 text-base leading-tight">
                    Miễn phí vận chuyển toàn quốc 0Đ
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Áp dụng đồng thời cùng voucher giảm giá và quà tặng
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleCopyCode("FREESHIP0D", "Freeship toàn sàn")}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
              >
                {copiedPromo === "FREESHIP0D" ? "Đã lưu" : "Lưu mã"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
