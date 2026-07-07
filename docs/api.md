# API Documentation - StadiumMind AI Backend

All endpoints require authorization via a Bearer token matching `API_BEARER_TOKEN`.

## Endpoints Summary

### 1. Crowd AI
*   **POST** `/api/v1/crowd/predict`
    *   **Description:** Predicts crowd congestion levels.
    *   **Payload:**
        ```json
        {
          "gate_id": "Gate C",
          "current_count": 4500,
          "flow_rate_per_min": 150
        }
        ```
    *   **Response:**
        ```json
        {
          "gate_id": "Gate C",
          "congestion_status": "HIGH",
          "estimated_minutes_to_limit": 15,
          "recommendation": "Redirect traffic to Gate D"
        }
        ```

### 2. Emergency dispatch
*   **POST** `/api/v1/emergency/report`
    *   **Description:** Extracts emergency detail, checks severity, dispatches resources.
    *   **Payload:**
        ```json
        {
          "incident_text": "Fan collapsed near Section 218"
        }
        ```
    *   **Response:**
        ```json
        {
          "location": "Section 218",
          "severity": "CRITICAL",
          "dispatched_unit": "Medic Unit 4",
          "eta_minutes": 3,
          "route_suggestion": "Elevator B -> Gate 4 corridor"
        }
        ```

### 3. Sustainability AI
*   **POST** `/api/v1/sustainability/predict`
    *   **Description:** Predict resource requirements (electricity, water, food).
    *   **Payload:**
        ```json
        {
          "estimated_attendance": 80000,
          "temperature_celsius": 28.5
        }
        ```
    *   **Response:**
        ```json
        {
          "electricity_mwh": 120.4,
          "water_liters": 2400000,
          "food_waste_tons_est": 4.2
        }
        ```
