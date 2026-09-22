import React from "react";
import AdminSidebar from "@/modules/admin/core/components/Sidebar";
import AdminHeader from "@/modules/admin/core/components/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed on the left */}
      <AdminSidebar />
      
      {/* Main Content Wrapper - offset by sidebar width */}
      <div className="pl-64 flex-1 flex flex-col min-w-0">
        {/* Header - Fixed on top */}
        <AdminHeader />
        
        {/* Page Content */}
        <main className="flex-1 w-full pt-14 bg-gray-50 px-8">
          <div className="w-full mx-auto max-w-7xl py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
