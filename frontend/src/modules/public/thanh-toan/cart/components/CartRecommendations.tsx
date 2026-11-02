'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { useCartStore } from '@/shared/store/cartStore';
import { useAuthStore } from '@/shared/store/authStore';
import { useAiXRayStore } from '@/shared/store/aiXRayStore';
import { API_BASE } from '@/shared/lib/cart';
import AiXRayToggle from '@/shared/components/AiXRayToggle';
import CartRecProductCard, { type CartRecProduct } from './CartRecProductCard';

/** Gợi ý sản phẩm liên quan: cross-sell theo giỏ hàng (NCF item embeddings), hoặc gợi ý cá nhân hóa khi giỏ trống */
export default function CartRecommendations() {
  const items = useCartStore((s) => s.items);
  const savedItems = useCartStore((s) => s.savedItems);
  const addItem = useCartStore((s) => s.addItem);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const isXRayActive = useAiXRayStore((s) => s.isXRayActive);

  const excludeIdsKey = Array.from(new Set([...items, ...savedItems].map((i) => i.product_id)))
    .sort()
    .join('|');
  const cartHasItems = items.length > 0;
  const userId = user?.id || user?.user_id || undefined;
  const requestKey = `${excludeIdsKey}::${cartHasItems}::${token ?? ''}::${userId ?? ''}`;

  const [result, setResult] = useState<{ key: string; products: CartRecProduct[] } | null>(null);
  const [impressionId, setImpressionId] = useState<string | null>(null);

  const loading = result?.key !== requestKey;
  const products = result?.key === requestKey ? result.products : [];

  useEffect(() => {
    let cancelled = false;
    const excludeIds = excludeIdsKey ? excludeIdsKey.split('|') : [];

    const load = async () => {
      try {
        const res =
          cartHasItems || excludeIds.length > 0
            ? await fetch(`${API_BASE}/recommendations/cross-sell?top_k=10`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(excludeIds),
              })
            : await fetch(`${API_BASE}/recommendations/?top_k=10`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
              });
        if (!res.ok) throw new Error('rec failed');
        const data: CartRecProduct[] = await res.json();
        if (cancelled) return;

        const filtered = data.filter(
          (p) => !excludeIds.includes(p.product_id) && !p.is_hidden && (p.stock ?? 100) > 0
        );
        const seenImgs = new Set<string>();
        const seenNames = new Set<string>();
        const uniqueList: CartRecProduct[] = [];
        for (const p of filtered) {
          const cleanName = (p.name || '')
            .replace(/\s*-\s*Mẫu\s+\d+/i, '')
            .replace(/\s*-\s*V\d+/i, '')
            .trim()
            .toLowerCase();
          const img = (p.image_url || '').trim();
          if (img && seenImgs.has(img)) continue;
          if (cleanName && seenNames.has(cleanName)) continue;
          if (img) seenImgs.add(img);
          if (cleanName) seenNames.add(cleanName);
          uniqueList.push(p);
        }
        const finalProds = uniqueList.slice(0, 10);
        setResult({ key: requestKey, products: finalProds });

        if (finalProds.length > 0) {
          fetch(`${API_BASE}/recommendations/log-impression`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              placement: 'cart',
              source: 'cart',
              user_id: userId,
              recommended_product_ids: finalProds.map((p) => p.product_id),
            }),
          })
            .then((r) => (r.ok ? r.json() : null))
            .then((resp: { impression_id?: string } | null) => {
              if (resp?.impression_id && !cancelled) {
                setImpressionId(resp.impression_id);
              }
            })
            .catch(() => {});
        }
      } catch {
        if (!cancelled) setResult({ key: requestKey, products: [] });
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [excludeIdsKey, cartHasItems, token, userId, requestKey]);

  const handleTrackClick = (productId: string) => {
    if (impressionId) {
      fetch(`${API_BASE}/recommendations/track-click`, {
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

  const handleQuickAdd = (p: CartRecProduct) => {
    handleTrackClick(p.product_id);
    const size = p.sizes && p.sizes.length > 0 ? p.sizes[0] : 'Free size';
    const color = p.colors && p.colors.length > 0 ? p.colors[0] : '';
    addItem({
      product_id: p.product_id,
      name: p.name,
      price: p.price,
      image_url: p.image_url,
      quantity: 1,
      size,
      color,
      stock: p.stock || 100,
    });
    const variant = [size, color].filter(Boolean).join(', ');
    notifications.show({
      title: 'Đã thêm vào giỏ hàng',
      message: `${p.name} (${variant}). Bạn có thể đổi phân loại ngay trong giỏ.`,
      color: 'green',
    });
  };

  if (loading) {
    return (
      <section className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <div className="h-6 w-64 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-xl h-72 animate-pulse border border-gray-100" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag size={18} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            {cartHasItems ? 'Mua kèm sản phẩm phù hợp với giỏ hàng của bạn' : 'Có thể bạn sẽ thích'}
          </h2>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <AiXRayToggle />
          <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-bold items-center gap-1.5 border border-blue-200/60 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block animate-pulse" />
            ✨ NCF Cross-Sell
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((p) => (
          <CartRecProductCard
            key={p.product_id}
            product={p}
            inCart={items.some((i) => i.product_id === p.product_id)}
            isXRayActive={isXRayActive}
            onTrackClick={handleTrackClick}
            onQuickAdd={handleQuickAdd}
          />
        ))}
      </div>
    </section>
  );
}
