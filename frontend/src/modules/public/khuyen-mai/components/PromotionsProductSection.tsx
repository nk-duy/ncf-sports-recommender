"use client";

import { Flame, Tag } from "lucide-react";
import Pagination from "@/shared/components/Pagination";
import { usePromotionsFilter } from "../hooks/usePromotionsFilter";
import PromotionsFilterSidebar from "./PromotionsFilterSidebar";
import PromotionDealCard from "./PromotionDealCard";

const QUICK_DISCOUNT_RANGES = [
  { label: "Tất cả deal", value: 0 },
  { label: "Giảm > 20%", value: 20 },
  { label: "Giảm > 30%", value: 30 },
  { label: "Siêu Sale > 45%", value: 45 },
];

const SORT_OPTIONS = [
  { id: "discount_desc", label: "🔥 Giảm nhiều nhất" },
  { id: "sold_desc", label: "⚡ Bán chạy nhất" },
  { id: "price_asc", label: "Giá thấp đến cao" },
  { id: "price_desc", label: "Giá cao đến thấp" },
  { id: "rating_desc", label: "Đánh giá cao" },
];

export default function PromotionsProductSection() {
  const {
    products,
    totalCount,
    loading,
    selectedSport,
    setSelectedSport,
    selectedType,
    setSelectedType,
    selectedPriceIdx,
    setSelectedPriceIdx,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    minDiscount,
    setMinDiscount,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalPages,
    mounted,
    sectionRef,
    availableSizes,
    handlePageChange,
    handleResetFilters,
    handleToggleWishlist,
    isWishlisted,
  } = usePromotionsFilter();

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
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 text-balance">
            DANH SÁCH DEAL THỂ THAO ĐANG GIẢM GIÁ
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 text-pretty">
            Hiển thị <span className="font-bold text-slate-900 tabular-nums">{products.length}</span> trong số{" "}
            <span className="font-bold text-red-600 tabular-nums">{totalCount}</span> sản phẩm khuyến mãi hôm nay (Trang{" "}
            <span className="tabular-nums">{page}</span>/<span className="tabular-nums">{totalPages}</span>)
          </p>
        </div>

        {/* Quick Discount Range Filter */}
        <div className="flex items-center flex-wrap gap-2">
          {QUICK_DISCOUNT_RANGES.map((d) => (
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
        <PromotionsFilterSidebar
          selectedSport={selectedSport}
          onSelectSport={(sport) => {
            setSelectedSport(sport);
            setPage(1);
          }}
          selectedType={selectedType}
          onSelectType={(type) => {
            setSelectedType(type);
            setSelectedSize("");
            setPage(1);
          }}
          selectedPriceIdx={selectedPriceIdx}
          onSelectPriceIdx={(idx) => {
            setSelectedPriceIdx(idx);
            setPage(1);
          }}
          availableSizes={availableSizes}
          selectedSize={selectedSize}
          onSelectSize={(size) => {
            setSelectedSize(size);
            setPage(1);
          }}
          selectedColor={selectedColor}
          onSelectColor={(color) => {
            setSelectedColor(color);
            setPage(1);
          }}
          onResetFilters={handleResetFilters}
        />

        {/* Right Products Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Sort Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <span className="text-xs font-bold text-slate-500">Sắp xếp theo ưu tiên:</span>

            <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
              {SORT_OPTIONS.map((sort) => (
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
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
                <Tag className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase">
                Không tìm thấy deal khuyến mãi phù hợp
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Hãy thử điều chỉnh lại bộ lọc thể thao, môn hoặc mức giá để khám phá hàng trăm sản phẩm hấp dẫn khác!
              </p>
              <button
                onClick={handleResetFilters}
                className="h-10 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer inline-flex items-center justify-center"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p, index) => {
                const pid = String(p.product_id || p.id || "");
                return (
                  <PromotionDealCard
                    key={pid || index}
                    product={p}
                    index={index}
                    mounted={mounted}
                    wishlisted={mounted && isWishlisted(pid)}
                    onToggleWishlist={handleToggleWishlist}
                  />
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

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                siblingCount={1}
                showEllipsis={true}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
