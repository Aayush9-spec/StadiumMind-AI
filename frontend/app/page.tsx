"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, Activity, Users, Bus, Zap, CloudRain,
  Mic, MicOff, Search, Compass, AlertCircle, FileText, CheckCircle,
  TrendingUp, RefreshCw, Send, ArrowRight, Accessibility, LayoutDashboard,
  Megaphone, ShieldCheck, Info, Sun, Moon, Volume2, ListOrdered, BrainCircuit, Bell, User
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { api } from "../lib/api";
import CommandPalette from "../components/CommandPalette";
import DigitalTwin from "../components/DigitalTwin";

// Sparkline Mock Data for Top Cards
const sparklineDataUp = [
  { val: 30 }, { val: 45 }, { val: 35 }, { val: 60 }, { val: 55 }, { val: 80 }, { val: 92 }
];
const sparklineDataDown = [
  { val: 90 }, { val: 75 }, { val: 80 }, { val: 60 }, { val: 50 }, { val: 40 }, { val: 30 }
];

// Main Chart Data
const crowdTrendData = [
  { time: "14:00", Flow: 25000, Forecast: 28000 },
  { time: "15:00", Flow: 42000, Forecast: 44000 },
  { time: "16:00", Flow: 59000, Forecast: 62000 },
  { time: "17:00", Flow: 48000, Forecast: 50000 },
  { time: "18:00", Flow: 88000, Forecast: 90000 },
  { time: "19:00", Flow: 65000, Forecast: 68000 },
  { time: "20:00", Flow: 35000, Forecast: 38000 },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Live Timeline feed
  const [timeline, setTimeline] = useState([
    { id: 1, time: "19:02", title: "Gate C Congestion Alert", detail: "Inflow threshold exceeded 4,000/hr limit. Rerouting rules triggered." },
    { id: 2, time: "18:58", title: "Heavy Rain Warning", detail: "Rain expected in 30-40 minutes. Signage updated to show indoor paths." },
    { id: 3, time: "18:45", title: "Metro Line 2 Delay", detail: "8 min delay reported. Shuttle buses dispatched to handle overflow." },
    { id: 4, time: "18:30", title: "Volunteer Team Dispatched", detail: "8 volunteers sent to Gate C to assist crowd routing." },
    { id: 5, time: "18:20", title: "Sustainability Alert", detail: "High waste generation detected in Zone B." },
  ]);

  // AI Recommended Actions checklist
  const [approvals, setApprovals] = useState<Record<string, { status: string; impact: string; confidence: string }>>({
    "Open Gate D": { status: "PENDING", impact: "High", confidence: "98%" },
    "Dispatch 8 Volunteers": { status: "PENDING", impact: "Medium", confidence: "95%" },
    "Delay Fireworks": { status: "PENDING", impact: "Low", confidence: "89%" }
  });

  const [telemetry, setTelemetry] = useState<any>({
    crowd_density: { status: "Warning", value: "Gate C: 92%" },
    transport: { status: "Optimal", value: "Metro: 3 Min" },
    medical: { status: "Good", value: "3 units active" },
    weather: { status: "Optimal", value: "19.7°C, Clear" },
    energy: { status: "Efficient", value: "72% Optimal" },
    waste: { status: "Optimal", value: "4.2 tons" }
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
      const newApprovals: Record<string, { status: string; impact: string; confidence: string }> = {};
      res.actions.forEach((act: string) => {
        newApprovals[act] = { status: "PENDING", impact: "High", confidence: "95%" };
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
      [actionKey]: { ...prev[actionKey], status }
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
          <div className="w-full px-4 md:px-8 lg:px-12 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
            
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

            {/* Top Search bar Console */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E8ECF4] bg-[#F7F8FC] w-72">
              <Search className="w-4 h-4 text-[#6B7280]" />
              <input 
                onClick={() => setIsCommandPaletteOpen(true)}
                type="text" 
                placeholder="Search command console..." 
                readOnly
                className="bg-transparent text-xs outline-none text-[#111827] placeholder-[#6B7280] cursor-pointer w-full"
              />
              <kbd className="bg-white border border-[#E8ECF4] text-[9px] px-1.5 py-0.5 rounded font-bold text-[#6B7280]">⌘K</kbd>
            </div>

            {/* Top Toolbar Actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-[#F7F8FC] border border-[#E8ECF4] px-2.5 py-1 rounded-lg text-xs text-[#16A34A] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping" />
                <span>All Systems Operational</span>
              </div>

              <select 
                id="header-lang-selector"
                aria-label="Select Language"
                className="bg-white border border-[#E8ECF4] rounded-lg px-2 py-1 text-xs text-[#111827] outline-none"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>

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

              {/* Ops Admin profile */}
              <div className="flex items-center gap-2 pl-3 border-l border-[#E8ECF4]">
                <div className="p-1 bg-[#F7F8FC] border border-[#E8ECF4] rounded-full">
                  <User className="w-4 h-4 text-[#6B7280]" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-[10px] font-bold text-[#111827]">Ops Admin</p>
                  <p className="text-[8px] text-[#6B7280] font-semibold uppercase">Administrator</p>
                </div>
              </div>

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
              <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse" />
              <span>Dallas Venue Feed: Connected</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Gate A Flow: Optimal</span>
              <span>Gate C Flow: Heavy Egress</span>
            </div>
          </div>
        </div>

        {/* Central Layout Grid */}
        <div className="flex-1 w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col lg:flex-row gap-8">
          
          {/* Navigation Tab list */}
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
                  <strong className="text-[#16A34A]">google-genai 2.10</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Weather API:</span>
                  <strong className="text-[#111827]">Open-Meteo</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Response Latency:</span>
                  <strong className="text-[#111827]">120ms</strong>
                </div>
              </div>
            </div>
          </aside>

          {/* Main layout splitting main panels & right persistent sidebar AI Commander */}
          <div className="flex-1 min-w-0 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left and Center Content Area (Dynamic depending on active tab) */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  
                  {/* A. OVERVIEW COMMAND TAB */}
                  {activeTab === "overview" && (
                    <div className="space-y-8">
                      
                      {/* Top 4 premium metric cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        
                        <div className="bg-white border border-[#E8ECF4] p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1">Inflow Congestion</span>
                              <h4 className="text-lg font-black text-[#111827]">{telemetry.crowd_density.value}</h4>
                              <span className="inline-block mt-2 text-[9px] font-black text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">High Risk</span>
                              <span className="text-[9px] text-[#6B7280] block mt-1">↑ 18% vs last 15 min</span>
                            </div>
                            <div className="w-16 h-10">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sparklineDataUp}>
                                  <Area type="monotone" dataKey="val" stroke="#EF4444" fill="rgba(239, 68, 68, 0.05)" strokeWidth={1.5} dot={false} />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white border border-[#E8ECF4] p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1">Egress Transit</span>
                              <h4 className="text-lg font-black text-[#111827]">{telemetry.transport.value}</h4>
                              <span className="inline-block mt-2 text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">Optimal</span>
                              <span className="text-[9px] text-[#6B7280] block mt-1">On-time performance</span>
                            </div>
                            <div className="w-16 h-10">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sparklineDataDown}>
                                  <Area type="monotone" dataKey="val" stroke="#16A34A" fill="rgba(22, 163, 74, 0.05)" strokeWidth={1.5} dot={false} />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white border border-[#E8ECF4] p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1">Environmental</span>
                              <h4 className="text-lg font-black text-[#111827]">{telemetry.weather.value}</h4>
                              <span className="inline-block mt-2 text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">Clear</span>
                              <span className="text-[9px] text-[#6B7280] block mt-1">Wind 10.8 km/h</span>
                            </div>
                            <CloudRain className="w-6 h-6 text-blue-500" />
                          </div>
                        </div>

                        <div className="bg-white border border-[#E8ECF4] p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1">Live Attendance</span>
                              <h4 className="text-lg font-black text-[#111827]">62,845</h4>
                              <span className="inline-block mt-2 text-[9px] font-black text-[#4F46E5] bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">↑ 1,245 today</span>
                              <span className="text-[9px] text-[#6B7280] block mt-1">Capacity: 78%</span>
                            </div>
                            <Users className="w-6 h-6 text-[#4F46E5]" />
                          </div>
                        </div>

                      </div>

                      {/* Digital Twin */}
                      <DigitalTwin
                        stadiumName="SoFi Stadium"
                        gateStatus={{
                          "Gate A": { count: 3400, status: "MEDIUM", percentage: 72 },
                          "Gate B": { count: 2100, status: "NORMAL", percentage: 48 },
                          "Gate C": { count: 4800, status: "HIGH", percentage: 92 },
                          "Gate D": { count: 1800, status: "MEDIUM", percentage: 61 },
                          "Gate E": { count: 1200, status: "NORMAL", percentage: 35 }
                        }}
                        onSelectNode={(gateKey) => {
                          setGateId(gateKey);
                          setRouteEnd(gateKey);
                          handleCrowdPredict();
                        }}
                      />

                      {/* Crowd Flow vs Forecast Chart */}
                      <div className="bg-white border border-[#E8ECF4] p-6 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="text-xs font-bold text-[#111827]">Crowd Flow vs Forecast</h3>
                            <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Real-time simulation overlay</p>
                          </div>
                          <span className="text-[10px] bg-[#F7F8FC] border border-[#E8ECF4] text-[#6B7280] px-2 py-0.5 rounded font-bold uppercase">Real-time</span>
                        </div>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={crowdTrendData}>
                              <defs>
                                <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                              <XAxis dataKey="time" stroke="#6B7280" fontSize={10} />
                              <YAxis stroke="#6B7280" fontSize={10} />
                              <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E8ECF4" }} />
                              <Area type="monotone" dataKey="Flow" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFlow)" />
                              <Line type="monotone" dataKey="Forecast" stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* B. DIGITAL TWIN COMMAND TAB */}
                  {activeTab === "crowd" && (
                    <div className="space-y-8">
                      
                      <DigitalTwin
                        stadiumName="SoFi Stadium"
                        gateStatus={{
                          "Gate A": { count: 3400, status: "MEDIUM", percentage: 72 },
                          "Gate B": { count: 2100, status: "NORMAL", percentage: 48 },
                          "Gate C": { count: 4800, status: "HIGH", percentage: 92 },
                          "Gate D": { count: 1800, status: "MEDIUM", percentage: 61 },
                          "Gate E": { count: 1200, status: "NORMAL", percentage: 35 }
                        }}
                        onSelectNode={(gateKey) => {
                          setGateId(gateKey);
                          setRouteEnd(gateKey);
                          handleCrowdPredict();
                        }}
                      />

                      {/* Routing logic pathfinder */}
                      <div className="bg-white border border-[#E8ECF4] p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                          <Compass className="w-5 h-5 text-[#4F46E5]" />
                          <h2 className="text-sm font-bold uppercase tracking-wider">AI Pathfinding Navigation Coordinator</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="route-start-tab" className="text-xs font-bold text-[#6B7280] block mb-1">Starting Location Sector</label>
                            <input 
                              id="route-start-tab"
                              type="text" 
                              value={routeStart} 
                              onChange={(e) => setRouteStart(e.target.value)}
                              className="w-full bg-[#F7F8FC] border border-[#E8ECF4] rounded-lg py-2 px-3 text-sm outline-none text-[#111827]"
                            />
                          </div>
                          <div>
                            <label htmlFor="route-end-tab" className="text-xs font-bold text-[#6B7280] block mb-1">Egress target Gate</label>
                            <input 
                              id="route-end-tab"
                              type="text" 
                              value={routeEnd} 
                              onChange={(e) => setRouteEnd(e.target.value)}
                              className="w-full bg-[#F7F8FC] border border-[#E8ECF4] rounded-lg py-2 px-3 text-sm outline-none text-[#111827]"
                            />
                          </div>
                        </div>

                        <div className="flex gap-6 mb-4">
                          <label className="flex items-center gap-2 text-xs font-bold text-[#111827] cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={wheelchair} 
                              onChange={(e) => setWheelchair(e.target.checked)}
                              className="rounded border-[#E8ECF4] bg-[#F7F8FC] text-[#4F46E5]"
                            />
                            Wheelchair Access Required
                          </label>
                          <label className="flex items-center gap-2 text-xs font-bold text-[#111827] cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={elevator} 
                              onChange={(e) => setElevator(e.target.checked)}
                              className="rounded border-[#E8ECF4] bg-[#F7F8FC] text-[#4F46E5]"
                            />
                            Elevators prioritize
                          </label>
                        </div>

                        <button 
                          onClick={handleRoutePlan}
                          disabled={loading}
                          className="w-full py-2.5 bg-[#4F46E5] hover:bg-indigo-700 transition rounded-lg text-xs font-bold text-white uppercase tracking-wider"
                        >
                          Map safest route coordinates
                        </button>

                        {routeResult && (
                          <div className="mt-6 p-4 bg-[#F7F8FC] border border-[#E8ECF4] rounded-xl text-xs space-y-1">
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
                      
                      <div className="bg-white border border-[#E8ECF4] p-6 rounded-2xl shadow-sm border-l-4 border-l-red-500">
                        <div className="flex items-center gap-2 mb-4 text-red-600">
                          <ShieldAlert className="w-5 h-5 animate-pulse" />
                          <h2 className="text-sm font-bold uppercase tracking-wider">Rescue EMS Dispatcher Console</h2>
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="emergency-alert-input-tab" className="text-xs font-bold text-[#6B7280] block mb-1">Radio Alert Transcript (Live Feed)</label>
                          <textarea 
                            id="emergency-alert-input-tab"
                            rows={3}
                            value={emergencyText} 
                            onChange={(e) => setEmergencyText(e.target.value)}
                            className="w-full bg-[#F7F8FC] border border-[#E8ECF4] rounded-lg py-2 px-3 text-sm outline-none text-[#111827]"
                          />
                        </div>

                        <button 
                          onClick={() => handleEmergencyReport()}
                          disabled={loading}
                          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white transition rounded-lg text-xs font-bold uppercase tracking-wider"
                        >
                          Dispatch rescue teams
                        </button>

                        {emergencyResult && (
                          <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-xs">
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <span className="text-[#6B7280] block uppercase tracking-wider text-[10px]">Extracted Coordinates</span>
                                <strong className="text-red-700 text-sm">{emergencyResult.extracted_location}</strong>
                              </div>
                              <div>
                                <span className="text-[#6B7280] block uppercase tracking-wider text-[10px]">Risk Tier</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white animate-pulse">
                                  {emergencyResult.severity}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-1.5 border-t border-red-200 pt-3 text-slate-700">
                              <p><strong>Dispatched Team:</strong> {emergencyResult.dispatched_unit}</p>
                              <p><strong>Cleared Route:</strong> {emergencyResult.suggested_route}</p>
                              <p><strong>Expected Arrival:</strong> {emergencyResult.eta_minutes} mins</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-white border border-[#E8ECF4] p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                          <FileText className="w-5 h-5 text-teal-600" />
                          <h2 className="text-sm font-bold uppercase tracking-wider">AI Incident Report Compiler</h2>
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="incident-raw-text-tab" className="text-xs font-bold text-[#6B7280] block mb-1">Raw radio log text</label>
                          <textarea 
                            id="incident-raw-text-tab"
                            rows={3}
                            value={rawIncidentText} 
                            onChange={(e) => setRawIncidentText(e.target.value)}
                            className="w-full bg-[#F7F8FC] border border-[#E8ECF4] rounded-lg py-2 px-3 text-sm outline-none text-[#111827]"
                          />
                        </div>

                        <button 
                          onClick={handleGenerateIncident}
                          disabled={loading}
                          className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white transition rounded-lg text-xs font-bold uppercase tracking-wider"
                        >
                          Compile formal incident record
                        </button>

                        {incidentResult && (
                          <div className="mt-6 p-4 bg-[#F7F8FC] border border-[#E8ECF4] rounded-xl text-xs space-y-3 text-slate-700">
                            <p><strong>Summary:</strong> {incidentResult.summary}</p>
                            <p><strong>Severity Rating:</strong> {incidentResult.severity}</p>
                            <p><strong>Remediation:</strong> {incidentResult.recommended_action}</p>
                            <p><strong>Gear Required:</strong> {incidentResult.resources_required.join(", ")}</p>
                            <p><strong>Resolution ETA:</strong> {incidentResult.time_estimate}</p>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* D. SUSTAINABILITY TAB */}
                  {activeTab === "sustainability" && (
                    <div className="space-y-8">
                      
                      <div className="bg-white border border-[#E8ECF4] p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                          <Zap className="w-5 h-5 text-amber-500" />
                          <h2 className="text-sm font-bold uppercase tracking-wider">Resource Load Coordinator</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="sustainability-attendance-tab" className="text-xs font-bold text-[#6B7280] block mb-1">Expected Attendance</label>
                            <input 
                              id="sustainability-attendance-tab"
                              type="number" 
                              value={attendance} 
                              onChange={(e) => setAttendance(Number(e.target.value))}
                              className="w-full bg-[#F7F8FC] border border-[#E8ECF4] rounded-lg py-2 px-3 text-sm outline-none text-[#111827]"
                            />
                          </div>
                          <div>
                            <label htmlFor="sustainability-temp-tab" className="text-xs font-bold text-[#6B7280] block mb-1">Target Temperature (°C)</label>
                            <input 
                              id="sustainability-temp-tab"
                              type="number" 
                              value={temp} 
                              onChange={(e) => setTemp(Number(e.target.value))}
                              className="w-full bg-[#F7F8FC] border border-[#E8ECF4] rounded-lg py-2 px-3 text-sm outline-none text-[#111827]"
                            />
                          </div>
                        </div>

                        <button 
                          onClick={handleSustainabilityPredict}
                          disabled={loading}
                          className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white transition rounded-lg text-xs font-bold uppercase tracking-wider"
                        >
                          Forecast resource loads
                        </button>

                        {sustainabilityResult && (
                          <div className="mt-6 p-4 bg-[#F7F8FC] border border-[#E8ECF4] rounded-xl text-xs grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-700">
                            <div>
                              <span className="text-[#6B7280] block">Electricity Forecast</span>
                              <strong className="text-lg text-[#111827]">{sustainabilityResult.electricity_mwh_est} MWh</strong>
                            </div>
                            <div>
                              <span className="text-[#6B7280] block">Water Consumption</span>
                              <strong className="text-lg text-[#111827]">{sustainabilityResult.water_liters_est.toLocaleString()} L</strong>
                            </div>
                            <div>
                              <span className="text-[#6B7280] block">Trash Yield</span>
                              <strong className="text-lg text-[#111827]">{sustainabilityResult.waste_tons_est} Tons</strong>
                            </div>
                            <div>
                              <span className="text-[#6B7280] block">Food Demand Forecast</span>
                              <strong className="text-lg text-[#111827]">{sustainabilityResult.food_demand_units_est.toLocaleString()} units</strong>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* E. VOLUNTEER AI SUPPORT TAB */}
                  {activeTab === "volunteer" && (
                    <div className="bg-white border border-[#E8ECF4] p-6 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Volunteer Resource Dispatch Console</h2>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="volunteer-badge-tab" className="text-xs font-bold text-[#6B7280] block mb-1">Badge Reference ID</label>
                          <input 
                            id="volunteer-badge-tab"
                            type="text" 
                            value={volunteerId} 
                            onChange={(e) => setVolunteerId(e.target.value)}
                            className="w-full bg-[#F7F8FC] border border-[#E8ECF4] rounded-lg py-2 px-3 text-sm outline-none text-[#111827]"
                          />
                        </div>
                        <div>
                          <label htmlFor="volunteer-sector-tab" className="text-xs font-bold text-[#6B7280] block mb-1">Sector coordinates</label>
                          <input 
                            id="volunteer-sector-tab"
                            type="text" 
                            value={volunteerLoc} 
                            onChange={(e) => setVolunteerLoc(e.target.value)}
                            className="w-full bg-[#F7F8FC] border border-[#E8ECF4] rounded-lg py-2 px-3 text-sm outline-none text-[#111827]"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="volunteer-query-tab" className="text-xs font-bold text-[#6B7280] block mb-1">Query input</label>
                        <div className="flex gap-2">
                          <input 
                            id="volunteer-query-tab"
                            type="text" 
                            value={volunteerQuery} 
                            onChange={(e) => setVolunteerQuery(e.target.value)}
                            className="flex-1 bg-[#F7F8FC] border border-[#E8ECF4] rounded-lg py-2.5 px-3 text-sm outline-none text-[#111827]"
                          />
                          <button 
                            onClick={() => handleVolunteerAsk()}
                            aria-label="Dispatch query"
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg"
                          >
                            Dispatch
                          </button>
                        </div>
                      </div>

                      {volunteerResult && (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-xs space-y-2">
                          <p className="text-emerald-700 font-bold">Target sector allocation: {volunteerResult.assigned_zone}</p>
                          <p className="text-slate-700">Action description: {volunteerResult.task_description}</p>
                          <p className="text-slate-500">Risk category: {volunteerResult.urgency_level}</p>
                        </div>
                      )}
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right sidebar AI Commander Panel (Persistent on desktop) */}
            <div className="space-y-8">
              
              {/* Scenario Decision Trigger (Moved to persistent sidebar for superior UX) */}
              <div className="bg-white border border-[#E8ECF4] p-6 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Megaphone className="w-5 h-5 text-indigo-500 animate-bounce" />
                  <h3 className="text-xs font-bold text-[#111827]">Operations Co-pilot</h3>
                </div>

                <div className="mb-4">
                  <label htmlFor="scen-select" className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1">Active Scenario</label>
                  <select
                    id="scen-select"
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    className="w-full bg-[#F7F8FC] border border-[#E8ECF4] rounded-lg py-2 px-3 text-xs outline-none text-[#111827]"
                  >
                    <option value="Sudden heavy rainstorm during egress peak">Sudden heavy rainstorm during egress peak</option>
                    <option value="Public metro line failure in zone C corridor">Public metro line failure in zone C corridor</option>
                    <option value="Security alert near Gate B concourse">Security alert near Gate B concourse</option>
                  </select>
                </div>

                <button 
                  onClick={handleTriggerDecision}
                  disabled={loading}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white transition rounded-lg text-[10px] font-bold uppercase tracking-wider"
                >
                  Orchestrate Coordinated Plan
                </button>

                {decisionResult && (
                  <div className="mt-4 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2">
                    <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest block">Commander Reasoning Stream</span>
                    <div className="text-[10px] space-y-1.5 text-slate-700">
                      {decisionResult.reasoning_steps.slice(0, 3).map((step: string, idx: number) => (
                        <p key={idx} className="flex gap-1.5">
                          <span className="text-indigo-600 font-bold">•</span>
                          {step}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Commander Panel */}
              <div className="bg-white border border-[#E8ECF4] p-6 rounded-2xl shadow-sm space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#E8ECF4]">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-[#4F46E5]" />
                    <h3 className="text-sm font-bold text-[#111827]">AI Commander</h3>
                  </div>
                  <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Online
                  </span>
                </div>

                {/* Match clock */}
                <div className="p-4 bg-[#F7F8FC] border border-[#E8ECF4] rounded-xl flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">Current Match</p>
                    <strong className="text-xs text-[#111827]">Mexico vs Japan</strong>
                    <p className="text-[9px] text-[#6B7280]">Group Stage • Match 24</p>
                  </div>
                  <span className="bg-red-500 text-white text-[11px] font-black px-2 py-1 rounded">
                    45:32
                  </span>
                </div>

                {/* Critical Alerts */}
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold text-[#6B7280] uppercase">
                    <span>Critical Alerts</span>
                    <span className="text-red-500 bg-red-50 px-1.5 py-0.5 rounded font-black">3</span>
                  </div>

                  <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl space-y-1">
                    <p className="text-xs font-bold text-red-700">Gate C Overcrowding</p>
                    <p className="text-[10px] text-red-600">Risk Level: High</p>
                  </div>
                  
                  <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl space-y-1">
                    <p className="text-xs font-bold text-amber-700">Heavy Rain Incoming</p>
                    <p className="text-[10px] text-amber-600">ETA: 32 minutes</p>
                  </div>
                </div>

                {/* AI Recommended Actions checklist */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest block">AI Recommended Actions</span>
                  
                  <div className="space-y-2">
                    {Object.keys(approvals).map((actName) => {
                      const details = approvals[actName];
                      return (
                        <div key={actName} className="p-3 bg-white border border-[#E8ECF4] rounded-xl flex items-center justify-between shadow-sm">
                          <div className="min-w-0 flex-1 pr-2">
                            <strong className="text-xs text-[#111827] block truncate">{actName}</strong>
                            <p className="text-[9px] text-[#6B7280]">Impact: {details.impact} • {details.confidence} confidence</p>
                          </div>
                          
                          <div>
                            {details.status === "PENDING" ? (
                              <button 
                                onClick={() => handleActionApproval(actName, "APPROVED")}
                                className="py-1 px-3 bg-[#4F46E5] hover:bg-indigo-700 text-white rounded text-[10px] font-bold uppercase transition"
                              >
                                Approve
                              </button>
                            ) : (
                              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase">
                                Approved
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button 
                    onClick={() => {
                      Object.keys(approvals).forEach(k => handleActionApproval(k, "APPROVED"));
                    }}
                    className="w-full mt-2 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white transition rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm"
                  >
                    Approve All Recommendations
                  </button>
                </div>

                {/* Commander Query Input */}
                <div className="border-t border-[#E8ECF4] pt-4">
                  <label htmlFor="commander-ask-side" className="sr-only">Ask StadiumMind AI</label>
                  <div className="flex gap-2">
                    <input 
                      id="commander-ask-side"
                      type="text"
                      placeholder="Ask StadiumMind AI..."
                      className="flex-1 bg-[#F7F8FC] border border-[#E8ECF4] rounded-lg py-2 px-3 text-xs outline-none text-[#111827] placeholder-[#6B7280]"
                    />
                    <button 
                      aria-label="Send Query"
                      className="p-2 bg-[#F7F8FC] border border-[#E8ECF4] hover:bg-slate-100 rounded-lg"
                    >
                      <Send className="w-3.5 h-3.5 text-[#6B7280]" />
                    </button>
                  </div>
                </div>

              </div>

              {/* AI Insights List */}
              <div className="bg-white border border-[#E8ECF4] p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-[#111827]">AI Insights</h3>
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#111827] font-semibold">Gate C congestion increasing</span>
                    <span className="text-[9px] text-[#6B7280]">2 min ago</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#111827] font-semibold">Rain probability in 30 mins</span>
                    <span className="text-[9px] text-[#6B7280]">5 min ago</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#111827] font-semibold">Spanish help requests</span>
                    <span className="text-[9px] text-[#6B7280]">7 min ago</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#111827] font-semibold">Waste collection behind</span>
                    <span className="text-[9px] text-[#6B7280]">10 min ago</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom row widgets: Incident Log Timeline & 6 deployment pills */}
        <div className="w-full px-4 md:px-8 lg:px-12 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Live Incident Timeline list */}
          <div className="bg-white border border-[#E8ECF4] p-6 rounded-2xl shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-[#111827]">Live Incident Timeline</h3>
              <button className="text-[10px] text-[#4F46E5] font-bold hover:underline">View All</button>
            </div>
            
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {timeline.map((evt) => (
                <div key={evt.id} className="relative pl-4 border-l border-[#E8ECF4] text-xs">
                  <span className="absolute top-1 left-[-4px] w-2 h-2 rounded-full bg-[#4F46E5]" />
                  <div className="flex justify-between text-[10px] text-[#6B7280] font-bold mb-0.5">
                    <span>{evt.title}</span>
                    <span>{evt.time}</span>
                  </div>
                  <p className="text-[11px] text-[#6B7280] leading-relaxed">{evt.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 6 Bottom Metric pills */}
          <div className="bg-white border border-[#E8ECF4] p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#111827] mb-2">Resource Deployments</h3>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#F7F8FC] border border-[#E8ECF4] rounded-xl text-center">
                <span className="text-[9px] text-[#6B7280] block font-semibold uppercase">Active Volunteers</span>
                <strong className="text-sm text-[#111827]">1,248</strong>
              </div>
              <div className="p-3 bg-[#F7F8FC] border border-[#E8ECF4] rounded-xl text-center">
                <span className="text-[9px] text-[#6B7280] block font-semibold uppercase">Medical Teams</span>
                <strong className="text-sm text-[#111827]">24</strong>
              </div>
              <div className="p-3 bg-[#F7F8FC] border border-[#E8ECF4] rounded-xl text-center">
                <span className="text-[9px] text-[#6B7280] block font-semibold uppercase">Shuttle Buses</span>
                <strong className="text-sm text-[#111827]">78</strong>
              </div>
              <div className="p-3 bg-[#F7F8FC] border border-[#E8ECF4] rounded-xl text-center">
                <span className="text-[9px] text-[#6B7280] block font-semibold uppercase">Parking Occupancy</span>
                <strong className="text-sm text-[#111827]">89%</strong>
              </div>
              <div className="p-3 bg-[#F7F8FC] border border-[#E8ECF4] rounded-xl text-center">
                <span className="text-[9px] text-[#6B7280] block font-semibold uppercase">Energy Usage</span>
                <strong className="text-sm text-[#111827]">72%</strong>
              </div>
              <div className="p-3 bg-[#F7F8FC] border border-[#E8ECF4] rounded-xl text-center">
                <span className="text-[9px] text-[#6B7280] block font-semibold uppercase">Waste Collected</span>
                <strong className="text-sm text-[#111827]">4.2 tons</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info bar */}
        <footer className="border-t border-[#E8ECF4] bg-white py-3.5 text-xs text-[#6B7280]">
          <div className="w-full px-4 md:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-semibold text-[#111827]">Live Operations</span>
              <span>• Last updated: 19:03:24 IST</span>
            </div>
            <div className="flex gap-6">
              <span>Sensors: 1,248 Online</span>
              <span>Avg Response: 120ms</span>
              <span className="font-semibold text-[#111827]">Data Source: Multi-Channel Fusion</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
