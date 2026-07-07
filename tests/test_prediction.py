from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)
AUTH_HEADER = {"Authorization": "Bearer stadiummind_eval_secret_token_12345"}

def test_crowd_prediction_normal():
    payload = {
        "gate_id": "Gate C",
        "current_count": 1000,
        "flow_rate_per_min": 50
    }
    response = client.post("/api/v1/crowd/predict", json=payload, headers=AUTH_HEADER)
    assert response.status_code == 200
    data = response.json()
    assert data["congestion_status"] == "NORMAL"

def test_crowd_prediction_high():
    payload = {
        "gate_id": "Gate C",
        "current_count": 4800,
        "flow_rate_per_min": 200
    }
    response = client.post("/api/v1/crowd/predict", json=payload, headers=AUTH_HEADER)
    assert response.status_code == 200
    data = response.json()
    assert data["congestion_status"] == "HIGH"
    assert "Gate D" in data["recommendation"]

def test_sustainability_prediction():
    payload = {
        "estimated_attendance": 50000,
        "temperature_celsius": 30.0
    }
    response = client.post("/api/v1/sustainability/predict", json=payload, headers=AUTH_HEADER)
    assert response.status_code == 200
    data = response.json()
    assert data["electricity_mwh_est"] > 0
    assert data["water_liters_est"] == 1500000.0
