# Architecture Decisions (ADR) - StadiumMind AI

## ADR 1: Choose Gemini 2.5 Flash as Core LLM Engine
*   **Context:** We need fast response times for live crowd redirection and emergency actions, combined with complex multi-step reasoning capabilities.
*   **Decision:** We utilize the Gemini 2.5 Flash API. It provides high throughput and low latency, making it ideal for the real-time feedback loops needed in stadium operations.

## ADR 2: FastAPI for Backend Orchestrator
*   **Context:** The backend must handle high concurrency and support fast runtime testing.
*   **Decision:** We choose FastAPI. The automatic Pydantic validation serves as an immediate security layer against prompt injections and malicious API payloads, and the asynchronous event loop fits perfectly with real-time operations dashboards.

## ADR 3: Web Speech API for Speech Interface
*   **Context:** Voice input and output must work instantaneously without backend processing overhead or latency.
*   **Decision:** Client-side Web Speech API is used. It runs inside the fan/volunteer's browser directly, eliminating external API usage costs and payload delays.
