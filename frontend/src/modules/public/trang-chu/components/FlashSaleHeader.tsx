"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Flame } from "lucide-react";

interface FlashSaleHeaderProps {
  mounted: boolean;
  timeLeft: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  onScroll: (direction: "left" | "right") => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function FlashSaleHeader({
  mounted,
  timeLeft,
  onScroll,
}: FlashSaleHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-4 border-b border-red-100">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-lg shadow-red-600/25">
          <Flame className="w-5 h-5 fill-yellow-300 text-yellow-300 animate-bounce" />
          <span className="font-black text-base sm:text-lg uppercase tracking-wider">
            FLASH SALE CHỚP NHOÁNG
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-inner">
          <Clock className="w-3.5 h-3.5 text-amber-400 mr-1" />
          <div className="bg-red-600 text-white font-mono font-black text-sm px-2 py-0.5 rounded">
            {mounted ? pad(timeLeft.hours) : "08"}
          </div>
          <span className="text-red-500 font-bold">:</span>
          <div className="bg-red-600 text-white font-mono font-black text-sm px-2 py-0.5 rounded">
            {mounted ? pad(timeLeft.minutes) : "42"}
          </div>
          <span className="text-red-500 font-bold">:</span>
          <div className="bg-red-600 text-white font-mono font-black text-sm px-2 py-0.5 rounded">
            {mounted ? pad(timeLeft.seconds) : "19"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onScroll("left")}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-red-400 hover:bg-red-50 text-slate-700 hover:text-red-600 flex items-center justify-center transition-all shadow-sm cursor-pointer"
            aria-label="Trang trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onScroll("right")}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-red-400 hover:bg-red-50 text-slate-700 hover:text-red-600 flex items-center justify-center transition-all shadow-sm cursor-pointer"
            aria-label="Trang sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <Link
          href="/khuyen-mai"
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-black text-red-600 hover:text-red-700 uppercase tracking-wider transition-colors ml-2 group"
        >
          Xem tất cả deal
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
