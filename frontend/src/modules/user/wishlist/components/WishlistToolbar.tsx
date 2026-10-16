"use client";

import React from "react";
import { Heart, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/shared/store/wishlistStore";

interface WishlistToolbarProps {
  totalItems: number;
}

export default function WishlistToolbar({ totalItems }: WishlistToolbarProps) {
  const { clearAll } = useWishlistStore();

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
          <Heart size={16} className="fill-red-500" />
        </div>
        <span className="text-sm font-semibold text-gray-900">
          Danh sách yêu thích của bạn ({totalItems} sản phẩm)
        </span>
      </div>
      {totalItems > 0 && (
        <button
          onClick={() => {
            if (confirm("Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi danh sách yêu thích?")) {
              clearAll();
            }
          }}
          className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 size={14} />
          Xóa tất cả
        </button>
      )}
    </div>
  );
}
