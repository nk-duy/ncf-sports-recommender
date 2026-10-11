"use client";
import React, { useEffect, useState } from "react";
import WishlistToolbar from "@/modules/tai-khoan/wishlist/components/WishlistToolbar";
import ProductCard from "@/modules/san-pham/components/ProductCard";
import { useWishlistStore } from "@/shared/store/wishlistStore";

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
      <WishlistToolbar totalItems={items.length} />
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((item) => (
          <ProductCard 
            key={item.product_id} 
            product={{
              id: item.product_id,
              name: item.name,
              price: item.price > 0 ? item.price.toLocaleString("vi-VN") + "đ" : "0đ",
              imageUrl: item.image_url,
              category: item.category || "SẢN PHẨM",
              originalPrice: item.original_price,
              discountPercent: item.discount_percent,
              discountLabel: item.discount_label,
            }} 
          />
        ))}
      </div>
      
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p>Bạn chưa có sản phẩm yêu thích nào.</p>
        </div>
      )}
    </div>
  );
}
