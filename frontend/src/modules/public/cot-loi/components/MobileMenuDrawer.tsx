'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X,
  ChevronDown,
  Home,
  ShoppingBag,
  Sparkles,
  Search,
  Info,
  PhoneCall,
  Globe,
  ExternalLink,
  User,
} from 'lucide-react';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useAuthStore, getUserInitials } from '@/shared/store/authStore';
import { useHydrated } from '@/shared/hooks/useHydrated';
import type { MegaMenuSport } from '../types';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  menu: MegaMenuSport[];
}

const SPORT_ICONS: Record<string, string> = {
  'Pickleball': '🏓',
  'Chạy bộ': '🏃',
  'Cầu lông': '🏸',
  'Đá bóng': '⚽',
  'Bóng chuyền': '🏐',
  'Gym & Fitness': '🏋️',
  'Dã ngoại': '🏕️',
  'Phụ kiện chung': '🎒',
};

export default function MobileMenuDrawer({ isOpen, onClose, menu }: MobileMenuDrawerProps) {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, isAdmin } = useAuthStore();
  const mounted = useHydrated();
  const [expandedSport, setExpandedSport] = useState<string | null>(null);

  // Khóa cuộn trang nền khi mở Drawer
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Đóng Drawer khi thay đổi URL
  useEffect(() => {
    onClose();
  }, [pathname]);

  if (!isOpen) return null;

  const toggleSport = (sportName: string) => {
    setExpandedSport((prev) => (prev === sportName ? null : sportName));
  };

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop mờ nền */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel trượt từ trái sang */}
      <div className="relative w-[85vw] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 overflow-hidden">
        {/* Header Drawer */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100 bg-linear-to-r from-blue-50/70 via-white to-indigo-50/70">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="KADY Logo"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <span className="font-black text-gray-900 text-base tracking-tight">KADY SPORTS</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition cursor-pointer"
            aria-label="Đóng menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nội dung menu cuộn dọc */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* 0. Khối tài khoản người dùng trên Mobile */}
          {mounted && (
            isAuthenticated ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 p-3.5 rounded-2xl border border-blue-100/80 mb-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {getUserInitials(user)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-sm text-gray-900 truncate">{user?.full_name || user?.username}</p>
                      <span className="text-[9.5px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded shrink-0">
                        {isAdmin ? 'Admin' : 'Khách hàng'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-blue-200/50">
                  <Link
                    href={isAdmin ? '/admin' : '/tai-khoan'}
                    onClick={onClose}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white rounded-xl text-xs font-bold text-blue-600 shadow-2xs border border-blue-100 hover:bg-blue-50 transition"
                  >
                    <User size={13} />
                    <span>Hồ sơ cá nhân</span>
                  </Link>
                  <Link
                    href="/tai-khoan/orders"
                    onClick={onClose}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white rounded-xl text-xs font-bold text-gray-700 shadow-2xs border border-gray-100 hover:bg-gray-50 transition"
                  >
                    <ShoppingBag size={13} />
                    <span>Đơn hàng</span>
                  </Link>
                </div>
              </div>
            ) : (
              <Link
                href="/dang-nhap"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 font-bold text-xs mb-1 shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>Đăng nhập / Đăng ký tài khoản</span>
                </div>
                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-lg">Vào ngay</span>
              </Link>
            )
          )}

          {/* 1. Các liên kết nhanh */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
              Điều hướng nhanh
            </p>

            <Link
              href="/"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition ${
                pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Home size={18} className="text-blue-600 shrink-0" />
              <span>{t('nav.home', 'Trang chủ')}</span>
            </Link>

            <Link
              href="/san-pham"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition ${
                pathname.startsWith('/san-pham')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ShoppingBag size={18} className="text-indigo-600 shrink-0" />
              <span>{t('nav.products', 'Tất cả sản phẩm')}</span>
            </Link>

            <Link
              href="/khuyen-mai"
              onClick={onClose}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-sm transition ${
                pathname === '/khuyen-mai'
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles size={18} className="text-red-500 shrink-0" />
                <span>{t('nav.sale', 'Khuyến mãi Hot')}</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            </Link>

            <Link
              href="/tra-cuu-don-hang"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition ${
                pathname === '/tra-cuu-don-hang'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Search size={18} className="text-cyan-600 shrink-0" />
              <span>{t('nav.track_order', 'Tra cứu đơn hàng')}</span>
            </Link>

            <Link
              href="/gioi-thieu"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition ${
                pathname === '/gioi-thieu'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Info size={18} className="text-slate-500 shrink-0" />
              <span>{t('nav.about', 'Giới thiệu')}</span>
            </Link>
          </div>

          {/* 2. Danh mục 8 bộ môn thể thao */}
          <div className="space-y-1 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Danh mục Thể thao (8 Bộ môn)
              </p>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                8 Môn
              </span>
            </div>

            <div className="space-y-1">
              {menu.map((sport) => {
                const isExpanded = expandedSport === sport.sport_type;
                const icon = SPORT_ICONS[sport.sport_type] || '🏅';

                return (
                  <div key={sport.sport_type} className="rounded-xl overflow-hidden border border-gray-100 bg-white">
                    <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50/50 hover:bg-blue-50/40 transition">
                      <Link
                        href={`/san-pham?sport_type=${encodeURIComponent(sport.sport_type)}`}
                        onClick={onClose}
                        className="flex items-center gap-2.5 text-xs font-bold text-gray-800 hover:text-blue-600 flex-1"
                      >
                        <span className="text-base">{icon}</span>
                        <span>{sport.sport_type}</span>
                      </Link>

                      {sport.product_types && sport.product_types.length > 0 && (
                        <button
                          type="button"
                          onClick={() => toggleSport(sport.sport_type)}
                          className="p-1 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-white transition cursor-pointer"
                          aria-label={`Mở rộng ${sport.sport_type}`}
                        >
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-blue-600' : ''}`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Danh mục con (Product Types & Categories) */}
                    {isExpanded && sport.product_types && (
                      <div className="px-3 py-2 bg-white space-y-2 border-t border-gray-100 animate-in fade-in duration-150">
                        {sport.product_types.map((pt) => (
                          <div key={pt.product_type} className="space-y-1">
                            <Link
                              href={`/san-pham?sport_type=${encodeURIComponent(sport.sport_type)}&product_type=${encodeURIComponent(pt.product_type)}`}
                              onClick={onClose}
                              className="text-[11px] font-bold text-blue-600 hover:underline block"
                            >
                              &bull; {pt.product_type}
                            </Link>

                            {pt.categories && pt.categories.length > 0 && (
                              <div className="pl-3.5 space-y-1">
                                {pt.categories.map((cat) => (
                                  <Link
                                    key={cat.category}
                                    href={`/san-pham?category=${encodeURIComponent(cat.category)}`}
                                    onClick={onClose}
                                    className="text-[11px] text-gray-600 hover:text-blue-600 hover:underline block truncate"
                                  >
                                    - {cat.category}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Drawer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/80 space-y-2.5">
          {/* Chuyển ngôn ngữ */}
          <div className="flex items-center justify-between text-xs font-semibold text-gray-600 px-1">
            <span className="flex items-center gap-1.5">
              <Globe size={14} className="text-blue-600" />
              <span>Ngôn ngữ:</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLanguage('vi')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                  language === 'vi' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                🇻🇳 VI
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                  language === 'en' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                🇺🇸 EN
              </button>
            </div>
          </div>

          {/* Hotline */}
          <a
            href="tel:19006868"
            className="flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 transition"
          >
            <PhoneCall size={14} />
            <span>Hotline 24/7: 1900 6868</span>
          </a>
        </div>
      </div>
    </div>
  );
}

