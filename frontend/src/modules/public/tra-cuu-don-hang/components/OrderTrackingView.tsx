'use client';

import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, HelpCircle, PackageSearch } from 'lucide-react';
import Breadcrumb from '@/shared/components/Breadcrumb';
import { useAuthStore } from '@/shared/store/authStore';
import type { TrackedOrder } from '../types';
import OrderTrackingForm from './OrderTrackingForm';
import OrderDetailsCard from './OrderDetailsCard';

const BREADCRUMB_ITEMS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Tra cứu đơn hàng' },
];

export default function OrderTrackingView() {
  const searchParams = useSearchParams();
  const { token, isAuthenticated } = useAuthStore();

  const urlQueryCode = (
    searchParams?.get('code') ||
    searchParams?.get('order_id') ||
    searchParams?.get('id') ||
    ''
  ).trim();

  const [orderId, setOrderId] = useState(() =>
    urlQueryCode ? (urlQueryCode.startsWith('#') ? urlQueryCode : `#${urlQueryCode}`) : ''
  );
  const [loading, setLoading] = useState(() => Boolean(urlQueryCode.replace(/^#+/, '')));
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState('');
  const [recentOrders, setRecentOrders] = useState<TrackedOrder[]>([]);
  const [searchedCode, setSearchedCode] = useState(() => urlQueryCode);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const apiEndpoint = apiUrl.endsWith('/api/v1') ? apiUrl : `${apiUrl}/api/v1`;

  // Function to search order by code from DB via user interaction
  const executeSearch = useCallback(
    async (codeToSearch: string) => {
      const clean = codeToSearch.trim().replace(/^#+/, '');
      if (!clean) return;

      setLoading(true);
      setError('');
      setOrder(null);
      setSearchedCode(codeToSearch.trim());

      try {
        const res = await fetch(`${apiEndpoint}/orders/${encodeURIComponent(clean)}`);
        if (res.ok) {
          const data: TrackedOrder = await res.json();
          setOrder(data);
        } else {
          setError('NOT_FOUND');
        }
      } catch {
        setError('SERVER_ERROR');
      } finally {
        setLoading(false);
      }
    },
    [apiEndpoint]
  );

  // 1. Fetch user's real orders from DB if authenticated (Smart Authenticated UX)
  useEffect(() => {
    const fetchUserOrders = async () => {
      const activeToken =
        token ||
        (typeof window !== 'undefined'
          ? localStorage.getItem('kady_customer_token') || localStorage.getItem('token')
          : null);
      if (!activeToken) return;

      try {
        const res = await fetch(`${apiEndpoint}/orders/my-orders?limit=6`, {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (res.ok) {
          const data: unknown = await res.json();
          if (Array.isArray(data)) {
            setRecentOrders(data as TrackedOrder[]);
          }
        }
      } catch {
        // Silent catch
      }
    };

    void fetchUserOrders();
  }, [token, isAuthenticated, apiEndpoint]);

  // 2. Check URL search param (e.g. ?code=ORD-18C309 or ?order_id=...)
  useEffect(() => {
    const clean = urlQueryCode.replace(/^#+/, '');
    if (!clean) return;
    let cancelled = false;

    const fetchInitialOrder = async () => {
      try {
        const res = await fetch(`${apiEndpoint}/orders/${encodeURIComponent(clean)}`);
        if (cancelled) return;
        setOrderId(urlQueryCode.startsWith('#') ? urlQueryCode : `#${urlQueryCode}`);
        setSearchedCode(urlQueryCode);
        if (res.ok) {
          const data: TrackedOrder = await res.json();
          if (!cancelled) {
            setOrder(data);
            setError('');
          }
        } else {
          setOrder(null);
          setError('NOT_FOUND');
        }
      } catch {
        if (!cancelled) {
          setOrder(null);
          setError('SERVER_ERROR');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchInitialOrder();
    return () => {
      cancelled = true;
    };
  }, [urlQueryCode, apiEndpoint]);

  const handleFormSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    void executeSearch(orderId);
  };

  const handleSelectRecent = (code: string, ro: TrackedOrder) => {
    setOrderId(`#${code}`);
    if (ro && Array.isArray(ro.items) && ro.items.length > 0) {
      setOrder(ro);
      setError('');
      setSearchedCode(`#${code}`);
    } else {
      void executeSearch(code);
    }
  };

  return (
    <div className="bg-slate-50/70 min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={BREADCRUMB_ITEMS} currentClassName="text-slate-900 font-medium not-italic" />

        <div className="bg-white p-5 sm:p-6 lg:p-7 rounded-3xl border border-slate-200/80 shadow-xs mt-4 sm:mt-6">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <PackageSearch className="w-5 h-5" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-1.5 text-center text-balance tracking-tight">
            Kiểm tra trạng thái đơn hàng
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 text-center mb-6 text-pretty leading-relaxed max-w-md mx-auto">
            Nhập mã đơn hàng của bạn vào bên dưới (ví dụ:{' '}
            <strong className="font-mono text-slate-800 tabular-nums">#ORD-XXXXXX</strong>) để theo dõi tiến trình giao
            hàng theo thời gian thực.
          </p>

          <OrderTrackingForm
            orderId={orderId}
            setOrderId={setOrderId}
            loading={loading}
            error={error}
            onSearch={handleFormSearch}
            recentOrders={recentOrders}
            onSelectRecent={handleSelectRecent}
          />

          {error === 'NOT_FOUND' && (
            <div className="mt-8 p-6 sm:p-8 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-amber-900 mb-1">Không tìm thấy thông tin đơn hàng</h3>
              <p className="text-xs sm:text-sm text-amber-800/90 max-w-md mx-auto text-pretty leading-relaxed mb-4">
                Hệ thống không tìm thấy đơn hàng nào khớp với mã{' '}
                <strong className="font-mono text-amber-950 font-bold tabular-nums">&quot;{searchedCode}&quot;</strong>.
                Vui lòng kiểm tra lại mã trên email xác nhận hoặc hóa đơn thanh toán của bạn.
              </p>
              <div className="inline-flex flex-wrap items-center justify-center gap-2 text-xs text-amber-800 bg-white/90 px-4 py-2 rounded-xl border border-amber-200/80 font-medium">
                <HelpCircle size={14} className="text-amber-600" />
                <span>
                  Gợi ý: Mã đơn hàng chuẩn có định dạng{' '}
                  <strong className="font-mono tabular-nums">#ORD-XXXXXX</strong> (6 ký tự cuối) hoặc mã ID 24 ký tự
                </span>
              </div>
            </div>
          )}

          {error === 'SERVER_ERROR' && (
            <div className="mt-8 p-6 bg-red-50/70 border border-red-200/80 rounded-2xl text-center text-xs sm:text-sm text-red-700">
              <AlertCircle className="w-5 h-5 mx-auto mb-2 text-red-600" />
              <p className="font-bold">Lỗi kết nối đến máy chủ.</p>
              <p className="text-slate-600 mt-1">Vui lòng kiểm tra kết nối mạng và thử lại sau giây lát.</p>
            </div>
          )}

          {order && (
            <div className="mt-8">
              <OrderDetailsCard order={order} />
            </div>
          )}

          {!order && !error && recentOrders.length === 0 && (
            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Chưa có tài khoản hoặc chưa đăng nhập? Bạn vẫn có thể tra cứu nhanh bất kỳ lúc nào bằng mã đơn được gửi
                vào email sau khi thanh toán.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
