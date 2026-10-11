'use client';
import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import ProductCard from "@/modules/san-pham/components/ProductCard";

interface ProductAPI {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  category?: string[];
  rating?: number;
}

export default function NewArrivals() {
  const [products, setProducts] = useState<ProductAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products, we'll reverse the list to simulate "newest" first
        const res = await fetch("http://localhost:8000/api/v1/products/?limit=15");
        if (res.ok) {
          const data = await res.json();
          // Simulate new arrivals by taking from the end or just randomizing/slicing
          const newProducts = data.reverse().slice(0, 5);
          setProducts(newProducts);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading || products.length === 0) return null;

  return (
    <section className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12 bg-white">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-emerald-100 text-emerald-600 font-bold text-[10px] uppercase rounded-sm tracking-wider">Hàng Mới Về</span>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">Sản Phẩm Mới Ra Mắt</h2>
        </div>
        <a href="/san-pham" className="text-sm font-bold text-emerald-600 hover:text-emerald-800 transition-colors flex items-center gap-1 group">
          Xem tất cả 
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {products.map((p: any) => {
          const displayCategory = p.category && p.category.length > 0 ? p.category[p.category.length - 1] : "SẢN PHẨM THỂ THAO";
          const discountPct = p.discount_percent || 0;
          const discountedPrice = discountPct > 0 ? p.price * (1 - discountPct / 100) : p.price;
          
          return (
            <div key={p.product_id} className="relative">
              {/* Badge New */}
              <div className="absolute -top-3 -left-3 z-20 px-3 py-1 bg-emerald-500 text-white font-black text-[10px] uppercase flex items-center justify-center rounded-full shadow-lg border-2 border-white transform -rotate-12">
                NEW
              </div>
              <ProductCard 
                product={{
                  id: p.product_id,
                  name: p.name,
                  price: formatPrice(discountedPrice),
                  originalPrice: discountPct > 0 ? formatPrice(p.price) : undefined,
                  imageUrl: p.image_url,
                  discountLabel: discountPct > 0 ? `-${discountPct}%` : "MỚI",
                  category: displayCategory,
                  discountPercent: discountPct > 0 ? discountPct : undefined,
                }} 
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
