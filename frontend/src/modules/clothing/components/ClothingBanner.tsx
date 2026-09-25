'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function ClothingBanner() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/products/?category=Clothing&limit=10');
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch featured clothing products", err);
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
      <div className="bg-[#1A2352] rounded-2xl p-10 text-white relative overflow-hidden mb-8 shadow-sm flex items-center justify-between">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-blue-600/20 skew-x-[-20deg] translate-x-10"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-block px-4 py-1.5 border border-red-500/50 bg-red-500/10 rounded-full text-xs font-semibold tracking-wider mb-5 flex items-center gap-2 w-fit">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-red-400">FLASH SALE - SỐ LƯỢNG CÓ HẠN</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-red-500">
            Xả Kho Quần Áo Thể Thao
          </h1>
          <p className="text-blue-100 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
            Giảm giá lên đến 50% cho toàn bộ bộ sưu tập quần áo thể thao. Sản phẩm chính hãng với công nghệ Dry-Fit siêu thoáng mát. Chốt đơn ngay trước khi hết giờ!
          </p>
        </div>
      </div>
    );
  }

  const currentProduct = featuredProducts[currentIndex];

  return (
    <div className="bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] rounded-2xl p-8 md:p-12 text-white relative overflow-hidden mb-8 shadow-xl flex flex-col md:flex-row items-center justify-between min-h-[360px] group">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30"></div>

      {/* Left Content */}
      <div className="relative z-10 max-w-xl flex-1 mb-8 md:mb-0">
        <div className="flex items-center gap-3 mb-5">
          <div className="inline-block px-4 py-1.5 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-full text-xs font-bold tracking-wider text-red-400">
            🔥 FLASH SALE - GIẢM ĐẾN 50%
          </div>
          <div className="text-xs font-medium text-white/50 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            {currentIndex + 1} / {featuredProducts.length}
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-red-400">
          {currentProduct.name.length > 50 ? currentProduct.name.substring(0, 50) + '...' : currentProduct.name}
        </h1>
        <p className="text-indigo-100/80 text-sm md:text-base leading-relaxed mb-8 max-w-md">
          {currentProduct.brand !== 'Unknown' ? `Thời trang đỉnh cao từ ${currentProduct.brand}. ` : ''} 
          Sản phẩm chính hãng với công nghệ Dry-Fit siêu thoáng mát. Chốt đơn ngay trước khi hết giờ!
        </p>
        
        <div className="flex flex-wrap items-center gap-4">
          <Link href={`/products/${currentProduct.product_id}`} className="px-6 py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-red-500/30 flex items-center gap-2">
            Mua ngay
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
          <div className="flex flex-col">
            <span className="text-xs text-indigo-200/70 font-medium line-through">{(currentProduct.price * 2).toLocaleString('vi-VN')}đ</span>
            <span className="text-xl font-black text-yellow-400">{currentProduct.price.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
      </div>

      {/* Right Content - Product Image */}
      <div className="relative z-10 w-full md:w-1/2 flex justify-center items-center">
        <Link href={`/products/${currentProduct.product_id}`} className="relative group/image block transform transition-transform duration-500 hover:scale-105">
          <div className="absolute inset-0 bg-red-400 rounded-full blur-[60px] opacity-20 group-hover/image:opacity-40 transition-opacity"></div>
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
            className={`transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-8 h-2 bg-red-400' : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  );
}
