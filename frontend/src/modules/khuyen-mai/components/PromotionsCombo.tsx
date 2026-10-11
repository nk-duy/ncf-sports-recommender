"use client";

import React, { useState } from "react";
import { Package, Sparkles, Check, ArrowRight, Gift, Flame, ShieldCheck } from "lucide-react";
import { notifications } from "@mantine/notifications";

export default function PromotionsCombo() {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("COMBOMAX");
    setCopied(true);
    notifications.show({
      title: "Đã lưu mã combo: COMBOMAX",
      message: "Giảm ngay 120.000đ khi mua theo set combo thể thao từ 600.000đ!",
      color: "teal",
      icon: <Check size={16} />,
      autoClose: 2500,
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const combos = [
    {
      title: "COMBO PICKLEBALL PRO",
      subtitle: "Vợt Pickleball Carbon + 4 Quả Bóng Thi Đấu",
      gift: "Tặng 02 Băng Quấn Cán Cao Cấp",
      oldPrice: "1.450.000đ",
      comboPrice: "990.000đ",
      save: "Tiết kiệm 460k",
      badge: "HOT NHẤT",
      bgGradient: "from-amber-500/10 via-red-500/5 to-transparent",
      borderColor: "hover:border-amber-400",
      image: "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=500&auto=format&fit=crop&q=80",
    },
    {
      title: "COMBO CHẠY BỘ ĐỈNH CAO",
      subtitle: "Giày Chạy Bộ Thoáng Khí + 3 Đôi Vớ Thể Thao",
      gift: "Tặng 01 Bình Nước Kady 750ml",
      oldPrice: "1.150.000đ",
      comboPrice: "790.000đ",
      save: "Tiết kiệm 360k",
      badge: "BÁN CHẠY",
      bgGradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
      borderColor: "hover:border-blue-400",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80",
    },
    {
      title: "COMBO GYM & TẬP LUYỆN",
      subtitle: "Set Đồ Tập Dry-fit Thoáng Mồ Hôi + Dây Kháng Lực",
      gift: "Tặng Túi Rút Đựng Đồ Tập",
      oldPrice: "690.000đ",
      comboPrice: "450.000đ",
      save: "Tiết kiệm 240k",
      badge: "GIÁ SỐC",
      bgGradient: "from-purple-500/10 via-pink-500/5 to-transparent",
      borderColor: "hover:border-purple-400",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section className="mb-14">
      {/* Banner Callout */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-6 sm:p-10 shadow-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm text-xs font-black uppercase tracking-wider text-amber-200 mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            GÓI COMBO TIẾT KIỆM ĐẾN 40%
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-tight">
            MUA COMBO THỂ THAO - NHẬN NGAY QUÀ TẶNG KHỦNG
          </h2>
          <p className="text-white/90 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
            Tối ưu chi phí khi mua trọn bộ dụng cụ tập luyện. Tặng thêm bình nước thể thao hoặc túi rút cho mỗi đơn hàng combo!
          </p>
        </div>

        {/* Voucher Button */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-black/30 border-2 border-dashed border-white/40 text-center backdrop-blur-sm">
            <span className="block text-[10px] font-bold text-amber-200 uppercase tracking-widest">
              Mã voucher combo
            </span>
            <span className="block text-xl font-black font-mono tracking-wider">
              COMBOMAX
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-amber-50 text-red-600 font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            {copied ? "ĐÃ LƯU MÃ ✓" : "LƯU MÃ NGAY"}
          </button>
        </div>
      </div>

      {/* 3 Combo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {combos.map((c, idx) => (
          <div
            key={idx}
            className={`group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden ${c.borderColor}`}
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-600">
                {c.badge}
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700">
                {c.save}
              </span>
            </div>

            {/* Thumbnail */}
            <div className="w-full h-44 rounded-xl overflow-hidden mb-4 bg-slate-100">
              <img
                src={c.image}
                alt={c.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Info */}
            <h3 className="font-black text-slate-900 text-base uppercase tracking-tight mb-1">
              {c.title}
            </h3>
            <p className="text-xs text-slate-600 mb-2">
              {c.subtitle}
            </p>

            {/* Free Gift Strip */}
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center gap-2 mb-4 text-xs font-bold text-amber-800">
              <Gift className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{c.gift}</span>
            </div>

            {/* Price & CTA */}
            <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div>
                <span className="block text-lg font-black text-red-600 font-mono leading-none">
                  {c.comboPrice}
                </span>
                <span className="block text-xs text-slate-400 line-through mt-0.5 font-medium">
                  {c.oldPrice}
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                Nhận Deal
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
