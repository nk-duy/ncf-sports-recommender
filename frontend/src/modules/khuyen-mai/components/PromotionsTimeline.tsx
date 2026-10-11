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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 bg-slate-950 p-2 sm:p-2.5 rounded-2xl shadow-xl border border-slate-800">
        {timeSlots.map((slot) => {
          const isSelected = activeSlot === slot.id;
          const isOngoing = slot.status === "active";
          const isEnded = slot.status === "ended";

          return (
            <button
              key={slot.id}
              onClick={() => handleClick(slot)}
              className={`relative flex flex-col items-center justify-center py-3.5 px-3 rounded-xl transition-all duration-200 cursor-pointer text-center select-none ${
                isSelected
                  ? isOngoing
                    ? "bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg shadow-red-600/30 scale-[1.02]"
                    : "bg-slate-800 text-white shadow-md scale-[1.01]"
                  : isEnded
                  ? "bg-slate-900/60 text-slate-500 hover:bg-slate-900 hover:text-slate-400"
                  : "bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {/* Ongoing pulse dot */}
              {isOngoing && (
                <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-slate-950"></span>
                </span>
              )}

              <div className="flex items-center gap-1.5 mb-1">
                {isOngoing ? (
                  <Flame className="w-4 h-4 fill-amber-300 text-amber-300 animate-pulse" />
                ) : isEnded ? (
                  <Clock className="w-3.5 h-3.5 opacity-60" />
                ) : (
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span className="text-base sm:text-lg font-black tracking-tight font-mono">
                  {slot.time}
                </span>
              </div>

              <span className={`text-xs font-bold uppercase tracking-wider ${
                isSelected && isOngoing ? "text-amber-200" : isEnded ? "text-slate-600" : "text-slate-400"
              }`}>
                {slot.title}
              </span>

              <div className="mt-1.5">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  isOngoing
                    ? "bg-white/20 text-white border border-white/30"
                    : isEnded
                    ? "bg-slate-800 text-slate-500"
                    : remindedSlots[slot.id]
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                    : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
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
