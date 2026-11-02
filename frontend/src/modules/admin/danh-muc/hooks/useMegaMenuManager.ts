'use client';

import {
   useState,
  useEffect,
  useMemo,
  useCallback,
  useSyncExternalStore,
} from 'react';
import { notifications } from '@mantine/notifications';
import { MegaMenuSport } from '../types';
import { defaultMenu } from '../data/defaultMenu';
import { computeMatchedSportIndices, swapItems } from '../utils/menuTreeHelpers';

const emptySubscribe = () => () => {};

interface ProductCategorySummary {
  sport_type?: string;
  category?: string[];
}

export function useMegaMenuManager() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [menu, setMenu] = useState<MegaMenuSport[]>([]);
  const [expandedSports, setExpandedSports] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [newSport, setNewSport] = useState('');

  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [productCountsBySport, setProductCountsBySport] = useState<Record<string, number>>({});
  const [productCountsByCategory, setProductCountsByCategory] = useState<Record<string, number>>({});

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  const fetchMenu = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/menu`);
      if (res.ok) {
        const data: unknown = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setMenu(data as MegaMenuSport[]);
          setExpandedSports([0, 1]);
          return;
        }
      }
    } catch {
      // Fallback nếu không có data hoặc lỗi
    }

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
  }, [API_URL]);

  const fetchProductCounts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/products?limit=1000&include_hidden=true`);
      if (res.ok) {
        const products: ProductCategorySummary[] = await res.json();
        setTotalProductsCount(products.length);

        const sportMap: Record<string, number> = {};
        const catMap: Record<string, number> = {};

        products.forEach((p) => {
          if (p.sport_type) {
            sportMap[p.sport_type] = (sportMap[p.sport_type] || 0) + 1;
          }
          if (Array.isArray(p.category)) {
            p.category.forEach((cat) => {
              if (cat) catMap[cat] = (catMap[cat] || 0) + 1;
            });
          }
        });

        setProductCountsBySport(sportMap);
        setProductCountsByCategory(catMap);
      }
    } catch {
      // silent fallback
    }
  }, [API_URL]);

  useEffect(() => {
    fetchMenu();
    fetchProductCounts();
  }, [fetchMenu, fetchProductCounts]);

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
    } catch {
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

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q.trim()) {
      setExpandedSports(computeMatchedSportIndices(menu, q));
    }
  };

  const handleToggleExpand = (idx: number) => {
    setExpandedSports((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleExpandAll = () => setExpandedSports(menu.map((_, i) => i));
  const handleCollapseAll = () => setExpandedSports([]);

  // --- CRUD SPORT LEVEL ---
  const handleAddSport = () => {
    if (!newSport.trim()) return;
    const newEntry: MegaMenuSport = {
      sport_type: newSport.trim(),
      product_types: [],
    };
    const updated = [...menu, newEntry];
    setMenu(updated);
    setExpandedSports((prev) => [...prev, updated.length - 1]);
    setNewSport('');
    notifications.show({
      title: 'Đã thêm',
      message: `Đã thêm môn "${newEntry.sport_type}". Hãy thêm các loại sản phẩm bên trong!`,
      color: 'green',
    });
  };

  const handleRemoveSport = (idx: number) => {
    setMenu((prev) => prev.filter((_, i) => i !== idx));
    setExpandedSports((prev) =>
      prev.filter((i) => i !== idx).map((i) => (i > idx ? i - 1 : i))
    );
  };

  const handleMoveSport = (idx: number, direction: 'up' | 'down') => {
    setMenu((prev) => swapItems(prev, idx, direction));
  };

  const handleUpdateSportName = (idx: number, newName: string) => {
    setMenu((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, sport_type: newName } : s))
    );
  };

  // --- CRUD PRODUCT TYPE LEVEL ---
  const handleAddProductType = (sIdx: number, pTypeName: string) => {
    setMenu((prev) =>
      prev.map((s, i) =>
        i === sIdx
          ? {
              ...s,
              product_types: [
                ...s.product_types,
                { product_type: pTypeName, categories: [] },
              ],
            }
          : s
      )
    );
  };

  const handleRemoveProductType = (sIdx: number, pIdx: number) => {
    setMenu((prev) =>
      prev.map((s, i) =>
        i === sIdx
          ? {
              ...s,
              product_types: s.product_types.filter((_, pi) => pi !== pIdx),
            }
          : s
      )
    );
  };

  const handleMoveProductType = (
    sIdx: number,
    pIdx: number,
    direction: 'up' | 'down'
  ) => {
    setMenu((prev) =>
      prev.map((s, i) =>
        i === sIdx
          ? { ...s, product_types: swapItems(s.product_types, pIdx, direction) }
          : s
      )
    );
  };

  const handleUpdateProductTypeName = (
    sIdx: number,
    pIdx: number,
    newName: string
  ) => {
    setMenu((prev) =>
      prev.map((s, i) =>
        i === sIdx
          ? {
              ...s,
              product_types: s.product_types.map((pt, pi) =>
                pi === pIdx ? { ...pt, product_type: newName } : pt
              ),
            }
          : s
      )
    );
  };

  // --- CRUD CATEGORY LEVEL ---
  const handleAddCategory = (sIdx: number, pIdx: number, catName: string) => {
    setMenu((prev) =>
      prev.map((s, i) =>
        i === sIdx
          ? {
              ...s,
              product_types: s.product_types.map((pt, pi) =>
                pi === pIdx
                  ? { ...pt, categories: [...pt.categories, { category: catName }] }
                  : pt
              ),
            }
          : s
      )
    );
  };

  const handleRemoveCategory = (sIdx: number, pIdx: number, cIdx: number) => {
    setMenu((prev) =>
      prev.map((s, i) =>
        i === sIdx
          ? {
              ...s,
              product_types: s.product_types.map((pt, pi) =>
                pi === pIdx
                  ? {
                      ...pt,
                      categories: pt.categories.filter((_, ci) => ci !== cIdx),
                    }
                  : pt
              ),
            }
          : s
      )
    );
  };

  const handleMoveCategory = (
    sIdx: number,
    pIdx: number,
    cIdx: number,
    direction: 'up' | 'down'
  ) => {
    setMenu((prev) =>
      prev.map((s, i) =>
        i === sIdx
          ? {
              ...s,
              product_types: s.product_types.map((pt, pi) =>
                pi === pIdx
                  ? { ...pt, categories: swapItems(pt.categories, cIdx, direction) }
                  : pt
              ),
            }
          : s
      )
    );
  };

  const handleUpdateCategoryName = (
    sIdx: number,
    pIdx: number,
    cIdx: number,
    newName: string
  ) => {
    setMenu((prev) =>
      prev.map((s, i) =>
        i === sIdx
          ? {
              ...s,
              product_types: s.product_types.map((pt, pi) =>
                pi === pIdx
                  ? {
                      ...pt,
                      categories: pt.categories.map((c, ci) =>
                        ci === cIdx ? { ...c, category: newName } : c
                      ),
                    }
                  : pt
              ),
            }
          : s
      )
    );
  };

  const handleToggleVisibility = (
    type: 'sport' | 'product' | 'category',
    sIdx: number,
    pIdx?: number,
    cIdx?: number
  ) => {
    setMenu((prev) =>
      prev.map((s, i) => {
        if (i !== sIdx) return s;
        if (type === 'sport') {
          return { ...s, is_hidden: !s.is_hidden };
        }
        if (type === 'product' && pIdx !== undefined) {
          return {
            ...s,
            product_types: s.product_types.map((pt, pi) =>
              pi === pIdx ? { ...pt, is_hidden: !pt.is_hidden } : pt
            ),
          };
        }
        if (type === 'category' && pIdx !== undefined && cIdx !== undefined) {
          return {
            ...s,
            product_types: s.product_types.map((pt, pi) =>
              pi === pIdx
                ? {
                    ...pt,
                    categories: pt.categories.map((c, ci) =>
                      ci === cIdx ? { ...c, is_hidden: !c.is_hidden } : c
                    ),
                  }
                : pt
            ),
          };
        }
        return s;
      })
    );
  };

  const filteredIndices = useMemo(
    () => computeMatchedSportIndices(menu, searchQuery),
    [menu, searchQuery]
  );

  return {
    mounted,
    menu,
    expandedSports,
    saving,
    isPreviewOpen,
    setIsPreviewOpen,
    searchQuery,
    handleSearchChange,
    newSport,
    setNewSport,
    totalProductsCount,
    productCountsBySport,
    productCountsByCategory,
    filteredIndices,
    saveMenu,
    handleResetDefault,
    handleToggleExpand,
    handleExpandAll,
    handleCollapseAll,
    handleAddSport,
    handleRemoveSport,
    handleMoveSport,
    handleUpdateSportName,
    handleAddProductType,
    handleRemoveProductType,
    handleMoveProductType,
    handleUpdateProductTypeName,
    handleAddCategory,
    handleRemoveCategory,
    handleMoveCategory,
    handleUpdateCategoryName,
    handleToggleVisibility,
  };
}
