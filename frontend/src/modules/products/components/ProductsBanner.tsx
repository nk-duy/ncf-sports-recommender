'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function ProductsBanner() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/products/featured?limit=5');
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (featuredProducts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredProducts]);

  if (loading) {
    return (
      <div className="bg-[#1A2352] rounded-2xl h-[340px] flex items-center justify-center mb-8 shadow-sm">
        <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    // Fallback static banner if no data
    return (
      <div className="bg-[#1A2352] rounded-2xl p-10 text-white relative overflow-hidden mb-8 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-block px-4 py-1.5 border border-white/20 rounded-full text-xs font-semibold tracking-wider mb-5">
            BỘ SƯU TẬP GIÀY 2025
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
            GIÀY THỂ THAO CHÍNH HÃNG
          </h1>
          <p className="text-blue-100 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
            Khám phá hơn 250+ mẫu giày chạy bộ, training, marathon và sneaker thời trang từ các thương
            hiệu hàng đầu thế giới với trợ lực êm ái, bứt phá giới hạn.
          </p>
        </div>
      </div>
    );
  }

  const currentProduct = featuredProducts[currentIndex];

  return (
    <div className="bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] rounded-2xl p-8 md:p-12 text-white relative overflow-hidden mb-8 shadow-xl flex flex-col md:flex-row items-center justify-between min-h-[360px] group">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>

      {/* Left Content */}
      <div className="relative z-10 max-w-xl flex-1 mb-8 md:mb-0">
        <div className="flex items-center gap-3 mb-5">
          <div className="inline-block px-4 py-1.5 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-full text-xs font-bold tracking-wider text-red-400">
            🔥 SIÊU SALE GIẢM ĐẾN 50%
          </div>
          <div className="text-xs font-medium text-white/50 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            {currentIndex + 1} / {featuredProducts.length}
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-200">
          {currentProduct.name.length > 50 ? currentProduct.name.substring(0, 50) + '...' : currentProduct.name}
        </h1>
        <p className="text-sky-100/80 text-sm md:text-base leading-relaxed mb-8 max-w-md">
          {currentProduct.brand !== 'Unknown' ? `Khám phá tuyệt tác từ ${currentProduct.brand}. ` : ''} 
          Trải nghiệm sự thoải mái tối ưu và phong cách vượt trội với thiết kế mới nhất.
        </p>
        
        <div className="flex flex-wrap items-center gap-4">
          <Link href={`/products/${currentProduct.product_id}`} className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-sky-500/30 flex items-center gap-2">
            Xem chi tiết
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
          <div className="flex flex-col">
            <span className="text-xs text-sky-200/70 font-medium line-through">{(currentProduct.price * 2).toLocaleString('vi-VN')}đ</span>
            <span className="text-xl font-black text-red-400">{currentProduct.price.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
      </div>

      {/* Right Content - Product Image */}
      <div className="relative z-10 w-full md:w-1/2 flex justify-center items-center">
        <Link href={`/products/${currentProduct.product_id}`} className="relative group/image block transform transition-transform duration-500 hover:scale-105">
          <div className="absolute inset-0 bg-sky-400 rounded-full blur-[60px] opacity-20 group-hover/image:opacity-40 transition-opacity"></div>
          <img 
            src={currentProduct.image_url} 
            alt={currentProduct.name}
            className="relative z-10 max-h-[280px] object-contain drop-shadow-2xl rounded-xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        </Link>
      </div>

      {/* Carousel Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {featuredProducts.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-8 h-2 bg-sky-400' : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  );
}
