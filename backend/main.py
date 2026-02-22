import threading
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from api.api import api_router
from api.websockets import live_feed
from ai_worker import orchestrate

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start the AI Orchestrator in a background thread
    print("[*] INITIALIZING NEURAL ORCHESTRATOR...")
    orchestrator_thread = threading.Thread(target=orchestrate, daemon=True)
    orchestrator_thread.start()
    yield
    # Shutdown logic if needed

app = FastAPI(
    title=settings.PROJECT_NAME, 
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    health_status = {
        "status": "ok",
        "models_loaded": True, # Placeholder for AI models
        "db_connected": False,
        "redis_connected": False
    }
    
    # Check Database
    try:
        from core.database import SessionLocal
        from sqlalchemy import text
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        health_status["db_connected"] = True
        db.close()
    except Exception as e:
        print(f"DB Health check failed: {e}")
        health_status["status"] = "error"
        
    # Check Redis
    try:
        import redis
        r = redis.from_url(settings.REDIS_URL)
        r.ping()
        health_status["redis_connected"] = True
    except Exception as e:
        print(f"Redis Health check failed: {e}")
        # Not making status = error for redis as it might be optional for some ops
        
    return health_status

app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(live_feed.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

