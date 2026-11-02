"use client";

import React, { RefObject } from "react";
import Pagination from "@/shared/components/Pagination";
import type { CustomerItem } from "../types";
import CustomerTableRow from "./CustomerTableRow";

interface CustomerTableProps {
  customers: CustomerItem[];
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
  onEditCustomer: (customer: CustomerItem) => void;
  onSendSingleVoucher: (customer: CustomerItem) => void;
  onViewOrders: (customer: CustomerItem) => void;
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
      className={`flex flex-col bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden transition-all duration-300 ${
        activeCustomerId ? "lg:col-span-8" : "lg:col-span-12"
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-100">
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5">
                Khách hàng
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5">
                Hạng TV
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5">
                Bộ môn quan tâm
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5 text-center">
                Đơn
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5 text-right">
                Tổng chi tiêu
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5">
                Lần cuối mua
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5 text-center">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="size-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                    <span>Đang tải danh sách khách hàng...</span>
                  </div>
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  Không tìm thấy khách hàng nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <CustomerTableRow
                  key={customer.id}
                  customer={customer}
                  isActive={activeCustomerId === customer.id}
                  isChecked={selectedIds.includes(customer.id)}
                  isMenuOpen={menuOpenId === customer.id}
                  compactSpent={Boolean(activeCustomerId)}
                  menuRef={menuRef}
                  onToggleSelect={onToggleSelect}
                  onSelectCustomer={onSelectCustomer}
                  onToggleMenu={onToggleMenu}
                  onEditCustomer={onEditCustomer}
                  onSendSingleVoucher={onSendSingleVoucher}
                  onViewOrders={onViewOrders}
                  onDeleteCustomer={onDeleteCustomer}
                />
              ))
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
