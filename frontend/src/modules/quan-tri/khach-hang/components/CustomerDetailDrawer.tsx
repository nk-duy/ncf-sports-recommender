"use client";

import React from "react";
import {
  X,
  Edit3,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Gift,
} from "lucide-react";

interface CustomerDetailDrawerProps {
  customer: any;
  orders: any[];
  loadingOrders: boolean;
  onClose: () => void;
  onEdit: (customer: any) => void;
  onSendEmail: (customer: any) => void;
  onSendVoucher: (customer: any) => void;
  onViewAllOrders: (customer: any) => void;
}

export default function CustomerDetailDrawer({
  customer,
  orders,
  loadingOrders,
  onClose,
  onEdit,
  onSendEmail,
  onSendVoucher,
  onViewAllOrders,
}: CustomerDetailDrawerProps) {
  if (!customer) return null;

  const TierIcon = customer.tierIcon;

  return (
    <div className="lg:col-span-4 bg-white rounded-xl shadow-xs border border-gray-100 p-5 flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
      {/* Profile Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full ${customer.tierColors.badge} ${customer.tierColors.badgeText} flex items-center justify-center font-bold text-lg shrink-0 shadow-xs`}
          >
            {customer.initials}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-bold text-gray-900">{customer.name}</span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${customer.tierColors.bg} ${customer.tierColors.text} text-[10px] font-bold`}
              >
                {TierIcon && <TierIcon size={12} className={customer.tierColors.icon} />}
                {customer.tier}
              </span>
            </div>
            <span className="font-mono text-xs text-gray-500 mt-0.5">
              Mã: {customer.code} • Tham gia: {customer.joinDate}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-1 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
            title="Chỉnh sửa hồ sơ"
            onClick={() => onEdit(customer)}
          >
            <Edit3 size={17} />
          </button>
          <button
            className="p-1 rounded text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
            title="Đóng bảng chi tiết"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex flex-col gap-2 text-sm text-gray-700">
        <div className="flex items-center gap-2.5">
          <Mail size={16} className="text-gray-400" />
          <span className="font-mono text-xs">{customer.email}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Phone size={16} className="text-gray-400" />
          <span className="font-mono text-xs">{customer.phone}</span>
        </div>
        <div className="flex items-start gap-2.5">
          <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
          <span className="leading-snug text-xs">{customer.address}</span>
        </div>
      </div>

      {/* Customer KPI Mini Grid */}
      <div className="grid grid-cols-3 gap-2 bg-blue-50/50 border border-blue-100 p-3 rounded-lg text-center">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Tổng đơn
          </span>
          <span className="text-lg font-bold text-gray-900 mt-0.5">{customer.orders}</span>
        </div>
        <div className="flex flex-col border-x border-blue-100/50">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Chi tiêu
          </span>
          <span className="text-lg font-bold text-blue-600 mt-0.5">{customer.spentShort}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Hoàn trả
          </span>
          <span className="text-lg font-bold text-green-600 mt-0.5">{customer.returnRate}</span>
        </div>
      </div>

      {/* AI Profile Tags Section */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <Sparkles size={16} className="text-blue-600" /> Hồ sơ sở thích AI
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
            Độ tin cậy {customer.aiScore}%
          </span>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Bộ môn ưu tiên:</span>
            <span className="font-semibold text-gray-900">{customer.aiProfile}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Cỡ giày tiêu chuẩn:</span>
            <span className="font-semibold text-gray-900 font-mono">{customer.shoeSize}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Gam màu ưa thích:</span>
            <div className="flex items-center gap-1.5">
              {customer.colors?.map((c: string, i: number) => (
                <span key={i} className={`w-3.5 h-3.5 rounded-full ${c} inline-block shadow-2xs`}></span>
              ))}
              <span className="text-xs font-medium text-gray-500 ml-1">
                {customer.colorNames}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Lịch sử đơn gần nhất
          </span>
          <button
            onClick={() => onViewAllOrders(customer)}
            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            Xem tất cả
          </button>
        </div>
        <div className="space-y-2">
          {loadingOrders ? (
            <div className="text-center py-4 text-xs text-gray-400">Đang tải đơn hàng...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-4 text-xs text-gray-400">
              Khách hàng chưa có đơn hàng nào
            </div>
          ) : (
            orders.slice(0, 3).map((ord: any) => (
              <div
                key={ord.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-900 font-mono">
                    {ord.code}
                  </span>
                  <span className="text-[10px] text-gray-500 mt-0.5 truncate max-w-[150px]">
                    {ord.created_at} • {ord.first_item_name}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-900 font-mono">
                    {ord.total_amount?.toLocaleString("vi-VN")} đ
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800 mt-0.5">
                    {ord.status === "completed"
                      ? "Hoàn tất"
                      : ord.status === "shipping"
                      ? "Đang giao"
                      : "Đang xử lý"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-col gap-2 mt-2">
        <button
          onClick={() => onSendEmail(customer)}
          className="w-full h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
        >
          <Mail size={16} />
          <span>Gửi Email thông báo</span>
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onSendVoucher(customer)}
            className="h-9 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Gift size={16} className="text-green-600" />
            <span>Tặng Voucher</span>
          </button>
          <button
            onClick={() => onEdit(customer)}
            className="h-9 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Edit3 size={16} />
            <span>Chỉnh sửa hồ sơ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
