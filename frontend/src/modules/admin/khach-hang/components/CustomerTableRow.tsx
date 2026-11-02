"use client";

import React, { RefObject } from "react";
import { Eye, MoreVertical, Edit3, Gift, ShoppingBag, Trash2 } from "lucide-react";
import type { CustomerItem } from "../types";

interface CustomerTableRowProps {
  customer: CustomerItem;
  isActive: boolean;
  isChecked: boolean;
  isMenuOpen: boolean;
  compactSpent: boolean;
  menuRef: RefObject<HTMLDivElement | null>;
  onToggleSelect: (id: string, e: React.MouseEvent) => void;
  onSelectCustomer: (id: string) => void;
  onToggleMenu: (id: string) => void;
  onEditCustomer: (customer: CustomerItem) => void;
  onSendSingleVoucher: (customer: CustomerItem) => void;
  onViewOrders: (customer: CustomerItem) => void;
  onDeleteCustomer: (id: string, name: string) => void;
}

export default function CustomerTableRow({
  customer,
  isActive,
  isChecked,
  isMenuOpen,
  compactSpent,
  menuRef,
  onToggleSelect,
  onSelectCustomer,
  onToggleMenu,
  onEditCustomer,
  onSendSingleVoucher,
  onViewOrders,
  onDeleteCustomer,
}: CustomerTableRowProps) {
  const TierIcon = customer.tierIcon;

  return (
    <tr
      onClick={() => onSelectCustomer(customer.id)}
      className={`cursor-pointer transition-colors ${
        isActive ? "bg-blue-50/60 hover:bg-blue-50" : "hover:bg-slate-50/70"
      }`}
    >
      <td
        className="py-3 px-3.5 text-center"
        onClick={(e) => onToggleSelect(customer.id, e)}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => {}}
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      </td>
      <td className="py-3 px-3.5">
        <div className="flex items-center gap-3">
          <div
            className={`size-8 rounded-full ${customer.tierColors.badge} ${customer.tierColors.badgeText} font-bold flex items-center justify-center text-xs shrink-0`}
          >
            {customer.initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-slate-900 truncate hover:text-blue-600 transition-colors">
              {customer.name}
            </span>
            <span className="font-sans tabular-nums text-[11px] text-slate-500 truncate">
              {customer.code} • {customer.phone}
            </span>
          </div>
        </div>
      </td>
      <td className="py-3 px-3.5 whitespace-nowrap">
        <span
          className={`whitespace-nowrap inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md ${customer.tierColors.bg} ${customer.tierColors.text} text-xs font-medium`}
        >
          <TierIcon size={12} className={customer.tierColors.icon} />
          {customer.tier}
        </span>
      </td>
      <td className="py-3 px-3.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {customer.sports.map((sport) => (
            <span
              key={sport}
              className="whitespace-nowrap inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60"
            >
              {sport}
            </span>
          ))}
        </div>
      </td>
      <td className="py-3 px-3.5 text-center font-sans tabular-nums font-semibold text-slate-900">
        {customer.orders}
      </td>
      <td className="py-3 px-3.5 text-right font-sans tabular-nums font-semibold text-slate-900">
        {compactSpent ? customer.spentShort : customer.spentFormatted}
      </td>
      <td className="py-3 px-3.5 whitespace-nowrap text-slate-500 text-xs font-medium tabular-nums">
        {customer.lastPurchase}
      </td>
      <td
        className="py-3 px-3.5 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center gap-1">
          <button
            className="size-8 inline-flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors duration-150"
            title="Xem chi tiết"
            aria-label="Xem chi tiết"
            onClick={() => onSelectCustomer(customer.id)}
          >
            <Eye size={16} />
          </button>
          <button
            className="size-8 inline-flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors duration-150"
            title="Tùy chọn thao tác"
            aria-label="Tùy chọn thao tác"
            onClick={() => onToggleMenu(customer.id)}
          >
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-2 top-8 z-30 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 text-left text-xs animate-in fade-in zoom-in-95 duration-150"
          >
            <button
              onClick={() => {
                onSelectCustomer(customer.id);
                onToggleMenu("");
              }}
              className="w-full px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium"
            >
              <Eye size={14} className="text-blue-600" />
              <span>Xem chi tiết hồ sơ</span>
            </button>
            <button
              onClick={() => {
                onEditCustomer(customer);
                onToggleMenu("");
              }}
              className="w-full px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium"
            >
              <Edit3 size={14} className="text-amber-600" />
              <span>Chỉnh sửa thông tin</span>
            </button>
            <button
              onClick={() => {
                onSendSingleVoucher(customer);
                onToggleMenu("");
              }}
              className="w-full px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium"
            >
              <Gift size={14} className="text-green-600" />
              <span>Tặng Voucher riêng</span>
            </button>
            <button
              onClick={() => {
                onViewOrders(customer);
                onToggleMenu("");
              }}
              className="w-full px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium"
            >
              <ShoppingBag size={14} className="text-purple-600" />
              <span>Xem lịch sử đơn hàng</span>
            </button>
            <div className="my-1 border-t border-slate-100" />
            <button
              onClick={() => {
                onDeleteCustomer(customer.id, customer.name);
                onToggleMenu("");
              }}
              className="w-full px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-medium"
            >
              <Trash2 size={14} />
              <span>Xóa khách hàng</span>
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
