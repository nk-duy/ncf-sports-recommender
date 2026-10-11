"use client";

import React, { useState, useEffect } from "react";
import styles from "./ProductCard.module.css";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/shared/store/wishlistStore";
import { notifications } from "@mantine/notifications";

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
}

import { Plus } from "lucide-react";

export default function ProductCard({ product, isPromo = false }: { product: Product, isPromo?: boolean }) {
  const displayId = String(product.id || product.product_id || '');
  const displayImage = product.imageUrl || product.image_url || 'https://via.placeholder.com/300x300?text=No+Image';
  const displayPrice = typeof product.price === 'number' ? product.price.toLocaleString('vi-VN') + 'đ' : product.price;
  const numericPrice = typeof product.price === 'number' 
    ? product.price 
    : parseInt(String(product.price).replace(/\D/g, '')) || 0;
  
  // Only show the first category to prevent long wrapping text
  const displayCategory = Array.isArray(product.category) && product.category.length > 0
    ? product.category[0] 
    : product.category;

  const { toggleItem, isWishlisted } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  useEffect(() => setMounted(true), []);
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
      category: String(displayCategory || ''),
      original_price: product.originalPrice,
      discount_percent: (product as any).discount_percent || (product as any).discountPercent,
      discount_label: product.discountLabel,
    });
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 600);
    notifications.show({
      message: added ? `Đã thêm vào danh sách yêu thích` : `Đã xóa khỏi yêu thích`,
      color: added ? 'red' : 'gray',
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
        />
        {product.discountLabel && (
          <span className={styles.badgePrimary}>
            {product.discountLabel}
          </span>
        )}
        {/* Wishlist heart button */}
        {mounted && displayId && (
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
            className={`absolute top-2 left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md
              ${wishlisted
                ? 'bg-red-500 text-white scale-110'
                : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white'
              } ${heartAnim ? 'scale-125' : ''}`}
          >
            <Heart size={15} className={wishlisted ? 'fill-white' : ''} />
          </button>
        )}
      </div>
      
      <div className={styles.content}>
        {displayCategory && (
          <div className={styles.category}>
            {displayCategory}
          </div>
        )}
        
        <h3 className={styles.title}>
          {product.name}
        </h3>
        
        <div className={styles.footer}>
          <div className={styles.priceWrapper}>
            <span className={styles.price}>
              {displayPrice}
            </span>
            {product.originalPrice && (
              <div className="flex items-center gap-1.5 ml-1">
                <span className={styles.originalPrice}>
                  {product.originalPrice}
                </span>
                {((product as any).discount_percent || (product as any).discountPercent) > 0 && (
                  <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1 py-0.5 rounded">
                    -{((product as any).discount_percent || (product as any).discountPercent)}%
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

