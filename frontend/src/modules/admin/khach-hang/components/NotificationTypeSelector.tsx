"use client";

import { Sparkles, Package, ShieldCheck } from "lucide-react";
import type { NotificationTemplate, NotificationType } from "../types";
import { NOTIFICATION_TEMPLATES } from "../data/notificationTemplates";

interface NotificationTypeSelectorProps {
  type: NotificationType;
  onTypeChange: (newType: NotificationType) => void;
  onApplyTemplate: (tmpl: NotificationTemplate) => void;
}

export default function NotificationTypeSelector({
  type,
  onTypeChange,
  onApplyTemplate,
}: NotificationTypeSelectorProps) {
  return (
    <>
      {/* Notification Type Selector */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Loại thông báo
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onTypeChange("admin_message")}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              type === "admin_message"
                ? "bg-blue-50 border-blue-600 text-blue-700 shadow-xs"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <ShieldCheck
              size={14}
              className={type === "admin_message" ? "text-blue-600" : "text-gray-400"}
            />
            <span>Hệ thống</span>
          </button>

          <button
            type="button"
            onClick={() => onTypeChange("ai_recommend")}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              type === "ai_recommend"
                ? "bg-purple-50 border-purple-600 text-purple-700 shadow-xs"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Sparkles
              size={14}
              className={type === "ai_recommend" ? "text-purple-600" : "text-gray-400"}
            />
            <span>Gợi ý AI</span>
          </button>

          <button
            type="button"
            onClick={() => onTypeChange("order")}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              type === "order"
                ? "bg-emerald-50 border-emerald-600 text-emerald-700 shadow-xs"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Package
              size={14}
              className={type === "order" ? "text-emerald-600" : "text-gray-400"}
            />
            <span>Đơn hàng</span>
          </button>
        </div>
      </div>

      {/* Quick Templates */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-gray-600">Mẫu gợi ý soạn nhanh:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(NOTIFICATION_TEMPLATES[type] || []).map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onApplyTemplate(tmpl)}
              className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-700 transition border border-gray-200/60 cursor-pointer text-left"
            >
              {tmpl.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
