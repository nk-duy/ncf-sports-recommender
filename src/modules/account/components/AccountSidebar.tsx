"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  Zap, 
  Settings, 
  LogOut,
  Star
} from "lucide-react";
import { mockUserProfile } from "../data/mockAccountData";

const menuItems = [
  { icon: LayoutDashboard, label: "Tổng quan tài khoản", href: "/account" },
  { icon: ShoppingBag, label: "Lịch sử mua hàng", href: "/account/orders", badge: 8 },
  { icon: Heart, label: "Sản phẩm yêu thích", href: "/account/wishlist", badge: 15, badgeColor: "red" },
  { icon: Zap, label: "Gợi ý riêng cho bạn", href: "/account/recommendations", badge: "AI", badgeColor: "blue" },
  { icon: Settings, label: "Cài đặt tài khoản", href: "/account/settings" },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
      {/* Profile Section */}
      <div className="p-6 flex flex-col items-center border-b border-gray-100">
        <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center border-[3px] border-white shadow-md relative mb-4">
          <span className="text-3xl font-bold text-blue-600">
            {mockUserProfile.initials}
          </span>
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {mockUserProfile.name}
        </h2>
        <p className="text-sm text-gray-500 mb-3">
          {mockUserProfile.email}
        </p>
        <div className="bg-yellow-50 text-yellow-700 px-4 py-1.5 rounded-full flex items-center text-sm font-medium border border-yellow-200 w-full justify-center">
          <Star size={16} className="fill-yellow-500 text-yellow-500 mr-2" />
          Hạng thành viên: <span className="font-bold ml-1">{mockUserProfile.memberRank}</span>
        </div>
        
        <div className="w-full mt-6 space-y-2 text-sm">
          <div className="flex justify-between items-center text-gray-600">
            <span>Ngày tham gia:</span>
            <span className="font-medium text-gray-900">{mockUserProfile.joinDate}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>Môn yêu thích:</span>
            <span className="font-medium text-gray-900">{mockUserProfile.favoriteSports}</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 font-semibold" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center">
                  <Icon size={20} className={`mr-3 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
                  {item.label}
                </div>
                {item.badge && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor === "red" 
                      ? "bg-red-50 text-red-600" 
                      : item.badgeColor === "blue"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
          <LogOut size={20} className="mr-3" />
          Đăng xuất
        </button>
      </div>

      {/* Support Box */}
      <div className="mx-4 mb-4 mt-2 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center mb-2">
          <div className="bg-blue-100 p-1.5 rounded-full mr-2 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <span className="font-semibold text-blue-900 text-sm">Hỗ trợ khách hàng 24/7</span>
        </div>
        <p className="text-xs text-blue-800 leading-relaxed">
          Cần hỗ trợ đổi trả hoặc bảo hành đơn hàng thể thao? Gọi ngay hotline <span className="font-bold">1900 6868</span>.
        </p>
      </div>
    </div>
  );
}
