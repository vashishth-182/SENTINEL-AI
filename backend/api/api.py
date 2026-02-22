from fastapi import APIRouter
from api.routes import auth, streams, alerts, analytics, presets, detections, settings, live

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(streams.router, prefix="/streams", tags=["streams"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(presets.router, prefix="/presets", tags=["presets"])
api_router.include_router(detections.router, prefix="/detections", tags=["detections"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
api_router.include_router(live.router, prefix="/live", tags=["live"])
