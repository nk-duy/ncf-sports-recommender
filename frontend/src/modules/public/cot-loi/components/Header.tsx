'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/shared/store/authStore';
import { defaultMenu } from '@/modules/admin/danh-muc/data/defaultMenu';
import { useLanguage } from '@/shared/context/LanguageContext';
import { MegaMenuSport } from '../types';
import SearchAutocomplete from './SearchAutocomplete';
import AnnouncementBar from './AnnouncementBar';
import HeaderTopActions from './HeaderTopActions';
import MegaMenu from './MegaMenu';

const emptySubscribe = () => () => {};
const LOGO_FALLBACK =
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=80';

export default function Header() {
  const pathname = usePathname();
  const { checkAuth } = useAuthStore();
  const { t } = useLanguage();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [menu, setMenu] = useState<MegaMenuSport[]>(defaultMenu);

  useEffect(() => {
    checkAuth();

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/menu`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setMenu(data);
      })
      .catch(() => {});
  }, [checkAuth]);

  return (
    <header className="bg-white sticky top-0 z-50 text-gray-900 shadow-sm border-b border-gray-100">
      <AnnouncementBar />

      {/* Main Header Bar */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-2.5">
        <div className="flex items-center justify-between gap-6">
          <Link className="flex flex-shrink-0 items-center" href="/">
            <img
              src="/logo.png"
              alt="KADY Logo"
              className="h-14 md:h-16 w-auto object-contain hover:opacity-85 transition-transform hover:scale-105 bg-transparent rounded-xl"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = LOGO_FALLBACK;
              }}
            />
          </Link>

          <SearchAutocomplete />

          <HeaderTopActions mounted={mounted} />
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white border-t border-gray-100">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <nav className="flex justify-center items-center gap-7 md:gap-11 py-2.5 text-sm md:text-[15px] font-black uppercase tracking-wide text-gray-800">
            <Link
              href="/"
              className={`transition ${
                (pathname || '') === '/'
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-0.5'
                  : 'hover:text-blue-600'
              }`}
            >
              {t('nav.home')}
            </Link>

            <MegaMenu menu={menu} isActive={(pathname || '').startsWith('/san-pham')} />

            <Link
              href="/khuyen-mai"
              className="text-red-600 hover:text-red-500 transition flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
              {t('nav.sale')}
            </Link>
            <Link
              href="/tra-cuu-don-hang"
              className={`transition ${
                (pathname || '') === '/tra-cuu-don-hang'
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-0.5'
                  : 'hover:text-blue-600'
              }`}
            >
              {t('nav.track_order')}
            </Link>
            <Link
              href="/gioi-thieu"
              className={`transition ${
                (pathname || '') === '/gioi-thieu'
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-0.5'
                  : 'hover:text-blue-600'
              }`}
            >
              {t('nav.about')}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
