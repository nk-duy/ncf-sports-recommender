'use client';

import { Mail, Sparkles } from 'lucide-react';
import { PRESET_GOOGLE_ACCOUNTS } from '../constants';

interface GooglePresetAccountListProps {
  loading: boolean;
  onSelectPreset: (email: string, name: string, sports: string[]) => void;
  onSwitchToCustom: () => void;
}

export default function GooglePresetAccountList({
  loading,
  onSelectPreset,
  onSwitchToCustom,
}: GooglePresetAccountListProps) {
  return (
    <div className="space-y-3.5">
      <p className="text-xs text-slate-600">
        Chọn một tài khoản Google mẫu để đăng nhập nhanh 1-chạm vào hệ thống:
      </p>

      <div className="space-y-2">
        {PRESET_GOOGLE_ACCOUNTS.map((acc) => (
          <button
            key={acc.email}
            type="button"
            disabled={loading}
            onClick={() => onSelectPreset(acc.email, acc.name, acc.sports)}
            className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all text-left cursor-pointer group disabled:opacity-60 bg-white"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border shrink-0 transition-transform group-hover:scale-105 shadow-2xs ${acc.avatarBg}`}
              >
                {acc.initials}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition">
                    {acc.name}
                  </p>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                    {acc.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{acc.email}</p>
                <div className="flex items-center gap-1 mt-0.5 text-[10px] text-blue-600 font-medium">
                  <Sparkles size={11} />
                  <span>Cold-Start NCF: {acc.sports.join(', ')}</span>
                </div>
              </div>
            </div>
            <div className="text-slate-300 group-hover:text-blue-600 transition pr-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onSwitchToCustom}
          className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Mail size={14} className="text-slate-500" />
          Sử dụng tài khoản Gmail khác (Tùy chỉnh môn thể thao)
        </button>
      </div>
    </div>
  );
}
