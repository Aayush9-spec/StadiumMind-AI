import React from "react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface MetricCardProps {
  title: string;
  value: string;
  badgeText: string;
  badgeStyle: "red" | "emerald" | "blue" | "indigo";
  trendText: string;
  accentColor: "red" | "emerald" | "blue" | "indigo";
  sparklineData?: { val: number }[];
  sparklineColor?: string;
  icon?: React.ReactNode;
}

export default function MetricCard({
  title,
  value,
  badgeText,
  badgeStyle,
  trendText,
  accentColor,
  sparklineData,
  sparklineColor,
  icon
}: MetricCardProps) {
  const borderClass = {
    red: "border-t-red-500",
    emerald: "border-t-emerald-500",
    blue: "border-t-blue-500",
    indigo: "border-t-indigo-500"
  }[accentColor];

  const badgeClass = {
    red: "text-red-400 bg-red-500/10 border-red-500/20",
    emerald: "text-emerald-450 bg-emerald-500/10 border-emerald-500/20",
    blue: "text-blue-450 bg-blue-500/10 border-blue-500/20",
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
  }[badgeStyle];

  return (
    <div className={`glass-card p-6 border-t-2 ${borderClass}`}>
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{title}</span>
          <h4 className="text-lg font-black text-slate-100">{value}</h4>
          <span className={`inline-block mt-2.5 text-[9px] font-black border px-2 py-0.5 rounded-full ${badgeClass}`}>
            {badgeText}
          </span>
          <span className="text-[9px] text-slate-450 block mt-1.5">{trendText}</span>
        </div>
        {sparklineData ? (
          <div className="w-16 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <Area type="monotone" dataKey="val" stroke={sparklineColor} fill="transparent" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          icon
        )}
      </div>
    </div>
  );
}
