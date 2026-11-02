'use client';

import Link from 'next/link';
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
  Zap,
} from 'lucide-react';
import { useLanguage } from '@/shared/context/LanguageContext';
import { MegaMenuSport } from '../types';

interface MegaMenuProps {
  menu: MegaMenuSport[];
  isActive: boolean;
}

const FEATURED_FALLBACK_IMG =
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80';

function getSportIcon(sport: string) {
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
}

export default function MegaMenu({ menu, isActive }: MegaMenuProps) {
  const { t, translateSport } = useLanguage();

  return (
    <div className="group relative">
      <span
        className={`cursor-pointer transition flex items-center gap-1 hover:text-blue-600 ${
          isActive ? 'text-blue-600 border-b-2 border-blue-600 pb-0.5' : ''
        }`}
      >
        {t('nav.products')}
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
              {menu
                .filter((s) => !s.is_hidden)
                .map((sport, sIdx) => {
                  const icon = getSportIcon(sport.sport_type);
                  const label = translateSport(sport.sport_type);
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
                        {sport.product_types
                          .filter((p) => !p.is_hidden)
                          .flatMap((p) => p.categories.filter((c) => !c.is_hidden))
                          .slice(0, 4)
                          .map((cat, cIdx) => (
                            <Link
                              key={cIdx}
                              href={`/san-pham?sport_type=${encodeURIComponent(sport.sport_type)}&category=${encodeURIComponent(cat.category)}`}
                              className="block text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-transform truncate"
                            >
                              {cat.category}
                            </Link>
                          ))}

                        {sport.product_types
                          .filter((p) => !p.is_hidden && p.categories.length === 0)
                          .map((prod, pIdx) => (
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
                  {t('header.featured_rec')}
                </div>
                <h4 className="font-extrabold text-white text-sm leading-snug group-hover/card:text-blue-300 transition">
                  {t('header.featured_title')}
                </h4>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  {t('header.featured_desc')}
                </p>
              </div>

              <div className="my-3.5 rounded-xl overflow-hidden relative h-28 bg-slate-800 border border-white/10 shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
                  alt="Top Sports Shoes"
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FEATURED_FALLBACK_IMG;
                  }}
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
                  <span>{t('header.view_for_you')}</span>
                  <ArrowRight size={13} />
                </Link>
                <div className="mt-2.5 text-center text-[10px] text-slate-400">
                  {t('header.coupon_note')}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Bar */}
          <div className="bg-gray-50 px-7 py-3 flex items-center justify-between border-t border-gray-100 text-xs">
            <div className="flex items-center gap-2 text-gray-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{t('header.authentic_badge')}</span>
            </div>
            <Link
              href="/san-pham"
              className="font-black text-blue-600 hover:text-blue-800 transition uppercase tracking-wider flex items-center gap-1 group/all"
            >
              <span>{t('header.view_all_products')}</span>
              <ArrowRight size={14} className="group-hover/all:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
