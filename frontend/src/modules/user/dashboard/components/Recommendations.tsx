"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ThumbsUp, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/shared/store/authStore";
import {
  DEFAULT_RECOMMENDED_SPORT_IMG,
  type UserRecommendedProduct,
} from "@/modules/user/recommendations/types";

export default function AccountRecommendations() {
  const { token, isAuthenticated } = useAuthStore();
  const [recommendations, setRecommendations] = useState<UserRecommendedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch(`${apiUrl}/api/v1/recommendations/?top_k=3`, {
        headers,
      });
      if (res.ok) {
        const data: UserRecommendedProduct[] = await res.json();
        setRecommendations(data);
      }
    } catch {
      // ignore transient network errors
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void fetchRecommendations();
  }, [fetchRecommendations, isAuthenticated]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-4">
              <ThumbsUp size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Gợi ý dành riêng cho bạn hôm nay
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Dựa trên sở thích và các môn thể thao quan tâm của bạn
              </p>
            </div>
          </div>
          <Link
            href="/tai-khoan/recommendations"
            className="mt-4 md:mt-0 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            Xem thêm gợi ý <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-3 text-center text-gray-500 py-8">
              Đang tải gợi ý sản phẩm...
            </div>
          ) : recommendations.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500 py-8">
              Chưa đủ dữ liệu để gợi ý. Hãy mua sắm thêm nhé!
            </div>
          ) : (
            recommendations.map((product, idx) => {
              const matchPercentage = product.match_score
                ? Math.round(product.match_score * 100)
                : 98 - idx * 4;
              const imageUrl =
                product.image_url || product.image || DEFAULT_RECOMMENDED_SPORT_IMG;

              return (
                <Link
                  key={product.product_id || idx}
                  href={`/san-pham/${product.product_id}`}
                  className="group block bg-gray-50/50 hover:bg-gray-50 rounded-xl p-4 border border-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="size-14 rounded-lg overflow-hidden shrink-0 mr-3.5 border border-gray-200/80 bg-gray-100 shadow-xs group-hover:scale-105 transition-transform">
                      <img
                        src={imageUrl}
                        alt={product.name || "Sản phẩm gợi ý"}
                        className="rounded-lg size-14 object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DEFAULT_RECOMMENDED_SPORT_IMG;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="font-bold text-gray-900 text-sm mb-1">
                        {Number(product.price || 0).toLocaleString("vi-VN")} đ
                      </div>
                      <div className="text-xs text-gray-500">
                        Độ phù hợp:{" "}
                        <span className="font-semibold text-green-600">
                          {matchPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
