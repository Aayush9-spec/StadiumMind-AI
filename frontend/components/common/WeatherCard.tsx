import React from "react";
import { CloudRain } from "lucide-react";

export default function WeatherCard() {
  return (
    <div className="flex items-center gap-1.5 bg-slate-900/40 border border-white/5 px-2.5 py-1.5 rounded-xl text-[10px] text-slate-300">
      <CloudRain className="w-3.5 h-3.5 text-blue-400" />
      <span className="font-bold">18.9°C</span>
    </div>
  );
}
