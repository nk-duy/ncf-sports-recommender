'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '@/modules/san-pham/components/ProductCard';

interface ProductRecommendationsProps {
  productId?: string;
}

export default function ProductRecommendations({ productId }: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: any = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(`http://localhost:8000/api/v1/recommendations/?top_k=4`, {
          headers
        });
        if (res.ok) {
          const data = await res.json();
          const processedRecs = data.map((p: any) => {
            const discountPercent = p.discount_percent || 0;
            const originalPrice = discountPercent > 0 ? Math.round(p.price / (1 - discountPercent / 100)) : p.price;
            return {
              id: p.product_id,
              name: p.name,
              category: p.category && p.category.length > 0 ? p.category[0] : "THỂ THAO",
              price: p.price,
              originalPrice: discountPercent > 0 ? `${originalPrice.toLocaleString('vi-VN')}đ` : undefined,
              rating: p.rating || 0,
              reviewsCount: p.reviews_count || 0,
              imageUrl: p.image_url,
              discountLabel: discountPercent > 0 ? `-${discountPercent}%` : undefined,
            };
          });
          setRecommendations(processedRecs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRecs(false);
      }
    };

    fetchRecommendations();
  }, [productId]);

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        Gợi ý dành riêng cho bạn
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {loadingRecs ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse"></div>
          ))
        ) : recommendations.length > 0 ? (
          recommendations.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full">Chưa có gợi ý nào vào lúc này.</p>
        )}
      </div>
    </div>
  );
}
