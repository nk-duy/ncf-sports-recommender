"use client";

import Link from "next/link";
import { ArrowRight, Compass, Package } from "lucide-react";
import Breadcrumb from "@/shared/components/Breadcrumb";
import QuickAddToCartModal from "@/shared/components/QuickAddToCartModal";
import { useRecommendedPage } from "../hooks/useRecommendedPage";
import RecommendedFilterToolbar from "./RecommendedFilterToolbar";
import RecommendedGridCard from "./RecommendedGridCard";
import AiFusionRadarLab from "./AiFusionRadarLab";

const BREADCRUMB_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Sản phẩm gợi ý" },
];

export default function RecommendedPageContent() {
  const {
    user,
    isAuthenticated,
    productsCount,
    sortedProducts,
    loading,
    isRefreshing,
    activeSportTab,
    setActiveSportTab,
    activeTypeTab,
    setActiveTypeTab,
    sortBy,
    setSortBy,
    wNcf,
    setWNcf,
    wVisual,
    setWVisual,
    wContext,
    setWContext,
    discoveryMode,
    setDiscoveryMode,
    handleResetOptimal,
    latencyMs,
    isTuning,
    radarAxes,
    mounted,
    isWishlisted,
    modalProduct,
    isModalOpen,
    setIsModalOpen,
    handleRefresh,
    handleQuickAdd,
    handleToggleWishlist,
  } = useRecommendedPage();

  const displayUserName = user ? user.full_name || user.username || "Khách hàng" : undefined;

  return (
    <div className="bg-gray-50 min-h-screen pb-14">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <Breadcrumb items={BREADCRUMB_ITEMS} />

        <RecommendedFilterToolbar
          productsCount={productsCount}
          isAuthenticated={isAuthenticated}
          displayUserName={displayUserName}
          isRefreshing={isRefreshing}
          loading={loading}
          onRefresh={handleRefresh}
          activeSportTab={activeSportTab}
          onChangeSportTab={setActiveSportTab}
          activeTypeTab={activeTypeTab}
          onChangeTypeTab={setActiveTypeTab}
          sortBy={sortBy}
          onChangeSortBy={setSortBy}
        />

        <AiFusionRadarLab
          wNcf={wNcf}
          onChangeWNcf={setWNcf}
          wVisual={wVisual}
          onChangeWVisual={setWVisual}
          wContext={wContext}
          onChangeWContext={setWContext}
          discoveryMode={discoveryMode}
          onChangeDiscoveryMode={setDiscoveryMode}
          onResetOptimal={handleResetOptimal}
          latencyMs={latencyMs}
          isTuning={isTuning}
          radarAxes={radarAxes}
        />

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-4 animate-pulse">
                <div className="w-full aspect-square bg-slate-100 rounded-xl" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="h-9 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center text-slate-400 space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">Không tìm thấy sản phẩm phù hợp</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Hãy thử chọn lại phân loại hoặc đổi bộ môn khác.
            </p>
            <button
              onClick={() => {
                setActiveSportTab("all");
                setActiveTypeTab("all");
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Xem tất cả gợi ý
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sortedProducts.map((p) => (
              <RecommendedGridCard
                key={p.product_id}
                product={p}
                mounted={mounted}
                wishlisted={mounted && isWishlisted(p.product_id)}
                onToggleWishlist={handleToggleWishlist}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        )}

        {/* Informative Footer */}
        <div className="mt-10 p-6 rounded-3xl bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <span>
              Danh sách 8 - 12 sản phẩm trên được tính toán và xếp hạng dựa trên mức độ yêu thích bộ môn thể thao và hành vi mua sắm của bạn.
            </span>
          </div>

          <Link
            href="/san-pham"
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold uppercase tracking-wider whitespace-nowrap"
          >
            Xem tất cả sản phẩm KADY
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Add To Cart Modal (Size & Color Picker) */}
      <QuickAddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={modalProduct}
      />
    </div>
  );
}
