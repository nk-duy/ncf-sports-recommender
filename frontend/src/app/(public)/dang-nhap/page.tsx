import { Suspense } from 'react';
import AuthPortalView from '@/modules/public/dang-nhap/components/AuthPortalView';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100dvh-115px)] flex items-center justify-center bg-slate-900">
          <div className="text-white text-sm">Đang tải biểu mẫu...</div>
        </div>
      }
    >
      <AuthPortalView defaultMode="login" />
    </Suspense>
  );
}
