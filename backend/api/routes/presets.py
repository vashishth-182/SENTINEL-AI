from fastapi import APIRouter, Body, Depends, HTTPException
from typing import Any
from models.user import User
from core import dependencies

router = APIRouter()

INDUSTRY_PRESETS = {
  "security": {
    "label": "Security",
    "watches": ["falling", "fighting", "loitering", "trespassing", "vandalism"],
    "defaultZones": "full-frame",
    "alertColor": "#e94560"
  },
  "retail": {
    "label": "Retail",
    "watches": ["concealing", "loitering", "running", "crowd-formation", "abandoned-bag"],
    "defaultZones": "shelving-areas",
    "alertColor": "#f59e0b"
  },
  "traffic": {
    "label": "Traffic",
    "watches": ["collision", "pedestrian-on-road", "vehicle-stopped", "speeding", "wrong-direction"],
    "defaultZones": "road-lanes",
    "alertColor": "#ef4444"
  },
  "healthcare": {
    "label": "Healthcare",
    "watches": ["falling", "lying-down", "restricted-zone-entry", "distress-gesture"],
    "defaultZones": "room-boundary",
    "alertColor": "#e94560"
  },
  "sports": {
    "label": "Sports",
    "watches": ["player-tracking", "out-of-bounds", "collision", "crowd-rush"],
    "defaultZones": "field-boundary",
    "alertColor": "#10b981"
  }
}

@router.get("/")
def get_presets(
    current_user: User = Depends(dependencies.get_current_active_user),
) -> Any:
    return INDUSTRY_PRESETS

@router.post("/switch")
def switch_preset(
    current_user: User = Depends(dependencies.get_current_active_user),
    stream_id: str = Body(...),
    preset_name: str = Body(...)
) -> Any:
    # Logic to update stream preset
    return {"status": "switched", "preset": preset_name}
