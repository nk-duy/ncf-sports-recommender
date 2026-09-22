import React from "react";
import Link from "next/link";

export default function ProductBreadcrumb({ productName }: { productName: string }) {
    return (
<>
            {/* Breadcrumb Navigation */}
            <div className="w-full px-margin-desktop py-space-md bg-surface-container-lowest">
                <nav className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
                    <a className="hover:text-primary transition-colors" href="#">Trang chủ</a>
                    <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                    <a className="hover:text-primary transition-colors" href="#">Giày thể thao</a>
                    <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                    <a className="hover:text-primary transition-colors" href="#">Giày chạy bộ Marathon</a>
                    <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                    <span className="text-on-surface font-semibold truncate max-w-xs md:max-w-md">Giày Chạy Bộ Marathon
                        Carbon Alpha Pro</span>
                </nav>
            </div>

</>
    );
}
