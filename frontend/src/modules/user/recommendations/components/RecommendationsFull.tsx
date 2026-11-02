"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  ThumbsUp,
  Info,
  Package,
} from "lucide-react";
import { useAuthStore } from "@/shared/store/authStore";
import { useWishlistStore } from "@/shared/store/wishlistStore";
import { notifications } from "@mantine/notifications";
import QuickAddToCartModal, {
  type QuickAddProduct,
} from "@/shared/components/QuickAddToCartModal";
import type { UserRecommendedProduct } from "../types";
import SportTasteProfileCard from "./SportTasteProfileCard";
import RecommendationProductCard from "./RecommendationProductCard";

export default function RecommendationsFull() {
  const { user, token, isAuthenticated } = useAuthStore();
  const { toggleItem, isWishlisted } = useWishlistStore();

  const [recommendations, setRecommendations] = useState<UserRecommendedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalProduct, setModalProduct] = useState<QuickAddProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/recommendations/?top_k=12`, {
        headers,
      });
      if (res.ok) {
        const data: UserRecommendedProduct[] = await res.json();
        setRecommendations(data);
      }
    } catch {
      // keep empty/previous recommendations on network error
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void fetchRecommendations();
  }, [fetchRecommendations, isAuthenticated]);

  const displayName = user?.full_name || user?.username || "bạn";
  const preferredSport =
    user?.interested_sports && user.interested_sports.length > 0
      ? user.interested_sports[0]
      : "Chạy bộ Marathon, Gym Thể hình";

  const handleAddToCart = (product: UserRecommendedProduct) => {
    setModalProduct({
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      original_price: product.original_price,
      discount_percent: product.discount_percent,
      image_url: product.image_url,
      sizes: product.sizes,
      colors: product.colors,
      stock: product.stock ?? 100,
      category: Array.isArray(product.category)
        ? product.category
        : product.category
          ? [product.category]
          : undefined,
      sport_type: product.sport_type,
    });
    setIsModalOpen(true);
  };

  const handleToggleWishlist = (product: UserRecommendedProduct) => {
    const categoryLabel = Array.isArray(product.category)
      ? product.category[0]
      : product.category;
    const added = toggleItem({
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      category: categoryLabel,
      original_price: product.original_price
        ? product.original_price.toLocaleString("vi-VN") + "đ"
        : undefined,
      discount_percent: product.discount_percent,
    });

    notifications.show({
      title: added ? "Đã lưu yêu thích" : "Đã bỏ yêu thích",
      message: added
        ? `Đã thêm ${product.name} vào Wishlist`
        : `Đã xóa ${product.name} khỏi Wishlist`,
      color: added ? "blue" : "gray",
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Title & Subtitle Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600">
            <ThumbsUp size={22} />
          </div>
          <h1 className="text-2xl md:text-3xl text-gray-900 font-bold">
            Gợi ý dành riêng cho bạn
          </h1>
        </div>
        <p className="text-base text-gray-500 max-w-3xl leading-relaxed">
          Danh sách sản phẩm được chọn lọc theo sở thích thể thao, danh mục quan tâm và lịch sử mua sắm của bạn.
        </p>
      </div>

      <SportTasteProfileCard
        displayName={displayName}
        preferredSport={preferredSport}
        tier={user?.tier}
        shoeSize={user?.shoe_size}
      />

      {/* Product Picks */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-blue-600" size={26} />
            <div>
              <h2 className="text-xl text-gray-900 font-bold">Sản phẩm đề xuất cho bạn</h2>
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                Lựa chọn phù hợp nhất
              </span>
            </div>
          </div>
          <Link
            href="/san-pham"
            className="hidden sm:inline-flex items-center gap-1.5 text-blue-600 text-sm font-semibold hover:underline"
          >
            Xem toàn bộ cửa hàng
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-500 text-sm font-medium">
              Đang tải danh sách sản phẩm gợi ý...
            </p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 flex flex-col items-center justify-center text-center">
            <Package className="w-14 h-14 text-gray-200 mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Chưa có đủ dữ liệu tương tác
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mb-4">
              Hãy lướt xem và mua sắm các sản phẩm để hệ thống ghi nhận sở thích thể thao của bạn nhé!
            </p>
            <Link
              href="/san-pham"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((product, idx) => (
              <RecommendationProductCard
                key={product.product_id || idx}
                product={product}
                wishlisted={isWishlisted(product.product_id)}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Explanatory Footer Box */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 flex items-start gap-4 mt-2">
        <div className="p-2 rounded-lg bg-white text-blue-600 shrink-0 shadow-sm border border-blue-50">
          <Info size={24} />
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-bold text-gray-900">Cách KADY lựa chọn gợi ý cho bạn</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Hệ thống tự động phân tích các bộ môn thể thao bạn quan tâm, kích thước form dáng thường chọn và lịch sử mua sắm để đề xuất những sản phẩm phù hợp nhất với nhu cầu tập luyện.
          </p>
        </div>
      </div>

      <QuickAddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={modalProduct}
      />
    </div>
  );
}
