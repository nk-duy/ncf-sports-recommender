'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Printer, Search, ShoppingBag, Store, Truck } from 'lucide-react';
import CheckoutProgress from '../../flow/components/CheckoutProgress';
import TrustStrip from '../../shared/components/TrustStrip';
import type { PublicOrderData } from '../../types';
import OrderSuccessHero from './OrderSuccessHero';
import OrderTimeline from './OrderTimeline';
import OrderSummary from './OrderSummary';
import OrderMetadata from './OrderMetadata';
import PostPurchaseRecommendations from './PostPurchaseRecommendations';
import TrackingModal from './TrackingModal';

export default function CheckoutSuccessView() {
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  const [fetched, setFetched] = useState<{ id: string; data: PublicOrderData | null } | null>(null);
  const loading = Boolean(orderId) && fetched?.id !== orderId;
  const order = orderId && fetched?.id === orderId ? fetched.data : null;

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;

    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const apiUrl = rawApiUrl.endsWith('/api/v1') ? rawApiUrl : `${rawApiUrl}/api/v1`;

    fetch(`${apiUrl}/orders/${encodeURIComponent(orderId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PublicOrderData | null) => {
        if (!cancelled) setFetched({ id: orderId, data });
      })
      .catch(() => {
        if (!cancelled) setFetched({ id: orderId, data: null });
      });

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16 flex flex-col w-full">
      <CheckoutProgress currentStep={3} />

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-6 space-y-5">
        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="size-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">
              Đang chuẩn bị thông tin đơn hàng của bạn...
            </p>
          </div>
        ) : (
          <>
            <OrderSuccessHero order={order} />

            <section className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 py-1 print:hidden">
              <button
                onClick={() => setIsTrackingModalOpen(true)}
                className="h-10 px-4 sm:px-5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                type="button"
                title="Theo dõi lộ trình giao hàng"
                aria-label="Theo dõi lộ trình giao hàng"
              >
                <Truck size={16} />
                <span>Theo dõi lộ trình</span>
              </button>

              <Link
                href={`/tra-cuu-don-hang?order_id=${order?._id || orderId || ''}`}
                className="h-10 px-3.5 sm:px-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                title="Tra cứu đơn hàng"
              >
                <Search size={15} />
                <span>Tra cứu đơn hàng</span>
              </Link>

              <Link
                href="/tai-khoan"
                className="h-10 px-3.5 sm:px-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                title="Lịch sử mua hàng"
              >
                <ShoppingBag size={15} />
                <span>Lịch sử mua hàng</span>
              </Link>

              <button
                onClick={handlePrint}
                className="h-10 px-3.5 sm:px-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                type="button"
                title="In biên lai đơn hàng"
                aria-label="In biên lai đơn hàng"
              >
                <Printer size={15} />
                <span>In hóa đơn</span>
              </button>

              <Link
                href="/san-pham"
                className="h-10 px-4 sm:px-5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-xs ml-auto sm:ml-0"
                title="Tiếp tục mua sắm"
              >
                <Store size={16} />
                <span>Tiếp tục mua sắm</span>
              </Link>
            </section>

            <OrderTimeline order={order} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              <div className="lg:col-span-7 space-y-5">
                <OrderSummary order={order} />
              </div>
              <div className="lg:col-span-5 space-y-5">
                <OrderMetadata order={order} />
              </div>
            </div>
          </>
        )}

        <PostPurchaseRecommendations order={order} />
        <TrustStrip />
      </div>

      <TrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        order={order}
      />
    </div>
  );
}
