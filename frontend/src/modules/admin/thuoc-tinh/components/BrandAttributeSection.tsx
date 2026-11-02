'use client';

import React from 'react';
import { Award, Tag, X, Plus } from 'lucide-react';

interface BrandAttributeSectionProps {
  brands: string[];
  newBrandInput: string;
  onNewBrandInputChange: (val: string) => void;
  onAddBrand: () => void;
  onRemoveBrand: (idx: number) => void;
}

export default function BrandAttributeSection({
  brands,
  newBrandInput,
  onNewBrandInputChange,
  onAddBrand,
  onRemoveBrand,
}: BrandAttributeSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col hover:border-slate-300 transition-colors">
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="size-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Award size={18} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base">Thương hiệu Thể thao</h2>
            <p className="text-xs text-slate-500">Các hãng thể thao phân phối (<span className="tabular-nums font-semibold">{brands.length}</span>)</p>
          </div>
        </div>
        <span className="whitespace-nowrap inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
          Brand / Hãng
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="flex flex-wrap gap-2 min-h-[100px] content-start">
          {brands.map((brand, idx) => (
            <div 
              key={idx}
              className="group flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors"
            >
              <Tag size={13} className="text-slate-400 group-hover:text-blue-500" />
              <span>{brand}</span>
              <button 
                onClick={() => onRemoveBrand(idx)} 
                className="size-5 inline-flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors ml-0.5 rounded-md hover:bg-white cursor-pointer"
                title={`Xóa ${brand}`}
                aria-label={`Xóa ${brand}`}
              >
                <X size={13} />
              </button>
            </div>
          ))}
          {brands.length === 0 && (
            <p className="text-slate-400 text-sm italic py-4">Chưa có thương hiệu nào</p>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={newBrandInput}
            onChange={e => onNewBrandInputChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onAddBrand(); } }}
            placeholder="Thêm thương hiệu mới (ví dụ: Yonex, Asics...)"
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-medium text-slate-900"
          />
          <button
            onClick={onAddBrand}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center gap-1.5 transition-colors duration-150 shadow-xs cursor-pointer"
          >
            <Plus size={16} /> Thêm
          </button>
        </div>
      </div>
    </div>
  );
}
