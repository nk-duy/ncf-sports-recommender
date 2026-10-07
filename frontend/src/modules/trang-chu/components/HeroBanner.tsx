"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroBanner() {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/banners?active_only=true")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setBanners(data);
        } else {
          // Fallback if no banners in DB
          setBanners([
            { _id: '1', title: 'Default Banner', image_url: '/images/hero-shoe.png', link: '#featured-products' }
          ]);
        }
      })
      .catch(err => console.error("Error fetching banners:", err));
  }, []);

  // Auto-play
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  if (banners.length === 0) return null;

  return (
    <section className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[1920/800] max-h-[800px] bg-gray-100 overflow-hidden group">
      {/* Slider Container */}
      <div 
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <Link 
            key={banner._id} 
            href={banner.link || "#"}
            className="w-full h-full flex-shrink-0 relative block"
          >
            <img
              src={banner.image_url}
              alt={banner.title}
              className="w-full h-full object-cover object-center"
            />
          </Link>
        ))}
      </div>

      {/* Navigation Arrows (Visible on hover) */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md"
            aria-label="Previous banner"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md"
            aria-label="Next banner"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex 
                    ? "bg-blue-600 w-8" 
                    : "bg-white/60 hover:bg-white"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
