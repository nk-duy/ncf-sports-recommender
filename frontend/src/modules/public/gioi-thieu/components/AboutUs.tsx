'use client';

import Breadcrumb from '@/shared/components/Breadcrumb';
import AboutHeroAndMetrics from './AboutHeroAndMetrics';
import AboutNcfShowcase from './AboutNcfShowcase';
import AboutSportsAndContact from './AboutSportsAndContact';

export default function AboutUs() {
  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Giới thiệu', href: '/gioi-thieu' },
  ];

  return (
    <div className="bg-white min-h-screen pb-16">
      <div className="bg-slate-50/80 border-b border-slate-100 py-2.5">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <AboutHeroAndMetrics />
      <AboutNcfShowcase />
      <AboutSportsAndContact />
    </div>
  );
}
