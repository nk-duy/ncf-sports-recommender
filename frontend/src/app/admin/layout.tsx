'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  LogOut, 
  Gift, 
  Tags, 
  Layers, 
  Image as ImageIcon, 
  MapPin, 
  Users, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Store,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '@/shared/store/authStore';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badgeKey?: 'pendingOrders';
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<number>(0);

  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Restore sidebar collapsed state
  useEffect(() => {
    const saved = localStorage.getItem('kady_admin_sidebar_collapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('kady_admin_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Fetch pending orders count for badge (Poll every 30s)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const res = await fetch(`${apiUrl}/admin/dashboard-stats`);
        if (res.ok) {
          const data = await res.json();
          if (typeof data.pending_orders === 'number') {
            setPendingOrders(data.pending_orders);
          }
        }
      } catch (err) {
        // silent fallback
      }
    };

    fetchStats();
    const timer = setInterval(fetchStats, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/dang-nhap');
  };

  // Hạng mục 1: Tái cấu trúc theo 3 nhóm nghiệp vụ
  const navGroups: NavGroup[] = [
    {
      title: 'BÁN HÀNG & VẬN HÀNH',
      items: [
        { name: 'Tổng quan', path: '/admin', icon: <LayoutDashboard size={19} /> },
        { 
          name: 'Đơn hàng', 
          path: '/admin/don-hang', 
          icon: <ShoppingCart size={19} />, 
          badgeKey: 'pendingOrders' 
        },
        { name: 'Sản phẩm', path: '/admin/san-pham', icon: <Package size={19} /> },
        { name: 'Khách hàng', path: '/admin/khach-hang', icon: <Users size={19} /> },
      ],
    },
    {
      title: 'MARKETING & NỘI DUNG',
      items: [
        { name: 'Khuyến mãi', path: '/admin/khuyen-mai', icon: <Gift size={19} /> },
        { name: 'Banner', path: '/admin/banners', icon: <ImageIcon size={19} /> },
      ],
    },
    {
      title: 'HỆ THỐNG & CẤU HÌNH',
      items: [
        { name: 'Danh mục', path: '/admin/danh-muc', icon: <Layers size={19} /> },
        { name: 'Thuộc tính', path: '/admin/thuoc-tinh', icon: <Tags size={19} /> },
      ],
    },
  ];

  const isItemActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname.startsWith(path);
  };

  const renderNavLinks = (forMobile = false) => {
    return (
      <div className="space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx}>
            {(!isCollapsed || forMobile) && (
              <p className="px-3 mb-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                {group.title}
              </p>
            )}
            {isCollapsed && !forMobile && (
              <div className="w-8 mx-auto my-2 border-t border-gray-100" />
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isItemActive(item.path);
                const hasPendingBadge = item.badgeKey === 'pendingOrders' && pendingOrders > 0;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    title={isCollapsed && !forMobile ? item.name : undefined}
                    className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 group ${
                      active
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                    } ${isCollapsed && !forMobile ? 'justify-center px-0' : ''}`}
                  >
                    <div className="relative shrink-0">
                      {item.icon}
                      {/* Pulse dot badge when sidebar is collapsed */}
                      {isCollapsed && !forMobile && hasPendingBadge && (
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                        </span>
                      )}
                    </div>

                    {(!isCollapsed || forMobile) && (
                      <span className="flex-1 truncate">{item.name}</span>
                    )}

                    {/* Hạng mục 2: Huy hiệu số đơn chờ (Badge Counter) */}
                    {(!isCollapsed || forMobile) && hasPendingBadge && (
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full transition-colors flex items-center gap-1 ${
                        active 
                          ? 'bg-white text-blue-700 shadow-xs' 
                          : 'bg-rose-500 text-white shadow-xs animate-pulse'
                      }`}>
                        {pendingOrders}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 flex">
      {/* ========================================================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ========================================================= */}
      <aside
        className={`bg-white border-r border-gray-200 text-gray-900 flex flex-col hidden md:flex h-screen transition-all duration-300 relative z-30 shrink-0 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          <Link href="/admin" className="flex items-center gap-2.5 overflow-hidden">
            <img
              src="/logo.png"
              alt="KADY Logo"
              className="h-9 w-auto object-contain shrink-0"
            />
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-gray-900 leading-tight">
                  KADY SPORT
                </span>
                <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase">
                  Quản Trị Hệ Thống
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 py-5 px-3 overflow-y-auto scrollbar-thin">
          {renderNavLinks(false)}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-gray-100 space-y-1">
          {/* View storefront link */}
          <Link
            href="/"
            target="_blank"
            title="Xem trang bán hàng (mở tab mới)"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition group ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <Store size={18} className="shrink-0 text-gray-500 group-hover:text-blue-600" />
            {!isCollapsed && (
              <>
                <span className="flex-1 font-semibold">Xem Website</span>
                <ExternalLink size={13} className="text-gray-400 group-hover:text-blue-600" />
              </>
            )}
          </Link>

          {/* Hạng mục 3: Nút Thu gọn / Mở rộng Sidebar Desktop */}
          <button
            onClick={toggleCollapsed}
            type="button"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title={isCollapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
          >
            {isCollapsed ? (
              <ChevronRight size={18} className="shrink-0 text-blue-600" />
            ) : (
              <>
                <ChevronLeft size={18} className="shrink-0" />
                <span className="font-semibold text-gray-600">Thu gọn thanh bên</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MOBILE DRAWER (Hạng mục 3) */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <aside className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="KADY Logo" className="h-9 w-auto object-contain" />
                <span className="font-black text-gray-900 text-sm">KADY ADMIN</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition"
                aria-label="Đóng menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 py-5 px-4 overflow-y-auto">
              {renderNavLinks(true)}
            </nav>

            <div className="p-4 border-t border-gray-100 space-y-2">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
              >
                <Store size={18} />
                <span className="flex-1">Xem Website khách hàng</span>
                <ExternalLink size={14} />
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-rose-600 hover:bg-rose-50 transition text-left"
              >
                <LogOut size={18} />
                <span>Đăng xuất</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ========================================================= */}
      {/* MAIN CONTENT WRAPPER */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shadow-xs z-20 relative shrink-0">
          {/* Mobile hamburger button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
              aria-label="Mở menu quản trị"
            >
              <Menu size={22} />
            </button>
            <div className="md:hidden flex items-center gap-2">
              <span className="font-black text-gray-900 text-sm tracking-tight">KADY SPORT</span>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                Admin
              </span>
            </div>
          </div>

          {/* Quick Header Right actions */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Quick link: View Website button on Topbar */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 border border-gray-200 transition"
              title="Mở giao diện khách hàng ở tab mới"
            >
              <Store size={15} />
              <span>Xem Website</span>
              <ExternalLink size={12} className="text-gray-400" />
            </Link>

            {/* Profile Menu Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 hover:bg-gray-50 p-1.5 pr-2.5 rounded-xl transition cursor-pointer border border-transparent hover:border-gray-200"
              >
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-xs">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="flex flex-col items-start hidden sm:flex text-left">
                  <span className="font-bold text-xs text-gray-900 leading-tight">
                    {user?.full_name || 'Quản trị viên'}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {user?.email || 'admin@kady.vn'}
                  </span>
                </div>
                <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-50 mb-1">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {user?.full_name || 'Quản trị viên'}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {user?.email || 'admin@kady.vn'}
                    </p>
                  </div>
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition-colors"
                  >
                    <Store size={15} /> Xem giao diện khách hàng
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-bold transition-colors text-left"
                  >
                    <LogOut size={15} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
