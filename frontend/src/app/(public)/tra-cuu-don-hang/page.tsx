import { Suspense } from 'react';
import OrderTrackingView from '@/modules/public/tra-cuu-don-hang/components/OrderTrackingView';

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-slate-400 text-sm font-medium">Đang tải trang tra cứu đơn hàng...</div>
        </div>
      }
    >
      <OrderTrackingView />
    </Suspense>
  );
}
