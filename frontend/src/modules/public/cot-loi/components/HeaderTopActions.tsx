'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/shared/store/cartStore';
import { useAuthStore, getUserInitials } from '@/shared/store/authStore';
import { useLanguage } from '@/shared/context/LanguageContext';
import NotificationBellDropdown from './NotificationBellDropdown';

interface HeaderTopActionsProps {
  mounted: boolean;
}

export default function HeaderTopActions({ mounted }: HeaderTopActionsProps) {
  const router = useRouter();
  const { getTotalItems } = useCartStore();
  const { user, isAuthenticated, isAdmin } = useAuthStore();
  const { language, setLanguage, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <div className="flex items-center gap-3 sm:gap-4 md:gap-5 flex-shrink-0">
      {/* Nút Chuyển đổi Ngôn ngữ */}
      <div className="relative hidden sm:block">
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
        <div className="relative group cursor-pointer">
          <div className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-[13px] font-bold leading-none mb-1 text-gray-900">
                {user?.full_name || user?.username}
              </span>
              <span className="text-[10px] text-gray-500 font-medium">
                {isAdmin ? 'Admin' : 'Khách hàng'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-105 transition-transform">
              <span className="font-bold text-sm tracking-tight">{getUserInitials(user)}</span>
            </div>
          </div>

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
            <a
              href={isAdmin ? '/admin' : '/tai-khoan'}
              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              {isAdmin ? t('header.admin') : t('header.my_account')}
            </a>
            <div className="h-px bg-gray-100 my-1"></div>
            <button
              onClick={() => {
                useAuthStore.getState().logout();
                router.push('/');
              }}
              className="w-full text-left block px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
            >
              {t('header.logout')}
            </button>
          </div>
        </div>
      ) : (
        <a
          href="/dang-nhap"
          className="flex items-center gap-2.5 group text-gray-700 hover:text-blue-600 transition"
        >
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-[13px] font-bold leading-none mb-1 text-gray-900">
              {t('header.login')}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 shadow-inner group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        className="flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100 px-3.5 py-2.5 rounded-xl transition border border-gray-200 group text-gray-900 shadow-sm"
        href="/gio-hang"
      >
        <div className="relative">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {mounted && getTotalItems() > 0 && (
            <span className="absolute -top-2.5 -right-2.5 bg-red-600 border border-[#0B1E3F] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {getTotalItems()}
            </span>
          )}
        </div>
        <span className="text-sm font-bold hidden sm:inline">{t('header.cart')}</span>
      </a>
    </div>
  );
}
