from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime
from uuid import UUID

class DetectionZone(BaseModel):
    points: List[List[int]] # [[x,y], [x,y]]

class StreamBase(BaseModel):
    name: str
    url: str
    status: str = "inactive"
    config_preset: str = "security"
    detection_zones: Optional[Any] = None

class StreamCreate(StreamBase):
    pass

class StreamUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    status: Optional[str] = None
    config_preset: Optional[str] = None
    detection_zones: Optional[Any] = None

class StreamResponse(StreamBase):
    id: UUID
    owner_id: Optional[UUID]
    created_at: datetime

    class Config:
        from_attributes = True
