'use client';

import GoogleLogoIcon from './GoogleLogoIcon';

interface GoogleOAuthDividerButtonProps {
  onClick: () => void;
  marginClass?: string;
  buttonLabel?: string;
}

export default function GoogleOAuthDividerButton({
  onClick,
  marginClass = 'mt-3.5',
  buttonLabel = 'Tiếp tục với Google',
}: GoogleOAuthDividerButtonProps) {
  return (
    <div className={marginClass}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-[11px]">
          <span className="px-2.5 bg-white text-slate-400 font-medium">Hoặc</span>
        </div>
      </div>

      <div className="mt-2.5">
        <button
          type="button"
          onClick={onClick}
          className="w-full flex items-center justify-center gap-2.5 py-2 px-4 border border-[#e5e7eb] rounded-xl bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer active:scale-[0.99]"
        >
          <GoogleLogoIcon className="h-4.5 w-4.5 shrink-0" />
          <span>{buttonLabel}</span>
        </button>
      </div>
    </div>
  );
}
