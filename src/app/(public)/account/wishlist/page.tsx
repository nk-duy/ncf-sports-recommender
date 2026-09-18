import React from "react";
import WishlistToolbar from "@/modules/account/components/WishlistToolbar";
import WishlistItemCard from "@/modules/account/components/WishlistItemCard";
import { mockWishlistItems } from "@/modules/account/data/mockAccountData";

export default function WishlistPage() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
      <WishlistToolbar totalItems={mockWishlistItems.length} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockWishlistItems.map((item) => (
          <WishlistItemCard key={item.id} item={item} />
        ))}
      </div>
      
      {mockWishlistItems.length === 0 && (
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
