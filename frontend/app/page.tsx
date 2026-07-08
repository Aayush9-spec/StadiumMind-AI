"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, Activity, Users, Bus, Zap, CloudRain,
  Mic, MicOff, Search, Compass, AlertCircle, HelpCircle, FileText, CheckCircle,
  TrendingUp, RefreshCw, Send, ArrowRight, Accessibility, LayoutDashboard,
  Megaphone, ShieldCheck, Info, Sun, Moon, Volume2, ListOrdered, BrainCircuit
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { api } from "../lib/api";
import CommandPalette from "../components/CommandPalette";
import DigitalTwin from "../components/DigitalTwin";

// Real-world forecasting trends (Dashed line overlay)
const crowdTrendData = [
  { time: "18:00", Inflow: 2400, Forecast: 2500 },
  { time: "18:15", Inflow: 3800, Forecast: 3700 },
  { time: "18:30", Inflow: 4800, Forecast: 4900 },
  { time: "18:45", Inflow: 5900, Forecast: 5800 },
  { time: "19:00", Inflow: 4200, Forecast: 4400 },
  { time: "19:15", Inflow: 3100, Forecast: 3200 },
  { time: "19:30", Inflow: 2100, Forecast: 2000 },
];

const resourceForecastData = [
  { hour: "14:00", Actual: 45, Forecast: 45 },
  { hour: "16:00", Actual: 60, Forecast: 62 },
  { hour: "18:00", Actual: 95, Forecast: 98 },
  { hour: "20:00", Actual: 110, Forecast: 115 },
  { hour: "22:00", Actual: null, Forecast: 135 },
  { hour: "00:00", Actual: null, Forecast: 85 },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  // Live Timeline feed
  const [timeline, setTimeline] = useState([
    { id: 1, time: "19:02", title: "Gate C Congestion Alert", detail: "Inflow threshold exceeded 4,000/hr limit. Rerouting rules triggered." },
    { id: 2, time: "18:45", title: "Open-Meteo Update", detail: "Dallas/SoFi weather forecast registers 24.5°C. Precipitation probability 5%." },
    { id: 3, time: "18:32", title: "AI Dispatch Completed", detail: "Emergency EMS team 4 reached Section 218. Casualty stabilized." },
  ]);

  // Coordinated Operations Approved triggers
  const [approvals, setApprovals] = useState<Record<string, string>>({
    "Open Gate E": "PENDING",
    "Redirect flow to Gate D": "PENDING",
    "Dispatch shuttle buses": "PENDING"
  });

  const [telemetry, setTelemetry] = useState<any>({
    crowd_density: { status: "Warning", value: "Gate C High Flow" },
    transport: { status: "Optimal", value: "Metro 5 Min intervals" },
    medical: { status: "Good", value: "3 units active" },
    weather: { status: "Optimal", value: "Clear, 24°C" },
    security: { status: "Optimal", value: "All clear" },
    energy: { status: "Efficient", value: "240 kW solar" },
    waste: { status: "Optimal", value: "42% capacity" }
  });

  // Feature parameters
  const [gateId, setGateId] = useState("Gate C");
  const [currentCount, setCurrentCount] = useState(4200);
  const [flowRate, setFlowRate] = useState(120);
  const [crowdPredictResult, setCrowdPredictResult] = useState<any>(null);

  const [routeStart, setRouteStart] = useState("Section 105");
  const [routeEnd, setRouteEnd] = useState("Gate D");
  const [wheelchair, setWheelchair] = useState(false);
  const [elevator, setElevator] = useState(false);
  const [routeResult, setRouteResult] = useState<any>(null);

  const [volunteerId, setVolunteerId] = useState("VOL-409");
  const [volunteerLoc, setVolunteerLoc] = useState("Zone A Corridor");
  const [volunteerQuery, setVolunteerQuery] = useState("Where should I go?");
  const [volunteerResult, setVolunteerResult] = useState<any>(null);

  const [attendance, setAttendance] = useState(65000);
  const [temp, setTemp] = useState(27.5);
  const [sustainabilityResult, setSustainabilityResult] = useState<any>(null);

  const [emergencyText, setEmergencyText] = useState("Fan collapsed near Section 218");
  const [emergencyResult, setEmergencyResult] = useState<any>(null);

  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState("");

  const [scenario, setScenario] = useState("Sudden heavy rainstorm during egress peak");
  const [decisionResult, setDecisionResult] = useState<any>(null);

  const [rawIncidentText, setRawIncidentText] = useState("Fan slipped on wet stairs, minor leg cut, medic applied bandage.");
  const [incidentResult, setIncidentResult] = useState<any>(null);

  // Command palette keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchTelemetry = async () => {
    try {
      const data = await api.getTelemetry();
      setTelemetry(data);
    } catch (e) {
      console.warn("Failed fetching telemetry from backend, using default mock data.");
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleVoiceInput = () => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "speechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceQuery("Listening...");
      };

      recognition.onresult = async (event: any) => {
        const text = event.results[0][0].transcript;
        setVoiceQuery(text);
        setIsListening(false);
        if (text.toLowerCase().includes("injured") || text.toLowerCase().includes("collapsed") || text.toLowerCase().includes("help")) {
          setEmergencyText(text);
          setActiveTab("emergency");
          await handleEmergencyReport(text);
        } else {
          setVolunteerQuery(text);
          setActiveTab("volunteer");
          await handleVolunteerAsk(text);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceQuery("Speech error.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const handleCrowdPredict = async () => {
    setLoading(true);
    try {
      const res = await api.predictCrowd(gateId, currentCount, flowRate);
      setCrowdPredictResult(res);
      // Append to live timeline
      setTimeline((prev) => [
        { id: Date.now(), time: "Just Now", title: "Crowd Prediction Computed", detail: `Gate ${gateId} capacity threshold predicted. status: ${res.congestion_status}.` },
        ...prev
      ]);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoutePlan = async () => {
    setLoading(true);
    try {
      const res = await api.planRoute(routeStart, routeEnd, wheelchair, elevator);
      setRouteResult(res);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVolunteerAsk = async (queryText?: string) => {
    setLoading(true);
    try {
      const textToUse = queryText || volunteerQuery;
      const res = await api.askVolunteer(volunteerId, volunteerLoc, textToUse);
      setVolunteerResult(res);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSustainabilityPredict = async () => {
    setLoading(true);
    try {
      const res = await api.predictSustainability(attendance, temp);
      setSustainabilityResult(res);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyReport = async (customText?: string) => {
    setLoading(true);
    try {
      const textToUse = customText || emergencyText;
      const res = await api.reportEmergency(textToUse);
      setEmergencyResult(res);
      setTimeline((prev) => [
        { id: Date.now(), time: "Just Now", title: "Rescue EMS Dispatched", detail: `${res.dispatched_unit} routed via ${res.suggested_route}. ETA: ${res.eta_minutes} mins.` },
        ...prev
      ]);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerDecision = async () => {
    setLoading(true);
    try {
      const res = await api.triggerDecision(scenario);
      setDecisionResult(res);
      // Populate dynamic approvals checklist
      const newApprovals: Record<string, string> = {};
      res.actions.forEach((act: string) => {
        newApprovals[act] = "PENDING";
      });
      setApprovals(newApprovals);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateIncident = async () => {
    setLoading(true);
    try {
      const res = await api.generateIncidentReport(rawIncidentText);
      setIncidentResult(res);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleActionApproval = (actionKey: string, status: string) => {
    setApprovals((prev) => ({
      ...prev,
      [actionKey]: status
    }));
    setTimeline((prev) => [
      { id: Date.now(), time: "Just Now", title: `Decision Approved: ${actionKey}`, detail: `Operations coordinator approved task assignment.` },
      ...prev
    ]);
  };

  return (
    <div className={`min-h-screen font-sans transition-all duration-300 ${
      highContrast 
        ? "bg-black text-white selection:bg-yellow-400 selection:text-black" 
        : "bg-[#F7F8FC] text-[#111827] selection:bg-indigo-600 selection:text-white"
    }`}>
      
      {/* Main Layout Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Header Block */}
        <header className="border-b border-[#E8ECF4] bg-white sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-xl shadow-lg shadow-indigo-500/10">
                <BrainCircuit className="w-6.5 h-6.5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight flex items-center gap-2 text-[#111827]">
                  StadiumMind OS
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-200 tracking-wider">ENTERPRISE</span>
                </h1>
                <p className="text-[9px] text-[#6B7280] font-bold tracking-widest uppercase">
                  FIFA World Cup 2026 Operations
                </p>
              </div>
            </div>

            {/* Top Toolbar Actions */}
            <div className="flex items-center gap-3">
              
              {/* Cmd+K visual label */}
              <button 
                onClick={() => setIsCommandPaletteOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E8ECF4] bg-[#F7F8FC] hover:bg-slate-100 text-xs font-semibold text-[#6B7280] transition"
              >
                <span>Search Console</span>
                <kbd className="bg-white border border-[#E8ECF4] text-[9px] px-1.5 py-0.5 rounded font-bold">⌘K</kbd>
              </button>

              <button
                onClick={() => setHighContrast(!highContrast)}
                aria-label="Toggle High Contrast Mode"
                className="p-2 rounded-lg border border-[#E8ECF4] bg-white text-[#6B7280] hover:text-[#111827] transition"
              >
                {highContrast ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                onClick={handleVoiceInput}
                aria-label={isListening ? "Stop listening to microphone" : "Start listening to microphone"}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition duration-300 text-xs uppercase tracking-wider ${
                  isListening 
                    ? "bg-red-500 text-white animate-pulse" 
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                {isListening ? "Listening" : "Voice AI"}
              </button>

            </div>

          </div>
        </header>

        {/* Command Palette Menu overlay */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onSelectTab={(tab) => setActiveTab(tab)}
          onTriggerEmergency={() => {
            setEmergencyText("Critical security emergency in Sector Plaza A!");
            setActiveTab("emergency");
            handleEmergencyReport("Critical security emergency in Sector Plaza A!");
          }}
        />

        {/* Global Warning Bar */}
        <div className="bg-[#F7F8FC] border-b border-[#E8ECF4] py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-semibold text-[#6B7280]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Dallas Venue Feed: Connected</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Gate A Flow: Optimal</span>
              <span>Gate C Flow: Heavy Egress</span>
            </div>
          </div>
        </div>

        {/* Central Grid Content */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
          
          {/* Navigation Tab list (Horizontal on mobile, vertical on desktop) */}
          <aside className="w-full lg:w-60 flex-shrink-0">
            <nav className="flex flex-row overflow-x-auto lg:flex-col gap-1.5 pb-3 lg:pb-0 scrollbar-none" aria-label="Operating system navigation">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex-shrink-0 flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === "overview" 
                    ? "bg-[#4F46E5] text-white shadow-sm" 
                    : "text-[#6B7280] hover:bg-white hover:text-[#111827]"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Overview Command
              </button>
              <button
                onClick={() => setActiveTab("crowd")}
                className={`flex-shrink-0 flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === "crowd" 
                    ? "bg-[#4F46E5] text-white shadow-sm" 
                    : "text-[#6B7280] hover:bg-white hover:text-[#111827]"
                }`}
              >
                <Compass className="w-4 h-4" />
                Digital Twin & Route
              </button>
              <button
                onClick={() => setActiveTab("emergency")}
                className={`flex-shrink-0 flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === "emergency" 
                    ? "bg-[#4F46E5] text-white shadow-sm" 
                    : "text-[#6B7280] hover:bg-white hover:text-[#111827]"
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                Emergency Rescue
              </button>
              <button
                onClick={() => setActiveTab("sustainability")}
                className={`flex-shrink-0 flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === "sustainability" 
                    ? "bg-[#4F46E5] text-white shadow-sm" 
                    : "text-[#6B7280] hover:bg-white hover:text-[#111827]"
                }`}
              >
                <Zap className="w-4 h-4" />
                Sustainability Grid
              </button>
              <button
                onClick={() => setActiveTab("volunteer")}
                className={`flex-shrink-0 flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === "volunteer" 
                    ? "bg-[#4F46E5] text-white shadow-sm" 
                    : "text-[#6B7280] hover:bg-white hover:text-[#111827]"
                }`}
              >
                <Users className="w-4 h-4" />
                Volunteer AI
              </button>
            </nav>

            {/* Quick Stats sidebar widget */}
            <div className="hidden lg:block mt-8 p-4 bg-white border border-[#E8ECF4] rounded-2xl shadow-sm space-y-4">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest block font-sans">System Diagnostics</span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">GenAI SDK:</span>
                  <strong className="text-emerald-600">google-genai 2.10</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Weather API:</span>
                  <strong className="text-[#111827]">Open-Meteo</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Diagnostic Latency:</span>
                  <strong className="text-[#111827]">22ms</strong>
                </div>
              </div>
            </div>
          </aside>

          {/* Core Panel Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                
                {/* A. OVERVIEW COMMAND TAB */}
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    
                    {/* Live AI Insight Cards Row (Palantir style) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-amber-500">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Inflow Congestion</span>
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">92% CONFIDENCE</span>
                        </div>
                        <p className="text-xl font-black">{telemetry.crowd_density.value}</p>
                        <p className="text-xs text-slate-400 mt-2"><strong>AI Action:</strong> Recommend redirecting flow to West Gate D Concourse corridor.</p>
                        <button 
                          onClick={() => { setGateId("Gate C"); handleCrowdPredict(); }}
                          className="mt-3 text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
                        >
                          Trigger Mitigation <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-emerald-500">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Egress Transit</span>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">98% CONFIDENCE</span>
                        </div>
                        <p className="text-xl font-black">{telemetry.transport.value}</p>
                        <p className="text-xs text-slate-400 mt-2"><strong>AI Action:</strong> Metro line active. Keep digital signage indicators optimized.</p>
                      </div>

                      <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-purple-500">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Live Environmental Feed</span>
                          <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">LIVE DATA</span>
                        </div>
                        <p className="text-xl font-black">{telemetry.weather.value}</p>
                        <p className="text-xs text-slate-400 mt-2"><strong>Source:</strong> Open-Meteo current forecast query for SoFi coordinate grid.</p>
                      </div>

                    </div>

                    {/* AI Commander Decision Panel & approvals list */}
                    <div className="glass-panel p-6 rounded-2xl border-purple-500/20 bg-purple-950/5">
                      <div className="flex items-center gap-2 mb-4">
                        <BrainCircuit className="w-5 h-5 text-purple-400 animate-pulse" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">AI Commander Decision Orchestrator</h2>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="decision-scenario-select" className="text-xs font-bold text-slate-400 block mb-1">Target Egress Scenario Trigger</label>
                        <select
                          id="decision-scenario-select"
                          value={scenario}
                          onChange={(e) => setScenario(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-sm focus:outline-none"
                        >
                          <option value="Sudden heavy rainstorm during egress peak">Sudden heavy rainstorm during egress peak</option>
                          <option value="Public metro line failure in zone C corridor">Public metro line failure in zone C corridor</option>
                          <option value="Security alert near Gate B concourse">Security alert near Gate B concourse</option>
                        </select>
                      </div>

                      <button 
                        onClick={handleTriggerDecision}
                        disabled={loading}
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 transition rounded-lg text-xs font-bold uppercase tracking-wider"
                      >
                        Generate Coordinated Action Flow
                      </button>

                      {decisionResult && (
                        <div className="mt-6 space-y-6">
                          
                          {/* Reasoning timeline */}
                          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">AI Reasoning Stream</span>
                            <div className="text-xs space-y-1.5 text-slate-300">
                              {decisionResult.reasoning_steps.map((step: string, idx: number) => (
                                <p key={idx} className="flex gap-2">
                                  <span className="text-purple-500 font-bold">{idx + 1}.</span>
                                  {step}
                                </p>
                              ))}
                            </div>
                          </div>

                          {/* Approvals check grid */}
                          <div className="space-y-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Coordinator Approvals Checklist</span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {Object.keys(approvals).map((actName) => (
                                <div key={actName} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col justify-between h-28">
                                  <span className="text-xs font-bold text-slate-200 block truncate">{actName}</span>
                                  
                                  <div className="flex gap-2 mt-3">
                                    {approvals[actName] === "PENDING" ? (
                                      <>
                                        <button 
                                          onClick={() => handleActionApproval(actName, "APPROVED")}
                                          className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-700 rounded text-[10px] font-bold text-white uppercase"
                                        >
                                          Approve
                                        </button>
                                        <button 
                                          onClick={() => handleActionApproval(actName, "REJECTED")}
                                          className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-bold text-slate-400 uppercase"
                                        >
                                          Reject
                                        </button>
                                      </>
                                    ) : (
                                      <span className={`w-full py-1 text-center rounded text-[10px] font-bold uppercase ${
                                        approvals[actName] === "APPROVED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                                      }`}>
                                        {approvals[actName]}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      )}
                    </div>

                    {/* Historical Trend and Live Log Feed Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Egress Trend Graph */}
                      <div className="glass-panel p-6 rounded-2xl lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="text-xs font-bold text-slate-200">Egress Inflow vs Forecast</h3>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Dynamic overlay</p>
                          </div>
                          <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold uppercase">Real-time Feed</span>
                        </div>
                        <div className="h-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={crowdTrendData}>
                              <defs>
                                <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                              <XAxis dataKey="time" stroke="#475569" fontSize={10} />
                              <YAxis stroke="#475569" fontSize={10} />
                              <Tooltip contentStyle={{ backgroundColor: "#090d16", borderColor: "rgba(255,255,255,0.08)" }} />
                              <Area type="monotone" dataKey="Inflow" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorInflow)" />
                              <Line type="monotone" dataKey="Forecast" stroke="#64748b" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Live Incident Timeline Log */}
                      <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                        <div>
                          <h3 className="text-xs font-bold text-slate-200 mb-4">Live Incident Log Timeline</h3>
                          <div className="space-y-4 max-h-56 overflow-y-auto">
                            {timeline.map((evt) => (
                              <div key={evt.id} className="relative pl-4 border-l border-slate-800 text-xs">
                                <span className="absolute top-1 left-[-4px] w-2 h-2 rounded-full bg-blue-500" />
                                <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-0.5">
                                  <span>{evt.title}</span>
                                  <span>{evt.time}</span>
                                </div>
                                <p className="text-[11px] text-slate-300 leading-relaxed">{evt.detail}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="border-t border-slate-900 pt-3 mt-4 text-[10px] text-slate-500 uppercase tracking-widest text-center">
                          Diagnostics: All clear
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* B. DIGITAL TWIN COMMAND TAB */}
                {activeTab === "crowd" && (
                  <div className="space-y-8">
                    
                    {/* SVG twin model mapping */}
                    <DigitalTwin
                      stadiumName="SoFi Stadium"
                      gateStatus={{
                        "Gate A": { count: 3400, status: "NORMAL" },
                        "Gate B": { count: 2100, status: "NORMAL" },
                        "Gate C": { count: 4800, status: "HIGH" },
                        "Gate D": { count: 1800, status: "NORMAL" },
                      }}
                      onSelectNode={(gateKey) => {
                        setGateId(gateKey);
                        handleCrowdPredict();
                      }}
                    />

                    {/* Routing logic pathfinder */}
                    <div className="glass-panel p-6 rounded-2xl">
                      <div className="flex items-center gap-2 mb-4">
                        <Compass className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider">AI Pathfinding Navigation Coordinator</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="twin-route-start" className="text-xs font-bold text-slate-400 block mb-1">Starting Location Sector</label>
                          <input 
                            id="twin-route-start"
                            type="text" 
                            value={routeStart} 
                            onChange={(e) => setRouteStart(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor="twin-route-end" className="text-xs font-bold text-slate-400 block mb-1">Egress target Gate</label>
                          <input 
                            id="twin-route-end"
                            type="text" 
                            value={routeEnd} 
                            onChange={(e) => setRouteEnd(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex gap-6 mb-4">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={wheelchair} 
                            onChange={(e) => setWheelchair(e.target.checked)}
                            className="rounded border-slate-800 bg-slate-950 text-blue-600"
                          />
                          Wheelchair Access Required
                        </label>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={elevator} 
                            onChange={(e) => setElevator(e.target.checked)}
                            className="rounded border-slate-800 bg-slate-950 text-blue-600"
                          />
                          Elevators prioritize
                        </label>
                      </div>

                      <button 
                        onClick={handleRoutePlan}
                        disabled={loading}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 transition rounded-lg text-xs font-bold uppercase tracking-wider"
                      >
                        Map safest route coordinates
                      </button>

                      {routeResult && (
                        <div className="mt-6 p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs space-y-1">
                          <p><strong>Computed Pathway:</strong> {routeResult.path.join(" ➔ ")}</p>
                          <p><strong>ETA:</strong> {routeResult.estimated_minutes} minutes</p>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* C. EMERGENCY TAB */}
                {activeTab === "emergency" && (
                  <div className="space-y-8">
                    
                    <div className="glass-panel p-6 rounded-2xl border-red-500/20 bg-red-950/5">
                      <div className="flex items-center gap-2 mb-4 text-red-400">
                        <ShieldAlert className="w-5 h-5 animate-pulse" />
                        <h2 className="text-sm font-bold uppercase tracking-wider">Rescue EMS Dispatcher Console</h2>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="emergency-alarm-feed-input" className="text-xs font-bold text-slate-400 block mb-1">Radio Alert Transcript (Live Feed)</label>
                        <textarea 
                          id="emergency-alarm-feed-input"
                          rows={3}
                          value={emergencyText} 
                          onChange={(e) => setEmergencyText(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-100"
                        />
                      </div>

                      <button 
                        onClick={() => handleEmergencyReport()}
                        disabled={loading}
                        className="w-full py-2.5 bg-red-600 hover:bg-red-700 transition rounded-lg text-xs font-bold uppercase tracking-wider"
                      >
                        Dispatch rescue teams
                      </button>

                      {emergencyResult && (
                        <div className="mt-6 p-4 bg-red-950/20 border border-red-500/20 rounded-xl text-xs">
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Extracted Coordinates</span>
                              <strong className="text-red-200 text-sm">{emergencyResult.extracted_location}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Risk Tier</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-500 text-white animate-pulse">
                                {emergencyResult.severity}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1.5 border-t border-red-500/10 pt-3 text-slate-350">
                            <p><strong>Dispatched Team:</strong> {emergencyResult.dispatched_unit}</p>
                            <p><strong>Cleared Route:</strong> {emergencyResult.suggested_route}</p>
                            <p><strong>Expected Arrival:</strong> {emergencyResult.eta_minutes} mins</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="glass-panel p-6 rounded-2xl">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-teal-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider">AI Incident report compiler</h2>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="raw-log-compilation-input" className="text-xs font-bold text-slate-400 block mb-1">Raw radio log text</label>
                        <textarea 
                          id="raw-log-compilation-input"
                          rows={3}
                          value={rawIncidentText} 
                          onChange={(e) => setRawIncidentText(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:outline-none"
                        />
                      </div>

                      <button 
                        onClick={handleGenerateIncident}
                        disabled={loading}
                        className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 transition rounded-lg text-xs font-bold uppercase tracking-wider"
                      >
                        Compile formal incident record
                      </button>

                      {incidentResult && (
                        <div className="mt-6 p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs space-y-3 text-slate-300">
                          <p><strong>Summary:</strong> {incidentResult.summary}</p>
                          <p><strong>Severity Rating:</strong> {incidentResult.severity}</p>
                          <p><strong>Remediation:</strong> {incidentResult.recommended_action}</p>
                          <p><strong>Gear Required:</strong> {incidentResult.resources_required.join(", ")}</p>
                          <p><strong>Resolution ETA:</strong> {incidentResult.time_estimate}</p>
                          <p><strong>Escalation Tier:</strong> {incidentResult.escalation_level}</p>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* D. SUSTAINABILITY TAB */}
                {activeTab === "sustainability" && (
                  <div className="space-y-8">
                    
                    <div className="glass-panel p-6 rounded-2xl">
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-amber-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider">Resource load coordinator</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="sustainability-attendance-input" className="text-xs font-bold text-slate-400 block mb-1">Expected Attendance</label>
                          <input 
                            id="sustainability-attendance-input"
                            type="number" 
                            value={attendance} 
                            onChange={(e) => setAttendance(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor="sustainability-temp-input" className="text-xs font-bold text-slate-400 block mb-1">Target Temperature (°C)</label>
                          <input 
                            id="sustainability-temp-input"
                            type="number" 
                            value={temp} 
                            onChange={(e) => setTemp(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={handleSustainabilityPredict}
                        disabled={loading}
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 transition rounded-lg text-xs font-bold uppercase tracking-wider"
                      >
                        Forecast resource loads
                      </button>

                      {sustainabilityResult && (
                        <div className="mt-6 p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-350">
                          <div>
                            <span className="text-slate-450 block">Electricity Forecast</span>
                            <strong className="text-lg text-slate-100">{sustainabilityResult.electricity_mwh_est} MWh</strong>
                          </div>
                          <div>
                            <span className="text-slate-450 block">Water Consumption</span>
                            <strong className="text-lg text-slate-100">{sustainabilityResult.water_liters_est.toLocaleString()} L</strong>
                          </div>
                          <div>
                            <span className="text-slate-450 block">Trash Yield</span>
                            <strong className="text-lg text-slate-100">{sustainabilityResult.waste_tons_est} Tons</strong>
                          </div>
                          <div>
                            <span className="text-slate-450 block">Food Demand Forecast</span>
                            <strong className="text-lg text-slate-100">{sustainabilityResult.food_demand_units_est.toLocaleString()} units</strong>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Historical line chart with forecast overlay */}
                    <div className="glass-panel p-6 rounded-2xl">
                      <h3 className="text-xs font-bold text-slate-200 mb-4">Electricity Load Forecasting Overlay</h3>
                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={resourceForecastData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="hour" stroke="#475569" fontSize={10} />
                            <YAxis stroke="#475569" fontSize={10} />
                            <Tooltip contentStyle={{ backgroundColor: "#090d16", borderColor: "rgba(255,255,255,0.08)" }} />
                            <Line type="monotone" dataKey="Actual" stroke="#f59e0b" strokeWidth={2.5} />
                            <Line type="monotone" dataKey="Forecast" stroke="#475569" strokeWidth={1.5} strokeDasharray="5 5" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </div>
                )}

                {/* E. VOLUNTEER AI SUPPORT TAB */}
                {activeTab === "volunteer" && (
                  <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-emerald-400" />
                      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Volunteer Resource Dispatch Console</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="volunteer-badge-input" className="text-xs font-bold text-slate-400 block mb-1">Badge Reference ID</label>
                        <input 
                          id="volunteer-badge-input"
                          type="text" 
                          value={volunteerId} 
                          onChange={(e) => setVolunteerId(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="volunteer-sector-input" className="text-xs font-bold text-slate-400 block mb-1">Sector coordinates</label>
                        <input 
                          id="volunteer-sector-input"
                          type="text" 
                          value={volunteerLoc} 
                          onChange={(e) => setVolunteerLoc(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="volunteer-ask-query-input" className="text-xs font-bold text-slate-400 block mb-1">Query input</label>
                      <div className="flex gap-2">
                        <input 
                          id="volunteer-ask-query-input"
                          type="text" 
                          value={volunteerQuery} 
                          onChange={(e) => setVolunteerQuery(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3 text-sm focus:outline-none text-slate-100"
                        />
                        <button 
                          onClick={() => handleVolunteerAsk()}
                          aria-label="Submit Volunteer Query"
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-xs font-bold uppercase tracking-wider"
                        >
                          Dispatch
                        </button>
                      </div>
                    </div>

                    {volunteerResult && (
                      <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs space-y-2">
                        <p className="text-emerald-400 font-bold">Target sector allocation: {volunteerResult.assigned_zone}</p>
                        <p className="text-slate-350">Action description: {volunteerResult.task_description}</p>
                        <p className="text-slate-400">Risk category: {volunteerResult.urgency_level}</p>
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </main>

        </div>

      </div>
    </div>
  );
}
