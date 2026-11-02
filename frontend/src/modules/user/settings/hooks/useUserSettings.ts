"use client";

import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { useAuthStore, type User } from "@/shared/store/authStore";
import vnLocationsData from "@/shared/data/locations.json";
import {
  parseUserAddress,
  type LocationItem,
  type SaveStatus,
} from "../types";

export const vnLocations = vnLocationsData as LocationItem[];

export function useUserSettings(initialUser: User | null) {
  const { token, setUser } = useAuthStore();

  const parsedAddr = parseUserAddress(initialUser?.address || "", vnLocations);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(
    initialUser?.is_2fa_enabled !== undefined ? Boolean(initialUser.is_2fa_enabled) : true
  );
  const [isNotifEnabled, setIsNotifEnabled] = useState<boolean>(
    initialUser?.email_notifications !== undefined ? Boolean(initialUser.email_notifications) : true
  );

  // Profile & Address states
  const [fullName, setFullName] = useState<string>(initialUser?.full_name || "");
  const [phone, setPhone] = useState<string>(initialUser?.phone || "");
  const [selectedProvince, setSelectedProvince] = useState<string>(parsedAddr.selectedProvince);
  const [selectedWard, setSelectedWard] = useState<string>(parsedAddr.selectedWard);
  const [streetAddress, setStreetAddress] = useState<string>(parsedAddr.streetAddress);
  const [isManualLocation, setIsManualLocation] = useState<boolean>(parsedAddr.isManualLocation);

  // Sports & Sizing states
  const [interestedSports, setInterestedSports] = useState<string[]>(
    initialUser?.interested_sports && initialUser.interested_sports.length > 0
      ? initialUser.interested_sports
      : ["Chạy bộ", "Đá bóng"]
  );
  const [shoeSize, setShoeSize] = useState<string>(initialUser?.shoe_size || "42 EU");
  const [apparelSize, setApparelSize] = useState<string>(initialUser?.apparel_size || "L");

  // Password change states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleToggle2FA = async (newVal: boolean) => {
    setIs2FAEnabled(newVal);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_2fa_enabled: newVal }),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        notifications.show({
          title: "Bảo mật tài khoản",
          message: newVal
            ? "Đã kích hoạt xác thực 2 yếu tố (2FA) thành công!"
            : "Đã hủy kích hoạt xác thực 2 yếu tố.",
          color: newVal ? "green" : "gray",
        });
      }
    } catch {
      setIs2FAEnabled(!newVal);
      notifications.show({
        title: "Lỗi",
        message: "Không thể cập nhật trạng thái 2FA trên máy chủ",
        color: "red",
      });
    }
  };

  const handleToggleNotif = async (newVal: boolean) => {
    setIsNotifEnabled(newVal);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email_notifications: newVal }),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        notifications.show({
          title: "Cài đặt thông báo",
          message: newVal
            ? "Đã bật nhận thông báo ưu đãi & gợi ý AI qua email"
            : "Đã tắt nhận thông báo qua email.",
          color: newVal ? "blue" : "gray",
        });
      }
    } catch {
      setIsNotifEnabled(!newVal);
      notifications.show({
        title: "Lỗi",
        message: "Không thể cập nhật cấu hình thông báo",
        color: "red",
      });
    }
  };

  const toggleSport = (sport: string) => {
    if (interestedSports.includes(sport)) {
      if (interestedSports.length > 1) {
        setInterestedSports(interestedSports.filter((s) => s !== sport));
      } else {
        notifications.show({
          title: "Lưu ý",
          message: "Vui lòng giữ lại ít nhất 1 bộ môn thể thao quan tâm",
          color: "orange",
        });
      }
    } else {
      setInterestedSports([...interestedSports, sport]);
    }
  };

  const handleSave = async () => {
    if (saveStatus !== "idle") return;

    const cleanPhone = phone.trim().replace(/[\s.-]/g, "");
    if (cleanPhone) {
      const vnPhoneRegex = /^(?:(?:\+84|84)0?|0)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
      if (!vnPhoneRegex.test(cleanPhone)) {
        notifications.show({
          title: "Số điện thoại không hợp lệ",
          message:
            "Vui lòng nhập đúng số điện thoại di động Việt Nam (gồm 10 số, bắt đầu bằng 03, 05, 07, 08, 09).",
          color: "red",
        });
        return;
      }
    }

    let combinedAddress = "";
    if (isManualLocation) {
      combinedAddress = streetAddress.trim();
    } else {
      const parts: string[] = [];
      if (streetAddress.trim()) parts.push(streetAddress.trim());
      if (selectedWard.trim()) parts.push(selectedWard.trim());
      if (selectedProvince.trim()) parts.push(selectedProvince.trim());
      combinedAddress = parts.join(", ");
    }

    setSaveStatus("saving");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: fullName.trim(),
          phone: cleanPhone || undefined,
          address: combinedAddress,
          interested_sports: interestedSports,
          shoe_size: shoeSize,
          apparel_size: apparelSize,
          is_2fa_enabled: is2FAEnabled,
          email_notifications: isNotifEnabled,
        }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setSaveStatus("saved");
        notifications.show({
          title: "Thành công",
          message: "Thông tin tài khoản đã được lưu vào hệ thống",
          color: "green",
        });
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("idle");
        notifications.show({
          title: "Thất bại",
          message: "Không thể lưu thông tin. Vui lòng thử lại sau.",
          color: "red",
        });
      }
    } catch {
      setSaveStatus("idle");
      notifications.show({
        title: "Lỗi kết nối",
        message: "Không thể kết nối đến máy chủ",
        color: "red",
      });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!oldPassword) {
      setPasswordError("Vui lòng nhập mật khẩu hiện tại");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải có tối thiểu 6 ký tự");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Mật khẩu xác nhận không trùng khớp");
      return;
    }

    setIsChangingPassword(true);
    try {
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const apiUrl = rawApiUrl.endsWith("/api/v1") ? rawApiUrl : `${rawApiUrl}/api/v1`;
      const authToken =
        token ||
        (typeof window !== "undefined"
          ? localStorage.getItem("kady_customer_token") || localStorage.getItem("token")
          : null);

      const res = await fetch(`${apiUrl}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.detail || "Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu cũ."
        );
      }

      setPasswordSuccess("Đổi mật khẩu thành công! Mật khẩu mới đã được cập nhật an toàn.");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      notifications.show({
        title: "Thành công",
        message: "Mật khẩu của bạn đã được cập nhật thành công!",
        color: "green",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Lỗi kết nối máy chủ";
      setPasswordError(message);
      notifications.show({
        title: "Lỗi",
        message,
        color: "red",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return {
    saveStatus,
    is2FAEnabled,
    isNotifEnabled,
    fullName,
    setFullName,
    phone,
    setPhone,
    selectedProvince,
    setSelectedProvince,
    selectedWard,
    setSelectedWard,
    streetAddress,
    setStreetAddress,
    isManualLocation,
    setIsManualLocation,
    interestedSports,
    shoeSize,
    setShoeSize,
    apparelSize,
    setApparelSize,
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
    handleToggle2FA,
    handleToggleNotif,
    toggleSport,
    handleSave,
    handleChangePassword,
  };
}
