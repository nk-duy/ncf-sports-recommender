"use client";

import React, { useState, useEffect } from "react";
import { X, Megaphone, Gift, Users, Send, Check } from "lucide-react";
import { notifications } from "@mantine/notifications";
import type { VoucherOptionItem } from "../types";

interface SendVoucherModalProps {
  opened: boolean;
  onClose: () => void;
  targetCount: number;
  selectedCustomerIds?: string[];
  singleCustomerName?: string;
  onSuccess?: () => void;
}

function SendVoucherModalInner({
  onClose,
  targetCount,
  selectedCustomerIds = [],
  singleCustomerName,
  onSuccess,
}: Omit<SendVoucherModalProps, "opened">) {
  const [vouchers, setVouchers] = useState<VoucherOptionItem[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(true);
  const [selectedVoucherCode, setSelectedVoucherCode] = useState("");
  const [customVoucherCode, setCustomVoucherCode] = useState("");
  const [title, setTitle] = useState("Quà tặng tri ân khách hàng thân thiết Kady Sport");
  const [message, setMessage] = useState(
    "Kady Sport gửi tặng bạn voucher ưu đãi độc quyền để đồng hành cùng các buổi tập luyện thể thao đỉnh cao. Áp dụng ngay cho đơn hàng kế tiếp!"
  );
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchVouchers = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/vouchers");
        if (res.ok && !cancelled) {
          const data = await res.json();
          const list: VoucherOptionItem[] = Array.isArray(data) ? data : [];
          setVouchers(list);
          if (list.length > 0) {
            setSelectedVoucherCode(list[0].code);
          }
        }
      } catch {
        // Bỏ qua lỗi khi tải danh sách voucher
      } finally {
        if (!cancelled) {
          setLoadingVouchers(false);
        }
      }
    };
    fetchVouchers();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeCode = customVoucherCode.trim()
    ? customVoucherCode.trim().toUpperCase()
    : selectedVoucherCode;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCode) {
      notifications.show({
        title: "Thiếu thông tin",
        message: "Vui lòng chọn hoặc nhập mã Voucher cần gửi",
        color: "yellow",
      });
      return;
    }

    try {
      setSending(true);
      // Gửi thông báo loại promotion kèm voucher_code vào hệ thống thông báo hai chiều
      const res = await fetch("http://localhost:8000/api/v1/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id:
            selectedCustomerIds.length === 1
              ? selectedCustomerIds[0]
              : selectedCustomerIds.length === 0
                ? "all"
                : undefined,
          user_ids: selectedCustomerIds.length > 1 ? selectedCustomerIds : undefined,
          voucher_code: activeCode,
          title: title.trim() || `🎁 Quà tặng Voucher ${activeCode} từ Kady Sport`,
          message: message.trim(),
          type: "promotion",
          link: "/tai-khoan",
        }),
      });

      if (res.ok) {
        notifications.show({
          title: "Tặng voucher thành công!",
          message: singleCustomerName
            ? `Đã tặng mã ${activeCode} đến khách hàng ${singleCustomerName}`
            : `Đã phát hành mã ${activeCode} đến ${targetCount} khách hàng`,
          color: "teal",
        });
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Lỗi khi gửi voucher");
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Không thể gửi voucher vào lúc này";
      notifications.show({
        title: "Thất bại",
        message: errorMsg,
        color: "red",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-white to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Megaphone size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Gửi thông báo &amp; Tặng Voucher
              </h3>
              <p className="text-xs text-gray-500">
                {singleCustomerName
                  ? `Người nhận: ${singleCustomerName}`
                  : `Áp dụng cho ${targetCount} khách hàng mục tiêu`}
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

        {/* Content */}
        <form onSubmit={handleSend} className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                <Users size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-600">Đối tượng tiếp nhận</span>
                <span className="text-sm font-bold text-gray-900">
                  {singleCustomerName
                    ? singleCustomerName
                    : selectedCustomerIds.length > 0
                      ? `${selectedCustomerIds.length} khách hàng đã đánh dấu chọn`
                      : `Toàn bộ ${targetCount} khách hàng trong danh sách`}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold font-mono">
              {selectedCustomerIds.length > 0 ? selectedCustomerIds.length : targetCount} người
            </span>
          </div>

          {/* Voucher Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Gift size={15} className="text-green-600" /> Chọn Voucher ưu đãi
            </label>

            {loadingVouchers ? (
              <div className="text-xs text-gray-400 py-3">Đang tải danh sách voucher...</div>
            ) : vouchers.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 mb-2 max-h-36 overflow-y-auto pr-1">
                {vouchers.map((v) => {
                  const isSelected = selectedVoucherCode === v.code && !customVoucherCode;
                  return (
                    <button
                      key={v.id || v._id || v.code}
                      type="button"
                      onClick={() => {
                        setSelectedVoucherCode(v.code);
                        setCustomVoucherCode("");
                      }}
                      className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? "bg-green-50 border-green-500 ring-2 ring-green-500/20 shadow-2xs"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono font-bold text-xs text-gray-900">
                          {v.code}
                        </span>
                        {isSelected && <Check size={14} className="text-green-600" />}
                      </div>
                      <span className="text-[11px] text-gray-500 mt-1 font-medium">
                        Giảm{" "}
                        {v.discount_type === "percent"
                          ? `${v.discount_value}%`
                          : `${v.discount_value.toLocaleString("vi-VN")} đ`}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            <div className="mt-2">
              <input
                type="text"
                placeholder="Hoặc nhập mã voucher khác (ví dụ: SPORT50K, FREESHIP)..."
                value={customVoucherCode}
                onChange={(e) => setCustomVoucherCode(e.target.value.toUpperCase())}
                className="w-full h-9 px-3 rounded-lg border border-gray-200 text-xs font-mono placeholder:font-sans placeholder:text-gray-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Tiêu đề thông báo
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
              <span>Nội dung lời nhắn</span>
              <span className="text-[11px] text-gray-400">Gửi qua Email &amp; In-app</span>
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 text-xs text-gray-900 leading-relaxed focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="px-4 h-9 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={sending}
              className="px-5 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={15} />
              )}
              <span>Gửi tặng khách hàng</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SendVoucherModal(props: SendVoucherModalProps) {
  if (!props.opened) return null;
  return (
    <SendVoucherModalInner
      onClose={props.onClose}
      targetCount={props.targetCount}
      selectedCustomerIds={props.selectedCustomerIds}
      singleCustomerName={props.singleCustomerName}
      onSuccess={props.onSuccess}
    />
  );
}
