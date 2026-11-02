"use client";

import React from "react";
import Link from "next/link";
import { Flame, Heart, ShoppingBag } from "lucide-react";
import { PROMO_FALLBACK_IMG, type PromotionProductItem } from "../types";

interface PromotionDealCardProps {
  product: PromotionProductItem;
  index: number;
  mounted: boolean;
  wishlisted: boolean;
  onToggleWishlist: (e: React.MouseEvent, p: PromotionProductItem) => void;
}

export default function PromotionDealCard({
  product,
  index,
  mounted,
  wishlisted,
  onToggleWishlist,
}: PromotionDealCardProps) {
  const pid = String(product.product_id || product.id || "");
  const discount = product.discount_percent || 0;
  const salePrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;
  const sold = product.sold || Math.floor((index + 1) * 12 + 10);
  const stock = product.stock || 120;
  const soldPercent = Math.min(Math.round((sold / stock) * 100), 100);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-red-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      {/* Image Area */}
      <Link href={`/san-pham/${pid}`} className="relative block w-full aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.image_url || PROMO_FALLBACK_IMG}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PROMO_FALLBACK_IMG;
          }}
        />

        {/* Hot Sale Badge */}
        {discount > 0 && (
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-600 to-amber-500 text-white text-xs font-black tracking-wider uppercase shadow-md shadow-red-600/40 tabular-nums">
              <Flame className="w-3 h-3 fill-white" />
              -{discount}%
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        {mounted && (
          <button
            onClick={(e) => onToggleWishlist(e, product)}
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
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Sport */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 truncate">
            <span>{product.sport_type || "Thể Thao"}</span>
            <span>•</span>
            <span>{product.product_type || "Chính hãng"}</span>
          </div>

          {/* Product Name */}
          <Link
            href={`/san-pham/${pid}`}
            className="font-bold text-slate-900 text-sm line-clamp-2 min-h-[2.5rem] leading-snug group-hover:text-red-600 transition-colors mb-3"
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="text-base sm:text-lg font-black text-red-600 tabular-nums">
              {salePrice.toLocaleString("vi-VN")}đ
            </span>
            {discount > 0 && (
              <span className="text-xs text-slate-400 line-through font-medium tabular-nums">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
            )}
          </div>

          {/* Sold Progress Heat Bar */}
          <div className="space-y-1 mb-3.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-600 flex items-center gap-1 tabular-nums">
                <Flame className="w-3 h-3 text-red-500 fill-red-500" />
                Đã bán {sold}
              </span>
              {soldPercent >= 75 && (
                <span className="text-red-600 text-[10px] font-black uppercase tabular-nums">
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
            className="w-full h-10 rounded-xl bg-slate-900 hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-200 shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Săn Deal Ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
