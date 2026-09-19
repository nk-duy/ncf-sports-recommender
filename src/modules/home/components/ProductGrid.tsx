import React from "react";
import ProductCard from "@/modules/products/components/ProductCard";
import productsData from "@/data/products.json";

export default function ProductGrid() {
  // Format the raw product data to match the ProductCard interface
  const products = productsData.map((item) => ({
    id: item.id,
    name: item.name,
    price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price),
    imageUrl: item.image_url,
  }));

  return (
    <section id="featured-products" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sleek Minimalist Header */}
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <div className="flex items-center gap-4 w-full max-w-sm mb-4 opacity-50">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nổi bật nhất</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-3">
            Top Thịnh Hành
          </h2>
          <p className="text-sm font-medium text-gray-500 max-w-md mx-auto">
            Bộ sưu tập thời trang và phụ kiện thể thao được lựa chọn nhiều nhất tuần này nhờ thuật toán AI phân tích xu hướng.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
      </div>
    </section>
  );
}
