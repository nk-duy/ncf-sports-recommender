"use client";

import React, { useState } from "react";
import { X, Bell, Send } from "lucide-react";
import { notifications } from "@mantine/notifications";
import type { CustomerItem, NotificationTemplate, NotificationType } from "../types";
import { NOTIFICATION_TEMPLATES } from "../data/notificationTemplates";
import NotificationTypeSelector from "./NotificationTypeSelector";

interface SendNotificationModalProps {
  opened: boolean;
  onClose: () => void;
  customer: CustomerItem | null;
  onSuccess?: () => void;
}

export default function SendNotificationModal({
  opened,
  onClose,
  customer,
  onSuccess,
}: SendNotificationModalProps) {
  const [type, setType] = useState<NotificationType>("admin_message");
  const [title, setTitle] = useState("🌟 Lời cảm ơn chân thành từ Kady Sport");
  const [message, setMessage] = useState(
    "Cảm ơn bạn đã luôn đồng hành cùng Kady Sport trên hành trình nâng cao sức khỏe thể chất. Đội ngũ chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7!"
  );
  const [link, setLink] = useState("/tai-khoan");
  const [sending, setSending] = useState(false);

  if (!opened || !customer) return null;

  const handleApplyTemplate = (tmpl: NotificationTemplate) => {
    setTitle(tmpl.title);
    setMessage(tmpl.message);
    setLink(tmpl.link);
  };

  const handleTypeChange = (newType: NotificationType) => {
    setType(newType);
    const tmpls = NOTIFICATION_TEMPLATES[newType];
    if (tmpls && tmpls.length > 0) {
      handleApplyTemplate(tmpls[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      notifications.show({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập đầy đủ tiêu đề và nội dung thông báo",
        color: "yellow",
      });
      return;
    }

    try {
      setSending(true);
      const res = await fetch("http://localhost:8000/api/v1/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: customer.id || customer.email,
          title: title.trim(),
          message: message.trim(),
          type,
          link: link.trim(),
        }),
      });

      if (res.ok) {
        notifications.show({
          title: "Gửi thông báo thành công!",
          message: `Đã gửi thông báo đến tài khoản ${customer.name} (${customer.email})`,
          color: "teal",
        });
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Không thể gửi thông báo");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Đã xảy ra lỗi khi gửi thông báo";
      notifications.show({
        title: "Gửi thất bại",
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
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-white to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Gửi Thông báo Trực tiếp / Email
              </h3>
              <p className="text-xs text-gray-500">
                Người nhận: <span className="font-semibold text-gray-800">{customer.name}</span> •{" "}
                <span className="font-mono">{customer.email}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <NotificationTypeSelector
            type={type}
            onTypeChange={handleTypeChange}
            onApplyTemplate={handleApplyTemplate}
          />

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Tiêu đề thông báo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề thông báo..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Nội dung thông báo <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập nội dung thông báo gửi đến khách hàng..."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Đường dẫn khi khách bấm vào (Link)
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="/tai-khoan hoặc /tai-khoan/orders..."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={sending}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center gap-2 shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Gửi ngay</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
