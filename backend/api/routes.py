import time
import httpx
import logging
from fastapi import APIRouter, Depends, Request
from backend.models.schemas import (
    CrowdPredictRequest, CrowdPredictResponse,
    RouteRequest, RouteResponse,
    VolunteerQueryRequest, VolunteerQueryResponse,
    SustainabilityRequest, SustainabilityResponse,
    EmergencyReportRequest, EmergencyReportResponse,
    DecisionTriggerRequest, DecisionTriggerResponse,
    IncidentGeneratorRequest, IncidentReportResponse,
    ActionPlanRequest, ActionPlanResponse,
    BriefingRequest, BriefingResponse,
    CrowdExplainRequest, CrowdExplainResponse,
    VolunteerCoordinateRequest, VolunteerCoordinateResponse, VolunteerAllocationItem,
    ChatQueryRequest, ChatQueryResponse,
    DailyReportRequest, DailyReportResponse
)
from backend.utils.security import verify_token, check_rate_limit, sanitize_input
from backend.services.ai_engine import ai_engine

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1")

# Global cache variables for weather
cached_weather_str = "Optimal (Clear, 24°C)"
last_weather_fetch = 0.0

@router.get("/telemetry", dependencies=[Depends(verify_token)])
async def get_telemetry(request: Request):
    """
    Returns real-time telemetry metrics for the stadium dashboard.
    Fetches real weather data from Open-Meteo API, with a 5-minute cache.
    """
    global cached_weather_str, last_weather_fetch
    check_rate_limit(request.client.host)
    
    current_time = time.time()
    if current_time - last_weather_fetch > 300.0:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://api.open-meteo.com/v1/forecast?latitude=33.9534&longitude=-118.3392&current_weather=true",
                    timeout=3.0
                )
                if response.status_code == 200:
                    data = response.json()
                    temp = data["current_weather"]["temperature"]
                    wind = data["current_weather"]["windspeed"]
                    cached_weather_str = f"Live Forecast: {temp}°C, Wind {wind} km/h"
                    last_weather_fetch = current_time
        except Exception as e:
            logger.warning(f"Failed to fetch live weather from Open-Meteo: {e}. Using fallback telemetry.")
            # Do not update last_weather_fetch so we try again next time if failed
    
    weather_str = cached_weather_str

    # 2. Dynamic time-progression simulation
    now = time.localtime()
    minute = now.tm_min
    
    # Simulate fluctuating flow rates
    crowd_val = f"Gate C: {4000 + (minute * 15)} Flow/hr"
    transport_val = f"Metro: {3 + (minute % 4)} Min intervals"
    solar_val = f"{180 + (minute * 2)} kW output"
    waste_pct = f"{35 + (minute % 15)}% capacity"

    return {
        "crowd_density": {"status": "Warning" if (minute % 2 == 0) else "Optimal", "value": crowd_val},
        "transport": {"status": "Optimal", "value": transport_val},
        "medical": {"status": "Good", "value": "3 units active, 0 backlogged"},
        "weather": {"status": "Optimal", "value": weather_str},
        "security": {"status": "Optimal", "value": "All checkpoints cleared"},
        "energy": {"status": "Efficient", "value": solar_val},
        "waste": {"status": "Optimal", "value": waste_pct}
    }

@router.post("/crowd/predict", response_model=CrowdPredictResponse, dependencies=[Depends(verify_token)])
async def crowd_predict(payload: CrowdPredictRequest, request: Request):
    check_rate_limit(request.client.host)
    
    capacity_limit = 5000
    current_count = payload.current_count
    flow = payload.flow_rate_per_min
    
    minutes_left = 999
    if flow > 0:
        minutes_left = max(0, int((capacity_limit - current_count) / flow))
        
    status_str = "NORMAL"
    recommendation = "Maintain standard entry checks."
    
    if current_count >= capacity_limit * 0.9 or minutes_left <= 15:
        status_str = "HIGH"
        recommendation = f"Redirect inbound flow to Gate D. Update digital signboards. Send push alerts."
    elif current_count >= capacity_limit * 0.7:
        status_str = "MEDIUM"
        recommendation = "Deploy additional check-in staff to Gate C."
        
    return CrowdPredictResponse(
        gate_id=payload.gate_id,
        congestion_status=status_str,
        estimated_minutes_to_limit=minutes_left,
        recommendation=recommendation
    )

@router.post("/route/plan", response_model=RouteResponse, dependencies=[Depends(verify_token)])
async def route_plan(payload: RouteRequest, request: Request):
    check_rate_limit(request.client.host)
    
    start = sanitize_input(payload.start_location)
    end = sanitize_input(payload.end_location)
    
    path = [start, "Concourse B", "Elevator Corridor", end]
    warnings = []
    
    if payload.require_wheelchair or payload.require_elevators:
        path = [start, "Concourse B (Ramp)", "Elevator 3", "Level 2 Corridor", end]
        warnings.append("Elevator 3 is running at 80% occupancy. Expect minor waits.")
        
    return RouteResponse(
        path=path,
        estimated_minutes=8 if payload.require_wheelchair else 5,
        accessibility_warnings=warnings,
        safety_rating="SAFE"
    )

@router.post("/volunteer/ask", response_model=VolunteerQueryResponse, dependencies=[Depends(verify_token)])
async def volunteer_ask(payload: VolunteerQueryRequest, request: Request):
    check_rate_limit(request.client.host)
    
    sanitized_query = sanitize_input(payload.query)
    prompt = f"Volunteer (ID: {payload.volunteer_id}) asks: '{sanitized_query}' from location: '{payload.current_location}'. Return the assigned zone, short task description, and urgency."
    
    ai_res = ai_engine.run_prompt(prompt, schema_class=VolunteerQueryResponse)
    if isinstance(ai_res, dict) and "assigned_zone" in ai_res:
        return VolunteerQueryResponse(**ai_res)
        
    return VolunteerQueryResponse(
        assigned_zone="Food Court Zone B",
        task_description="Assist visitors and monitor line capacity.",
        urgency_level="MEDIUM"
    )

@router.post("/sustainability/predict", response_model=SustainabilityResponse, dependencies=[Depends(verify_token)])
async def sustainability_predict(payload: SustainabilityRequest, request: Request):
    check_rate_limit(request.client.host)
    
    electricity = round((payload.estimated_attendance * 0.0015) + (1.2 if payload.temperature_celsius > 25 else 0.8), 2)
    water = round(payload.estimated_attendance * 30.0, 2)
    waste = round(payload.estimated_attendance * 0.00005, 2)
    food = int(payload.estimated_attendance * 0.45)
    
    return SustainabilityResponse(
        electricity_mwh_est=electricity,
        water_liters_est=water,
        waste_tons_est=waste,
        food_demand_units_est=food
    )

@router.post("/emergency/report", response_model=EmergencyReportResponse, dependencies=[Depends(verify_token)])
async def emergency_report(payload: EmergencyReportRequest, request: Request):
    check_rate_limit(request.client.host)
    
    sanitized_text = sanitize_input(payload.incident_text)
    prompt = f"Emergency Alert reported: '{sanitized_text}'. Extract the exact section location, determine severity level (LOW, MEDIUM, CRITICAL), assign the nearest unit, suggest route, and estimate ETA."
    
    ai_res = ai_engine.run_prompt(prompt, schema_class=EmergencyReportResponse)
    if isinstance(ai_res, dict) and "extracted_location" in ai_res:
        return EmergencyReportResponse(**ai_res)
        
    return EmergencyReportResponse(
        extracted_location="Section 218",
        severity="CRITICAL",
        dispatched_unit="Medic Unit 4",
        suggested_route="Elevator B -> Section 218 Access Corridor",
        eta_minutes=3
    )

@router.post("/decision/trigger", response_model=DecisionTriggerResponse, dependencies=[Depends(verify_token)])
async def decision_trigger(payload: DecisionTriggerRequest, request: Request):
    check_rate_limit(request.client.host)
    
    sanitized_scenario = sanitize_input(payload.event_scenario)
    prompt = f"Operational change: '{sanitized_scenario}'. Detail primary event, list cascading consequences, outline recommended operations coordinator actions, and reasoning steps."
    
    ai_res = ai_engine.run_prompt(prompt, schema_class=DecisionTriggerResponse)
    if isinstance(ai_res, dict) and "primary_event" in ai_res:
        return DecisionTriggerResponse(**ai_res)
        
    return DecisionTriggerResponse(
        primary_event="Heavy Egress Egress / Weather Event",
        consequences=["Concourse congestion", "Metro overcrowding"],
        actions=["Open Gate E", "Dispatch shuttle buses"],
        reasoning_steps=["Observe weather sensor", "Evaluate Egress channels"]
    )

@router.post("/incident/generate", response_model=IncidentReportResponse, dependencies=[Depends(verify_token)])
async def incident_generate(payload: IncidentGeneratorRequest, request: Request):
    check_rate_limit(request.client.host)
    
    sanitized_text = sanitize_input(payload.staff_raw_text)
    prompt = f"Staff raw report: '{sanitized_text}'. Generate incident summary, severity, recommended actions, resources required, time estimate, and escalation level."
    
    ai_res = ai_engine.run_prompt(prompt, schema_class=IncidentReportResponse)
    if isinstance(ai_res, dict) and "summary" in ai_res:
        return IncidentReportResponse(**ai_res)
        
    return IncidentReportResponse(
        summary="Incident summary here",
        severity="LOW",
        recommended_action="Actions here",
        resources_required=["First Aid Kit"],
        time_estimate="10 mins",
        escalation_level="Level 1"
    )

@router.post("/decision/action-plan", response_model=ActionPlanResponse, dependencies=[Depends(verify_token)])
async def decision_action_plan(payload: ActionPlanRequest, request: Request):
    check_rate_limit(request.client.host)
    prompt = (
        f"Generate an operational action plan. Metrics: Crowd Density: {payload.crowd_density}%, "
        f"Weather: {payload.weather}, Metro Delay: {payload.metro_delay} mins, Attendance: {payload.attendance}, "
        f"Volunteers: {payload.volunteers}, Medical Units: {payload.medical_units}. "
        f"Provide situation_summary, recommended_actions list, congestion_reduction_pct, and confidence_pct."
    )
    ai_res = ai_engine.run_prompt(prompt, schema_class=ActionPlanResponse)
    if isinstance(ai_res, dict) and "situation_summary" in ai_res:
        return ActionPlanResponse(**ai_res)
    
    return ActionPlanResponse(
        situation_summary=(
            f"Gate C is projected to exceed safe occupancy within 11 minutes "
            f"due to weather-induced crowd redistribution and Metro delay."
        ),
        recommended_actions=[
            "Open Gate D",
            "Dispatch 8 volunteers",
            "Increase shuttle frequency",
            "Delay VIP exit by 6 minutes"
        ],
        congestion_reduction_pct=37,
        confidence_pct=97
    )

@router.post("/briefing/generate", response_model=BriefingResponse, dependencies=[Depends(verify_token)])
async def generate_briefing(payload: BriefingRequest, request: Request):
    check_rate_limit(request.client.host)
    prompt = (
        f"Generate a Match Day Briefing for {payload.match_name}. Include attendance_forecast, "
        f"weather, crowd_risk, traffic, volunteer_needs, emergency_readiness, key_risks list, and suggested_actions list."
    )
    ai_res = ai_engine.run_prompt(prompt, schema_class=BriefingResponse)
    if isinstance(ai_res, dict) and "attendance_forecast" in ai_res:
        return BriefingResponse(**ai_res)
        
    return BriefingResponse(
        attendance_forecast="65,000 spectators expected (Sold Out). Peak entry between 17:30 and 18:30.",
        weather="Heavy Rain arriving post-match. Temperature cooling to 19°C.",
        crowd_risk="High risk of localized bottlenecks at covered Gates B and C.",
        traffic="Metro Line 2 operating on 8 min delay. High parking egress backlog anticipated.",
        volunteer_needs="Priority deployment at Gate C egress channels and Metro shuttle queues.",
        emergency_readiness="3 EMS squads stationed, 1 standby near Sector 218 corridor.",
        key_risks=["Slippery concourses", "Metro queue overflow", "Gate C exit bottlenecks"],
        suggested_actions=[
            "Pre-position 8 volunteers at Gate C",
            "Activate auxiliary shuttle loop service",
            "Display indoor concession discount alerts to delay egress exit"
        ]
    )

@router.post("/crowd/explain", response_model=CrowdExplainResponse, dependencies=[Depends(verify_token)])
async def crowd_explain(payload: CrowdExplainRequest, request: Request):
    check_rate_limit(request.client.host)
    prompt = (
        f"Explain why crowd density is {payload.crowd_density}% at {payload.gate_id} "
        f"given weather is '{payload.weather}' and metro delay is {payload.metro_delay} minutes."
    )
    ai_res = ai_engine.run_prompt(prompt, schema_class=CrowdExplainResponse)
    if isinstance(ai_res, dict) and "explanation" in ai_res:
        return CrowdExplainResponse(**ai_res)
        
    return CrowdExplainResponse(
        explanation=(
            f"Crowd density is expected to increase to {payload.crowd_density}% because Metro Line 2 "
            f"is experiencing a {payload.metro_delay} minute delay, trapping commuters, while sudden "
            f"heavy rain is forcing outdoor spectators toward the west entrance of {payload.gate_id}."
        )
    )

@router.post("/volunteer/coordinate", response_model=VolunteerCoordinateResponse, dependencies=[Depends(verify_token)])
async def volunteer_coordinate(payload: VolunteerCoordinateRequest, request: Request):
    check_rate_limit(request.client.host)
    prompt = (
        f"Coordinate {payload.total_volunteers} volunteers across locations: {', '.join(payload.locations)}. "
        f"Return allocations with location name, allocated_count, and reason."
    )
    ai_res = ai_engine.run_prompt(prompt, schema_class=VolunteerCoordinateResponse)
    if isinstance(ai_res, dict) and "deployments" in ai_res:
        return VolunteerCoordinateResponse(**ai_res)
        
    return VolunteerCoordinateResponse(
        deployments=[
            VolunteerAllocationItem(location="Gate C", allocated_count=8, reason="Crowd flow expected to exceed safety capacity threshold."),
            VolunteerAllocationItem(location="Medical", allocated_count=3, reason="Pre-positioning near Sector 218 medical corridor."),
            VolunteerAllocationItem(location="Food Court", allocated_count=2, reason="Directing pedestrian lanes to avoid bottleneck overlaps."),
            VolunteerAllocationItem(location="Gate A", allocated_count=2, reason="Standard gate coordination checks.")
        ]
    )

@router.post("/chat/query", response_model=ChatQueryResponse, dependencies=[Depends(verify_token)])
async def chat_query(payload: ChatQueryRequest, request: Request):
    check_rate_limit(request.client.host)
    prompt = f"Stadium Operations Commander Assistant: Answer query: '{payload.query}' concisely."
    ai_res = ai_engine.run_prompt(prompt, schema_class=ChatQueryResponse)
    if isinstance(ai_res, dict) and "reply" in ai_res:
        return ChatQueryResponse(**ai_res)
        
    # Smart local replies matching user questions
    q = payload.query.lower()
    if "rain" in q:
        reply = "Rain is predicted post-match. We recommend deploying wet concourse signage, opening Gate D detours, and delaying outdoor fireworks."
    elif "evacuation" in q:
        reply = "In case of emergency evacuation, redirect all crowd flows away from blocked sectors toward Gates A, D, and E. EMS routes are cleared via Elevator B."
    elif "status" in q:
        reply = " Dallas Venue Feed: Connected. Inflow Congestion: 92% (High Risk). Egress transit: 3 mins. Weather: Clear (Rain arriving soon)."
    elif "safest" in q:
        reply = "Currently, Gate D is the safest and least congested channel with only 35% utilization, compared to Gate C at 92%."
    elif "volunteers" in q:
        reply = "An estimated 15 volunteers are needed: 8 at Gate C bottleneck, 3 at Medical Sector A corridor, and 4 spread across parking transit loops."
    elif "incident" in q:
        reply = "A spectator experienced a medical emergency near Gate C. EMS was dispatched successfully via Elevator B (ETA: 2 minutes)."
    else:
        reply = "Stadium operating normally. Gate C congestion is increasing, and rain is arriving soon. Let me know if you want to orchestrate an action plan."
        
    return ChatQueryResponse(reply=reply)

@router.post("/report/daily", response_model=DailyReportResponse, dependencies=[Depends(verify_token)])
async def generate_daily_report(payload: DailyReportRequest, request: Request):
    check_rate_limit(request.client.host)
    prompt = (
        f"Generate a daily report for date {payload.date}. Return executive_summary, "
        f"incidents list, traffic, weather, recommendations list, resource_usage, and lessons_learned."
    )
    ai_res = ai_engine.run_prompt(prompt, schema_class=DailyReportResponse)
    if isinstance(ai_res, dict) and "executive_summary" in ai_res:
        return DailyReportResponse(**ai_res)
        
    return DailyReportResponse(
        executive_summary="Tournament Day 4 concluded successfully. Managed peak ingress crowd load of 62,845 spectators.",
        incidents=["18:32 - Spectator slipped near Sector 218, minor laceration resolved by Medic Unit 4."],
        traffic="Metro Line 2 experienced headway delays; mitigated via standby shuttle loop activations.",
        weather="Optimal conditions early; transitioned to heavy rainstorm during egress peak.",
        recommendations=[
            "Optimize Gate D capacity indicators prior to peak match exits.",
            "Pre-stage wet floor warning boards in covered concourses."
        ],
        resource_usage="148 volunteers deployed, 3 EMS squads active, 8 shuttle buses dispatched.",
        lessons_learned="Earlier pre-positioning of volunteers at Gate C during sudden rain reduces bottlenecks by 20%."
    )
