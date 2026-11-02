export type SettingsTab = "profile" | "address" | "security" | "ai";
export type SaveStatus = "idle" | "saving" | "saved";

export interface LocationItem {
  province: string;
  wards: string[];
}

export const SETTINGS_NAV_TABS: { id: SettingsTab; label: string; targetId: string }[] = [
  { id: "profile", label: "Thông tin cá nhân", targetId: "profile-section" },
  { id: "address", label: "Sổ địa chỉ nhận hàng", targetId: "address-section" },
  { id: "security", label: "Đổi mật khẩu & Bảo mật", targetId: "security-section" },
  { id: "ai", label: "Tùy chọn gợi ý AI", targetId: "ai-section" },
];

export const SPORTS_OPTIONS = [
  { name: "Đá bóng", icon: "⚽" },
  { name: "Cầu lông", icon: "🏸" },
  { name: "Pickleball", icon: "🏓" },
  { name: "Bóng chuyền", icon: "🏐" },
  { name: "Chạy bộ", icon: "🏃" },
  { name: "Dã ngoại", icon: "🏕️" },
  { name: "Đa dụng", icon: "🏋️" },
];

export const SHOE_SIZES = [
  "38 EU",
  "39 EU",
  "40 EU",
  "41 EU",
  "42 EU",
  "43 EU",
  "44 EU",
  "45 EU",
];

export const APPAREL_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

export interface ParsedUserAddress {
  selectedProvince: string;
  selectedWard: string;
  streetAddress: string;
  isManualLocation: boolean;
}

export function parseUserAddress(
  fullAddr: string,
  vnLocations: LocationItem[]
): ParsedUserAddress {
  if (!fullAddr) {
    return {
      selectedProvince: "",
      selectedWard: "",
      streetAddress: "",
      isManualLocation: false,
    };
  }

  const parts = fullAddr.split(",").map((p) => p.trim());
  if (parts.length >= 3) {
    const prov = parts[parts.length - 1];
    const ward = parts[parts.length - 2];
    const street = parts.slice(0, parts.length - 2).join(", ");
    const isKnownProvince = vnLocations.some((l) => l.province === prov);

    return {
      selectedProvince: prov,
      selectedWard: ward,
      streetAddress: street,
      isManualLocation: !isKnownProvince,
    };
  }

  return {
    selectedProvince: "",
    selectedWard: "",
    streetAddress: fullAddr,
    isManualLocation: true,
  };
}
