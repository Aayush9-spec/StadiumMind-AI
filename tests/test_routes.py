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
