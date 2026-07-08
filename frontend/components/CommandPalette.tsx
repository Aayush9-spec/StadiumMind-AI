"use client";

import React, { useState, useEffect } from "react";
import { Search, Terminal, AlertTriangle, Compass, Zap, ShieldAlert, X } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
  onTriggerEmergency: () => void;
}

export default function CommandPalette({ isOpen, onClose, onSelectTab, onTriggerEmergency }: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const commands = [
    { name: "Overview Dashboard", category: "Navigation", icon: <Terminal className="w-4 h-4" />, action: () => onSelectTab("overview") },
    { name: "Digital Twin Monitor", category: "Navigation", icon: <Compass className="w-4 h-4" />, action: () => onSelectTab("crowd") },
    { name: "Emergency Dispatch Desk", category: "Navigation", icon: <ShieldAlert className="w-4 h-4" />, action: () => onSelectTab("emergency") },
    { name: "Sustainability Analytics Grid", category: "Navigation", icon: <Zap className="w-4 h-4" />, action: () => onSelectTab("sustainability") },
    { name: "Trigger Critical Emergency Alert", category: "Operations", icon: <AlertTriangle className="w-4 h-4 text-red-500" />, action: () => { onTriggerEmergency(); onClose(); } },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(query.toLowerCase()) || cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
          />
          <button onClick={onClose} aria-label="Close command palette" className="p-1 hover:bg-slate-800 rounded text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="p-2 max-h-64 overflow-y-auto">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => { cmd.action(); onClose(); }}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-800 rounded-xl transition text-left text-xs"
              >
                <div className="flex items-center gap-3 text-slate-200">
                  {cmd.icon}
                  <span className="font-semibold">{cmd.name}</span>
                </div>
                <span className="text-[10px] bg-slate-800 border border-slate-700/60 text-slate-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                  {cmd.category}
                </span>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-slate-500">No matching commands found.</div>
          )}
        </div>

      </div>
    </div>
  );
}
