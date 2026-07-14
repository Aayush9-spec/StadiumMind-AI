import React from "react";
import { Users, Activity, Bus } from "lucide-react";

interface StatsCardProps {
  volunteersCount: number;
}

export default function StatsCard({ volunteersCount }: StatsCardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="glass-card p-4 flex items-center gap-3">
        <Users className="w-5 h-5 text-indigo-400" />
        <div>
          <span className="text-[9px] text-slate-400 uppercase font-semibold block">Active Volunteers</span>
          <strong className="text-sm text-white font-extrabold">{volunteersCount}</strong>
          <span className="text-[8px] text-emerald-400 block mt-0.5">↑ 96 on duty</span>
        </div>
      </div>

      <div className="glass-card p-4 flex items-center gap-3">
        <Activity className="w-5 h-5 text-emerald-450" />
        <div>
          <span className="text-[9px] text-slate-400 uppercase font-semibold block">Medical Teams</span>
          <strong className="text-sm text-white font-extrabold">24</strong>
          <span className="text-slate-450 text-[8px] block mt-0.5">On standby</span>
        </div>
      </div>

      <div className="glass-card p-4 flex items-center gap-3">
        <Bus className="w-5 h-5 text-blue-400" />
        <div>
          <span className="text-[9px] text-slate-400 uppercase font-semibold block">Shuttle Buses</span>
          <strong className="text-sm text-white font-extrabold">78</strong>
          <span className="text-[8px] text-emerald-400 block mt-0.5">↑ 12 active</span>
        </div>
      </div>

      <div className="glass-card p-4">
        <span className="text-[9px] text-slate-400 uppercase font-semibold block">Parking Occupancy</span>
        <div className="flex items-baseline gap-2 mt-1">
          <strong className="text-sm text-white font-extrabold">89%</strong>
          <span className="text-[8px] font-bold text-red-400 uppercase">High</span>
        </div>
      </div>

      <div className="glass-card p-4">
        <span className="text-[9px] text-slate-400 uppercase font-semibold block">Energy Usage</span>
        <div className="flex items-baseline gap-2 mt-1">
          <strong className="text-sm text-white font-extrabold">72%</strong>
          <span className="text-[8px] font-bold text-emerald-450 uppercase">Optimal</span>
        </div>
      </div>

      <div className="glass-card p-4">
        <span className="text-[9px] text-slate-400 uppercase font-semibold block">Waste Collected</span>
        <div className="flex items-baseline gap-2 mt-1">
          <strong className="text-sm text-white font-extrabold">4.2 tons</strong>
          <span className="text-[8px] font-bold text-emerald-400 uppercase">↑ 18% today</span>
        </div>
      </div>
    </div>
  );
}
