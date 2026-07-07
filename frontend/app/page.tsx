"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, Activity, Users, Bus, Zap, Thermometer, CloudRain, Trash2,
  Mic, MicOff, Search, Compass, AlertCircle, HelpCircle, FileText, CheckCircle,
  TrendingUp, RefreshCw, Send, ArrowRight, Accessibility
} from "lucide-react";
import { api } from "../lib/api";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [telemetry, setTelemetry] = useState<any>({
    crowd_density: { status: "Warning", value: "Gate C High Flow" },
    transport: { status: "Optimal", value: "Metro 5 Min intervals" },
    medical: { status: "Good", value: "3 units active" },
    weather: { status: "Optimal", value: "Clear, 24°C" },
    security: { status: "Optimal", value: "All clear" },
    energy: { status: "Efficient", value: "240 kW solar" },
    waste: { status: "Optimal", value: "42% capacity" }
  });

  // Feature States
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
  const [scenario, setScenario] = useState("Rain begins post-match");
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

  // Web Speech API
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
        // Automatically dispatch to Emergency AI if it sounds urgent
        if (text.toLowerCase().includes("injured") || text.toLowerCase().includes("collapsed") || text.toLowerCase().includes("help")) {
          setEmergencyText(text);
          await handleEmergencyReport(text);
        } else {
          setVolunteerQuery(text);
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
      alert("Speech recognition is not supported in this browser. Please try Chrome/Safari.");
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

  const handleVolunteerAsk = async () => {
    setLoading(true);
    try {
      const res = await api.askVolunteer(volunteerId, volunteerLoc, volunteerQuery);
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
    <div className="min-h-screen pb-16 px-4 md:px-8 font-sans bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Premium Header */}
      <header className="py-6 flex flex-col md:flex-row items-center justify-between border-b border-slate-800/80 mb-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              StadiumMind AI
            </h1>
            <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
              FIFA World Cup 2026 Stadium Operating System
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button 
            onClick={fetchTelemetry}
            aria-label="Refresh Telemetry Data"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700/60 hover:bg-slate-900 transition text-sm text-slate-300"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Feed
          </button>
          
          {/* Voice Command Button */}
          <button
            onClick={handleVoiceInput}
            aria-label={isListening ? "Stop listening to voice commands" : "Start listening to voice commands"}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition duration-200 shadow-md ${
              isListening 
                ? "bg-red-500 text-white animate-pulse" 
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10"
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isListening ? "Listening..." : "Voice Control"}
          </button>
        </div>
      </header>

      {/* Voice Query Display Alert */}
      {voiceQuery && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="glass-panel p-4 rounded-xl flex items-center gap-3 border-blue-500/30 bg-blue-950/20 text-blue-200">
            <Mic className="w-5 h-5 text-blue-400" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Captured Command:</span>
              <p className="text-sm font-medium">{voiceQuery}</p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Real-Time Operational Cards */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Telemetry Metric Cards */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Crowd Density</span>
            <Users className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight">{telemetry.crowd_density.value}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            {telemetry.crowd_density.status}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Transport Status</span>
            <Bus className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight">{telemetry.transport.value}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {telemetry.transport.status}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Medical Services</span>
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight">{telemetry.medical.value}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {telemetry.medical.status}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resource Output</span>
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight">{telemetry.energy.value}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-purple-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            {telemetry.energy.status}
          </div>
        </div>

      </main>

      {/* Main Operating Modules Panel */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Operations and Egress */}
        <div className="space-y-8 lg:col-span-2">
          
          {/* Module 1: Crowd Heatmap Prediction */}
          <section className="glass-panel p-6 rounded-2xl" aria-labelledby="crowd-prediction-heading">
            <h2 id="crowd-prediction-heading" className="text-lg font-bold flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Crowd Heatmap & Congestion Prediction
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="gate-select" className="text-xs font-semibold text-slate-400 block mb-1">Target Gate</label>
                <select 
                  id="gate-select"
                  value={gateId} 
                  onChange={(e) => setGateId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Gate A">Gate A (Main North)</option>
                  <option value="Gate B">Gate B (East Wing)</option>
                  <option value="Gate C">Gate C (South Egress)</option>
                  <option value="Gate D">Gate D (West Concourse)</option>
                </select>
              </div>
              <div>
                <label htmlFor="current-count-input" className="text-xs font-semibold text-slate-400 block mb-1">Current Gate Inflow (hr)</label>
                <input 
                  id="current-count-input"
                  type="number" 
                  value={currentCount} 
                  onChange={(e) => setCurrentCount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-100"
                />
              </div>
              <div>
                <label htmlFor="flow-rate-input" className="text-xs font-semibold text-slate-400 block mb-1">Egress Rate (per min)</label>
                <input 
                  id="flow-rate-input"
                  type="number" 
                  value={flowRate} 
                  onChange={(e) => setFlowRate(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-100"
                />
              </div>
            </div>
            
            <button 
              onClick={handleCrowdPredict}
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-sm font-semibold shadow-md shadow-blue-500/10"
            >
              Analyze Egress Dynamics
            </button>

            {crowdPredictResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-xl border text-sm ${
                  crowdPredictResult.congestion_status === "HIGH" 
                    ? "bg-red-950/20 border-red-500/30 text-red-200" 
                    : "bg-slate-900/60 border-slate-700/60 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold uppercase tracking-wider text-xs">Status Output:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-extrabold ${
                    crowdPredictResult.congestion_status === "HIGH" ? "bg-red-500 text-white animate-pulse" : "bg-emerald-500 text-white"
                  }`}>
                    {crowdPredictResult.congestion_status}
                  </span>
                </div>
                <p className="mb-1"><strong>Estimated capacity limit intersection:</strong> {crowdPredictResult.estimated_minutes_to_limit} minutes</p>
                <p><strong>Mitigation actions:</strong> {crowdPredictResult.recommendation}</p>
              </motion.div>
            )}
          </section>

          {/* Module 2: AI Route Planner */}
          <section className="glass-panel p-6 rounded-2xl" aria-labelledby="route-planner-heading">
            <h2 id="route-planner-heading" className="text-lg font-bold flex items-center gap-2 mb-4">
              <Compass className="w-5 h-5 text-indigo-400" />
              AI Adaptive Path & Accessibility Routing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="route-start-input" className="text-xs font-semibold text-slate-400 block mb-1">Start Location</label>
                <input 
                  id="route-start-input"
                  type="text" 
                  value={routeStart} 
                  onChange={(e) => setRouteStart(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="route-end-input" className="text-xs font-semibold text-slate-400 block mb-1">Destination Gate</label>
                <input 
                  id="route-end-input"
                  type="text" 
                  value={routeEnd} 
                  onChange={(e) => setRouteEnd(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mb-4">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={wheelchair} 
                  onChange={(e) => setWheelchair(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                />
                <Accessibility className="w-4 h-4 text-indigo-400" />
                Wheelchair Accessibility
              </label>
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={elevator} 
                  onChange={(e) => setElevator(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                />
                Elevator Prioritization
              </label>
            </div>

            <button 
              onClick={handleRoutePlan}
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 transition rounded-lg text-sm font-semibold shadow-md shadow-indigo-500/10"
            >
              Generate Safe Route
            </button>

            {routeResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl text-sm"
              >
                <p className="mb-2"><strong>Suggested Path:</strong> {routeResult.path.join(" ➔ ")}</p>
                <p className="mb-2"><strong>ETA:</strong> {routeResult.estimated_minutes} minutes</p>
                {routeResult.accessibility_warnings.length > 0 && (
                  <div className="text-amber-400 flex items-start gap-1">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      {routeResult.accessibility_warnings.map((w: string, idx: number) => (
                        <p key={idx}>{w}</p>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </section>

          {/* Module 3: AI Decision Engine */}
          <section className="glass-panel p-6 rounded-2xl" aria-labelledby="decision-engine-heading">
            <h2 id="decision-engine-heading" className="text-lg font-bold flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-purple-400" />
              AI Orchestrated Decision Engine (Cascading Egress)
            </h2>
            <div className="mb-4">
              <label htmlFor="scenario-select" className="text-xs font-semibold text-slate-400 block mb-1">Simulated Egress Scenario Trigger</label>
              <select
                id="scenario-select"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="Sudden heavy rainstorm during egress peak">Sudden heavy rainstorm during egress peak</option>
                <option value="Public metro line failure in zone C corridor">Public metro line failure in zone C corridor</option>
                <option value="Security alert near Gate B concourse">Security alert near Gate B concourse</option>
              </select>
            </div>

            <button 
              onClick={handleTriggerDecision}
              disabled={loading}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 transition rounded-lg text-sm font-semibold shadow-md shadow-purple-500/10"
            >
              Simulate Action Plan
            </button>

            {decisionResult && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 space-y-4"
              >
                <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Dynamic Scenario Triggered:</span>
                  <p className="text-sm font-bold text-purple-200 mt-1">{decisionResult.primary_event}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl text-sm">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-2">Consequences</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-300">
                      {decisionResult.consequences.map((c: string, idx: number) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl text-sm">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">Orchestrated Mitigations</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-300">
                      {decisionResult.actions.map((a: string, idx: number) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </section>

        </div>

        {/* RIGHT COLUMN: Emergency & Incident Control */}
        <div className="space-y-8">
          
          {/* Module 4: Emergency AI Alert Panel */}
          <section className="glass-panel p-6 rounded-2xl border-red-500/20 bg-red-950/5" aria-labelledby="emergency-ai-heading">
            <h2 id="emergency-ai-heading" className="text-lg font-bold flex items-center gap-2 mb-4 text-red-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
              Emergency Response AI Dispatcher
            </h2>
            <div className="mb-4">
              <label htmlFor="emergency-input" className="text-xs font-semibold text-slate-400 block mb-1">Live Alert Feed (Text Input)</label>
              <textarea 
                id="emergency-input"
                rows={2}
                value={emergencyText} 
                onChange={(e) => setEmergencyText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-100 placeholder-slate-500"
                placeholder="e.g. Heart issue in Section 102 concourse"
              />
            </div>
            
            <button 
              onClick={() => handleEmergencyReport()}
              disabled={loading}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 transition rounded-lg text-sm font-semibold shadow-md shadow-red-500/10"
            >
              Analyze Alert & Dispatch Units
            </button>

            {emergencyResult && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 bg-red-950/20 border border-red-500/30 rounded-xl text-sm"
              >
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block">Target Location</span>
                    <strong className="text-red-200">{emergencyResult.extracted_location}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block">Severity Class</span>
                    <span className="px-2 py-0.5 rounded text-xs font-extrabold bg-red-500 text-white animate-pulse">
                      {emergencyResult.severity}
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5 border-t border-red-500/20 pt-2.5 text-slate-300">
                  <p><strong>Dispatched Team:</strong> {emergencyResult.dispatched_unit}</p>
                  <p><strong>Clearance Path:</strong> {emergencyResult.suggested_route}</p>
                  <p><strong>Expected Arrival:</strong> {emergencyResult.eta_minutes} mins</p>
                </div>
              </motion.div>
            )}
          </section>

          {/* Module 5: AI Incident Report Generator */}
          <section className="glass-panel p-6 rounded-2xl" aria-labelledby="incident-generator-heading">
            <h2 id="incident-generator-heading" className="text-lg font-bold flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-teal-400" />
              AI Incident Report Summarizer
            </h2>
            <div className="mb-4">
              <label htmlFor="raw-incident-input" className="text-xs font-semibold text-slate-400 block mb-1">Raw Staff Radio Log</label>
              <textarea 
                id="raw-incident-input"
                rows={2}
                value={rawIncidentText} 
                onChange={(e) => setRawIncidentText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-100 placeholder-slate-500"
                placeholder="Describe the medical, security or utility event..."
              />
            </div>

            <button 
              onClick={handleGenerateIncident}
              disabled={loading}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 transition rounded-lg text-sm font-semibold shadow-md shadow-teal-500/10"
            >
              Generate Clean Record
            </button>

            {incidentResult && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl text-xs space-y-2 text-slate-300"
              >
                <p><strong>Summary:</strong> {incidentResult.summary}</p>
                <p><strong>Urgency Rating:</strong> {incidentResult.severity}</p>
                <p><strong>Follow-up Action:</strong> {incidentResult.recommended_action}</p>
                <p><strong>Supplies Deployed:</strong> {incidentResult.resources_required.join(", ")}</p>
                <p><strong>ETA to Resolve:</strong> {incidentResult.time_estimate}</p>
                <p><strong>Escalation Tier:</strong> {incidentResult.escalation_level}</p>
              </motion.div>
            )}
          </section>

          {/* Module 6: Volunteer AI Assistant */}
          <section className="glass-panel p-6 rounded-2xl" aria-labelledby="volunteer-ai-heading">
            <h2 id="volunteer-ai-heading" className="text-lg font-bold flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              Volunteer AI Assistant
            </h2>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label htmlFor="volunteer-id-input" className="text-xs font-semibold text-slate-400 block mb-1">ID</label>
                <input 
                  id="volunteer-id-input"
                  type="text" 
                  value={volunteerId} 
                  onChange={(e) => setVolunteerId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-1.5 px-3 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="volunteer-loc-input" className="text-xs font-semibold text-slate-400 block mb-1">Zone</label>
                <input 
                  id="volunteer-loc-input"
                  type="text" 
                  value={volunteerLoc} 
                  onChange={(e) => setVolunteerLoc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-1.5 px-3 text-xs focus:outline-none"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="volunteer-query-input" className="text-xs font-semibold text-slate-400 block mb-1">Message</label>
              <div className="flex gap-2">
                <input 
                  id="volunteer-query-input"
                  type="text" 
                  value={volunteerQuery} 
                  onChange={(e) => setVolunteerQuery(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-sm focus:outline-none text-slate-100"
                />
                <button 
                  onClick={handleVolunteerAsk}
                  aria-label="Send Volunteer Inquiry"
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {volunteerResult && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-xs space-y-1"
              >
                <p className="text-emerald-400 font-semibold">Assigned Station: {volunteerResult.assigned_zone}</p>
                <p className="text-slate-300">Task: {volunteerResult.task_description}</p>
                <p className="text-slate-400">Urgency: {volunteerResult.urgency_level}</p>
              </motion.div>
            )}
          </section>

          {/* Module 7: Sustainability AI Predictor */}
          <section className="glass-panel p-6 rounded-2xl" aria-labelledby="sustainability-heading">
            <h2 id="sustainability-heading" className="text-lg font-bold flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-400" />
              Sustainability & Resource Manager
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label htmlFor="attendance-input" className="text-xs font-semibold text-slate-400 block mb-1">Expected Attendance</label>
                <input 
                  id="attendance-input"
                  type="number" 
                  value={attendance} 
                  onChange={(e) => setAttendance(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-1.5 px-3 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="temp-input" className="text-xs font-semibold text-slate-400 block mb-1">Ambient Temperature (°C)</label>
                <input 
                  id="temp-input"
                  type="number" 
                  value={temp} 
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-1.5 px-3 text-sm focus:outline-none"
                />
              </div>
            </div>

            <button 
              onClick={handleSustainabilityPredict}
              disabled={loading}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 transition rounded-lg text-sm font-semibold shadow-md shadow-amber-500/10"
            >
              Analyze Resource Loads
            </button>

            {sustainabilityResult && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl text-xs grid grid-cols-2 gap-2 text-slate-300"
              >
                <div>
                  <span className="text-slate-400 block">Electricity Forecast</span>
                  <strong>{sustainabilityResult.electricity_mwh_est} MWh</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Water Consumption</span>
                  <strong>{sustainabilityResult.water_liters_est.toLocaleString()} Liters</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Estimated Trash Yield</span>
                  <strong>{sustainabilityResult.waste_tons_est} Tons</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Food Units Demand</span>
                  <strong>{sustainabilityResult.food_demand_units_est.toLocaleString()} units</strong>
                </div>
              </motion.div>
            )}
          </section>

        </div>

      </div>
    </div>
  );
}
