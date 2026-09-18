"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Info, FileText, Store, Truck } from "lucide-react";

import OrderSuccessHero from "@/modules/checkout/components/OrderSuccessHero";
import OrderSummary from "@/modules/checkout/components/OrderSummary";
import OrderMetadata from "@/modules/checkout/components/OrderMetadata";
import PostPurchaseRecommendations from "@/modules/checkout/components/PostPurchaseRecommendations";
import TrustStrip from "@/modules/checkout/components/TrustStrip";
import TrackingModal from "@/modules/checkout/components/TrackingModal";

export default function CheckoutSuccessPage() {
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen pb-16 flex flex-col w-full">
      {/* Top Stepper Header (Checkout Flow Completed) */}
      <section className="w-full bg-white px-4 sm:px-8 py-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-50 text-green-700 flex items-center justify-center border border-green-100">
              <span className="material-symbols-outlined text-[14px]">check</span>
            </div>
            <span className="text-sm text-gray-900 font-bold hidden sm:inline">1. Giỏ hàng</span>
          </div>
          <div className="flex-1 h-px mx-3 sm:mx-6 bg-green-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-50 text-green-700 flex items-center justify-center border border-green-100">
              <span className="material-symbols-outlined text-[14px]">check</span>
            </div>
            <span className="text-sm text-gray-900 font-bold hidden sm:inline">2. Thanh toán &amp; Giao vận</span>
          </div>
          <div className="flex-1 h-px mx-3 sm:mx-6 bg-green-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              3
            </div>
            <span className="text-sm text-gray-900 font-bold">3. Hoàn tất đơn</span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
        
        <OrderSuccessHero />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <OrderSummary />
          <OrderMetadata />
        </div>

        {/* Action Buttons Row */}
        <section className="bg-white rounded-lg p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
            <Info size={20} className="text-blue-600" />
            <span>Cần thay đổi thông tin nhận hàng trước khi đóng gói? Liên hệ hotline 1900 6868.</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-initial h-10 px-4 rounded-md bg-gray-50 border border-gray-200 text-gray-900 text-sm font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5" type="button">
              <FileText size={16} />
              <span>Tải hóa đơn (PDF)</span>
            </button>
            <Link href="/" className="flex-1 sm:flex-initial h-10 px-4 rounded-md bg-gray-50 border border-gray-200 text-gray-900 text-sm font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5">
              <Store size={16} />
              <span>Tiếp tục mua sắm</span>
            </Link>
            <button 
              onClick={() => setIsTrackingModalOpen(true)}
              className="w-full sm:w-auto h-10 px-5 rounded-md bg-gray-900 text-white text-sm font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm" 
              type="button"
            >
              <Truck size={18} />
              <span>Theo dõi đơn hàng</span>
            </button>
          </div>
        </section>

        <PostPurchaseRecommendations />
        
        <TrustStrip />

      </div>

      <TrackingModal isOpen={isTrackingModalOpen} onClose={() => setIsTrackingModalOpen(false)} />
    </div>
  );
}
