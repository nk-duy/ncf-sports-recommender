"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Brain, 
  Sparkles, 
  SlidersHorizontal, 
  CheckCircle2, 
  Footprints, 
  ArrowRight, 
  Zap, 
  Heart, 
  ShoppingBag, 
  ThumbsUp, 
  Activity, 
  Mountain, 
  Info,
  Package
} from "lucide-react";
import { useAuthStore } from "@/shared/store/authStore";
import { useCartStore } from "@/shared/store/cartStore";
import { useWishlistStore } from "@/shared/store/wishlistStore";
import { notifications } from "@mantine/notifications";

export default function RecommendationsFull() {
  const { user, token, isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [token, isAuthenticated]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch("http://localhost:8000/api/v1/recommendations/?top_k=8", {
        headers
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const displayName = user?.full_name || user?.username || "bạn";
  const preferredSport = (user?.interested_sports && user.interested_sports.length > 0)
    ? user.interested_sports[0]
    : "Chạy bộ Marathon, Gym Thể hình";

  const handleAddToCart = (product: any) => {
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "42";
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : "";
    
    addItem({
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      original_price: product.original_price,
      image_url: product.image_url,
      quantity: 1,
      size: defaultSize,
      color: defaultColor,
      stock: product.stock ?? 100
    });

    notifications.show({
      title: "Thành công",
      message: `Đã thêm ${product.name} vào giỏ hàng!`,
      color: "green"
    });
  };

  const handleToggleWishlist = (product: any) => {
    const added = toggleItem({
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      category: product.category,
      original_price: product.original_price ? product.original_price.toLocaleString("vi-VN") + "đ" : undefined,
      discount_percent: product.discount_percent
    });

    notifications.show({
      title: added ? "Đã lưu yêu thích" : "Đã bỏ yêu thích",
      message: added ? `Đã thêm ${product.name} vào Wishlist` : `Đã xóa ${product.name} khỏi Wishlist`,
      color: added ? "blue" : "gray"
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Title & Subtitle Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600">
            <Brain size={24} />
          </div>
          <h1 className="text-2xl md:text-3xl text-gray-900 font-bold">Gợi ý thông minh dành riêng cho bạn</h1>
        </div>
        <p className="text-base text-gray-500 max-w-3xl leading-relaxed">
          Hệ gợi ý cá nhân hóa NCF (Neural Collaborative Filtering) phân tích sâu theo hành vi tương tác, danh mục quan tâm và lịch sử mua sắm thực tế của bạn.
        </p>
      </div>

      {/* AI Profile Summary Card */}
      <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-8 overflow-hidden flex flex-col gap-6">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-green-500"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="text-blue-600" size={24} />
            <h3 className="text-xl text-gray-900 font-bold">Hồ sơ thị hiếu thể thao của {displayName}</h3>
          </div>
          <Link href="/tai-khoan/settings" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-blue-600 text-sm font-semibold transition-colors">
            <SlidersHorizontal size={16} />
            Tùy chỉnh sở thích trong Cài đặt
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Item 1: Cluster */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
            <span className="text-xs text-gray-500 uppercase font-semibold">Cụm hành vi (Cluster)</span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-gray-900 leading-tight truncate">{preferredSport}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-50 border border-green-100 text-green-700 text-xs font-bold shrink-0">
                NCF Match
              </span>
            </div>
            <span className="text-xs text-gray-500">Hạng: {user?.tier || "Thành viên Thể thao"}</span>
          </div>

          {/* Item 2: Sizes */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
            <span className="text-xs text-gray-500 uppercase font-semibold">Thông số Form dáng AI</span>
            <div className="flex items-center gap-4 text-sm font-bold text-gray-900">
              <span className="flex items-center gap-1.5">
                <span className="text-gray-500 font-normal">Cỡ giày:</span> {user?.shoe_size || "42 EU"}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-gray-500 font-normal">Trang phục:</span> L (Asian-fit)
              </span>
            </div>
            <span className="text-xs text-green-600 flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              Tối ưu cho vóc dáng thể thao
            </span>
          </div>

          {/* Item 3: Sports breakdown */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
            <span className="text-xs text-gray-500 uppercase font-semibold">Độ sẵn sàng của thuật toán</span>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden flex my-1">
              <div className="bg-blue-600 h-full w-[95%]" title="Độ chính xác mô hình: 95%"></div>
            </div>
            <p className="text-xs text-gray-600 truncate">
              Mô hình đã học {recommendations.length} nhóm sản phẩm thể thao tương đồng cao.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: Top AI Picks from Backend */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Footprints className="text-blue-600" size={28} />
            <div>
              <h2 className="text-xl text-gray-900 font-bold">
                Sản phẩm đề xuất bởi thuật toán NCF
              </h2>
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Top AI Recommendations</span>
            </div>
          </div>
          <Link href="/products" className="hidden sm:inline-flex items-center gap-1.5 text-blue-600 text-sm font-semibold hover:underline">
            Xem toàn bộ cửa hàng
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 flex flex-col items-center justify-center">
            <Sparkles className="w-10 h-10 text-blue-600 animate-spin mb-3" />
            <p className="text-gray-500 text-sm font-medium">Đang tính toán ma trận tương tác NCF...</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 flex flex-col items-center justify-center text-center">
            <Package className="w-14 h-14 text-gray-200 mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1">Chưa có đủ dữ liệu tương tác</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-4">
              Hãy lướt xem và mua sắm các sản phẩm để thuật toán AI học thị hiếu thể thao của bạn nhé!
            </p>
            <Link href="/products" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm">
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((product, idx) => {
              const matchScore = product.match_score ? Math.round(product.match_score * 100) : 98 - (idx * 3);
              const wishlisted = isWishlisted(product.product_id);

              return (
                <div key={product.product_id || idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group transition-all duration-200 hover:shadow-md">
                  <div className="relative w-full aspect-square bg-gray-50 overflow-hidden flex items-center justify-center p-4">
                    <img 
                      alt={product.name} 
                      className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300" 
                      src={product.image_url || "https://placehold.co/400x400?text=KADY+Sport"}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-600 text-white text-xs font-bold shadow-sm">
                        <Zap size={14} className="fill-white" />
                        {matchScore}% NCF
                      </span>
                    </div>
                    <button 
                      onClick={() => handleToggleWishlist(product)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-colors shadow-sm ${
                        wishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
                      }`} 
                      title={wishlisted ? "Đã thích" : "Thêm vào yêu thích"}
                    >
                      <Heart size={18} className={wishlisted ? "fill-red-500 text-red-500" : ""} />
                    </button>
                  </div>
                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px] font-semibold w-fit">
                        {product.category || "Thể thao"}
                      </span>
                      <Link href={`/products/${product.product_id}`} className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                      </Link>
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-bold text-gray-900">
                          {product.price.toLocaleString("vi-VN")} đ
                        </span>
                        {product.original_price && (
                          <span className="text-xs text-gray-400 line-through">
                            {product.original_price.toLocaleString("vi-VN")} đ
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full py-2 px-3 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5 active:scale-[0.99]"
                      >
                        <ShoppingBag size={15} />
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Explanatory Footer Box */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 flex items-start gap-4 mt-2">
        <div className="p-2 rounded-lg bg-white text-blue-600 flex-shrink-0 shadow-sm border border-blue-50">
          <Info size={24} />
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-bold text-gray-900">Thuật toán NCF (Neural Collaborative Filtering) hoạt động thế nào?</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Hệ thống kết hợp mô hình ma trận nhân tử hoá tiềm ẩn (GMF) cùng mạng nhiều tầng nơ-ron học sâu (MLP) để mô hình hoá mối tương tác phi tuyến giữa người dùng và sản phẩm thể thao. Các gợi ý được tính toán tự động dựa trên hành vi thực tế và bảo mật riêng tư tuyệt đối trên máy chủ KADY Sports.
          </p>
        </div>
      </div>
    </div>
  );
}
