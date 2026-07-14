from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)
AUTH_HEADER = {"Authorization": "Bearer stadiummind_eval_secret_token_12345"}

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_telemetry_unauthorized():
    response = client.get("/api/v1/telemetry")
    assert response.status_code == 401

def test_telemetry_authorized():
    response = client.get("/api/v1/telemetry", headers=AUTH_HEADER)
    assert response.status_code == 200
    assert "crowd_density" in response.json()

def test_route_plan_authorized():
    payload = {
        "start_location": "Section 101",
        "end_location": "Gate A",
        "require_wheelchair": True,
        "require_elevators": False
    }
    response = client.post("/api/v1/route/plan", json=payload, headers=AUTH_HEADER)
    assert response.status_code == 200
    data = response.json()
    assert "path" in data
    assert len(data["path"]) > 0

def test_volunteer_ask_authorized():
    payload = {
        "volunteer_id": "V123",
        "current_location": "Gate B",
        "query": "Where is the nearest medical room?"
    }
    response = client.post("/api/v1/volunteer/ask", json=payload, headers=AUTH_HEADER)
    assert response.status_code == 200
    data = response.json()
    assert "assigned_zone" in data

def test_emergency_report_authorized():
    payload = {
        "incident_text": "Medical help needed at Gate C concourse"
    }
    response = client.post("/api/v1/emergency/report", json=payload, headers=AUTH_HEADER)
    assert response.status_code == 200
    data = response.json()
    assert "extracted_location" in data

def test_decision_trigger_authorized():
    payload = {
        "event_scenario": "Heavy storm flooding the east gate"
    }
    response = client.post("/api/v1/decision/trigger", json=payload, headers=AUTH_HEADER)
    assert response.status_code == 200
    data = response.json()
    assert "primary_event" in data

def test_incident_generate_authorized():
    payload = {
        "staff_raw_text": "Minor slip on trash in food court, resolved by clean staff"
    }
    response = client.post("/api/v1/incident/generate", json=payload, headers=AUTH_HEADER)
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
