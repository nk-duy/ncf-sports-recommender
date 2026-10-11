'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, ChevronRight, ChevronDown, Layers, ArrowUp, ArrowDown, Edit2, Eye, EyeOff, Check, X } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { MegaMenuSport } from '../types';
import { defaultMenu } from '../data/defaultMenu';

export default function MegaMenuManager() {
  const [menu, setMenu] = useState<MegaMenuSport[]>([]);
  const [expandedSports, setExpandedSports] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);
  
  // Input states
  const [newSport, setNewSport] = useState('');
  const [newProductType, setNewProductType] = useState<{sportIdx: number, val: string}>({sportIdx: -1, val: ''});
  const [newCategory, setNewCategory] = useState<{sportIdx: number, prodIdx: number, val: string}>({sportIdx: -1, prodIdx: -1, val: ''});

  // Edit states
  const [editingSport, setEditingSport] = useState<{idx: number, val: string} | null>(null);
  const [editingProductType, setEditingProductType] = useState<{sIdx: number, pIdx: number, val: string} | null>(null);
  const [editingCategory, setEditingCategory] = useState<{sIdx: number, pIdx: number, cIdx: number, val: string} | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    setMounted(true);
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch(`${API_URL}/menu`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setMenu(data);
          return;
        }
      }
    } catch (e) {
      console.error("Error fetching menu:", e);
    }
    // Fallback if no data or error
    const loaded = localStorage.getItem('admin_mega_menu');
    if (loaded) {
      try {
        setMenu(JSON.parse(loaded));
      } catch (e) {
        setMenu(defaultMenu);
      }
    } else {
      setMenu(defaultMenu);
    }
  };

  if (!mounted) return null;

  const saveMenu = async () => {
    // Save to localStorage as a backup
    localStorage.setItem('admin_mega_menu', JSON.stringify(menu));
    
    try {
      const res = await fetch(`${API_URL}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menu)
      });
      if (res.ok) {
        notifications.show({ title: 'Thành công', message: 'Đã lưu cấu hình danh mục vào cơ sở dữ liệu!', color: 'green' });
      } else {
        notifications.show({ title: 'Lỗi', message: 'Không thể lưu vào CSDL, vui lòng thử lại!', color: 'red' });
      }
    } catch (e) {
      console.error(e);
      notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối máy chủ!', color: 'red' });
    }
  };

  const toggleSport = (idx: number) => {
    if (expandedSports.includes(idx)) {
      setExpandedSports(expandedSports.filter(i => i !== idx));
    } else {
      setExpandedSports([...expandedSports, idx]);
    }
  };

  const addSport = () => {
    if (!newSport.trim()) return;
    setMenu([...menu, { sport_type: newSport.trim(), product_types: [] }]);
    setNewSport('');
  };

  const addProductType = (sportIdx: number) => {
    if (!newProductType.val.trim() || newProductType.sportIdx !== sportIdx) return;
    const updated = [...menu];
    updated[sportIdx].product_types.push({ product_type: newProductType.val.trim(), categories: [] });
    setMenu(updated);
    setNewProductType({sportIdx: -1, val: ''});
  };

  const addCategory = (sportIdx: number, prodIdx: number) => {
    if (!newCategory.val.trim() || newCategory.sportIdx !== sportIdx || newCategory.prodIdx !== prodIdx) return;
    const updated = [...menu];
    updated[sportIdx].product_types[prodIdx].categories.push({ category: newCategory.val.trim() });
    setMenu(updated);
    setNewCategory({sportIdx: -1, prodIdx: -1, val: ''});
  };

  const removeSport = (idx: number) => {
    const updated = [...menu];
    updated.splice(idx, 1);
    setMenu(updated);
  };

  const removeProductType = (sportIdx: number, prodIdx: number) => {
    const updated = [...menu];
    updated[sportIdx].product_types.splice(prodIdx, 1);
    setMenu(updated);
  };

  const removeCategory = (sportIdx: number, prodIdx: number, catIdx: number) => {
    const updated = [...menu];
    updated[sportIdx].product_types[prodIdx].categories.splice(catIdx, 1);
    setMenu(updated);
  };

  // --- NEW FEATURES ---

  const moveSport = (idx: number, direction: 'up' | 'down') => {
    const newMenu = [...menu];
    if (direction === 'up' && idx > 0) {
      [newMenu[idx-1], newMenu[idx]] = [newMenu[idx], newMenu[idx-1]];
    } else if (direction === 'down' && idx < newMenu.length - 1) {
      [newMenu[idx+1], newMenu[idx]] = [newMenu[idx], newMenu[idx+1]];
    }
    setMenu(newMenu);
  };

  const moveProductType = (sIdx: number, pIdx: number, direction: 'up' | 'down') => {
    const newMenu = [...menu];
    const pTypes = newMenu[sIdx].product_types;
    if (direction === 'up' && pIdx > 0) {
      [pTypes[pIdx-1], pTypes[pIdx]] = [pTypes[pIdx], pTypes[pIdx-1]];
    } else if (direction === 'down' && pIdx < pTypes.length - 1) {
      [pTypes[pIdx+1], pTypes[pIdx]] = [pTypes[pIdx], pTypes[pIdx+1]];
    }
    setMenu(newMenu);
  };

  const moveCategory = (sIdx: number, pIdx: number, cIdx: number, direction: 'up' | 'down') => {
    const newMenu = [...menu];
    const cats = newMenu[sIdx].product_types[pIdx].categories;
    if (direction === 'up' && cIdx > 0) {
      [cats[cIdx-1], cats[cIdx]] = [cats[cIdx], cats[cIdx-1]];
    } else if (direction === 'down' && cIdx < cats.length - 1) {
      [cats[cIdx+1], cats[cIdx]] = [cats[cIdx], cats[cIdx+1]];
    }
    setMenu(newMenu);
  };

  const toggleVisibility = (type: 'sport'|'product'|'category', sIdx: number, pIdx?: number, cIdx?: number) => {
    const newMenu = [...menu];
    if (type === 'sport') {
      newMenu[sIdx].is_hidden = !newMenu[sIdx].is_hidden;
    } else if (type === 'product' && pIdx !== undefined) {
      newMenu[sIdx].product_types[pIdx].is_hidden = !newMenu[sIdx].product_types[pIdx].is_hidden;
    } else if (type === 'category' && pIdx !== undefined && cIdx !== undefined) {
      newMenu[sIdx].product_types[pIdx].categories[cIdx].is_hidden = !newMenu[sIdx].product_types[pIdx].categories[cIdx].is_hidden;
    }
    setMenu(newMenu);
  };

  const saveEditSport = () => {
    if (!editingSport || !editingSport.val.trim()) return;
    const newMenu = [...menu];
    newMenu[editingSport.idx].sport_type = editingSport.val.trim();
    setMenu(newMenu);
    setEditingSport(null);
  };

  const saveEditProductType = () => {
    if (!editingProductType || !editingProductType.val.trim()) return;
    const newMenu = [...menu];
    newMenu[editingProductType.sIdx].product_types[editingProductType.pIdx].product_type = editingProductType.val.trim();
    setMenu(newMenu);
    setEditingProductType(null);
  };

  const saveEditCategory = () => {
    if (!editingCategory || !editingCategory.val.trim()) return;
    const newMenu = [...menu];
    newMenu[editingCategory.sIdx].product_types[editingCategory.pIdx].categories[editingCategory.cIdx].category = editingCategory.val.trim();
    setMenu(newMenu);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Danh mục</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý cấu trúc cây danh mục hiển thị trên Menu khách hàng</p>
        </div>
        <button onClick={saveMenu} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition">
          <Save size={18} />
          <span>Lưu thay đổi</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex gap-2 mb-6 border-b border-gray-100 pb-6">
          <input 
            type="text" 
            placeholder="Thêm Môn thể thao / Nhóm danh mục lớn (VD: Chạy bộ, Thể thao nữ...)"
            value={newSport}
            onChange={(e) => setNewSport(e.target.value)}
            className="flex-1 px-4 py-2.5 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            onKeyDown={(e) => { if (e.key === 'Enter') addSport(); }}
          />
          <button 
            onClick={addSport}
            className="px-4 py-2.5 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition"
          >
            <Plus size={20} />
            <span className="ml-2 font-medium">Thêm nhóm</span>
          </button>
        </div>

        <div className="space-y-4">
          {menu.map((sport, sIdx) => {
            const isExpanded = expandedSports.includes(sIdx);
            const isEditing = editingSport?.idx === sIdx;

            return (
              <div key={sIdx} className={`border rounded-lg overflow-hidden transition ${sport.is_hidden ? 'border-gray-100 opacity-60' : 'border-gray-200'}`}>
                <div 
                  className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition ${sport.is_hidden ? 'bg-gray-50 text-gray-400' : 'bg-gray-50 text-gray-900'}`}
                  onClick={() => !isEditing && toggleSport(sIdx)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {isExpanded ? <ChevronDown size={20} className="text-blue-600" /> : <ChevronRight size={20} className="text-gray-400" />}
                    <Layers size={18} className={isExpanded ? "text-blue-600" : "text-gray-500"} />
                    
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1 mr-4" onClick={e => e.stopPropagation()}>
                        <input 
                          autoFocus
                          type="text" 
                          className="px-2 py-1 border rounded w-full max-w-xs text-gray-900" 
                          value={editingSport.val} 
                          onChange={e => setEditingSport({...editingSport, val: e.target.value})}
                          onKeyDown={e => { if (e.key === 'Enter') saveEditSport(); if (e.key === 'Escape') setEditingSport(null); }}
                        />
                        <button onClick={saveEditSport} className="p-1 bg-green-100 text-green-700 rounded"><Check size={16}/></button>
                        <button onClick={() => setEditingSport(null)} className="p-1 bg-gray-200 text-gray-700 rounded"><X size={16}/></button>
                      </div>
                    ) : (
                      <span className={`font-bold ${sport.is_hidden ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {sport.sport_type}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <button onClick={() => moveSport(sIdx, 'up')} disabled={sIdx === 0} className={`p-1.5 rounded transition ${sIdx === 0 ? 'text-gray-200' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}>
                      <ArrowUp size={16} />
                    </button>
                    <button onClick={() => moveSport(sIdx, 'down')} disabled={sIdx === menu.length - 1} className={`p-1.5 rounded transition ${sIdx === menu.length - 1 ? 'text-gray-200' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}>
                      <ArrowDown size={16} />
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button onClick={() => toggleVisibility('sport', sIdx)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded transition" title={sport.is_hidden ? 'Hiện' : 'Ẩn'}>
                      {sport.is_hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    {!isEditing && (
                      <button onClick={() => setEditingSport({idx: sIdx, val: sport.sport_type})} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                        <Edit2 size={16} />
                      </button>
                    )}
                    <button onClick={() => removeSport(sIdx)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="pl-8 space-y-6">
                      
                      {sport.product_types.map((prod, pIdx) => {
                        const isEditingProd = editingProductType?.sIdx === sIdx && editingProductType?.pIdx === pIdx;
                        return (
                          <div key={pIdx} className={`space-y-3 ${prod.is_hidden ? 'opacity-60' : ''}`}>
                            <div className="flex items-center justify-between group">
                              <div className="flex items-center gap-2 flex-1">
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                
                                {isEditingProd ? (
                                  <div className="flex items-center gap-2">
                                    <input 
                                      autoFocus
                                      type="text" 
                                      className="px-2 py-1 border rounded w-48 text-sm text-gray-900" 
                                      value={editingProductType.val} 
                                      onChange={e => setEditingProductType({...editingProductType, val: e.target.value})}
                                      onKeyDown={e => { if (e.key === 'Enter') saveEditProductType(); if (e.key === 'Escape') setEditingProductType(null); }}
                                    />
                                    <button onClick={saveEditProductType} className="p-1 bg-green-100 text-green-700 rounded"><Check size={14}/></button>
                                    <button onClick={() => setEditingProductType(null)} className="p-1 bg-gray-200 text-gray-700 rounded"><X size={14}/></button>
                                  </div>
                                ) : (
                                  <span className={`font-semibold ${prod.is_hidden ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                    {prod.product_type}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                <button onClick={() => moveProductType(sIdx, pIdx, 'up')} disabled={pIdx === 0} className={`p-1 rounded transition ${pIdx === 0 ? 'text-gray-200' : 'text-gray-400 hover:text-blue-600'}`}>
                                  <ArrowUp size={14} />
                                </button>
                                <button onClick={() => moveProductType(sIdx, pIdx, 'down')} disabled={pIdx === sport.product_types.length - 1} className={`p-1 rounded transition ${pIdx === sport.product_types.length - 1 ? 'text-gray-200' : 'text-gray-400 hover:text-blue-600'}`}>
                                  <ArrowDown size={14} />
                                </button>
                                <div className="w-px h-3 bg-gray-300 mx-1"></div>
                                <button onClick={() => toggleVisibility('product', sIdx, pIdx)} className="p-1 text-gray-400 hover:text-gray-700">
                                  {prod.is_hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                                {!isEditingProd && (
                                  <button onClick={() => setEditingProductType({sIdx, pIdx, val: prod.product_type})} className="p-1 text-gray-400 hover:text-blue-600">
                                    <Edit2 size={14} />
                                  </button>
                                )}
                                <button onClick={() => removeProductType(sIdx, pIdx)} className="p-1 text-gray-400 hover:text-red-500">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                            
                            <div className="pl-6 flex flex-wrap gap-2 items-center">
                              {prod.categories.map((cat, cIdx) => {
                                const isEditingCat = editingCategory?.sIdx === sIdx && editingCategory?.pIdx === pIdx && editingCategory?.cIdx === cIdx;
                                return (
                                  <div key={cIdx} className={`group flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-sm transition-all ${cat.is_hidden ? 'opacity-50 grayscale' : ''}`}>
                                    {isEditingCat ? (
                                      <div className="flex items-center gap-1">
                                        <input 
                                          autoFocus
                                          type="text" 
                                          className="px-1.5 py-0.5 border rounded w-28 text-xs text-gray-900 bg-white" 
                                          value={editingCategory.val} 
                                          onChange={e => setEditingCategory({...editingCategory, val: e.target.value})}
                                          onKeyDown={e => { if (e.key === 'Enter') saveEditCategory(); if (e.key === 'Escape') setEditingCategory(null); }}
                                        />
                                        <button onClick={saveEditCategory} className="text-green-600 hover:text-green-700"><Check size={14}/></button>
                                        <button onClick={() => setEditingCategory(null)} className="text-gray-500 hover:text-gray-700"><X size={14}/></button>
                                      </div>
                                    ) : (
                                      <span className={`${cat.is_hidden ? 'line-through text-gray-400' : 'text-blue-800'}`}>
                                        {cat.category}
                                      </span>
                                    )}
                                    
                                    {!isEditingCat && (
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden -mr-1">
                                        <button onClick={() => moveCategory(sIdx, pIdx, cIdx, 'up')} disabled={cIdx === 0} className={`${cIdx === 0 ? 'text-gray-300' : 'text-gray-400 hover:text-blue-600'}`}>
                                          <ArrowUp size={12} />
                                        </button>
                                        <button onClick={() => moveCategory(sIdx, pIdx, cIdx, 'down')} disabled={cIdx === prod.categories.length - 1} className={`${cIdx === prod.categories.length - 1 ? 'text-gray-300' : 'text-gray-400 hover:text-blue-600'}`}>
                                          <ArrowDown size={12} />
                                        </button>
                                        <button onClick={() => toggleVisibility('category', sIdx, pIdx, cIdx)} className="text-gray-400 hover:text-gray-700 ml-0.5">
                                          {cat.is_hidden ? <EyeOff size={12} /> : <Eye size={12} />}
                                        </button>
                                        <button onClick={() => setEditingCategory({sIdx, pIdx, cIdx, val: cat.category})} className="text-gray-400 hover:text-blue-600 ml-0.5">
                                          <Edit2 size={12} />
                                        </button>
                                        <button onClick={() => removeCategory(sIdx, pIdx, cIdx)} className="text-blue-300 hover:text-red-500 ml-0.5">
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                              
                              {/* Input to add category */}
                              <div className="flex items-center gap-1 mt-1 mb-1">
                                <input 
                                  type="text"
                                  placeholder="Thêm danh mục con..."
                                  value={newCategory.sportIdx === sIdx && newCategory.prodIdx === pIdx ? newCategory.val : ''}
                                  onChange={(e) => setNewCategory({sportIdx: sIdx, prodIdx: pIdx, val: e.target.value})}
                                  onKeyDown={(e) => { if (e.key === 'Enter') addCategory(sIdx, pIdx); }}
                                  className="px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-sm w-36 focus:border-blue-500 focus:outline-none bg-gray-50"
                                />
                                {(newCategory.sportIdx === sIdx && newCategory.prodIdx === pIdx && newCategory.val) && (
                                  <button 
                                    onClick={() => addCategory(sIdx, pIdx)}
                                    className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                  >
                                    <Plus size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Input to add product type */}
                      <div className="flex items-center gap-2 pt-2">
                        <div className="w-2 h-2 rounded-full border-2 border-gray-300"></div>
                        <input 
                          type="text"
                          placeholder="Thêm loại sản phẩm (VD: Giày dép, Quần áo...)"
                          value={newProductType.sportIdx === sIdx ? newProductType.val : ''}
                          onChange={(e) => setNewProductType({sportIdx: sIdx, val: e.target.value})}
                          onKeyDown={(e) => { if (e.key === 'Enter') addProductType(sIdx); }}
                          className="px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-sm w-64 focus:border-blue-500 focus:outline-none bg-gray-50"
                        />
                        {(newProductType.sportIdx === sIdx && newProductType.val) && (
                          <button 
                            onClick={() => addProductType(sIdx)}
                            className="px-3 py-1.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition"
                          >
                            Thêm
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {menu.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              Chưa có danh mục nào. Hãy bắt đầu thêm Môn thể thao / Nhóm danh mục lớn đầu tiên!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
