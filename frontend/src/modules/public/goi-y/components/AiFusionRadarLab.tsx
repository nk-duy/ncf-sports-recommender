"use client";

import React from "react";
import { Slider, Switch } from "@mantine/core";
import { RotateCcw, Zap } from "lucide-react";
import AiXRayToggle from "@/shared/components/AiXRayToggle";
import type { LatentRadarAxis } from "../types";

interface AiFusionRadarLabProps {
  wNcf: number;
  onChangeWNcf: (val: number) => void;
  wVisual: number;
  onChangeWVisual: (val: number) => void;
  wContext: number;
  onChangeWContext: (val: number) => void;
  discoveryMode: boolean;
  onChangeDiscoveryMode: (val: boolean) => void;
  onResetOptimal: () => void;
  latencyMs: number | null;
  isTuning: boolean;
  radarAxes: LatentRadarAxis[];
}

const DEFAULT_RADAR_AXES: LatentRadarAxis[] = [
  { sport_type: "Đá bóng", ncf_affinity: 88, visual_affinity: 82, combined_affinity: 86 },
  { sport_type: "Cầu lông", ncf_affinity: 85, visual_affinity: 79, combined_affinity: 83 },
  { sport_type: "Chạy bộ", ncf_affinity: 80, visual_affinity: 86, combined_affinity: 82 },
  { sport_type: "Pickleball", ncf_affinity: 76, visual_affinity: 84, combined_affinity: 79 },
  { sport_type: "Bóng chuyền", ncf_affinity: 74, visual_affinity: 77, combined_affinity: 75 },
  { sport_type: "Gym & Fitness", ncf_affinity: 82, visual_affinity: 75, combined_affinity: 80 },
  { sport_type: "Dã ngoại", ncf_affinity: 70, visual_affinity: 81, combined_affinity: 73 },
  { sport_type: "Phụ kiện chung", ncf_affinity: 78, visual_affinity: 80, combined_affinity: 79 },
];

export default function AiFusionRadarLab({
  wNcf,
  onChangeWNcf,
  wVisual,
  onChangeWVisual,
  wContext,
  onChangeWContext,
  discoveryMode,
  onChangeDiscoveryMode,
  onResetOptimal,
  latencyMs,
  isTuning,
  radarAxes,
}: AiFusionRadarLabProps) {
  const axes = radarAxes && radarAxes.length === 8 ? radarAxes : DEFAULT_RADAR_AXES;

  // SVG Radar Geometry (320x320 coordinate space)
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = 104;
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getPoint = (index: number, valuePercent: number, total: number = 8) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (Math.max(0, Math.min(100, valuePercent)) / 100) * maxRadius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      angle,
    };
  };

  const buildPolygonPoints = (values: number[]) =>
    values
      .map((v, i) => {
        const pt = getPoint(i, v, values.length);
        return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
      })
      .join(" ");

  const ncfPolygon = buildPolygonPoints(axes.map((a) => a.ncf_affinity));
  const visualPolygon = buildPolygonPoints(axes.map((a) => a.visual_affinity));

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-sm mb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              Mô hình lai NCF 32D & Thị giác 48D
            </span>
            {latencyMs !== null && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                {isTuning ? "Đang tính toán..." : `${latencyMs} ms`}
              </span>
            )}
            {discoveryMode && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                🌟 Khám phá liên bộ môn đang bật
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Tùy chỉnh Gợi ý & Phân tích Sở thích Thể thao
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Điều chỉnh trực tiếp tỷ trọng giữa hành vi tương tác, thẩm mỹ kiểu dáng và ngữ cảnh thể thao theo thời gian thực.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
          <AiXRayToggle size="sm" />
          <button
            type="button"
            onClick={onResetOptimal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Đặt lại chuẩn tối ưu</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Cột trái: Tùy chỉnh mức độ ưu tiên khi gợi ý (7 columns) */}
        <div className="lg:col-span-7 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-800">
                Tùy chỉnh mức độ ưu tiên khi gợi ý
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kéo thanh trượt để tinh chỉnh thuật toán cá nhân hóa theo nhu cầu của bạn
              </p>
            </div>

            <div className="space-y-3.5">
              {/* Slider 1: w_ncf */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Thói quen & Lịch sử tương tác (NeuMF 32D)
                  </label>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold tabular-nums">
                    {wNcf.toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={wNcf}
                  onChange={onChangeWNcf}
                  min={0}
                  max={2}
                  step={0.05}
                  color="blue"
                  size="sm"
                  marks={[
                    { value: 0, label: "0.0" },
                    { value: 1.0, label: "1.0 (Chuẩn)" },
                    { value: 2.0, label: "2.0" },
                  ]}
                  styles={{
                    markLabel: { color: "#64748b", fontSize: 10 },
                  }}
                />
              </div>

              {/* Slider 2: w_visual */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Kiểu dáng & Màu sắc tương đồng (Thị giác 48D)
                  </label>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold tabular-nums">
                    {wVisual.toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={wVisual}
                  onChange={onChangeWVisual}
                  min={0}
                  max={2}
                  step={0.05}
                  color="indigo"
                  size="sm"
                  marks={[
                    { value: 0, label: "0.0" },
                    { value: 0.35, label: "0.35 (Chuẩn)" },
                    { value: 1.2, label: "1.2" },
                    { value: 2.0, label: "2.0" },
                  ]}
                  styles={{
                    markLabel: { color: "#64748b", fontSize: 10 },
                  }}
                />
              </div>

              {/* Slider 3: w_context */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Ưu tiên cùng bộ môn thể thao (Ngữ cảnh)
                  </label>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold tabular-nums">
                    {wContext.toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={wContext}
                  onChange={onChangeWContext}
                  min={0}
                  max={2}
                  step={0.05}
                  color="blue"
                  size="sm"
                  marks={[
                    { value: 0, label: "0.0" },
                    { value: 1.0, label: "1.0 (Chuẩn)" },
                    { value: 2.0, label: "2.0" },
                  ]}
                  styles={{
                    markLabel: { color: "#64748b", fontSize: 10 },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Công tắc khám phá liên bộ môn & Công thức */}
          <div className="pt-2 space-y-3">
            <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-3.5 shadow-xs flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800">
                  Mở rộng khám phá liên bộ môn
                </div>
                <p className="text-xs text-slate-500">
                  Đề xuất thêm các sản phẩm thuộc bộ môn khác nhưng phù hợp với sở thích và thẩm mỹ của bạn
                </p>
              </div>
              <Switch
                checked={discoveryMode}
                onChange={(e) => onChangeDiscoveryMode(e.currentTarget.checked)}
                color="blue"
                size="md"
                aria-label="Mở rộng khám phá liên bộ môn"
              />
            </div>

            <div className="text-xs text-slate-500 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between flex-wrap gap-2">
              <span className="font-semibold text-slate-600">Công thức xếp hạng:</span>
              <span className="text-slate-600">
                Score = <b className="text-blue-600 font-semibold">{wNcf.toFixed(2)}</b> × NCF(32D) +{" "}
                <b className="text-indigo-600 font-semibold">{wVisual.toFixed(2)}</b> × Visual(48D) +{" "}
                <b className="text-slate-800 font-semibold">{wContext.toFixed(2)}</b> × {discoveryMode ? "Serendipity" : "Context"} + Rating
              </span>
            </div>
          </div>
        </div>

        {/* Cột phải: Biểu đồ Tương thích theo Bộ môn (5 columns) */}
        <div className="lg:col-span-5 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-sm font-bold text-slate-800">
              Biểu đồ Tương thích theo Bộ môn
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Phân bố mức độ phù hợp trên 8 bộ môn thể thao
            </p>
          </div>

          {/* SVG Spider Chart */}
          <div className="flex items-center justify-center my-auto py-2">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full max-w-[310px] h-auto select-none overflow-visible"
              role="img"
              aria-label="Biểu đồ Radar Tương thích 8 Bộ môn"
            >
              {/* Vòng lưới đa giác 8 cạnh */}
              {levels.map((lvl, idx) => {
                const ringPoints = axes
                  .map((_, i) => {
                    const pt = getPoint(i, lvl * 100, axes.length);
                    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
                  })
                  .join(" ");
                return (
                  <polygon
                    key={idx}
                    points={ringPoints}
                    fill={idx === levels.length - 1 ? "rgba(255, 255, 255, 0.7)" : "none"}
                    stroke="#cbd5e1"
                    strokeWidth={1}
                    strokeDasharray={idx < levels.length - 1 ? "2,2" : undefined}
                  />
                );
              })}

              {/* 8 Trục nan hoa & Nhãn bộ môn */}
              {axes.map((axis, i) => {
                const outerPt = getPoint(i, 100, axes.length);
                const labelPt = getPoint(i, 126, axes.length);
                return (
                  <g key={axis.sport_type}>
                    <line
                      x1={cx}
                      y1={cy}
                      x2={outerPt.x}
                      y2={outerPt.y}
                      stroke="#e2e8f0"
                      strokeWidth={1}
                    />
                    <text
                      x={labelPt.x}
                      y={labelPt.y - 4}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-slate-700 text-[10px] font-semibold"
                    >
                      {axis.sport_type}
                    </text>
                    <text
                      x={labelPt.x}
                      y={labelPt.y + 8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-slate-500 text-[9px] font-medium"
                    >
                      {Math.round(axis.combined_affinity)}%
                    </text>
                  </g>
                );
              })}

              {/* Đa giác 1: Hành vi NCF 32D */}
              <polygon
                points={ncfPolygon}
                fill="rgba(37, 99, 235, 0.15)"
                stroke="#2563eb"
                strokeWidth={2}
              />

              {/* Đa giác 2: Thị giác 48D */}
              <polygon
                points={visualPolygon}
                fill="rgba(124, 58, 237, 0.12)"
                stroke="#7c3aed"
                strokeWidth={2}
              />

              {/* Điểm đỉnh NCF 32D */}
              {axes.map((axis, i) => {
                const pt = getPoint(i, axis.ncf_affinity, axes.length);
                return (
                  <circle
                    key={`ncf-${axis.sport_type}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={3}
                    fill="#2563eb"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  >
                    <title>{`${axis.sport_type} - Hành vi NCF 32D: ${axis.ncf_affinity}%`}</title>
                  </circle>
                );
              })}

              {/* Điểm đỉnh Thị giác 48D */}
              {axes.map((axis, i) => {
                const pt = getPoint(i, axis.visual_affinity, axes.length);
                return (
                  <circle
                    key={`vis-${axis.sport_type}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={3}
                    fill="#7c3aed"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  >
                    <title>{`${axis.sport_type} - Thị giác 48D: ${axis.visual_affinity}%`}</title>
                  </circle>
                );
              })}
            </svg>
          </div>

          {/* Chú thích biểu đồ (Legend) */}
          <div className="pt-3 border-t border-slate-200/80 flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-blue-100 border-2 border-blue-600 inline-block" />
              <span className="text-slate-700 font-medium">Hành vi NCF 32D</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-indigo-100 border-2 border-indigo-600 inline-block" />
              <span className="text-slate-700 font-medium">Thị giác 48D</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
