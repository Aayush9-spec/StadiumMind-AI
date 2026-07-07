import json
import logging
from typing import Dict, Any
from google import genai
from google.genai import types
from backend.config import settings

logger = logging.getLogger(__name__)

class AIEngine:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None
            logger.warning("GEMINI_API_KEY not found. Running AI Services in offline/mock mode.")

    def run_prompt(self, prompt: str, schema_class=None) -> Dict[str, Any]:
        """
        Runs a prompt against Gemini. If a schema_class is provided, requests JSON matching that schema.
        Falls back to mock data if key is missing or calls fail.
        """
        if not self.client:
            return self._get_mock_fallback(prompt)

        try:
            config = None
            if schema_class:
                config = types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=schema_class,
                )
            
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=config
            )
            
            if schema_class:
                return json.loads(response.text)
            return {"response": response.text}
        except Exception as e:
            logger.error(f"Gemini API call failed: {e}. Falling back to mock data.")
            return self._get_mock_fallback(prompt)

    def _get_mock_fallback(self, prompt: str) -> Dict[str, Any]:
        """
        Deterministic mock fallback based on keywords in the prompt.
        """
        prompt_lower = prompt.lower()
        
        if "emergency" in prompt_lower or "incident" in prompt_lower:
            if "injured" in prompt_lower or "slipped" in prompt_lower:
                return {
                    "summary": "Fan slipped on stairs, sustaining a minor leg laceration. First aid was administered.",
                    "severity": "MEDIUM",
                    "recommended_action": "Monitor section stairways for moisture/spills. Station an additional usher.",
                    "resources_required": ["First Aid Kit", "Wet Floor Caution Sign"],
                    "time_estimate": "10 minutes",
                    "escalation_level": "LEVEL 1 (Local Staff)"
                }
            return {
                "extracted_location": "Section 218",
                "severity": "CRITICAL",
                "dispatched_unit": "Medic Unit 4",
                "suggested_route": "Elevator B -> Section 218 Access Corridor",
                "eta_minutes": 3
            }
            
        if "rain" in prompt_lower or "weather" in prompt_lower:
            return {
                "primary_event": "Unexpected Heavy Rainfall & Exit Rush",
                "consequences": [
                    "Fans leaving sections simultaneously, overloading main concourses",
                    "Parking lot exits experiencing heavy vehicle backlog",
                    "Public transport (Metro/Light Rail) platform overcrowding"
                ],
                "actions": [
                    "Open auxiliary Gate E to ease pedestrian choke points",
                    "Activate shuttle bus fleet B to transport fans to Metro",
                    "Trigger digital signage in concourses advising fans to delay exit with indoor food discounts",
                    "Re-deploy 15 volunteers to Gate E to direct traffic flow"
                ],
                "reasoning_steps": [
                    "Detect precipitation start via weather sensor API.",
                    "Analyze crowd egress velocity vs. exit gate capacity constraints.",
                    "Identify parking lot traffic outflow rate limits.",
                    "Formulate action triggers to spread egress demand across time and space."
                ]
            }
            
        if "volunteer" in prompt_lower:
            return {
                "assigned_zone": "Food Court Zone B",
                "task_description": "Assist with guiding visitors to less congested lines and monitor waste bins.",
                "urgency_level": "MEDIUM"
            }
            
        return {
            "response": "StadiumMind Operational intelligence response [Mock Offline mode]."
        }

ai_engine = AIEngine()
