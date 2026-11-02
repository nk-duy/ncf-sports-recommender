'use client';

import { useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Check,
  X,
  Plus,
  Box,
} from 'lucide-react';
import { MegaMenuProductType } from '../types';
import CategorySubTagChip from './CategorySubTagChip';

interface CategoryProductTypeBlockProps {
  prod: MegaMenuProductType;
  sIdx: number;
  pIdx: number;
  totalProductTypes: number;
  productCountsByCategory: Record<string, number>;
  onMoveProductType: (sIdx: number, pIdx: number, direction: 'up' | 'down') => void;
  onRemoveProductType: (sIdx: number, pIdx: number) => void;
  onUpdateProductTypeName: (sIdx: number, pIdx: number, newName: string) => void;
  onToggleVisibility: (
    type: 'sport' | 'product' | 'category',
    sIdx: number,
    pIdx?: number,
    cIdx?: number
  ) => void;
  onMoveCategory: (
    sIdx: number,
    pIdx: number,
    cIdx: number,
    direction: 'up' | 'down'
  ) => void;
  onRemoveCategory: (sIdx: number, pIdx: number, cIdx: number) => void;
  onUpdateCategoryName: (
    sIdx: number,
    pIdx: number,
    cIdx: number,
    newName: string
  ) => void;
  onAddCategory: (sIdx: number, pIdx: number, catName: string) => void;
}

export default function CategoryProductTypeBlock({
  prod,
  sIdx,
  pIdx,
  totalProductTypes,
  productCountsByCategory,
  onMoveProductType,
  onRemoveProductType,
  onUpdateProductTypeName,
  onToggleVisibility,
  onMoveCategory,
  onRemoveCategory,
  onUpdateCategoryName,
  onAddCategory,
}: CategoryProductTypeBlockProps) {
  const [isEditingProd, setIsEditingProd] = useState(false);
  const [prodNameInput, setProdNameInput] = useState(prod.product_type);
  const [catInputVal, setCatInputVal] = useState('');

  const handleSaveProdName = () => {
    if (prodNameInput.trim()) {
      onUpdateProductTypeName(sIdx, pIdx, prodNameInput.trim());
    }
    setIsEditingProd(false);
  };

  const handleAddNewCat = () => {
    const val = catInputVal.trim();
    if (!val) return;
    onAddCategory(sIdx, pIdx, val);
    setCatInputVal('');
  };

  return (
    <div
      className={`bg-white rounded-xl border p-4 shadow-2xs space-y-3 transition-colors ${
        prod.is_hidden ? 'border-dashed border-gray-200 opacity-60' : 'border-gray-200'
      }`}
    >
      {/* Product Type Header */}
      <div className="flex items-center justify-between group">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Box size={14} />
          </div>

          {isEditingProd ? (
            <div className="flex items-center gap-1.5">
              <input
                autoFocus
                type="text"
                value={prodNameInput}
                onChange={(e) => setProdNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveProdName();
                  if (e.key === 'Escape') setIsEditingProd(false);
                }}
                className="px-2 py-0.5 text-xs font-bold border border-blue-400 rounded-md outline-none"
              />
              <button
                type="button"
                onClick={handleSaveProdName}
                className="text-green-600 hover:text-green-700"
              >
                <Check size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIsEditingProd(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold ${
                  prod.is_hidden ? 'line-through text-gray-400' : 'text-gray-800'
                }`}
              >
                {prod.product_type}
              </span>
              <span className="text-[10px] text-gray-400 font-semibold">
                ({prod.categories.length} mục con)
              </span>
              {prod.is_hidden && (
                <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1 rounded">
                  Ẩn
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions for product type */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
          <button
            type="button"
            onClick={() => onMoveProductType(sIdx, pIdx, 'up')}
            disabled={pIdx === 0}
            className={`p-1 rounded transition ${
              pIdx === 0 ? 'text-gray-200' : 'text-gray-400 hover:text-blue-600'
            }`}
            title="Lên trên"
          >
            <ArrowUp size={13} />
          </button>
          <button
            type="button"
            onClick={() => onMoveProductType(sIdx, pIdx, 'down')}
            disabled={pIdx === totalProductTypes - 1}
            className={`p-1 rounded transition ${
              pIdx === totalProductTypes - 1
                ? 'text-gray-200'
                : 'text-gray-400 hover:text-blue-600'
            }`}
            title="Xuống dưới"
          >
            <ArrowDown size={13} />
          </button>
          <div className="w-px h-3 bg-gray-200 mx-0.5"></div>
          <button
            type="button"
            onClick={() => onToggleVisibility('product', sIdx, pIdx)}
            className="p-1 text-gray-400 hover:text-gray-700"
            title={prod.is_hidden ? 'Hiện' : 'Ẩn'}
          >
            {prod.is_hidden ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
          {!isEditingProd && (
            <button
              type="button"
              onClick={() => {
                setProdNameInput(prod.product_type);
                setIsEditingProd(true);
              }}
              className="p-1 text-gray-400 hover:text-blue-600"
              title="Đổi tên"
            >
              <Edit2 size={13} />
            </button>
          )}
          <button
            type="button"
            onClick={() => onRemoveProductType(sIdx, pIdx)}
            className="p-1 text-gray-400 hover:text-red-500"
            title="Xóa loại này"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Subcategories (Tags Grid) */}
      <div className="pl-8 flex flex-wrap gap-2 items-center">
        {prod.categories.map((cat, cIdx) => (
          <CategorySubTagChip
            key={cIdx}
            cat={cat}
            sIdx={sIdx}
            pIdx={pIdx}
            cIdx={cIdx}
            totalCategories={prod.categories.length}
            catCount={productCountsByCategory[cat.category] || 0}
            onMoveCategory={onMoveCategory}
            onToggleVisibility={onToggleVisibility}
            onRemoveCategory={onRemoveCategory}
            onUpdateCategoryName={onUpdateCategoryName}
          />
        ))}

        {/* Input Thêm danh mục con nhanh */}
        <div className="flex items-center gap-1">
          <input
            type="text"
            placeholder="+ Thêm mục con (VD: Áo đấu)..."
            value={catInputVal}
            onChange={(e) => setCatInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddNewCat();
            }}
            className="px-2.5 py-1 border border-dashed border-gray-300 hover:border-blue-400 rounded-xl text-xs w-48 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
          />
          {catInputVal && (
            <button
              type="button"
              onClick={handleAddNewCat}
              className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-2xs transition"
            >
              <Plus size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
