import React from "react";
import { Search, SlidersHorizontal, Bell, User } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="fixed top-0 left-64 right-0 h-14 bg-white/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-8 flex items-center justify-between border-b border-gray-100">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm, đơn hàng, khách hàng..." 
            className="w-full h-9 pl-10 pr-4 bg-gray-50 text-gray-900 placeholder:text-gray-500 text-sm rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-colors border border-transparent focus:border-blue-200"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <SlidersHorizontal size={20} />
          </button>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 relative transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 border border-white"></span>
          </button>
        </div>
        
        <div className="h-6 w-px bg-gray-200"></div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-sm font-bold text-gray-900 leading-tight">Quản trị viên</span>
            <span className="inline-block px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold self-end mt-0.5 border border-blue-100">
              Admin
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
            <User size={18} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
