'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { notifications } from '@mantine/notifications';
import { MegaMenuSport } from '../types';
import { defaultMenu } from '../data/defaultMenu';

import CategoryStats from './CategoryStats';
import CategoryToolbar from './CategoryToolbar';
import CategorySportCard from './CategorySportCard';
import CategoryPreviewModal from './CategoryPreviewModal';

export default function MegaMenuManager() {
  const [menu, setMenu] = useState<MegaMenuSport[]>([]);
  const [expandedSports, setExpandedSports] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Search & New Sport inputs
  const [searchQuery, setSearchQuery] = useState('');
  const [newSport, setNewSport] = useState('');

  // Products data for counting
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [productCountsBySport, setProductCountsBySport] = useState<Record<string, number>>({});
  const [productCountsByCategory, setProductCountsByCategory] = useState<Record<string, number>>({});

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    setMounted(true);
    fetchMenu();
    fetchProductCounts();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch(`${API_URL}/menu`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setMenu(data);
          // Mặc định mở rộng 2 môn đầu tiên
          setExpandedSports([0, 1]);
          return;
        }
      }
    } catch (e) {
      console.error('Error fetching menu:', e);
    }

    // Fallback nếu không có data hoặc lỗi
    const loaded = localStorage.getItem('admin_mega_menu');
    if (loaded) {
      try {
        setMenu(JSON.parse(loaded));
        setExpandedSports([0, 1]);
      } catch {
        setMenu(defaultMenu);
        setExpandedSports([0, 1]);
      }
    } else {
      setMenu(defaultMenu);
      setExpandedSports([0, 1]);
    }
  };

  const fetchProductCounts = async () => {
    try {
      const res = await fetch(`${API_URL}/products?limit=1000&include_hidden=true`);
      if (res.ok) {
        const products = await res.json();
        setTotalProductsCount(products.length);

        const sportMap: Record<string, number> = {};
        const catMap: Record<string, number> = {};

        products.forEach((p: any) => {
          if (p.sport_type) {
            sportMap[p.sport_type] = (sportMap[p.sport_type] || 0) + 1;
          }
          if (Array.isArray(p.category)) {
            p.category.forEach((cat: string) => {
              if (cat) catMap[cat] = (catMap[cat] || 0) + 1;
            });
          }
        });

        setProductCountsBySport(sportMap);
        setProductCountsByCategory(catMap);
      }
    } catch (err) {
      console.error('Error fetching product counts:', err);
    }
  };

  const saveMenu = async () => {
    setSaving(true);
    localStorage.setItem('admin_mega_menu', JSON.stringify(menu));

    try {
      const res = await fetch(`${API_URL}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menu),
      });

      if (res.ok) {
        notifications.show({
          title: 'Thành công',
          message: 'Đã lưu cấu hình danh mục vào hệ thống!',
          color: 'green',
        });
      } else {
        notifications.show({
          title: 'Lỗi',
          message: 'Không thể lưu vào CSDL, vui lòng thử lại!',
          color: 'red',
        });
      }
    } catch (e) {
      console.error(e);
      notifications.show({
        title: 'Lỗi',
        message: 'Lỗi kết nối máy chủ!',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefault = () => {
    if (
      window.confirm(
        'Bạn có chắc muốn khôi phục lại toàn bộ cấu trúc cây menu mẫu chuẩn? Mọi thay đổi chưa lưu sẽ bị ghi đè.'
      )
    ) {
      setMenu(defaultMenu);
      setExpandedSports([0, 1, 2]);
      notifications.show({
        title: 'Đã khôi phục',
        message: 'Đã đưa về cây danh mục mẫu chuẩn. Hãy bấm "Lưu thay đổi" để áp dụng!',
        color: 'blue',
      });
    }
  };

  // Expand / Collapse controls
  const handleToggleExpand = (idx: number) => {
    setExpandedSports(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleExpandAll = () => {
    setExpandedSports(menu.map((_, i) => i));
  };

  const handleCollapseAll = () => {
    setExpandedSports([]);
  };

  // --- CRUD SPORT LEVEL ---
  const handleAddSport = () => {
    if (!newSport.trim()) return;
    const newEntry: MegaMenuSport = {
      sport_type: newSport.trim(),
      product_types: [],
    };
    const updated = [...menu, newEntry];
    setMenu(updated);
    setExpandedSports(prev => [...prev, updated.length - 1]);
    setNewSport('');
    notifications.show({
      title: 'Đã thêm',
      message: `Đã thêm môn "${newEntry.sport_type}". Hãy thêm các loại sản phẩm bên trong!`,
      color: 'green',
    });
  };

  const handleRemoveSport = (idx: number) => {
    const updated = [...menu];
    updated.splice(idx, 1);
    setMenu(updated);
    setExpandedSports(prev => prev.filter(i => i !== idx).map(i => (i > idx ? i - 1 : i)));
  };

  const handleMoveSport = (idx: number, direction: 'up' | 'down') => {
    const newMenu = [...menu];
    if (direction === 'up' && idx > 0) {
      [newMenu[idx - 1], newMenu[idx]] = [newMenu[idx], newMenu[idx - 1]];
    } else if (direction === 'down' && idx < newMenu.length - 1) {
      [newMenu[idx + 1], newMenu[idx]] = [newMenu[idx], newMenu[idx + 1]];
    }
    setMenu(newMenu);
  };

  const handleUpdateSportName = (idx: number, newName: string) => {
    const newMenu = [...menu];
    newMenu[idx].sport_type = newName;
    setMenu(newMenu);
  };

  // --- CRUD PRODUCT TYPE LEVEL ---
  const handleAddProductType = (sIdx: number, pTypeName: string) => {
    const updated = [...menu];
    updated[sIdx].product_types.push({
      product_type: pTypeName,
      categories: [],
    });
    setMenu(updated);
  };

  const handleRemoveProductType = (sIdx: number, pIdx: number) => {
    const updated = [...menu];
    updated[sIdx].product_types.splice(pIdx, 1);
    setMenu(updated);
  };

  const handleMoveProductType = (sIdx: number, pIdx: number, direction: 'up' | 'down') => {
    const newMenu = [...menu];
    const pTypes = newMenu[sIdx].product_types;
    if (direction === 'up' && pIdx > 0) {
      [pTypes[pIdx - 1], pTypes[pIdx]] = [pTypes[pIdx], pTypes[pIdx - 1]];
    } else if (direction === 'down' && pIdx < pTypes.length - 1) {
      [pTypes[pIdx + 1], pTypes[pIdx]] = [pTypes[pIdx], pTypes[pIdx + 1]];
    }
    setMenu(newMenu);
  };

  const handleUpdateProductTypeName = (sIdx: number, pIdx: number, newName: string) => {
    const newMenu = [...menu];
    newMenu[sIdx].product_types[pIdx].product_type = newName;
    setMenu(newMenu);
  };

  // --- CRUD CATEGORY LEVEL ---
  const handleAddCategory = (sIdx: number, pIdx: number, catName: string) => {
    const updated = [...menu];
    updated[sIdx].product_types[pIdx].categories.push({ category: catName });
    setMenu(updated);
  };

  const handleRemoveCategory = (sIdx: number, pIdx: number, cIdx: number) => {
    const updated = [...menu];
    updated[sIdx].product_types[pIdx].categories.splice(cIdx, 1);
    setMenu(updated);
  };

  const handleMoveCategory = (
    sIdx: number,
    pIdx: number,
    cIdx: number,
    direction: 'up' | 'down'
  ) => {
    const newMenu = [...menu];
    const cats = newMenu[sIdx].product_types[pIdx].categories;
    if (direction === 'up' && cIdx > 0) {
      [cats[cIdx - 1], cats[cIdx]] = [cats[cIdx], cats[cIdx - 1]];
    } else if (direction === 'down' && cIdx < cats.length - 1) {
      [cats[cIdx + 1], cats[cIdx]] = [cats[cIdx], cats[cIdx + 1]];
    }
    setMenu(newMenu);
  };

  const handleUpdateCategoryName = (
    sIdx: number,
    pIdx: number,
    cIdx: number,
    newName: string
  ) => {
    const newMenu = [...menu];
    newMenu[sIdx].product_types[pIdx].categories[cIdx].category = newName;
    setMenu(newMenu);
  };

  // --- VISIBILITY TOGGLE ---
  const handleToggleVisibility = (
    type: 'sport' | 'product' | 'category',
    sIdx: number,
    pIdx?: number,
    cIdx?: number
  ) => {
    const newMenu = [...menu];
    if (type === 'sport') {
      newMenu[sIdx].is_hidden = !newMenu[sIdx].is_hidden;
    } else if (type === 'product' && pIdx !== undefined) {
      newMenu[sIdx].product_types[pIdx].is_hidden = !newMenu[sIdx].product_types[pIdx].is_hidden;
    } else if (type === 'category' && pIdx !== undefined && cIdx !== undefined) {
      newMenu[sIdx].product_types[pIdx].categories[cIdx].is_hidden =
        !newMenu[sIdx].product_types[pIdx].categories[cIdx].is_hidden;
    }
    setMenu(newMenu);
  };

  // Search filtering logic
  const filteredIndices = useMemo(() => {
    if (!searchQuery.trim()) return menu.map((_, i) => i);

    const q = searchQuery.toLowerCase().trim();
    const matches: number[] = [];

    menu.forEach((sport, sIdx) => {
      const matchSport = sport.sport_type.toLowerCase().includes(q);
      const matchType = sport.product_types?.some(p =>
        p.product_type.toLowerCase().includes(q)
      );
      const matchCat = sport.product_types?.some(p =>
        p.categories?.some(c => c.category.toLowerCase().includes(q))
      );

      if (matchSport || matchType || matchCat) {
        matches.push(sIdx);
      }
    });

    return matches;
  }, [menu, searchQuery]);

  // When search query is entered, auto-expand matched items
  useEffect(() => {
    if (searchQuery.trim()) {
      setExpandedSports(filteredIndices);
    }
  }, [searchQuery, filteredIndices]);

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* 1. Thanh công cụ & Điều khiển Toolbar */}
      <CategoryToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        newSport={newSport}
        onNewSportChange={setNewSport}
        onAddSport={handleAddSport}
        onSaveMenu={saveMenu}
        onOpenPreview={() => setIsPreviewOpen(true)}
        onResetDefault={handleResetDefault}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        saving={saving}
        isAllExpanded={expandedSports.length === menu.length && menu.length > 0}
      />

      {/* 2. Thẻ KPI Thống kê danh mục */}
      <CategoryStats menu={menu} totalProductsCount={totalProductsCount} />

      {/* 3. Danh sách Thẻ Môn Thể Thao & Phân cấp danh mục */}
      <div className="space-y-4">
        {filteredIndices.map(sIdx => {
          const sport = menu[sIdx];
          if (!sport) return null;

          return (
            <CategorySportCard
              key={`${sport.sport_type}-${sIdx}`}
              sport={sport}
              sIdx={sIdx}
              totalSports={menu.length}
              isExpanded={expandedSports.includes(sIdx)}
              onToggleExpand={handleToggleExpand}
              onMoveSport={handleMoveSport}
              onToggleVisibility={handleToggleVisibility}
              onRemoveSport={handleRemoveSport}
              onUpdateSportName={handleUpdateSportName}
              onMoveProductType={handleMoveProductType}
              onRemoveProductType={handleRemoveProductType}
              onUpdateProductTypeName={handleUpdateProductTypeName}
              onAddProductType={handleAddProductType}
              onMoveCategory={handleMoveCategory}
              onRemoveCategory={handleRemoveCategory}
              onUpdateCategoryName={handleUpdateCategoryName}
              onAddCategory={handleAddCategory}
              productCountsBySport={productCountsBySport}
              productCountsByCategory={productCountsByCategory}
            />
          );
        })}

        {filteredIndices.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
            <p className="text-gray-500 font-medium text-sm">
              Không tìm thấy môn thể thao hay danh mục nào khớp với từ khóa &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Xóa từ khóa tìm kiếm
            </button>
          </div>
        )}
      </div>

      {/* 4. Modal Xem trước MegaMenu Trực quan */}
      <CategoryPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        menu={menu}
      />
    </div>
  );
}
