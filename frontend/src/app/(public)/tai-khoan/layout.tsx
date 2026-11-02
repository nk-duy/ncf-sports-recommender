"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Breadcrumb from "@/shared/components/Breadcrumb";
import AccountSidebar from "@/modules/user/core/components/Sidebar";

const PAGE_TITLES: Record<string, string> = {
  "/tai-khoan": "Tổng quan tài khoản",
  "/tai-khoan/orders": "Lịch sử mua hàng",
  "/tai-khoan/wishlist": "Sản phẩm yêu thích",
  "/tai-khoan/recommendations": "Gợi ý riêng cho bạn",
  "/tai-khoan/notifications": "Thông báo của tôi",
  "/tai-khoan/settings": "Cài đặt tài khoản",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  let currentTitle = PAGE_TITLES[pathname];
  if (!currentTitle) {
    if (pathname.startsWith("/tai-khoan/orders")) currentTitle = "Lịch sử mua hàng";
    else if (pathname.startsWith("/tai-khoan/wishlist")) currentTitle = "Sản phẩm yêu thích";
    else if (pathname.startsWith("/tai-khoan/recommendations")) currentTitle = "Gợi ý riêng cho bạn";
    else if (pathname.startsWith("/tai-khoan/notifications")) currentTitle = "Thông báo của tôi";
    else if (pathname.startsWith("/tai-khoan/settings")) currentTitle = "Cài đặt tài khoản";
    else currentTitle = "Tổng quan tài khoản";
  }

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Tài khoản của tôi", href: "/tai-khoan" },
    { label: currentTitle },
  ];

  return (
    <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
      <Breadcrumb items={breadcrumbItems} />
      <div className="flex flex-col md:flex-row gap-6 mt-4">
        <aside className="w-full md:w-72 flex-shrink-0">
          <AccountSidebar />
        </aside>
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
