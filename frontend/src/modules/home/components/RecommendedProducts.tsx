'use client';

import React, { useEffect, useState } from "react";
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

export default function RecommendedProducts() {
  const [products, setProducts] = useState<ProductAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);
      try {
        const res = await fetch("http://localhost:8000/api/v1/recommendations/?top_k=8", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (!isLoggedIn) {
    return null; // Không hiển thị section gợi ý nếu chưa đăng nhập
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px 0' }}>Đang phân tích sở thích của bạn...</div>;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section id="recommended-products" className={styles.sectionContainer} style={{ backgroundColor: '#0a0a0a' }}>
      <div className={styles.wrapper}>
        
        {/* Sleek Minimalist Header */}
        <div className={styles.header}>
          <div className={styles.headerLines}>
            <div className={styles.line}></div>
            <span className={styles.headerSubtext} style={{ color: '#00f2fe' }}>Gợi ý cá nhân hóa</span>
            <div className={styles.line}></div>
          </div>
          <h2 className={styles.headerTitle} style={{ 
            background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Dành Riêng Cho Bạn
          </h2>
          <p className={styles.headerDesc}>
            Dựa trên hoạt động của bạn, AI của chúng tôi gợi ý những sản phẩm phù hợp nhất.
          </p>
        </div>

        <div className={styles.gridContainer}>
          {products.map((p) => {
            const displayCategory = p.category && p.category.length > 0 ? p.category[p.category.length - 1] : "SẢN PHẨM THỂ THAO";
            
            return (
              <ProductCard 
                key={p.product_id} 
                product={{
                  id: p.product_id,
                  name: p.name,
                  price: formatPrice(p.price),
                  imageUrl: p.image_url,
                  discountLabel: "AI PICK",
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
