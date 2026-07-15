"use client";

import React, { useState } from "react";
import { 
  Info, Shield, User, MapPin, Eye, Plus, Minus, Maximize2, 
  Activity, Users, Bus, Car, Flame, HelpCircle
} from "lucide-react";

interface DigitalTwinProps {
  stadiumName: string;
  gateStatus: Record<string, { count: number; status: string; percentage: number }>;
  onSelectNode: (gateId: string) => void;
}

export default function DigitalTwin({ stadiumName, gateStatus, onSelectNode }: DigitalTwinProps) {
  const [activeFilter, setActiveFilter] = useState("density");
  const [viewMode, setViewMode] = useState("3D");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedOverlay, setSelectedOverlay] = useState("GATES");

  // Heatmap bands / sectors matching the concentric rings in the first image
  const gates = [
    { id: "Gate A", cx: 120, cy: 90, label: "Gate A", percentage: 72, status: "MEDIUM", color: "#F59E0B" },
    { id: "Gate B", cx: 280, cy: 80, label: "Gate B", percentage: 48, status: "NORMAL", color: "#16A34A" },
    { id: "Gate C", cx: 330, cy: 170, label: "Gate C", percentage: 92, status: "HIGH", color: "#EF4444" },
    { id: "Gate D", cx: 290, cy: 230, label: "Gate D", percentage: 61, status: "MEDIUM", color: "#F59E0B" },
    { id: "Gate E", cx: 100, cy: 200, label: "Gate E", percentage: 35, status: "NORMAL", color: "#16A34A" },
  ];

  // Additional point markers matching the first image
  const pinMarkers = [
    { type: "volunteers", cx: 160, cy: 110, color: "#3B82F6", icon: "volunteers" },
    { type: "volunteers", cx: 230, cy: 95, color: "#3B82F6", icon: "volunteers" },
    { type: "medical", cx: 180, cy: 235, color: "#EF4444", icon: "medical" },
    { type: "medical", cx: 195, cy: 250, color: "#EF4444", icon: "medical" },
    { type: "metro", cx: 270, cy: 120, color: "#F59E0B", icon: "metro" },
    { type: "metro", cx: 150, cy: 190, color: "#F59E0B", icon: "metro" },
    { type: "parking", cx: 295, cy: 220, color: "#8B5CF6", icon: "parking" },
  ];

  return (
    <div className="glass-card !p-0 overflow-hidden relative border border-white/10 rounded-2xl shadow-2xl">
      
      {/* Header bar from 1st image */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">05</span>
          <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest">Stadium Digital Twin</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-emerald-450 font-black uppercase tracking-wider">LIVE</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[460px]">
        
        {/* Left operations category sidebar from 1st image */}
        <div className="w-full lg:w-48 bg-slate-950/40 border-r border-white/5 p-4 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {[
            { id: "GATES", label: "Gates", color: "text-emerald-400 bg-emerald-500/10", icon: <Bus className="w-3.5 h-3.5" /> },
            { id: "MEDICAL", label: "Medical", color: "text-red-400 bg-red-500/10", icon: <Activity className="w-3.5 h-3.5" /> },
            { id: "VOLUNTEERS", label: "Volunteers", color: "text-blue-450 bg-blue-500/10", icon: <Users className="w-3.5 h-3.5" /> },
            { id: "PARKING", label: "Parking", color: "text-purple-400 bg-purple-500/10", icon: <Car className="w-3.5 h-3.5" /> },
            { id: "METRO", label: "Metro", color: "text-amber-500 bg-amber-500/10", icon: <Bus className="w-3.5 h-3.5" /> },
            { id: "FOOD COURT", label: "Food Court", color: "text-amber-400 bg-amber-500/10", icon: <Flame className="w-3.5 h-3.5" /> },
            { id: "SECURITY", label: "Security", color: "text-blue-400 bg-blue-500/10", icon: <Shield className="w-3.5 h-3.5" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedOverlay(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedOverlay === item.id 
                  ? "bg-white/10 text-white border border-white/10 shadow-sm" 
                  : "text-slate-400 hover:text-white border border-transparent"
              }`}
            >
              <div className={`p-1.5 rounded-lg ${item.color}`}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Central interactive map panel */}
        <div className="flex-1 relative bg-slate-950/60 p-4 flex flex-col justify-between overflow-hidden">
          
          {/* Main Visual Arena Canvas */}
          <div className="flex-1 flex items-center justify-center relative min-h-[340px]">
            <svg 
              viewBox="0 0 400 300" 
              className="w-full max-w-lg h-auto select-none transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <defs>
                {/* Heatmap overlay gradients matching the 1st image */}
                <radialGradient id="heat-c" cx="80%" cy="55%" r="40%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="heat-a" cx="25%" cy="30%" r="35%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="stadium-radial" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.25" />
                  <stop offset="70%" stopColor="#081026" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#020617" stopOpacity="1" />
                </radialGradient>
              </defs>

              {/* Realistic layout of the surrounding concourse layout and roads */}
              <ellipse cx="200" cy="150" rx="190" ry="140" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="8" />
              <ellipse cx="200" cy="150" rx="170" ry="120" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" strokeDasharray="3 5" />

              {/* Heatmap Layer - Colorful concentric ring gradients matching the 1st image */}
              <ellipse cx="200" cy="150" rx="160" ry="112" fill="none" stroke="url(#heat-c)" strokeWidth="48" opacity="0.85" />
              <ellipse cx="200" cy="150" rx="140" ry="98" fill="none" stroke="url(#heat-a)" strokeWidth="32" opacity="0.7" />

              {/* Stadium Concourse Rings */}
              <ellipse cx="200" cy="150" rx="135" ry="95" fill="url(#stadium-radial)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.5" />
              
              {/* Individual stand rows */}
              <ellipse cx="200" cy="150" rx="122" ry="84" fill="none" stroke="rgba(37, 99, 235, 0.25)" strokeWidth="5" />
              <ellipse cx="200" cy="150" rx="110" ry="74" fill="none" stroke="rgba(30, 58, 138, 0.4)" strokeWidth="6" />
              <ellipse cx="200" cy="150" rx="98" ry="64" fill="none" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="4" />

              {/* Pitch Rim */}
              <ellipse cx="200" cy="150" rx="80" ry="50" fill="#081430" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

              {/* Realistic Football Pitch Green Texture */}
              <rect x="156" y="121" width="88" height="58" rx="2" fill="#0f5132" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <line x1="200" y1="121" x2="200" y2="179" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <circle cx="200" cy="150" r="14" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <rect x="156" y="132" width="14" height="36" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <rect x="230" y="132" width="14" height="36" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

              {/* Point Markers pins matching the 1st image */}
              {pinMarkers.map((pin, idx) => (
                <g key={idx} className="cursor-pointer hover:scale-110 transition-transform">
                  <circle cx={pin.cx} cy={pin.cy} r={7} fill={pin.color} stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx={pin.cx} cy={pin.cy} r={2} fill="#FFFFFF" />
                </g>
              ))}

              {/* Gates labels & markers matching the 1st image */}
              {gates.map((g) => {
                const currentStatus = gateStatus[g.id]?.status || g.status;
                const percentage = gateStatus[g.id]?.percentage || g.percentage;
                const color = currentStatus === "HIGH" ? "#EF4444" : currentStatus === "MEDIUM" ? "#F59E0B" : "#16A34A";
                
                return (
                  <g 
                    key={g.id} 
                    className="cursor-pointer"
                    onClick={() => onSelectNode(g.id)}
                  >
                    {/* Pulsing indicator for active high areas */}
                    {currentStatus === "HIGH" && (
                      <circle cx={g.cx} cy={g.cy} r={14} fill="none" stroke={color} strokeWidth={1.5} className="animate-ping" />
                    )}

                    {/* Leader Line Pin */}
                    <line x1={g.cx} y1={g.cy} x2={g.cx} y2={g.cy - 12} stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />

                    {/* Pill label box */}
                    <rect 
                      x={g.cx - 24} 
                      y={g.cy - 24} 
                      width="48" 
                      height="16" 
                      rx="3" 
                      fill="rgba(15, 23, 42, 0.85)" 
                      stroke="rgba(255, 255, 255, 0.15)" 
                      strokeWidth="1" 
                    />
                    <text x={g.cx} y={g.cy - 17} textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="bold">
                      {g.label}
                    </text>
                    <text x={g.cx} y={g.cy - 10} textAnchor="middle" fill={color} fontSize="6.5" fontWeight="black">
                      {percentage}%
                    </text>

                    {/* Small pin anchor */}
                    <circle cx={g.cx} cy={g.cy} r={4.5} fill={color} stroke="#FFFFFF" strokeWidth="1.2" />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Floating Right Map Controls (3D, Layers, Zoom, Fullscreen) from 1st image */}
          <div className="absolute right-4 top-4 flex flex-col gap-1.5 bg-slate-950/80 border border-white/10 rounded-xl p-1 shadow-lg z-20">
            <button 
              onClick={() => setViewMode(viewMode === "3D" ? "2D" : "3D")}
              className={`w-7 h-7 flex items-center justify-center rounded-lg text-[9px] font-black transition cursor-pointer ${
                viewMode === "3D" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              3D
            </button>
            <button aria-label="Decrease zoom" className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white transition cursor-pointer">
              <Eye className="w-3.5 h-3.5" />
            </button>
            <div className="w-full h-[1px] bg-white/10" />
            <button 
              onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 1.5))}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.8))}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button aria-label="Switch map layer" className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white transition cursor-pointer">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Toolbar Selector Tabs from 1st image */}
          <div className="w-full flex justify-center mt-2 z-10">
            <div className="flex gap-1.5 bg-slate-950/80 border border-white/10 rounded-full p-1 shadow-lg">
              {[
                { id: "density", label: "Crowd Density" },
                { id: "flow", label: "Flow Direction" },
                { id: "incidents", label: "Incidents" },
                { id: "volunteers", label: "Volunteers" },
                { id: "facilities", label: "Facilities ▾" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition cursor-pointer ${
                    activeFilter === tab.id 
                      ? "bg-gradient-to-r from-indigo-650 to-indigo-705 text-white" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
