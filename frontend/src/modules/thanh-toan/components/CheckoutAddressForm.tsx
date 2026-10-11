'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { useCheckoutStore } from '@/shared/store/checkoutStore';
import vnLocationsData from '@/shared/data/locations.json';

const vnLocations = vnLocationsData as { province: string, wards: string[] }[];

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
  setNote
}: CheckoutAddressFormProps) {
  const { customer_name, customer_phone, setField } = useCheckoutStore();

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-[repeating-linear-gradient(45deg,transparent,transparent_33px,#3b82f6_33px,#3b82f6_39px,transparent_39px,transparent_72px,#0ea5e9_72px,#0ea5e9_78px)]"></div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-blue-600 text-lg mb-4 font-medium">
          <MapPin size={20} />
          <span>Địa Chỉ Nhận Hàng</span>
        </div>
        
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 font-bold mb-1">Họ và tên <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={customer_name}
                onChange={(e) => setField('customer_name', e.target.value)}
                placeholder="Họ và tên người nhận"
                className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-1 ${hasAttemptedSubmit && !customer_name.trim() ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 font-bold mb-1">Số điện thoại <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={customer_phone}
                onChange={(e) => setField('customer_phone', e.target.value)}
                placeholder="Số điện thoại liên hệ"
                className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-1 ${hasAttemptedSubmit && !customer_phone.trim() ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 font-bold mb-1">Thành phố/tỉnh <span className="text-red-500">*</span></label>
              <select 
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setSelectedWard('');
                }}
                className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-1 ${hasAttemptedSubmit && !selectedProvince ? 'border-red-500 bg-red-50 text-red-700 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500'}`}
              >
                <option value="">Chọn</option>
                {vnLocations.map(loc => (
                  <option key={loc.province} value={loc.province}>{loc.province}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 font-bold mb-1">Phường/xã <span className="text-red-500">*</span></label>
              <select 
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                disabled={!selectedProvince}
                className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-1 disabled:bg-gray-100 disabled:text-gray-400 ${hasAttemptedSubmit && !selectedWard ? 'border-red-500 bg-red-50 text-red-700 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500'}`}
              >
                <option value="">Phường/xã</option>
                {selectedProvince && vnLocations.find(l => l.province === selectedProvince)?.wards.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-bold mb-1">Địa chỉ <span className="text-red-500">*</span></label>
            <textarea 
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="Số nhà, tên đường, tòa nhà..."
              rows={3}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 resize-none ${hasAttemptedSubmit && !streetAddress.trim() ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-bold mb-1">Ghi chú (Có thể bỏ trống)</label>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Giao giờ hành chính, gọi trước khi giao..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
