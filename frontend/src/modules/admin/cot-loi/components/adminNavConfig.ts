import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Gift,
  Tags,
  Layers,
  Image as ImageIcon,
  Users,
  Database,
  MessageSquare,
} from 'lucide-react';

export interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
  badgeKey?: 'pendingOrders';
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

// Tái cấu trúc theo 3 nhóm nghiệp vụ + Quản lý Đánh giá
export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    title: 'BÁN HÀNG & VẬN HÀNH',
    items: [
      { name: 'Tổng quan', path: '/admin', icon: LayoutDashboard },
      {
        name: 'Đơn hàng',
        path: '/admin/don-hang',
        icon: ShoppingCart,
        badgeKey: 'pendingOrders',
      },
      { name: 'Sản phẩm', path: '/admin/san-pham', icon: Package },
      { name: 'Đánh giá', path: '/admin/danh-gia', icon: MessageSquare },
      { name: 'Khách hàng', path: '/admin/khach-hang', icon: Users },
    ],
  },
  {
    title: 'MARKETING & NỘI DUNG',
    items: [
      { name: 'Khuyến mãi', path: '/admin/khuyen-mai', icon: Gift },
      { name: 'Banner', path: '/admin/banners', icon: ImageIcon },
    ],
  },
  {
    title: 'HỆ THỐNG & CẤU HÌNH',
    items: [
      { name: 'Danh mục', path: '/admin/danh-muc', icon: Layers },
      { name: 'Thuộc tính', path: '/admin/thuoc-tinh', icon: Tags },
      { name: 'Đặc tả CSDL', path: '/admin/db-schema', icon: Database },
    ],
  },
];
