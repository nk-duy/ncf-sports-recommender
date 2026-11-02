"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  User as UserIcon,
  MapPin,
  Lock,
  Brain,
  Clock,
  Check,
  RefreshCw,
  CheckCheck,
} from "lucide-react";
import { useAuthStore, type User } from "@/shared/store/authStore";
import { SETTINGS_NAV_TABS, type SettingsTab } from "../types";
import { useUserSettings, vnLocations } from "../hooks/useUserSettings";
import ProfileInfoSection from "./ProfileInfoSection";
import AddressBookSection from "./AddressBookSection";
import SportsProfileSection from "./SportsProfileSection";
import SecurityPasswordSection from "./SecurityPasswordSection";

function renderTabIcon(id: SettingsTab, isActive: boolean) {
  if (id === "profile") return <UserIcon size={18} />;
  if (id === "address") return <MapPin size={18} />;
  if (id === "security") return <Lock size={18} />;
  return <Brain size={18} className={isActive ? "text-white" : "text-green-600"} />;
}

function SettingsFormContent({ currentUser }: { currentUser: User | null }) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const s = useUserSettings(currentUser);
  const initials = (s.fullName || currentUser?.username || "Tài khoản").substring(0, 2).toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-1 border border-gray-100">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="text-blue-600" size={28} />
          <h1 className="text-2xl md:text-3xl text-gray-900 font-bold">Cài đặt tài khoản</h1>
        </div>
        <p className="text-base text-gray-500">
          Quản lý thông tin cá nhân, địa chỉ giao hàng và cấu hình bảo mật tài khoản
        </p>
      </div>

      <div className="bg-white rounded-xl p-1.5 shadow-sm border border-gray-100 flex items-center gap-1 overflow-x-auto hide-scrollbar">
        {SETTINGS_NAV_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                document.getElementById(tab.targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                isActive ? "bg-blue-600 text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {renderTabIcon(tab.id, isActive)}
              {tab.label}
            </button>
          );
        })}
      </div>

      <div id="profile-section" className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
        <ProfileInfoSection
          initials={initials}
          fullName={s.fullName}
          setFullName={s.setFullName}
          phone={s.phone}
          setPhone={s.setPhone}
          email={currentUser?.email || ""}
        />
        <div className="flex flex-col gap-4">
          <AddressBookSection
            vnLocations={vnLocations}
            selectedProvince={s.selectedProvince}
            setSelectedProvince={s.setSelectedProvince}
            selectedWard={s.selectedWard}
            setSelectedWard={s.setSelectedWard}
            streetAddress={s.streetAddress}
            setStreetAddress={s.setStreetAddress}
            isManualLocation={s.isManualLocation}
            setIsManualLocation={s.setIsManualLocation}
          />
          <SportsProfileSection
            interestedSports={s.interestedSports}
            onToggleSport={s.toggleSport}
            shoeSize={s.shoeSize}
            setShoeSize={s.setShoeSize}
            apparelSize={s.apparelSize}
            setApparelSize={s.setApparelSize}
          />
        </div>
      </div>

      <SecurityPasswordSection
        oldPassword={s.oldPassword}
        setOldPassword={s.setOldPassword}
        newPassword={s.newPassword}
        setNewPassword={s.setNewPassword}
        confirmNewPassword={s.confirmNewPassword}
        setConfirmNewPassword={s.setConfirmNewPassword}
        showOldPassword={s.showOldPassword}
        setShowOldPassword={s.setShowOldPassword}
        showNewPassword={s.showNewPassword}
        setShowNewPassword={s.setShowNewPassword}
        showConfirmNewPassword={s.showConfirmNewPassword}
        setShowConfirmNewPassword={s.setShowConfirmNewPassword}
        isChangingPassword={s.isChangingPassword}
        passwordError={s.passwordError}
        passwordSuccess={s.passwordSuccess}
        onSubmitPassword={s.handleChangePassword}
        is2FAEnabled={s.is2FAEnabled}
        onToggle2FA={s.handleToggle2FA}
        isNotifEnabled={s.isNotifEnabled}
        onToggleNotif={s.handleToggleNotif}
      />

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm w-full sm:w-auto justify-center sm:justify-start">
          <Clock size={18} />
          <span>Dữ liệu đồng bộ trực tiếp với cơ sở dữ liệu KADY Sports</span>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-end">
          <button
            type="button"
            onClick={s.handleSave}
            disabled={s.saveStatus !== "idle"}
            className={`px-8 py-2.5 rounded-lg text-white text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 min-w-[160px] ${
              s.saveStatus === "idle"
                ? "bg-blue-600 hover:bg-blue-700"
                : s.saveStatus === "saving"
                  ? "bg-blue-500 opacity-90 cursor-wait"
                  : "bg-green-600"
            }`}
          >
            {s.saveStatus === "idle" && <><Check size={18} />Lưu thay đổi</>}
            {s.saveStatus === "saving" && <><RefreshCw size={18} className="animate-spin" />Đang lưu...</>}
            {s.saveStatus === "saved" && <><CheckCheck size={18} />Đã lưu thành công</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AccountSettingsFull() {
  const user = useAuthStore((s) => s.user);
  return <SettingsFormContent key={user?.id || user?.username || "guest"} currentUser={user} />;
}
