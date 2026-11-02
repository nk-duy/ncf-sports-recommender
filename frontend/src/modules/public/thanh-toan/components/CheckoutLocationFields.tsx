'use client';

import { Building2, Edit3, ListFilter } from 'lucide-react';
import vnLocationsData from '@/shared/data/locations.json';

export const vnLocations = vnLocationsData as { province: string; wards: string[] }[];

interface CheckoutLocationFieldsProps {
  hasAttemptedSubmit: boolean;
  isManualLocation: boolean;
  onToggleManualLocation: () => void;
  onForceManualLocation: () => void;
  selectedProvince: string;
  setSelectedProvince: (val: string) => void;
  selectedWard: string;
  setSelectedWard: (val: string) => void;
}

export default function CheckoutLocationFields({
  hasAttemptedSubmit,
  isManualLocation,
  onToggleManualLocation,
  onForceManualLocation,
  selectedProvince,
  setSelectedProvince,
  selectedWard,
  setSelectedWard,
}: CheckoutLocationFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Tỉnh / Thành phố <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={onToggleManualLocation}
            className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
          >
            {isManualLocation ? (
              <>
                <ListFilter size={12} />
                <span>Chọn danh sách</span>
              </>
            ) : (
              <>
                <Edit3 size={12} />
                <span>Nhập thủ công</span>
              </>
            )}
          </button>
        </div>

        {isManualLocation ? (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Building2 size={16} />
            </div>
            <input
              type="text"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              placeholder="Ví dụ: Tỉnh Vĩnh Long, TP. Hồ Chí Minh..."
              className={`w-full h-11 pl-10 pr-3.5 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 ${
                hasAttemptedSubmit && !selectedProvince.trim()
                  ? 'border-red-400 bg-red-50/50 text-red-900 focus:ring-red-200 focus:border-red-500'
                  : 'border-gray-200 bg-white text-gray-900 focus:ring-blue-600/20 focus:border-blue-600'
              }`}
            />
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Building2 size={16} />
            </div>
            <select
              value={selectedProvince}
              onChange={(e) => {
                if (e.target.value === '__manual__') {
                  onForceManualLocation();
                  setSelectedProvince('');
                  setSelectedWard('');
                  return;
                }
                setSelectedProvince(e.target.value);
                setSelectedWard('');
              }}
              className={`w-full h-11 pl-10 pr-8 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 appearance-none bg-white cursor-pointer ${
                hasAttemptedSubmit && !selectedProvince
                  ? 'border-red-400 bg-red-50/50 text-red-900 focus:ring-red-200 focus:border-red-500'
                  : 'border-gray-200 text-gray-900 focus:ring-blue-600/20 focus:border-blue-600'
              }`}
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

        {hasAttemptedSubmit && !selectedProvince.trim() && (
          <p className="text-[11px] text-red-600 font-medium mt-1">
            Vui lòng nhập hoặc chọn Tỉnh / Thành phố.
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Quận / Huyện / Phường / Xã <span className="text-red-500">*</span>
          </label>
          {isManualLocation && <span className="text-[11px] text-gray-400">Nhập tay tự do</span>}
        </div>

        {isManualLocation ? (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Building2 size={16} />
            </div>
            <input
              type="text"
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              placeholder="Ví dụ: Phường 1, Huyện Long Hồ..."
              className={`w-full h-11 pl-10 pr-3.5 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 ${
                hasAttemptedSubmit && !selectedWard.trim()
                  ? 'border-red-400 bg-red-50/50 text-red-900 focus:ring-red-200 focus:border-red-500'
                  : 'border-gray-200 bg-white text-gray-900 focus:ring-blue-600/20 focus:border-blue-600'
              }`}
            />
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Building2 size={16} />
            </div>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              disabled={!selectedProvince}
              className={`w-full h-11 pl-10 pr-8 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 appearance-none cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed ${
                hasAttemptedSubmit && !selectedWard
                  ? 'border-red-400 bg-red-50/50 text-red-900 focus:ring-red-200 focus:border-red-500'
                  : 'border-gray-200 bg-white text-gray-900 focus:ring-blue-600/20 focus:border-blue-600'
              }`}
            >
              <option value="">{selectedProvince ? 'Chọn Phường / Xã' : 'Vui lòng chọn Tỉnh trước'}</option>
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

        {hasAttemptedSubmit && !selectedWard.trim() && (
          <p className="text-[11px] text-red-600 font-medium mt-1">Vui lòng nhập hoặc chọn Phường / Xã.</p>
        )}
      </div>
    </div>
  );
}
