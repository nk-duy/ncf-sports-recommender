"use client";

import { MapPin, Building2, ListFilter, Edit3 } from "lucide-react";
import type { LocationItem } from "../types";

interface AddressBookSectionProps {
  vnLocations: LocationItem[];
  selectedProvince: string;
  setSelectedProvince: (val: string) => void;
  selectedWard: string;
  setSelectedWard: (val: string) => void;
  streetAddress: string;
  setStreetAddress: (val: string) => void;
  isManualLocation: boolean;
  setIsManualLocation: (val: boolean) => void;
}

export default function AddressBookSection({
  vnLocations,
  selectedProvince,
  setSelectedProvince,
  selectedWard,
  setSelectedWard,
  streetAddress,
  setStreetAddress,
  isManualLocation,
  setIsManualLocation,
}: AddressBookSectionProps) {
  return (
    <div
      id="address-section"
      className="p-4 bg-gray-50/70 rounded-xl border border-gray-200 space-y-3.5"
    >
      <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <MapPin size={17} className="text-blue-600" />
          <span>Địa chỉ nhận hàng mặc định</span>
        </div>
        <button
          type="button"
          onClick={() => setIsManualLocation(!isManualLocation)}
          className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
        >
          {isManualLocation ? (
            <>
              <ListFilter size={13} />
              <span>Chọn danh sách Tỉnh/Phường</span>
            </>
          ) : (
            <>
              <Edit3 size={13} />
              <span>Nhập thủ công</span>
            </>
          )}
        </button>
      </div>

      {/* Tỉnh/Thành phố & Phường/Xã */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Tỉnh / Thành phố
          </label>
          {isManualLocation ? (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Building2 size={15} />
              </div>
              <input
                type="text"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                placeholder="Ví dụ: TP. Hồ Chí Minh, Tỉnh Vĩnh Long..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
              />
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Building2 size={15} />
              </div>
              <select
                value={selectedProvince}
                onChange={(e) => {
                  if (e.target.value === "__manual__") {
                    setIsManualLocation(true);
                    setSelectedProvince("");
                    setSelectedWard("");
                    return;
                  }
                  setSelectedProvince(e.target.value);
                  setSelectedWard("");
                }}
                className="w-full pl-9 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs appearance-none cursor-pointer"
              >
                <option value="">Chọn Tỉnh / Thành phố</option>
                {vnLocations.map((loc) => (
                  <option key={loc.province} value={loc.province}>
                    {loc.province}
                  </option>
                ))}
                <option value="__manual__">✎ Nhập thủ công Tỉnh / Thành khác...</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Quận / Huyện / Phường / Xã
          </label>
          {isManualLocation ? (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Building2 size={15} />
              </div>
              <input
                type="text"
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                placeholder="Ví dụ: Phường Bến Nghé, Quận 1..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
              />
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Building2 size={15} />
              </div>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                disabled={!selectedProvince}
                className="w-full pl-9 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs appearance-none cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <option value="">
                  {selectedProvince ? "Chọn Phường / Xã" : "Vui lòng chọn Tỉnh trước"}
                </option>
                {selectedProvince &&
                  vnLocations
                    .find((l) => l.province === selectedProvince)
                    ?.wards.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Số nhà & Tên đường */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
          Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà)
        </label>
        <input
          type="text"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          placeholder="Ví dụ: Tầng 3, Tòa nhà Landmark, 123 Đường Nguyễn Văn Linh..."
          className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
        />
      </div>
    </div>
  );
}
