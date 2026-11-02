'use client';

import { useState } from 'react';
import { Briefcase, CheckCircle2, FileText, Home, MapPin, Phone, User } from 'lucide-react';
import { useCheckoutStore } from '@/shared/store/checkoutStore';
import { useAuthStore } from '@/shared/store/authStore';
import CheckoutLocationFields, { vnLocations } from './CheckoutLocationFields';

interface CheckoutAddressFormProps {
  hasAttemptedSubmit: boolean;
  selectedProvince: string;
  setSelectedProvince: (val: string) => void;
  selectedWard: string;
  setSelectedWard: (val: string) => void;
  streetAddress: string;
  setStreetAddress: (val: string) => void;
  note: string;
  setNote: (val: string) => void;
}

export default function CheckoutAddressForm({
  hasAttemptedSubmit,
  selectedProvince,
  setSelectedProvince,
  selectedWard,
  setSelectedWard,
  streetAddress,
  setStreetAddress,
  note,
  setNote,
}: CheckoutAddressFormProps) {
  const { customer_name, customer_phone, setField } = useCheckoutStore();
  const { user, isAuthenticated } = useAuthStore();
  const [addressType, setAddressType] = useState<'home' | 'office'>('home');
  const [manualLocationOverride, setManualLocationOverride] = useState<boolean | null>(null);

  // Tự động chuyển sang chế độ nhập tay nếu tỉnh thành từ trước không nằm trong danh sách gợi ý sẵn
  const isUnknownProvince = Boolean(
    selectedProvince && !vnLocations.some((l) => l.province === selectedProvince)
  );
  const isManualLocation = manualLocationOverride ?? isUnknownProvince;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapPin size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Địa chỉ nhận hàng</h2>
              <p className="text-xs text-gray-500">
                Thông tin giao nhận chính xác giúp đơn hàng đến nhanh nhất
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setAddressType('home')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                addressType === 'home'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Home size={13} />
              <span>Nhà riêng</span>
            </button>
            <button
              type="button"
              onClick={() => setAddressType('office')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                addressType === 'office'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Briefcase size={13} />
              <span>Văn phòng</span>
            </button>
          </div>
        </div>

        {isAuthenticated && user && (
          <div className="mb-4 bg-blue-50/60 border border-blue-100 rounded-xl p-3 flex items-center justify-between text-xs text-blue-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
              <span>
                Đang đặt với tài khoản: <strong>{user.full_name || user.email}</strong>
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Họ và tên người nhận <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={customer_name}
                  onChange={(e) => setField('customer_name', e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className={`w-full h-11 pl-10 pr-3.5 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 ${
                    hasAttemptedSubmit && !customer_name.trim()
                      ? 'border-red-400 bg-red-50/50 text-red-900 focus:ring-red-200 focus:border-red-500'
                      : 'border-gray-200 bg-white text-gray-900 focus:ring-blue-600/20 focus:border-blue-600'
                  }`}
                />
              </div>
              {hasAttemptedSubmit && !customer_name.trim() && (
                <p className="text-[11px] text-red-600 font-medium mt-1">
                  Vui lòng nhập họ và tên người nhận.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Số điện thoại liên hệ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone size={16} />
                </div>
                <input
                  type="tel"
                  value={customer_phone}
                  onChange={(e) => setField('customer_phone', e.target.value)}
                  placeholder="Ví dụ: 0987654321"
                  className={`w-full h-11 pl-10 pr-3.5 border rounded-lg text-sm transition-colors tabular-nums focus:outline-none focus:ring-2 ${
                    hasAttemptedSubmit && !customer_phone.trim()
                      ? 'border-red-400 bg-red-50/50 text-red-900 focus:ring-red-200 focus:border-red-500'
                      : 'border-gray-200 bg-white text-gray-900 focus:ring-blue-600/20 focus:border-blue-600'
                  }`}
                />
              </div>
              {hasAttemptedSubmit && !customer_phone.trim() && (
                <p className="text-[11px] text-red-600 font-medium mt-1">Vui lòng nhập số điện thoại.</p>
              )}
            </div>
          </div>

          <CheckoutLocationFields
            hasAttemptedSubmit={hasAttemptedSubmit}
            isManualLocation={isManualLocation}
            onToggleManualLocation={() => setManualLocationOverride(!isManualLocation)}
            onForceManualLocation={() => setManualLocationOverride(true)}
            selectedProvince={selectedProvince}
            setSelectedProvince={setSelectedProvince}
            selectedWard={selectedWard}
            setSelectedWard={setSelectedWard}
          />

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Địa chỉ cụ thể (Số nhà, tên đường, tòa nhà) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="Ví dụ: Tầng 3, Số 123 Đường Nguyễn Văn Linh..."
              className={`w-full h-11 px-4 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 ${
                hasAttemptedSubmit && !streetAddress.trim()
                  ? 'border-red-400 bg-red-50/50 text-red-900 focus:ring-red-200 focus:border-red-500'
                  : 'border-gray-200 bg-white text-gray-900 focus:ring-blue-600/20 focus:border-blue-600'
              }`}
            />
            {hasAttemptedSubmit && !streetAddress.trim() && (
              <p className="text-[11px] text-red-600 font-medium mt-1">Vui lòng nhập địa chỉ cụ thể.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Ghi chú giao hàng <span className="text-gray-400 font-normal lowercase">(không bắt buộc)</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3.5 flex items-center pointer-events-none text-gray-400">
                <FileText size={16} />
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Giao vào giờ hành chính, gọi điện trước khi giao hàng 15 phút..."
                rows={2}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
