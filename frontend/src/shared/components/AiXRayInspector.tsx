"use client";

import React from "react";
import { AIExplanation } from "@/shared/types/aiExplanation";
import { Cpu } from "lucide-react";

interface AiXRayInspectorProps {
  explanation?: AIExplanation | null;
  className?: string;
}

export default function AiXRayInspector({ explanation, className = "" }: AiXRayInspectorProps) {
  if (!explanation) return null;

  const {
    strategy,
    ncf_score = 0,
    context_boost = 0,
    cosine_score = 0,
    rating_score = 0,
    final_score = 0,
    match_percent = 85,
  } = explanation;

  // Normalized percentage for progress bar (scale roughly 0.0 -> 1.85)
  const progressPercent = Math.min(100, Math.max(15, Math.round((final_score / 1.85) * 100)));

  const getStrategyLabel = () => {
    switch (strategy) {
      case "hybrid_ncf":
        return { text: "NeuMF + Context", color: "bg-blue-500/20 text-blue-300 border-blue-500/40" };
      case "cosine_cross_sell":
        return { text: "Cosine Matrix 32D", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" };
      case "cold_start":
      default:
        return { text: "Cold-Start Rule", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" };
    }
  };

  const strat = getStrategyLabel();

  // Configure row 1 (Primary Model / Similarity Metric)
  const getRow1 = () => {
    if (strategy === "hybrid_ncf") {
      return {
        label: "Xác suất NeuMF (ŷ_ui):",
        value: Number(ncf_score).toFixed(3),
        color: "text-cyan-300",
      };
    }
    if (strategy === "cosine_cross_sell") {
      return {
        label: "Tương đồng Cosine 32D:",
        value: Number(cosine_score || ncf_score).toFixed(3),
        color: "text-emerald-300",
      };
    }
    // Cold-Start
    return {
      label: "Điểm Vector / Xu hướng:",
      value: Number(ncf_score).toFixed(3),
      color: "text-amber-300",
    };
  };

  // Configure row 2 (Context / Complementary Boost)
  const getRow2 = () => {
    if (strategy === "cosine_cross_sell") {
      return {
        label: "Bổ trợ cùng bộ môn:",
        value: `+${Number(context_boost).toFixed(3)}`,
        color: "text-emerald-300",
      };
    }
    return {
      label: "Trọng số ngữ cảnh:",
      value: `+${Number(context_boost).toFixed(3)}`,
      color: "text-blue-300",
    };
  };

  const row1 = getRow1();
  const row2 = getRow2();

  return (
    <div
      className={`rounded-xl bg-slate-950/95 border border-cyan-500/40 text-slate-100 p-2.5 shadow-xl shadow-cyan-950/30 backdrop-blur-md text-[11px] font-mono leading-tight space-y-2 select-none relative overflow-hidden ${className}`}
    >
      {/* Top Header: Strategy & Engine Name */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
        <div className="flex items-center gap-1.5">
          <Cpu size={13} className="text-cyan-400 shrink-0" />
          <span className="font-bold text-slate-300 tracking-wider uppercase text-[10px]">NCF Engine</span>
        </div>
        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${strat.color}`}>
          {strat.text}
        </span>
      </div>

      {/* Numerical Metrics Matrix - Exact 3 Addition Components */}
      <div className="space-y-1 text-slate-300">
        {/* Row 1: Model probability / Cosine similarity / Trend score */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400">{row1.label}</span>
          <span className={`font-bold tabular-nums ${row1.color}`}>
            {row1.value}
          </span>
        </div>

        {/* Row 2: Context / Complementary Boost */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400">{row2.label}</span>
          <span className={`font-bold tabular-nums ${row2.color}`}>
            {row2.value}
          </span>
        </div>

        {/* Row 3: Rating Score */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Điểm đánh giá sao:</span>
          <span className="font-bold text-amber-300 tabular-nums">
            +{Number(rating_score).toFixed(3)}
          </span>
        </div>
      </div>

      {/* Final Score Bar: Row 1 + Row 2 + Row 3 = Final Score */}
      <div className="pt-2 border-t border-slate-800">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="font-bold text-slate-300 text-[10px] uppercase tracking-wide">
            Final Score:
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-pink-400 font-bold tabular-nums">
              ({match_percent}%)
            </span>
            <span className="font-black text-sm text-cyan-300 tabular-nums tracking-wider">
              {Number(final_score).toFixed(3)}
            </span>
          </div>
        </div>

        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
