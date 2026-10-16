'use client';
import React from 'react';
import { Layers, Box, Tag, PackageCheck, Eye, EyeOff } from 'lucide-react';
import { MegaMenuSport } from '../types';

interface CategoryStatsProps {
  menu: MegaMenuSport[];
  totalProductsCount: number;
}

export default function CategoryStats({ menu, totalProductsCount }: CategoryStatsProps) {
  const totalSports = menu.length;
  const activeSports = menu.filter(s => !s.is_hidden).length;
  const hiddenSports = totalSports - activeSports;

  const totalProductTypes = menu.reduce(
    (sum, s) => sum + (s.product_types?.length || 0),
    0
  );

  const totalCategories = menu.reduce(
    (sum, s) =>
      sum +
      (s.product_types?.reduce(
        (pSum, p) => pSum + (p.categories?.length || 0),
        0
      ) || 0),
    0
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Môn thể thao */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Môn Thể Thao</span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers size={18} />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-gray-900">{totalSports}</span>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold">
            <span className="inline-flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              <Eye size={11} /> {activeSports} hiện
            </span>
            {hiddenSports > 0 && (
              <span className="inline-flex items-center gap-0.5 text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                <EyeOff size={11} /> {hiddenSports} ẩn
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Loại sản phẩm */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Loại Sản Phẩm</span>
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Box size={18} />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-gray-900">{totalProductTypes}</span>
          <span className="text-xs text-gray-400 font-medium">Nhóm phân loại lớn</span>
        </div>
      </div>

      {/* 3. Danh mục chi tiết */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Danh Mục Chi Tiết</span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Tag size={18} />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-gray-900">{totalCategories}</span>
          <span className="text-xs text-gray-400 font-medium">Nhánh danh mục con</span>
        </div>
      </div>

      {/* 4. Tổng sản phẩm trong kho */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sản Phẩm Trong Kho</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <PackageCheck size={18} />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-emerald-600">
            {totalProductsCount > 0 ? totalProductsCount.toLocaleString('vi-VN') : '...'}
          </span>
          <span className="text-xs text-gray-400 font-medium">Sản phẩm gắn thẻ</span>
        </div>
      </div>
    </div>
  );
}
