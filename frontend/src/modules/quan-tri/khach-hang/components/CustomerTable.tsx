"use client";

import React, { RefObject } from "react";
import { Eye, MoreVertical, Edit3, Gift, ShoppingBag, Trash2 } from "lucide-react";
import Pagination from "@/shared/components/Pagination";

interface CustomerTableProps {
  customers: any[];
  loading: boolean;
  selectedIds: string[];
  activeCustomerId: string | null;
  menuOpenId: string | null;
  menuRef: RefObject<HTMLDivElement | null>;
  page: number;
  totalPages: number;
  totalCustomers: number;
  onPageChange: (page: number) => void;
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleSelect: (id: string, e: React.MouseEvent) => void;
  onSelectCustomer: (id: string) => void;
  onToggleMenu: (id: string) => void;
  onEditCustomer: (customer: any) => void;
  onSendSingleVoucher: (customer: any) => void;
  onViewOrders: (customer: any) => void;
  onDeleteCustomer: (id: string, name: string) => void;
}

export default function CustomerTable({
  customers,
  loading,
  selectedIds,
  activeCustomerId,
  menuOpenId,
  menuRef,
  page,
  totalPages,
  totalCustomers,
  onPageChange,
  onSelectAll,
  onToggleSelect,
  onSelectCustomer,
  onToggleMenu,
  onEditCustomer,
  onSendSingleVoucher,
  onViewOrders,
  onDeleteCustomer,
}: CustomerTableProps) {
  const isAllSelected = customers.length > 0 && selectedIds.length === customers.length;

  return (
    <div
      className={`flex flex-col bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden transition-all duration-300 ${
        activeCustomerId ? "lg:col-span-8" : "lg:col-span-12"
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
              <th className="py-3 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="py-3 px-4">Khách hàng</th>
              <th className="py-3 px-4">Hạng TV</th>
              <th className="py-3 px-4">Bộ môn quan tâm</th>
              <th className="py-3 px-4 text-center">Đơn</th>
              <th className="py-3 px-4 text-right">Tổng chi tiêu</th>
              <th className="py-3 px-4">Lần cuối mua</th>
              <th className="py-3 px-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                    <span>Đang tải danh sách khách hàng...</span>
                  </div>
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-500">
                  Không tìm thấy khách hàng nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              customers.map((customer) => {
                const isActive = activeCustomerId === customer.id;
                const TierIcon = customer.tierIcon;
                const isChecked = selectedIds.includes(customer.id);
                const isMenuOpen = menuOpenId === customer.id;

                return (
                  <tr
                    key={customer.id}
                    onClick={() => onSelectCustomer(customer.id)}
                    className={`cursor-pointer transition-colors ${
                      isActive ? "bg-blue-50/60 hover:bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <td
                      className="py-3 px-3 text-center"
                      onClick={(e) => onToggleSelect(customer.id, e)}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full ${customer.tierColors.badge} ${customer.tierColors.badgeText} font-bold flex items-center justify-center text-xs shrink-0`}
                        >
                          {customer.initials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors">
                            {customer.name}
                          </span>
                          <span className="font-mono text-[11px] text-gray-500">
                            {customer.code} • {customer.phone}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${customer.tierColors.bg} ${customer.tierColors.text} text-[11px] font-bold`}
                      >
                        <TierIcon size={12} className={customer.tierColors.icon} />
                        {customer.tier}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {customer.sports.map((sport: string) => (
                          <span
                            key={sport}
                            className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[11px] font-medium border border-gray-200"
                          >
                            {sport}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold text-gray-900">
                      {customer.orders}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-gray-900">
                      {activeCustomerId ? customer.spentShort : customer.spentFormatted}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-gray-500 text-xs font-medium">
                      {customer.lastPurchase}
                    </td>
                    <td
                      className="py-3 px-3 text-center relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="p-1 rounded hover:bg-gray-200 text-blue-600 transition-colors cursor-pointer"
                          title="Xem chi tiết"
                          onClick={() => onSelectCustomer(customer.id)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="p-1 rounded hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
                          title="Tùy chọn"
                          onClick={() => onToggleMenu(customer.id)}
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div
                          ref={menuRef}
                          className="absolute right-2 top-8 z-30 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 text-left text-xs animate-in fade-in zoom-in-95 duration-150"
                        >
                          <button
                            onClick={() => {
                              onSelectCustomer(customer.id);
                              onToggleMenu("");
                            }}
                            className="w-full px-3.5 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 font-medium"
                          >
                            <Eye size={14} className="text-blue-600" />
                            <span>Xem chi tiết hồ sơ</span>
                          </button>
                          <button
                            onClick={() => {
                              onEditCustomer(customer);
                              onToggleMenu("");
                            }}
                            className="w-full px-3.5 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 font-medium"
                          >
                            <Edit3 size={14} className="text-amber-600" />
                            <span>Chỉnh sửa thông tin</span>
                          </button>
                          <button
                            onClick={() => {
                              onSendSingleVoucher(customer);
                              onToggleMenu("");
                            }}
                            className="w-full px-3.5 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 font-medium"
                          >
                            <Gift size={14} className="text-green-600" />
                            <span>Tặng Voucher riêng</span>
                          </button>
                          <button
                            onClick={() => {
                              onViewOrders(customer);
                              onToggleMenu("");
                            }}
                            className="w-full px-3.5 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 font-medium"
                          >
                            <ShoppingBag size={14} className="text-purple-600" />
                            <span>Xem lịch sử đơn hàng</span>
                          </button>
                          <div className="my-1 border-t border-gray-100" />
                          <button
                            onClick={() => {
                              onDeleteCustomer(customer.id, customer.name);
                              onToggleMenu("");
                            }}
                            className="w-full px-3.5 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium"
                          >
                            <Trash2 size={14} />
                            <span>Xóa khách hàng</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-4 bg-white border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div className="text-sm text-gray-500">
          Hiển thị{" "}
          <span className="font-semibold text-gray-900">
            {totalCustomers === 0 ? 0 : (page - 1) * 10 + 1} -{" "}
            {Math.min(page * 10, totalCustomers)}
          </span>{" "}
          của{" "}
          <span className="font-semibold text-gray-900">
            {totalCustomers.toLocaleString("vi-VN")}
          </span>{" "}
          khách hàng
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          showEllipsis={true}
        />
      </div>
    </div>
  );
}
