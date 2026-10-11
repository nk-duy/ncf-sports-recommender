import React, { useState, useMemo } from "react";
import { Edit2, Trash2, Plus, Search, Filter, Copy, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { notifications } from "@mantine/notifications";

export default function VoucherTable({ vouchers, onEdit, onDelete, onCreate, onStatusToggle }: { 
  vouchers: any[], 
  onEdit: (v: any) => void, 
  onDelete: (id: string) => void, 
  onCreate: () => void,
  onStatusToggle?: (id: string, currentStatus: boolean) => void 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, paused
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // For Copy visual feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa voucher này?")) {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/vouchers/${id}`, { method: 'DELETE' });
        if (res.ok) {
          notifications.show({ title: 'Thành công', message: 'Đã xóa voucher.', color: 'green' });
          onDelete(id);
        } else {
          notifications.show({ title: 'Lỗi', message: 'Không thể xóa voucher.', color: 'red' });
        }
      } catch (err) {
        notifications.show({ title: 'Lỗi', message: 'Lỗi mạng', color: 'red' });
      }
    }
  };

  const handleToggleStatus = async (voucher: any) => {
    if (onStatusToggle) {
      onStatusToggle(voucher._id, voucher.is_active);
    } else {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/vouchers/${voucher._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_active: !voucher.is_active })
        });
        if (res.ok) {
          notifications.show({ title: 'Thành công', message: `Đã ${!voucher.is_active ? 'bật' : 'tắt'} voucher ${voucher.code}.`, color: 'green' });
          window.location.reload(); 
        } else {
          notifications.show({ title: 'Lỗi', message: 'Không thể cập nhật trạng thái.', color: 'red' });
        }
      } catch (err) {
        notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối', color: 'red' });
      }
    }
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    notifications.show({ title: 'Đã copy', message: `Mã ${code} đã lưu vào clipboard.`, color: 'blue' });
  };

  // Filter & Search Logic
  const filteredVouchers = useMemo(() => {
    let result = vouchers;

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(v => v.code?.toLowerCase().includes(term));
    }

    // Status
    if (statusFilter === 'active') {
      result = result.filter(v => v.is_active);
    } else if (statusFilter === 'paused') {
      result = result.filter(v => !v.is_active);
    }

    return result;
  }, [vouchers, searchTerm, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredVouchers.length / pageSize);
  const paginatedVouchers = filteredVouchers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset to page 1 on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header Actions */}
      <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm mã voucher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang chạy</option>
            <option value="paused">Đã dừng</option>
          </select>
        </div>
        
        <button onClick={onCreate} className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          <Plus size={18} />
          Tạo Voucher
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Mã Code</th>
              <th className="px-6 py-4 font-semibold">Giảm Giá</th>
              <th className="px-6 py-4 font-semibold">Điều Kiện</th>
              <th className="px-6 py-4 font-semibold">Đã Dùng / Tổng</th>
              <th className="px-6 py-4 font-semibold">Thời Hạn</th>
              <th className="px-6 py-4 font-semibold text-center">Trạng Thái</th>
              <th className="px-6 py-4 font-semibold text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {paginatedVouchers.map((voucher) => (
              <tr key={voucher._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-md tracking-wider">
                      {voucher.code}
                    </span>
                    <button 
                      onClick={() => handleCopy(voucher.code, voucher._id)}
                      className={`p-1.5 rounded-md transition-all ${
                        copiedId === voucher._id 
                          ? 'bg-green-100 text-green-600' 
                          : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      title="Copy mã code"
                    >
                      {copiedId === voucher._id ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-red-600">
                    {voucher.discount_type === "percent" 
                      ? `${voucher.discount_value}%` 
                      : voucher.discount_type === 'freeship' 
                        ? 'Miễn phí vận chuyển' 
                        : formatCurrency(voucher.discount_value)}
                  </span>
                  {voucher.max_discount && (
                    <div className="text-[11px] font-medium text-gray-500 mt-0.5">
                      Tối đa {formatCurrency(voucher.max_discount)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">
                  <div>Đơn từ {formatCurrency(voucher.min_order_value)}</div>
                  {voucher.applicable_categories && voucher.applicable_categories.length > 0 && (
                    <div className="text-[11px] text-blue-600 bg-blue-50 border border-blue-100 rounded px-2 py-0.5 w-max mt-1">
                      Áp dụng: {voucher.applicable_categories.join(', ')}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5 w-24">
                    <div className="text-xs font-semibold text-gray-700 flex justify-between">
                      <span>{voucher.used_count || 0}</span>
                      <span className="text-gray-400">/ {voucher.usage_limit ? voucher.usage_limit : '∞'}</span>
                    </div>
                    {voucher.usage_limit && (
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full transition-all ${
                            (voucher.used_count / voucher.usage_limit) >= 1 ? 'bg-red-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${Math.min(((voucher.used_count || 0) / voucher.usage_limit) * 100, 100)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {!voucher.valid_from && !voucher.valid_until ? (
                    <span className="inline-flex px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-bold border border-purple-100">
                      Vĩnh viễn
                    </span>
                  ) : (
                    <div className="flex flex-col text-xs text-gray-600 gap-1">
                      {voucher.valid_from && (
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span className="font-medium text-gray-700">{formatDate(voucher.valid_from)}</span>
                        </span>
                      )}
                      {voucher.valid_until && (
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          <span className="font-medium text-gray-700">{formatDate(voucher.valid_until)}</span>
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => handleToggleStatus(voucher)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all shadow-sm flex items-center justify-center min-w-[95px] mx-auto ${
                      voucher.is_active 
                        ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700 hover:border-red-200 group border border-green-200' 
                        : 'bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700 hover:border-green-200 group border border-gray-200'
                    }`}
                    title={voucher.is_active ? "Nhấn để tạm dừng" : "Nhấn để kích hoạt lại"}
                  >
                    <span className="group-hover:hidden uppercase">{voucher.is_active ? 'Đang chạy' : 'Đã dừng'}</span>
                    <span className="hidden group-hover:block uppercase">{voucher.is_active ? 'Tạm dừng' : 'Kích hoạt'}</span>
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onEdit(voucher)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Chỉnh sửa">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(voucher._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Xóa">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredVouchers.length === 0 && (
          <div className="p-12 flex flex-col items-center justify-center text-gray-500 bg-white">
            <Search size={48} className="text-gray-200 mb-4" />
            <p className="font-bold text-lg text-gray-700">Không tìm thấy mã giảm giá nào</p>
            <p className="text-sm mt-1">Thử thay đổi từ khóa hoặc bộ lọc</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <p className="text-sm text-gray-600">
            Hiển thị <span className="font-bold text-gray-900">{(currentPage - 1) * pageSize + 1}</span> - <span className="font-bold text-gray-900">{Math.min(currentPage * pageSize, filteredVouchers.length)}</span> trên tổng số <span className="font-bold text-gray-900">{filteredVouchers.length}</span> mã
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-bold transition ${
                        currentPage === page 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-gray-600 hover:bg-gray-100 bg-white border border-transparent hover:border-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="text-gray-400">...</span>;
                }
                return null;
              })}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
