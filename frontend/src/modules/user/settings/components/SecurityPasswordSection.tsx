"use client";

import {
  ShieldCheck,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  RefreshCw,
  Smartphone,
  BellRing,
} from "lucide-react";

interface SecurityPasswordSectionProps {
  oldPassword: string;
  setOldPassword: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmNewPassword: string;
  setConfirmNewPassword: (val: string) => void;
  showOldPassword: boolean;
  setShowOldPassword: (val: boolean) => void;
  showNewPassword: boolean;
  setShowNewPassword: (val: boolean) => void;
  showConfirmNewPassword: boolean;
  setShowConfirmNewPassword: (val: boolean) => void;
  isChangingPassword: boolean;
  passwordError: string;
  passwordSuccess: string;
  onSubmitPassword: (e: React.FormEvent) => void;
  is2FAEnabled: boolean;
  onToggle2FA: (val: boolean) => void;
  isNotifEnabled: boolean;
  onToggleNotif: (val: boolean) => void;
}

export default function SecurityPasswordSection({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  showOldPassword,
  setShowOldPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmNewPassword,
  setShowConfirmNewPassword,
  isChangingPassword,
  passwordError,
  passwordSuccess,
  onSubmitPassword,
  is2FAEnabled,
  onToggle2FA,
  isNotifEnabled,
  onToggleNotif,
}: SecurityPasswordSectionProps) {
  return (
    <div
      id="security-section"
      className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col gap-6"
    >
      <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
        <ShieldCheck className="text-blue-600" size={24} />
        <span className="text-lg font-bold text-gray-900">
          Thiết lập bảo mật &amp; Quyền riêng tư
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {/* Đổi mật khẩu tài khoản */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div className="flex items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                <KeyRound size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Đổi mật khẩu đăng nhập</h4>
                <p className="text-xs text-slate-500">
                  Cập nhật mật khẩu định kỳ để bảo vệ tài khoản KADY Sports
                </p>
              </div>
            </div>
          </div>

          {passwordError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          <form onSubmit={onSubmitPassword} className="space-y-3.5 pt-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu hiện tại <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Nhập mật khẩu cũ..."
                    className="w-full h-10 px-3.5 pr-9 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showOldPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu mới <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự..."
                    className="w-full h-10 px-3.5 pr-9 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Xác nhận mật khẩu <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmNewPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới..."
                    className="w-full h-10 px-3.5 pr-9 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isChangingPassword || !oldPassword || !newPassword}
                className="h-9 px-5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                {isChangingPassword ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Đang cập nhật...</span>
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    <span>Cập nhật mật khẩu</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 2FA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-700 shrink-0 border border-green-200">
              <Smartphone size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900">Xác thực hai yếu tố (2FA)</span>
              <span className="text-sm text-gray-500">
                Bảo vệ đơn hàng và giao dịch đổi voucher điểm thưởng bằng mã xác nhận SMS OTP.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 sm:ml-4 self-end sm:self-center">
            <span className="text-xs text-green-600 font-bold hidden sm:inline">
              {is2FAEnabled ? "Đang bật qua SMS OTP" : "Đã tắt"}
            </span>
            <button
              type="button"
              onClick={() => onToggle2FA(!is2FAEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 cursor-pointer ${
                is2FAEnabled ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  is2FAEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* AI & Marketing Notification */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 border border-blue-200">
              <BellRing size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900">
                Nhận thông báo ưu đãi thể thao &amp; Gợi ý AI qua email
              </span>
              <span className="text-sm text-gray-500">
                Nhận cập nhật về các đợt flash-sale dòng giày chạy, giáo án nâng cao và sự kiện marathon.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 sm:ml-4 self-end sm:self-center">
            <span className="text-xs text-blue-600 font-bold hidden sm:inline">
              {isNotifEnabled ? "Bật" : "Tắt"}
            </span>
            <button
              type="button"
              onClick={() => onToggleNotif(!isNotifEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 cursor-pointer ${
                isNotifEnabled ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  isNotifEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
