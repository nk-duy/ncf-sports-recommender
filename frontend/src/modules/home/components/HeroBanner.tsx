import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="bg-gray-950 text-white overflow-hidden relative">
      {/* Sleek background gradients for a premium dark look */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-blue-600/10 blur-[100px]"></div>
        <div className="absolute -left-20 -bottom-20 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-gray-200 font-bold text-[11px] uppercase tracking-widest mb-6">
              <Sparkles size={14} className="text-blue-400" />
              Đại tiệc mua sắm thể thao toàn quốc
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-6 text-white">
              SIÊU SALE 9.9<br />
              GIẢM ĐẾN <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">50%</span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-400 max-w-xl mb-8 font-medium leading-relaxed">
              Khám phá bộ sưu tập giày chạy bộ, trang phục gym & phụ kiện thể thao chính hãng cao cấp. Tối ưu hóa hiệu suất với AI gợi ý dành riêng cho bạn.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
              <Link
                href="#featured-products"
                className="w-full sm:w-auto px-8 h-12 bg-white hover:bg-gray-200 text-gray-950 font-bold text-sm uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Mua sắm ngay</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          
          {/* Right Column: Hero Image with Glassmorphism Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-[4/5] sm:aspect-square rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 p-6 sm:p-8 flex flex-col items-center justify-center shadow-2xl backdrop-blur-sm group">
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white font-black text-sm px-4 py-2 rounded-md shadow-lg transform rotate-3">
                -50%
              </div>
              
              <img
                alt="Premium Running Shoe"
                className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] transform group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-500 ease-out"
                src="/images/hero-shoe.png"
              />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-gray-950/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">
                    Phiên bản giới hạn
                  </span>
                  <span className="text-sm font-bold text-white">
                    Giày Chạy Bộ AI Pro Max
                  </span>
                </div>
                <div className="text-right flex flex-col">
                  <span className="text-blue-400 font-bold text-base font-mono">
                    1.250.000 đ
                  </span>
                  <span className="text-gray-500 text-[11px] line-through font-mono">
                    2.500.000 đ
                  </span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
