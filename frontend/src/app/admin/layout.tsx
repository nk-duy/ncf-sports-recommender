'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Gift, Tags, BadgePercent, Layers, Image as ImageIcon } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Tổng quan', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Sản phẩm', path: '/admin/san-pham', icon: <Package size={20} /> },
    { name: 'SP Khuyến mãi', path: '/admin/san-pham-khuyen-mai', icon: <BadgePercent size={20} /> },
    { name: 'Đơn hàng', path: '/admin/don-hang', icon: <ShoppingCart size={20} /> },
    { name: 'Khuyến mãi', path: '/admin/khuyen-mai', icon: <Gift size={20} /> },
    { name: 'Danh mục', path: '/admin/danh-muc', icon: <Layers size={20} /> },
    { name: 'Thuộc tính', path: '/admin/thuoc-tinh', icon: <Tags size={20} /> },
    { name: 'Banner', path: '/admin/banners', icon: <ImageIcon size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B1E3F] text-white flex flex-col hidden md:flex">
        <div className="h-16 flex items-center justify-center border-b border-white/10">
          <Link href="/admin" className="text-xl font-black tracking-tight text-white uppercase flex items-center gap-3">
            <img
              src="/logo.png"
              alt="KADY Logo"
              className="h-10 w-auto object-contain bg-white rounded-lg p-1 shadow-sm"
            />
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${pathname === item.path ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
            >
              {item.icon}
              <span className="font-semibold text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition">
            <LogOut size={20} />
            <span className="font-semibold text-sm">Về trang khách</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="md:hidden font-bold text-lg text-gray-900">Admin Dashboard</div>
          <div className="hidden md:block"></div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
              A
            </div>
            <span className="font-semibold text-sm text-gray-700">Admin</span>
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
