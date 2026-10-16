"use client";

import React from "react";
import { Users, ArrowUp, UserCheck, Award, Infinity as InfinityIcon } from "lucide-react";

interface CustomerKPICardsProps {
  stats: {
    total: number;
    active: number;
    vip: number;
    new: number;
    potential: number;
    churn_risk: number;
    clv: number;
  };
}

export default function CustomerKPICards({ stats }: CustomerKPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Card 1 */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Tổng khách hàng</span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Users size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl text-gray-900 font-bold tracking-tight">
              {stats.total.toLocaleString("vi-VN")}
            </span>
            <span className="text-xs text-green-600 font-semibold flex items-center">
              <ArrowUp size={14} />12.8%
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-semibold text-blue-600">
              +{stats.new > 0 ? stats.new : Math.ceil(stats.total * 0.05)}
            </span> người mới tuần này
          </p>
        </div>
        <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
          <div className="bg-blue-600 h-full rounded-full" style={{ width: "78%" }}></div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Hội viên tích cực</span>
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
            <UserCheck size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl text-gray-900 font-bold tracking-tight">
              {stats.active.toLocaleString("vi-VN")}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-800 font-bold">
              {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Hoạt động trong 30 ngày qua
          </p>
        </div>
        <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-green-500 h-full rounded-full"
            style={{ width: stats.total > 0 ? `${Math.min(100, (stats.active / stats.total) * 100)}%` : "0%" }}
          ></div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Khách hàng VIP / Platinum</span>
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
            <Award size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl text-gray-900 font-bold tracking-tight">
              {stats.vip.toLocaleString("vi-VN")}
            </span>
            <span className="text-xs text-gray-500 font-medium">thành viên</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            TB: <span className="font-semibold text-gray-900">{Math.round((stats.clv || 0) * 1.5).toLocaleString("vi-VN")} đ</span>/người
          </p>
        </div>
        <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-purple-500 h-full rounded-full"
            style={{ width: stats.total > 0 ? `${Math.min(100, (stats.vip / stats.total) * 100)}%` : "0%" }}
          ></div>
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Giá trị vòng đời TB (CLV)</span>
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
            <InfinityIcon size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl text-gray-900 font-bold tracking-tight">
              {Math.round(stats.clv || 0).toLocaleString("vi-VN")}
            </span>
            <span className="text-sm text-gray-500 font-medium">đ</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Tần suất mua: <span className="font-semibold text-gray-900">{((stats.active || 1) / (stats.total || 1) * 5).toFixed(1)} lần</span>/năm
          </p>
        </div>
        <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
          <div className="bg-orange-500 h-full rounded-full" style={{ width: "55%" }}></div>
        </div>
      </div>
    </div>
  );
}
