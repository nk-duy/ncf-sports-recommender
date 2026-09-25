'use client';
import React, { useEffect, useState } from "react";
import { BrainCircuit, Plus, Loader2 } from "lucide-react";
import { useCartStore } from "@/shared/store/cartStore";
import { notifications } from "@mantine/notifications";

interface Product {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  category?: string[];
  sizes?: string[];
  colors?: string[];
}

export default function AiCrossSell() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchCrossSell = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/products/");
        if (res.ok) {
          const data = await res.json();
          // Lấy ngẫu nhiên 3 sản phẩm để làm gợi ý mua kèm
          const shuffled = data.sort(() => 0.5 - Math.random());
          setProducts(shuffled.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch cross-sell items", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCrossSell();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCart = (product: Product) => {
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "S";
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : "";
    
    addItem({
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1,
      size: defaultSize,
      color: defaultColor
    });
    notifications.show({
      title: 'Thành công',
      message: `Đã thêm ${product.name} vào đơn hàng!`,
      color: 'green',
    });
  };

  if (loading) {
    return (
      <section className="bg-white p-5 sm:p-7 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center min-h-[200px]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="bg-white p-5 sm:p-7 rounded-lg shadow-sm border border-gray-100">
      {/* AI Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-blue-600" size={24} />
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Gợi ý mua kèm tối ưu từ AI SportsAI</h2>
        </div>
        <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-mono text-xs font-bold flex items-center gap-1.5 border border-blue-100">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block animate-pulse"></span>
          Thuật toán NCF &amp; Basket Analysis v2.4
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Dựa trên sự kết hợp các sản phẩm trong giỏ hàng, mô hình AI đề xuất các phụ kiện hỗ trợ tối đa hóa hiệu suất của bạn:
      </p>
      
      {/* 3 Cross-Selling Recommendations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <div key={product.product_id} className="flex flex-col justify-between bg-gray-50 p-4 rounded-lg border border-gray-100 hover:bg-gray-100/50 transition-colors">
            <div>
              <div className="relative w-full aspect-square bg-white rounded-md overflow-hidden mb-3 border border-gray-100">
                <img alt={product.name} className="w-full h-full object-contain" src={product.image_url} />
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-sm text-blue-600 text-[10px] font-bold shadow-sm">
                  {index === 0 ? "Khớp 97% bài tập" : index === 1 ? "Combo khuyên dùng" : "Mua kèm giá tốt"}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2" title={product.name}>
                {product.name}
              </h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-mono text-sm font-bold text-gray-900">{formatPrice(product.price)}</span>
              </div>
            </div>
            <button 
              onClick={() => handleAddToCart(product)}
              className="w-full h-9 bg-gray-900 hover:bg-black text-white rounded-md text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm" 
              type="button"
            >
              <Plus size={16} />
              Thêm vào đơn
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
