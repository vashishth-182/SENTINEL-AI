from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class AlertBase(BaseModel):
    alert_type: str
    severity: str
    description: str
    video_clip_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    resolved: bool = False

class AlertCreate(AlertBase):
    stream_id: UUID

class AlertUpdate(BaseModel):
    resolved: bool
    resolved_by: Optional[UUID] 
    resolved_at: Optional[datetime]

class AlertResponse(AlertBase):
    id: UUID
    stream_id: UUID
    stream_name: Optional[str] = None
    created_at: datetime
    resolved_by: Optional[UUID]
    resolved_at: Optional[datetime]

    class Config:
        from_attributes = True
