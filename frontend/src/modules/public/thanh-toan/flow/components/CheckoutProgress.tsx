import React from "react";
import Link from "next/link";
import { Home, ChevronRight, Check } from "lucide-react";

export default function CheckoutProgress({ step = 1, currentStep }: { step?: number; currentStep?: number }) {
  const activeStep = currentStep ?? step;
  return (
    <section className="w-full bg-white py-3.5 px-4 sm:px-6 lg:px-8 border-b border-gray-200/90 shadow-2xs">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <Home size={15} />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight size={13} className="text-gray-400" />
          <span className="text-gray-900 font-bold">Quy trình Đặt hàng</span>
        </nav>
        
        {/* Stepped Checkout Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold">
          {/* Step 1: Giỏ hàng */}
          <Link 
            href="/gio-hang"
            className={`flex items-center gap-2 px-2.5 py-1 rounded-full transition-colors ${
              activeStep === 1 
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/70' 
                : activeStep > 1 
                ? 'text-emerald-700 hover:text-emerald-800' 
                : 'text-gray-400'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              activeStep > 1 
                ? 'bg-emerald-600 text-white' 
                : activeStep === 1 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-400'
            }`}>
              {activeStep > 1 ? <Check size={12} strokeWidth={3} /> : '1'}
            </span>
            <span>1. Giỏ hàng</span>
          </Link>

          <div className={`w-6 sm:w-10 h-0.5 transition-colors ${activeStep >= 2 ? 'bg-emerald-500' : 'bg-gray-200'}`} />

          {/* Step 2: Thanh toán & Giao vận */}
          <Link 
            href="/thanh-toan"
            className={`flex items-center gap-2 px-2.5 py-1 rounded-full transition-colors ${
              activeStep === 2 
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/70' 
                : activeStep > 2 
                ? 'text-emerald-700' 
                : 'text-gray-400'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              activeStep > 2 
                ? 'bg-emerald-600 text-white' 
                : activeStep === 2 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-400'
            }`}>
              {activeStep > 2 ? <Check size={12} strokeWidth={3} /> : '2'}
            </span>
            <span>2. Thanh toán &amp; Giao vận</span>
          </Link>

          <div className={`w-6 sm:w-10 h-0.5 transition-colors ${activeStep >= 3 ? 'bg-emerald-500' : 'bg-gray-200'}`} />

          {/* Step 3: Hoàn tất đơn */}
          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full ${
            activeStep === 3 
              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/70' 
              : 'text-gray-400'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              activeStep === 3 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {activeStep === 3 ? <Check size={12} strokeWidth={3} /> : '3'}
            </span>
            <span>3. Hoàn tất đơn</span>
          </div>
        </div>
      </div>
    </section>
  );
}
