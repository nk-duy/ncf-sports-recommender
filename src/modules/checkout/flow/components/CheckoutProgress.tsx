import React from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

export default function CheckoutProgress() {
  return (
    <section className="w-full bg-white py-3 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm font-semibold text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors flex items-center gap-1">
            <Home size={16} />
            Trang chủ
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-bold">Giỏ hàng &amp; Thanh toán SportsAI</span>
        </nav>
        
        {/* Stepped Checkout Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-gray-900 font-bold">
            <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px]">1</span>
            <span>Giỏ hàng</span>
          </div>
          <div className="w-8 h-px bg-gray-900"></div>
          <div className="flex items-center gap-1.5 text-gray-900 font-bold">
            <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px]">2</span>
            <span>Thanh toán &amp; Giao vận</span>
          </div>
          <div className="w-8 h-px bg-gray-300"></div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[10px]">3</span>
            <span>Hoàn tất đơn</span>
          </div>
        </div>
      </div>
    </section>
  );
}
