"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  ThumbsUp, 
  Settings,
  LogOut, 
  Star,
  Phone,
  Bell
} from "lucide-react";
import { useAuthStore, getUserInitials } from "@/shared/store/authStore";
import { useWishlistStore } from "@/shared/store/wishlistStore";
import { useNotificationStore } from "@/shared/store/notificationStore";
import { useRouter } from "next/navigation";

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const { unreadCount } = useNotificationStore();
  
  const handleLogout = () => {
    logout();
    router.push('/dang-nhap');
  };

  const displayName = user?.full_name || user?.username || "Tài khoản";
  const displayEmail = user?.email || "chua_dang_nhap@kadysports.vn";
  const initials = getUserInitials(user);
  const favoriteSport = user?.interested_sports && user.interested_sports.length > 0 
    ? user.interested_sports.join(", ") 
    : "Chạy bộ, Thể hình";

  const menuItems = [
    { icon: LayoutDashboard, label: "Tổng quan tài khoản", href: "/tai-khoan" },
    { icon: ShoppingBag, label: "Lịch sử mua hàng", href: "/tai-khoan/orders" },
    { icon: Heart, label: "Sản phẩm yêu thích", href: "/tai-khoan/wishlist", badge: wishlistItems.length > 0 ? wishlistItems.length : undefined, badgeColor: "red" },
    { icon: ThumbsUp, label: "Gợi ý riêng cho bạn", href: "/tai-khoan/recommendations" },
    { icon: Bell, label: "Thông báo của tôi", href: "/tai-khoan/notifications", badge: unreadCount > 0 ? unreadCount : undefined, badgeColor: "blue" },
    { icon: Settings, label: "Cài đặt tài khoản", href: "/tai-khoan/settings" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 flex flex-col overflow-hidden">
      {/* Profile Section - Compact on mobile, Full on desktop */}
      <div className="p-3 sm:p-4 md:p-6 border-b border-gray-100">
        <div className="flex flex-row md:flex-col items-center md:text-center gap-3 md:gap-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-24 md:h-24 rounded-full bg-blue-50 flex items-center justify-center border-2 md:border-[3px] border-white shadow-xs md:shadow-md relative shrink-0 md:mb-4">
            <span className="text-lg sm:text-xl md:text-3xl font-bold text-blue-600">
              {initials}
            </span>
            <div className="absolute bottom-0 right-0 w-3 h-3 md:w-5 md:h-5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          <div className="min-w-0 flex-1 md:w-full">
            <div className="flex items-center gap-2 md:justify-center">
              <h2 className="text-sm sm:text-base md:text-xl font-bold text-gray-900 truncate">
                {displayName}
              </h2>
              <span className="md:hidden inline-flex items-center text-[10px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                {user?.tier || "Đồng"}
              </span>
            </div>
            <p className="text-xs md:text-sm text-gray-500 truncate md:mb-3">
              {displayEmail}
            </p>

            {/* Desktop tier badge */}
            <div className="hidden md:flex bg-amber-50 text-amber-800 px-4 py-1.5 rounded-full items-center text-sm font-medium border border-amber-200 w-full justify-center">
              <Star size={16} className="fill-amber-500 text-amber-500 mr-2" />
              Hạng thành viên: <span className="font-bold ml-1">{user?.tier || "Đồng"}</span>
            </div>
          </div>

          {/* Mobile quick logout */}
          <button
            onClick={handleLogout}
            title="Đăng xuất"
            className="md:hidden p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Extra profile details - only on desktop */}
        <div className="hidden md:block w-full mt-6 space-y-2 text-sm">
          <div className="flex justify-between items-center text-gray-600">
            <span>SĐT:</span>
            <span className="font-medium text-gray-900">{user?.phone || "Chưa cập nhật"}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>Môn yêu thích:</span>
            <span className="font-medium text-gray-900 truncate max-w-[140px]" title={favoriteSport}>
              {favoriteSport}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Horizontal scrollable tabs on mobile, Vertical list on desktop */}
      <div className="py-2 md:py-4">
        <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-2 md:gap-0 md:space-y-1 px-3 pb-1 md:pb-0 no-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center shrink-0 whitespace-nowrap px-3.5 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm transition-colors ${
                  isActive 
                    ? "bg-blue-600 md:bg-blue-50 text-white md:text-blue-700 font-semibold shadow-xs md:shadow-none" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 bg-gray-50 md:bg-transparent"
                }`}
              >
                <div className="flex items-center">
                  <Icon size={16} className={`mr-2 md:mr-3 md:w-5 md:h-5 shrink-0 ${isActive ? "text-white md:text-blue-600" : "text-gray-500"}`} />
                  <span className="shrink-0">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.2 md:py-0.5 rounded-full ml-1.5 md:ml-auto ${
                    isActive
                      ? "bg-white text-blue-700 md:bg-blue-100 md:text-blue-700"
                      : item.badgeColor === "red" 
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

      {/* Logout - Desktop */}
      <div className="hidden md:block p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          suppressHydrationWarning={true}
        >
          <LogOut size={20} className="mr-3" />
          Đăng xuất
        </button>
      </div>

      {/* Support Box - Desktop */}
      <div className="hidden md:block mx-4 mb-4 mt-2 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center mb-2">
          <div className="bg-blue-100 p-1.5 rounded-full mr-2 text-blue-600">
            <Phone size={16} />
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
