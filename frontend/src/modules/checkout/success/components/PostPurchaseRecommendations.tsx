import React, { useState, useEffect } from "react";
import { BrainCircuit, ChevronsLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/shared/store/cartStore";

export default function PostPurchaseRecommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    // Tạm thời lấy danh sách sản phẩm mẫu làm gợi ý (trong thực tế sẽ call NCF API)
    fetch("http://localhost:8000/api/v1/products?limit=3")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecommendations(data.slice(0, 3));
        }
      })
      .catch(err => console.error("Lỗi khi lấy gợi ý:", err));
  }, []);

  if (recommendations.length === 0) return null;

  return (
    <section className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-100">
      {/* Section Header with AI Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit size={24} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Gợi ý bổ trợ cho đơn hàng của bạn từ SportsAI Engine
            </h2>
            <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-mono text-[10px] uppercase font-bold tracking-wider border border-blue-100">
              NCF Next-Basket
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Dựa trên đơn hàng bạn vừa mua, thuật toán Neural Collaborative Filtering đề xuất các sản phẩm tối ưu hiệu suất tập luyện:
          </p>
        </div>
        <Link href="/products" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 whitespace-nowrap self-start sm:self-auto transition-colors">
          Xem tất cả gợi ý AI
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Recommendation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((product, idx) => (
          <div key={idx} className="bg-gray-50 rounded-lg p-4 flex flex-col justify-between group hover:bg-gray-100/50 transition-colors border border-gray-100">
            <div>
              <div className="relative w-full aspect-square rounded-md bg-white overflow-hidden mb-3 border border-gray-100">
                <img 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  src={product.image_url || "https://placehold.co/400x400/f3f4f6/a1a1aa?text=SportsAI"}
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/90 backdrop-blur-sm text-[10px] text-blue-600 font-bold shadow-sm">
                  {idx === 0 ? "Khớp 98% mục tiêu" : idx === 1 ? "Phối đồ chuẩn AI" : "Đồng hành rèn luyện"}
                </span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">
                {product.name}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                {product.description || "Sản phẩm chất lượng từ hệ sinh thái SportsAI, nâng tầm trải nghiệm của bạn."}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div>
                <span className="font-mono text-base text-gray-900 font-bold">{(product.price).toLocaleString('vi-VN')} đ</span>
              </div>
              <button 
                onClick={() => {
                  addItem({
                    product_id: product.product_id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image_url: product.image_url,
                    color: product.colors?.[0] || 'Mặc định',
                    size: product.sizes?.[0] || 'Freesize'
                  });
                  alert('Đã thêm sản phẩm gợi ý vào giỏ hàng!');
                }}
                className="h-8 px-3 rounded-md bg-gray-900 text-white hover:bg-black text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm" type="button">
                <ChevronsLeft size={14} />
                <span>Thêm nhanh</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
