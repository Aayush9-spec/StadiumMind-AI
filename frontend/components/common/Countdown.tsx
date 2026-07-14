import React from "react";

export default function Countdown() {
  return (
    <div className="flex items-center gap-1 text-slate-200 font-mono font-bold text-xs">
      <span className="bg-slate-950/80 px-1.5 py-0.5 rounded border border-white/5 text-white">00</span>
      <span className="text-slate-500 animate-pulse">:</span>
      <span className="bg-slate-950/80 px-1.5 py-0.5 rounded border border-white/5 text-white">18</span>
      <span className="text-slate-500 animate-pulse">:</span>
      <span className="bg-slate-950/80 px-1.5 py-0.5 rounded border border-white/5 text-white">24</span>
    </div>
  );
}
