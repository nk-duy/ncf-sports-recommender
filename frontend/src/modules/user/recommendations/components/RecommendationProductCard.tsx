"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import {
  DEFAULT_RECOMMENDED_SPORT_IMG,
  type UserRecommendedProduct,
} from "../types";

interface RecommendationProductCardProps {
  product: UserRecommendedProduct;
  wishlisted: boolean;
  onToggleWishlist: (product: UserRecommendedProduct) => void;
  onAddToCart: (product: UserRecommendedProduct) => void;
}

export default function RecommendationProductCard({
  product,
  wishlisted,
  onToggleWishlist,
  onAddToCart,
}: RecommendationProductCardProps) {
  const categoryLabel = Array.isArray(product.category)
    ? product.category[0] || "Thể thao"
    : product.category || "Thể thao";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group transition-all duration-200 hover:shadow-md">
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden flex items-center justify-center p-4">
        <img
          alt={product.name}
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
          src={product.image_url || DEFAULT_RECOMMENDED_SPORT_IMG}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_RECOMMENDED_SPORT_IMG;
          }}
        />
        <button
          type="button"
          onClick={() => onToggleWishlist(product)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-colors shadow-sm ${
            wishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
          }`}
          title={wishlisted ? "Đã thích" : "Thêm vào yêu thích"}
        >
          <Heart size={18} className={wishlisted ? "fill-red-500 text-red-500" : ""} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px] font-semibold w-fit">
            {categoryLabel}
          </span>
          <Link
            href={`/san-pham/${product.product_id}`}
            className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2"
          >
            {product.name}
          </Link>
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-gray-50">
          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold text-gray-900">
              {product.price.toLocaleString("vi-VN")} đ
            </span>
            {product.original_price && (
              <span className="text-xs text-gray-400 line-through">
                {product.original_price.toLocaleString("vi-VN")} đ
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="w-full py-2 px-3 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5 active:scale-[0.99]"
          >
            <ShoppingBag size={15} />
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
}
