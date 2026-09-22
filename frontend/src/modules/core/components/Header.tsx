import Link from 'next/link';
import React from 'react';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-28 w-full">
        <div className="h-16 w-full px-margin-desktop flex items-center justify-between gap-space-lg">
          <div className="flex items-center gap-space-xl">
            <Link className="flex items-center gap-space-xs" href="/">
              <span className="material-symbols-outlined text-primary text-[28px]">bolt</span>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                  Sports<span className="text-primary">AI</span>
                </span>
                <span className="font-label-sm text-label-sm text-secondary-fixed-dim uppercase tracking-wider font-semibold -mt-1">
                  NCF 2.0 Engine
                </span>
              </div>
            </Link>
          </div>
          <div className="flex-1 max-w-2xl">
            <div className="relative w-full flex items-center bg-surface-container-low rounded-xl px-space-md py-space-xs">
              <span className="material-symbols-outlined text-outline text-[20px] mr-space-sm">search</span>
              <input
                className="w-full bg-transparent border-none outline-none font-body-sm text-body-sm text-on-surface placeholder:text-outline"
                placeholder="Tìm kiếm giày chạy marathon, tạ barbell, áo thun dry-fit, AI recommendation..."
                type="text"
              />
              <button className="flex items-center gap-space-xs bg-primary-container text-on-primary-container font-label-sm text-label-sm px-space-md py-1.5 rounded-lg hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                <span>AI Search</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-space-xl">
            <div className="hidden xl:flex items-center gap-space-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px] text-primary">support_agent</span>
              <div className="flex flex-col text-left">
                <span className="font-label-sm text-label-sm text-secondary">Hotline 24/7</span>
                <span className="font-data-mono text-data-mono font-semibold text-on-surface">1800 6886</span>
              </div>
            </div>
            <Link
              className="relative flex items-center justify-center p-space-sm text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[26px]">shopping_bag</span>
              <span className="absolute top-0 right-0 w-5 h-5 bg-error text-on-error font-label-sm text-label-sm font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </Link>
            <div className="flex items-center gap-space-sm pl-space-sm">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-lg text-label-lg text-on-surface leading-none">Nguyễn Khánh Duy</span>
                  <span className="font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    VIP
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-tertiary-container font-medium">
                  NCF Personalizer Active
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="h-12 w-full px-margin-desktop flex items-center bg-surface-container-low">
          <nav className="flex items-center gap-space-xs">
            <Link
              className="px-space-md py-1.5 font-label-lg text-label-lg text-primary font-bold bg-surface-container-lowest rounded-lg shadow-sm transition-all"
              href="/"
            >
              Trang chủ
            </Link>
            <Link
              className="px-space-md py-1.5 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
              href="#"
            >
              Giày thể thao
            </Link>
            <Link
              className="px-space-md py-1.5 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
              href="#"
            >
              Quần áo thể thao
            </Link>
            <Link
              className="px-space-md py-1.5 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
              href="#"
            >
              Thiết bị ngoài trời
            </Link>
            <Link
              className="px-space-md py-1.5 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
              href="#"
            >
              Dụng cụ & Thiết bị Gym
            </Link>
            <Link
              className="px-space-md py-1.5 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all flex items-center gap-1"
              href="#"
            >
              Khuyến mãi HOT
            </Link>
            <Link
              className="px-space-md py-1.5 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all flex items-center gap-1"
              href="#"
            >
              Gợi ý riêng cho bạn AI
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
