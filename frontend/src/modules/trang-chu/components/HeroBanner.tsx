"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ChevronLeft, ChevronRight, Flame, Ticket, Sparkles, 
  Truck, ArrowRight, ShieldCheck, Zap, Award
} from "lucide-react";

interface BannerItem {
  _id: string;
  title: string;
  image_url: string;
  link?: string;
  subtitle?: string;
  badge?: string;
}

const DEFAULT_SLIDES: BannerItem[] = [
  {
    _id: "slide-1",
    title: "MEGA SPORTS SALE",
    subtitle: "Giảm đến 50% trang phục & thiết bị thể thao đỉnh cao",
    badge: "ĐẠI TIỆC MUA SẮM LỚN NHẤT",
    image_url: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=1920&auto=format&fit=crop&q=80",
    link: "/khuyen-mai",
  },
  {
    _id: "slide-2",
    title: "BỘ SƯU TẬP PICKLEBALL 2026",
    subtitle: "Vợt carbon T700 siêu nhẹ & bóng đạt chuẩn USAPA",
    badge: "XU HƯỚNG THỂ THAO MỚI",
    image_url: "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=1920&auto=format&fit=crop&q=80",
    link: "/san-pham?sport_type=Pickleball",
  },
  {
    _id: "slide-3",
    title: "PRO RUNNING SPEED",
    subtitle: "Đệm khí đàn hồi cao, bứt phá mọi kỷ lục cá nhân",
    badge: "BỘ SƯU TẬP CHẠY BỘ",
    image_url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&auto=format&fit=crop&q=80",
    link: "/san-pham?sport_type=Chạy bộ",
  },
];

const QUICK_ACTIONS = [
  {
    id: "sale",
    title: "Siêu Sale 50%",
    sub: "Deal chớp nhoáng",
    href: "/khuyen-mai",
    icon: Flame,
    colorClass: "text-red-600 bg-red-50 group-hover:bg-red-600 group-hover:text-white",
    badge: "HOT",
  },
  {
    id: "voucher",
    title: "Kho Voucher",
    sub: "Mã giảm đến 150k",
    href: "/khuyen-mai#kho-voucher",
    icon: Ticket,
    colorClass: "text-amber-600 bg-amber-50 group-hover:bg-amber-600 group-hover:text-white",
  },
  {
    id: "freeship",
    title: "Freeship 0Đ",
    sub: "Toàn quốc mọi đơn",
    href: "/khuyen-mai",
    icon: Truck,
    colorClass: "text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white",
  },
  {
    id: "new",
    title: "Hàng Mới Về",
    sub: "Bộ sưu tập 2026",
    href: "/san-pham?sort_by=created_desc",
    icon: Sparkles,
    colorClass: "text-purple-600 bg-purple-50 group-hover:bg-purple-600 group-hover:text-white",
  },
  {
    id: "authentic",
    title: "100% Chính Hãng",
    sub: "Bồi hoàn 200%",
    href: "/gioi-thieu",
    icon: ShieldCheck,
    colorClass: "text-emerald-600 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white",
  },
];

export default function HeroBanner() {
  const [banners, setBanners] = useState<BannerItem[]>(DEFAULT_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/banners?active_only=true")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          // Merge uploaded banners with default high-res slides for premium appearance
          const enriched = data.map((b: any, idx: number) => ({
            ...b,
            badge: b.title.includes("SALE") ? "⚡ SIÊU SALE BÙNG NỔ" : "✨ KHÁM PHÁ NGAY",
            subtitle: b.subtitle || "Trang thiết bị và thời trang thể thao cao cấp",
            link: b.link && b.link !== "#" ? b.link : "/san-pham",
          }));
          setBanners(enriched);
        }
      })
      .catch((err) => console.error("Error fetching banners:", err));
  }, []);

  // Auto-play slider
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const currentBanner = banners[currentIndex] || banners[0];

  return (
    <section className="relative w-full bg-slate-900 pb-6">
      {/* 1. Main Slider Section */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[1920/600] max-h-[580px] overflow-hidden group">
        {/* Slides Track */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={banner._id || index} className="w-full h-full flex-shrink-0 relative">
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-full object-cover object-center"
              />
              {/* Gradient Scrim Overlay for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
            </div>
          ))}
        </div>

        {/* 2. Dynamic Text & CTA Content Layer */}
        <div className="absolute inset-0 pointer-events-none flex items-center">
          <div className="w-full mx-auto px-6 sm:px-12 lg:px-20">
            <div className="max-w-2xl text-white space-y-4 pointer-events-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider shadow-lg">
                <Zap className="w-3.5 h-3.5 fill-white" />
                {currentBanner.badge || "⚡ KHÁM PHÁ NGAY"}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05] drop-shadow-md">
                {currentBanner.title}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-lg text-slate-200 line-clamp-2 max-w-xl font-medium drop-shadow">
                {currentBanner.subtitle || "Khám phá ngay hàng trăm sản phẩm thể thao chất lượng cao với ưu đãi tốt nhất."}
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={currentBanner.link || "/san-pham"}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-red-600/30 transform hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Flame className="w-4 h-4 fill-white" />
                  Khám Phá Ngay
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="/khuyen-mai"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md font-bold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Ticket className="w-4 h-4 text-amber-300" />
                  Săn Voucher 500K
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Slider Controls (Arrows) */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>

            {/* Dots Pagination */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    index === currentIndex
                      ? "bg-red-500 w-8 shadow-md"
                      : "bg-white/40 hover:bg-white/80 w-2"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 4. Quick Access Utility Bar (Nổi bật & Tiện ích trong 1 chạm) */}
      <div className="relative -mt-6 sm:-mt-8 z-30 w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100">
          {QUICK_ACTIONS.map((action) => {
            const ActionIcon = action.icon;
            return (
              <Link
                key={action.id}
                href={action.href}
                className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${action.colorClass}`}
                >
                  <ActionIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-slate-900 text-xs sm:text-sm tracking-tight truncate group-hover:text-red-600 transition-colors">
                      {action.title}
                    </span>
                    {action.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-red-600 text-white">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    {action.sub}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
