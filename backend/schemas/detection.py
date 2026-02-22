from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID

class DetectionBase(BaseModel):
    stream_id: UUID
    timestamp: datetime
    object_class: str
    confidence: float
    bbox_json: Optional[Dict[str, Any]] = None

class DetectionCreate(DetectionBase):
    pass

class DetectionResponse(DetectionBase):
    id: UUID

    class Config:
        from_attributes = True
