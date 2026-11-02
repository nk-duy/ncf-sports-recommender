import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export default function CheckoutTopBar() {
  return (
    <div className="bg-white border-b border-gray-200/80 shadow-xs sticky top-0 z-20">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-18 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-blue-700 font-extrabold text-2xl tracking-tighter group-hover:text-blue-800 transition-colors">
              KADY
            </span>
            <span className="text-gray-300 text-xl font-light">|</span>
            <span className="text-gray-900 text-lg font-bold">Thanh Toán An Toàn</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <Lock size={13} className="text-emerald-600" />
            <span>Bảo mật 256-bit SSL</span>
          </div>
          <Link
            href="/gio-hang"
            className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Quay lại giỏ hàng</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
