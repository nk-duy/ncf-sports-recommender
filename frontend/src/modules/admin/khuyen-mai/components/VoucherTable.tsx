"use client";

import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { notifications } from "@mantine/notifications";
import Pagination from "@/shared/components/Pagination";
import { getAuthHeaders } from "@/shared/lib/authHeader";
import { resolveApiBaseUrl } from "@/shared/lib/apiUrl";
import { VoucherItem } from "../types";
import VoucherTableRow from "./VoucherTableRow";

interface VoucherTableProps {
  vouchers: VoucherItem[];
  onEdit: (v: VoucherItem) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  onStatusToggle?: (id: string, currentStatus: boolean) => void;
}

export default function VoucherTable({
  vouchers,
  onEdit,
  onDelete,
  onCreate,
  onStatusToggle,
}: VoucherTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa voucher này?")) {
      try {
        const apiUrl = resolveApiBaseUrl();
        const res = await fetch(`${apiUrl}/vouchers/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          notifications.show({
            title: "Thành công",
            message: "Đã xóa voucher.",
            color: "green",
          });
          onDelete(id);
        } else {
          notifications.show({
            title: "Lỗi",
            message: "Không thể xóa voucher.",
            color: "red",
          });
        }
      } catch {
        notifications.show({ title: "Lỗi", message: "Lỗi mạng", color: "red" });
      }
    }
  };

  const handleToggleStatus = async (voucher: VoucherItem) => {
    if (onStatusToggle) {
      onStatusToggle(voucher._id, voucher.is_active);
    } else {
      try {
        const apiUrl = resolveApiBaseUrl();
        const res = await fetch(
          `${apiUrl}/vouchers/${voucher._id}`,
          {
            method: "PUT",
            headers: getAuthHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ is_active: !voucher.is_active }),
          }
        );
        if (res.ok) {
          notifications.show({
            title: "Thành công",
            message: `Đã ${!voucher.is_active ? "bật" : "tắt"} voucher ${voucher.code}.`,
            color: "green",
          });
          window.location.reload();
        } else {
          notifications.show({
            title: "Lỗi",
            message: "Không thể cập nhật trạng thái.",
            color: "red",
          });
        }
      } catch {
        notifications.show({ title: "Lỗi", message: "Lỗi kết nối", color: "red" });
      }
    }
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    notifications.show({
      title: "Đã copy",
      message: `Mã ${code} đã lưu vào clipboard.`,
      color: "blue",
    });
  };

  const filteredVouchers = useMemo(() => {
    let result = vouchers;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((v) => v.code?.toLowerCase().includes(term));
    }
    if (statusFilter === "active") {
      result = result.filter((v) => v.is_active);
    } else if (statusFilter === "paused") {
      result = result.filter((v) => !v.is_active);
    }
    return result;
  }, [vouchers, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredVouchers.length / pageSize);
  const paginatedVouchers = filteredVouchers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
      {/* Header Actions */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Tìm kiếm mã voucher..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition"
            />
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto h-10 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs cursor-pointer hover:bg-slate-50 transition"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang chạy</option>
            <option value="paused">Đã dừng</option>
          </select>
        </div>

        <button
          onClick={onCreate}
          className="w-full md:w-auto h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-2xs hover:shadow-xs transition inline-flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>Tạo Voucher</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200/80 select-none">
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5">
                Mã Code
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5">
                Giảm Giá
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5">
                Điều Kiện
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5">
                Đã Dùng / Tổng
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5">
                Thời Hạn
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5 text-center">
                Trạng Thái
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5 text-right">
                Thao Tác
              </th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100 text-slate-700">
            {paginatedVouchers.map((voucher) => (
              <VoucherTableRow
                key={voucher._id}
                voucher={voucher}
                copiedId={copiedId}
                onCopy={handleCopy}
                onToggleStatus={handleToggleStatus}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>

        {filteredVouchers.length === 0 && (
          <div className="p-12 flex flex-col items-center justify-center text-gray-500 bg-white">
            <Search size={48} className="text-gray-200 mb-4" />
            <p className="font-bold text-lg text-gray-700">
              Không tìm thấy mã giảm giá nào
            </p>
            <p className="text-sm mt-1">Thử thay đổi từ khóa hoặc bộ lọc</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
        <p className="text-sm text-gray-500">
          Hiển thị{" "}
          <span className="font-semibold text-gray-900">
            {filteredVouchers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
          </span>{" "}
          -{" "}
          <span className="font-semibold text-gray-900">
            {Math.min(currentPage * pageSize, filteredVouchers.length)}
          </span>{" "}
          trên tổng số{" "}
          <span className="font-semibold text-gray-900">{filteredVouchers.length}</span> mã
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
