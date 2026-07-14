import React from "react";
import { Send } from "lucide-react";

interface AIChatWidgetProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
}

export default function AIChatWidget({ value, onChange, onSend }: AIChatWidgetProps) {
  return (
    <div className="border-t border-white/10 pt-4">
      <label htmlFor="commander-ask-side" className="sr-only">Ask StadiumMind AI</label>
      <div className="flex gap-2">
        <input 
          id="commander-ask-side"
          type="text"
          placeholder="Ask StadiumMind AI..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSend();
            }
          }}
          className="flex-1 bg-slate-950/60 border border-white/10 rounded-xl py-2 px-3 text-xs outline-none text-white placeholder-slate-500"
        />
        <button 
          onClick={onSend}
          aria-label="Send Query"
          className="p-2 bg-slate-950/60 border border-white/10 hover:bg-slate-900 rounded-xl cursor-pointer"
        >
          <Send className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
