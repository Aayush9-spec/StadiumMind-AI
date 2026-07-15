import React from "react";
import { BrainCircuit, Sun, Moon, Mic, User } from "lucide-react";
import MatchCard from "../common/MatchCard";
import Countdown from "../common/Countdown";
import WeatherCard from "../common/WeatherCard";

interface NavbarProps {
  isListening: boolean;
  highContrast: boolean;
  onToggleContrast: () => void;
  onVoiceClick: () => void;
}

export default function Navbar({
  isListening,
  highContrast,
  onToggleContrast,
  onVoiceClick
}: NavbarProps) {
  return (
    <header className="border-b border-white/5 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="w-full px-4 md:px-8 lg:px-12 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#4F46E5] rounded-xl shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-[15px] font-black tracking-tight flex items-center gap-1.5 text-white leading-none">
              StadiumMind OS - FIFA World Cup 2026
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 tracking-wider">ENTERPRISE</span>
            </h1>
            <p className="text-[8px] text-slate-400 font-bold tracking-wider uppercase mt-1">
              FIFA World Cup 2026 Operations
            </p>
          </div>
        </div>

        {/* Next Match Telemetry */}
        <div className="flex items-center gap-6 bg-slate-900/40 border border-white/5 rounded-xl px-4 py-1.5 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Next Match</span>
            <MatchCard />
          </div>
          
          <div className="h-6 w-[1px] bg-white/10" />

          <div className="flex items-center gap-2">
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Kickoff In</span>
            <Countdown />
          </div>
        </div>

        {/* Right Side System Badges & Actions */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-[10px] text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>All Systems Operational</span>
          </div>

          <WeatherCard />

          <select 
            id="header-lang-selector"
            aria-label="Select Language"
            className="bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-[10px] text-white outline-none focus:ring-1 focus:ring-indigo-500/30 transition cursor-pointer"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>

          <button
            onClick={onToggleContrast}
            aria-label="Toggle High Contrast Mode"
            className="p-1.5 rounded-xl border border-white/5 bg-slate-900 text-slate-400 hover:text-white transition cursor-pointer shadow-sm"
          >
            {highContrast ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onVoiceClick}
            aria-label={isListening ? "Stop listening to microphone" : "Start listening to microphone"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition duration-300 text-[10px] uppercase tracking-wider cursor-pointer ${
              isListening 
                ? "bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/20" 
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20"
            }`}
          >
            <Mic className="w-3 h-3" />
            <span>{isListening ? "Listening..." : "Voice AI"}</span>
          </button>

          {/* Ops Admin profile */}
          <div className="flex items-center gap-2 pl-3 border-l border-white/10">
            <div className="p-1 bg-slate-900 border border-white/10 rounded-full">
              <User className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[10px] font-bold text-white leading-none">Ops Admin</p>
              <p className="text-[7px] text-slate-400 font-semibold uppercase mt-0.5">Administrator</p>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
