"use client";

import React from "react";
import styles from "./ProductCard.module.css";
import Link from "next/link";

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
  secondaryLabel?: string;
  sold?: number;
  total?: number;
}

import { Plus } from "lucide-react";

export default function ProductCard({ product, isPromo = false }: { product: Product, isPromo?: boolean }) {
  const displayId = product.id || product.product_id;
  const displayImage = product.imageUrl || product.image_url || 'https://via.placeholder.com/300x300?text=No+Image';
  const displayPrice = typeof product.price === 'number' ? product.price.toLocaleString('vi-VN') + 'đ' : product.price;
  
  // Only show the first category to prevent long wrapping text
  const displayCategory = Array.isArray(product.category) && product.category.length > 0
    ? product.category[0] 
    : product.category;

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
          </div>
        </div>
      </div>
    </Link>
  );
}
