"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "@/modules/san-pham/components/ProductCard";

export default function PromotionsList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/products/?limit=8&is_promotion=true")
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.items || []);
        // Process data using real discount_percent from DB
        const promoProducts = list.map((p: any, index: number) => {
          const discountPercent = p.discount_percent || 0;
          // Assuming p.price is the final discounted price, we calculate original price
          const originalPrice = discountPercent > 0 ? Math.round(p.price / (1 - discountPercent / 100)) : p.price;
          
          return {
            id: p.product_id,
            name: p.name,
            category: p.category && p.category.length > 0 ? p.category[0] : "THỂ THAO",
            price: `${p.price.toLocaleString('vi-VN')}đ`,
            originalPrice: discountPercent > 0 ? `${originalPrice.toLocaleString('vi-VN')}đ` : undefined,
            rating: p.rating || 0,
            reviewsCount: p.reviews_count || 0,
            imageUrl: p.image_url,
            discountLabel: discountPercent > 0 ? `-${discountPercent}% SALE` : undefined,
            secondaryLabel: index === 0 ? "BÁN CHẠY" : index === 1 ? "FLASH SALE" : "CHÍNH HÃNG",
            sold: p.sold || 0,
            total: 200
          };
        });
        setProducts(promoProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full">
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse"></div>
          ))
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} isPromo={true} />
          ))
        )}
      </div>

      {!loading && (
        <div className="text-center text-sm text-gray-500 mb-4">
          Hiển thị <span className="font-bold text-gray-900">{products.length}</span> trong số <span className="font-bold text-gray-900">124</span> sản phẩm khuyến mãi hôm nay
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mb-10">
        <button className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center bg-red-600 text-white font-bold shadow-sm">
          1
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-700 hover:border-red-600 hover:text-red-600 transition-colors font-medium">
          2
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-700 hover:border-red-600 hover:text-red-600 transition-colors font-medium">
          3
        </button>
        <span className="w-9 h-9 flex items-center justify-center text-gray-400 tracking-widest">
          ...
        </span>
        <button className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-700 hover:border-red-600 hover:text-red-600 transition-colors font-medium">
          16
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-600 hover:border-gray-900 hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
