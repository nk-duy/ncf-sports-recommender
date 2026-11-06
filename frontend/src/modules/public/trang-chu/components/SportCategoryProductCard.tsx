"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { HOME_FALLBACK_SPORT_IMG, type SportProduct } from "../types";

interface SportCategoryProductCardProps {
  product: SportProduct;
  mounted: boolean;
  wishlisted: boolean;
  onToggleWishlist: (e: React.MouseEvent, p: SportProduct) => void;
  onQuickAdd?: (e: React.MouseEvent, p: SportProduct) => void;
}

export default function SportCategoryProductCard({
  product,
  mounted,
  wishlisted,
  onToggleWishlist,
}: SportCategoryProductCardProps) {
  const pid = product.product_id;
  const discount = product.discount_percent || 0;
  const salePrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-slate-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      <Link
        href={`/san-pham/${pid}`}
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

        {discount > 0 && (
          <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase shadow-sm">
            -{discount}%
          </span>
        )}

        {mounted && (
          <button
            onClick={(e) => onToggleWishlist(e, product)}
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

      <div className="p-3.5 flex-1 flex flex-col">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 truncate">
          {product.product_type || "Chính hãng"}
        </div>

        <Link
          href={`/san-pham/${pid}`}
          className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors mb-2"
        >
          {product.name}
        </Link>

        <div className="mt-auto pt-2 flex items-center justify-between gap-1 border-t border-slate-100">
          <div>
            <span className="block text-sm sm:text-base font-black text-slate-900 font-mono leading-none">
              {salePrice.toLocaleString("vi-VN")}đ
            </span>
            {discount > 0 && (
              <span className="block text-[11px] text-slate-400 line-through mt-0.5">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}