"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Flame, ChevronLeft, ChevronRight, Zap, ShoppingBag, 
  Heart, Check, ArrowRight, Clock, Sparkles
} from "lucide-react";
import { notifications } from "@mantine/notifications";
import { useCartStore } from "@/shared/store/cartStore";
import { useWishlistStore } from "@/shared/store/wishlistStore";

interface Product {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  discount_percent?: number;
  category?: string[];
  product_type?: string;
  sport_type?: string;
  sold?: number;
  stock?: number;
  sizes?: string[];
  colors?: string[];
}

export default function FlashSaleSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();

  // Real-time flash sale countdown: End at 24h of today or +8 hours
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    setMounted(true);

    // Dynamic timer
    let targetStr = localStorage.getItem("kadyFlashSaleEnd");
    let target = targetStr ? parseInt(targetStr) : 0;
    if (!target || target < Date.now()) {
      target = Date.now() + 8 * 3600 * 1000 + 42 * 60 * 1000 + 19 * 1000;
      localStorage.setItem("kadyFlashSaleEnd", target.toString());
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        target = Date.now() + 12 * 3600 * 1000;
        localStorage.setItem("kadyFlashSaleEnd", target.toString());
      } else {
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/products/?is_promotion=true&sort_by=discount_desc&limit=12")
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProducts(data);
      })
      .catch((err) => console.error("Lỗi tải flash sale:", err))
      .finally(() => setLoading(false));
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, p: Product) => {
    e.preventDefault();
    e.stopPropagation();

    const discount = p.discount_percent || 0;
    const finalPrice = discount > 0 ? p.price * (1 - discount / 100) : p.price;
    const size = p.sizes && p.sizes.length > 0 ? p.sizes[0] : "Tiêu chuẩn";
    const color = p.colors && p.colors.length > 0 ? p.colors[0] : "";

    addItem({
      product_id: p.product_id,
      name: p.name,
      price: finalPrice,
      original_price: discount > 0 ? p.price : undefined,
      image_url: p.image_url,
      quantity: 1,
      size,
      color,
      stock: p.stock || 100,
    });

    notifications.show({
      title: "Đã thêm vào giỏ hàng!",
      message: `${p.name} (-${discount}%) đã được chọn.`,
      color: "teal",
      icon: <Check size={16} />,
      autoClose: 2500,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent, p: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const pid = p.product_id;
    if (!pid) return;

    const discount = p.discount_percent || 0;
    const finalPrice = discount > 0 ? p.price * (1 - discount / 100) : p.price;

    const added = toggleItem({
      product_id: pid,
      name: p.name,
      price: finalPrice,
      image_url: p.image_url,
      category: p.category && p.category.length > 0 ? p.category[0] : "Thể Thao",
      original_price: discount > 0 ? `${p.price.toLocaleString("vi-VN")}đ` : undefined,
      discount_percent: discount,
      discount_label: discount > 0 ? `-${discount}%` : undefined,
    });

    notifications.show({
      message: added ? "Đã lưu vào danh sách yêu thích" : "Đã xóa khỏi yêu thích",
      color: added ? "red" : "gray",
      autoClose: 2000,
    });
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  if (!loading && products.length === 0) return null;

  return (
    <section className="w-full bg-gradient-to-b from-red-50/40 via-white to-white py-12 border-t border-red-100/60">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Flash Sale Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-4 border-b border-red-100">
          <div className="flex flex-wrap items-center gap-4">
            {/* Title Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-lg shadow-red-600/25">
              <Flame className="w-5 h-5 fill-yellow-300 text-yellow-300 animate-bounce" />
              <span className="font-black text-base sm:text-lg uppercase tracking-wider">
                FLASH SALE CHỚP NHOÁNG
              </span>
            </div>

            {/* Live Countdown Timer */}
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

          {/* Carousel Arrows + View All Link */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scroll("left")}
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-red-400 hover:bg-red-50 text-slate-700 hover:text-red-600 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                aria-label="Trang trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("right")}
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

        {/* Carousel Container */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 animate-pulse">
                <div className="w-full aspect-square bg-slate-100 rounded-xl" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-none scroll-smooth select-none"
          >
            {products.map((p, index) => {
              const pid = p.product_id;
              const discount = p.discount_percent || 0;
              const salePrice = discount > 0 ? p.price * (1 - discount / 100) : p.price;
              const sold = p.sold || (index + 1) * 14 + 8;
              const stock = p.stock || 100;
              const soldPercent = Math.min(Math.round((sold / stock) * 100), 100);
              const wishlisted = mounted && isWishlisted(pid);

              return (
                <div
                  key={pid}
                  className="w-[200px] sm:w-[220px] md:w-[240px] shrink-0 group bg-white rounded-2xl border border-slate-200 hover:border-red-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/san-pham/${pid}`}
                    className="relative block w-full aspect-square overflow-hidden bg-slate-50"
                  >
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Sale Badge */}
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-600 to-amber-500 text-white text-[11px] font-black tracking-wider uppercase shadow-md shadow-red-600/30">
                        <Flame className="w-3 h-3 fill-white" />
                        -{discount}%
                      </div>
                    )}

                    {/* Wishlist */}
                    {mounted && (
                      <button
                        onClick={(e) => handleToggleWishlist(e, p)}
                        aria-label="Thêm vào yêu thích"
                        className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-md ${
                          wishlisted
                            ? "bg-red-500 text-white scale-110"
                            : "bg-white/90 text-slate-400 hover:text-red-500"
                        }`}
                      >
                        <Heart size={13} className={wishlisted ? "fill-white" : ""} />
                      </button>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="p-3.5 flex-1 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 truncate">
                      {p.sport_type || "Thể Thao"}
                    </span>

                    <Link
                      href={`/san-pham/${pid}`}
                      className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-red-600 transition-colors mb-2.5"
                    >
                      {p.name}
                    </Link>

                    {/* Price */}
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="text-base font-black text-red-600 font-mono">
                          {salePrice.toLocaleString("vi-VN")}đ
                        </span>
                        {discount > 0 && (
                          <span className="text-[11px] text-slate-400 line-through">
                            {p.price.toLocaleString("vi-VN")}đ
                          </span>
                        )}
                      </div>

                      {/* Heat Bar */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-600 flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                            Đã bán {sold}
                          </span>
                          {soldPercent >= 70 && (
                            <span className="text-red-600 font-black">SẮP HẾT</span>
                          )}
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-600"
                            style={{ width: `${soldPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Quick Add */}
                      <button
                        onClick={(e) => handleQuickAdd(e, p)}
                        className="w-full py-2 rounded-xl bg-slate-900 hover:bg-red-600 text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        Săn Deal
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
