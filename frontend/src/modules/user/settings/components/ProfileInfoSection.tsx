"use client";

import {
  UserCircle2,
  Upload,
  CheckCircle2,
  Link as LinkIcon,
} from "lucide-react";

interface ProfileInfoSectionProps {
  initials: string;
  fullName: string;
  setFullName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  email: string;
}

export default function ProfileInfoSection({
  initials,
  fullName,
  setFullName,
  phone,
  setPhone,
  email,
}: ProfileInfoSectionProps) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <UserCircle2 className="text-blue-600" size={24} />
          <span className="text-lg font-bold text-gray-900">Thông tin cơ bản</span>
        </div>
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded mt-2 sm:mt-0">
          Hồ sơ KADY Sports Club
        </span>
      </div>

      {/* Avatar preview */}
      <div className="flex items-center gap-6 bg-gray-50 border border-gray-100 p-4 rounded-xl">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-sm shrink-0">
          {initials}
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              className="px-4 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-900 text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
            >
              <Upload size={16} className="text-blue-600" />
              Thay đổi ảnh đại diện
            </button>
          </div>
          <span className="text-sm text-gray-500">
            Định dạng JPG, PNG tối đa 5MB. Kích thước đề nghị 400x400 px.
          </span>
        </div>
      </div>

      {/* Name & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-900 flex items-center justify-between">
            <span>
              Họ và tên <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập họ và tên..."
            className="h-10 px-4 rounded-lg bg-white border border-gray-300 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-900 flex items-center justify-between">
            <span>
              Số điện thoại <span className="text-red-500">*</span>
            </span>
            <span className="text-green-600 text-xs font-semibold flex items-center gap-1">
              <CheckCircle2 size={14} /> Hoạt động
            </span>
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại (VD: 0912345678)..."
            className="h-10 px-4 rounded-lg bg-white border border-gray-300 text-gray-900 font-mono text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      {/* Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-900 flex items-center justify-between">
            <span>Email tài khoản</span>
            <span className="text-blue-600 text-xs font-semibold flex items-center gap-1">
              <LinkIcon size={14} /> Đã liên kết
            </span>
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="h-10 px-4 rounded-lg bg-gray-100 border border-gray-200 text-gray-500 font-mono text-base cursor-not-allowed shadow-sm"
          />
        </div>
        <div className="flex flex-col justify-end">
          <p className="text-xs text-gray-500 pb-2">
            Địa chỉ nhận hàng mặc định bên dưới sẽ được tự động điền khi bạn tiến hành thanh toán đơn hàng.
          </p>
        </div>
      </div>
    </>
  );
}
