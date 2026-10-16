'use client';
import React from 'react';
import { Palette, Check } from 'lucide-react';

export interface ColorOption {
  name: string;
  hex: string;
}

interface ProductColorSelectorProps {
  availableColors: ColorOption[];
  selectedColors: string[];
  onToggleColor: (colorName: string) => void;
}

export default function ProductColorSelector({
  availableColors,
  selectedColors,
  onToggleColor,
}: ProductColorSelectorProps) {
  return (
    <div className="bg-gray-50/60 p-4 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Palette size={16} className="text-purple-600" />
          Màu sắc có sẵn ({selectedColors.length} đã chọn)
        </label>
        <span className="text-xs text-gray-500">Nhấp để bật/tắt màu</span>
      </div>

      <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
        {availableColors.map(color => {
          const isSelected = selectedColors.includes(color.name);
          return (
            <button
              key={color.name}
              type="button"
              onClick={() => onToggleColor(color.name)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-gray-900 text-white border-gray-900 shadow-xs ring-2 ring-purple-400/40'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs shrink-0"
                style={{ backgroundColor: color.hex }}
              />
              <span>{color.name}</span>
              {isSelected && <Check size={12} className="text-white" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
