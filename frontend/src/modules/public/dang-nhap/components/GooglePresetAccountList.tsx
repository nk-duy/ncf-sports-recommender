'use client';

import { ArrowLeft, UserRound } from 'lucide-react';
import { PRESET_GOOGLE_ACCOUNTS } from '../constants';
import GoogleLogoIcon from './GoogleLogoIcon';

interface GooglePresetAccountListProps {
  loading: boolean;
  onSelectPreset: (email: string, name: string, sports: string[]) => void;
  onSwitchToCustom: () => void;
  onBackToLogin: () => void;
}

export default function GooglePresetAccountList({
  loading,
  onSelectPreset,
  onSwitchToCustom,
  onBackToLogin,
}: GooglePresetAccountListProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center text-center pt-1">
        <GoogleLogoIcon className="w-7 h-7 mb-2.5" />
        <h2 className="text-lg font-semibold text-slate-900 leading-snug">Chọn một tài khoản</h2>
        <p className="text-xs text-slate-500 mt-0.5">để tiếp tục tới KADY Sports</p>
      </div>

      <div className="divide-y divide-slate-100 border border-[#e5e7eb] rounded-xl overflow-hidden bg-white">
        {PRESET_GOOGLE_ACCOUNTS.map((acc) => (
          <button
            key={acc.email}
            type="button"
            disabled={loading}
            onClick={() => onSelectPreset(acc.email, acc.name, acc.sports)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left cursor-pointer disabled:opacity-60"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 ${acc.avatarBg}`}
            >
              {acc.initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{acc.name}</p>
              <p className="text-xs text-slate-500 truncate">{acc.email}</p>
            </div>
          </button>
        ))}

        <button
          type="button"
          disabled={loading}
          onClick={onSwitchToCustom}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left cursor-pointer disabled:opacity-60"
        >
          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <UserRound size={17} />
          </div>
          <span className="text-sm font-medium text-slate-800">Sử dụng một tài khoản khác</span>
        </button>
      </div>

      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={onBackToLogin}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft size={13} />
          <span>Quay lại đăng nhập</span>
        </button>
      </div>
    </div>
  );
}
