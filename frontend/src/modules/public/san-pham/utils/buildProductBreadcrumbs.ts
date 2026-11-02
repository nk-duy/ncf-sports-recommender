import type { ProductDetail } from '../types';

export interface BreadcrumbNode {
  label: string;
  href?: string;
}

/**
 * Xây dựng breadcrumbs chuẩn cấp độ từ tổng quan đến chi tiết:
 * Trang chủ > [Nhóm/Môn thể thao] > [Loại sản phẩm] > [Danh mục chi tiết] > Tên sản phẩm
 */
export function buildProductBreadcrumbs(product: ProductDetail): BreadcrumbNode[] {
  const items: BreadcrumbNode[] = [{ label: 'Trang chủ', href: '/' }];

  if (product.sport_type) {
    items.push({
      label: product.sport_type,
      href: `/san-pham?sport_type=${encodeURIComponent(product.sport_type)}`,
    });
  }

  if (product.product_type) {
    const href = product.sport_type
      ? `/san-pham?sport_type=${encodeURIComponent(product.sport_type)}&product_type=${encodeURIComponent(product.product_type)}`
      : `/san-pham?product_type=${encodeURIComponent(product.product_type)}`;
    items.push({
      label: product.product_type,
      href,
    });
  }

  const subCat =
    product.sub_category ||
    (product.category && product.category.find((c) => c !== product.sport_type && c !== product.product_type));
  if (subCat && subCat !== product.sport_type && subCat !== product.product_type) {
    items.push({
      label: subCat,
      href: `/san-pham?category=${encodeURIComponent(subCat)}`,
    });
  }

  // Nếu không có sport_type/product_type thì dùng fallback category
  if (items.length === 1) {
    if (product.category && product.category.length > 0) {
      product.category.forEach((c) => {
        items.push({ label: c, href: `/san-pham?category=${encodeURIComponent(c)}` });
      });
    } else {
      items.push({ label: 'Sản phẩm', href: '/san-pham' });
    }
  }

  items.push({ label: product.name });
  return items;
}
