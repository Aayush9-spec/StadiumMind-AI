import React from "react";

function AIOrb() {
  return (
    <div className="flex items-center justify-center py-6 bg-slate-900/40 rounded-2xl border border-white/5 relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute w-36 h-36 rounded-full bg-indigo-500/10 blur-2xl animate-pulse" />

      {/* Orbit Container */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        
        {/* Outer Orbit Ring 1 */}
        <div className="absolute w-36 h-36 border border-indigo-400/20 rounded-full animate-[spin_12s_linear_infinite] flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full absolute -top-0.5 shadow-[0_0_8px_#818cf8]" />
          <div className="w-1 h-1 bg-indigo-300 rounded-full absolute -bottom-0.5 opacity-50" />
        </div>

        {/* Mid Orbit Ring 2 (Tilted counter-spin) */}
        <div className="absolute w-30 h-30 border border-purple-400/30 rounded-full animate-[spin_8s_linear_infinite_reverse] rotate-[30deg] flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-purple-300 rounded-full absolute -right-0.5 shadow-[0_0_8px_#c084fc]" />
        </div>

        {/* Inner Orbit Ring 3 (Faster spin) */}
        <div className="absolute w-24 h-24 border border-pink-400/10 rounded-full animate-[spin_5s_linear_infinite] rotate-[-45deg] flex items-center justify-center">
          <div className="w-1 h-1 bg-pink-300 rounded-full absolute -left-0.5 shadow-[0_0_6px_#f472b6]" />
        </div>

        {/* Center Glowing AI Sphere */}
        <div className="w-16 h-16 rounded-full relative flex items-center justify-center shadow-[0_0_35px_rgba(99,102,241,0.5)] animate-pulse">
          
          {/* Inner glass overlay & lighting */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-800 via-purple-600 to-cyan-400 opacity-90" />
          
          {/* Highlight shine */}
          <div className="absolute top-2 left-3 w-4 h-4 rounded-full bg-white/25 blur-[1px]" />
          <div className="absolute bottom-2 right-3 w-5 h-3 rounded-full bg-indigo-300/30 blur-[2px]" />
          
          {/* Radial depth overlay */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,transparent_30%,rgba(15,23,42,0.85))] mix-blend-multiply" />
        </div>

      </div>
    </div>
  );
}

export default React.memo(AIOrb);
