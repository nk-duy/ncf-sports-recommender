import React from "react";
import { Edit2, Trash2, Plus, Search, Filter } from "lucide-react";

interface Voucher {
  id: string;
  code: string;
  type: string;
  value: number;
  maxDiscount: number | null;
  minOrderValue: number;
  usageLimit: number | null;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: string;
}

export default function VoucherTable({ vouchers }: { vouchers: Voucher[] }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header Actions */}
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm mã voucher..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
            <Filter size={18} />
          </button>
        </div>
        
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          <Plus size={18} />
          Tạo Voucher
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Mã Code</th>
              <th className="px-6 py-4 font-semibold">Giảm Giá</th>
              <th className="px-6 py-4 font-semibold">Điều Kiện</th>
              <th className="px-6 py-4 font-semibold">Đã Dùng / Tổng</th>
              <th className="px-6 py-4 font-semibold">Thời Hạn</th>
              <th className="px-6 py-4 font-semibold">Trạng Thái</th>
              <th className="px-6 py-4 font-semibold text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {vouchers.map((voucher) => (
              <tr key={voucher.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">
                  <div className="bg-gray-100 border border-gray-200 px-2 py-1 rounded w-max">
                    {voucher.code}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-red-600">
                    {voucher.type === "percentage" ? `${voucher.value}%` : formatCurrency(voucher.value)}
                  </span>
                  {voucher.maxDiscount && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      Tối đa {formatCurrency(voucher.maxDiscount)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  Đơn từ {formatCurrency(voucher.minOrderValue)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5 w-24">
                    <div className="text-xs font-semibold text-gray-700 flex justify-between">
                      <span>{voucher.usedCount}</span>
                      <span className="text-gray-400">/ {voucher.usageLimit ? voucher.usageLimit : '∞'}</span>
                    </div>
                    {voucher.usageLimit && (
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${Math.min((voucher.usedCount / voucher.usageLimit) * 100, 100)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col text-xs text-gray-600 gap-0.5">
                    <span className="font-medium text-green-600">{formatDate(voucher.startDate)}</span>
                    <span className="text-gray-400">đến</span>
                    <span className="font-medium text-red-600">{formatDate(voucher.endDate)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                    voucher.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {voucher.status === 'active' ? 'Đang chạy' : 'Đã dừng'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Chỉnh sửa">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {vouchers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Không tìm thấy voucher nào.
          </div>
        )}
      </div>
    </div>
  );
}
