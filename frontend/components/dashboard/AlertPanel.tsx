import React from "react";

export default function AlertPanel() {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
        <span>Critical Alerts</span>
        <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full font-black text-[9px] border border-red-500/20">3</span>
      </div>

      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1">
        <p className="text-xs font-bold text-red-400">Gate C Overcrowding</p>
        <p className="text-[10px] text-red-350">Risk Level: High • 2 min ago</p>
      </div>
      
      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
        <p className="text-xs font-bold text-amber-400">Heavy Rain Incoming</p>
        <p className="text-[10px] text-amber-350">ETA: 32 minutes • 5 min ago</p>
      </div>

      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-1">
        <p className="text-xs font-bold text-blue-400">Metro Line 2 Delay</p>
        <p className="text-[10px] text-blue-350">Line 2: 8 min delay • 7 min ago</p>
      </div>
    </div>
  );
}
