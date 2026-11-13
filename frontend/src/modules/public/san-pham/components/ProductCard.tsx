"use client";

import React, { useState, useSyncExternalStore } from "react";
import styles from "./ProductCard.module.css";
import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";
import { useWishlistStore } from "@/shared/store/wishlistStore";
import { useAiXRayStore } from "@/shared/store/aiXRayStore";
import { notifications } from "@mantine/notifications";
import { AIExplanation } from "@/shared/types/aiExplanation";
import AiXRayInspector from "@/shared/components/AiXRayInspector";

// Định nghĩa kiểu dữ liệu (TypeScript) cho 1 sản phẩm
export interface Product {
  id?: string | number;
  product_id?: string;
  name: string;
  category?: string | string[];
  price: string | number;
  originalPrice?: string;
  rating?: number;
  reviewsCount?: number;
  imageUrl?: string;
  image_url?: string;
  discountLabel?: string;
  discountPercent?: number;
  discount_percent?: number;
  secondaryLabel?: string;
  sold?: number;
  total?: number;
  ai_explanation?: AIExplanation;
}

const emptySubscribe = () => () => {};
const FALLBACK_IMG = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80";

export default function ProductCard({ product }: { product: Product; isPromo?: boolean }) {
  const displayId = String(product.id || product.product_id || "");
  const displayImage = product.imageUrl || product.image_url || FALLBACK_IMG;
  const displayPrice = typeof product.price === "number" ? product.price.toLocaleString("vi-VN") + "đ" : product.price;
  const numericPrice =
    typeof product.price === "number"
      ? product.price
      : parseInt(String(product.price).replace(/\D/g, "")) || 0;

  // Only show the first category to prevent long wrapping text
  const displayCategory =
    Array.isArray(product.category) && product.category.length > 0
      ? product.category[0]
      : product.category;

  const discountVal = product.discount_percent ?? product.discountPercent ?? 0;

  const { toggleItem, isWishlisted } = useWishlistStore();
  const { isXRayActive } = useAiXRayStore();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [heartAnim, setHeartAnim] = useState(false);

  const wishlisted = mounted && isWishlisted(displayId);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!displayId) return;
    const added = toggleItem({
      product_id: displayId,
      name: product.name,
      price: numericPrice,
      image_url: displayImage,
      category: String(displayCategory || ""),
      original_price: product.originalPrice,
      discount_percent: discountVal || undefined,
      discount_label: product.discountLabel,
    });
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 600);
    notifications.show({
      message: added ? "Đã thêm vào danh sách yêu thích" : "Đã xóa khỏi yêu thích",
      color: added ? "red" : "gray",
      autoClose: 2000,
    });
  };

  return (
    <Link href={`/san-pham/${displayId}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          alt={product.name}
          className={styles.image}
          src={displayImage}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />
        <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1">
          {product.ai_explanation?.match_percent ? (
            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9.5px] sm:text-[10px] font-bold shadow-md tabular-nums">
              <Sparkles size={9} className="text-yellow-300" />
              {product.ai_explanation.match_percent}% Phù hợp
            </span>
          ) : product.discountLabel ? (
            <span className={styles.badgePrimary}>{product.discountLabel}</span>
          ) : null}
          {product.ai_explanation?.is_cross_sport_discovery && (
            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[9px] sm:text-[10px] font-bold shadow-md">
              🌟 Khám phá Liên bộ môn
            </span>
          )}
        </div>
        {/* Wishlist heart button */}
        {mounted && displayId && (
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
            className={`absolute top-2 left-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm
              ${
                wishlisted
                  ? "bg-rose-50 border border-rose-200 scale-110 shadow-rose-200/50"
                  : "bg-white/90 text-gray-400 hover:text-rose-500 hover:bg-white"
              } ${heartAnim ? "scale-125" : ""}`}
          >
            <Heart
              size={13}
              className={wishlisted ? "fill-rose-500 text-rose-500" : "text-gray-400 hover:text-rose-500"}
            />
          </button>
        )}
      </div>

      <div className={styles.content}>
        {displayCategory && <div className={styles.category}>{displayCategory}</div>}

        <h3 className={styles.title}>{product.name}</h3>

        {/* AI Explanation Reason */}
        {product.ai_explanation?.reason && (
          <div className="mb-2">
            <span
              className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-blue-600 bg-blue-50/80 px-1.5 sm:px-2 py-0.5 rounded max-w-full font-medium border border-blue-100/60 leading-tight"
              title={product.ai_explanation.reason}
            >
              <Sparkles size={9} className="shrink-0 text-blue-500" />
              <span className="line-clamp-2 sm:truncate">{product.ai_explanation.reason}</span>
            </span>
          </div>
        )}

        {/* AI X-Ray Inspector Box */}
        {isXRayActive && product.ai_explanation && (
          <div className="mb-2">
            <AiXRayInspector explanation={product.ai_explanation} />
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.priceWrapper}>
            <span className={`${styles.price} tabular-nums`}>{displayPrice}</span>
            {product.originalPrice && (
              <div className="flex items-center gap-1 ml-1">
                <span className={`${styles.originalPrice} tabular-nums`}>{product.originalPrice}</span>
                {discountVal > 0 && (
                  <span className="text-[9.5px] sm:text-[10px] font-bold bg-red-100 text-red-600 px-1 py-0.2 rounded tabular-nums">
                    -{discountVal}%
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
