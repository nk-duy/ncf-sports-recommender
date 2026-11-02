import React from 'react';
import Link from 'next/link';
import { Compass, Home, Search, ArrowRight } from 'lucide-react';

export const metadata = {
  title: '404 - Không tìm thấy trang | KADY Sports',
  description: 'Trang bạn tìm kiếm không tồn tại hoặc đã được chuyển hướng.',
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Athletic Compass Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-md shadow-blue-500/10">
          <Compass size={32} />
        </div>

        {/* 404 Headline */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Lỗi 404 - Not Found
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Không tìm thấy trang yêu cầu
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Đường dẫn bạn vừa truy cập không tồn tại, đã bị đổi tên hoặc tạm thời không khả dụng trên hệ thống KADY Sports.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:flex-1 h-11 px-4 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home size={16} />
            <span>Về trang chủ</span>
          </Link>
          <Link
            href="/san-pham"
            className="w-full sm:flex-1 h-11 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search size={16} />
            <span>Xem sản phẩm</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
