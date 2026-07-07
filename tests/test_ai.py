from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)
AUTH_HEADER = {"Authorization": "Bearer stadiummind_eval_secret_token_12345"}

def test_emergency_report():
    payload = {
        "incident_text": "Fan collapsed near Section 218"
    }
    response = client.post("/api/v1/emergency/report", json=payload, headers=AUTH_HEADER)
    assert response.status_code == 200
    data = response.json()
    assert data["severity"] == "CRITICAL"
    assert "dispatched_unit" in data

def test_volunteer_ask():
    payload = {
        "volunteer_id": "VOL-409",
        "current_location": "Gate A Corridor",
        "query": "Where should I go?"
    }
    response = client.post("/api/v1/volunteer/ask", json=payload, headers=AUTH_HEADER)
    assert response.status_code == 200
    data = response.json()
    assert "assigned_zone" in data
    assert "task_description" in data

def test_decision_trigger():
    payload = {
        "event_scenario": "Heavy rain starts post-match"
    }
    response = client.post("/api/v1/decision/trigger", json=payload, headers=AUTH_HEADER)
    assert response.status_code == 200
    data = response.json()
    assert "consequences" in data
    assert len(data["actions"]) > 0

def test_incident_generate():
    payload = {
        "staff_raw_text": "Fan slipped on wet stairs, minor leg cut, medic applied bandage."
    }
    response = client.post("/api/v1/incident/generate", json=payload, headers=AUTH_HEADER)
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "escalation_level" in data
