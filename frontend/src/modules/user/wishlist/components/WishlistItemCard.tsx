"use client";

import { useState } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { WishlistItem, useWishlistStore } from "@/shared/store/wishlistStore";
import { useCartStore } from "@/shared/store/cartStore";
import { notifications } from "@mantine/notifications";

interface WishlistItemCardProps {
  item: WishlistItem;
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80";

export default function WishlistItemCard({ item }: WishlistItemCardProps) {
  const { removeItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const [imgError, setImgError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const displayImage = imgError || !item.image_url ? FALLBACK_IMG : item.image_url;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingToCart(true);

    addItem({
      product_id: item.product_id,
      name: item.name,
      price: item.price || 0,
      image_url: displayImage,
      quantity: 1,
      size: "Tiêu chuẩn",
      color: "Tiêu chuẩn",
      stock: 50,
    });

    notifications.show({
      title: "Thành công",
      message: `Đã thêm ${item.name} vào giỏ hàng!`,
      color: "green",
      autoClose: 2000,
    });

    setTimeout(() => setAddingToCart(false), 500);
  };

  const handleRemoveWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeItem(item.product_id);
    notifications.show({
      title: "Đã cập nhật",
      message: `Đã xóa ${item.name} khỏi danh sách yêu thích`,
      color: "gray",
      autoClose: 2000,
    });
  };

  return (
    <div className="bg-white rounded-xl flex flex-col group overflow-hidden border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all p-4">
      <div className="relative mb-3 aspect-square bg-gray-50 rounded-lg w-full flex items-center justify-center overflow-hidden">
        <Link href={`/san-pham/${item.product_id}`} className="absolute inset-0 z-0">
          <img
            src={displayImage}
            alt={item.name}
            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        </Link>

        <button
          type="button"
          onClick={handleRemoveWishlist}
          title="Bỏ yêu thích"
          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-xs border border-rose-200 text-rose-500 hover:scale-110 shadow-xs transition-transform"
        >
          <Heart size={16} className="fill-rose-500 text-rose-500" />
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">
          {item.category || "THỂ THAO"}
        </span>
        <Link href={`/san-pham/${item.product_id}`}>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {item.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-bold text-base text-gray-900 tabular-nums">
            {item.price ? item.price.toLocaleString("vi-VN") : 0} đ
          </span>
          {item.original_price && (
            <span className="text-xs text-gray-400 line-through tabular-nums">
              {item.original_price}
            </span>
          )}
        </div>

        <div className="mt-auto space-y-1.5 pt-2 border-t border-gray-50">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-all shadow-xs"
          >
            <ShoppingCart size={14} />
            <span>Thêm vào giỏ</span>
          </button>

          <button
            type="button"
            onClick={handleRemoveWishlist}
            className="w-full flex items-center justify-center gap-1.5 border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-medium py-1.5 px-3 rounded-lg transition-colors"
          >
            <Trash2 size={13} />
            <span>Bỏ yêu thích</span>
          </button>
        </div>
      </div>
    </div>
  );
}
