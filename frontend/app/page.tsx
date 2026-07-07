"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, Activity, Users, Bus, Zap, CloudRain, Trash2,
  Mic, MicOff, Search, Compass, AlertCircle, HelpCircle, FileText, CheckCircle,
  TrendingUp, RefreshCw, Send, ArrowRight, Accessibility, LayoutDashboard,
  Megaphone, ShieldCheck, Thermometer, Info, Sun, Moon, Volume2
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { api } from "../lib/api";

// Mock Charts Data for Premium Experience
const crowdTrendData = [
  { time: "18:00", Inflow: 2400, Outflow: 1800 },
  { time: "18:15", Inflow: 3800, Outflow: 2200 },
  { time: "18:30", Inflow: 4800, Outflow: 2900 },
  { time: "18:45", Inflow: 5900, Outflow: 3400 },
  { time: "19:00", Inflow: 4200, Outflow: 4100 },
  { time: "19:15", Inflow: 3100, Outflow: 4500 },
  { time: "19:30", Inflow: 2100, Outflow: 3800 },
];

const resourceUtilizationData = [
  { hour: "14:00", Electricity: 45, Water: 30, Waste: 20 },
  { hour: "16:00", Electricity: 60, Water: 55, Waste: 35 },
  { hour: "18:00", Electricity: 95, Water: 85, Waste: 60 },
  { hour: "20:00", Electricity: 110, Water: 120, Waste: 85 },
  { hour: "22:00", Electricity: 120, Water: 140, Waste: 95 },
  { hour: "00:00", Electricity: 80, Water: 75, Waste: 50 },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [systemAlerts, setSystemAlerts] = useState<string[]>([
    "Gate C approaching 90% capacity limit. Directing backups.",
    "Incoming storm cells detected: expected arrival in 35 mins."
  ]);
  
  const [telemetry, setTelemetry] = useState<any>({
    crowd_density: { status: "Warning", value: "Gate C High Flow" },
    transport: { status: "Optimal", value: "Metro 5 Min intervals" },
    medical: { status: "Good", value: "3 units active" },
    weather: { status: "Optimal", value: "Clear, 24°C" },
    security: { status: "Optimal", value: "All clear" },
    energy: { status: "Efficient", value: "240 kW solar" },
    waste: { status: "Optimal", value: "42% capacity" }
  });

  // 1. Crowd AI
  const [gateId, setGateId] = useState("Gate C");
  const [currentCount, setCurrentCount] = useState(4200);
  const [flowRate, setFlowRate] = useState(120);
  const [crowdPredictResult, setCrowdPredictResult] = useState<any>(null);

  // 2. AI Route Planner
  const [routeStart, setRouteStart] = useState("Section 105");
  const [routeEnd, setRouteEnd] = useState("Gate D");
  const [wheelchair, setWheelchair] = useState(false);
  const [elevator, setElevator] = useState(false);
  const [routeResult, setRouteResult] = useState<any>(null);

  // 3. Volunteer AI
  const [volunteerId, setVolunteerId] = useState("VOL-409");
  const [volunteerLoc, setVolunteerLoc] = useState("Zone A Corridor");
  const [volunteerQuery, setVolunteerQuery] = useState("Where should I go?");
  const [volunteerResult, setVolunteerResult] = useState<any>(null);

  // 4. Sustainability AI
  const [attendance, setAttendance] = useState(65000);
  const [temp, setTemp] = useState(27.5);
  const [sustainabilityResult, setSustainabilityResult] = useState<any>(null);

  // 5. Emergency AI
  const [emergencyText, setEmergencyText] = useState("Fan collapsed near Section 218");
  const [emergencyResult, setEmergencyResult] = useState<any>(null);

  // 6. Voice / Speech
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState("");

  // 8. AI Decision Engine
  const [scenario, setScenario] = useState("Sudden heavy rainstorm during egress peak");
  const [decisionResult, setDecisionResult] = useState<any>(null);

  // 10. AI Incident Report Generator
  const [rawIncidentText, setRawIncidentText] = useState("Fan slipped on wet stairs, minor leg cut, medic applied bandage.");
  const [incidentResult, setIncidentResult] = useState<any>(null);

  // Fetch telemetry updates
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
        setVoiceQuery("Listening to command...");
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
        setVoiceQuery("Speech recognition error.");
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

  return (
    <div className={`min-h-screen font-sans transition-all duration-300 ${
      highContrast 
        ? "bg-black text-white selection:bg-yellow-400 selection:text-black" 
        : "bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white"
    }`}>
      
      {/* Background Gradient Orbs */}
      {!highContrast && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[150px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[150px]" />
        </div>
      )}

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Header Block */}
        <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
                <ShieldAlert className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                  StadiumMind AI
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">COMMAND</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  FIFA World Cup 2026 Operations
                </p>
              </div>
            </div>

            {/* Live Command Bar */}
            <div className="flex items-center gap-3 flex-wrap">
              
              {/* Accessibility Toggle */}
              <button
                onClick={() => setHighContrast(!highContrast)}
                aria-label="Toggle High Contrast Mode"
                className="p-2 rounded-lg border border-slate-700/60 hover:bg-slate-900 transition text-slate-400 hover:text-slate-100"
              >
                {highContrast ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              <button 
                onClick={fetchTelemetry}
                aria-label="Refresh Telemetry data"
                className="p-2 rounded-lg border border-slate-700/60 hover:bg-slate-900 transition text-slate-400 hover:text-slate-100"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Speech Voice Input Action */}
              <button
                onClick={handleVoiceInput}
                aria-label={isListening ? "Listening to microphone" : "Voice command input"}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition duration-300 shadow-md text-xs tracking-wider uppercase ${
                  isListening 
                    ? "bg-red-500 text-white animate-pulse" 
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Mic Listening</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Voice Control</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </header>

        {/* Global Warning Ticker */}
        {systemAlerts.length > 0 && (
          <div className="bg-amber-950/20 border-b border-amber-500/20 py-2 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto flex items-center gap-3 text-xs text-amber-300 font-semibold">
              <Megaphone className="w-4 h-4 text-amber-400 flex-shrink-0 animate-bounce" />
              <div className="flex gap-8 animate-marquee whitespace-nowrap">
                {systemAlerts.map((alertText, index) => (
                  <span key={index} className="mr-8">• {alertText}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
          
          {/* Navigation Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <nav className="space-y-1.5" aria-label="Command sections">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  activeTab === "overview" 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Overview Command
              </button>
              <button
                onClick={() => setActiveTab("crowd")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  activeTab === "crowd" 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                }`}
              >
                <Users className="w-4 h-4" />
                Crowd AI & Traffic
              </button>
              <button
                onClick={() => setActiveTab("emergency")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  activeTab === "emergency" 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                Emergency & EMS
              </button>
              <button
                onClick={() => setActiveTab("sustainability")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  activeTab === "sustainability" 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                }`}
              >
                <Zap className="w-4 h-4" />
                Sustainability Grid
              </button>
              <button
                onClick={() => setActiveTab("volunteer")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  activeTab === "volunteer" 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                Volunteer AI
              </button>
            </nav>
            
            {/* Simulation Status Card */}
            <div className="mt-8 p-4 rounded-2xl glass-panel border-slate-800/80 bg-slate-900/20 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-400 uppercase tracking-wider">Simulation Core</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-slate-300">FastAPI backend connected at `localhost:8000`. Offline fallbacks active.</p>
              
              {/* Voice waveform animation if listening */}
              {isListening && (
                <div className="flex items-center justify-center gap-1 py-2">
                  <div className="w-1 h-6 bg-blue-500 rounded animate-bounce [animation-delay:0.1s]"></div>
                  <div className="w-1 h-8 bg-indigo-500 rounded animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-5 bg-purple-500 rounded animate-bounce [animation-delay:0.3s]"></div>
                  <div className="w-1 h-7 bg-blue-400 rounded animate-bounce [animation-delay:0.4s]"></div>
                </div>
              )}
            </div>
          </aside>

          {/* Tab Content Panels */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                
                {/* 1. OVERVIEW PANEL */}
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    
                    {/* Live Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-blue-500">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Crowd Density</span>
                          <Users className="w-4 h-4 text-blue-400" />
                        </div>
                        <p className="text-2xl font-black">{telemetry.crowd_density.value}</p>
                        <span className="text-xs text-amber-400 flex items-center gap-1 mt-2">
                          <AlertCircle className="w-3.5 h-3.5" /> High volume threshold
                        </span>
                      </div>

                      <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-emerald-500">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Transport Flow</span>
                          <Bus className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-2xl font-black">{telemetry.transport.value}</p>
                        <span className="text-xs text-emerald-400 flex items-center gap-1 mt-2">
                          <CheckCircle className="w-3.5 h-3.5" /> Optimal service intervals
                        </span>
                      </div>

                      <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-purple-500">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Weather telemetry</span>
                          <CloudRain className="w-4 h-4 text-purple-400" />
                        </div>
                        <p className="text-2xl font-black">{telemetry.weather.value}</p>
                        <span className="text-xs text-purple-400 flex items-center gap-1 mt-2">
                          <Info className="w-3.5 h-3.5" /> Rain expected post-match
                        </span>
                      </div>

                    </div>

                    {/* Simulation Graph */}
                    <div className="glass-panel p-6 rounded-2xl">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Live Inflow/Egress Trend</h2>
                        <span className="text-xs bg-slate-900 border border-slate-700/60 rounded px-2.5 py-1 text-slate-300">Real-time Simulation</span>
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={crowdTrendData}>
                            <defs>
                              <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                            <YAxis stroke="#64748b" fontSize={11} />
                            <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.1)" }} />
                            <Area type="monotone" dataKey="Inflow" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInflow)" />
                            <Area type="monotone" dataKey="Outflow" stroke="#10b981" fillOpacity={1} fill="url(#colorOutflow)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* AI Decision Engine Panel */}
                    <div className="glass-panel p-6 rounded-2xl">
                      <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-purple-400" />
                        <h2 className="text-base font-bold">AI Coordinated Decision Engine</h2>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="scenario-select" className="text-xs font-semibold text-slate-400 block mb-1">Egress Incident Trigger</label>
                        <select
                          id="scenario-select"
                          value={scenario}
                          onChange={(e) => setScenario(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-100"
                        >
                          <option value="Sudden heavy rainstorm during egress peak">Sudden heavy rainstorm during egress peak</option>
                          <option value="Public metro line failure in zone C corridor">Public metro line failure in zone C corridor</option>
                          <option value="Security alert near Gate B concourse">Security alert near Gate B concourse</option>
                        </select>
                      </div>

                      <button 
                        onClick={handleTriggerDecision}
                        disabled={loading}
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 transition rounded-lg text-sm font-semibold shadow-md shadow-purple-500/20"
                      >
                        Simulate Action Plan
                      </button>

                      {decisionResult && (
                        <div className="mt-6 space-y-4">
                          <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-xl">
                            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Identified Root Scenario:</span>
                            <p className="text-sm font-semibold mt-1">{decisionResult.primary_event}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                              <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-2">Consequence Cascade</span>
                              <ul className="space-y-2 text-xs text-slate-300">
                                {decisionResult.consequences.map((c: string, idx: number) => (
                                  <li key={idx} className="flex gap-2 items-start">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                    {c}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">Mitigation Actions</span>
                              <ul className="space-y-2 text-xs text-slate-300">
                                {decisionResult.actions.map((a: string, idx: number) => (
                                  <li key={idx} className="flex gap-2 items-start">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                    {a}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* 2. CROWD & TRAFFIC PANEL */}
                {activeTab === "crowd" && (
                  <div className="space-y-8">
                    
                    {/* Heatmap Predictor Inputs */}
                    <div className="glass-panel p-6 rounded-2xl">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        <h2 className="text-base font-bold">Egress Traffic & Congestion Predictor</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label htmlFor="gate-selector" className="text-xs font-bold text-slate-400 block mb-1">Target Gate</label>
                          <select 
                            id="gate-selector"
                            value={gateId} 
                            onChange={(e) => setGateId(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2.5 px-3 text-sm focus:outline-none"
                          >
                            <option value="Gate A">Gate A (Main North)</option>
                            <option value="Gate B">Gate B (East Wing)</option>
                            <option value="Gate C">Gate C (South Egress)</option>
                            <option value="Gate D">Gate D (West Concourse)</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="inflow-input" className="text-xs font-bold text-slate-400 block mb-1">Current Gate Inflow (hr)</label>
                          <input 
                            id="inflow-input"
                            type="number" 
                            value={currentCount} 
                            onChange={(e) => setCurrentCount(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-sm focus:outline-none text-slate-100"
                          />
                        </div>
                        <div>
                          <label htmlFor="egress-input" className="text-xs font-bold text-slate-400 block mb-1">Egress Flow (per min)</label>
                          <input 
                            id="egress-input"
                            type="number" 
                            value={flowRate} 
                            onChange={(e) => setFlowRate(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-sm focus:outline-none text-slate-100"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={handleCrowdPredict}
                        disabled={loading}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-sm font-semibold shadow-md shadow-blue-500/20"
                      >
                        Run Ingress Analysis
                      </button>

                      {crowdPredictResult && (
                        <div className={`mt-6 p-4 rounded-xl border text-sm ${
                          crowdPredictResult.congestion_status === "HIGH" 
                            ? "bg-red-950/20 border-red-500/30 text-red-200" 
                            : "bg-slate-900/60 border-slate-800 text-slate-300"
                        }`}>
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Simulation Status</span>
                            <span className={`px-2.5 py-0.5 rounded text-xs font-black uppercase ${
                              crowdPredictResult.congestion_status === "HIGH" ? "bg-red-500 text-white animate-pulse" : "bg-emerald-500 text-white"
                            }`}>
                              {crowdPredictResult.congestion_status}
                            </span>
                          </div>
                          <p className="mb-2"><strong>Time to limit threshold:</strong> {crowdPredictResult.estimated_minutes_to_limit} minutes</p>
                          <p><strong>Action Recommendation:</strong> {crowdPredictResult.recommendation}</p>
                        </div>
                      )}
                    </div>

                    {/* Routing Panel */}
                    <div className="glass-panel p-6 rounded-2xl">
                      <div className="flex items-center gap-2 mb-4">
                        <Compass className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-base font-bold">AI Adaptive Pathfinding</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="route-start-selector" className="text-xs font-bold text-slate-400 block mb-1">Starting Concourse/Zone</label>
                          <input 
                            id="route-start-selector"
                            type="text" 
                            value={routeStart} 
                            onChange={(e) => setRouteStart(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor="route-end-selector" className="text-xs font-bold text-slate-400 block mb-1">Target Egress Gate</label>
                          <input 
                            id="route-end-selector"
                            type="text" 
                            value={routeEnd} 
                            onChange={(e) => setRouteEnd(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex gap-6 mb-4">
                        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={wheelchair} 
                            onChange={(e) => setWheelchair(e.target.checked)}
                            className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                          />
                          Wheelchair Access Needed
                        </label>
                        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={elevator} 
                            onChange={(e) => setElevator(e.target.checked)}
                            className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                          />
                          Elevators Only
                        </label>
                      </div>

                      <button 
                        onClick={handleRoutePlan}
                        disabled={loading}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 transition rounded-lg text-sm font-semibold"
                      >
                        Compute Safest Pathway
                      </button>

                      {routeResult && (
                        <div className="mt-6 p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-sm">
                          <p className="mb-2"><strong>Recommended route coordinates:</strong> {routeResult.path.join(" ➔ ")}</p>
                          <p className="mb-2"><strong>ETA:</strong> {routeResult.estimated_minutes} minutes</p>
                          {routeResult.accessibility_warnings.length > 0 && (
                            <div className="text-amber-400 flex items-start gap-1.5 mt-2">
                              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div className="text-xs">
                                {routeResult.accessibility_warnings.map((w: string, idx: number) => (
                                  <p key={idx}>{w}</p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* 3. EMERGENCY PANEL */}
                {activeTab === "emergency" && (
                  <div className="space-y-8">
                    
                    {/* Live Emergency Log Dispatcher */}
                    <div className="glass-panel p-6 rounded-2xl border-red-500/20 bg-red-950/5">
                      <div className="flex items-center gap-2 mb-4 text-red-400">
                        <ShieldAlert className="w-5 h-5" />
                        <h2 className="text-base font-bold">EMS Dispatch Control</h2>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="emergency-alert-input" className="text-xs font-bold text-slate-400 block mb-1">Radio Broadcast Transcript / Alarm text</label>
                        <textarea 
                          id="emergency-alert-input"
                          rows={3}
                          value={emergencyText} 
                          onChange={(e) => setEmergencyText(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-100"
                        />
                      </div>

                      <button 
                        onClick={() => handleEmergencyReport()}
                        disabled={loading}
                        className="w-full py-2.5 bg-red-600 hover:bg-red-700 transition rounded-lg text-sm font-semibold"
                      >
                        Deploy Rescue Units
                      </button>

                      {emergencyResult && (
                        <div className="mt-6 p-4 bg-red-950/20 border border-red-500/30 rounded-xl text-sm">
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <span className="text-xs text-slate-400 block">Extracted Location</span>
                              <strong className="text-red-200">{emergencyResult.extracted_location}</strong>
                            </div>
                            <div>
                              <span className="text-xs text-slate-400 block">Incident Severity</span>
                              <span className="px-2 py-0.5 rounded text-xs font-black bg-red-500 text-white animate-pulse">
                                {emergencyResult.severity}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1.5 border-t border-red-500/20 pt-3 text-xs text-slate-300">
                            <p><strong>Dispatched Team:</strong> {emergencyResult.dispatched_unit}</p>
                            <p><strong>Cleared Path:</strong> {emergencyResult.suggested_route}</p>
                            <p><strong>Expected Arrival:</strong> {emergencyResult.eta_minutes} mins</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Incident Report Generator */}
                    <div className="glass-panel p-6 rounded-2xl">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-teal-400" />
                        <h2 className="text-base font-bold">AI Incident Report Generator</h2>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="raw-log-input" className="text-xs font-bold text-slate-400 block mb-1">Raw Incident Text (Staff Logs)</label>
                        <textarea 
                          id="raw-log-input"
                          rows={3}
                          value={rawIncidentText} 
                          onChange={(e) => setRawIncidentText(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-sm focus:outline-none"
                        />
                      </div>

                      <button 
                        onClick={handleGenerateIncident}
                        disabled={loading}
                        className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 transition rounded-lg text-sm font-semibold"
                      >
                        Create Formal Report
                      </button>

                      {incidentResult && (
                        <div className="mt-6 p-4 bg-slate-900/60 border border-slate-850 rounded-xl text-xs space-y-3 text-slate-300">
                          <p><strong>Summary:</strong> {incidentResult.summary}</p>
                          <p><strong>Urgency Level:</strong> {incidentResult.severity}</p>
                          <p><strong>Remediation Action:</strong> {incidentResult.recommended_action}</p>
                          <p><strong>Required Gear:</strong> {incidentResult.resources_required.join(", ")}</p>
                          <p><strong>Resolution ETA:</strong> {incidentResult.time_estimate}</p>
                          <p><strong>Escalation Tier:</strong> {incidentResult.escalation_level}</p>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* 4. SUSTAINABILITY PANEL */}
                {activeTab === "sustainability" && (
                  <div className="space-y-8">
                    
                    {/* Forecasting input */}
                    <div className="glass-panel p-6 rounded-2xl">
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-amber-400" />
                        <h2 className="text-base font-bold">Sustainability Forecast Grid</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="attendance-forecast-input" className="text-xs font-bold text-slate-400 block mb-1">Expected Attendance</label>
                          <input 
                            id="attendance-forecast-input"
                            type="number" 
                            value={attendance} 
                            onChange={(e) => setAttendance(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor="ambient-temp-input" className="text-xs font-bold text-slate-400 block mb-1">Ambient Temperature (°C)</label>
                          <input 
                            id="ambient-temp-input"
                            type="number" 
                            value={temp} 
                            onChange={(e) => setTemp(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={handleSustainabilityPredict}
                        disabled={loading}
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 transition rounded-lg text-sm font-semibold"
                      >
                        Forecast Resource Loads
                      </button>

                      {sustainabilityResult && (
                        <div className="mt-6 p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300">
                          <div>
                            <span className="text-slate-400 block">Electricity Forecast</span>
                            <strong className="text-lg text-slate-100">{sustainabilityResult.electricity_mwh_est} MWh</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Water Consumption</span>
                            <strong className="text-lg text-slate-100">{sustainabilityResult.water_liters_est.toLocaleString()} L</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Estimated Solid Waste</span>
                            <strong className="text-lg text-slate-100">{sustainabilityResult.waste_tons_est} Tons</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Food Units Demand</span>
                            <strong className="text-lg text-slate-100">{sustainabilityResult.food_demand_units_est.toLocaleString()} units</strong>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chart Resource utilization */}
                    <div className="glass-panel p-6 rounded-2xl">
                      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Historical Load Patterns</h2>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={resourceUtilizationData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                            <YAxis stroke="#64748b" fontSize={11} />
                            <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.1)" }} />
                            <Line type="monotone" dataKey="Electricity" stroke="#f59e0b" strokeWidth={2.5} />
                            <Line type="monotone" dataKey="Water" stroke="#3b82f6" strokeWidth={2.5} />
                            <Line type="monotone" dataKey="Waste" stroke="#a855f7" strokeWidth={2.5} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </div>
                )}

                {/* 5. VOLUNTEER PANEL */}
                {activeTab === "volunteer" && (
                  <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <HelpCircle className="w-5 h-5 text-emerald-400" />
                      <h2 className="text-base font-bold">Volunteer AI Support</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="volunteer-id-field" className="text-xs font-bold text-slate-400 block mb-1">Volunteer Badge ID</label>
                        <input 
                          id="volunteer-id-field"
                          type="text" 
                          value={volunteerId} 
                          onChange={(e) => setVolunteerId(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="volunteer-loc-field" className="text-xs font-bold text-slate-400 block mb-1">Current Sector Location</label>
                        <input 
                          id="volunteer-loc-field"
                          type="text" 
                          value={volunteerLoc} 
                          onChange={(e) => setVolunteerLoc(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-sm focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="volunteer-query-field" className="text-xs font-bold text-slate-400 block mb-1">Ask the AI Command</label>
                      <div className="flex gap-2">
                        <input 
                          id="volunteer-query-field"
                          type="text" 
                          value={volunteerQuery} 
                          onChange={(e) => setVolunteerQuery(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-700/60 rounded-lg py-2.5 px-3 text-sm focus:outline-none text-slate-100"
                        />
                        <button 
                          onClick={() => handleVolunteerAsk()}
                          aria-label="Send Query"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-bold"
                        >
                          Send
                        </button>
                      </div>
                    </div>

                    {volunteerResult && (
                      <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs space-y-2">
                        <p className="text-emerald-400 font-bold">Assigned Station: {volunteerResult.assigned_zone}</p>
                        <p className="text-slate-300">Task Details: {volunteerResult.task_description}</p>
                        <p className="text-slate-400 font-semibold">Priority Tier: {volunteerResult.urgency_level}</p>
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
