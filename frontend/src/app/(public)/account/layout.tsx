import React from "react";
import Breadcrumb from "@/shared/components/Breadcrumb";
import AccountSidebar from "@/modules/account/core/components/Sidebar";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Tài khoản của tôi", href: "/account" },
    { label: "Tổng quan tài khoản" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
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
