'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BrainCircuit, Plus, Star } from "lucide-react";
import { notifications } from "@mantine/notifications";
import { useCartStore } from "@/shared/store/cartStore";
import { useAuthStore } from "@/shared/store/authStore";
import { API_BASE, calcOriginalPrice, formatVND } from "@/shared/lib/cart";

interface RecProduct {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  rating?: number;
  reviews_count?: number;
  sizes?: string[];
  colors?: string[];
  stock?: number;
  discount_percent?: number;
  is_hidden?: boolean;
}

/** Gợi ý sản phẩm liên quan: cross-sell theo giỏ hàng (NCF item embeddings), hoặc gợi ý cá nhân hóa khi giỏ trống */
export default function CartRecommendations() {
  const items = useCartStore((s) => s.items);
  const savedItems = useCartStore((s) => s.savedItems);
  const addItem = useCartStore((s) => s.addItem);
  const token = useAuthStore((s) => s.token);

  const [products, setProducts] = useState<RecProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const excludeIdsKey = Array.from(
    new Set([...items, ...savedItems].map((i) => i.product_id))
  ).sort().join('|');
  const cartHasItems = items.length > 0;

  useEffect(() => {
    let cancelled = false;
    const excludeIds = excludeIdsKey ? excludeIdsKey.split('|') : [];

    const load = async () => {
      setLoading(true);
      try {
        const res = cartHasItems || excludeIds.length > 0
          ? await fetch(`${API_BASE}/recommendations/cross-sell?top_k=10`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(excludeIds),
            })
          : await fetch(`${API_BASE}/recommendations/?top_k=10`, {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
        if (!res.ok) throw new Error('rec failed');
        const data: RecProduct[] = await res.json();
        if (cancelled) return;
        const filtered = data.filter(
          (p) => !excludeIds.includes(p.product_id) && !p.is_hidden && (p.stock ?? 100) > 0
        );
        setProducts(filtered.slice(0, 8));
      } catch (e) {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [excludeIdsKey, cartHasItems, token]);

  const handleQuickAdd = (p: RecProduct) => {
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
      <section className="mt-8">
        <div className="h-6 w-64 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-72 animate-pulse border border-gray-100" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-blue-600" size={24} />
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            {cartHasItems ? 'Mua kèm sản phẩm phù hợp với giỏ hàng của bạn' : 'Có thể bạn sẽ thích'}
          </h2>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold flex items-center gap-1.5 border border-blue-100 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block animate-pulse" />
          Gợi ý bởi AI KADY · NCF
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => {
          const original = calcOriginalPrice(p.price, p.discount_percent);
          const hasDiscount = original > p.price;
          const inCart = items.some((i) => i.product_id === p.product_id);
          return (
            <div
              key={p.product_id}
              className="group flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <Link href={`/san-pham/${p.product_id}`} className="relative block aspect-square bg-gray-50 overflow-hidden">
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {hasDiscount && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                    -{p.discount_percent}%
                  </span>
                )}
              </Link>
              <div className="p-3 flex flex-col flex-1">
                <Link
                  href={`/san-pham/${p.product_id}`}
                  className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors min-h-[40px]"
                  title={p.name}
                >
                  {p.name}
                </Link>
                <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  {(p.rating || 0).toFixed(1)}
                  <span>({p.reviews_count || 0})</span>
                </div>
                <div className="flex items-baseline gap-2 mt-2 mb-3">
                  <span className="text-base font-bold text-blue-600">{formatVND(p.price)}</span>
                  {hasDiscount && (
                    <span className="text-xs text-gray-400 line-through">{formatVND(original)}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(p)}
                  className="mt-auto w-full h-9 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus size={16} />
                  {inCart ? 'Thêm nữa' : 'Thêm vào giỏ'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
