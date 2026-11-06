'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  LogOut,
  Menu,
  ExternalLink,
  Store,
  ChevronDown,
} from 'lucide-react';

interface AdminUserInfo {
  full_name?: string;
  email?: string;
}

interface AdminTopbarProps {
  user: AdminUserInfo | null;
  onOpenMobileMenu: () => void;
  onLogout: () => void;
}

export default function AdminTopbar({
  user,
  onOpenMobileMenu,
  onLogout,
}: AdminTopbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shadow-xs z-20 relative shrink-0">
      {/* Mobile & Tablet hamburger button (< 1024px) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="size-10 inline-flex items-center justify-center lg:hidden rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-150 cursor-pointer"
          aria-label="Mở menu quản trị"
          title="Mở menu quản trị"
        >
          <Menu size={22} />
        </button>
        <div className="lg:hidden flex items-center gap-2">
          <span className="font-black text-slate-900 text-sm tracking-tight">KADY SPORT</span>
          <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
      </div>

      {/* Quick Header Right actions */}
      <div className="flex items-center gap-3 ml-auto">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50/80 border border-slate-200 transition"
          title="Mở giao diện khách hàng ở tab mới"
        >
          <Store size={15} />
          <span>Xem Website</span>
          <ExternalLink size={12} className="text-slate-400" />
        </Link>

        {/* Profile Menu Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 hover:bg-slate-50 p-1.5 pr-2.5 rounded-xl transition cursor-pointer border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-xs">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'D'}
            </div>
            <div className="flex flex-col items-start hidden sm:flex text-left">
              <span className="font-bold text-xs text-slate-900 leading-tight">
                {user?.full_name || 'Nguyễn Khánh Duy (Admin)'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {user?.email || 'admin@kady.vn'}
              </span>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 p-2 min-w-[230px] rounded-xl shadow-lg border border-slate-100 bg-white animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="px-3.5 py-2.5 border-b border-slate-100 mb-1.5">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.full_name || 'Nguyễn Khánh Duy (Admin)'}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {user?.email || 'admin@kady.vn'}
                </p>
              </div>
              <Link
                href="/"
                target="_blank"
                className="w-full px-3.5 py-2.5 rounded-lg flex items-center gap-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <Store size={15} /> <span>Xem giao diện khách hàng</span>
              </Link>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={onLogout}
                className="w-full px-3.5 py-2.5 rounded-lg flex items-center gap-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-left cursor-pointer"
              >
                <LogOut size={15} /> <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
