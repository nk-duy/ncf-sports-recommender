import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Footprints, Shirt, Droplet } from "lucide-react";
import { mockAIRecommendations } from "../data/mockAccountData";

const iconMap: Record<string, React.ReactNode> = {
  purple: <Footprints className="text-purple-500" size={24} />,
  green: <Shirt className="text-green-500" size={24} />,
  blue: <Droplet className="text-blue-500" size={24} />,
};

const bgMap: Record<string, string> = {
  purple: "bg-purple-50",
  green: "bg-green-50",
  blue: "bg-blue-50",
};

export default function AccountRecommendations() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-yellow-400 mr-4 shadow-inner">
              <Sparkles size={20} className="fill-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Gợi ý AI riêng cho bạn hôm nay
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Dựa trên lịch sử mua sắm môn Chạy bộ & Thể lực của bạn (NCF Model)
              </p>
            </div>
          </div>
          <Link 
            href="/account/recommendations" 
            className="mt-4 md:mt-0 inline-flex items-center justify-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Xem thêm gợi ý <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockAIRecommendations.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group block bg-gray-50/50 hover:bg-gray-50 rounded-xl p-4 border border-gray-100 transition-colors">
              <div className="flex items-center">
                <div className={`w-16 h-16 rounded-lg ${bgMap[product.color] || "bg-gray-100"} flex items-center justify-center mr-4 group-hover:scale-105 transition-transform`}>
                  {iconMap[product.color]}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="font-bold text-gray-900 text-sm mb-1">
                    {product.price.toLocaleString("vi-VN")} đ
                  </div>
                  <div className="text-xs text-gray-500">
                    Độ phù hợp: <span className="font-medium">{product.matchPercentage}%</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
