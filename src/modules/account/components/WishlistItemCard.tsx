import React from "react";
import { Checkbox } from "@mantine/core";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";

interface WishlistItem {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number | null;
  inStock: boolean;
  stockWarning: string | null;
  image: string | null;
  isBestseller: boolean;
  discountBadge: string | null;
}

interface WishlistItemCardProps {
  item: WishlistItem;
}

export default function WishlistItemCard({ item }: WishlistItemCardProps) {
  return (
    <div className="bg-white rounded-xl flex flex-col group overflow-hidden border border-transparent hover:border-gray-200 transition-all p-4 shadow-sm">
      {/* Top section with image and badges */}
      <div className="relative mb-4 aspect-square bg-[#D9D9D9] rounded-lg w-full flex items-center justify-center">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover rounded-lg" />
        ) : (
          <span className="text-[10px] text-gray-500 font-mono">img</span>
        )}
        
        {/* Checkbox */}
        <div className="absolute top-2 left-2 z-10">
          <Checkbox color="gray" size="sm" className="bg-white/80 rounded" />
        </div>

        {/* Heart Icon */}
        <button className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 text-red-500 hover:scale-110 transition-transform">
          <Heart size={18} className="fill-red-500" />
        </button>

        {/* Badges */}
        <div className="absolute top-2 left-10 flex flex-col gap-1 z-10">
          {item.isBestseller && (
            <span className="bg-[#F5A623] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              Bán chạy
            </span>
          )}
          {item.discountBadge && (
            <span className="bg-[#D0021B] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              {item.discountBadge}
            </span>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
          {item.category}
        </span>
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
          {item.name}
        </h3>
        
        <div className="flex items-baseline gap-2 mb-2">
          <span className={`font-bold text-lg ${item.discountBadge ? 'text-[#D0021B]' : 'text-gray-900'}`}>
            {item.price.toLocaleString("vi-VN")} đ
          </span>
          {item.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {item.originalPrice.toLocaleString("vi-VN")} đ
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 mb-4 text-xs font-medium">
          {item.stockWarning ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]"></span>
              <span className="text-[#F5A623]">{item.stockWarning}</span>
            </>
          ) : item.inStock ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
              <span className="text-[#34C759]">Còn hàng</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              <span className="text-gray-500">Hết hàng</span>
            </>
          )}
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
