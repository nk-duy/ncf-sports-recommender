import { Suspense } from 'react';
import CheckoutSuccessView from '@/modules/public/thanh-toan/success/components/CheckoutSuccessView';

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-medium text-slate-500">Đang tải...</div>}>
      <CheckoutSuccessView />
    </Suspense>
  );
}
