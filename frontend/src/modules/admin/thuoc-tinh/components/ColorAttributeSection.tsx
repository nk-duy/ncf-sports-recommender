'use client';

import { Palette, X, Plus } from 'lucide-react';
import type { ColorItem } from '../types';

export type { ColorItem };

interface ColorAttributeSectionProps {
  colors: ColorItem[];
  newColorName: string;
  newColorHex: string;
  onNewColorNameChange: (val: string) => void;
  onNewColorHexChange: (val: string) => void;
  onAddColor: () => void;
  onRemoveColor: (idx: number) => void;
  onUpdateColorHex: (idx: number, hex: string) => void;
}

export default function ColorAttributeSection({
  colors,
  newColorName,
  newColorHex,
  onNewColorNameChange,
  onNewColorHexChange,
  onAddColor,
  onRemoveColor,
  onUpdateColorHex,
}: ColorAttributeSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col hover:border-slate-300 transition-colors">
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-purple-50/50 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="size-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Palette size={18} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base">Bảng Màu sắc & Mã HEX</h2>
            <p className="text-xs text-slate-500">Màu biến thể sản phẩm (<span className="tabular-nums font-semibold">{colors.length}</span>)</p>
          </div>
        </div>
        <span className="whitespace-nowrap inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
          Color Swatches
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="flex flex-wrap gap-2.5 min-h-[100px] content-start">
          {colors.map((c, idx) => (
            <div 
              key={idx}
              className="group flex items-center gap-2 px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 shadow-xs hover:border-slate-300 transition-colors"
            >
              {/* Interactive Swatch color clicker */}
              <label 
                className="size-4 rounded-full border border-slate-300 shadow-xs cursor-pointer relative overflow-hidden shrink-0" 
                style={{ backgroundColor: c.hex }}
                title={`Click để đổi mã màu (${c.hex})`}
              >
                <input 
                  type="color" 
                  value={c.hex} 
                  onChange={e => onUpdateColorHex(idx, e.target.value)} 
                  className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                />
              </label>
              <span>{c.name}</span>
              <span className="font-sans tabular-nums text-[10px] text-slate-400 group-hover:text-slate-600 font-medium">{c.hex.toUpperCase()}</span>
              <button 
                onClick={() => onRemoveColor(idx)} 
                className="size-5 inline-flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors ml-0.5 rounded-md hover:bg-slate-100 cursor-pointer"
                title={`Xóa màu ${c.name}`}
                aria-label={`Xóa màu ${c.name}`}
              >
                <X size={13} />
              </button>
            </div>
          ))}
          {colors.length === 0 && (
            <p className="text-slate-400 text-sm italic py-4">Chưa có màu sắc nào</p>
          )}
        </div>

        {/* Color Add Form */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 flex-1">
            {/* Native Color Picker button */}
            <div className="relative size-10 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-xs hover:scale-105 transition-transform">
              <input
                type="color"
                value={newColorHex}
                onChange={e => onNewColorHexChange(e.target.value)}
                className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                title="Bấm để chọn mã màu"
              />
              <div className="w-full h-full" style={{ backgroundColor: newColorHex }}></div>
            </div>

            <input
              type="text"
              value={newColorName}
              onChange={e => onNewColorNameChange(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onAddColor(); } }}
              placeholder="Tên màu (ví dụ: Cam San Hô...)"
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition font-medium text-slate-900"
            />

            <input
              type="text"
              value={newColorHex}
              onChange={e => onNewColorHexChange(e.target.value)}
              placeholder="#HEX"
              className="w-24 px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans tabular-nums font-bold text-slate-600 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none uppercase text-center"
            />
          </div>

          <button
            onClick={onAddColor}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-colors duration-150 shadow-xs shrink-0 cursor-pointer"
          >
            <Plus size={16} /> Thêm màu
          </button>
        </div>
      </div>
    </div>
  );
}
