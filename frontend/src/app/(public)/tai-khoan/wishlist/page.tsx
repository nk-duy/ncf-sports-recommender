"use client";
import React, { useEffect, useState } from "react";
import WishlistToolbar from "@/modules/user/wishlist/components/WishlistToolbar";
import ProductCard from "@/modules/public/san-pham/components/ProductCard";
import { useWishlistStore } from "@/shared/store/wishlistStore";
import { Heart } from "lucide-react";

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
          <Heart className="w-16 h-16 mb-4 text-gray-200" />
          <h3 className="text-base font-bold text-gray-900 mb-1">Bạn chưa có sản phẩm yêu thích nào</h3>
          <p className="text-sm text-gray-500 mb-6">Hãy thả tim các sản phẩm bạn quan tâm để lưu lại tại đây nhé!</p>
          <a href="/products" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors">
            Khám phá sản phẩm
          </a>
        </div>
      )}
    </div>
  );
}
