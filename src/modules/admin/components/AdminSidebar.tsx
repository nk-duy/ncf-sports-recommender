"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Zap, 
  LayoutDashboard, 
  Package, 
  Receipt, 
  Users, 
  Brain,
  Ticket
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/orders", label: "Đơn hàng", icon: Receipt },
  { href: "/admin/customers", label: "Khách hàng", icon: Users },
  { href: "/admin/vouchers", label: "Kho Voucher", icon: Ticket },
  { href: "/admin/ai-monitor", label: "Giám sát AI", icon: Brain },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between border-r border-gray-100">
      <div className="flex flex-col">
        {/* App Logo */}
        <div className="h-14 px-6 flex items-center gap-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Zap size={20} className="fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900 tracking-tight leading-none">SportsAI</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Quản trị Hệ thống</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-3 py-4">
          <span className="px-3 text-[11px] text-gray-500 uppercase tracking-wider font-bold mb-2 block">
            Quản trị hệ thống
          </span>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon size={20} className={isActive ? "text-blue-700" : "text-gray-500"} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* System Status */}
      <div className="p-3 bg-gray-50 mx-4 mb-4 rounded-lg flex items-center justify-between border border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="text-xs text-gray-600 font-medium">Hệ thống hoạt động</span>
        </div>
        <span className="font-mono text-xs text-gray-500 font-medium">v2.4.0</span>
      </div>
    </aside>
  );
}
