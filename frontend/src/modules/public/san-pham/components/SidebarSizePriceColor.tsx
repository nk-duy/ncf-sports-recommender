'use client';

import { Check } from 'lucide-react';
import {
  FILTER_COLORS,
  PRICE_RANGES,
  type SizeTabType,
} from '../constants/sidebarFilters';

interface SidebarSizePriceColorProps {
  sizeLabel: string;
  showQuickSizeTabs: boolean;
  activeSizeTab: SizeTabType;
  onChangeSizeTab: (tab: SizeTabType) => void;
  displayedSizes: string[];
  currentSizes: string[];
  onToggleSize: (size: string) => void;
  minPrice: string;
  maxPrice: string;
  onChangePrice: (min: string, max: string) => void;
  currentColors: string[];
  onToggleColor: (colorName: string) => void;
}

export default function SidebarSizePriceColor({
  sizeLabel,
  showQuickSizeTabs,
  activeSizeTab,
  onChangeSizeTab,
  displayedSizes,
  currentSizes,
  onToggleSize,
  minPrice,
  maxPrice,
  onChangePrice,
  currentColors,
  onToggleColor,
}: SidebarSizePriceColorProps) {
  return (
    <>
      {/* Kích thước tương ứng với sản phẩm */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{sizeLabel}</h3>
        </div>

        {showQuickSizeTabs && (
          <div className="flex rounded-lg bg-gray-100 p-1 mb-3 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onChangeSizeTab('shoes')}
              className={`flex-1 py-1 rounded-md transition-all ${
                activeSizeTab === 'shoes' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Giày
            </button>
            <button
              type="button"
              onClick={() => onChangeSizeTab('apparel')}
              className={`flex-1 py-1 rounded-md transition-all ${
                activeSizeTab === 'apparel' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Quần áo
            </button>
            <button
              type="button"
              onClick={() => onChangeSizeTab('equipment')}
              className={`flex-1 py-1 rounded-md transition-all ${
                activeSizeTab === 'equipment' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Phụ kiện
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          {displayedSizes.map((size) => {
            const isSelected = currentSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => onToggleSize(size)}
                className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all truncate ${
                  isSelected
                    ? 'border-blue-600 text-blue-700 bg-blue-50 shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mức giá */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Mức giá</h3>
        <div className="space-y-3">
          {PRICE_RANGES.map((item, idx) => {
            const checked = minPrice === item.min && maxPrice === item.max;
            return (
              <label
                key={idx}
                onClick={() => onChangePrice(item.min, item.max)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    checked ? 'border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
                  }`}
                >
                  {checked && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <span className={`text-sm ${checked ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Bảng màu khớp với CSDL */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Bảng màu sắc</h3>
          {currentColors.length > 0 && (
            <span className="text-[11px] font-semibold text-blue-600">Đã chọn {currentColors.length}</span>
          )}
        </div>
        <div className="grid grid-cols-5 gap-2.5">
          {FILTER_COLORS.map((color, idx) => {
            const isSelected = currentColors.includes(color.name);
            return (
              <button
                key={idx}
                title={color.name}
                onClick={() => onToggleColor(color.name)}
                className="flex flex-col items-center gap-1 group/color p-1 rounded-lg hover:bg-gray-50 transition-all"
              >
                <div
                  className={`w-7 h-7 rounded-full border-2 ${color.bg} ${color.border} flex items-center justify-center transition-all ${
                    isSelected ? 'ring-2 ring-offset-2 ring-blue-600 scale-105' : 'group-hover/color:scale-105'
                  }`}
                >
                  {isSelected && (
                    <Check
                      size={12}
                      className={color.name === 'Trắng' || color.name === 'Vàng' ? 'text-gray-900' : 'text-white'}
                      strokeWidth={3}
                    />
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium leading-tight truncate ${
                    isSelected ? 'text-blue-600 font-bold' : 'text-gray-500'
                  }`}
                >
                  {color.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
