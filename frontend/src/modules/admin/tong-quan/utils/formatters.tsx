import type { ReactNode } from 'react';

export function formatDashboardPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export function formatDashboardOrderDate(dateStr?: string): string {
  if (!dateStr) return 'Mới đây';
  const d = new Date(dateStr);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} - ${d.getDate()}/${d.getMonth() + 1}`;
}

export function renderOrderStatusBadge(status?: string): ReactNode {
  const s = (status || '').toLowerCase();
  if (s.includes('pend') || s.includes('chờ')) {
    return (
      <span className="whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
        Chờ duyệt
      </span>
    );
  }
  if (s.includes('proc') || s.includes('xử')) {
    return (
      <span className="whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
        Đang xử lý
      </span>
    );
  }
  if (s.includes('ship') || s.includes('giao')) {
    return (
      <span className="whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200/60">
        Đang giao
      </span>
    );
  }
  if (s.includes('deliv') || s.includes('comp') || s.includes('hoàn')) {
    return (
      <span className="whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
        Hoàn thành
      </span>
    );
  }
  if (s.includes('canc') || s.includes('hủy')) {
    return (
      <span className="whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
        Đã hủy
      </span>
    );
  }
  return (
    <span className="whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
      Mới
    </span>
  );
}

