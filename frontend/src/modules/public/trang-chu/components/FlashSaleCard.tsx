"use client";

import React from "react";
import Link from "next/link";
import { Flame, Heart, ShoppingBag } from "lucide-react";
import { HOME_FALLBACK_SPORT_IMG, type FlashSaleProduct } from "../types";

interface FlashSaleCardProps {
  product: FlashSaleProduct;
  index: number;
  mounted: boolean;
  wishlisted: boolean;
  onToggleWishlist: (e: React.MouseEvent, p: FlashSaleProduct) => void;
  onQuickAdd: (e: React.MouseEvent, p: FlashSaleProduct) => void;
}

export default function FlashSaleCard({
  product,
  index,
  mounted,
  wishlisted,
  onToggleWishlist,
  onQuickAdd,
}: FlashSaleCardProps) {
  const pid = product.product_id;
  const discount = product.discount_percent || 0;
  const salePrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;
  const sold = product.sold || (index + 1) * 14 + 8;
  const stock = product.stock || 100;
  const soldPercent = Math.min(Math.round((sold / stock) * 100), 100);

  return (
    <div className="w-[200px] sm:w-[220px] md:w-[240px] shrink-0 group bg-white rounded-2xl border border-slate-200 hover:border-red-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
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
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-600 to-amber-500 text-white text-[11px] font-black tracking-wider uppercase shadow-md shadow-red-600/30 tabular-nums">
            <Flame className="w-3 h-3 fill-white" />
            -{discount}%
          </div>
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

      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 truncate block">
            {product.sport_type || "Thể Thao"}
          </span>

          <Link
            href={`/san-pham/${pid}`}
            className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 min-h-[2.5rem] leading-snug group-hover:text-red-600 transition-colors mb-2.5 block"
          >
            {product.name}
          </Link>
        </div>

        <div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-base font-black text-red-600 tabular-nums">
              {salePrice.toLocaleString("vi-VN")}đ
            </span>
            {discount > 0 && (
              <span className="text-[11px] text-slate-400 line-through tabular-nums">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
            )}
          </div>

          <div className="space-y-1 mb-3">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-slate-600 flex items-center gap-0.5 tabular-nums">
                <Flame className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                Đã bán {sold}
              </span>
              {soldPercent >= 70 && <span className="text-red-600 font-black">SẮP HẾT</span>}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-600"
                style={{ width: `${soldPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={(e) => onQuickAdd(e, product)}
            className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
}
