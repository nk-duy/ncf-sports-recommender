"use client";

import React, { useState } from "react";
import { Flame, Clock, Bell, CheckCircle2 } from "lucide-react";
import { notifications } from "@mantine/notifications";

interface TimeSlot {
  id: string;
  time: string;
  title: string;
  sub: string;
  status: "ended" | "active" | "upcoming";
}

export default function PromotionsTimeline({
  onSelectSlot,
}: {
  onSelectSlot?: (slotId: string) => void;
}) {
  const [activeSlot, setActiveSlot] = useState<string>("slot-2");
  const [remindedSlots, setRemindedSlots] = useState<Record<string, boolean>>({});

  const timeSlots: TimeSlot[] = [
    {
      id: "slot-1",
      time: "00:00 - 09:00",
      title: "XẢ KHO ĐÊM",
      sub: "ĐÃ KẾT THÚC",
      status: "ended",
    },
    {
      id: "slot-2",
      time: "09:00 - 15:00",
      title: "FLASH SALE ĐỈNH CAO",
      sub: "ĐANG DIỄN RA",
      status: "active",
    },
    {
      id: "slot-3",
      time: "15:00 - 20:00",
      title: "DEAL THỂ THAO HOT",
      sub: "SẮP DIỄN RA",
      status: "upcoming",
    },
    {
      id: "slot-4",
      time: "20:00 - 24:00",
      title: "ĐẠI TIỆC ĐÊM GIÁ SỐC",
      sub: "SẮP DIỄN RA",
      status: "upcoming",
    },
  ];

  const handleClick = (slot: TimeSlot) => {
    setActiveSlot(slot.id);
    if (onSelectSlot) {
      onSelectSlot(slot.id);
    }

    if (slot.status === "upcoming") {
      const isAlready = remindedSlots[slot.id];
      if (!isAlready) {
        setRemindedSlots((prev) => ({ ...prev, [slot.id]: true }));
        notifications.show({
          title: "Đã bật nhắc nhở!",
          message: `Hệ thống sẽ gửi thông báo khi khung giờ ${slot.time} bắt đầu.`,
          color: "teal",
          icon: <CheckCircle2 size={16} />,
          autoClose: 2500,
        });
      }
    }
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-red-500 fill-red-500 animate-bounce" />
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900">
            KHUNG GIỜ SĂN FLASH DEAL HÔM NAY
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">
          Cập nhật deal sốc theo từng phiên
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 bg-white p-2 sm:p-2.5 rounded-2xl shadow-xs border border-slate-200">
        {timeSlots.map((slot) => {
          const isSelected = activeSlot === slot.id;
          const isOngoing = slot.status === "active";
          const isEnded = slot.status === "ended";

          return (
            <button
              key={slot.id}
              onClick={() => handleClick(slot)}
              className={`relative flex flex-col items-center justify-center py-3 px-3 rounded-xl transition-all duration-200 cursor-pointer text-center select-none border ${
                isSelected
                  ? isOngoing
                    ? "bg-red-600 text-white border-red-600 shadow-sm"
                    : "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : isEnded
                  ? "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100/80"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                {isOngoing ? (
                  <Flame className="w-4 h-4 fill-white text-white" />
                ) : isEnded ? (
                  <Clock className="w-3.5 h-3.5 opacity-60" />
                ) : (
                  <Bell className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span className="text-base sm:text-lg font-bold tracking-tight font-mono">
                  {slot.time}
                </span>
              </div>

              <span className={`text-xs font-semibold uppercase tracking-wider ${
                isSelected && isOngoing ? "text-red-100" : isEnded ? "text-slate-400" : "text-slate-600"
              }`}>
                {slot.title}
              </span>

              <div className="mt-1">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  isOngoing
                    ? isSelected ? "bg-white/20 text-white" : "bg-red-50 text-red-600 border border-red-200"
                    : isEnded
                    ? "bg-slate-200/60 text-slate-500"
                    : remindedSlots[slot.id]
                    ? "bg-teal-50 text-teal-700 border border-teal-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {remindedSlots[slot.id] ? "ĐÃ BẬT NHẮC" : slot.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
