'use client';
import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
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
  Tag,
  Layers,
  Activity,
  Footprints,
  Zap,
  Trophy,
  Flame,
  Dumbbell,
  Compass,
  ShoppingBag
} from 'lucide-react';
import { MegaMenuSport } from '../types';

interface CategorySportCardProps {
  sport: MegaMenuSport;
  sIdx: number;
  totalSports: number;
  isExpanded: boolean;
  onToggleExpand: (sIdx: number) => void;
  onMoveSport: (sIdx: number, direction: 'up' | 'down') => void;
  onToggleVisibility: (type: 'sport' | 'product' | 'category', sIdx: number, pIdx?: number, cIdx?: number) => void;
  onRemoveSport: (sIdx: number) => void;
  onUpdateSportName: (sIdx: number, newName: string) => void;
  onMoveProductType: (sIdx: number, pIdx: number, direction: 'up' | 'down') => void;
  onRemoveProductType: (sIdx: number, pIdx: number) => void;
  onUpdateProductTypeName: (sIdx: number, pIdx: number, newName: string) => void;
  onAddProductType: (sIdx: number, pTypeName: string) => void;
  onMoveCategory: (sIdx: number, pIdx: number, cIdx: number, direction: 'up' | 'down') => void;
  onRemoveCategory: (sIdx: number, pIdx: number, cIdx: number) => void;
  onUpdateCategoryName: (sIdx: number, pIdx: number, cIdx: number, newName: string) => void;
  onAddCategory: (sIdx: number, pIdx: number, catName: string) => void;
  productCountsBySport?: Record<string, number>;
  productCountsByCategory?: Record<string, number>;
}

export const getSportTheme = (sportName: string) => {
  const s = sportName.toLowerCase();
  if (s.includes('pickleball')) {
    return {
      icon: <Activity size={18} />,
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-700',
    };
  }
  if (s.includes('chạy bộ')) {
    return {
      icon: <Footprints size={18} />,
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-700',
    };
  }
  if (s.includes('cầu lông')) {
    return {
      icon: <Zap size={18} />,
      bg: 'bg-cyan-50',
      text: 'text-cyan-600',
      border: 'border-cyan-200',
      badge: 'bg-cyan-100 text-cyan-700',
    };
  }
  if (s.includes('đá bóng')) {
    return {
      icon: <Trophy size={18} />,
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-700',
    };
  }
  if (s.includes('bóng chuyền')) {
    return {
      icon: <Flame size={18} />,
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-200',
      badge: 'bg-rose-100 text-rose-700',
    };
  }
  if (s.includes('đa dụng') || s.includes('gym')) {
    return {
      icon: <Dumbbell size={18} />,
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-700',
    };
  }
  if (s.includes('dã ngoại')) {
    return {
      icon: <Compass size={18} />,
      bg: 'bg-teal-50',
      text: 'text-teal-600',
      border: 'border-teal-200',
      badge: 'bg-teal-100 text-teal-700',
    };
  }
  if (s.includes('phụ kiện')) {
    return {
      icon: <ShoppingBag size={18} />,
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      badge: 'bg-slate-200 text-slate-800',
    };
  }
  return {
    icon: <Layers size={18} />,
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-700',
  };
};

export default function CategorySportCard({
  sport,
  sIdx,
  totalSports,
  isExpanded,
  onToggleExpand,
  onMoveSport,
  onToggleVisibility,
  onRemoveSport,
  onUpdateSportName,
  onMoveProductType,
  onRemoveProductType,
  onUpdateProductTypeName,
  onAddProductType,
  onMoveCategory,
  onRemoveCategory,
  onUpdateCategoryName,
  onAddCategory,
  productCountsBySport = {},
  productCountsByCategory = {},
}: CategorySportCardProps) {
  const theme = getSportTheme(sport.sport_type);
  const sportProductCount = productCountsBySport[sport.sport_type] || 0;

  // Inline editing states
  const [editingSport, setEditingSport] = useState(false);
  const [sportNameInput, setSportNameInput] = useState(sport.sport_type);

  const [editingProdIdx, setEditingProdIdx] = useState<number | null>(null);
  const [prodNameInput, setProdNameInput] = useState('');

  const [editingCat, setEditingCat] = useState<{ pIdx: number; cIdx: number } | null>(null);
  const [catNameInput, setCatNameInput] = useState('');

  // New item inputs
  const [newProdName, setNewProdName] = useState('');
  const [newCatInputs, setNewCatInputs] = useState<Record<number, string>>({});

  const totalSubs = sport.product_types.reduce(
    (sum, p) => sum + (p.categories?.length || 0),
    0
  );

  const handleSaveSportName = () => {
    if (sportNameInput.trim()) {
      onUpdateSportName(sIdx, sportNameInput.trim());
    }
    setEditingSport(false);
  };

  const handleSaveProdName = (pIdx: number) => {
    if (prodNameInput.trim()) {
      onUpdateProductTypeName(sIdx, pIdx, prodNameInput.trim());
    }
    setEditingProdIdx(null);
  };

  const handleSaveCatName = (pIdx: number, cIdx: number) => {
    if (catNameInput.trim()) {
      onUpdateCategoryName(sIdx, pIdx, cIdx, catNameInput.trim());
    }
    setEditingCat(null);
  };

  const handleAddNewProd = () => {
    if (!newProdName.trim()) return;
    onAddProductType(sIdx, newProdName.trim());
    setNewProdName('');
  };

  const handleAddNewCat = (pIdx: number) => {
    const val = newCatInputs[pIdx]?.trim();
    if (!val) return;
    onAddCategory(sIdx, pIdx, val);
    setNewCatInputs({ ...newCatInputs, [pIdx]: '' });
  };

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
        sport.is_hidden
          ? 'border-gray-200 opacity-60 bg-gray-50/40'
          : isExpanded
          ? 'border-blue-300 ring-2 ring-blue-500/10'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Card Header */}
      <div
        onClick={() => !editingSport && onToggleExpand(sIdx)}
        className={`px-5 py-4 flex items-center justify-between cursor-pointer select-none transition-colors ${
          sport.is_hidden
            ? 'bg-gray-100/60 text-gray-400'
            : isExpanded
            ? 'bg-blue-50/30'
            : 'bg-white hover:bg-gray-50/80'
        }`}
      >
        {/* Left: Icon & Name & Counter */}
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <button
            type="button"
            className="text-gray-400 hover:text-blue-600 p-0.5 rounded transition"
          >
            {isExpanded ? (
              <ChevronDown size={20} className="text-blue-600" />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>

          {/* Sport Icon Badge */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${theme.bg} ${theme.text} ${theme.border}`}
          >
            {theme.icon}
          </div>

          {/* Sport Name & Badges */}
          {editingSport ? (
            <div
              className="flex items-center gap-2 flex-1 max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <input
                autoFocus
                type="text"
                value={sportNameInput}
                onChange={e => setSportNameInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSaveSportName();
                  if (e.key === 'Escape') setEditingSport(false);
                }}
                className="w-full px-2.5 py-1 text-sm font-bold border border-blue-400 rounded-lg outline-none bg-white text-gray-900"
              />
              <button
                type="button"
                onClick={handleSaveSportName}
                className="p-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg"
              >
                <Check size={16} />
              </button>
              <button
                type="button"
                onClick={() => setEditingSport(false)}
                className="p-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span
                className={`text-sm font-black tracking-tight ${
                  sport.is_hidden ? 'line-through text-gray-400' : 'text-gray-900'
                }`}
              >
                {sport.sport_type}
              </span>

              {/* Badges */}
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {sport.product_types.length} nhóm loại • {totalSubs} danh mục con
              </span>

              {sportProductCount > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  {sportProductCount} sản phẩm
                </span>
              )}

              {sport.is_hidden && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-600">
                  Đang ẩn trên menu
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions Toolbar */}
        <div
          className="flex items-center gap-1 shrink-0 ml-3"
          onClick={e => e.stopPropagation()}
        >
          {/* Reorder buttons */}
          <button
            type="button"
            onClick={() => onMoveSport(sIdx, 'up')}
            disabled={sIdx === 0}
            className={`p-1.5 rounded-lg transition ${
              sIdx === 0
                ? 'text-gray-200 cursor-not-allowed'
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
            }`}
            title="Di chuyển lên trên"
          >
            <ArrowUp size={15} />
          </button>
          <button
            type="button"
            onClick={() => onMoveSport(sIdx, 'down')}
            disabled={sIdx === totalSports - 1}
            className={`p-1.5 rounded-lg transition ${
              sIdx === totalSports - 1
                ? 'text-gray-200 cursor-not-allowed'
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
            }`}
            title="Di chuyển xuống dưới"
          >
            <ArrowDown size={15} />
          </button>

          <div className="w-px h-4 bg-gray-200 mx-1"></div>

          {/* Toggle visibility */}
          <button
            type="button"
            onClick={() => onToggleVisibility('sport', sIdx)}
            className={`p-1.5 rounded-lg transition ${
              sport.is_hidden
                ? 'text-red-500 hover:bg-red-50'
                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title={sport.is_hidden ? 'Bật hiển thị menu' : 'Tạm ẩn khỏi menu'}
          >
            {sport.is_hidden ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>

          {/* Rename sport */}
          {!editingSport && (
            <button
              type="button"
              onClick={() => {
                setSportNameInput(sport.sport_type);
                setEditingSport(true);
              }}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Đổi tên môn thể thao"
            >
              <Edit2 size={15} />
            </button>
          )}

          {/* Delete sport */}
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  `Bạn có chắc chắn muốn xóa môn thể thao "${sport.sport_type}" và toàn bộ danh mục con bên trong?`
                )
              ) {
                onRemoveSport(sIdx);
              }
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Xóa môn thể thao"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Card Body: Product Types & Subcategories */}
      {isExpanded && (
        <div className="p-5 border-t border-gray-100 bg-slate-50/40 space-y-5">
          {sport.product_types.map((prod, pIdx) => {
            const isEditingProd = editingProdIdx === pIdx;
            const catInputVal = newCatInputs[pIdx] || '';

            return (
              <div
                key={pIdx}
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
                          onChange={e => setProdNameInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSaveProdName(pIdx);
                            if (e.key === 'Escape') setEditingProdIdx(null);
                          }}
                          className="px-2 py-0.5 text-xs font-bold border border-blue-400 rounded-md outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveProdName(pIdx)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProdIdx(null)}
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
                      disabled={pIdx === sport.product_types.length - 1}
                      className={`p-1 rounded transition ${
                        pIdx === sport.product_types.length - 1
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
                          setEditingProdIdx(pIdx);
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
                  {prod.categories.map((cat, cIdx) => {
                    const isEditingThisCat =
                      editingCat?.pIdx === pIdx && editingCat?.cIdx === cIdx;
                    const catCount = productCountsByCategory[cat.category] || 0;

                    return (
                      <div
                        key={cIdx}
                        className={`group/cat flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/70 hover:bg-blue-50 border border-blue-200/80 rounded-xl text-xs transition-all shadow-2xs ${
                          cat.is_hidden ? 'opacity-40 grayscale line-through' : ''
                        }`}
                      >
                        <Tag size={12} className="text-blue-500 shrink-0" />

                        {isEditingThisCat ? (
                          <div className="flex items-center gap-1">
                            <input
                              autoFocus
                              type="text"
                              value={catNameInput}
                              onChange={e => setCatNameInput(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleSaveCatName(pIdx, cIdx);
                                if (e.key === 'Escape') setEditingCat(null);
                              }}
                              className="w-24 px-1 py-0.5 text-xs font-bold border border-blue-400 rounded outline-none bg-white text-gray-900"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveCatName(pIdx, cIdx)}
                              className="text-green-600"
                            >
                              <Check size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCat(null)}
                              className="text-gray-400"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-gray-800">
                              {cat.category}
                            </span>
                            {catCount > 0 && (
                              <span className="text-[10px] font-bold text-blue-600 bg-white px-1.5 py-0.2 rounded-md shadow-2xs">
                                {catCount}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Hover buttons for category */}
                        {!isEditingThisCat && (
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
                              disabled={cIdx === prod.categories.length - 1}
                              className={`p-0.5 ${
                                cIdx === prod.categories.length - 1
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
                                setEditingCat({ pIdx, cIdx });
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
                  })}

                  {/* Input Thêm danh mục con nhanh */}
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="+ Thêm mục con (VD: Áo đấu)..."
                      value={catInputVal}
                      onChange={e =>
                        setNewCatInputs({ ...newCatInputs, [pIdx]: e.target.value })
                      }
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleAddNewCat(pIdx);
                      }}
                      className="px-2.5 py-1 border border-dashed border-gray-300 hover:border-blue-400 rounded-xl text-xs w-48 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    />
                    {catInputVal && (
                      <button
                        type="button"
                        onClick={() => handleAddNewCat(pIdx)}
                        className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-2xs transition"
                      >
                        <Plus size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Bar Thêm Loại sản phẩm mới trong môn này */}
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-3 flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              placeholder={`Thêm loại sản phẩm cho ${sport.sport_type} (VD: Quần áo, Giày dép, Vợt & Bóng...)`}
              value={newProdName}
              onChange={e => setNewProdName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAddNewProd();
              }}
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-gray-50/50 focus:bg-white focus:border-blue-500 outline-none transition w-full"
            />
            <button
              type="button"
              onClick={handleAddNewProd}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition shadow-2xs shrink-0 w-full sm:w-auto"
            >
              <Plus size={14} />
              <span>Thêm loại sản phẩm</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
