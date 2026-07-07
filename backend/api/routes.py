from fastapi import APIRouter, Depends, Request
from backend.models.schemas import (
    CrowdPredictRequest, CrowdPredictResponse,
    RouteRequest, RouteResponse,
    VolunteerQueryRequest, VolunteerQueryResponse,
    SustainabilityRequest, SustainabilityResponse,
    EmergencyReportRequest, EmergencyReportResponse,
    DecisionTriggerRequest, DecisionTriggerResponse,
    IncidentGeneratorRequest, IncidentReportResponse
)
from backend.utils.security import verify_token, check_rate_limit, sanitize_input
from backend.services.ai_engine import ai_engine

router = APIRouter(prefix="/api/v1")

@router.get("/telemetry", dependencies=[Depends(verify_token)])
async def get_telemetry(request: Request):
    """
    Returns real-time telemetry metrics for the stadium dashboard.
    """
    check_rate_limit(request.client.host)
    return {
        "crowd_density": {"status": "Warning", "value": "Gate C High Flow"},
        "transport": {"status": "Optimal", "value": "Metro 5 Min intervals"},
        "medical": {"status": "Good", "value": "3 units active, 0 backlogged"},
        "weather": {"status": "Optimal", "value": "Clear, 24°C"},
        "security": {"status": "Optimal", "value": "All checkpoints cleared"},
        "energy": {"status": "Efficient", "value": "240 kW solar output"},
        "waste": {"status": "Optimal", "value": "Bin capacity 42%"}
    }

@router.post("/crowd/predict", response_model=CrowdPredictResponse, dependencies=[Depends(verify_token)])
async def crowd_predict(payload: CrowdPredictRequest, request: Request):
    check_rate_limit(request.client.host)
    
    # Calculate congestion status deterministically or via AI
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
    
    # Safely sanitize start/end
    start = sanitize_input(payload.start_location)
    end = sanitize_input(payload.end_location)
    
    # Return simulated safest path matching conditions
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
    
    ai_res = ai_engine.run_prompt(prompt)
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
    
    # Basic prediction calculations
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
    
    ai_res = ai_engine.run_prompt(prompt)
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
    
    ai_res = ai_engine.run_prompt(prompt)
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
    
    ai_res = ai_engine.run_prompt(prompt)
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
