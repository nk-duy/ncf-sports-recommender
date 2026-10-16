'use client';

import React from 'react';
import { Footprints, Shirt, ArrowUpDown, X, Plus } from 'lucide-react';

interface SizeAttributeSectionProps {
  shoeSizes: string[];
  clothingSizes: string[];
  newShoeInput: string;
  newClothInput: string;
  onNewShoeInputChange: (val: string) => void;
  onNewClothInputChange: (val: string) => void;
  onAddShoeSize: () => void;
  onRemoveShoeSize: (idx: number) => void;
  onSortShoeSizes: () => void;
  onAddClothingSize: () => void;
  onRemoveClothingSize: (idx: number) => void;
  onSortClothingSizes: () => void;
}

export default function SizeAttributeSection({
  shoeSizes,
  clothingSizes,
  newShoeInput,
  newClothInput,
  onNewShoeInputChange,
  onNewClothInputChange,
  onAddShoeSize,
  onRemoveShoeSize,
  onSortShoeSizes,
  onAddClothingSize,
  onRemoveClothingSize,
  onSortClothingSizes,
}: SizeAttributeSectionProps) {
  return (
    <>
      {/* 3. SIZE GIÀY DÉP (FOOTWEAR SIZES) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:border-gray-200 transition">
        <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50/50 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Footprints size={18} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Size Giày Dép Thể Thao</h2>
              <p className="text-xs text-gray-500">Kích cỡ giày bóng đá, chạy bộ, cầu lông ({shoeSizes.length})</p>
            </div>
          </div>
          
          <button
            onClick={onSortShoeSizes}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition cursor-pointer"
            title="Tự động xếp theo thứ tự số tăng dần"
          >
            <ArrowUpDown size={12} />
            <span>Sắp xếp chuẩn</span>
          </button>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap gap-2 min-h-[100px] content-start">
            {shoeSizes.map((size, idx) => (
              <div 
                key={idx}
                className="group flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 rounded-xl text-sm font-bold text-gray-800 hover:text-emerald-800 transition shadow-2xs"
              >
                <span>{size}</span>
                <button 
                  onClick={() => onRemoveShoeSize(idx)} 
                  className="text-gray-400 hover:text-red-500 transition p-0.5 rounded-full hover:bg-white cursor-pointer"
                  title={`Xóa size ${size}`}
                >
                  <X size={13} />
                </button>
              </div>
            ))}
            {shoeSizes.length === 0 && (
              <p className="text-gray-400 text-sm italic py-4">Chưa có size giày nào</p>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={newShoeInput}
              onChange={e => onNewShoeInputChange(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onAddShoeSize(); } }}
              placeholder="Thêm size giày mới (ví dụ: 39.5, 40...)"
              className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition font-medium"
            />
            <button
              onClick={onAddShoeSize}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Plus size={16} /> Thêm
            </button>
          </div>
        </div>
      </div>

      {/* 4. SIZE QUẦN ÁO (CLOTHING SIZES) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:border-gray-200 transition">
        <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-amber-50/50 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Shirt size={18} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Size Quần Áo Thể Thao</h2>
              <p className="text-xs text-gray-500">Kích cỡ áo đấu, quần tập, áo khoác ({clothingSizes.length})</p>
            </div>
          </div>

          <button
            onClick={onSortClothingSizes}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition cursor-pointer"
            title="Tự động xếp theo thứ tự kích cỡ XS -> 3XL"
          >
            <ArrowUpDown size={12} />
            <span>Sắp xếp chuẩn</span>
          </button>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap gap-2 min-h-[100px] content-start">
            {clothingSizes.map((size, idx) => (
              <div 
                key={idx}
                className="group flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-200 rounded-xl text-sm font-bold text-gray-800 hover:text-amber-800 transition shadow-2xs"
              >
                <span>{size}</span>
                <button 
                  onClick={() => onRemoveClothingSize(idx)} 
                  className="text-gray-400 hover:text-red-500 transition p-0.5 rounded-full hover:bg-white cursor-pointer"
                  title={`Xóa size ${size}`}
                >
                  <X size={13} />
                </button>
              </div>
            ))}
            {clothingSizes.length === 0 && (
              <p className="text-gray-400 text-sm italic py-4">Chưa có size quần áo nào</p>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={newClothInput}
              onChange={e => onNewClothInputChange(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onAddClothingSize(); } }}
              placeholder="Thêm size quần áo (ví dụ: S, M, L, XL...)"
              className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition font-medium"
            />
            <button
              onClick={onAddClothingSize}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Plus size={16} /> Thêm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
