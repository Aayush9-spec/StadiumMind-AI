import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Line } from "recharts";

interface CrowdForecastChartProps {
  data: any[];
}

export default function CrowdForecastChart({ data }: CrowdForecastChartProps) {
  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xs font-bold text-slate-200">Crowd Flow vs Forecast</h3>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Real-time simulation overlay</p>
        </div>
        <span className="text-[10px] bg-slate-900/60 border border-white/10 text-slate-400 px-2.5 py-1 rounded-full font-bold uppercase">Real-time</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
            <XAxis dataKey="time" stroke="rgba(255, 255, 255, 0.4)" fontSize={10} />
            <YAxis stroke="rgba(255, 255, 255, 0.4)" fontSize={10} />
            <Tooltip contentStyle={{ backgroundColor: "#0b1530", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", color: "#F8FAFC" }} />
            <Area type="monotone" dataKey="Flow" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFlow)" />
            <Line type="monotone" dataKey="Forecast" stroke="#818cf8" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
