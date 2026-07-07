import time
from typing import Dict
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.config import settings

security = HTTPBearer()

# In-memory rate limiting store (IP -> list of timestamps)
rate_limit_store: Dict[str, list] = {}

def sanitize_input(text: str) -> str:
    """
    Sanitize input text to prevent simple prompt injection characters, XSS elements, etc.
    """
    if not text:
        return ""
    # Basic html escaping
    escaped = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;").replace("'", "&#x27;")
    return escaped

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Verifies Bearer token against settings.
    """
    if credentials.credentials != settings.API_BEARER_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API authorization token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return credentials.credentials

def check_rate_limit(client_ip: str):
    """
    Simple sliding window rate limiter.
    """
    now = time.time()
    if client_ip not in rate_limit_store:
        rate_limit_store[client_ip] = []
    
    # Filter out timestamps older than 60 seconds
    rate_limit_store[client_ip] = [t for t in rate_limit_store[client_ip] if now - t < 60]
    
    if len(rate_limit_store[client_ip]) >= settings.RATE_LIMIT_PER_MINUTE:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please try again later."
        )
    
    rate_limit_store[client_ip].append(now)
