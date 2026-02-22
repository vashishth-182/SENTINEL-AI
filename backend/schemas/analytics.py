from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import date
from uuid import UUID

class AnalyticsSummary(BaseModel):
    totalDetectionsToday: int
    totalAlertsToday: int
    mostActiveStream: str
    peakHour: int
    automationRate: float

class AnalyticsBase(BaseModel):
    date: date
    detection_counts: Optional[Dict[str, int]]
    action_counts: Optional[Dict[str, int]]
    alert_counts: Optional[Dict[str, int]]
    peak_hours: Optional[Dict[str, int]]

class AnalyticsResponse(AnalyticsBase):
    id: UUID
    stream_id: UUID

    class Config:
        from_attributes = True
