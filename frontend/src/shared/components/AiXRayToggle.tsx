"use client";

import { Search } from "lucide-react";
import { useAiXRayStore } from "@/shared/store/aiXRayStore";
import { useHydrated } from "@/shared/hooks/useHydrated";

interface AiXRayToggleProps {
  className?: string;
  size?: "sm" | "md";
}

export default function AiXRayToggle({ className = "", size = "md" }: AiXRayToggleProps) {
  const { isXRayActive, toggleXRay } = useAiXRayStore();
  const mounted = useHydrated();

  if (!mounted) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-500 text-xs font-semibold ${className}`}>
        <Search size={14} className="text-slate-400" />
        <span>🔍 AI X-Ray: Tắt</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleXRay}
      title={isXRayActive ? "Tắt chế độ AI X-Ray soi điểm số thuật toán" : "Bật chế độ AI X-Ray soi điểm số thuật toán NCF"}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold transition-all shadow-sm cursor-pointer select-none border ${
        isXRayActive
          ? "bg-slate-900 text-cyan-300 border-cyan-500/60 shadow-cyan-500/20 shadow-md ring-2 ring-cyan-400/30"
          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
      } ${size === "sm" ? "text-[11px] py-1 px-2.5" : "text-xs"} ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <Search size={size === "sm" ? 12 : 14} className={isXRayActive ? "text-cyan-400" : "text-slate-500"} />
        {isXRayActive && (
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
        )}
      </div>

      <span className="tracking-wide">AI X-Ray:</span>

      <span
        className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-extrabold tracking-wider ${
          isXRayActive
            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {isXRayActive ? "BẬT" : "TẮT"}
      </span>
    </button>
  );
}
