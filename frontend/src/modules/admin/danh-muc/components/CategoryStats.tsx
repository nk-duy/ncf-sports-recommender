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
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Môn Thể Thao</span>
          <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Layers size={18} />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-slate-900 tabular-nums tracking-tight font-sans">{totalSports}</span>
          <div className="flex items-center gap-1.5 text-xs font-semibold tabular-nums">
            <span className="whitespace-nowrap inline-flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              <Eye size={12} /> {activeSports} hiện
            </span>
            {hiddenSports > 0 && (
              <span className="whitespace-nowrap inline-flex items-center gap-0.5 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                <EyeOff size={12} /> {hiddenSports} ẩn
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Loại sản phẩm */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loại Sản Phẩm</span>
          <div className="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Box size={18} />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-slate-900 tabular-nums tracking-tight font-sans">{totalProductTypes}</span>
          <span className="text-xs text-slate-400 font-medium">Nhóm phân loại lớn</span>
        </div>
      </div>

      {/* 3. Danh mục chi tiết */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Danh Mục Chi Tiết</span>
          <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Tag size={18} />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-slate-900 tabular-nums tracking-tight font-sans">{totalCategories}</span>
          <span className="text-xs text-slate-400 font-medium">Nhánh danh mục con</span>
        </div>
      </div>

      {/* 4. Tổng sản phẩm trong kho */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sản Phẩm Trong Kho</span>
          <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <PackageCheck size={18} />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-emerald-600 tabular-nums tracking-tight font-sans">
            {totalProductsCount > 0 ? totalProductsCount.toLocaleString('vi-VN') : '...'}
          </span>
          <span className="text-xs text-slate-400 font-medium">Sản phẩm gắn thẻ</span>
        </div>
      </div>
    </div>
  );
}
