import React from "react";
import ProductCard from "@/modules/san-pham/components/ProductCard";

// Interface matches backend response
interface ProductAPI {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  category?: string[];
  rating?: number;
}

export default async function ProductGrid() {
  // Fetch from FastAPI backend
  let products: ProductAPI[] = [];
  try {
    const res = await fetch("http://localhost:8000/api/v1/products/?limit=16", {
      cache: "no-store", // disable caching for dynamic updates
    });
    if (res.ok) {
      products = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <section id="featured-products" className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Sleek Minimalist Header */}
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <div className="flex items-center gap-4 w-full max-w-sm mb-4 opacity-80">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent flex-1"></div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">Nổi bật nhất</span>
            <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent flex-1"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight mb-4">
            Top Thịnh Hành
          </h2>
          <p className="text-sm md:text-base font-medium text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Bộ sưu tập thời trang và phụ kiện thể thao được lựa chọn nhiều nhất tuần này nhờ thuật toán AI phân tích xu hướng.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p: any) => {
            // Lấy category cuối cùng hoặc đầu tiên để hiển thị nếu có
            const displayCategory = p.category && p.category.length > 0 ? p.category[p.category.length - 1] : "SẢN PHẨM THỂ THAO";
            const discountPct = p.discount_percent || 0;
            const discountedPrice = discountPct > 0 ? p.price * (1 - discountPct / 100) : p.price;
            
            return (
              <ProductCard 
                key={p.product_id} 
                product={{
                  id: p.product_id,
                  name: p.name,
                  price: formatPrice(discountedPrice),
                  originalPrice: discountPct > 0 ? formatPrice(p.price) : undefined,
                  imageUrl: p.image_url,
                  discountLabel: discountPct > 0 ? `-${discountPct}%` : (p.rating ? `⭐ ${p.rating}` : "MỚI"),
                  category: displayCategory,
                  discountPercent: discountPct > 0 ? discountPct : undefined,
                }} 
              />
            )
          })}
        </div>
        
      </div>
    </section>
  );
}
