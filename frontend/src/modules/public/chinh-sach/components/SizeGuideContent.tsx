'use client';

import { useState } from 'react';
import Breadcrumb from '@/shared/components/Breadcrumb';
import { SizeGuideTabKey } from '../types';
import SizeCalculatorSidebar from './SizeCalculatorSidebar';
import SizeGuideTabPanels from './SizeGuideTabPanels';

export default function SizeGuideContent() {
  const [activeTab, setActiveTab] = useState<SizeGuideTabKey>('giay');

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Hướng dẫn chọn size' },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-16">
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 py-8 sm:py-10">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Hướng Dẫn Chọn Size Thể Thao Chuẩn Xác
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
            Bảng quy đổi kích cỡ chuẩn quốc tế và công cụ tính size nhanh cho Giày chạy bộ, Quần áo tập luyện và Vợt thi đấu tại KADY.
          </p>
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 mt-6 sm:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <SizeCalculatorSidebar activeTab={activeTab} onSelectTab={setActiveTab} />
          <SizeGuideTabPanels activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}
