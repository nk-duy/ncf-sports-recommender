import React from 'react';
import StoreManagement from '@/modules/quan-tri/cua-hang/components/StoreManagement';

export const metadata = {
  title: 'Quản lý cửa hàng | Admin KADY',
  description: 'Quản lý danh sách chi nhánh cửa hàng',
};

export default function AdminStoresPage() {
  return <StoreManagement />;
}
