'use client';
import React, { useState } from 'react';
import { Footprints, Shirt, Sparkles } from 'lucide-react';

interface ProductSizeSelectorProps {
  selectedSizes: string[];
  availableClothingSizes: string[];
  availableShoeSizes: string[];
  availableSportSpecs: string[];
  activeCategory: 'shoe' | 'clothing' | 'spec';
  setActiveCategory: (cat: 'shoe' | 'clothing' | 'spec') => void;
  onToggleSize: (size: string) => void;
}

export default function ProductSizeSelector({
  selectedSizes,
  availableClothingSizes,
  availableShoeSizes,
  availableSportSpecs,
  activeCategory,
  setActiveCategory,
  onToggleSize,
}: ProductSizeSelectorProps) {
  return (
    <div className="bg-gray-50/60 p-4 rounded-xl border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Footprints size={16} className="text-emerald-600" />
          Kích cỡ & Thông số ({selectedSizes.length} đã chọn)
        </label>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200">
          <button
            type="button"
            onClick={() => setActiveCategory('clothing')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition ${
              activeCategory === 'clothing' ? 'bg-amber-100 text-amber-800' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Shirt size={13} /> Size Quần Áo
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('shoe')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition ${
              activeCategory === 'shoe' ? 'bg-emerald-100 text-emerald-800' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Footprints size={13} /> Size Giày
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('spec')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition ${
              activeCategory === 'spec' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Sparkles size={13} /> Thông số Vợt/Đinh
          </button>
        </div>
      </div>

      {/* Render size items based on active subtab */}
      <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto bg-white rounded-xl border border-gray-100 p-3">
        {activeCategory === 'clothing' && availableClothingSizes.map(size => {
          const isSelected = selectedSizes.includes(size);
          return (
            <button
              key={size}
              type="button"
              onClick={() => onToggleSize(size)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isSelected
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-amber-50 hover:border-amber-200'
              }`}
            >
              {size}
            </button>
          );
        })}

        {activeCategory === 'shoe' && availableShoeSizes.map(size => {
          const isSelected = selectedSizes.includes(size);
          return (
            <button
              key={size}
              type="button"
              onClick={() => onToggleSize(size)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-emerald-50 hover:border-emerald-200'
              }`}
            >
              {size}
            </button>
          );
        })}

        {activeCategory === 'spec' && availableSportSpecs.map(spec => {
          const isSelected = selectedSizes.includes(spec);
          return (
            <button
              key={spec}
              type="button"
              onClick={() => onToggleSize(spec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-200'
              }`}
            >
              {spec}
            </button>
          );
        })}
      </div>
    </div>
  );
}
