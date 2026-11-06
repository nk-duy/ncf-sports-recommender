"use client";

import React from "react";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { DEFAULT_SPORTS_IMAGE, type RecProduct } from "../types";

interface RecommendedGridCardProps {
  product: RecProduct;
  mounted: boolean;
  wishlisted: boolean;
  onToggleWishlist: (e: React.MouseEvent, p: RecProduct) => void;
  onQuickAdd?: (e: React.MouseEvent, p: RecProduct) => void;
}

export default function RecommendedGridCard({
  product,
  mounted,
  wishlisted,
  onToggleWishlist,
}: RecommendedGridCardProps) {
  const pid = product.product_id;
  const discount = product.discount_percent || 0;
  const salePrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Image Container */}
      <Link href={`/san-pham/${pid}`} className="relative block w-full aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.image_url || DEFAULT_SPORTS_IMAGE}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_SPORTS_IMAGE;
          }}
        />

        {/* Standard E-commerce Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-600 text-white text-[11px] font-black uppercase shadow-sm">
              -{discount}%
            </span>
          </div>
        )}

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
      <div className="p-4 flex-1 flex flex-col">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          <span className="truncate">{product.sport_type || "Thể Thao"}</span>
          {product.rating ? (
            <span className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)}
            </span>
          ) : null}
        </div>

        {/* Product Name */}
        <Link
          href={`/san-pham/${pid}`}
          className="font-bold text-slate-800 text-sm line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors mb-3"
        >
          {product.name}
        </Link>

        {/* Price */}
        <div className="mt-auto pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
              {salePrice.toLocaleString("vi-VN")}đ
            </span>
            {discount > 0 && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}