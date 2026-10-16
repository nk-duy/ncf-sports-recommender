'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Số trang hiển thị hai bên trang hiện tại (mặc định = 1 để hiển thị dạng [2] [3] [4] giống mẫu) */
  siblingCount?: number;
  /** Có hiển thị dấu ... và trang đầu/cuối khi số trang lớn không (mặc định: false khi muốn gọn giống hệt mẫu) */
  showEllipsis?: boolean;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showEllipsis = false,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Tính toán danh sách số trang cần hiển thị
  const getPages = () => {
    // Nếu tổng số trang nhỏ (<= 4), hiển thị tất cả
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, currentPage - siblingCount);
    let end = Math.min(totalPages, currentPage + siblingCount);

    // Đảm bảo luôn đủ số ô (3 ô) nếu ở đầu hoặc cuối danh sách
    if (currentPage === 1) {
      end = Math.min(totalPages, start + siblingCount * 2);
    } else if (currentPage === totalPages) {
      start = Math.max(1, end - siblingCount * 2);
    }

    const pages: (number | string)[] = [];

    if (showEllipsis && start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (showEllipsis && end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPages();

  return (
    <div className={`flex items-center justify-center gap-2 select-none ${className}`}>
      {/* Nút Lùi (<) */}
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="w-10 h-10 flex items-center justify-center border border-gray-300 bg-white text-gray-900 rounded-[2px] hover:border-[#ea9e48] hover:text-[#ea9e48] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-900 transition-colors shadow-2xs"
        aria-label="Trang trước"
      >
        <ChevronLeft size={18} strokeWidth={2.4} />
      </button>

      {/* Các ô số trang */}
      {pages.map((p, idx) => {
        if (p === '...') {
          return (
            <span
              key={`dots-${idx}`}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 bg-white text-gray-400 font-bold text-xs rounded-[2px]"
            >
              ...
            </span>
          );
        }

        const pageNum = p as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={`w-10 h-10 flex items-center justify-center font-bold text-base rounded-[2px] transition-all shadow-2xs ${
              isActive
                ? 'bg-[#ea9e48] border border-[#ea9e48] text-white cursor-default'
                : 'bg-white border border-gray-300 text-gray-900 hover:border-[#ea9e48] hover:text-[#ea9e48]'
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Nút Tiến (>) */}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="w-10 h-10 flex items-center justify-center border border-gray-300 bg-white text-gray-900 rounded-[2px] hover:border-[#ea9e48] hover:text-[#ea9e48] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-900 transition-colors shadow-2xs"
        aria-label="Trang sau"
      >
        <ChevronRight size={18} strokeWidth={2.4} />
      </button>
    </div>
  );
}
