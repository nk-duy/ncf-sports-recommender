import React from "react";
import ProductCard from "@/modules/products/components/ProductCard";
import styles from "./ProductGrid.module.css";

// Interface matches backend response
interface ProductAPI {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  category?: string[];
  rating?: number;
}

export default async function ProductGrid() {
  // Fetch from FastAPI backend
  let products: ProductAPI[] = [];
  try {
    const res = await fetch("http://localhost:8000/api/v1/products/?limit=16", {
      cache: "no-store", // disable caching for dynamic updates
    });
    if (res.ok) {
      products = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <section id="featured-products" className={styles.sectionContainer}>
      <div className={styles.wrapper}>
        
        {/* Sleek Minimalist Header */}
        <div className={styles.header}>
          <div className={styles.headerLines}>
            <div className={styles.line}></div>
            <span className={styles.headerSubtext}>Nổi bật nhất</span>
            <div className={styles.line}></div>
          </div>
          <h2 className={styles.headerTitle}>
            Top Thịnh Hành
          </h2>
          <p className={styles.headerDesc}>
            Bộ sưu tập thời trang và phụ kiện thể thao được lựa chọn nhiều nhất tuần này nhờ thuật toán AI phân tích xu hướng.
          </p>
        </div>

        <div className={styles.gridContainer}>
          {products.map((p) => {
            // Lấy category cuối cùng hoặc đầu tiên để hiển thị nếu có
            const displayCategory = p.category && p.category.length > 0 ? p.category[p.category.length - 1] : "SẢN PHẨM THỂ THAO";
            
            return (
              <ProductCard 
                key={p.product_id} 
                product={{
                  id: p.product_id,
                  name: p.name,
                  price: formatPrice(p.price),
                  imageUrl: p.image_url,
                  discountLabel: p.rating ? `⭐ ${p.rating}` : "MỚI",
                  category: displayCategory,
                }} 
              />
            )
          })}
        </div>
        
      </div>
    </section>
  );
}
