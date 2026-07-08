"use client";

import React, { useState } from "react";
import { Info, ShieldAlert, Users, Compass } from "lucide-react";

interface DigitalTwinProps {
  stadiumName: string;
  gateStatus: Record<string, { count: number; status: string; percentage: number }>;
  onSelectNode: (gateId: string) => void;
}

export default function DigitalTwin({ stadiumName, gateStatus, onSelectNode }: DigitalTwinProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("density");

  const sectors = [
    { id: "North", path: "M 100 50 Q 200 20 300 50 L 320 90 Q 200 65 80 90 Z", color: "rgba(245, 158, 11, 0.15)", name: "North Sector (Gate B)" },
    { id: "East", path: "M 300 50 Q 380 150 300 250 L 320 270 Q 400 150 320 30 Z", color: "rgba(239, 68, 68, 0.15)", name: "East Sector (Gate C)" },
    { id: "South", path: "M 300 250 Q 200 280 100 250 L 80 210 Q 200 235 320 210 Z", color: "rgba(245, 158, 11, 0.15)", name: "South Sector (Gate D)" },
    { id: "West", path: "M 100 250 Q 20 150 100 50 L 80 30 Q 0 150 80 270 Z", color: "rgba(16, 185, 129, 0.12)", name: "West Sector (Gate E & A)" },
  ];

  const gates = [
    { id: "Gate A", cx: 100, cy: 90, label: "Gate A", percentage: 72, status: "MEDIUM" },
    { id: "Gate B", cx: 280, cy: 80, label: "Gate B", percentage: 48, status: "NORMAL" },
    { id: "Gate C", cx: 330, cy: 160, label: "Gate C", percentage: 92, status: "HIGH" },
    { id: "Gate D", cx: 270, cy: 220, label: "Gate D", percentage: 61, status: "MEDIUM" },
    { id: "Gate E", cx: 90, cy: 200, label: "Gate E", percentage: 35, status: "NORMAL" },
  ];

  return (
    <div className="bg-white border border-[#E8ECF4] rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-sm font-bold text-[#111827]">Stadium Digital Twin</h3>
          <span className="text-[10px] bg-[#16A34A]/10 text-[#16A34A] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping" />
            Live
          </span>
        </div>
        
        {/* Toggle Pills */}
        <div className="flex flex-wrap gap-1.5">
          <button 
            onClick={() => setActiveFilter("density")}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
              activeFilter === "density" ? "bg-[#4F46E5] text-white" : "bg-[#F7F8FC] text-[#6B7280] hover:bg-slate-100"
            }`}
          >
            Crowd Density
          </button>
          <button 
            onClick={() => setActiveFilter("flow")}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
              activeFilter === "flow" ? "bg-[#4F46E5] text-white" : "bg-[#F7F8FC] text-[#6B7280] hover:bg-slate-100"
            }`}
          >
            Flow Direction
          </button>
          <button 
            onClick={() => setActiveFilter("volunteers")}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
              activeFilter === "volunteers" ? "bg-[#4F46E5] text-white" : "bg-[#F7F8FC] text-[#6B7280] hover:bg-slate-100"
            }`}
          >
            Volunteers
          </button>
        </div>
      </div>

      {/* Map Content */}
      <div className="relative border border-[#E8ECF4] bg-[#F7F8FC] rounded-xl p-4 flex items-center justify-center">
        <svg viewBox="0 0 400 300" className="w-full max-w-md h-auto select-none">
          {/* Outer Ring */}
          <ellipse cx="200" cy="150" rx="160" ry="120" fill="none" stroke="#E8ECF4" strokeWidth="6" />
          <ellipse cx="200" cy="150" rx="140" ry="100" fill="none" stroke="#E8ECF4" strokeWidth="2" strokeDasharray="4 6" />

          {/* Sector Overlays */}
          {sectors.map((sec) => (
            <path
              key={sec.id}
              d={sec.path}
              fill={sec.color}
              stroke="#E8ECF4"
              strokeWidth="1.5"
              className="cursor-pointer hover:opacity-85 transition"
              onMouseEnter={() => setHoveredNode(`${sec.name}`)}
              onMouseLeave={() => setHoveredNode(null)}
            />
          ))}

          {/* Stadium Pitch */}
          <ellipse cx="200" cy="150" rx="70" ry="45" fill="rgba(22, 163, 74, 0.05)" stroke="rgba(22, 163, 74, 0.2)" strokeWidth="1.5" />
          <ellipse cx="200" cy="150" rx="30" ry="20" fill="none" stroke="rgba(22, 163, 74, 0.1)" strokeWidth="1" />

          {/* Flow Directions */}
          {activeFilter === "flow" && (
            <path d="M 200 150 Q 250 200 200 260" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeDasharray="5 5" className="animate-pulse" />
          )}

          {/* Gates */}
          {gates.map((g) => {
            const currentStatus = gateStatus[g.id]?.status || g.status;
            const percentage = gateStatus[g.id]?.percentage || g.percentage;
            const color = currentStatus === "HIGH" ? "#EF4444" : currentStatus === "MEDIUM" ? "#F59E0B" : "#16A34A";
            
            return (
              <g 
                key={g.id}
                className="cursor-pointer"
                onClick={() => onSelectNode(g.id)}
                onMouseEnter={() => setHoveredNode(`${g.label}: ${percentage}% Capacity`)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {currentStatus === "HIGH" && (
                  <circle cx={g.cx} cy={g.cy} r={12} fill="none" stroke={color} strokeWidth={2} className="animate-ping" />
                )}
                <circle cx={g.cx} cy={g.cy} r={8} fill={color} stroke="#FFFFFF" strokeWidth={2} />
                <text x={g.cx} y={g.cy - 12} textAnchor="middle" fill="#111827" fontSize="8" fontWeight="bold">
                  {g.label} ({percentage}%)
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="h-6 mt-4 flex items-center justify-center text-center">
        {hoveredNode ? (
          <span className="text-xs text-[#111827] font-semibold bg-white border border-[#E8ECF4] px-3 py-1 rounded-lg shadow-sm">
            {hoveredNode}
          </span>
        ) : (
          <span className="text-[10px] text-[#6B7280] uppercase tracking-wide flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" /> Click gates or hover over sectors to inspect
          </span>
        )}
      </div>
    </div>
  );
}
