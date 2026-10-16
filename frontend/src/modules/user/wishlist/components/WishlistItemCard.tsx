import React from "react";
import { Checkbox } from "@mantine/core";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WishlistItem } from "@/shared/store/wishlistStore";

interface WishlistItemCardProps {
  item: WishlistItem;
}

export default function WishlistItemCard({ item }: WishlistItemCardProps) {
  return (
    <div className="bg-white rounded-xl flex flex-col group overflow-hidden border border-transparent hover:border-gray-200 transition-all p-4 shadow-sm">
      {/* Top section with image and badges */}
      <div className="relative mb-4 aspect-square bg-[#D9D9D9] rounded-lg w-full flex items-center justify-center">
        <Link href={`/san-pham/${item.product_id}`} className="absolute inset-0 z-0">
          {item.image_url ? (
            <Image src={item.image_url} alt={item.name} fill className="object-cover rounded-lg group-hover:scale-105 transition-transform" />
          ) : (
            <span className="text-[10px] text-gray-500 font-mono w-full h-full flex items-center justify-center">img</span>
          )}
        </Link>
        
        {/* Checkbox */}
        <div className="absolute top-2 left-2 z-10">
          <Checkbox color="gray" size="sm" className="bg-white/80 rounded" />
        </div>

        {/* Heart Icon */}
        <button 
          onClick={() => {
            const { toggleItem } = require("@/shared/store/wishlistStore").useWishlistStore.getState();
            toggleItem(item);
          }}
          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 text-red-500 hover:scale-110 transition-transform"
        >
          <Heart size={18} className="fill-red-500" />
        </button>

        {/* Badges */}
        {/* Badges removed since they aren't stored in wishlist */}
        <div className="absolute top-2 left-10 flex flex-col gap-1 z-10">
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
          {item.category}
        </span>
        <Link href={`/san-pham/${item.product_id}`}>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {item.name}
          </h3>
        </Link>
        
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-bold text-lg text-gray-900">
            {item.price ? item.price.toLocaleString("vi-VN") : 0} đ
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 mb-4 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
          <span className="text-[#34C759]">Còn hàng</span>
        </div>
        
        {/* Button */}
        <button className="w-full mt-auto flex items-center justify-center gap-2 bg-[#2D3035] hover:bg-black text-white text-xs font-bold py-2.5 rounded transition-colors disabled:opacity-50 disabled:bg-gray-400">
          <ShoppingCart size={14} />
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
