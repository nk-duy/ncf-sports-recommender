"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Sparkles, Star } from "lucide-react";
import AiXRayInspector from "@/shared/components/AiXRayInspector";
import { HOME_FALLBACK_SPORT_IMG, type HomeRecProduct } from "../types";

interface HomeRecommendationCardProps {
  product: HomeRecProduct;
  mounted: boolean;
  wishlisted: boolean;
  isXRayActive: boolean;
  onProductClick: (productId: string) => void;
  onToggleWishlist: (e: React.MouseEvent, p: HomeRecProduct) => void;
  onQuickAdd: (e: React.MouseEvent, p: HomeRecProduct) => void;
}

export default function HomeRecommendationCard({
  product,
  mounted,
  wishlisted,
  isXRayActive,
  onProductClick,
  onToggleWishlist,
  onQuickAdd,
}: HomeRecommendationCardProps) {
  const pid = product.product_id;
  const discount = product.discount_percent || 0;
  const salePrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Image Container */}
      <Link
        href={`/san-pham/${pid}`}
        onClick={() => onProductClick(pid)}
        className="relative block w-full aspect-square overflow-hidden bg-slate-50"
      >
        <img
          src={product.image_url || HOME_FALLBACK_SPORT_IMG}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = HOME_FALLBACK_SPORT_IMG;
          }}
        />

        {/* AI Match Percent & Discount Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          {product.ai_explanation?.match_percent ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold shadow-md tabular-nums">
              <Sparkles size={10} className="text-yellow-300" />
              {product.ai_explanation.match_percent}% Phù hợp
            </span>
          ) : null}
          {discount > 0 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase shadow-sm tabular-nums">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        {mounted && (
          <button
            onClick={(e) => onToggleWishlist(e, product)}
            aria-label="Thêm vào yêu thích"
            className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-sm ${
              wishlisted
                ? "bg-red-500 text-white scale-110"
                : "bg-white/90 text-slate-400 hover:text-red-500 hover:bg-white"
            }`}
          >
            <Heart size={14} className={wishlisted ? "fill-white" : ""} />
          </button>
        )}
      </Link>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            <span className="truncate">{product.sport_type || "Thể Thao"}</span>
            {product.rating ? (
              <span className="flex items-center gap-1 text-amber-500 font-bold shrink-0 tabular-nums">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)}
              </span>
            ) : null}
          </div>

          <Link
            href={`/san-pham/${pid}`}
            onClick={() => onProductClick(pid)}
            className="font-bold text-slate-800 text-sm line-clamp-2 min-h-[2.5rem] leading-snug group-hover:text-blue-600 transition-colors mb-2"
          >
            {product.name}
          </Link>

          {/* AI Explanation Reason */}
          {product.ai_explanation?.reason && (
            <div className="mb-2.5">
              <span
                className="inline-flex items-center gap-1 text-[11px] text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded max-w-full truncate font-medium border border-blue-100/60"
                title={product.ai_explanation.reason}
              >
                <Sparkles size={10} className="shrink-0 text-blue-500" />
                <span className="truncate">{product.ai_explanation.reason}</span>
              </span>
            </div>
          )}

          {/* AI X-Ray Inspector Box */}
          {isXRayActive && (
            <div className="mb-3">
              <AiXRayInspector explanation={product.ai_explanation} />
            </div>
          )}
        </div>

        {/* Price & Cart CTA */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-black text-slate-900 tabular-nums">
              {salePrice.toLocaleString("vi-VN")}đ
            </span>
            {discount > 0 && (
              <span className="text-xs text-slate-400 line-through font-medium tabular-nums">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
            )}
          </div>

          <button
            onClick={(e) => onQuickAdd(e, product)}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Thêm Vào Giỏ
          </button>
        </div>
      </div>
    </div>
  );
}
