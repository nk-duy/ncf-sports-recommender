"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, Sparkles, Star } from "lucide-react";
import ProductCard from "@/modules/public/san-pham/components/ProductCard";
import { resolveApiBaseUrl } from "@/shared/lib/apiUrl";

interface ProductAPI {
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
  sold?: number;
}

type TabType = "bestseller" | "newest" | "toprated";

interface TabConfig {
  id: TabType;
  label: string;
  tag: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  colorClass: string;
  badgeBg: string;
}

const TABS: TabConfig[] = [
  {
    id: "bestseller",
    label: "Bán Chạy Nhất",
    tag: "TOP SẢN PHẨM BÁN CHẠY",
    icon: Flame,
    colorClass: "text-red-500",
    badgeBg: "bg-red-50 text-red-600 border-red-200",
  },
  {
    id: "newest",
    label: "Hàng Mới Về",
    tag: "BỘ SƯU TẬP MỚI 2026",
    icon: Sparkles,
    colorClass: "text-emerald-500",
    badgeBg: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  {
    id: "toprated",
    label: "Đánh Giá Cao",
    tag: "KHÁCH HÀNG KHUYÊN DÙNG",
    icon: Star,
    colorClass: "text-amber-500",
    badgeBg: "bg-amber-50 text-amber-600 border-amber-200",
  },
];

export default function TrendingProducts() {
  const [activeTab, setActiveTab] = useState<TabType>("bestseller");
  const [productsCache, setProductsCache] = useState<Record<TabType, ProductAPI[]>>({
    bestseller: [],
    newest: [],
    toprated: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (productsCache[activeTab].length > 0) return;

    let active = true;
    const fetchTabProducts = async () => {
      setLoading(true);
      try {
        let endpoint = `${resolveApiBaseUrl()}/products?limit=10`;
        if (activeTab === "bestseller") {
          endpoint += "&sort_by=sold_desc";
        } else if (activeTab === "newest") {
          endpoint += "&sort_by=discount_desc";
        } else if (activeTab === "toprated") {
          endpoint += "&sort_by=rating_desc";
        }

        const res = await fetch(endpoint);
        if (res.ok && active) {
          let data: ProductAPI[] = await res.json();
          if (activeTab === "toprated") {
            data = data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          } else if (activeTab === "newest") {
            data = [...data].reverse();
          }

          setProductsCache((prev) => ({
            ...prev,
            [activeTab]: data.slice(0, 8),
          }));
        }
      } catch (err) {
        console.error("Lỗi tải sản phẩm xu hướng:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchTabProducts();
    return () => {
      active = false;
    };
  }, [activeTab, productsCache]);

  const displayedProducts = productsCache[activeTab] || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  return (
    <section className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-14 bg-slate-50 border-t border-slate-200/80">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Sản phẩm bán chạy & Xu hướng
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Những sản phẩm thể thao được mua nhiều nhất tại cửa hàng.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-sm self-start sm:self-auto overflow-x-auto">
          {TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <TabIcon className={`w-3.5 h-3.5 ${isSelected ? "text-amber-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse">
              <div className="w-full aspect-square bg-slate-100 rounded-xl" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="h-8 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="py-16 text-center text-slate-400">
          Đang cập nhật danh mục sản phẩm...
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
          {displayedProducts.map((p, index) => {
            const displayCategory =
              p.category && p.category.length > 0 ? p.category[0] : p.sport_type || "Thể Thao";
            const discountPct = p.discount_percent || 0;
            const discountedPrice = discountPct > 0 ? p.price * (1 - discountPct / 100) : p.price;

            let secondaryBadge: string | undefined;
            if (activeTab === "bestseller") {
              secondaryBadge = `#${index + 1} BÁN CHẠY`;
            } else if (activeTab === "newest") {
              secondaryBadge = "MỚI 2026";
            } else if (activeTab === "toprated") {
              secondaryBadge = p.rating ? `⭐ ${p.rating.toFixed(1)} SAO` : "YÊU THÍCH";
            }

            return (
              <div key={p.product_id || index} className="relative group">
                <ProductCard
                  product={{
                    id: p.product_id,
                    name: p.name,
                    price: formatPrice(discountedPrice),
                    originalPrice: discountPct > 0 ? formatPrice(p.price) : undefined,
                    imageUrl: p.image_url,
                    discountLabel: discountPct > 0 ? `-${discountPct}%` : undefined,
                    secondaryLabel: secondaryBadge,
                    category: displayCategory,
                    discountPercent: discountPct > 0 ? discountPct : undefined,
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
          Cập nhật liên tục theo doanh số và lượt đánh giá từ khách hàng
        </span>

        <Link
          href="/san-pham"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-slate-900 hover:text-red-600 uppercase tracking-wider transition-colors ml-auto group"
        >
          Xem tất cả sản phẩm thể thao
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
