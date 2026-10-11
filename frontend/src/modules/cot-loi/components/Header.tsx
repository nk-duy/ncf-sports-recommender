'use client';
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/shared/store/cartStore";
import { useAuthStore } from "@/shared/store/authStore";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Activity, 
  Footprints, 
  Trophy, 
  Dumbbell, 
  Compass, 
  ShoppingBag,
  Zap
} from "lucide-react";
import SearchAutocomplete from "./SearchAutocomplete";
import AnnouncementBar from "./AnnouncementBar";
import { defaultMenu } from "@/modules/quan-tri/danh-muc/data/defaultMenu";

interface MegaMenuCategory {
  category: string;
  is_hidden?: boolean;
}
interface MegaMenuProductType {
  product_type: string;
  categories: MegaMenuCategory[];
  is_hidden?: boolean;
}
interface MegaMenuSport {
  sport_type: string;
  product_types: MegaMenuProductType[];
  is_hidden?: boolean;
}

export default function Header() {
  const pathname = usePathname();
  const { getTotalItems } = useCartStore();

  const { user, isAuthenticated, isAdmin, checkAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [menu, setMenu] = useState<MegaMenuSport[]>(defaultMenu);

  const getSportIcon = (sport: string) => {
    const s = sport.toLowerCase();
    if (s.includes('pickleball')) return <Activity className="w-3.5 h-3.5" />;
    if (s.includes('chạy bộ')) return <Footprints className="w-3.5 h-3.5" />;
    if (s.includes('cầu lông')) return <Zap className="w-3.5 h-3.5" />;
    if (s.includes('đá bóng')) return <Trophy className="w-3.5 h-3.5" />;
    if (s.includes('bóng chuyền')) return <Flame className="w-3.5 h-3.5" />;
    if (s.includes('đa dụng') || s.includes('gym')) return <Dumbbell className="w-3.5 h-3.5" />;
    if (s.includes('dã ngoại')) return <Compass className="w-3.5 h-3.5" />;
    if (s.includes('phụ kiện')) return <ShoppingBag className="w-3.5 h-3.5" />;
    return <Sparkles className="w-3.5 h-3.5" />;
  };

  const getSportLabel = (sport: string) => {
    if (sport === 'Đa dụng') return 'Gym & Fitness';
    return sport;
  };


  useEffect(() => {
    setMounted(true);
    checkAuth();
    
    // Fetch Mega Menu
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/menu`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setMenu(data);
      })
      .catch(err => console.error("Error fetching menu:", err));
  }, [checkAuth]);



  return (
    <header className="bg-white sticky top-0 z-50 text-gray-900 shadow-sm border-b border-gray-100">
      <AnnouncementBar />

      {/* Main Header Bar */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link className="flex flex-shrink-0 items-center" href="/">
            <img
              src="/logo.png"
              alt="KADY Logo"
              className="h-14 md:h-16 w-auto object-contain hover:opacity-80 transition-opacity bg-transparent rounded-xl"
            />
          </Link>

          {/* Search Autocomplete */}
          <SearchAutocomplete />

          {/* User & Cart */}
          <div className="flex items-center gap-6 flex-shrink-0">
            {mounted && isAuthenticated ? (
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition">
                  <div className="flex flex-col text-right">
                    <span className="text-[13px] font-bold leading-none mb-1 text-gray-900">{user?.full_name || user?.username}</span>
                    <span className="text-[10px] text-gray-500 font-medium">{isAdmin ? "Admin" : "Khách hàng"}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-105 transition-transform">
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
                      window.location.href = '/';
                    }} 
                    className="w-full text-left block px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <a href="/dang-nhap" className="flex items-center gap-3 group text-gray-700 hover:text-blue-600 transition">
                <div className="flex flex-col text-right">
                  <span className="text-[13px] font-bold leading-none mb-1 text-gray-900">Đăng Nhập</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 shadow-inner group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </a>
            )}

            <a
              className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 px-4 py-2.5 rounded-xl transition border border-gray-200 group text-gray-900 shadow-sm"
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
      <div className="bg-white border-t border-gray-100">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <nav className="flex justify-center items-center gap-10 md:gap-14 py-4 text-base font-black uppercase tracking-wide text-gray-800">
            <Link href="/" className={`transition ${(pathname || '') === '/' ? 'text-blue-600 border-b-2 border-blue-600 pb-0.5' : 'hover:text-blue-600'}`}>
              Trang chủ
            </Link>
            <div className="group relative">
              <span className={`cursor-pointer transition flex items-center gap-1 hover:text-blue-600 ${(pathname || '').startsWith('/san-pham') ? 'text-blue-600 border-b-2 border-blue-600 pb-0.5' : ''}`}>
                Sản phẩm
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              
              {/* Mega Menu Dropdown */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[1140px] max-w-[96vw] z-50 pointer-events-none group-hover:pointer-events-auto">
                <div className="bg-white text-gray-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 border border-gray-100 overflow-hidden normal-case tracking-normal">
                  <div className="flex flex-col lg:flex-row">
                    {/* Left: 8 Sports Grid */}
                    <div className="flex-1 p-6 sm:p-7 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6">
                      {menu.filter(s => !s.is_hidden).map((sport, sIdx) => {
                        const icon = getSportIcon(sport.sport_type);
                        const label = getSportLabel(sport.sport_type);
                        return (
                          <div key={sIdx} className="group/col">
                            <Link 
                              href={`/san-pham?sport_type=${encodeURIComponent(sport.sport_type)}`} 
                              className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase tracking-wide mb-3 hover:text-blue-600 transition"
                            >
                              <span className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100/80 text-blue-600 flex items-center justify-center group-hover/col:scale-110 group-hover/col:bg-blue-600 group-hover/col:text-white transition-all shrink-0">
                                {icon}
                              </span>
                              <span className="truncate">{label}</span>
                            </Link>

                            <div className="space-y-2 font-medium pl-9 text-[13px]">
                              {sport.product_types.filter(p => !p.is_hidden).flatMap(p => p.categories.filter(c => !c.is_hidden)).slice(0, 4).map((cat, cIdx) => (
                                <Link 
                                  key={cIdx} 
                                  href={`/san-pham?sport_type=${encodeURIComponent(sport.sport_type)}&category=${encodeURIComponent(cat.category)}`} 
                                  className="block text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform truncate"
                                >
                                  {cat.category}
                                </Link>
                              ))}

                              {/* Fallback if no categories inside product_types */}
                              {sport.product_types.filter(p => !p.is_hidden && p.categories.length === 0).map((prod, pIdx) => (
                                <Link 
                                  key={pIdx} 
                                  href={`/san-pham?sport_type=${encodeURIComponent(sport.sport_type)}&product_type=${encodeURIComponent(prod.product_type)}`} 
                                  className="block text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform truncate"
                                >
                                  {prod.product_type}
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      
                      {menu.length === 0 && (
                        <div className="col-span-4 text-gray-500 text-sm py-4">Đang tải danh mục...</div>
                      )}
                    </div>

                    {/* Right: AI Recommender / Featured Card */}
                    <div className="w-full lg:w-[290px] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 text-white border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between shrink-0 relative overflow-hidden group/card">
                      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl"></div>

                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-bold tracking-wider uppercase mb-3">
                          <Sparkles size={12} className="text-blue-400 animate-pulse" />
                          Gợi ý thông minh NCF
                        </div>
                        <h4 className="font-extrabold text-white text-sm leading-snug group-hover/card:text-blue-300 transition">
                          Đồ Thể Thao Phù Hợp Nhất Với Bạn
                        </h4>
                        <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                          Hệ thống AI phân tích nhu cầu và dáng vóc để đề xuất sản phẩm tối ưu hiệu suất.
                        </p>
                      </div>

                      <div className="my-3.5 rounded-xl overflow-hidden relative h-28 bg-slate-800 border border-white/10 shadow-inner">
                        <img 
                          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" 
                          alt="Top Sports Shoes" 
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                          -25% HOT
                        </span>
                      </div>

                      <div>
                        <Link 
                          href="/san-pham?sport_type=Chạy%20bộ" 
                          className="inline-flex items-center justify-center gap-1.5 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
                        >
                          <span>Xem gợi ý dành riêng</span>
                          <ArrowRight size={13} />
                        </Link>
                        <div className="mt-2.5 text-center text-[10px] text-slate-400">
                          🎁 Mã <span className="font-mono text-cyan-300 font-bold">KADY10</span> giảm 10% đơn đầu
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Footer Bar */}
                  <div className="bg-gray-50 px-7 py-3 flex items-center justify-between border-t border-gray-100 text-xs">
                    <div className="flex items-center gap-2 text-gray-500 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Hơn <strong className="text-gray-800">570+</strong> sản phẩm thể thao chính hãng sẵn sàng giao hỏa tốc</span>
                    </div>
                    <Link href="/san-pham" className="font-black text-blue-600 hover:text-blue-800 transition uppercase tracking-wider flex items-center gap-1 group/all">
                      <span>XEM TẤT CẢ SẢN PHẨM</span>
                      <ArrowRight size={14} className="group-hover/all:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/khuyen-mai" className="text-red-600 hover:text-red-500 transition flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
              SALE
            </Link>
            <Link href="/gioi-thieu" className={`transition ${(pathname || '') === '/gioi-thieu' ? 'text-blue-600 border-b-2 border-blue-600 pb-0.5' : 'hover:text-blue-600'}`}>
              Giới thiệu
            </Link>
            <Link href="/lien-he" className={`transition ${(pathname || '') === '/lien-he' ? 'text-blue-600 border-b-2 border-blue-600 pb-0.5' : 'hover:text-blue-600'}`}>
              Liên hệ
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
