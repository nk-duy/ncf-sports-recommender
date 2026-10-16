"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, Flame, Sparkles, ShoppingBag, Heart, Star, Check, Zap,
  Activity, Trophy, Compass, Dumbbell, Tent, Disc
} from "lucide-react";
import { notifications } from "@mantine/notifications";
import { useCartStore } from "@/shared/store/cartStore";
import { useWishlistStore } from "@/shared/store/wishlistStore";

interface SportProduct {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  category?: string[];
  product_type?: string;
  sport_type?: string;
  rating?: number;
  reviews_count?: number;
  discount_percent?: number;
  sizes?: string[];
  colors?: string[];
  stock?: number;
}

interface SportMeta {
  id: string;
  name: string;
  dbSportType: string;
  tag: string;
  slogan: string;
  description: string;
  bannerImage: string;
  colorGradient: string;
  accentColor: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const SPORTS_CONFIG: SportMeta[] = [
  {
    id: "pickleball",
    name: "Pickleball",
    dbSportType: "Pickleball",
    tag: "ĐANG THỊNH HÀNH",
    slogan: "Tốc Độ & Kiểm Soát Cầu Chuẩn Xác",
    description: "Bộ sưu tập vợt sợi carbon T700, bóng thi đấu USAPA và giày bám sân chuyên dụng cho bộ môn hot nhất hiện nay.",
    bannerImage: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=80",
    colorGradient: "from-amber-600 via-orange-600 to-red-600",
    accentColor: "text-amber-500",
    icon: Disc,
  },
  {
    id: "badminton",
    name: "Cầu Lông",
    dbSportType: "Cầu lông",
    tag: "SMASH UY LỰC",
    slogan: "Linh Hoạt Trên Từng Bước Di Chuyển",
    description: "Khám phá các dòng vợt công thủ toàn diện 3U/4U, cước trợ lực và giày đệm khí giảm chấn thương gối.",
    bannerImage: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
    colorGradient: "from-blue-600 via-indigo-600 to-cyan-600",
    accentColor: "text-blue-500",
    icon: Zap,
  },
  {
    id: "running",
    name: "Chạy Bộ",
    dbSportType: "Chạy bộ",
    tag: "BỨT TỐC TỐI ĐA",
    slogan: "Đệm Êm Vượt Trội, Chinh Phục Mọi Cung Đường",
    description: "Giày chạy bộ đệm carbon siêu nhẹ, trang phục Dry-fit thoáng khí và phụ kiện đai chạy bộ điện thoại tiện lợi.",
    bannerImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    colorGradient: "from-emerald-600 via-teal-600 to-cyan-600",
    accentColor: "text-emerald-500",
    icon: Activity,
  },
  {
    id: "football",
    name: "Bóng Đá",
    dbSportType: "Đá bóng",
    tag: "LÀM CHỦ TRẬN ĐẤU",
    slogan: "Cảm Giác Bóng Chuẩn Xác, Bám Sân Tối Đa",
    description: "Giày đinh TF sân cỏ nhân tạo, bóng thi đấu đạt chuẩn FIFA PRO và găng tay thủ môn dính bóng cao cấp.",
    bannerImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
    colorGradient: "from-red-600 via-rose-600 to-pink-600",
    accentColor: "text-rose-500",
    icon: Trophy,
  },
  {
    id: "outdoor",
    name: "Dã Ngoại",
    dbSportType: "Dã ngoại",
    tag: "KHÁM PHÁ THIÊN NHIÊN",
    slogan: "Bền Bỉ Trong Mọi Điều Kiện Thời Tiết",
    description: "Lều cắm trại chống thấm PU3000, balo leo núi công thái học, đèn pin dã ngoại và gậy trekking siêu bền.",
    bannerImage: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80",
    colorGradient: "from-yellow-600 via-amber-600 to-stone-700",
    accentColor: "text-amber-500",
    icon: Tent,
  },
  {
    id: "gym",
    name: "Gym & Fitness",
    dbSportType: "Đa dụng",
    tag: "XÂY DỰNG THỂ LỰC",
    slogan: "Tối Ưu Form Tập & Thấm Hút Mồ Hôi",
    description: "Bộ quần áo tập gym co giãn 4 chiều, găng tay nâng tạ trợ lực cổ tay và bình lắc thể thao 750ml.",
    bannerImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    colorGradient: "from-purple-600 via-violet-600 to-indigo-600",
    accentColor: "text-purple-500",
    icon: Dumbbell,
  },
];

export default function ShopByCategory() {
  const [activeSportIndex, setActiveSportIndex] = useState<number>(0);
  const [sportProductsCache, setSportProductsCache] = useState<Record<string, SportProduct[]>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentSport = SPORTS_CONFIG[activeSportIndex];

  // Fetch products for selected sport if not yet cached
  useEffect(() => {
    const fetchSportProducts = async () => {
      const sportKey = currentSport.dbSportType;
      if (sportProductsCache[sportKey]) {
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/products?sport_type=${encodeURIComponent(sportKey)}&limit=4`
        );
        if (res.ok) {
          const data = await res.json();
          setSportProductsCache((prev) => ({ ...prev, [sportKey]: data }));
        }
      } catch (err) {
        console.error("Lỗi tải sản phẩm theo môn:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSportProducts();
  }, [activeSportIndex, currentSport.dbSportType, sportProductsCache]);

  const displayedProducts = sportProductsCache[currentSport.dbSportType] || [];

  const handleQuickAdd = (e: React.MouseEvent, p: SportProduct) => {
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
      message: `${p.name} (${size}) đã được chọn.`,
      color: "teal",
      icon: <Check size={16} />,
      autoClose: 2500,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent, p: SportProduct) => {
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
      category: p.category && p.category.length > 0 ? p.category[0] : currentSport.name,
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

  return (
    <section className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pt-8 pb-14 bg-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-lg bg-blue-50 text-blue-600">
              <Trophy className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-blue-600">
              DANH MỤC THỂ THAO CHUYÊN SÂU
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900">
            KHÁM PHÁ THEO MÔN THỂ THAO
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Chọn bộ môn bạn yêu thích để trải nghiệm trang thiết bị, dụng cụ và trang phục thi đấu chính hãng được thiết kế tối ưu.
          </p>
        </div>

        {/* View all link */}
        <Link
          href={`/san-pham?sport_type=${encodeURIComponent(currentSport.dbSportType)}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider transition-colors group"
        >
          Xem tất cả đồ {currentSport.name}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Interactive Sports Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none select-none">
        {SPORTS_CONFIG.map((sport, idx) => {
          const isSelected = idx === activeSportIndex;
          const SportIcon = sport.icon;
          return (
            <button
              key={sport.id}
              onClick={() => setActiveSportIndex(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-[1.02]"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <SportIcon className={`w-4 h-4 ${isSelected ? "text-cyan-400" : "text-slate-500"}`} />
              <span>{sport.name}</span>
              {isSelected && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Split Content: Left Banner Spotlight + Right Live Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Sport Spotlight Hero Card (5 Cols) */}
        <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-xl min-h-[360px] lg:min-h-[460px] flex flex-col justify-end p-6 sm:p-8 group">
          {/* Background Image with Zoom */}
          <img
            src={currentSport.bannerImage}
            alt={currentSport.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Top Pill */}
          <div className="absolute top-6 left-6 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {currentSport.tag}
            </span>
          </div>

          {/* Bottom Info Content */}
          <div className="relative z-10 text-white space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
                <currentSport.icon className="w-5 h-5 text-amber-300" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                {currentSport.name}
              </h3>
            </div>

            <p className="text-amber-300 font-bold text-sm sm:text-base leading-snug">
              {currentSport.slogan}
            </p>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3 font-normal opacity-90">
              {currentSport.description}
            </p>

            <div className="pt-2">
              <Link
                href={`/san-pham?sport_type=${encodeURIComponent(currentSport.dbSportType)}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-black uppercase tracking-wider shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                Khám phá bộ sưu tập {currentSport.name}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Live Products Grid (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 h-full">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3 animate-pulse"
                >
                  <div className="w-full aspect-square bg-slate-200 rounded-xl" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              ))
            ) : displayedProducts.length === 0 ? (
              <div className="col-span-2 flex flex-col items-center justify-center p-12 bg-slate-50 rounded-2xl text-slate-400">
                <Compass className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm">Đang cập nhật thêm sản phẩm môn {currentSport.name}</p>
              </div>
            ) : (
              displayedProducts.map((p) => {
                const pid = p.product_id;
                const discount = p.discount_percent || 0;
                const salePrice = discount > 0 ? p.price * (1 - discount / 100) : p.price;
                const wishlisted = mounted && isWishlisted(pid);

                return (
                  <div
                    key={pid}
                    className="group bg-white rounded-2xl border border-slate-200/90 hover:border-slate-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative"
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

                      {/* Discount Tag */}
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase shadow-sm">
                          -{discount}%
                        </span>
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

                    {/* Content */}
                    <div className="p-3.5 flex-1 flex flex-col">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 truncate">
                        {p.product_type || "Chính hãng"}
                      </div>

                      <Link
                        href={`/san-pham/${pid}`}
                        className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors mb-2"
                      >
                        {p.name}
                      </Link>

                      {/* Price & Quick Add */}
                      <div className="mt-auto pt-2 flex items-center justify-between gap-1 border-t border-slate-100">
                        <div>
                          <span className="block text-sm sm:text-base font-black text-slate-900 font-mono leading-none">
                            {salePrice.toLocaleString("vi-VN")}đ
                          </span>
                          {discount > 0 && (
                            <span className="block text-[11px] text-slate-400 line-through mt-0.5">
                              {p.price.toLocaleString("vi-VN")}đ
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleQuickAdd(e, p)}
                          className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer shrink-0"
                          title="Thêm nhanh vào giỏ"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
