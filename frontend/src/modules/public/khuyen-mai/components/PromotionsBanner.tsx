"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ArrowRight, Check, Clock, Flame, Ticket } from "lucide-react";
import { notifications } from "@mantine/notifications";
import PromotionsPerkCards from "./PromotionsPerkCards";

const emptySubscribe = () => () => {};

function readInitialSavedVouchers(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("kady_saved_vouchers");
    return saved ? (JSON.parse(saved) as string[]) : [];
  } catch {
    return [];
  }
}

export default function PromotionsBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 38,
    seconds: 52,
  });

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [savedVouchers, setSavedVouchers] = useState<string[]>(readInitialSavedVouchers);

  useEffect(() => {
    const targetStr = localStorage.getItem("kadyMegaSaleTarget");
    let targetDate = targetStr ? parseInt(targetStr, 10) : 0;

    if (!targetDate || targetDate < Date.now()) {
      targetDate = Date.now() + 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000 + 45 * 60 * 1000;
      localStorage.setItem("kadyMegaSaleTarget", targetDate.toString());
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const distance = targetDate - now;

      if (distance <= 0) {
        targetDate = Date.now() + 3 * 24 * 60 * 60 * 1000;
        localStorage.setItem("kadyMegaSaleTarget", targetDate.toString());
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNum = (num: number) => num.toString().padStart(2, "0");

  const handleSavePromo = (code: string, desc: string) => {
    navigator.clipboard.writeText(code);
    setSavedVouchers((prev) => {
      const updated = prev.includes(code) ? prev : [...prev, code];
      try {
        localStorage.setItem("kady_saved_vouchers", JSON.stringify(updated));
      } catch {
        // Ignore storage quota errors
      }
      return updated;
    });

    notifications.show({
      title: "Đã lưu mã ưu đãi!",
      message: `Mã ${code} (${desc}) đã được lưu. Áp dụng tại bước Thanh toán!`,
      color: "teal",
      icon: <Check size={16} />,
      autoClose: 2500,
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm mb-10">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-100/60 via-amber-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-slate-100/80 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 p-5 sm:p-6 lg:p-7 flex flex-col lg:flex-row items-stretch justify-between gap-6 lg:gap-8">
        {/* Left Column: Hero Headline & Timer */}
        <div className="w-full lg:w-7/12 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-600 text-white text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-white" />
                Đại tiệc siêu sale
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                Giảm đến 50% hàng ngàn sản phẩm
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tight leading-tight text-balance">
                Mùa Thể Thao Đỉnh Cao <br />
                <span className="text-red-600">Ưu Đãi Lớn Nhất Năm</span>
              </h1>
              <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl text-pretty">
                Sở hữu giày chạy, vợt pickleball, cầu lông và trang phục thể thao chính hãng với giá tốt nhất cùng combo quà tặng độc quyền.
              </p>
            </div>

            {/* Countdown Bar */}
            <div className="inline-flex flex-wrap items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide pr-2 border-r border-slate-200">
                <Clock className="w-4 h-4 text-red-600" />
                <span>Kết thúc sau</span>
              </div>

              <div className="flex items-center gap-1.5 font-mono">
                <div className="flex flex-col items-center justify-center bg-white min-w-[3rem] px-2 py-0.5 rounded-lg border border-slate-200 shadow-xs tabular-nums text-center">
                  <span className="text-sm sm:text-base font-black text-slate-900 leading-none tabular-nums">
                    {mounted ? formatNum(timeLeft.days) : "02"}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">ngày</span>
                </div>
                <span className="text-slate-400 font-bold">:</span>

                <div className="flex flex-col items-center justify-center bg-white min-w-[3rem] px-2 py-0.5 rounded-lg border border-slate-200 shadow-xs tabular-nums text-center">
                  <span className="text-sm sm:text-base font-black text-slate-900 leading-none tabular-nums">
                    {mounted ? formatNum(timeLeft.hours) : "14"}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">giờ</span>
                </div>
                <span className="text-slate-400 font-bold">:</span>

                <div className="flex flex-col items-center justify-center bg-white min-w-[3rem] px-2 py-0.5 rounded-lg border border-slate-200 shadow-xs tabular-nums text-center">
                  <span className="text-sm sm:text-base font-black text-slate-900 leading-none tabular-nums">
                    {mounted ? formatNum(timeLeft.minutes) : "38"}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">phút</span>
                </div>
                <span className="text-slate-400 font-bold">:</span>

                <div className="flex flex-col items-center justify-center bg-red-50 min-w-[3rem] px-2 py-0.5 rounded-lg border border-red-200 shadow-xs tabular-nums text-center">
                  <span className="text-sm sm:text-base font-black text-red-600 leading-none tabular-nums">
                    {mounted ? formatNum(timeLeft.seconds) : "52"}
                  </span>
                  <span className="text-[9px] font-bold text-red-500 uppercase mt-0.5">giây</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-5">
            <button
              onClick={() => scrollToSection("khuyen-mai-products")}
              className="h-10 px-5 inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide transition-colors shadow-sm cursor-pointer"
            >
              Xem ngay sản phẩm sale
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollToSection("kho-voucher")}
              className="h-10 px-4 inline-flex items-center gap-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-slate-500" />
              Kho voucher toàn sàn
            </button>
          </div>
        </div>

        <PromotionsPerkCards
          mounted={mounted}
          savedVouchers={savedVouchers}
          onSavePromo={handleSavePromo}
        />
      </div>
    </div>
  );
}
