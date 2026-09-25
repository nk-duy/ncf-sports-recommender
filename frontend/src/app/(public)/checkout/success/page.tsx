"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Info, FileText, Store, Truck, Check } from "lucide-react";

import OrderSuccessHero from "@/modules/checkout/success/components/OrderSuccessHero";
import OrderSummary from "@/modules/checkout/success/components/OrderSummary";
import OrderMetadata from "@/modules/checkout/success/components/OrderMetadata";
import PostPurchaseRecommendations from "@/modules/checkout/success/components/PostPurchaseRecommendations";
import TrustStrip from "@/modules/checkout/shared/components/TrustStrip";
import TrackingModal from "@/modules/checkout/success/components/TrackingModal";

function CheckoutSuccessContent() {
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetch(`http://localhost:8000/api/v1/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          setOrder(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  return (
    <div className="bg-gray-50 min-h-screen pb-16 flex flex-col w-full">
      {/* Top Stepper Header (Checkout Flow Completed) */}
      <section className="w-full bg-white px-4 sm:px-8 py-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="text-sm text-green-600 font-bold hidden sm:inline">1. Giỏ hàng</span>
          </div>
          <div className="flex-1 h-px mx-3 sm:mx-6 bg-green-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="text-sm text-green-600 font-bold hidden sm:inline">2. Thanh toán &amp; Giao vận</span>
          </div>
          <div className="flex-1 h-px mx-3 sm:mx-6 bg-green-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              3
            </div>
            <span className="text-sm text-blue-600 font-bold">3. Hoàn tất đơn</span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 md:py-10 space-y-8">
        
        {loading ? (
          <div className="text-center py-20">Đang tải thông tin đơn hàng...</div>
        ) : (
          <>
            <OrderSuccessHero order={order} />

            {/* Compact Action Buttons Row */}
            <section className="flex flex-wrap items-center justify-center gap-3">
              <Link href={`/profile/orders/${orderId}`} className="h-11 px-6 rounded-full bg-white border border-gray-200 text-blue-700 text-sm font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                <FileText size={18} />
                <span>Xem lại đơn hàng</span>
              </Link>
              <button 
                onClick={() => setIsTrackingModalOpen(true)}
                className="h-11 px-6 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm" 
                type="button"
              >
                <Truck size={18} />
                <span>Theo dõi lộ trình</span>
              </button>
              <Link href="/" className="h-11 px-6 rounded-full bg-gray-900 text-white text-sm font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm">
                <Store size={18} />
                <span>Tiếp tục mua sắm</span>
              </Link>
            </section>

            {/* Expandable Order Details (Made more compact) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-base">Tóm tắt đơn hàng</h3>
                <span className="text-sm text-gray-500 font-medium">#{orderId}</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Reuse existing components but they will adapt to the new grid */}
                  <OrderSummary order={order} />
                  <OrderMetadata order={order} />
                </div>
              </div>
            </div>
          </>
        )}

        <PostPurchaseRecommendations />
        
        <TrustStrip />

      </div>

      <TrackingModal isOpen={isTrackingModalOpen} onClose={() => setIsTrackingModalOpen(false)} order={order} />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Đang tải...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

