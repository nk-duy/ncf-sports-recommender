'use client';

import Link from 'next/link';
import { Plus, Sparkles, Star } from 'lucide-react';
import { calcOriginalPrice, formatVND } from '@/shared/lib/cart';
import type { AIExplanation } from '@/shared/types/aiExplanation';
import AiXRayInspector from '@/shared/components/AiXRayInspector';

export interface CartRecProduct {
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
  ai_explanation?: AIExplanation;
}

const CART_REC_FALLBACK_IMG =
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80';

interface CartRecProductCardProps {
  product: CartRecProduct;
  inCart: boolean;
  isXRayActive: boolean;
  onTrackClick: (productId: string) => void;
  onQuickAdd: (product: CartRecProduct) => void;
}

export default function CartRecProductCard({
  product: p,
  inCart,
  isXRayActive,
  onTrackClick,
  onQuickAdd,
}: CartRecProductCardProps) {
  const original = calcOriginalPrice(p.price, p.discount_percent);
  const hasDiscount = original > p.price;

  return (
    <div className="group flex flex-col justify-between bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-transform duration-200">
      <div>
        <Link
          href={`/san-pham/${p.product_id}`}
          onClick={() => onTrackClick(p.product_id)}
          className="relative block aspect-square bg-gray-50 overflow-hidden"
        >
          <img
            src={p.image_url || CART_REC_FALLBACK_IMG}
            alt={p.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = CART_REC_FALLBACK_IMG;
            }}
          />
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
            {p.ai_explanation?.match_percent ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold shadow-md tabular-nums">
                <Sparkles size={9} className="text-yellow-300" />
                {p.ai_explanation.match_percent}% Phù hợp
              </span>
            ) : null}
            {hasDiscount && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded tabular-nums">
                -{p.discount_percent}%
              </span>
            )}
          </div>
        </Link>
        <div className="p-3 pb-1">
          <Link
            href={`/san-pham/${p.product_id}`}
            onClick={() => onTrackClick(p.product_id)}
            className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors min-h-[2.5rem] leading-snug"
            title={p.name}
          >
            {p.name}
          </Link>

          {p.ai_explanation?.reason && (
            <div className="mt-1.5 mb-1">
              <span
                className="inline-flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50/80 px-1.5 py-0.5 rounded max-w-full truncate font-medium border border-blue-100/60"
                title={p.ai_explanation.reason}
              >
                <Sparkles size={9} className="shrink-0 text-blue-500" />
                <span className="truncate">{p.ai_explanation.reason}</span>
              </span>
            </div>
          )}

          {isXRayActive && p.ai_explanation && (
            <div className="my-2">
              <AiXRayInspector explanation={p.ai_explanation} />
            </div>
          )}

          <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500 tabular-nums">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span>{(p.rating || 0).toFixed(1)}</span>
            <span className="text-gray-400">({p.reviews_count || 0})</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2 mb-2">
            <span className="text-base font-bold text-blue-600 tabular-nums">{formatVND(p.price)}</span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through tabular-nums">{formatVND(original)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 pt-0">
        <button
          type="button"
          onClick={() => onQuickAdd(p)}
          className="w-full h-9 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>{inCart ? 'Thêm nữa' : 'Thêm vào giỏ'}</span>
        </button>
      </div>
    </div>
  );
}
