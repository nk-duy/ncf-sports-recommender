'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { useCartStore } from '@/shared/store/cartStore';
import { useAuthStore } from '@/shared/store/authStore';
import { useAiXRayStore } from '@/shared/store/aiXRayStore';
import AiXRayToggle from '@/shared/components/AiXRayToggle';
import type { PostPurchaseRecProduct, PublicOrderData } from '../../types';
import PostPurchaseRecCard from './PostPurchaseRecCard';

interface PostPurchaseRecommendationsProps {
  order?: PublicOrderData | null;
}

interface RecEnvelope {
  products?: PostPurchaseRecProduct[];
  items?: PostPurchaseRecProduct[];
}

function extractProductList(data: unknown): PostPurchaseRecProduct[] {
  if (Array.isArray(data)) return data as PostPurchaseRecProduct[];
  if (data && typeof data === 'object') {
    const obj = data as RecEnvelope;
    if (Array.isArray(obj.products)) return obj.products;
    if (Array.isArray(obj.items)) return obj.items;
  }
  return [];
}

export default function PostPurchaseRecommendations({ order }: PostPurchaseRecommendationsProps) {
  const [impressionId, setImpressionId] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { token, isAuthenticated, user } = useAuthStore();
  const { isXRayActive } = useAiXRayStore();

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const apiUrl = rawApiUrl.endsWith('/api/v1') ? rawApiUrl : `${rawApiUrl}/api/v1`;
  const userId = user?.id || user?.user_id || undefined;

  const cartItemIdsKey = (order?.items || [])
    .map((item) => String(item.product_id || item.id || item._id || ''))
    .filter((id) => Boolean(id.trim()))
    .join('|');
  const requestKey = `${cartItemIdsKey}::${isAuthenticated}::${token ?? ''}::${userId ?? ''}`;

  const [result, setResult] = useState<{ key: string; recs: PostPurchaseRecProduct[] } | null>(null);
  const loading = result?.key !== requestKey;
  const recommendations = result?.key === requestKey ? result.recs : [];

  const handleTrackClick = (productId: string) => {
    if (impressionId) {
      fetch(`${apiUrl}/recommendations/track-click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          impression_id: impressionId,
          product_id: productId,
          user_id: userId,
        }),
      }).catch(() => {});
    }
  };

  useEffect(() => {
    let isMounted = true;
    const cartItemIds = cartItemIdsKey ? cartItemIdsKey.split('|') : [];

    const fetchRecommendations = async () => {
      try {
        let recData: PostPurchaseRecProduct[] = [];

        // Primary: Cross-Sell API with purchased item IDs
        try {
          const crossSellRes = await fetch(`${apiUrl}/recommendations/cross-sell?top_k=4`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(isAuthenticated && token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(cartItemIds),
          });
          if (crossSellRes.ok) {
            const list = extractProductList(await crossSellRes.json());
            if (list.length > 0) recData = list;
          }
        } catch {
          // Try fallback
        }

        // Secondary Fallback: Personalized NCF or Trending
        if (recData.length === 0) {
          try {
            const endpoint =
              isAuthenticated && token
                ? `${apiUrl}/recommendations/?top_k=4`
                : `${apiUrl}/recommendations/trending?top_k=4`;
            const fallbackRes = await fetch(endpoint, {
              headers: isAuthenticated && token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (fallbackRes.ok) {
              const list = extractProductList(await fallbackRes.json());
              if (list.length > 0) recData = list;
            }
          } catch {
            // Try catalog fallback
          }
        }

        // Tertiary Fallback: Active catalog products
        if (recData.length === 0) {
          const catalogRes = await fetch(`${apiUrl}/products?limit=4`);
          if (catalogRes.ok) {
            recData = extractProductList(await catalogRes.json());
          }
        }

        if (isMounted) {
          const finalRecs = recData.slice(0, 4);
          setResult({ key: requestKey, recs: finalRecs });

          if (finalRecs.length > 0) {
            fetch(`${apiUrl}/recommendations/log-impression`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                placement: 'post_purchase',
                source: 'post_purchase',
                user_id: userId,
                recommended_product_ids: finalRecs.map((p) => p.product_id || p._id || p.id),
              }),
            })
              .then((r) => (r.ok ? r.json() : null))
              .then((resp: { impression_id?: string } | null) => {
                if (resp?.impression_id && isMounted) {
                  setImpressionId(resp.impression_id);
                }
              })
              .catch(() => {});
          }
        }
      } catch {
        if (isMounted) setResult({ key: requestKey, recs: [] });
      }
    };

    void fetchRecommendations();
    return () => {
      isMounted = false;
    };
  }, [cartItemIdsKey, isAuthenticated, token, userId, apiUrl, requestKey]);

  const handleQuickAdd = (product: PostPurchaseRecProduct, productId: string) => {
    handleTrackClick(productId);
    addItem({
      product_id: productId,
      name: product.name,
      price: product.price || 0,
      quantity: 1,
      image_url: product.image_url || '',
      color: product.colors?.[0] || 'Mặc định',
      size: product.sizes?.[0] || 'Freesize',
      stock: 100,
    });
    notifications.show({
      title: 'Đã thêm vào giỏ hàng',
      message: `Đã thêm "${product.name}" vào giỏ hàng!`,
      color: 'green',
    });
  };

  if (!loading && recommendations.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Gợi ý bổ trợ thông minh bởi AI (NCF)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dựa trên sở thích thể thao và các mặt hàng vừa đặt, KADY gợi ý các sản phẩm bổ trợ tối ưu nhất:
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <AiXRayToggle size="sm" />
          <Link
            href="/san-pham"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 whitespace-nowrap transition-colors"
          >
            <span>Khám phá thêm</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((product, idx) => {
          const productId = product.product_id || product._id || product.id || String(idx);
          return (
            <PostPurchaseRecCard
              key={productId}
              product={product}
              productId={productId}
              isXRayActive={isXRayActive}
              onTrackClick={handleTrackClick}
              onQuickAdd={handleQuickAdd}
            />
          );
        })}
      </div>
    </section>
  );
}
