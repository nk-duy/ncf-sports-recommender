'use client';

import Link from 'next/link';
import {
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Store,
} from 'lucide-react';
import { ADMIN_NAV_GROUPS } from './adminNavConfig';

interface AdminSidebarProps {
  pathname: string;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  pendingOrders: number;
  onLogout: () => void;
}

export default function AdminSidebar({
  pathname,
  isCollapsed,
  onToggleCollapsed,
  mobileMenuOpen,
  onCloseMobileMenu,
  pendingOrders,
  onLogout,
}: AdminSidebarProps) {
  const isItemActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname.startsWith(path);
  };

  const renderNavLinks = (forMobile = false) => (
    <div className="space-y-6">
      {ADMIN_NAV_GROUPS.map((group, gIdx) => (
        <div key={gIdx}>
          {(!isCollapsed || forMobile) && (
            <p className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {group.title}
            </p>
          )}
          {isCollapsed && !forMobile && (
            <div className="w-8 mx-auto my-2 border-t border-slate-100" />
          )}
          <div className="space-y-1">
            {group.items.map((item) => {
              const active = isItemActive(item.path);
              const hasPendingBadge = item.badgeKey === 'pendingOrders' && pendingOrders > 0;
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  title={isCollapsed && !forMobile ? item.name : undefined}
                  className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 group ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs shadow-blue-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
                  } ${isCollapsed && !forMobile ? 'justify-center px-0' : ''}`}
                >
                  <div className="relative shrink-0">
                    <IconComponent size={19} />
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
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold tabular-nums rounded-full transition-colors flex items-center gap-1 ${
                        active
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'bg-rose-500 text-white shadow-xs animate-pulse'
                      }`}
                    >
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

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`bg-white border-r border-slate-200 text-slate-900 flex flex-col hidden lg:flex h-screen transition-all duration-300 relative z-30 shrink-0 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          <Link href="/admin" className="flex items-center gap-2.5 overflow-hidden">
            <img
              src="/logo.png"
              alt="KADY Logo"
              className="h-9 w-auto object-contain shrink-0"
            />
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-slate-900 leading-tight">
                  KADY SPORT
                </span>
                <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase">
                  Quản Trị Hệ Thống
                </span>
              </div>
            )}
          </Link>
        </div>

        <nav className="flex-1 py-5 px-3 overflow-y-auto scrollbar-thin">
          {renderNavLinks(false)}
        </nav>

        <div className="p-3 border-t border-slate-100 space-y-1">
          <Link
            href="/"
            target="_blank"
            title="Xem trang bán hàng (mở tab mới)"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition group ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <Store size={18} className="shrink-0 text-slate-500 group-hover:text-blue-600" />
            {!isCollapsed && (
              <>
                <span className="flex-1 font-semibold">Xem Website</span>
                <ExternalLink size={13} className="text-slate-400 group-hover:text-blue-600" />
              </>
            )}
          </Link>

          {/* Hạng mục 3: Nút Thu gọn / Mở rộng Sidebar Desktop */}
          <button
            onClick={onToggleCollapsed}
            type="button"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-150 ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title={isCollapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
            aria-label={isCollapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
          >
            {isCollapsed ? (
              <ChevronRight size={18} className="shrink-0 text-blue-600" />
            ) : (
              <>
                <ChevronLeft size={18} className="shrink-0" />
                <span className="font-semibold text-slate-600">Thu gọn thanh bên</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER (Hạng mục 3) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onCloseMobileMenu}
          />

          <aside className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="KADY Logo" className="h-9 w-auto object-contain" />
                <span className="font-black text-slate-900 text-sm">KADY ADMIN</span>
              </div>
              <button
                onClick={onCloseMobileMenu}
                className="size-8 inline-flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors duration-150"
                aria-label="Đóng menu"
                title="Đóng menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 py-5 px-4 overflow-y-auto">
              {renderNavLinks(true)}
            </nav>

            <div className="p-4 border-t border-slate-100 space-y-2">
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
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-rose-600 hover:bg-rose-50 transition text-left"
              >
                <LogOut size={18} />
                <span>Đăng xuất</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
