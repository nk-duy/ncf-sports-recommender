'use client';

import { Search, Star, X } from 'lucide-react';
import { HiddenFilterType } from '../types';

interface ReviewsFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  hiddenFilter: HiddenFilterType;
  onHiddenFilterChange: (val: HiddenFilterType) => void;
  starFilter: number | null;
  onStarFilterChange: (val: number | null) => void;
}

export default function ReviewsFilterBar({
  search,
  onSearchChange,
  hiddenFilter,
  onHiddenFilterChange,
  starFilter,
  onStarFilterChange,
}: ReviewsFilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search box */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo nội dung, tên khách, mã SP..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => onHiddenFilterChange('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              hiddenFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => onHiddenFilterChange('visible')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              hiddenFilter === 'visible'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đang hiển thị
          </button>
          <button
            onClick={() => onHiddenFilterChange('hidden')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              hiddenFilter === 'hidden'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đã ẩn
          </button>
        </div>
      </div>

      {/* Star Rating Pills */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2">
          Lọc sao:
        </span>
        <button
          onClick={() => onStarFilterChange(null)}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
            starFilter === null
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tất cả sao
        </button>
        {[5, 4, 3, 2, 1].map((s) => (
          <button
            key={s}
            onClick={() => onStarFilterChange(starFilter === s ? null : s)}
            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              starFilter === s
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{s}</span>
            <Star
              size={12}
              className={starFilter === s ? 'fill-white' : 'fill-amber-400 text-amber-400'}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
