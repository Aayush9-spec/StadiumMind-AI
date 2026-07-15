"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, Activity, Users, Bus, Zap, CloudRain,
  Mic, MicOff, Search, Compass, AlertCircle, FileText, CheckCircle,
  TrendingUp, RefreshCw, Send, ArrowRight, Accessibility, LayoutDashboard,
  Megaphone, ShieldCheck, Info, Sun, Moon, Volume2, ListOrdered, BrainCircuit, Bell, User,
  Shield, BarChart4, HelpCircle
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { api } from "../lib/api";
import CommandPalette from "../components/CommandPalette";
import DigitalTwin from "../components/DigitalTwin";
import StadiumBackground from "../components/StadiumBackground";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import FooterStatus from "../components/layout/FooterStatus";
import MetricCard from "../components/dashboard/MetricCard";
import AIOrb from "../components/ui/AIOrb";
import AlertPanel from "../components/dashboard/AlertPanel";
import RecommendationCard from "../components/dashboard/RecommendationCard";
import CrowdForecastChart from "../components/dashboard/CrowdForecastChart";
import Timeline from "../components/dashboard/Timeline";
import StatsCard from "../components/common/StatsCard";
import AIChatWidget from "../components/ai/AIChatWidget";

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

  const [commanderQuery, setCommanderQuery] = useState("");

  const handleCommanderAsk = useCallback(async () => {
    if (!commanderQuery.trim()) return;
    setLoading(true);
    try {
      const res = await api.askVolunteer("COMMANDER", "Command Center", commanderQuery);
      setTimeline((prev) => [
        { id: Date.now(), time: "Just Now", title: `Commander: ${commanderQuery}`, detail: `Result: ${res.task_description} (Zone: ${res.assigned_zone})` },
        ...prev
      ]);
      setCommanderQuery("");
    } catch (e) {
      alert("Error calling AI agent. Please verify your backend server connection.");
    } finally {
      setLoading(false);
    }
  }, [commanderQuery]);

  // Command palette keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchTelemetry = useCallback(async () => {
    try {
      const data = await api.getTelemetry();
      setTelemetry(data);
    } catch (e) {
      console.warn("Failed fetching telemetry from backend, using default mock data.");
    }
  }, []);

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 15000);
    return () => clearInterval(interval);
  }, [fetchTelemetry]);

  const recognitionRef = useRef<any>(null);



  const handleCrowdPredict = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.predictCrowd(gateId, currentCount, flowRate);
      setCrowdPredictResult(res);
      setTimeline((prev) => [
        { id: Date.now(), time: "Just Now", title: "Crowd Prediction Computed", detail: `Gate ${gateId} capacity threshold predicted. status: ${res.congestion_status}.` },
        ...prev
      ]);
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [gateId, currentCount, flowRate]);

  const handleRoutePlan = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.planRoute(routeStart, routeEnd, wheelchair, elevator);
      setRouteResult(res);
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [routeStart, routeEnd, wheelchair, elevator]);

  const handleVolunteerAsk = useCallback(async (queryText?: string) => {
    setLoading(true);
    try {
      const textToUse = queryText || volunteerQuery;
      const res = await api.askVolunteer(volunteerId, volunteerLoc, textToUse);
      setVolunteerResult(res);
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [volunteerId, volunteerLoc, volunteerQuery]);

  const handleSustainabilityPredict = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.predictSustainability(attendance, temp);
      setSustainabilityResult(res);
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [attendance, temp]);

  const handleEmergencyReport = useCallback(async (customText?: string) => {
    setLoading(true);
    try {
      const textToUse = customText || emergencyText;
      const res = await api.reportEmergency(textToUse);
      setEmergencyResult(res);
      setTimeline((prev) => [
        { id: Date.now(), time: "Just Now", title: "Rescue EMS Dispatched", detail: `${res.dispatched_unit} routed via ${res.suggested_route}. ETA: ${res.eta_minutes} mins.` },
        ...prev
      ]);
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [emergencyText]);

  const handleTriggerDecision = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.triggerDecision(scenario);
      setDecisionResult(res);
      const newApprovals: Record<string, { status: string; impact: string; confidence: string }> = {};
      res.actions.forEach((act: string) => {
        newApprovals[act] = { status: "PENDING", impact: "High", confidence: "95%" };
      });
      setApprovals(newApprovals);
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [scenario]);

  const handleGenerateIncident = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.generateIncidentReport(rawIncidentText);
      setIncidentResult(res);
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [rawIncidentText]);

  const handleActionApproval = useCallback((actionKey: string, status: string) => {
    setApprovals((prev) => ({
      ...prev,
      [actionKey]: { ...prev[actionKey], status }
    }));
    setTimeline((prev) => [
      { id: Date.now(), time: "Just Now", title: `Decision Approved: ${actionKey}`, detail: `Operations coordinator approved task assignment.` },
      ...prev
    ]);
  }, []);

  const handleVoiceInput = useCallback(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceQuery("Listening...");
    };

    recognition.onresult = async (event: unknown) => {
      const speechEvent = event as any;
      const text = speechEvent.results[0][0].transcript;
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

    recognitionRef.current = recognition;
    recognition.start();
  }, [isListening, handleEmergencyReport, handleVolunteerAsk]);
  return (
    <div className={`min-h-screen font-sans relative transition-all duration-300 ${
      highContrast 
        ? "bg-black text-white selection:bg-yellow-400 selection:text-black" 
        : "text-[#F8FAFC] selection:bg-indigo-600 selection:text-white"
    }`}>
      
      {/* Layered Stadium Background Visuals */}
      <StadiumBackground />
      
      {/* Main Layout Container */}
      <main className="relative z-10 flex flex-col min-h-screen">
        
        {/* Header Block Component */}
        <Navbar
          isListening={isListening}
          highContrast={highContrast}
          onToggleContrast={() => setHighContrast(!highContrast)}
          onVoiceClick={handleVoiceInput}
        />

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
          
          {/* Sidebar Navigation component */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

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
                        
                        <MetricCard
                          title="Inflow Congestion"
                          value={telemetry.crowd_density.value}
                          badgeText="High Risk"
                          badgeStyle="red"
                          trendText="↑ 18% vs last 15 min"
                          accentColor="red"
                          sparklineData={sparklineDataUp}
                          sparklineColor="#EF4444"
                        />

                        <MetricCard
                          title="Egress Transit"
                          value={telemetry.transport.value}
                          badgeText="Optimal"
                          badgeStyle="emerald"
                          trendText="On-time performance"
                          accentColor="emerald"
                          sparklineData={sparklineDataDown}
                          sparklineColor="#16A34A"
                        />

                        <MetricCard
                          title="Environmental"
                          value={telemetry.weather.value}
                          badgeText="Clear"
                          badgeStyle="blue"
                          trendText="Wind 10.8 km/h"
                          accentColor="blue"
                          icon={<CloudRain className="w-6 h-6 text-blue-400" />}
                        />

                        <MetricCard
                          title="Live Attendance"
                          value="62,845"
                          badgeText="↑ 1,245 today"
                          badgeStyle="indigo"
                          trendText="Capacity: 78%"
                          accentColor="indigo"
                          icon={<Users className="w-6 h-6 text-indigo-400" />}
                        />

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

                       {/* Crowd Flow vs Forecast Chart Component */}
                       <CrowdForecastChart data={crowdTrendData} />
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
                      <div className="glass-card p-6">
                        <div className="flex items-center gap-2.5 mb-5">
                          <Compass className="w-5 h-5 text-indigo-400" />
                          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">AI Pathfinding Navigation Coordinator</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="route-start-tab" className="text-xs font-bold text-slate-400 block mb-1.5">Starting Location Sector</label>
                            <input 
                              id="route-start-tab"
                              type="text" 
                              value={routeStart} 
                              onChange={(e) => setRouteStart(e.target.value)}
                              className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm outline-none text-white focus:bg-slate-955 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="route-end-tab" className="text-xs font-bold text-slate-400 block mb-1.5">Egress target Gate</label>
                            <input 
                              id="route-end-tab"
                              type="text" 
                              value={routeEnd} 
                              onChange={(e) => setRouteEnd(e.target.value)}
                              className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm outline-none text-white focus:bg-slate-955 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500"
                            />
                          </div>
                        </div>

                        <div className="flex gap-6 mb-5">
                          <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-300 cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={wheelchair} 
                              onChange={(e) => setWheelchair(e.target.checked)}
                              className="w-4 h-4 rounded border-white/10 bg-slate-950 text-indigo-650 focus:ring-indigo-500/20 cursor-pointer"
                            />
                            Wheelchair Access Required
                          </label>
                          <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-300 cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={elevator} 
                              onChange={(e) => setElevator(e.target.checked)}
                              className="w-4 h-4 rounded border-white/10 bg-slate-950 text-indigo-650 focus:ring-indigo-500/20 cursor-pointer"
                            />
                            Elevators prioritize
                          </label>
                        </div>

                        <button 
                          onClick={handleRoutePlan}
                          disabled={loading}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 focus:ring-2 focus:ring-indigo-500/20 transition-all rounded-xl text-xs font-bold text-white uppercase tracking-wider shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
                        >
                          Map safest route coordinates
                        </button>

                        {routeResult && (
                          <div className="mt-6 p-4 bg-slate-900/60 border border-white/10 rounded-xl text-xs space-y-1">
                            <p className="text-slate-200"><strong>Computed Pathway:</strong> {routeResult.path.join(" ➔ ")}</p>
                            <p className="text-slate-350"><strong>ETA:</strong> {routeResult.estimated_minutes} minutes</p>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* C. EMERGENCY TAB */}
                  {activeTab === "emergency" && (
                    <div className="space-y-8">
                      
                      <div className="glass-card p-6 border-l-4 border-l-red-500">
                        <div className="flex items-center gap-2 mb-4 text-red-400">
                          <ShieldAlert className="w-5 h-5 animate-pulse" />
                          <h2 className="text-sm font-bold uppercase tracking-wider">Rescue EMS Dispatcher Console</h2>
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="emergency-alert-input-tab" className="text-xs font-bold text-slate-400 block mb-1.5">Radio Alert Transcript (Live Feed)</label>
                          <textarea 
                            id="emergency-alert-input-tab"
                            rows={3}
                            value={emergencyText} 
                            onChange={(e) => setEmergencyText(e.target.value)}
                            className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm outline-none text-white focus:bg-slate-955 focus:border-red-550 focus:ring-2 focus:ring-red-550/10 transition-all placeholder:text-slate-500"
                          />
                        </div>

                        <button 
                          onClick={() => handleEmergencyReport()}
                          disabled={loading}
                          className="w-full py-3 bg-red-600 hover:bg-red-700 active:bg-red-850 focus:ring-2 focus:ring-red-500/20 transition-all rounded-xl text-xs font-bold text-white uppercase tracking-wider shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
                        >
                          Dispatch rescue teams
                        </button>

                        {emergencyResult && (
                          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs">
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <span className="text-slate-400 block uppercase tracking-wider text-[10px] font-bold">Extracted Coordinates</span>
                                <strong className="text-red-400 text-sm font-bold">{emergencyResult.extracted_location}</strong>
                              </div>
                              <div>
                                <span className="text-slate-400 block uppercase tracking-wider text-[10px] font-bold">Risk Tier</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-650 text-white animate-pulse">
                                  {emergencyResult.severity}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-1.5 border-t border-white/10 pt-3 text-slate-300">
                              <p><strong>Dispatched Team:</strong> {emergencyResult.dispatched_unit}</p>
                              <p><strong>Cleared Route:</strong> {emergencyResult.suggested_route}</p>
                              <p><strong>Expected Arrival:</strong> {emergencyResult.eta_minutes} mins</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="glass-card p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <FileText className="w-5 h-5 text-teal-400" />
                          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">AI Incident Report Compiler</h2>
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="incident-raw-text-tab" className="text-xs font-bold text-slate-400 block mb-1.5">Raw radio log text</label>
                          <textarea 
                            id="incident-raw-text-tab"
                            rows={3}
                            value={rawIncidentText} 
                            onChange={(e) => setRawIncidentText(e.target.value)}
                            className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm outline-none text-white focus:bg-slate-955 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all placeholder:text-slate-500"
                          />
                        </div>

                        <button 
                          onClick={handleGenerateIncident}
                          disabled={loading}
                          className="w-full py-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 focus:ring-2 focus:ring-teal-500/20 transition-all rounded-xl text-xs font-bold text-white uppercase tracking-wider shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
                        >
                          Compile formal incident record
                        </button>

                        {incidentResult && (
                          <div className="mt-6 p-4 bg-slate-900/60 border border-white/10 rounded-xl text-xs space-y-3 text-slate-300">
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
                      
                      <div className="glass-card p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Zap className="w-5 h-5 text-amber-400" />
                          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Resource Load Coordinator</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="sustainability-attendance-tab" className="text-xs font-bold text-slate-400 block mb-1.5">Expected Attendance</label>
                            <input 
                              id="sustainability-attendance-tab"
                              type="number" 
                              value={attendance} 
                              onChange={(e) => setAttendance(Number(e.target.value))}
                              className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm outline-none text-white focus:bg-slate-955 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="sustainability-temp-tab" className="text-xs font-bold text-slate-400 block mb-1.5">Target Temperature (°C)</label>
                            <input 
                              id="sustainability-temp-tab"
                              type="number" 
                              value={temp} 
                              onChange={(e) => setTemp(Number(e.target.value))}
                              className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm outline-none text-white focus:bg-slate-955 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500"
                            />
                          </div>
                        </div>

                        <button 
                          onClick={handleSustainabilityPredict}
                          disabled={loading}
                          className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 focus:ring-2 focus:ring-amber-500/20 transition-all rounded-xl text-xs font-bold text-white uppercase tracking-wider shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
                        >
                          Forecast resource loads
                        </button>

                        {sustainabilityResult && (
                          <div className="mt-6 p-4 bg-slate-900/60 border border-white/10 rounded-xl text-xs grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300">
                            <div>
                              <span className="text-slate-400 block font-semibold mb-0.5">Electricity Forecast</span>
                              <strong className="text-lg text-slate-200 font-extrabold">{sustainabilityResult.electricity_mwh_est} MWh</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold mb-0.5">Water Consumption</span>
                              <strong className="text-lg text-slate-200 font-extrabold">{sustainabilityResult.water_liters_est.toLocaleString()} L</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold mb-0.5">Trash Yield</span>
                              <strong className="text-lg text-slate-200 font-extrabold">{sustainabilityResult.waste_tons_est} Tons</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold mb-0.5">Food Demand Forecast</span>
                              <strong className="text-lg text-slate-200 font-extrabold">{sustainabilityResult.food_demand_units_est.toLocaleString()} units</strong>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* E. VOLUNTEER AI SUPPORT TAB */}
                  {activeTab === "volunteer" && (
                    <div className="glass-card p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-emerald-450" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Volunteer Resource Dispatch Console</h2>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="volunteer-badge-tab" className="text-xs font-bold text-slate-400 block mb-1.5">Badge Reference ID</label>
                          <input 
                            id="volunteer-badge-tab"
                            type="text" 
                            value={volunteerId} 
                            onChange={(e) => setVolunteerId(e.target.value)}
                            className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm outline-none text-white focus:bg-slate-955 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="volunteer-sector-tab" className="text-xs font-bold text-slate-400 block mb-1.5">Sector coordinates</label>
                          <input 
                            id="volunteer-sector-tab"
                            type="text" 
                            value={volunteerLoc} 
                            onChange={(e) => setVolunteerLoc(e.target.value)}
                            className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm outline-none text-white focus:bg-slate-955 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="volunteer-query-tab" className="text-xs font-bold text-slate-400 block mb-1.5">Query input</label>
                        <div className="flex gap-2">
                          <input 
                            id="volunteer-query-tab"
                            type="text" 
                            value={volunteerQuery} 
                            onChange={(e) => setVolunteerQuery(e.target.value)}
                            className="flex-1 bg-slate-950/60 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm outline-none text-white focus:bg-slate-955 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500"
                          />
                          <button 
                            onClick={() => handleVolunteerAsk()}
                            aria-label="Dispatch query"
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all rounded-xl text-xs font-bold text-white uppercase tracking-wider shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
                          >
                            Dispatch
                          </button>
                        </div>
                      </div>

                      {volunteerResult && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs space-y-2">
                          <p className="text-emerald-400 font-bold">Target sector allocation: {volunteerResult.assigned_zone}</p>
                          <p className="text-slate-300">Action description: {volunteerResult.task_description}</p>
                          <p className="text-slate-400">Risk category: {volunteerResult.urgency_level}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* F. AI COMMANDER CENTRAL COMMAND TAB */}
                  {activeTab === "commander" && (
                    <div className="space-y-8">
                      <div className="glass-card p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <BrainCircuit className="w-5 h-5 text-indigo-400" />
                          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">AI Commander Co-pilot</h2>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">Select a scenario to simulate automated operational adjustments across all systems.</p>
                        
                        <div className="mb-4">
                          <label htmlFor="scen-select-center" className="text-xs font-bold text-slate-400 block mb-1.5">Active Scenario Selection</label>
                          <select
                            id="scen-select-center"
                            value={scenario}
                            onChange={(e) => setScenario(e.target.value)}
                            className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs outline-none text-white focus:bg-slate-955 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition cursor-pointer"
                          >
                            <option value="Sudden heavy rainstorm during egress peak">Sudden heavy rainstorm during egress peak</option>
                            <option value="Public metro line failure in zone C corridor">Public metro line failure in zone C corridor</option>
                            <option value="Security alert near Gate B concourse">Security alert near Gate B concourse</option>
                          </select>
                        </div>

                        <button 
                          onClick={handleTriggerDecision}
                          disabled={loading}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-850 transition rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Orchestrate Coordinated Plan
                        </button>

                        {decisionResult && (
                          <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-3">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Commander Reasoning Stream</span>
                            <div className="text-xs space-y-2 text-slate-300">
                              {decisionResult.reasoning_steps.map((step: string, idx: number) => (
                                <p key={idx} className="flex gap-2">
                                  <span className="text-indigo-400 font-bold">•</span>
                                  {step}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* G. SECURITY & ACCESS TAB */}
                  {activeTab === "security" && (
                    <div className="space-y-8">
                      <div className="glass-card p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Shield className="w-5 h-5 text-indigo-400" />
                          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Security Command Console</h2>
                        </div>
                        <p className="text-xs text-slate-400 mb-6">Monitor access control points, metal detectors, and perimeter fences across SoFi Stadium.</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="p-4 bg-slate-900/60 border border-white/10 rounded-xl text-center">
                            <span className="text-[9px] text-slate-400 block font-semibold uppercase">Perimeter Fence</span>
                            <strong className="text-sm text-emerald-450 font-black">SECURE</strong>
                          </div>
                          <div className="p-4 bg-slate-900/60 border border-white/10 rounded-xl text-center">
                            <span className="text-[9px] text-slate-400 block font-semibold uppercase">Metal Detectors</span>
                            <strong className="text-sm text-emerald-450 font-black">100% ONLINE</strong>
                          </div>
                          <div className="p-4 bg-slate-900/60 border border-white/10 rounded-xl text-center">
                            <span className="text-[9px] text-slate-400 block font-semibold uppercase">Active Patrols</span>
                            <strong className="text-sm text-white font-black">42 Teams</strong>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            setTimeline((prev) => [
                              { id: Date.now(), time: "Just Now", title: "Security Scan Completed", detail: "Perimeter status verified as fully secure." },
                              ...prev
                            ]);
                            alert("Security sweep initiated successfully. All points secure.");
                          }}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Run Full Security Sweep
                        </button>
                      </div>
                    </div>
                  )}

                  {/* H. ACCESSIBILITY TAB */}
                  {activeTab === "accessibility" && (
                    <div className="space-y-8">
                      <div className="glass-card p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Accessibility className="w-5 h-5 text-indigo-400" />
                          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Accessibility & Wheelchair Dispatcher</h2>
                        </div>
                        <p className="text-xs text-slate-400 mb-6">Coordinate special assistance, golf carts, wheelchair routing, and priority elevator status.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="p-4 bg-slate-900/60 border border-white/10 rounded-xl">
                            <span className="text-[9px] text-slate-400 block font-semibold uppercase mb-1">Elevator Status</span>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-300">Elevators 1-8 (West Plaza)</span>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-450 text-[10px] font-bold border border-emerald-500/20">Operational</span>
                            </div>
                          </div>
                          <div className="p-4 bg-slate-900/60 border border-white/10 rounded-xl">
                            <span className="text-[9px] text-slate-400 block font-semibold uppercase mb-1">Assisted Carts</span>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-300">Available Carts</span>
                              <strong className="text-slate-200">12 / 15 Active</strong>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            setTimeline((prev) => [
                              { id: Date.now(), time: "Just Now", title: "Cart Dispatched", detail: "Assisted golf cart sent to Gate C elevator lobby." },
                              ...prev
                            ]);
                            alert("Accessibility golf cart dispatched successfully to Gate C.");
                          }}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Dispatch Assisted Golf Cart
                        </button>
                      </div>
                    </div>
                  )}

                  {/* I. CROWD INTELLIGENCE TAB */}
                  {activeTab === "intelligence" && (
                    <div className="space-y-8">
                      <div className="glass-card p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Users className="w-5 h-5 text-indigo-400" />
                          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Crowd Intelligence & Density Map</h2>
                        </div>
                        <p className="text-xs text-slate-400 mb-6">Real-time occupancy tracking across stadium tiers and gates using security camera feeds.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
                          <div className="p-4 bg-slate-900/60 border border-white/10 rounded-xl">
                            <h4 className="font-bold text-white mb-2">Gate Traffic Flow Rates</h4>
                            <ul className="space-y-2">
                              <li className="flex justify-between"><span>Gate A (North)</span><strong className="text-amber-400">72% Capacity</strong></li>
                              <li className="flex justify-between"><span>Gate B (Northeast)</span><strong className="text-emerald-450">48% Capacity</strong></li>
                              <li className="flex justify-between"><span>Gate C (East Lobby)</span><strong className="text-red-400">92% Capacity</strong></li>
                            </ul>
                          </div>
                          <div className="p-4 bg-slate-900/60 border border-white/10 rounded-xl">
                            <h4 className="font-bold text-white mb-2">Average Transit Velocity</h4>
                            <ul className="space-y-2">
                              <li className="flex justify-between"><span>Concourse Level 1</span><strong className="text-emerald-450">1.4 m/s (Optimal)</strong></li>
                              <li className="flex justify-between"><span>Plaza Access Bridges</span><strong className="text-amber-400">0.8 m/s (Moderate)</strong></li>
                              <li className="flex justify-between"><span>Metro Shuttle Line</span><strong className="text-red-400">0.3 m/s (Congested)</strong></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* J. TRANSPORTATION TAB */}
                  {activeTab === "transportation" && (
                    <div className="space-y-8">
                      <div className="glass-card p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Bus className="w-5 h-5 text-indigo-400" />
                          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Transportation & Transit Control</h2>
                        </div>
                        <p className="text-xs text-slate-400 mb-6">Manage external shuttle buses, metro scheduling, and coordinate parking garage updates.</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="p-4 bg-slate-900/60 border border-white/10 rounded-xl text-center">
                            <span className="text-[9px] text-slate-400 block font-semibold uppercase">Metro Wait Time</span>
                            <strong className="text-sm text-slate-100 font-black">6 Min Delay</strong>
                          </div>
                          <div className="p-4 bg-slate-900/60 border border-white/10 rounded-xl text-center">
                            <span className="text-[9px] text-slate-400 block font-semibold uppercase">Shuttle Frequency</span>
                            <strong className="text-sm text-slate-100 font-black">Every 3 Mins</strong>
                          </div>
                          <div className="p-4 bg-slate-900/60 border border-white/10 rounded-xl text-center">
                            <span className="text-[9px] text-slate-400 block font-semibold uppercase">Taxi Queues</span>
                            <strong className="text-sm text-slate-100 font-black">12 Min Wait</strong>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            setTimeline((prev) => [
                              { id: Date.now(), time: "Just Now", title: "Metro Frequencies Adjusted", detail: "Metro operators agreed to run extra trains to clear Sector C crowds." },
                              ...prev
                            ]);
                            alert("Requested additional metro trains to relieve Gate C egress load.");
                          }}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Request Extra Metro Trains
                        </button>
                      </div>
                    </div>
                  )}

                  {/* K. REPORTS & ANALYTICS TAB */}
                  {activeTab === "reports" && (
                    <div className="space-y-8">
                      <div className="glass-card p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <BarChart4 className="w-5 h-5 text-indigo-400" />
                          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Reports & Incident Logs Analytics</h2>
                        </div>
                        <p className="text-xs text-slate-400 mb-6">Compile full incident summary reports and export operational data files.</p>

                        <div className="p-4 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-300 space-y-2 mb-6">
                          <p><strong>Total Active Incidents Today:</strong> 12 reported / 11 resolved</p>
                          <p><strong>Peak Occupancy Level:</strong> 62,845 attendees (78%) at 18:45</p>
                          <p><strong>Average Response Time:</strong> 2.4 minutes across all EMS calls</p>
                        </div>

                        <button 
                          onClick={() => alert("Downloading Operations Summary PDF report...")}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Export Operations PDF Report
                        </button>
                      </div>
                    </div>
                  )}

                  {/* L. SIMULATION TAB */}
                  {activeTab === "simulation" && (
                    <div className="space-y-8">
                      <div className="glass-card p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <HelpCircle className="w-5 h-5 text-indigo-400" />
                          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Simulation Control Center</h2>
                        </div>
                        <p className="text-xs text-slate-400 mb-6">Simulate hypothetical match scenarios to stress-test exit route plans and safety logistics.</p>

                        <div className="mb-6 text-xs text-slate-300 space-y-2">
                          <p><strong>Simulated Scenario:</strong> Public metro line failure in zone C corridor</p>
                          <p><strong>Estimated Impact:</strong> Exit congestion increases by 35% around East gates</p>
                        </div>

                        <button 
                          onClick={() => alert("Starting mock crowd simulation run...")}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Run exit stress simulation
                        </button>
                      </div>
                    </div>
                  )}

                  {/* M. DOCUMENT CENTER TAB */}
                  {activeTab === "documents" && (
                    <div className="space-y-8">
                      <div className="glass-card p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <FileText className="w-5 h-5 text-indigo-400" />
                          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Document Center</h2>
                        </div>
                        <p className="text-xs text-slate-400 mb-6">Access official manuals, FIFA safety codes, and operational guidelines.</p>

                        <div className="space-y-3 text-xs text-slate-300">
                          <div className="p-3 bg-slate-900/60 border border-white/10 rounded-xl flex justify-between items-center">
                            <span>FIFA World Cup 2026 Venue Security Manual</span>
                            <span className="text-[10px] text-indigo-400 hover:underline cursor-pointer">Open PDF</span>
                          </div>
                          <div className="p-3 bg-slate-900/60 border border-white/10 rounded-xl flex justify-between items-center">
                            <span>Emergency Evacuation Route Maps (SoFi Stadium)</span>
                            <span className="text-[10px] text-indigo-400 hover:underline cursor-pointer">Open PDF</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>
            {/* Right sidebar AI Commander Panel (Persistent on desktop) */}
            <div className="space-y-6">
              
              {/* Search and Voice AI Controls */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-slate-900/60 focus-within:bg-slate-900 focus-within:ring-1 focus-within:ring-indigo-500/30 focus-within:border-indigo-500 transition-all cursor-pointer" onClick={() => setIsCommandPaletteOpen(true)}>
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search Command" 
                    readOnly
                    className="bg-transparent text-[11px] outline-none text-white placeholder-slate-500 cursor-pointer w-full"
                  />
                  <kbd className="bg-slate-850 border border-white/10 text-[8px] px-1.5 py-0.5 rounded font-bold text-slate-400">⌘K</kbd>
                </div>
                <button
                  onClick={handleVoiceInput}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider transition cursor-pointer shadow-lg ${
                    isListening 
                      ? "bg-red-600 text-white animate-pulse shadow-red-500/20" 
                      : "bg-[#4F46E5] hover:bg-indigo-700 text-white shadow-indigo-500/10"
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isListening ? "Listening..." : "Voice AI"}</span>
                </button>
              </div>

              {/* Scenario Decision Trigger (Moved to persistent sidebar for superior UX) */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Megaphone className="w-5 h-5 text-indigo-400 animate-bounce" />
                  <h3 className="text-xs font-bold text-slate-200">Operations Co-pilot</h3>
                </div>

                <div className="mb-4">
                  <label htmlFor="scen-select" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Active Scenario</label>
                  <select
                    id="scen-select"
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2 px-3 text-xs outline-none text-white focus:bg-slate-955 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition cursor-pointer"
                  >
                    <option value="Sudden heavy rainstorm during egress peak">Sudden heavy rainstorm during egress peak</option>
                    <option value="Public metro line failure in zone C corridor">Public metro line failure in zone C corridor</option>
                    <option value="Security alert near Gate B concourse">Security alert near Gate B concourse</option>
                  </select>
                </div>

                <button 
                  onClick={handleTriggerDecision}
                  disabled={loading}
                  className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 active:bg-indigo-800 text-white transition rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer"
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
              <div className="glass-card p-6 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-bold text-slate-200">AI Commander</h3>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Online
                  </span>
                </div>

                             {/* AI Orb Component */}
                 <AIOrb />

                 {/* Match clock */}
                 <div className="p-4 bg-slate-900/60 border border-white/10 rounded-xl flex justify-between items-center">
                   <div>
                     <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Current Match</p>
                     <strong className="text-xs text-white font-extrabold">Mexico vs Japan</strong>
                     <p className="text-[9px] text-slate-450">Group Stage • Match 24</p>
                   </div>
                   <span className="bg-red-650 text-white text-[11px] font-black px-2 py-1 rounded-md shadow-sm shadow-red-500/10">
                     45:32
                   </span>
                 </div>

                 {/* Alert Panel Component */}
                 <AlertPanel />

                 {/* Action Cards Component */}
                 <RecommendationCard
                   approvals={approvals}
                   onApprove={handleActionApproval}
                   onApproveAll={() => {
                     Object.keys(approvals).forEach(k => handleActionApproval(k, "APPROVED"));
                   }}
                 />

                 {/* AI Chat Widget Component */}
                 <AIChatWidget
                   value={commanderQuery}
                   onChange={setCommanderQuery}
                   onSend={handleCommanderAsk}
                 />
              </div>

            </div>

          </div>

        </div>

        {/* Full-width StatsCard component row spanning the entire page */}
        <div className="w-full px-4 md:px-8 lg:px-12 pb-8">
          <StatsCard volunteersCount={1248} />
        </div>

        {/* Bottom row widgets: Incident Log Timeline & AI Insights */}
        <div className="w-full px-4 md:px-8 lg:px-12 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <Timeline timeline={timeline} />
          </div>

          <div>
            <div className="glass-card p-6 h-[350px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-slate-200">AI Insights</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-semibold">Gate C congestion increasing</span>
                  <span className="text-[9px] text-slate-450">2 min ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-semibold">Rain probability in 30 mins</span>
                  <span className="text-[9px] text-slate-450">5 min ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-semibold">Spanish help requests</span>
                  <span className="text-[9px] text-slate-450">7 min ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-semibold">Waste collection behind</span>
                  <span className="text-[9px] text-slate-450">10 min ago</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Status Bar Component */}
        <FooterStatus />

      </main>
    </div>
  );
}
