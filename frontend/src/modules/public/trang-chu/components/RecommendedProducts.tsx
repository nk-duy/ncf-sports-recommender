"use client";

import Link from "next/link";
import { ArrowRight, Package, RotateCw } from "lucide-react";
import QuickAddToCartModal from "@/shared/components/QuickAddToCartModal";
import AiXRayToggle from "@/shared/components/AiXRayToggle";
import { useHomeRecommendations } from "../hooks/useHomeRecommendations";
import HomeRecommendationCard from "./HomeRecommendationCard";

const CATEGORY_TABS = [
  { id: "all", label: "Tất cả" },
  { id: "equipment", label: "Dụng cụ" },
  { id: "shoes", label: "Giày dép" },
  { id: "clothes", label: "Quần áo" },
];

export default function RecommendedProducts() {
  const {
    user,
    isAuthenticated,
    filteredProducts,
    loading,
    isRefreshing,
    activeCategoryTab,
    setActiveCategoryTab,
    mounted,
    isXRayActive,
    isWishlisted,
    modalProduct,
    isModalOpen,
    setIsModalOpen,
    handleRefresh,
    handleProductClick,
    handleQuickAdd,
    handleToggleWishlist,
  } = useHomeRecommendations();

  return (
    <section id="ai-recommendations" className="w-full max-w-full mx-auto px-3 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-10 scroll-mt-20 overflow-x-hidden box-border">
      <div className="relative rounded-2xl sm:rounded-3xl bg-slate-50/70 border border-slate-200/80 p-3 sm:p-5 lg:p-7 shadow-xs w-full max-w-full box-border overflow-x-hidden">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-200/80 w-full max-w-full">
          <div className="min-w-0 max-w-full">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 break-words">
              {isAuthenticated && user ? (
                <>
                  Gợi ý cho bạn: <span className="text-blue-600">{user.full_name || "Khách hàng"}</span>
                </>
              ) : (
                <>Gợi ý dành cho bạn</>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Các sản phẩm được chọn lọc phù hợp với sở thích thể thao của bạn.
            </p>
          </div>

          {/* Action Header: Category Tabs & Refresh Button */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full md:w-auto max-w-full">
            <div className="flex items-center overflow-x-auto max-w-full no-scrollbar gap-1 bg-slate-100 p-1 rounded-xl">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryTab(tab.id)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    activeCategoryTab === tab.id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <AiXRayToggle size="sm" />

              <button
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
                title="Đổi danh sách gợi ý khác"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-600" : "text-slate-500"}`} />
                <span>{isRefreshing ? "Đang tải..." : "Đổi gợi ý"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-4 animate-pulse">
                <div className="w-full aspect-square bg-slate-100 rounded-xl" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="h-9 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm">Không có sản phẩm nào trong phân mục này.</p>
            <button
              onClick={() => setActiveCategoryTab("all")}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Xem tất cả gợi ý
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {filteredProducts.map((p) => (
              <HomeRecommendationCard
                key={p.product_id}
                product={p}
                mounted={mounted}
                wishlisted={mounted && isWishlisted(p.product_id)}
                isXRayActive={isXRayActive}
                onProductClick={handleProductClick}
                onToggleWishlist={handleToggleWishlist}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
            <span>
              Sản phẩm được lựa chọn dựa trên sở thích thể thao và hoạt động gần đây của bạn.
            </span>
          </div>

          <Link
            href="/goi-y"
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            Xem tất cả sản phẩm gợi ý
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <QuickAddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={modalProduct}
      />
    </section>
  );
}
