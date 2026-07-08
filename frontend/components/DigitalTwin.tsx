"use client";

import React, { useState } from "react";
import { Info, ShieldAlert, Users, Bus } from "lucide-react";

interface DigitalTwinProps {
  stadiumName: string;
  gateStatus: Record<string, { count: number; status: string }>;
  onSelectNode: (gateId: string) => void;
}

export default function DigitalTwin({ stadiumName, gateStatus, onSelectNode }: DigitalTwinProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Sectors mapping
  const sectors = [
    { id: "North", path: "M 100 50 Q 200 20 300 50 L 320 90 Q 200 65 80 90 Z", color: "rgba(59, 130, 246, 0.15)", name: "North Grandstands" },
    { id: "East", path: "M 300 50 Q 380 150 300 250 L 320 270 Q 400 150 320 30 Z", color: "rgba(168, 85, 247, 0.15)", name: "East Concourse" },
    { id: "South", path: "M 300 250 Q 200 280 100 250 L 80 210 Q 200 235 320 210 Z", color: "rgba(16, 185, 129, 0.15)", name: "South Egress Concourse" },
    { id: "West", path: "M 100 250 Q 20 150 100 50 L 80 30 Q 0 150 80 270 Z", color: "rgba(245, 158, 11, 0.15)", name: "West Gate Plaza" },
  ];

  // Gate Coordinates for SVG overlays
  const gates = [
    { id: "Gate A", cx: 200, cy: 40, name: "Gate A (Main North)" },
    { id: "Gate B", cx: 340, cy: 150, name: "Gate B (East Wing)" },
    { id: "Gate C", cx: 200, cy: 260, name: "Gate C (South Egress)" },
    { id: "Gate D", cx: 60, cy: 150, name: "Gate D (West Plaza)" },
  ];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/60 p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Interactive Digital Twin Model</h3>
          <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Live SVG Spatial Telemetry</p>
        </div>
        <span className="text-[10px] bg-slate-900 border border-slate-800 text-emerald-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          ACTIVE TWIN
        </span>
      </div>

      {/* SVG Canvas */}
      <div className="flex items-center justify-center">
        <svg viewBox="0 0 400 300" className="w-full max-w-md h-auto select-none">
          {/* Outer Stadium Rim */}
          <ellipse cx="200" cy="150" rx="160" ry="120" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="6" />
          <ellipse cx="200" cy="150" rx="140" ry="100" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" strokeDasharray="4 6" />

          {/* Sectors */}
          {sectors.map((sec) => (
            <path
              key={sec.id}
              d={sec.path}
              fill={sec.color}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1.5"
              className="cursor-pointer hover:fill-blue-500/10 transition-all duration-300"
              onMouseEnter={() => setHoveredNode(sec.name)}
              onMouseLeave={() => setHoveredNode(null)}
            />
          ))}

          {/* Playing Field (Azteca/SoFi Center Pitch) */}
          <ellipse cx="200" cy="150" rx="70" ry="45" fill="rgba(16, 185, 129, 0.08)" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1.5" />
          <ellipse cx="200" cy="150" rx="30" ry="20" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1" />

          {/* Transit Evacuation Line Overlays (glowing pathway) */}
          <path d="M 200 150 Q 250 200 200 260" fill="none" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="2.5" strokeDasharray="5 5" className="animate-pulse" />

          {/* Interactive Gate Nodes */}
          {gates.map((g) => {
            const status = gateStatus[g.id]?.status || "NORMAL";
            const color = status === "HIGH" ? "#ef4444" : status === "MEDIUM" ? "#f59e0b" : "#10b981";
            
            return (
              <g 
                key={g.id}
                className="cursor-pointer"
                onClick={() => onSelectNode(g.id)}
                onMouseEnter={() => setHoveredNode(`${g.name} - Inflow: ${gateStatus[g.id]?.count || 0}/hr`)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Glowing ring if high status */}
                {status === "HIGH" && (
                  <circle cx={g.cx} cy={g.cy} r={12} fill="none" stroke={color} strokeWidth={2} className="animate-ping" />
                )}
                <circle cx={g.cx} cy={g.cy} r={7} fill={color} stroke="#0f172a" strokeWidth={2} />
                <text x={g.cx} y={g.cy - 10} textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">
                  {g.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tooltip Overlay */}
      <div className="h-6 mt-4 flex items-center justify-center text-center">
        {hoveredNode ? (
          <span className="text-xs text-slate-300 font-semibold bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
            {hoveredNode}
          </span>
        ) : (
          <span className="text-[10px] text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" /> Hover over stadium sectors or gate nodes to view status
          </span>
        )}
      </div>

    </div>
  );
}
