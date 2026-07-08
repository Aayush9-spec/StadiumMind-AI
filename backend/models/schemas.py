from pydantic import BaseModel, Field
from typing import List, Optional

# --- Crowd Heatmap Prediction ---
class CrowdPredictRequest(BaseModel):
    gate_id: str = Field(..., json_schema_extra={"example": "Gate C"})
    current_count: int = Field(..., ge=0, json_schema_extra={"example": 4500})
    flow_rate_per_min: int = Field(..., ge=0, json_schema_extra={"example": 150})

class CrowdPredictResponse(BaseModel):
    gate_id: str
    congestion_status: str  # NORMAL, MEDIUM, HIGH
    estimated_minutes_to_limit: int
    recommendation: str

# --- AI Route Planner ---
class RouteRequest(BaseModel):
    start_location: str = Field(..., json_schema_extra={"example": "Section 105"})
    end_location: str = Field(..., json_schema_extra={"example": "Gate D"})
    require_wheelchair: bool = Field(default=False)
    require_elevators: bool = Field(default=False)

class RouteResponse(BaseModel):
    path: List[str]
    estimated_minutes: int
    accessibility_warnings: List[str]
    safety_rating: str  # SAFE, CAUTION

# --- Volunteer AI ---
class VolunteerQueryRequest(BaseModel):
    volunteer_id: str = Field(..., json_schema_extra={"example": "VOL-409"})
    current_location: str = Field(..., json_schema_extra={"example": "Zone A Corridor"})
    query: str = Field(..., json_schema_extra={"example": "Where should I go?"})

class VolunteerQueryResponse(BaseModel):
    assigned_zone: str
    task_description: str
    urgency_level: str  # LOW, MEDIUM, HIGH

# --- Sustainability AI ---
class SustainabilityRequest(BaseModel):
    estimated_attendance: int = Field(..., ge=0, json_schema_extra={"example": 65000})
    temperature_celsius: float = Field(..., json_schema_extra={"example": 27.5})

class SustainabilityResponse(BaseModel):
    electricity_mwh_est: float
    water_liters_est: float
    waste_tons_est: float
    food_demand_units_est: int

# --- Emergency AI ---
class EmergencyReportRequest(BaseModel):
    incident_text: str = Field(..., min_length=5, json_schema_extra={"example": "Fan collapsed near Section 218"})

class EmergencyReportResponse(BaseModel):
    extracted_location: str
    severity: str  # LOW, MEDIUM, CRITICAL
    dispatched_unit: str
    suggested_route: str
    eta_minutes: int

# --- AI Decision Engine ---
class DecisionTriggerRequest(BaseModel):
    event_scenario: str = Field(..., json_schema_extra={"example": "Heavy rain starts suddenly post-match"})

class DecisionTriggerResponse(BaseModel):
    primary_event: str
    consequences: List[str]
    actions: List[str]
    reasoning_steps: List[str]

# --- AI Incident Report Generator ---
class IncidentGeneratorRequest(BaseModel):
    staff_raw_text: str = Field(..., min_length=5, json_schema_extra={"example": "Fan slipped on wet stairs, minor leg cut, medic applied bandage."})

class IncidentReportResponse(BaseModel):
    summary: str
    severity: str
    recommended_action: str
    resources_required: List[str]
    time_estimate: str
    escalation_level: str
