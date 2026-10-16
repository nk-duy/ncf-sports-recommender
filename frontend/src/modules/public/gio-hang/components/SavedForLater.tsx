import React from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { formatVND } from "@/shared/lib/cart";
import { CartItem, cartKey } from "@/shared/store/cartStore";

interface SavedForLaterProps {
  savedItems: CartItem[];
  moveSavedToCart: (key: string) => void;
  removeSaved: (key: string) => void;
  showNotification: (msg: string) => void;
}

export function SavedForLater({ savedItems, moveSavedToCart, removeSaved, showNotification }: SavedForLaterProps) {
  if (savedItems.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Bookmark size={18} className="text-blue-600" />
        <h2 className="text-base font-bold text-gray-900">Lưu để mua sau ({savedItems.length})</h2>
      </div>
      {savedItems.map((item) => {
        const key = cartKey(item);
        return (
          <div key={key} className="flex items-center gap-4 px-5 py-3 border-b border-gray-50 last:border-b-0">
            <Link href={`/san-pham/${item.product_id}`} className="block w-16 h-16 border border-gray-200 shrink-0">
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/san-pham/${item.product_id}`} className="text-sm font-medium text-gray-900 line-clamp-1 hover:text-blue-600">
                {item.name}
              </Link>
              <div className="text-xs text-gray-500 mt-1">
                Phân loại: {item.size}{item.color ? `, ${item.color}` : ''} · SL: {item.quantity}
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-900 w-28 text-right">{formatVND(item.price)}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  moveSavedToCart(key);
                  showNotification(item.name);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors"
              >
                Chuyển vào giỏ
              </button>
              <button
                onClick={() => removeSaved(key)}
                className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
