"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/shared/store/wishlistStore";
import { useHydrated } from "@/shared/hooks/useHydrated";
import WishlistToolbar from "./WishlistToolbar";
import WishlistItemCard from "./WishlistItemCard";

export default function WishlistView() {
  const { items } = useWishlistStore();
  const mounted = useHydrated();

  useEffect(() => {
    void useWishlistStore.getState().syncWithBackend();
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
      <WishlistToolbar totalItems={items.length} />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((item) => (
          <WishlistItemCard key={item.product_id} item={item} />
        ))}
      </div>

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Heart className="w-16 h-16 mb-4 text-gray-200" />
          <h3 className="text-base font-bold text-gray-900 mb-1">
            Bạn chưa có sản phẩm yêu thích nào
          </h3>
          <Link
            href="/san-pham"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      )}
    </div>
  );
}
