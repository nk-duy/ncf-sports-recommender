'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import { useAdminAuthStore } from '@/shared/store/adminAuthStore';
import { getAuthHeaders, getAdminToken } from '@/shared/lib/authHeader';
import AdminSidebar from '@/modules/admin/cot-loi/components/AdminSidebar';
import AdminTopbar from '@/modules/admin/cot-loi/components/AdminTopbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAdminAuthStore();

  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [mobileOpenPathname, setMobileOpenPathname] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kady_admin_sidebar_collapsed') === 'true';
    }
    return false;
  });
  const [pendingOrders, setPendingOrders] = useState<number>(0);

  const mobileMenuOpen = mobileOpenPathname === pathname;

  // 1. Auth Guard: Chặn truy cập khách vãng lai và user không phải Admin
  useEffect(() => {
    let isMounted = true;
    const guardAdmin = async () => {
      const localToken = getAdminToken();
      if (!localToken) {
        if (isMounted) {
          setIsAuthorized(false);
          setAuthChecking(false);
          router.replace(`/dang-nhap?redirect=${encodeURIComponent(pathname)}`);
        }
        return;
      }

      let currentUser = useAdminAuthStore.getState().user;
      if (!currentUser) {
        await useAdminAuthStore.getState().checkAuth();
        currentUser = useAdminAuthStore.getState().user;
      }

      if (!isMounted) return;

      if (!currentUser || currentUser.role !== 'admin') {
        setIsAuthorized(false);
        setAuthChecking(false);
        router.replace(`/dang-nhap?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      setIsAuthorized(true);
      setAuthChecking(false);
    };

    guardAdmin();
    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('kady_admin_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Fetch pending orders count for badge (Poll every 30s)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const res = await fetch(`${apiUrl}/admin/dashboard-stats`, {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data: { pending_orders?: unknown } = await res.json();
          if (typeof data.pending_orders === 'number') {
            setPendingOrders(data.pending_orders);
          }
        }
      } catch {
        // silent fallback
      }
    };

    if (isAuthorized) {
      fetchStats();
      const timer = setInterval(fetchStats, 30000);
      return () => clearInterval(timer);
    }
  }, [isAuthorized]);

  const handleLogout = () => {
    logout();
    router.push('/dang-nhap?redirect=/admin');
  };

  if (authChecking || !isAuthorized) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-white select-none">
        <div className="size-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-4 relative">
          <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse">
            <ShieldAlert size={22} className="text-white" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        </div>
        <h2 className="text-base font-bold tracking-tight text-white mb-1">Xác thực quyền Quản trị viên...</h2>
        <p className="text-xs text-slate-400">Đang kiểm tra chứng thực bảo mật hệ thống KADY Sports</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 flex">
      <AdminSidebar
        pathname={pathname}
        isCollapsed={isCollapsed}
        onToggleCollapsed={toggleCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileOpenPathname(null)}
        pendingOrders={pendingOrders}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar
          user={user}
          onOpenMobileMenu={() => setMobileOpenPathname(pathname)}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
