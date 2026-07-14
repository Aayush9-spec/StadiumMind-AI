import React from "react";

interface StatusBadgeProps {
  status: "ONLINE" | "LIVE" | "CONNECTED" | "ACTIVE";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-emerald-400">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <span>{status}</span>
    </div>
  );
}
