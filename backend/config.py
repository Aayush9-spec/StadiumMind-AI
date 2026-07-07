import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "StadiumMind AI"
    VERSION: str = "1.0.0"
    
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    API_BEARER_TOKEN: str = os.getenv("API_BEARER_TOKEN", "stadiummind_eval_secret_token_12345")
    
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    CORS_ORIGINS: list = [
        origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000,https://stadiummind-ai.vercel.app").split(",")
    ]
    
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", 60))

settings = Settings()
