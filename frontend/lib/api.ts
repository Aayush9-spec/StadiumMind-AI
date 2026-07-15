const API_BASE = typeof window !== "undefined" 
  ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1")
  : (process.env.NEXT_PUBLIC_API_URL || "https://stadiummind-ai.onrender.com/api/v1");
const TOKEN = "stadiummind_eval_secret_token_12345"; // matches backend defaults

async function def_fetch(endpoint: string, options: RequestInit = {}) {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${TOKEN}`,
    ...options.headers,
  };
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP Error ${response.status}`);
  }
  
  return response.json();
}

export const api = {
  getTelemetry: () => def_fetch("/telemetry"),
  
  predictCrowd: (gateId: string, count: number, rate: number) => 
    def_fetch("/crowd/predict", {
      method: "POST",
      body: JSON.stringify({ gate_id: gateId, current_count: count, flow_rate_per_min: rate }),
    }),
    
  planRoute: (start: string, end: string, wheelchair: boolean, elevator: boolean) =>
    def_fetch("/route/plan", {
      method: "POST",
      body: JSON.stringify({ start_location: start, end_location: end, require_wheelchair: wheelchair, require_elevators: elevator }),
    }),
    
  askVolunteer: (volunteerId: string, location: string, query: string) =>
    def_fetch("/volunteer/ask", {
      method: "POST",
      body: JSON.stringify({ volunteer_id: volunteerId, current_location: location, query }),
    }),
    
  predictSustainability: (attendance: number, temp: number) =>
    def_fetch("/sustainability/predict", {
      method: "POST",
      body: JSON.stringify({ estimated_attendance: attendance, temperature_celsius: temp }),
    }),
    
  reportEmergency: (text: string) =>
    def_fetch("/emergency/report", {
      method: "POST",
      body: JSON.stringify({ incident_text: text }),
    }),
    
  triggerDecision: (scenario: string) =>
    def_fetch("/decision/trigger", {
      method: "POST",
      body: JSON.stringify({ event_scenario: scenario }),
    }),
    
  generateIncidentReport: (text: string) =>
    def_fetch("/incident/generate", {
      method: "POST",
      body: JSON.stringify({ staff_raw_text: text }),
    }),

  getActionPlan: (crowd: number, weather: string, delay: number, att: number, vols: number, meds: number) =>
    def_fetch("/decision/action-plan", {
      method: "POST",
      body: JSON.stringify({
        crowd_density: crowd,
        weather: weather,
        metro_delay: delay,
        attendance: att,
        volunteers: vols,
        medical_units: meds,
      }),
    }),

  generateBriefing: (matchName: string) =>
    def_fetch("/briefing/generate", {
      method: "POST",
      body: JSON.stringify({ match_name: matchName }),
    }),

  explainCrowd: (gateId: string, crowd: number, delay: number, weather: string) =>
    def_fetch("/crowd/explain", {
      method: "POST",
      body: JSON.stringify({ gate_id: gateId, crowd_density: crowd, metro_delay: delay, weather: weather }),
    }),

  coordinateVolunteers: (total: number, locs: string[]) =>
    def_fetch("/volunteer/coordinate", {
      method: "POST",
      body: JSON.stringify({ total_volunteers: total, locations: locs }),
    }),

  queryChat: (query: string) =>
    def_fetch("/chat/query", {
      method: "POST",
      body: JSON.stringify({ query }),
    }),

  generateDailyReport: (date: string) =>
    def_fetch("/report/daily", {
      method: "POST",
      body: JSON.stringify({ date }),
    }),
};
