'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, ChevronDown, User, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react';
import { useCartStore } from '@/shared/store/cartStore';
import { useAuthStore, getUserInitials } from '@/shared/store/authStore';
import { useLanguage } from '@/shared/context/LanguageContext';
import NotificationBellDropdown from './NotificationBellDropdown';
import AiXRayToggle from '@/shared/components/AiXRayToggle';

interface HeaderTopActionsProps {
  mounted: boolean;
}

export default function HeaderTopActions({ mounted }: HeaderTopActionsProps) {
  const router = useRouter();
  const { getTotalItems } = useCartStore();
  const { user, isAuthenticated, isAdmin } = useAuthStore();
  const { language, setLanguage, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown tài khoản khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  return (
    <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 flex-shrink-0">
      {/* Nút bật/tắt AI X-Ray */}
      <AiXRayToggle size="sm" className="shrink-0" />

      {/* Nút Chuyển đổi Ngôn ngữ */}
      <div className="relative hidden lg:block">
        <button
          type="button"
          onClick={() => setShowLangMenu(!showLangMenu)}
          className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold text-gray-700 hover:text-blue-600 hover:bg-gray-50 border border-gray-200 transition"
          title="Chuyển đổi ngôn ngữ"
        >
          <Globe size={15} className="text-blue-600 shrink-0" />
          <span>{language === 'vi' ? 'VI' : 'EN'}</span>
          <ChevronDown size={12} className="text-gray-400" />
        </button>

        {showLangMenu && (
          <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => {
                setLanguage('vi');
                setShowLangMenu(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2 ${
                language === 'vi' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-gray-700'
              }`}
            >
              <span>🇻🇳</span>
              <span>Tiếng Việt</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLanguage('en');
                setShowLangMenu(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2 ${
                language === 'en' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-gray-700'
              }`}
            >
              <span>🇺🇸</span>
              <span>English</span>
            </button>
          </div>
        )}
      </div>

      {/* User Login/Profile */}
      {mounted && isAuthenticated ? (
        <div ref={userMenuRef} className="relative group">
          {/* Nút Avatar có thể bấm được trên cả Mobile và Desktop */}
          <button
            type="button"
            onClick={() => setShowUserDropdown((prev) => !prev)}
            className="flex items-center gap-2 sm:gap-3 text-gray-700 hover:text-blue-600 transition cursor-pointer text-left focus:outline-none"
            aria-expanded={showUserDropdown}
            aria-label="Tài khoản người dùng"
          >
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-[13px] font-bold leading-none mb-1 text-gray-900">
                {user?.full_name || user?.username}
              </span>
              <span className="text-[10px] text-gray-500 font-medium">
                {isAdmin ? 'Admin' : 'Khách hàng'}
              </span>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs hover:scale-105 transition-transform shrink-0">
              <span className="font-bold text-xs sm:text-sm tracking-tight">{getUserInitials(user)}</span>
            </div>
          </button>

          {/* Dropdown Menu - Hỗ trợ cả Click trên Mobile và Hover trên Desktop */}
          <div
            className={`absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-slate-100 transition-all duration-200 ${
              showUserDropdown
                ? 'opacity-100 visible pointer-events-auto'
                : 'opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto'
            }`}
          >
            {/* Tóm tắt thông tin người dùng */}
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-900 truncate">
                {user?.full_name || user?.username}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {user?.email}
              </p>
              <div className="mt-1 inline-flex items-center text-[10px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                {isAdmin ? 'Quản trị viên' : `Hạng: ${user?.tier || 'Đồng'}`}
              </div>
            </div>

            {/* Danh sách liên kết điều hướng */}
            <div className="py-1">
              <Link
                href={isAdmin ? '/admin' : '/tai-khoan'}
                onClick={() => setShowUserDropdown(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <User size={16} className="text-blue-600 shrink-0" />
                <span>{isAdmin ? 'Trang Quản Trị' : 'Hồ sơ cá nhân & Tổng quan'}</span>
              </Link>

              {!isAdmin && (
                <>
                  <Link
                    href="/tai-khoan/orders"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <ShoppingBag size={16} className="text-slate-400 shrink-0" />
                    <span>Lịch sử mua hàng</span>
                  </Link>

                  <Link
                    href="/tai-khoan/wishlist"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <Heart size={16} className="text-slate-400 shrink-0" />
                    <span>Sản phẩm yêu thích</span>
                  </Link>

                  <Link
                    href="/tai-khoan/settings"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <Settings size={16} className="text-slate-400 shrink-0" />
                    <span>Cài đặt tài khoản</span>
                  </Link>
                </>
              )}
            </div>

            <div className="h-px bg-slate-100 my-1"></div>

            <button
              type="button"
              onClick={() => {
                setShowUserDropdown(false);
                useAuthStore.getState().logout();
                router.push('/');
              }}
              className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 font-semibold transition-colors cursor-pointer"
            >
              <LogOut size={16} className="shrink-0" />
              <span>{t('header.logout')}</span>
            </button>
          </div>
        </div>
      ) : (
        <a
          href="/dang-nhap"
          className="flex items-center gap-2 sm:gap-2.5 group text-gray-700 hover:text-blue-600 transition"
          title={t('header.login')}
        >
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-[13px] font-bold leading-none mb-1 text-gray-900">
              {t('header.login')}
            </span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 shadow-inner group-hover:scale-105 transition-transform">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </a>
      )}

      {/* Notification Bell Dropdown */}
      {mounted && <NotificationBellDropdown />}

      {/* Cart Button */}
      <a
        className="flex items-center gap-1.5 sm:gap-2.5 bg-gray-50 hover:bg-gray-100 px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-xl transition border border-gray-200 group text-gray-900 shadow-xs"
        href="/gio-hang"
        title={t('header.cart')}
      >
        <div className="relative">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {mounted && getTotalItems() > 0 && (
            <span className="absolute -top-2.5 -right-2.5 bg-red-600 border border-white text-white text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
              {getTotalItems()}
            </span>
          )}
        </div>
        <span className="text-sm font-bold hidden md:inline">{t('header.cart')}</span>
      </a>
    </div>
  );
}
