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
  Tag,
} from 'lucide-react';
import { MegaMenuCategory } from '../types';

interface CategorySubTagChipProps {
  cat: MegaMenuCategory;
  sIdx: number;
  pIdx: number;
  cIdx: number;
  totalCategories: number;
  catCount: number;
  onMoveCategory: (
    sIdx: number,
    pIdx: number,
    cIdx: number,
    direction: 'up' | 'down'
  ) => void;
  onToggleVisibility: (
    type: 'sport' | 'product' | 'category',
    sIdx: number,
    pIdx?: number,
    cIdx?: number
  ) => void;
  onRemoveCategory: (sIdx: number, pIdx: number, cIdx: number) => void;
  onUpdateCategoryName: (
    sIdx: number,
    pIdx: number,
    cIdx: number,
    newName: string
  ) => void;
}

export default function CategorySubTagChip({
  cat,
  sIdx,
  pIdx,
  cIdx,
  totalCategories,
  catCount,
  onMoveCategory,
  onToggleVisibility,
  onRemoveCategory,
  onUpdateCategoryName,
}: CategorySubTagChipProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [catNameInput, setCatNameInput] = useState(cat.category);

  const handleSave = () => {
    if (catNameInput.trim()) {
      onUpdateCategoryName(sIdx, pIdx, cIdx, catNameInput.trim());
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`group/cat flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/70 hover:bg-blue-50 border border-blue-200/80 rounded-xl text-xs transition-all shadow-2xs ${
        cat.is_hidden ? 'opacity-40 grayscale line-through' : ''
      }`}
    >
      <Tag size={12} className="text-blue-500 shrink-0" />

      {isEditing ? (
        <div className="flex items-center gap-1">
          <input
            autoFocus
            type="text"
            value={catNameInput}
            onChange={(e) => setCatNameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            className="w-24 px-1 py-0.5 text-xs font-bold border border-blue-400 rounded outline-none bg-white text-gray-900"
          />
          <button type="button" onClick={handleSave} className="text-green-600">
            <Check size={13} />
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-gray-400"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-gray-800">{cat.category}</span>
          {catCount > 0 && (
            <span className="text-[10px] font-bold text-blue-600 bg-white px-1.5 py-0.2 rounded-md shadow-2xs">
              {catCount}
            </span>
          )}
        </div>
      )}

      {!isEditing && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover/cat:opacity-100 transition-opacity ml-1 pl-1 border-l border-blue-200">
          <button
            type="button"
            onClick={() => onMoveCategory(sIdx, pIdx, cIdx, 'up')}
            disabled={cIdx === 0}
            className={`p-0.5 ${
              cIdx === 0 ? 'text-gray-300' : 'text-gray-500 hover:text-blue-600'
            }`}
            title="Sang trái/lên"
          >
            <ArrowUp size={11} />
          </button>
          <button
            type="button"
            onClick={() => onMoveCategory(sIdx, pIdx, cIdx, 'down')}
            disabled={cIdx === totalCategories - 1}
            className={`p-0.5 ${
              cIdx === totalCategories - 1
                ? 'text-gray-300'
                : 'text-gray-500 hover:text-blue-600'
            }`}
            title="Sang phải/xuống"
          >
            <ArrowDown size={11} />
          </button>
          <button
            type="button"
            onClick={() => onToggleVisibility('category', sIdx, pIdx, cIdx)}
            className="p-0.5 text-gray-500 hover:text-gray-800"
            title={cat.is_hidden ? 'Hiện' : 'Ẩn'}
          >
            {cat.is_hidden ? <EyeOff size={11} /> : <Eye size={11} />}
          </button>
          <button
            type="button"
            onClick={() => {
              setCatNameInput(cat.category);
              setIsEditing(true);
            }}
            className="p-0.5 text-gray-500 hover:text-blue-600"
            title="Sửa tên"
          >
            <Edit2 size={11} />
          </button>
          <button
            type="button"
            onClick={() => onRemoveCategory(sIdx, pIdx, cIdx)}
            className="p-0.5 text-gray-400 hover:text-red-500"
            title="Xóa danh mục này"
          >
            <Trash2 size={11} />
          </button>
        </div>
      )}
    </div>
  );
}
