"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { notifications } from "@mantine/notifications";
import { useWishlistStore } from "@/shared/store/wishlistStore";
import QuickAddToCartModal, { QuickAddProduct } from "@/shared/components/QuickAddToCartModal";
import { resolveApiBaseUrl } from "@/shared/lib/apiUrl";
import { SPORTS_CONFIG } from "../constants/sportsCategoryConfig";
import SportSpotlightBanner from "./SportSpotlightBanner";
import SportCategoryProductCard from "./SportCategoryProductCard";
import type { SportProduct } from "../types";

const emptySubscribe = () => () => {};

export default function ShopByCategory() {
  const [activeSportIndex, setActiveSportIndex] = useState<number>(0);
  const [sportProductsCache, setSportProductsCache] = useState<Record<string, SportProduct[]>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const [modalProduct, setModalProduct] = useState<QuickAddProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { toggleItem, isWishlisted } = useWishlistStore();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const currentSport = SPORTS_CONFIG[activeSportIndex];

  useEffect(() => {
    const sportKey = currentSport.dbSportType;
    if (sportProductsCache[sportKey]) {
      return;
    }

    let active = true;
    const fetchSportProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${resolveApiBaseUrl()}/products?sport_type=${encodeURIComponent(sportKey)}&limit=4`
        );
        if (res.ok && active) {
          const data: SportProduct[] = await res.json();
          setSportProductsCache((prev) => ({ ...prev, [sportKey]: data }));
        }
      } catch (err) {
        console.error("Lỗi tải sản phẩm theo môn:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchSportProducts();
    return () => {
      active = false;
    };
  }, [activeSportIndex, currentSport.dbSportType, sportProductsCache]);

  const displayedProducts = sportProductsCache[currentSport.dbSportType] || [];

  const handleQuickAdd = (e: React.MouseEvent, p: SportProduct) => {
    e.preventDefault();
    e.stopPropagation();

    setModalProduct({
      product_id: p.product_id,
      name: p.name,
      price: p.price,
      discount_percent: p.discount_percent,
      image_url: p.image_url,
      sizes: p.sizes,
      colors: p.colors,
      stock: p.stock,
      category: p.category,
      sport_type: p.sport_type,
    });
    setIsModalOpen(true);
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Sản phẩm theo môn thể thao
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chọn môn thể thao bạn quan tâm để xem các trang thiết bị và dụng cụ phù hợp.
          </p>
        </div>

        <Link
          href={`/san-pham?sport_type=${encodeURIComponent(currentSport.dbSportType)}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group shrink-0"
        >
          <span>Xem tất cả đồ {currentSport.name}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Sports Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none select-none">
        {SPORTS_CONFIG.map((sport, idx) => {
          const isSelected = idx === activeSportIndex;
          const SportIcon = sport.icon;
          return (
            <button
              key={sport.id}
              onClick={() => setActiveSportIndex(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <SportIcon className={`w-4 h-4 ${isSelected ? "text-white" : "text-slate-500"}`} />
              <span>{sport.name}</span>
            </button>
          );
        })}
      </div>

      {/* Split Content: Left Banner Spotlight + Right Live Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <SportSpotlightBanner sport={currentSport} />

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
              displayedProducts.map((p) => (
                <SportCategoryProductCard
                  key={p.product_id}
                  product={p}
                  mounted={mounted}
                  wishlisted={mounted && isWishlisted(p.product_id)}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickAdd={handleQuickAdd}
                />
              ))
            )}
          </div>
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
