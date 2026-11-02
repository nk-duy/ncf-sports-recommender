'use client';

import { Mail, User } from 'lucide-react';
import SportPreferenceSelector from './SportPreferenceSelector';

interface GoogleCustomAccountFormProps {
  customEmail: string;
  setCustomEmail: (val: string) => void;
  customName: string;
  setCustomName: (val: string) => void;
  selectedSports: string[];
  onToggleSport: (sportId: string) => void;
  loading: boolean;
  onBackToPicker: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function GoogleCustomAccountForm({
  customEmail,
  setCustomEmail,
  customName,
  setCustomName,
  selectedSports,
  onToggleSport,
  loading,
  onBackToPicker,
  onSubmit,
}: GoogleCustomAccountFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold text-slate-700">Nhập thông tin tài khoản Google:</p>
        <button
          type="button"
          onClick={onBackToPicker}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          ← Chọn danh sách có sẵn
        </button>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ Gmail *</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Mail size={15} />
          </div>
          <input
            type="email"
            required
            value={customEmail}
            onChange={(e) => setCustomEmail(e.target.value)}
            placeholder="tenban@gmail.com"
            className="block w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none text-slate-900 font-medium placeholder-slate-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và Tên</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <User size={15} />
          </div>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Nguyễn Văn A"
            className="block w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none text-slate-900 font-medium placeholder-slate-400"
          />
        </div>
      </div>

      <SportPreferenceSelector
        selectedSports={selectedSports}
        onToggleSport={onToggleSport}
        compact
      />

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onBackToPicker}
          className="px-3.5 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
        >
          Quay lại
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-60 cursor-pointer"
        >
          {loading ? 'Đang xác thực...' : 'Xác nhận Đăng nhập'}
        </button>
      </div>
    </form>
  );
}
