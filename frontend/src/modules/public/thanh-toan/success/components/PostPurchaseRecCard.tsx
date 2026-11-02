'use client';

import Link from 'next/link';
import { Activity, ShoppingBag, Sparkles, Star } from 'lucide-react';
import AiXRayInspector from '@/shared/components/AiXRayInspector';
import type { PostPurchaseRecProduct } from '../../types';

const POST_PURCHASE_FALLBACK_IMG =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80';

interface PostPurchaseRecCardProps {
  product: PostPurchaseRecProduct;
  productId: string;
  isXRayActive: boolean;
  onTrackClick: (productId: string) => void;
  onQuickAdd: (product: PostPurchaseRecProduct, productId: string) => void;
}

export default function PostPurchaseRecCard({
  product,
  productId,
  isXRayActive,
  onTrackClick,
  onQuickAdd,
}: PostPurchaseRecCardProps) {
  const detailUrl = `/san-pham/${productId}`;
  const sportLabel = product.sport_type || product.category?.[0] || 'Thể thao';

  return (
    <div className="bg-slate-50/70 rounded-xl p-3.5 flex flex-col justify-between group hover:bg-blue-50/30 hover:border-blue-200 transition-colors border border-slate-200/80 shadow-2xs">
      <div>
        <Link href={detailUrl} onClick={() => onTrackClick(productId)} className="block">
          <div className="relative w-full aspect-square rounded-lg bg-white overflow-hidden mb-2.5 border border-slate-200/80 p-2 flex items-center justify-center">
            <img
              alt={product.name || 'Sản phẩm gợi ý'}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
              src={product.image_url || POST_PURCHASE_FALLBACK_IMG}
              onError={(e) => {
                e.currentTarget.src = POST_PURCHASE_FALLBACK_IMG;
              }}
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-[10px] text-white font-bold shadow-xs flex items-center gap-1 tabular-nums">
              <Sparkles size={10} className="text-yellow-300" />
              <span>{product.ai_explanation?.match_percent || 92}% Phù hợp</span>
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1 mb-1 text-[11px] font-medium text-slate-500">
          <Activity size={11} className="text-blue-500 shrink-0" />
          <span className="truncate">{sportLabel}</span>
        </div>

        <h4 className="font-bold text-slate-900 text-sm line-clamp-2 min-h-[2.5rem] mb-1 group-hover:text-blue-600 transition-colors">
          <Link href={detailUrl} onClick={() => onTrackClick(productId)}>
            {product.name}
          </Link>
        </h4>

        {product.ai_explanation?.reason && (
          <div className="mb-2">
            <span
              className="inline-flex items-center gap-1 text-[11px] text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded max-w-full truncate font-medium border border-blue-100/60"
              title={product.ai_explanation.reason}
            >
              <Sparkles size={10} className="shrink-0 text-blue-500" />
              <span className="truncate">{product.ai_explanation.reason}</span>
            </span>
          </div>
        )}

        {isXRayActive && product.ai_explanation && (
          <div className="mb-2.5">
            <AiXRayInspector explanation={product.ai_explanation} />
          </div>
        )}

        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center text-amber-400">
            <Star size={12} className="fill-amber-400" />
            <span className="text-xs font-bold text-slate-700 ml-1 font-sans tabular-nums">
              {product.rating || 4.9}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-sans tabular-nums">
            ({product.reviews_count || 16} đánh giá)
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 mt-auto">
        <div>
          <span className="font-bold text-sm sm:text-base text-slate-900 font-sans tabular-nums">
            {(product.price || 0).toLocaleString('vi-VN')} đ
          </span>
        </div>
        <button
          onClick={() => onQuickAdd(product, productId)}
          className="h-8 px-2.5 sm:px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors duration-150 shadow-xs cursor-pointer"
          type="button"
          title="Thêm vào giỏ hàng"
          aria-label="Thêm vào giỏ hàng"
        >
          <ShoppingBag size={13} />
          <span>+ Thêm</span>
        </button>
      </div>
    </div>
  );
}
