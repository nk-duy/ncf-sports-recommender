'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import type { CartItem } from '@/shared/store/cartStore';
import { formatVND } from '@/shared/lib/cart';

const CHECKOUT_ITEM_FALLBACK_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80';

interface CheckoutItemsCollapsibleProps {
  items: CartItem[];
  isExpanded: boolean;
  onToggle: () => void;
}

export default function CheckoutItemsCollapsible({
  items,
  isExpanded,
  onToggle,
}: CheckoutItemsCollapsibleProps) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span>Danh sách sản phẩm</span>
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 font-medium cursor-pointer"
        >
          <span>{isExpanded ? 'Thu gọn' : 'Xem chi tiết'}</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {isExpanded && (
        <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1 space-y-2">
          {items.map((item) => (
            <div key={`${item.product_id}-${item.size}-${item.color}`} className="py-2.5 flex items-center gap-3">
              <div className="relative size-16 rounded-md overflow-hidden border border-gray-200/80 bg-gray-50 shrink-0">
                <img
                  src={item.image_url || CHECKOUT_ITEM_FALLBACK_IMG}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = CHECKOUT_ITEM_FALLBACK_IMG;
                  }}
                />
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs tabular-nums">
                  {item.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-gray-900 line-clamp-1">{item.name}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md font-medium">
                    Size: {item.size}
                  </span>
                  {item.color && (
                    <span className="text-[11px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md font-medium">
                      {item.color}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-gray-900 tabular-nums">
                  {formatVND(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
