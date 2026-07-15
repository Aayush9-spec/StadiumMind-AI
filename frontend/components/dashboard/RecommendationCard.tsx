import React from "react";

interface RecommendationCardProps {
  approvals: Record<string, { status: string; impact: string; confidence: string }>;
  onApprove: (actionKey: string, status: string) => void;
  onApproveAll: () => void;
}

export default function RecommendationCard({ approvals, onApprove, onApproveAll }: RecommendationCardProps) {
  return (
    <div className="space-y-3">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">AI Recommended Actions</span>
      
      <div className="space-y-2">
        {Object.keys(approvals).map((actName) => {
          const details = approvals[actName];
          return (
            <div key={actName} className="p-3 bg-slate-900/60 border border-white/10 rounded-xl flex items-center justify-between shadow-sm">
              <div className="min-w-0 flex-1 pr-2">
                <strong className="text-xs text-white block truncate">{actName}</strong>
                <p className="text-[9px] text-slate-400">Impact: {details.impact} • {details.confidence} confidence</p>
              </div>
              
              <div>
                {details.status === "PENDING" ? (
                  <button 
                    onClick={() => onApprove(actName, "APPROVED")}
                    className="py-1 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold uppercase transition cursor-pointer"
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
