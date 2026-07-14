import React from "react";

export default function MatchCard() {
  return (
    <div className="flex items-center gap-3 font-bold text-white">
      <span>Mexico</span>
      <span className="text-base leading-none">🇲🇽</span>
      <span className="text-slate-400 text-[10px]">vs</span>
      <span>Japan</span>
      <span className="text-base leading-none">🇯🇵</span>
    </div>
  );
}
