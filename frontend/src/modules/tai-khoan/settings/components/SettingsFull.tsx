"use client";

import React, { useState, useEffect } from "react";
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
import { useAuthStore } from "@/shared/store/authStore";
import { notifications } from "@mantine/notifications";

export default function AccountSettingsFull() {
  const { user, token, isAuthenticated, setUser } = useAuthStore();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [isNotifEnabled, setIsNotifEnabled] = useState(true);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [interestedSport, setInterestedSport] = useState("Chạy bộ Marathon, Gym Thể hình");
  const [shoeSize, setShoeSize] = useState("42 EU (8.5 US)");
  const [apparelSize, setApparelSize] = useState("L (69kg - 76kg)");

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      if (user.interested_sports && user.interested_sports.length > 0) {
        setInterestedSport(user.interested_sports[0]);
      }
    }
  }, [user]);

  const handleSave = async () => {
    if (saveStatus !== "idle") return;
    
    setSaveStatus("saving");
    
    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: fullName,
          phone: phone,
          address: address,
          interested_sports: [interestedSport],
          shoe_size: shoeSize
        })
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setSaveStatus("saved");
        notifications.show({
          title: "Thành công",
          message: "Thông tin tài khoản đã được lưu vào hệ thống",
          color: "green"
        });

        setTimeout(() => {
          setSaveStatus("idle");
        }, 2000);
      } else {
        setSaveStatus("idle");
        notifications.show({
          title: "Thất bại",
          message: "Không thể lưu thông tin. Vui lòng thử lại sau.",
          color: "red"
        });
      }
    } catch (err) {
      setSaveStatus("idle");
      notifications.show({
        title: "Lỗi kết nối",
        message: "Không thể kết nối đến máy chủ",
        color: "red"
      });
    }
  };

  const displayName = fullName || user?.username || "Tài khoản";
  const initials = displayName.substring(0, 2).toUpperCase();

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
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded mt-2 sm:mt-0">
            Hồ sơ KADY Sports Club
          </span>
        </div>

        {/* Row 1: Avatar preview */}
        <div className="flex items-center gap-6 bg-gray-50 border border-gray-100 p-4 rounded-xl">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-sm shrink-0">
            {initials}
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <button className="px-4 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-900 text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
                <Upload size={16} className="text-blue-600" />
                Thay đổi ảnh đại diện
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ và tên..."
                className="h-10 px-4 rounded-lg bg-white border border-gray-300 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                <span>Số điện thoại <span className="text-red-500">*</span></span>
                <span className="text-green-600 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 size={14} /> Hoạt động
                </span>
              </label>
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại (VD: 0912345678)..."
                className="h-10 px-4 rounded-lg bg-white border border-gray-300 text-gray-900 font-mono text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                <span>Email tài khoản</span>
                <span className="text-blue-600 text-xs font-semibold flex items-center gap-1">
                  <LinkIcon size={14} /> Đã liên kết
                </span>
              </label>
              <input 
                type="email" 
                value={user?.email || ""}
                disabled
                className="h-10 px-4 rounded-lg bg-gray-100 border border-gray-200 text-gray-500 font-mono text-base cursor-not-allowed shadow-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-900">Địa chỉ nhận hàng mặc định</label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện..."
                className="h-10 px-4 rounded-lg bg-white border border-gray-300 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-900">Môn thể thao tập luyện chính</label>
              <select 
                value={interestedSport}
                onChange={(e) => setInterestedSport(e.target.value)}
                className="h-10 px-4 rounded-lg bg-white border border-gray-300 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm appearance-none cursor-pointer"
              >
                <option value="Chạy bộ Marathon, Gym Thể hình">Chạy bộ Marathon, Gym Thể hình</option>
                <option value="Chạy Trail, Cầu lông">Chạy Trail, Cầu lông</option>
                <option value="Bóng đá sân cỏ nhân tạo">Bóng đá sân cỏ nhân tạo</option>
                <option value="Bóng rổ, Bơi lội">Bóng rổ, Bơi lội</option>
                <option value="Fitness tổng quát">Fitness tổng quát</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                <span>Cỡ giày mặc định</span>
                <span className="text-gray-500 text-xs">Hỗ trợ gợi ý nhanh</span>
              </label>
              <select 
                value={shoeSize}
                onChange={(e) => setShoeSize(e.target.value)}
                className="h-10 px-4 rounded-lg bg-white border border-gray-300 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm appearance-none cursor-pointer"
              >
                <option value="40.5 EU (7.5 US)">40.5 EU (7.5 US)</option>
                <option value="41 EU (8.0 US)">41 EU (8.0 US)</option>
                <option value="42 EU (8.5 US)">42 EU (8.5 US)</option>
                <option value="42.5 EU (9.0 US)">42.5 EU (9.0 US)</option>
                <option value="43 EU (9.5 US)">43 EU (9.5 US)</option>
                <option value="44 EU (10.0 US)">44 EU (10.0 US)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Form Card 2: Thiết lập bảo mật & Quyền riêng tư */}
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
          <span>Dữ liệu đồng bộ trực tiếp với cơ sở dữ liệu KADY Sports</span>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-end">
          <button 
            onClick={handleSave}
            disabled={saveStatus !== "idle"}
            className={`px-8 py-2.5 rounded-lg text-white text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 min-w-[160px] ${
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
