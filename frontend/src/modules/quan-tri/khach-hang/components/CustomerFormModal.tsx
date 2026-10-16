"use client";

import React, { useState, useEffect } from "react";
import { X, User, Mail, Phone, MapPin, Award, Activity, Sparkles, Check } from "lucide-react";
import { notifications } from "@mantine/notifications";

interface CustomerFormModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer?: any | null; // If provided, edit mode; otherwise, create mode
}

const AVAILABLE_SPORTS = [
  "Chạy bộ",
  "Gym / Fitness",
  "Yoga",
  "Camping / Dã ngoại",
  "Bóng đá",
  "Cầu lông",
  "Bóng rổ",
  "Bơi lội",
  "Đạp xe",
  "Tennis"
];

const TIERS = [
  { value: "Đồng", label: "Đồng", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { value: "Bạc", label: "Bạc", color: "bg-gray-200 text-gray-800 border-gray-300" },
  { value: "Vàng", label: "Vàng", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { value: "Kim Cương", label: "Kim Cương", color: "bg-emerald-100 text-emerald-800 border-emerald-300" }
];

export default function CustomerFormModal({
  opened,
  onClose,
  onSuccess,
  customer
}: CustomerFormModalProps) {
  const isEdit = Boolean(customer);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [tier, setTier] = useState("Đồng");
  const [selectedSports, setSelectedSports] = useState<string[]>(["Chạy bộ"]);
  const [shoeSize, setShoeSize] = useState("41 EU");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFullName(customer.name || customer.full_name || "");
      setEmail(customer.email || "");
      setPhone(customer.phone !== "Chưa cập nhật" ? (customer.phone || "") : "");
      setAddress(customer.address !== "Chưa cập nhật" ? (customer.address || "") : "");
      setTier(customer.tier || "Đồng");
      setSelectedSports(Array.isArray(customer.sports) && customer.sports.length > 0 ? customer.sports : ["Chạy bộ"]);
      setShoeSize(customer.shoeSize || "41 EU");
    } else {
      setFullName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setTier("Đồng");
      setSelectedSports(["Chạy bộ"]);
      setShoeSize("41 EU");
    }
  }, [customer, opened]);

  if (!opened) return null;

  const toggleSport = (sport: string) => {
    if (selectedSports.includes(sport)) {
      if (selectedSports.length > 1) {
        setSelectedSports(selectedSports.filter(s => s !== sport));
      } else {
        notifications.show({
          title: "Lưu ý",
          message: "Khách hàng nên có ít nhất một bộ môn quan tâm",
          color: "yellow"
        });
      }
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      notifications.show({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập họ tên và email khách hàng",
        color: "red"
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      const url = isEdit
        ? `http://localhost:8000/api/v1/customers/${customer.id}`
        : `http://localhost:8000/api/v1/customers/`;
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || "Chưa cập nhật",
        address: address.trim() || "Chưa cập nhật",
        tier,
        interested_sports: selectedSports,
        shoe_size: shoeSize,
        preferred_colors: ["bg-blue-600", "bg-gray-900"],
        ai_profile: `${selectedSports[0] || "Thể thao"} cơ bản`
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Có lỗi xảy ra");
      }

      notifications.show({
        title: "Thành công",
        message: isEdit ? "Cập nhật hồ sơ khách hàng thành công" : "Thêm khách hàng mới thành công",
        color: "teal"
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      notifications.show({
        title: "Thất bại",
        message: err.message || "Không thể lưu thông tin khách hàng",
        color: "red"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-white to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <User size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {isEdit ? "Chỉnh sửa thông tin khách hàng" : "Thêm khách hàng mới"}
              </h3>
              <p className="text-xs text-gray-500">
                {isEdit ? `Mã KH: ${customer?.code || ""}` : "Tạo tài khoản hội viên và hồ sơ thể thao cá nhân"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email liên hệ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="email"
                  required
                  disabled={isEdit}
                  placeholder="an.nguyen@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Số điện thoại
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="0912.345.678"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Cỡ giày tiêu chuẩn
              </label>
              <input
                type="text"
                placeholder="Ví dụ: 42 EU / 8.5 US"
                value={shoeSize}
                onChange={e => setShoeSize(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Địa chỉ / Khu vực
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố (Hà Nội, TP.HCM...)"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tier Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Award size={15} className="text-amber-500" /> Phân hạng hội viên
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TIERS.map(t => {
                const isSelected = tier === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTier(t.value)}
                    className={`h-10 px-3 rounded-lg border text-xs font-bold flex items-center justify-between transition-all ${
                      isSelected
                        ? `${t.color} border-current ring-2 ring-blue-500/20 shadow-xs`
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{t.label}</span>
                    {isSelected && <Check size={14} className="shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sports Interest Tags */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Activity size={15} className="text-blue-600" /> Bộ môn thể thao quan tâm
              </span>
              <span className="text-[11px] text-gray-400 font-normal">Chọn nhiều bộ môn</span>
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
              {AVAILABLE_SPORTS.map(sport => {
                const isSelected = selectedSports.includes(sport);
                return (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => toggleSport(sport)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100/50"
                    }`}
                  >
                    {sport}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 h-10 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <span>{isEdit ? "Lưu thay đổi" : "Tạo khách hàng"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
