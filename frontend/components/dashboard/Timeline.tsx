import React from "react";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

interface TimelineItem {
  id: number;
  time: string;
  title: string;
  detail: string;
  severity?: string;
}

interface TimelineProps {
  timeline: TimelineItem[];
}

export default function Timeline({ timeline }: TimelineProps) {
  return (
    <div className="glass-card p-6 flex flex-col h-[350px]">
      <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Live Incident Timeline</h3>
        <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-bold">Active Feed</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {timeline.map((item) => {
          const isRed = item.severity === "high" || item.title.toLowerCase().includes("emergency") || item.title.toLowerCase().includes("alert");
          const isGreen = item.title.toLowerCase().includes("approved") || item.title.toLowerCase().includes("sustainability");
          
          return (
            <div key={item.id} className="flex gap-3 text-xs items-start">
              <div className="mt-0.5">
                {isRed ? (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                ) : isGreen ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Info className="w-4 h-4 text-indigo-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <strong className="text-slate-100 font-bold block truncate">{item.title}</strong>
                  <span className="text-[9px] text-slate-450 font-mono whitespace-nowrap pl-2">{item.time}</span>
                </div>
                <p className="text-slate-350 text-[10px] mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
