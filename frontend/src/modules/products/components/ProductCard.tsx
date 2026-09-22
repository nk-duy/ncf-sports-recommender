import React from "react";
import styles from "./ProductCard.module.css";

// Định nghĩa kiểu dữ liệu (TypeScript) cho 1 sản phẩm
export interface Product {
  id: string | number;
  name: string;
  category?: string;
  price: string;
  originalPrice?: string;
  rating?: number;
  reviewsCount?: number;
  imageUrl: string;
  discountLabel?: string;
  secondaryLabel?: string;
  sold?: number;
  total?: number;
}

export default function ProductCard({ product, isPromo = false }: { product: Product, isPromo?: boolean }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          alt={product.name}
          className={styles.image}
          src={product.imageUrl}
        />
        {product.discountLabel && (
          <span className={styles.badgePrimary}>
            {product.discountLabel}
          </span>
        )}
      </div>
      
      <div className={styles.content}>
        {product.category && (
          <div className={styles.category}>
            {product.category}
          </div>
        )}
        
        <h3 className={styles.title}>
          {product.name}
        </h3>
        
        <div className={styles.footer}>
          <div className={styles.priceWrapper}>
            <span className={styles.price}>
              {product.price}
            </span>
          </div>
          
          <button className={styles.addToCartBtn}>
            <span>Thêm vào giỏ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
