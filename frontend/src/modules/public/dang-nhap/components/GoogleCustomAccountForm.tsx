'use client';

import GoogleLogoIcon from './GoogleLogoIcon';

interface GoogleCustomAccountFormProps {
  customEmail: string;
  setCustomEmail: (val: string) => void;
  customName: string;
  setCustomName: (val: string) => void;
  loading: boolean;
  onBackToPicker: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function GoogleCustomAccountForm({
  customEmail,
  setCustomEmail,
  customName,
  setCustomName,
  loading,
  onBackToPicker,
  onSubmit,
}: GoogleCustomAccountFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-col items-center text-center pt-1">
        <GoogleLogoIcon className="w-7 h-7 mb-2.5" />
        <h2 className="text-lg font-semibold text-slate-900">Đăng nhập bằng Google</h2>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Địa chỉ Gmail</label>
          <input
            type="email"
            required
            value={customEmail}
            onChange={(e) => setCustomEmail(e.target.value)}
            placeholder="tenban@gmail.com"
            className="block w-full px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-sm focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition outline-none text-slate-900 placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Họ và tên (tùy chọn)
          </label>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Nguyễn Văn A"
            className="block w-full px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-sm focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition outline-none text-slate-900 placeholder-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBackToPicker}
          disabled={loading}
          className="px-4 py-2 border border-[#e5e7eb] text-slate-700 rounded-xl text-xs sm:text-sm font-medium hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
        >
          Quay lại
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs disabled:opacity-60 cursor-pointer"
        >
          {loading ? 'Đang gửi...' : 'Tiếp tục'}
        </button>
      </div>
    </form>
  );
}
