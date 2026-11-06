'use client';

import { useEffect, useState } from 'react';
import ProductCard, { type Product } from '@/modules/public/san-pham/components/ProductCard';
import AiXRayToggle from '@/shared/components/AiXRayToggle';
import type { RawRecommendationItem } from '../types';

interface ProductRecommendationsProps {
  productId?: string;
  sportType?: string;
  productType?: string;
}

export default function ProductRecommendations({ productId, sportType }: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [impressionId, setImpressionId] = useState<string>('');

  useEffect(() => {
    let active = true;
    const fetchRecommendations = async () => {
      try {
        setLoadingRecs(true);
        const token = localStorage.getItem('kady_customer_token') || localStorage.getItem('token');
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const params = new URLSearchParams();
        params.append('top_k', '8');
        if (productId) {
          params.append('current_product_id', productId);
        }
        if (sportType) {
          params.append('sport_type', sportType);
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/api/v1/recommendations/?${params.toString()}`, {
          headers,
        });
        if (res.ok) {
          const data: RawRecommendationItem[] = await res.json();
          const processedRecs: Product[] = data.map((p) => {
            const discountPercent = p.discount_percent || 0;
            const originalPrice =
              discountPercent > 0 ? Math.round(p.price / (1 - discountPercent / 100)) : p.price;
            return {
              id: p.product_id,
              name: p.name,
              category:
                p.category && p.category.length > 0 ? p.category[0] : p.sport_type || 'THỂ THAO',
              price: p.price,
              originalPrice:
                discountPercent > 0 ? `${originalPrice.toLocaleString('vi-VN')}đ` : undefined,
              rating: p.rating || 0,
              reviewsCount: p.reviews_count || 0,
              imageUrl: p.image_url,
              discountLabel: discountPercent > 0 ? `-${discountPercent}%` : undefined,
              ai_explanation: p.ai_explanation,
            };
          });

          if (active) {
            setRecommendations(processedRecs);
          }

          // Ghi nhận lượt hiển thị trực tuyến (Impression Logging)
          if (processedRecs.length > 0) {
            fetch(`${apiUrl}/api/v1/recommendations/log-impression`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                source: 'product_detail',
                recommended_product_ids: processedRecs.map((p) => String(p.id || '')),
              }),
            })
              .then((r) => (r.ok ? r.json() : null))
              .then((resp: { impression_id?: string } | null) => {
                if (active && resp?.impression_id) {
                  setImpressionId(resp.impression_id);
                }
              })
              .catch(() => {});
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) {
          setLoadingRecs(false);
        }
      }
    };

    fetchRecommendations();
    return () => {
      active = false;
    };
  }, [productId, sportType]);

  const handleProductClick = (id: string) => {
    if (impressionId) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      fetch(`${apiUrl}/api/v1/recommendations/track-click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          impression_id: impressionId,
          product_id: id,
        }),
      }).catch(() => {});
    }
  };

  return (
    <div className="mt-12 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Gợi ý dành riêng cho bạn
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {sportType
              ? `Các sản phẩm phù hợp và tương thích nhất với bộ môn ${sportType}`
              : 'Đề xuất thông minh theo sở thích và xu hướng mua sắm'}
          </p>
        </div>
        <div className="shrink-0 self-start sm:self-auto">
          <AiXRayToggle />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-4 md:gap-6">
        {loadingRecs ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse" />
          ))
        ) : recommendations.length > 0 ? (
          recommendations.map((product) => {
            const pid = String(product.id || '');
            return (
              <div key={pid} onClick={() => handleProductClick(pid)}>
                <ProductCard product={product} />
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 col-span-full">Chưa có gợi ý nào vào lúc này.</p>
        )}
      </div>
    </div>
  );
}
