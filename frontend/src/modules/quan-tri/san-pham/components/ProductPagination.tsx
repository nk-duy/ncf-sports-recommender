'use client';
import React from 'react';
import Pagination from '@/shared/components/Pagination';

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
}

export default function ProductPagination({
  currentPage,
  totalPages,
  totalProducts,
  itemsPerPage,
  setCurrentPage,
}: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

  return (
    <div className="px-6 py-4 bg-white border border-gray-200/80 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Thông tin số lượng */}
      <div className="text-xs sm:text-sm text-gray-600 font-medium">
        Hiển thị <span className="font-bold text-gray-900">{startItem}</span> - <span className="font-bold text-gray-900">{endItem}</span> trong tổng số <span className="font-bold text-gray-900">{totalProducts.toLocaleString('vi-VN')}</span> sản phẩm
      </div>

      {/* Phân trang dạng ô vuông chuẩn theo thiết kế */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        siblingCount={1}
        showEllipsis={totalPages > 6}
      />
    </div>
  );
}
