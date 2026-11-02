'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client error to console
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Warning Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-md shadow-rose-500/10">
          <AlertTriangle size={32} />
        </div>

        {/* Content Details */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <ShieldAlert size={14} /> Sự cố giao diện tạm thời
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Đã xảy ra lỗi không mong muốn
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Hệ thống KADY Sports đã ghi nhận sự cố. Vui lòng thử tải lại trang hoặc quay về trang chủ để tiếp tục trải nghiệm.
          </p>
          {error?.message && (
            <div className="mt-3 p-3 rounded-xl bg-slate-100 text-left text-xs font-mono text-slate-700 truncate border border-slate-200">
              <code>{error.message}</code>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:flex-1 h-11 px-4 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw size={16} />
            <span>Thử lại ngay</span>
          </button>
          <Link
            href="/"
            className="w-full sm:flex-1 h-11 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home size={16} />
            <span>Về trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
