'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Gift, Tags, BadgePercent, Layers, Image as ImageIcon, MapPin, MessageSquare, Users } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Tổng quan', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Khách hàng', path: '/admin/khach-hang', icon: <Users size={20} /> },
    { name: 'Sản phẩm', path: '/admin/san-pham', icon: <Package size={20} /> },
    { name: 'Đơn hàng', path: '/admin/don-hang', icon: <ShoppingCart size={20} /> },
    { name: 'Khuyến mãi', path: '/admin/khuyen-mai', icon: <Gift size={20} /> },
    { name: 'Cửa hàng', path: '/admin/cua-hang', icon: <MapPin size={20} /> },
    { name: 'Danh mục', path: '/admin/danh-muc', icon: <Layers size={20} /> },
    { name: 'Thuộc tính', path: '/admin/thuoc-tinh', icon: <Tags size={20} /> },
    { name: 'Banner', path: '/admin/banners', icon: <ImageIcon size={20} /> },
    { name: 'Liên hệ', path: '/admin/lien-he', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 text-gray-900 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
          <Link href="/admin" className="text-xl font-black tracking-tight text-gray-900 uppercase flex items-center gap-3">
            <img
              src="/logo.png"
              alt="KADY Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-semibold text-sm ${pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition">
            <LogOut size={20} />
            <span>Về trang khách</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20 relative">
          <div className="md:hidden font-bold text-lg text-gray-900">Admin Dashboard</div>
          <div className="hidden md:block"></div>
          
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-xl transition cursor-pointer border border-transparent hover:border-gray-100"
            >
              <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm">
                A
              </div>
              <div className="flex flex-col items-start hidden sm:flex">
                <span className="font-bold text-sm text-gray-900 leading-tight">Admin</span>
                <span className="text-[11px] text-gray-500 font-medium">Quản trị viên</span>
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-sm font-bold text-gray-900">Tài khoản của bạn</p>
                  <p className="text-xs text-gray-500">admin@kady.vn</p>
                </div>
                <Link href="/admin/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors">
                  Cài đặt tài khoản
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors text-left">
                  <LogOut size={16} /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
