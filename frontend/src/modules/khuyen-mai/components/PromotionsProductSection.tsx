"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Flame, Filter, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, 
  RotateCcw, Sparkles, Heart, ShoppingBag, Check, Zap, Tag
} from "lucide-react";
import { useWishlistStore } from "@/shared/store/wishlistStore";
import { notifications } from "@mantine/notifications";

interface ProductItem {
  id?: string;
  product_id?: string;
  name: string;
  price: number;
  image_url: string;
  product_type?: string;
  sport_type?: string;
  category?: string[];
  brand?: string;
  rating?: number;
  reviews_count?: number;
  discount_percent?: number;
  sold?: number;
  stock?: number;
  sizes?: string[];
  colors?: string[];
}

const SPORTS = [
  { label: "Tất cả môn", value: "" },
  { label: "Pickleball", value: "Pickleball" },
  { label: "Cầu lông", value: "Cầu lông" },
  { label: "Bóng đá", value: "Đá bóng" },
  { label: "Chạy bộ", value: "Chạy bộ" },
  { label: "Bóng chuyền", value: "Bóng chuyền" },
  { label: "Dã ngoại", value: "Dã ngoại" },
  { label: "Gym & Đa dụng", value: "Đa dụng" },
];

const PRODUCT_TYPES = [
  { label: "Tất cả", value: "" },
  { label: "Quần áo", value: "Quần áo" },
  { label: "Giày dép", value: "Giày dép" },
  { label: "Thiết bị", value: "Thiết bị" },
  { label: "Phụ kiện", value: "Phụ kiện" },
];

const PRICE_RANGES = [
  { label: "Tất cả mức giá", min: null, max: null },
  { label: "Dưới 300.000đ", min: 0, max: 300000 },
  { label: "300.000đ - 700.000đ", min: 300000, max: 700000 },
  { label: "700.000đ - 1.500.000đ", min: 700000, max: 1500000 },
  { label: "Trên 1.500.000đ", min: 1500000, max: null },
];

const COLOR_PALETTE = [
  { name: "Đen", hex: "#111827" },
  { name: "Trắng", hex: "#FFFFFF" },
  { name: "Xanh Navy", hex: "#1E3A8A" },
  { name: "Xanh Dương", hex: "#2563EB" },
  { name: "Đỏ", hex: "#DC2626" },
  { name: "Xám", hex: "#6B7280" },
  { name: "Vàng", hex: "#EAB308" },
  { name: "Cam", hex: "#F97316" },
  { name: "Xanh Lá", hex: "#16A34A" },
  { name: "Hồng", hex: "#EC4899" },
];

export default function PromotionsProductSection() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter States
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPriceIdx, setSelectedPriceIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [minDiscount, setMinDiscount] = useState<number>(0); // 0, 20, 30, 50
  const [sortBy, setSortBy] = useState<string>("discount_desc");
  const [page, setPage] = useState<number>(1);

  // Wishlist
  const { toggleItem, isWishlisted } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute dynamic sizes based on product type
  const availableSizes = React.useMemo(() => {
    if (selectedType === "Giày dép") {
      return ["38", "39", "40", "41", "42", "43", "44", "45"];
    }
    if (selectedType === "Quần áo") {
      return ["S", "M", "L", "XL", "2XL", "3XL"];
    }
    if (selectedType === "Thiết bị") {
      return ["3U", "4U", "Size 4", "Size 5", "Tiêu chuẩn"];
    }
    if (selectedType === "Phụ kiện") {
      return ["Freesize", "S/M", "L/XL", "Tiêu chuẩn"];
    }
    return ["S", "M", "L", "XL", "40", "41", "42", "Tiêu chuẩn", "Freesize"];
  }, [selectedType]);

  // Fetch products
  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const skip = (page - 1) * ITEMS_PER_PAGE;
        let url = `http://localhost:8000/api/v1/products?is_promotion=true&skip=${skip}&limit=${ITEMS_PER_PAGE}`;

        if (selectedSport) url += `&sport_type=${encodeURIComponent(selectedSport)}`;
        if (selectedType) url += `&product_type=${encodeURIComponent(selectedType)}`;
        if (selectedSize) url += `&sizes=${encodeURIComponent(selectedSize)}`;
        if (selectedColor) url += `&colors=${encodeURIComponent(selectedColor)}`;
        if (sortBy) url += `&sort_by=${encodeURIComponent(sortBy)}`;

        const priceChoice = PRICE_RANGES[selectedPriceIdx];
        if (priceChoice.min !== null) url += `&min_price=${priceChoice.min}`;
        if (priceChoice.max !== null) url += `&max_price=${priceChoice.max}`;

        const res = await fetch(url);
        if (res.ok) {
          const totalHeader = res.headers.get("x-total-count") || res.headers.get("X-Total-Count");
          let data: ProductItem[] = await res.json();

          // Client-side discount filtering if specified
          if (minDiscount > 0) {
            data = data.filter((p) => (p.discount_percent || 0) >= minDiscount);
          }

          setProducts(data);
          setTotalCount(totalHeader ? parseInt(totalHeader, 10) : data.length);
        }
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm khuyến mãi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, [page, selectedSport, selectedType, selectedPriceIdx, selectedSize, selectedColor, minDiscount, sortBy]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleResetFilters = () => {
    setSelectedSport("");
    setSelectedType("");
    setSelectedPriceIdx(0);
    setSelectedSize("");
    setSelectedColor("");
    setMinDiscount(0);
    setSortBy("discount_desc");
    setPage(1);
  };

  const handleToggleWishlist = (e: React.MouseEvent, p: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    const pid = String(p.product_id || p.id || "");
    if (!pid) return;

    const discountPercent = p.discount_percent || 0;
    const finalPrice = discountPercent > 0 ? p.price * (1 - discountPercent / 100) : p.price;

    const added = toggleItem({
      product_id: pid,
      name: p.name,
      price: finalPrice,
      image_url: p.image_url,
      category: p.category && p.category.length > 0 ? p.category[0] : "Thể Thao",
      original_price: discountPercent > 0 ? `${p.price.toLocaleString("vi-VN")}đ` : undefined,
      discount_percent: discountPercent,
      discount_label: discountPercent > 0 ? `-${discountPercent}%` : undefined,
    });

    notifications.show({
      message: added ? "Đã thêm vào danh sách yêu thích" : "Đã xóa khỏi danh sách yêu thích",
      color: added ? "red" : "gray",
      autoClose: 2000,
    });
  };

  return (
    <section id="khuyen-mai-products" ref={sectionRef} className="scroll-mt-20 mb-16">
      {/* Title & Quick Filter Badges */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded-lg bg-red-600 text-white shadow-md shadow-red-500/30">
              <Flame className="w-5 h-5 fill-white" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-red-600">
              GIẢM GIÁ TỰ ĐỘNG
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
            DANH SÁCH DEAL THỂ THAO ĐANG GIẢM GIÁ
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Hiển thị <span className="font-bold text-slate-900">{products.length}</span> trong số{" "}
            <span className="font-bold text-red-600">{totalCount}</span> sản phẩm khuyến mãi hôm nay (Trang {page}/{totalPages})
          </p>
        </div>

        {/* Quick Discount Range Filter */}
        <div className="flex items-center flex-wrap gap-2">
          {[
            { label: "Tất cả deal", value: 0 },
            { label: "Giảm > 20%", value: 20 },
            { label: "Giảm > 30%", value: 30 },
            { label: "Siêu Sale > 45%", value: 45 },
          ].map((d) => (
            <button
              key={d.value}
              onClick={() => {
                setMinDiscount(d.value);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                minDiscount === d.value
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-red-400 hover:text-red-600"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Left Sidebar + Right Products Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Filter Sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm sticky top-24 space-y-6">
            {/* Header of Sidebar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-700" />
                <h3 className="font-black text-sm uppercase tracking-wide text-slate-900">
                  Bộ Lọc Khuyến Mãi
                </h3>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer transition-colors"
                title="Xóa tất cả bộ lọc"
              >
                <RotateCcw className="w-3 h-3" />
                Xóa lọc
              </button>
            </div>

            {/* Sport Type */}
            <div>
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5">
                Môn Thể Thao
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SPORTS.map((sport) => (
                  <button
                    key={sport.value}
                    onClick={() => {
                      setSelectedSport(sport.value);
                      setPage(1);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedSport === sport.value
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                    }`}
                  >
                    {sport.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Type */}
            <div>
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5">
                Loại Sản Phẩm
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {PRODUCT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setSelectedType(type.value);
                      setSelectedSize("");
                      setPage(1);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center transition-all cursor-pointer ${
                      selectedType === type.value
                        ? "bg-red-600 text-white shadow-sm"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5">
                Khoảng Giá
              </label>
              <div className="space-y-1.5">
                {PRICE_RANGES.map((r, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer select-none group"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={selectedPriceIdx === idx}
                      onChange={() => {
                        setSelectedPriceIdx(idx);
                        setPage(1);
                      }}
                      className="w-3.5 h-3.5 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <span className={selectedPriceIdx === idx ? "font-bold text-red-600" : ""}>
                      {r.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Kích Cỡ ({selectedType || "Thể Thao"})
                </label>
                {selectedSize && (
                  <button
                    onClick={() => {
                      setSelectedSize("");
                      setPage(1);
                    }}
                    className="text-[10px] text-red-500 hover:underline cursor-pointer"
                  >
                    Bỏ chọn
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(selectedSize === size ? "" : size);
                      setPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      selectedSize === size
                        ? "bg-red-600 border-red-600 text-white shadow-sm"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Màu Sắc
                </label>
                {selectedColor && (
                  <button
                    onClick={() => {
                      setSelectedColor("");
                      setPage(1);
                    }}
                    className="text-[10px] text-red-500 hover:underline cursor-pointer"
                  >
                    Bỏ chọn
                  </button>
                )}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {COLOR_PALETTE.map((c) => {
                  const isChecked = selectedColor === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => {
                        setSelectedColor(isChecked ? "" : c.name);
                        setPage(1);
                      }}
                      title={c.name}
                      className={`group relative w-full aspect-square rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                        isChecked
                          ? "border-red-600 ring-2 ring-red-400/50 scale-105"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {isChecked && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            c.hex === "#FFFFFF" ? "text-slate-900" : "text-white"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Products Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Sort Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <span className="text-xs font-bold text-slate-500">
              Sắp xếp theo ưu tiên:
            </span>

            <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
              {[
                { id: "discount_desc", label: "🔥 Giảm nhiều nhất" },
                { id: "sold_desc", label: "⚡ Bán chạy nhất" },
                { id: "price_asc", label: "Giá thấp đến cao" },
                { id: "price_desc", label: "Giá cao đến thấp" },
                { id: "rating_desc", label: "Đánh giá cao" },
              ].map((sort) => (
                <button
                  key={sort.id}
                  onClick={() => {
                    setSortBy(sort.id);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sortBy === sort.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse">
                  <div className="w-full aspect-square bg-slate-100 rounded-xl" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-8 bg-slate-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
                <Tag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase">
                Không tìm thấy deal khuyến mãi phù hợp
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Hãy thử điều chỉnh lại bộ lọc thể thao, môn hoặc mức giá để khám phá hàng trăm sản phẩm hấp dẫn khác!
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p, index) => {
                const pid = String(p.product_id || p.id || "");
                const discount = p.discount_percent || 0;
                const salePrice = discount > 0 ? p.price * (1 - discount / 100) : p.price;
                const sold = p.sold || Math.floor((index + 1) * 12 + 10);
                const stock = p.stock || 120;
                const soldPercent = Math.min(Math.round((sold / stock) * 100), 100);
                const wishlisted = mounted && isWishlisted(pid);

                return (
                  <div
                    key={pid || index}
                    className="group bg-white rounded-2xl border border-slate-200 hover:border-red-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative"
                  >
                    {/* Image Area */}
                    <Link href={`/san-pham/${pid}`} className="relative block w-full aspect-square overflow-hidden bg-slate-50">
                      <img
                        src={p.image_url || "https://via.placeholder.com/400?text=KADY+Sport"}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Hot Sale Badge */}
                      {discount > 0 && (
                        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-600 to-amber-500 text-white text-xs font-black tracking-wider uppercase shadow-md shadow-red-600/40">
                            <Flame className="w-3 h-3 fill-white" />
                            -{discount}%
                          </span>
                        </div>
                      )}

                      {/* Wishlist Button */}
                      {mounted && (
                        <button
                          onClick={(e) => handleToggleWishlist(e, p)}
                          aria-label="Thêm vào yêu thích"
                          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                            wishlisted
                              ? "bg-red-500 text-white scale-110"
                              : "bg-white/90 text-slate-400 hover:text-red-500 hover:bg-white"
                          }`}
                        >
                          <Heart size={15} className={wishlisted ? "fill-white" : ""} />
                        </button>
                      )}
                    </Link>

                    {/* Content Area */}
                    <div className="p-4 flex-1 flex flex-col">
                      {/* Category & Sport */}
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 truncate">
                        <span>{p.sport_type || "Thể Thao"}</span>
                        <span>•</span>
                        <span>{p.product_type || "Chính hãng"}</span>
                      </div>

                      {/* Product Name */}
                      <Link
                        href={`/san-pham/${pid}`}
                        className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-red-600 transition-colors mb-3"
                      >
                        {p.name}
                      </Link>

                      {/* Pricing */}
                      <div className="mt-auto">
                        <div className="flex items-baseline gap-2 mb-2.5">
                          <span className="text-base sm:text-lg font-black text-red-600 font-mono">
                            {salePrice.toLocaleString("vi-VN")}đ
                          </span>
                          {discount > 0 && (
                            <span className="text-xs text-slate-400 line-through font-medium">
                              {p.price.toLocaleString("vi-VN")}đ
                            </span>
                          )}
                        </div>

                        {/* Sold Progress Heat Bar */}
                        <div className="space-y-1 mb-3.5">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-slate-600 flex items-center gap-1">
                              <Flame className="w-3 h-3 text-red-500 fill-red-500" />
                              Đã bán {sold}
                            </span>
                            {soldPercent >= 75 && (
                              <span className="text-red-600 text-[10px] font-black uppercase">
                                Sắp cháy
                              </span>
                            )}
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-600"
                              style={{ width: `${soldPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Button Action */}
                        <Link
                          href={`/san-pham/${pid}`}
                          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-200 shadow-sm"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Săn Deal Ngay
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Real Pagination: Exactly 8 items per page */}
          {!loading && totalPages > 1 && (
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
              <span className="text-xs text-slate-500 font-medium">
                Hiển thị trang <span className="font-bold text-slate-900">{page}</span> /{" "}
                <span className="font-bold text-slate-900">{totalPages}</span> ({totalCount} deal khuyến mãi)
              </span>

              <div className="flex items-center gap-1.5">
                {/* Prev Button */}
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
                    page <= 1
                      ? "border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50"
                      : "border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 cursor-pointer"
                  }`}
                  aria-label="Trang trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 7) return true;
                    return p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                  })
                  .map((p, idx, arr) => {
                    const prevP = arr[idx - 1];
                    const showEllipsis = prevP && p - prevP > 1;

                    return (
                      <React.Fragment key={p}>
                        {showEllipsis && (
                          <span className="w-8 text-center text-xs text-slate-400 select-none">
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => handlePageChange(p)}
                          className={`w-9 h-9 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            page === p
                              ? "bg-red-600 text-white shadow-md shadow-red-600/30 scale-105"
                              : "border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
                    page >= totalPages
                      ? "border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50"
                      : "border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 cursor-pointer"
                  }`}
                  aria-label="Trang sau"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
