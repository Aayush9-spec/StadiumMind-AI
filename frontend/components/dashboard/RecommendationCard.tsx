import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface RecommendationCardProps {
  approvals: Record<string, { status: string; impact: string; confidence: string }>;
  onApprove: (actionKey: string, status: string) => void;
  onApproveAll: () => void;
}

const explanations: Record<string, { why: string[]; impact: string; confidence: string }> = {
  "Open Gate D": {
    why: [
      "Crowd density at Gate C is critical (exceeding 92%).",
      "Weather forecast predicts heavy rain in 30 minutes.",
      "Historical egress patterns indicate Gate D Concourse is currently clear."
    ],
    impact: "Estimated 37% congestion reduction at Gate C.",
    confidence: "98%"
  },
  "Dispatch 8 Volunteers": {
    why: [
      "Congestion at Gate C requires active physical routing support.",
      "Identified 8 unassigned volunteers in Zone A corridor.",
      "Spanish-speaking fans requested assistance near Gate C."
    ],
    impact: "Faster resolution of localized fan queries.",
    confidence: "95%"
  },
  "Delay Fireworks": {
    why: [
      "Egress peak is delayed due to Metro Line 2 headway lag.",
      "High wind speeds detected (above safety threshold).",
      "Requires safety buffer for mass crowd dispersion."
    ],
    impact: "Prevented safety risks due to combined wind/crowd egress.",
    confidence: "89%"
  }
};

export default function RecommendationCard({ approvals, onApprove, onApproveAll }: RecommendationCardProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (actName: string) => {
    setExpanded((prev) => ({
      ...prev,
      [actName]: !prev[actName]
    }));
  };

  return (
    <div className="space-y-3">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">AI Recommended Actions</span>
      
      <div className="space-y-2">
        {Object.keys(approvals).map((actName) => {
          const details = approvals[actName];
          const explanation = explanations[actName] || {
            why: ["Operational real-time decision support anomaly triggered."],
            impact: "Improved system throughput.",
            confidence: details.confidence
          };
          const isExpanded = !!expanded[actName];

          return (
            <div key={actName} className="p-3 bg-slate-900/60 border border-white/10 rounded-xl shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-2">
                  <strong className="text-xs text-white block truncate">{actName}</strong>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[8px] text-slate-400">Impact: {details.impact}</span>
                    <span className="text-[8px] px-1 rounded-md bg-indigo-500/10 text-indigo-350 border border-indigo-500/20 font-bold">
                      {explanation.confidence} Conf.
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleExpand(actName)}
                    className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
                    aria-label="Toggle explanation"
                  >
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {details.status === "PENDING" ? (
                    <button 
                      onClick={() => onApprove(actName, "APPROVED")}
                      className="py-1 px-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold uppercase transition cursor-pointer"
                    >
                      Approve
                    </button>
                  ) : (
                    <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                      Approved
                    </span>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="pt-2 border-t border-white/5 text-[9px] text-slate-300 space-y-1.5 animate-fadeIn">
                  <span className="font-bold text-slate-400 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-indigo-400" />
                    Why did AI recommend this?
                  </span>
                  <ul className="list-disc pl-3.5 space-y-1 text-slate-400">
                    {explanation.why.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                  <div className="text-[8.5px] text-indigo-300 font-semibold bg-indigo-500/5 p-1.5 rounded-lg border border-indigo-500/10">
                    Expected Impact: {explanation.impact}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button 
        onClick={onApproveAll}
        className="w-full mt-2 py-2.5 bg-indigo-650 hover:bg-indigo-755 text-white transition rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
      >
        Approve All Recommendations
      </button>
    </div>
  );
}
