"use client";

import React, { useState } from "react";
import { 
  SlidersHorizontal, 
  User, 
  MapPin, 
  Lock, 
  Brain, 
  UserCircle2, 
  Upload, 
  CheckCircle2, 
  Link as LinkIcon, 
  Calendar,
  Truck,
  Plus,
  Building,
  Pencil,
  ShieldCheck,
  Smartphone,
  BellRing,
  Clock,
  Check,
  RefreshCw,
  CheckCheck
} from "lucide-react";

export default function AccountSettingsFull() {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [isNotifEnabled, setIsNotifEnabled] = useState(true);

  const handleSave = () => {
    if (saveStatus !== "idle") return;
    
    setSaveStatus("saving");
    
    setTimeout(() => {
      setSaveStatus("saved");
      
      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    }, 700);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Content Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-1 border border-gray-100">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="text-blue-600" size={28} />
          <h1 className="text-2xl md:text-3xl text-gray-900 font-bold">Cài đặt tài khoản</h1>
        </div>
        <p className="text-base text-gray-500">Quản lý thông tin cá nhân, địa chỉ giao hàng và cấu hình bảo mật tài khoản</p>
      </div>

      {/* Section Navigation Tabs */}
      <div className="bg-white rounded-xl p-1.5 shadow-sm border border-gray-100 flex items-center gap-1 overflow-x-auto hide-scrollbar">
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold whitespace-nowrap shadow-sm flex items-center gap-2">
          <User size={18} />
          Thông tin cá nhân
        </button>
        <button className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-semibold whitespace-nowrap flex items-center gap-2">
          <MapPin size={18} />
          Sổ địa chỉ nhận hàng
        </button>
        <button className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-semibold whitespace-nowrap flex items-center gap-2">
          <Lock size={18} />
          Đổi mật khẩu & Bảo mật
        </button>
        <button className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-semibold whitespace-nowrap flex items-center gap-2">
          <Brain size={18} className="text-green-600" />
          Tùy chọn gợi ý AI
        </button>
      </div>

      {/* Form Card 1: Thông tin cơ bản */}
      <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <UserCircle2 className="text-blue-600" size={24} />
            <span className="text-lg font-bold text-gray-900">Thông tin cơ bản</span>
          </div>
          <span className="text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded mt-2 sm:mt-0">
            Hồ sơ hoàn thiện 90%
          </span>
        </div>

        {/* Row 1: Avatar preview */}
        <div className="flex items-center gap-6 bg-gray-50 border border-gray-100 p-4 rounded-xl">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-sm shrink-0">
            KD
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <button className="px-4 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-900 text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
                <Upload size={16} className="text-blue-600" />
                Thay đổi ảnh đại diện
              </button>
              <button className="px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50 text-sm font-semibold transition-colors">
                Xóa ảnh
              </button>
            </div>
            <span className="text-sm text-gray-500">Định dạng JPG, PNG tối đa 5MB. Kích thước đề nghị 400x400 px.</span>
          </div>
        </div>

        {/* Form fields grid */}
        <div className="flex flex-col gap-4">
          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                <span>Họ và tên <span className="text-red-500">*</span></span>
              </label>
              <input 
                type="text" 
                defaultValue="Nguyễn Khánh Duy"
                className="h-10 px-4 rounded-lg bg-white border border-gray-300 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                <span>Số điện thoại <span className="text-red-500">*</span></span>
                <span className="text-green-600 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 size={14} /> Đã xác thực
                </span>
              </label>
              <input 
                type="text" 
                defaultValue="0912.345.678"
                className="h-10 px-4 rounded-lg bg-white border border-gray-300 text-gray-900 font-mono text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                <span>Email tài khoản <span className="text-red-500">*</span></span>
                <span className="text-green-600 text-xs font-semibold flex items-center gap-1">
                  <LinkIcon size={14} /> Đã liên kết
                </span>
              </label>
              <input 
                type="email" 
                defaultValue="khanhduy.nguyen@email.com"
                className="h-10 px-4 rounded-lg bg-white border border-gray-300 text-gray-900 font-mono text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-900">Ngày sinh</label>
              <div className="relative">
                <input 
                  type="text" 
                  defaultValue="18/08/1998"
                  className="w-full h-10 px-4 pr-10 rounded-lg bg-white border border-gray-300 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                />
                <Calendar className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" size={20} />
              </div>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-900">Giới tính</label>
              <select className="h-10 px-4 rounded-lg bg-white border border-gray-300 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm appearance-none cursor-pointer">
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-900">Môn thể thao tập luyện chính</label>
              <select 
                defaultValue="Chạy bộ Marathon, Gym Thể hình"
                className="h-10 px-4 rounded-lg bg-white border border-gray-300 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm appearance-none cursor-pointer"
              >
                <option>Chạy bộ Marathon, Gym Thể hình</option>
                <option>Chạy Trail, Cầu lông</option>
                <option>Bóng đá sân cỏ nhân tạo</option>
                <option>Bóng rổ, Bơi lội</option>
                <option>Fitness tổng quát</option>
              </select>
            </div>
          </div>

          {/* Row 5: Shoe Size & Apparel Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                <span>Cỡ giày mặc định</span>
                <span className="text-gray-500 text-xs">Hỗ trợ lọc giày nhanh</span>
              </label>
              <select 
                defaultValue="42 EU (8.5 US)"
                className="h-10 px-4 rounded-lg bg-white border border-gray-300 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm appearance-none cursor-pointer"
              >
                <option>40.5 EU (7.5 US)</option>
                <option>41 EU (8.0 US)</option>
                <option>42 EU (8.5 US)</option>
                <option>42.5 EU (9.0 US)</option>
                <option>43 EU (9.5 US)</option>
                <option>44 EU (10.0 US)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                <span>Cỡ quần áo mặc định</span>
                <span className="text-gray-500 text-xs">Form Asian Fit</span>
              </label>
              <select 
                defaultValue="L (69kg - 76kg)"
                className="h-10 px-4 rounded-lg bg-white border border-gray-300 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm appearance-none cursor-pointer"
              >
                <option>S (Dưới 60kg)</option>
                <option>M (61kg - 68kg)</option>
                <option>L (69kg - 76kg)</option>
                <option>XL (77kg - 85kg)</option>
                <option>2XL (Trên 85kg)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Form Card 2: Địa chỉ giao hàng mặc định */}
      <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Truck className="text-blue-600" size={24} />
            <span className="text-lg font-bold text-gray-900">Địa chỉ giao hàng mặc định</span>
          </div>
          <button className="px-4 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-colors flex items-center gap-1.5 mt-2 sm:mt-0">
            <Plus size={16} />
            Thêm địa chỉ mới
          </button>
        </div>

        {/* Current default address card */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-blue-600 shadow-sm shrink-0 mt-0.5">
              <Building size={20} />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-gray-900">Nguyễn Khánh Duy</span>
                <span className="text-gray-300">|</span>
                <span className="font-mono text-base text-gray-900">0912.345.678</span>
                <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-bold border border-green-200">Mặc định</span>
              </div>
              <p className="text-base text-gray-700 mt-1">
                Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh
              </p>
              <span className="text-xs text-gray-500 font-medium">Giao nhận giờ hành chính & cuối tuần</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
            <button className="px-4 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-900 text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-1.5">
              <Pencil size={16} />
              Chỉnh sửa địa chỉ
            </button>
          </div>
        </div>
      </div>

      {/* Form Card 3: Thiết lập bảo mật & Quyền riêng tư */}
      <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
          <ShieldCheck className="text-blue-600" size={24} />
          <span className="text-lg font-bold text-gray-900">Thiết lập bảo mật & Quyền riêng tư</span>
        </div>
        
        <div className="flex flex-col gap-4">
          {/* Row: 2FA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-700 shrink-0 border border-green-200">
                <Smartphone size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">Xác thực hai yếu tố (2FA)</span>
                <span className="text-sm text-gray-500">Bảo vệ đơn hàng và giao dịch đổi voucher điểm thưởng bằng mã xác nhận SMS OTP.</span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 sm:ml-4 self-end sm:self-center">
              <span className="text-xs text-green-600 font-bold hidden sm:inline">
                {is2FAEnabled ? "Đang bật qua SMS OTP" : "Đã tắt"}
              </span>
              <button 
                onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${is2FAEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${is2FAEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* Row: AI & Marketing Notification */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 border border-blue-200">
                <BellRing size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">Nhận thông báo ưu đãi thể thao & Gợi ý AI qua email</span>
                <span className="text-sm text-gray-500">Nhận cập nhật về các đợt flash-sale dòng giày chạy, giáo án nâng cao và sự kiện marathon.</span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 sm:ml-4 self-end sm:self-center">
              <span className="text-xs text-blue-600 font-bold hidden sm:inline">
                {isNotifEnabled ? "Bật" : "Tắt"}
              </span>
              <button 
                onClick={() => setIsNotifEnabled(!isNotifEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${isNotifEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isNotifEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm w-full sm:w-auto justify-center sm:justify-start">
          <Clock size={18} />
          <span>Thay đổi gần nhất: Hôm nay, 10:24</span>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-end">
          <button className="px-6 py-2 rounded-lg bg-gray-100 text-gray-900 text-sm font-semibold hover:bg-gray-200 transition-colors">
            Hủy bỏ
          </button>
          <button 
            onClick={handleSave}
            disabled={saveStatus !== "idle"}
            className={`px-8 py-2 rounded-lg text-white text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 min-w-[160px] ${
              saveStatus === "idle" ? "bg-blue-600 hover:bg-blue-700" :
              saveStatus === "saving" ? "bg-blue-500 opacity-90 cursor-wait" :
              "bg-green-600"
            }`}
          >
            {saveStatus === "idle" && (
              <>
                <Check size={18} />
                Lưu thay đổi
              </>
            )}
            {saveStatus === "saving" && (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Đang lưu...
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <CheckCheck size={18} />
                Đã lưu thành công
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
