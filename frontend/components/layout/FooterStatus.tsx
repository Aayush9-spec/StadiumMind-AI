import React from "react";

export default function FooterStatus() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/60 py-3.5 text-xs text-slate-500">
      <div className="w-full px-4 md:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-semibold text-slate-400">Live Operations</span>
          <span>• Last updated: 19:03:24 IST</span>
        </div>
        <div className="flex gap-6">
          <span>Sensors: 1,248 Online</span>
          <span>Avg Response: 120ms</span>
          <span className="font-semibold text-slate-400">Data Source: Multi-Channel Fusion</span>
        </div>
      </div>
    </footer>
  );
}
