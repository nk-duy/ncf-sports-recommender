'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Activity, 
  Footprints, 
  Trophy, 
  Flame, 
  Compass, 
  Dumbbell, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

interface SportQuickItem {
  name: string;
  sportType: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgGradient: string;
  slogan: string;
}

const SPORTS_LIST: SportQuickItem[] = [
  {
    name: 'Pickleball',
    sportType: 'Pickleball',
    badge: 'XU HƯỚNG',
    badgeColor: 'bg-amber-500 text-white',
    icon: Activity,
    colorClass: 'text-amber-500',
    bgGradient: 'from-amber-50 to-orange-50 border-amber-200/80',
    slogan: 'Vợt sợi carbon, bóng thi đấu',
  },
  {
    name: 'Cầu Lông',
    sportType: 'Cầu lông',
    badge: 'HOT',
    badgeColor: 'bg-blue-600 text-white',
    icon: Zap,
    colorClass: 'text-blue-600',
    bgGradient: 'from-blue-50 to-sky-50 border-blue-200/80',
    slogan: 'Vợt công thủ, cước trợ lực',
  },
  {
    name: 'Chạy Bộ',
    sportType: 'Chạy bộ',
    badge: 'MARATHON',
    badgeColor: 'bg-emerald-600 text-white',
    icon: Footprints,
    colorClass: 'text-emerald-600',
    bgGradient: 'from-emerald-50 to-teal-50 border-emerald-200/80',
    slogan: 'Giày đĩa đệm carbon, đồ nhẹ',
  },
  {
    name: 'Bóng Đá',
    sportType: 'Đá bóng',
    icon: Trophy,
    colorClass: 'text-red-600',
    bgGradient: 'from-red-50 to-rose-50 border-red-200/80',
    slogan: 'Giày đinh FG/TF, bóng tiêu chuẩn',
  },
  {
    name: 'Bóng Chuyền',
    sportType: 'Bóng chuyền',
    icon: Flame,
    colorClass: 'text-orange-500',
    bgGradient: 'from-orange-50 to-amber-50 border-orange-200/80',
    slogan: 'Giày bọc mắt cá, bóng thi đấu',
  },
  {
    name: 'Dã Ngoại & Cắm Trại',
    sportType: 'Dã ngoại',
    icon: Compass,
    colorClass: 'text-teal-600',
    bgGradient: 'from-teal-50 to-emerald-50 border-teal-200/80',
    slogan: 'Lều trại, phụ kiện sinh tồn',
  },
  {
    name: 'Gym & Thể Hình',
    sportType: 'Gym & Fitness',
    icon: Dumbbell,
    colorClass: 'text-purple-600',
    bgGradient: 'from-purple-50 to-indigo-50 border-purple-200/80',
    slogan: 'Đồ tập co giãn, dây kháng lực',
  },
  {
    name: 'Phụ Kiện Thể Thao',
    sportType: 'Phụ kiện',
    icon: ShoppingBag,
    colorClass: 'text-slate-700',
    bgGradient: 'from-slate-50 to-gray-100 border-slate-200',
    slogan: 'Bình nước, tất, túi chuyên dụng',
  },
];

export default function QuickSportsNav() {
  return (
    <section className="w-full bg-white border-b border-slate-100 py-6 sm:py-8">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        
        {/* Section Title */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h3 className="text-xs font-black uppercase tracking-[3px] text-slate-400">
              Chọn Nhanh Theo Môn Thể Thao
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
              Khám phá trọn bộ dụng cụ và trang phục chuyên nghiệp theo từng bộ môn bạn yêu thích
            </p>
          </div>

          <Link 
            href="/san-pham"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
          >
            <span>Tất cả bộ môn</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Responsive Grid / Horizontal Scroll for Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {SPORTS_LIST.map((sport, index) => {
            const Icon = sport.icon;
            return (
              <Link
                key={index}
                href={`/san-pham?sport_type=${encodeURIComponent(sport.sportType)}`}
                className={`group relative flex flex-col items-center text-center p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b ${sport.bgGradient} border hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden`}
              >
                {/* Badge if available */}
                {sport.badge && (
                  <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${sport.badgeColor} shadow-xs`}>
                    {sport.badge}
                  </span>
                )}

                {/* Circular Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center ${sport.colorClass} group-hover:scale-110 transition-transform duration-300 mb-2.5`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Sport Name */}
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {sport.name}
                </h4>

                {/* Subtle Slogan */}
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                  {sport.slogan}
                </p>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
