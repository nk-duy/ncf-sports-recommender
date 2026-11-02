import type { AdminProductItem, ProductSortConfig, ProductTabType } from '../types';

export const formatProductPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export const mapProductTag = (t: string): string => {
  if (t === 'Dã ngoại') return 'Dã Ngoại / Cắm Trại';
  if (t === 'Đa dụng') return 'Gym / Yoga';
  if (t === 'Đá bóng') return 'Bóng Đá';
  if (t === 'Chạy bộ') return 'Chạy Bộ';
  if (t === 'Cầu lông') return 'Cầu Lông';
  if (t === 'Bóng chuyền') return 'Bóng Chuyền';
  if (t === 'Giày dép') return 'Giày';
  return t;
};

export const getProductCategoryArray = (product: AdminProductItem): string[] => {
  if (Array.isArray(product.category)) return product.category;
  if (typeof product.category === 'string' && product.category) return [product.category];
  return [];
};

export const getProductDisplayTags = (product: AdminProductItem): string[] => {
  const rawTags = [
    product.product_type,
    product.sport_type,
    ...getProductCategoryArray(product),
  ].filter((t): t is string => Boolean(t));
  const mappedTags = rawTags.map(mapProductTag);
  return Array.from(new Set(mappedTags)).slice(0, 3);
};

export function filterAndSortProducts(
  products: AdminProductItem[],
  params: {
    searchQuery: string;
    selectedCategory: string;
    selectedBrand: string;
    selectedStockStatus: string;
    activeTab: ProductTabType;
    sortConfig: ProductSortConfig | null;
  }
): AdminProductItem[] {
  const {
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedStockStatus,
    activeTab,
    sortConfig,
  } = params;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.product_id.toLowerCase().includes(searchQuery.toLowerCase());
    const rawTags = [p.product_type, p.sport_type, ...getProductCategoryArray(p)].filter(
      (t): t is string => Boolean(t)
    );
    const tags = rawTags.map(mapProductTag);
    const matchesCategory = selectedCategory === '' || tags.includes(selectedCategory);
    const matchesBrand =
      selectedBrand === ''
        ? true
        : selectedBrand === 'none'
          ? !p.brand || p.brand.trim() === ''
          : Boolean(p.brand && p.brand.toLowerCase() === selectedBrand.toLowerCase());

    const pStock = p.stock !== undefined ? p.stock : 100;
    let matchesStock = true;
    if (selectedStockStatus === 'in_stock') matchesStock = pStock > 10;
    else if (selectedStockStatus === 'low_stock') matchesStock = pStock > 0 && pStock <= 10;
    else if (selectedStockStatus === 'out_of_stock') matchesStock = pStock <= 0;

    let matchesTab = false;
    if (activeTab === 'all') matchesTab = !p.is_deleted && !p.is_hidden;
    else if (activeTab === 'promo') {
      matchesTab = !p.is_deleted && !p.is_hidden && (p.discount_percent || 0) > 0;
    } else if (activeTab === 'hidden') matchesTab = !p.is_deleted && Boolean(p.is_hidden);
    else if (activeTab === 'trash') matchesTab = Boolean(p.is_deleted);

    return matchesSearch && matchesCategory && matchesBrand && matchesStock && matchesTab;
  });

  const sortableProducts = [...filteredProducts];
  if (sortConfig !== null) {
    sortableProducts.sort((a, b) => {
      const getVal = (item: AdminProductItem, key: string): string | number => {
        if (key === 'stock') return item.stock !== undefined ? item.stock : 100;
        if (key === 'price') return item.price || 0;
        if (key === 'name') return item.name || '';
        if (key === 'product_id') return item.product_id || '';
        return '';
      };
      const aVal = getVal(a, sortConfig.key);
      const bVal = getVal(b, sortConfig.key);
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return sortableProducts;
}
