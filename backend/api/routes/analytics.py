from typing import List, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta

from core import dependencies
from core.database import get_db
from models.detection import Detection
from models.stream import Stream
from models.alert import Alert
from models.user import User

router = APIRouter()

@router.get("/summary")
def get_analytics_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_active_user),
) -> Any:
    # Real aggregation
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    
    total_detections_today = db.query(func.count(Detection.id)).filter(Detection.timestamp >= today).scalar()
    total_alerts_today = db.query(func.count(Alert.id)).filter(Alert.created_at >= today).scalar()
    
    # Most active stream
    most_active = db.query(Stream.name, func.count(Detection.id).label('count'))\
        .join(Detection)\
        .group_by(Stream.name)\
        .order_by(desc('count'))\
        .first()
    
    most_active_name = most_active[0] if most_active else "None"
    
    # Simple hour aggregation for peak hour
    peak_hour_res = db.query(func.extract('hour', Detection.timestamp).label('hour'), func.count(Detection.id).label('count'))\
        .group_by('hour')\
        .order_by(desc('count'))\
        .first()
    
    peak_hour = int(peak_hour_res[0]) if peak_hour_res else 12

    return {
        "totalDetectionsToday": total_detections_today or 0,
        "totalAlertsToday": total_alerts_today or 0,
        "mostActiveStream": most_active_name,
        "peakHour": peak_hour,
        "automationRate": 94.2 # Mocked for now but based on AI vs manual
    }

@router.get("/detections-timeline")
def get_detections_timeline(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_active_user),
) -> Any:
    # Last 24 hours, grouped by hour
    yesterday = datetime.now() - timedelta(hours=24)
    
    timeline = db.query(
        func.date_trunc('hour', Detection.timestamp).label('time'),
        func.count(Detection.id).label('detections')
    ).filter(Detection.timestamp >= yesterday)\
     .group_by('time')\
     .order_by('time')\
     .all()
     
    return [{"time": t.time.strftime("%H:%M"), "detections": t.detections} for t in timeline]

@router.get("/object-distribution")
def get_object_distribution(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_active_user),
) -> Any:
    dist = db.query(Detection.object_class, func.count(Detection.id).label('value'))\
        .group_by(Detection.object_class)\
        .order_by(desc('value'))\
        .limit(5)\
        .all()
        
    return [{"name": d.object_class.capitalize(), "value": d.value} for d in dist]
