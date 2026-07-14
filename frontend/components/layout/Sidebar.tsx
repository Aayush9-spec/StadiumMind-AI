import React from "react";
import { 
  LayoutDashboard, Compass, BrainCircuit, Users, Bus, 
  ShieldAlert, Heart, Zap, Shield, Accessibility,
  BarChart4, HelpCircle, CalendarRange, FileText, Activity
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-full lg:w-60 flex-shrink-0 space-y-4">
      
      {/* Main Operations Navigation Panel */}
      <div className="glass-card p-4 space-y-4 border border-white/10 rounded-2xl bg-slate-950/40 backdrop-blur-md">
        
        {/* Active Command button */}
        <button
          onClick={() => setActiveTab("overview")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === "overview"
              ? "bg-gradient-to-r from-indigo-650 to-indigo-705 text-white shadow-lg shadow-indigo-500/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Overview Command
        </button>

        {/* OPERATIONS Segment */}
        <div className="space-y-1">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4 block pb-1">Operations</span>
          
          {[
            { id: "crowd", label: "Digital Twin & Map", icon: <Compass className="w-4 h-4" /> },
            { id: "commander", label: "AI Commander", icon: <BrainCircuit className="w-4 h-4" />, badge: "AI" },
            { id: "intelligence", label: "Crowd Intelligence", icon: <Users className="w-4 h-4" /> },
            { id: "transportation", label: "Transportation", icon: <Bus className="w-4 h-4" /> },
            { id: "emergency", label: "Emergency & EMS", icon: <ShieldAlert className="w-4 h-4" /> },
            { id: "volunteer", label: "Volunteer Management", icon: <Heart className="w-4 h-4" /> },
            { id: "sustainability", label: "Sustainability", icon: <Zap className="w-4 h-4" /> },
            { id: "security", label: "Security & Access", icon: <Shield className="w-4 h-4" /> },
            { id: "accessibility", label: "Accessibility", icon: <Accessibility className="w-4 h-4" /> },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === link.id
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                {link.icon}
                <span className="truncate">{link.label}</span>
              </div>
              {link.badge && (
                <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {link.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ANALYTICS & TOOLS Segment */}
        <div className="space-y-1">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4 block pb-1">Analytics & Tools</span>
          
          {[
            { id: "reports", label: "Reports & Analytics", icon: <BarChart4 className="w-4 h-4" /> },
            { id: "simulation", label: "Simulation Center", icon: <HelpCircle className="w-4 h-4" /> },
            { id: "timeline", label: "Incident Timeline", icon: <CalendarRange className="w-4 h-4" /> },
            { id: "documents", label: "Document Center", icon: <FileText className="w-4 h-4" /> },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === link.id
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.icon}
              <span className="truncate">{link.label}</span>
            </button>
          ))}
        </div>

      </div>

      {/* AI Assistant card with Orb & Waveform */}
      <div className="glass-card p-4 border border-white/10 rounded-2xl bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center flex-shrink-0 animate-pulse">
            <BrainCircuit className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[10px] font-black text-white leading-none">AI Assistant</h4>
            <p className="text-[8px] text-slate-400 font-bold truncate mt-1">StadiumMind AI</p>
          </div>
        </div>
        
        {/* Waveform graphic */}
        <div className="flex items-center gap-0.5 h-6">
          <span className="w-[2px] bg-indigo-500 rounded animate-[bounce_0.8s_infinite] h-3" />
          <span className="w-[2px] bg-cyan-400 rounded animate-[bounce_1.2s_infinite] h-5" />
          <span className="w-[2px] bg-indigo-500 rounded animate-[bounce_0.9s_infinite] h-4" />
          <span className="w-[2px] bg-cyan-400 rounded animate-[bounce_1.1s_infinite] h-2" />
        </div>
      </div>

      {/* Connected feed status pill */}
      <div className="glass-card px-4 py-3 border border-white/10 rounded-2xl bg-slate-950/40 flex justify-between items-center text-[10px] text-slate-400 font-bold">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Dallas Venue Feed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Connected</span>
        </div>
      </div>

    </aside>
  );
}
