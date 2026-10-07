'use client';
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCartStore } from "@/shared/store/cartStore";
import { useAuthStore } from "@/shared/store/authStore";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const { getTotalItems } = useCartStore();
  const { user, isAuthenticated, isAdmin, checkAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/san-pham?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="bg-[#0B1E3F] sticky top-0 z-50 text-white shadow-md">

      {/* Main Header Bar */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <a className="flex flex-shrink-0 items-center" href="/trang-chu">
            <img
              src="/logo.png"
              alt="KADY Logo"
              className="h-14 md:h-16 w-auto object-contain hover:opacity-80 transition-opacity bg-white rounded-xl shadow-sm border border-white/10"
            />
          </a>

          {/* Search */}
          <div className="flex-1 max-w-3xl">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-5 pr-28 py-2.5 rounded-full bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm transition placeholder-gray-400"
                placeholder="Tìm kiếm giày chạy bộ, quần áo gym, vợt cầu lông, phụ kiện..."
                type="text"
              />
              <button type="submit" className="absolute right-1 px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-full transition flex items-center gap-2 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Tìm</span>
              </button>
            </form>
          </div>

          {/* User & Cart */}
          <div className="flex items-center gap-6 flex-shrink-0">
            {mounted && isAuthenticated ? (
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-3 text-white hover:text-blue-200 transition">
                  <div className="flex flex-col text-right">
                    <span className="text-[13px] font-bold leading-none mb-1 text-white">{user?.full_name || user?.username}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{isAdmin ? "Admin" : "Khách hàng"}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-600 border border-white/20 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform">
                    <span className="font-bold text-lg">{user?.username?.charAt(0).toUpperCase()}</span>
                  </div>
                </div>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                  <a href={isAdmin ? "/admin" : "/tai-khoan"} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                    {isAdmin ? "Trang quản trị" : "Tài khoản của tôi"}
                  </a>
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button 
                    onClick={() => {
                      useAuthStore.getState().logout();
                      router.push('/');
                    }} 
                    className="w-full text-left block px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <a href="/dang-nhap" className="flex items-center gap-3 group text-white hover:text-blue-200 transition">
                <div className="flex flex-col text-right">
                  <span className="text-[13px] font-bold leading-none mb-1 text-white">Đăng Nhập</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-600 border border-white/20 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </a>
            )}

            <a
              className="flex items-center gap-3 bg-blue-700/60 hover:bg-blue-600 px-4 py-2.5 rounded-xl transition border border-blue-500/20 group text-white shadow-sm"
              href="/gio-hang"
            >
              <div className="relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {mounted && getTotalItems() > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-red-600 border border-[#0B1E3F] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {getTotalItems()}
                  </span>
                )}
              </div>
              <span className="text-sm font-bold">Giỏ hàng</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-[#0B1E3F] border-t border-white/5">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <nav className="flex items-center gap-8 py-3.5 text-sm font-bold text-gray-300">
            <Link href="/" className={`transition ${(pathname || '') === '/' ? 'text-sky-400 border-b-2 border-sky-400 pb-0.5' : 'hover:text-white'}`}>
              Trang chủ
            </Link>
            <div className="group relative">
              <span className={`cursor-pointer transition flex items-center gap-1 hover:text-white ${(pathname || '').startsWith('/san-pham') ? 'text-sky-400 border-b-2 border-sky-400 pb-0.5' : ''}`}>
                Sản phẩm
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              
              {/* Mega Menu Dropdown */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-5 w-[800px] z-50 pointer-events-none group-hover:pointer-events-auto">
                <div className="bg-white text-gray-800 rounded-b-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 border-t-4 border-blue-600 overflow-hidden">
                  <div className="p-8 grid grid-cols-5 gap-6">
                    {/* Column 1 */}
                    <div>
                      <Link href="/san-pham?sport_type=Pickleball" className="block text-sm font-black text-gray-900 uppercase tracking-wide mb-4 hover:text-blue-600 transition">Pickleball</Link>
                      <div className="space-y-3">
                        <Link href="/san-pham?sport_type=Pickleball&product_type=Quần áo" className="block text-sm text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform">Quần Áo Pickleball</Link>
                        <Link href="/san-pham?sport_type=Pickleball&product_type=Giày dép" className="block text-sm text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform">Giày Pickleball</Link>
                        <Link href="/san-pham?sport_type=Pickleball&product_type=Thiết bị" className="block text-sm text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform">Vợt Pickleball</Link>
                        <Link href="/san-pham?sport_type=Pickleball&product_type=Phụ kiện" className="block text-sm text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform">Phụ Kiện Pickleball</Link>
                      </div>
                    </div>
                    {/* Column 2 */}
                    <div>
                      <Link href="/san-pham?sport_type=Bóng chuyền" className="block text-sm font-black text-gray-900 uppercase tracking-wide mb-4 hover:text-blue-600 transition">Bóng Chuyền</Link>
                      <div className="space-y-3">
                        <Link href="/san-pham?sport_type=Bóng chuyền&product_type=Quần áo" className="block text-sm text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform">Quần Áo Bóng Chuyền</Link>
                        <Link href="/san-pham?sport_type=Bóng chuyền&product_type=Giày dép" className="block text-sm text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform">Giày Bóng Chuyền</Link>
                        <Link href="/san-pham?sport_type=Bóng chuyền&product_type=Thiết bị" className="block text-sm text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform">Quả Bóng Chuyền</Link>
                      </div>
                    </div>
                    {/* Column 3 */}
                    <div>
                      <Link href="/san-pham?sport_type=Cầu lông" className="block text-sm font-black text-gray-900 uppercase tracking-wide mb-4 hover:text-blue-600 transition">Cầu Lông</Link>
                      <div className="space-y-3">
                        <Link href="/san-pham?sport_type=Cầu lông&product_type=Quần áo" className="block text-sm text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform">Quần Áo Cầu Lông</Link>
                        <Link href="/san-pham?sport_type=Cầu lông&product_type=Giày dép" className="block text-sm text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform">Giày Cầu Lông</Link>
                        <Link href="/san-pham?sport_type=Cầu lông&product_type=Thiết bị" className="block text-sm text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform">Vợt Cầu Lông</Link>
                      </div>
                    </div>
                    {/* Column 4 */}
                    <div>
                      <Link href="/san-pham" className="block text-sm font-black text-gray-900 uppercase tracking-wide mb-4 hover:text-blue-600 transition">Thể Thao</Link>
                      <div className="space-y-3">
                        <Link href="/san-pham?sport_type=Chạy bộ" className="block text-sm text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform">Đồ Chạy Bộ</Link>
                        <Link href="/san-pham?sport_type=Đá bóng" className="block text-sm text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform">Đồ Bóng Đá</Link>
                        <Link href="/san-pham?sport_type=Đa dụng" className="block text-sm text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform">Đồ Tập Gym / Yoga</Link>
                        <Link href="/san-pham?sport_type=Dã ngoại" className="block text-sm text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform">Dã Ngoại / Cắm Trại</Link>
                      </div>
                    </div>
                    {/* Column 5 */}
                    <div>
                      <Link href="/san-pham?product_type=Phụ kiện" className="block text-sm font-black text-gray-900 uppercase tracking-wide mb-4 hover:text-blue-600 transition">Phụ Kiện</Link>
                      <div className="space-y-3">
                        <Link href="/san-pham?product_type=Phụ kiện&category=Vớ" className="block text-sm text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform">Vớ Thể Thao</Link>
                        <Link href="/san-pham?product_type=Phụ kiện&category=Balo" className="block text-sm text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform">Balo / Túi Xách</Link>
                        <Link href="/san-pham?product_type=Phụ kiện&category=Mũ" className="block text-sm text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform">Mũ / Nón</Link>
                        <Link href="/san-pham?product_type=Phụ kiện" className="block text-sm text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform">Băng Gối / Lót Giày</Link>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                    <Link href="/san-pham" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition">XEM TẤT CẢ SẢN PHẨM →</Link>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/khuyen-mai" className="text-amber-500 hover:text-amber-400 transition flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-80"></span>
              Sale
            </Link>
            <Link href="/gioi-thieu" className={`transition ${(pathname || '') === '/gioi-thieu' ? 'text-sky-400 border-b-2 border-sky-400 pb-0.5' : 'hover:text-white'}`}>
              Giới thiệu
            </Link>
            <Link href="/lien-he" className={`transition ${(pathname || '') === '/lien-he' ? 'text-sky-400 border-b-2 border-sky-400 pb-0.5' : 'hover:text-white'}`}>
              Liên hệ
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
