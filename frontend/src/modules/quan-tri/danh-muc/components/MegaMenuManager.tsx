'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, ChevronRight, ChevronDown, Layers } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { MegaMenuSport } from '../types';
import { defaultMenu } from '../data/defaultMenu';

export default function MegaMenuManager() {
  const [menu, setMenu] = useState<MegaMenuSport[]>([]);
  const [expandedSports, setExpandedSports] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);
  
  // New input states
  const [newSport, setNewSport] = useState('');
  const [newProductType, setNewProductType] = useState<{sportIdx: number, val: string}>({sportIdx: -1, val: ''});
  const [newCategory, setNewCategory] = useState<{sportIdx: number, prodIdx: number, val: string}>({sportIdx: -1, prodIdx: -1, val: ''});

  useEffect(() => {
    setMounted(true);
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
  }, []);

  if (!mounted) return null;

  const saveMenu = () => {
    localStorage.setItem('admin_mega_menu', JSON.stringify(menu));
    notifications.show({ title: 'Thành công', message: 'Đã lưu cấu hình danh mục!', color: 'green' });
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
            return (
              <div key={sIdx} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="bg-gray-50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => toggleSport(sIdx)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown size={20} className="text-blue-600" /> : <ChevronRight size={20} className="text-gray-400" />}
                    <Layers size={18} className={isExpanded ? "text-blue-600" : "text-gray-500"} />
                    <span className="font-bold text-gray-900">{sport.sport_type}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeSport(sIdx); }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {isExpanded && (
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="pl-8 space-y-6">
                      
                      {sport.product_types.map((prod, pIdx) => (
                        <div key={pIdx} className="space-y-3">
                          <div className="flex items-center gap-2 group">
                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            <span className="font-semibold text-gray-800">{prod.product_type}</span>
                            <button 
                              onClick={() => removeProductType(sIdx, pIdx)}
                              className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          
                          <div className="pl-6 flex flex-wrap gap-2">
                            {prod.categories.map((cat, cIdx) => (
                              <div key={cIdx} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                                {cat.category}
                                <button 
                                  onClick={() => removeCategory(sIdx, pIdx, cIdx)}
                                  className="text-blue-300 hover:text-red-500 transition"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            
                            {/* Input to add category */}
                            <div className="flex items-center gap-1">
                              <input 
                                type="text"
                                placeholder="Thêm danh mục con..."
                                value={newCategory.sportIdx === sIdx && newCategory.prodIdx === pIdx ? newCategory.val : ''}
                                onChange={(e) => setNewCategory({sportIdx: sIdx, prodIdx: pIdx, val: e.target.value})}
                                onKeyDown={(e) => { if (e.key === 'Enter') addCategory(sIdx, pIdx); }}
                                className="px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-sm w-40 focus:border-blue-500 focus:outline-none bg-gray-50"
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
                      ))}

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
