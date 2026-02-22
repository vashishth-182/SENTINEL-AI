from typing import List, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from core import dependencies
from core.database import get_db
from models.alert import Alert
from models.stream import Stream
from schemas.alert import AlertUpdate, AlertResponse
from models.user import User

router = APIRouter()

@router.get("/", response_model=List[AlertResponse])
def read_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_active_user),
    skip: int = 0,
    limit: int = 100,
    severity: Optional[str] = None,
    resolved: Optional[bool] = None,
    stream_id: Optional[UUID] = None
) -> Any:
    query = db.query(Alert, Stream.name.label("stream_name"))\
        .join(Stream, Alert.stream_id == Stream.id)
    
    if severity:
        query = query.filter(Alert.severity == severity)
    if resolved is not None:
        query = query.filter(Alert.resolved == resolved)
    if stream_id:
        query = query.filter(Alert.stream_id == stream_id)
        
    results = query.order_by(Alert.created_at.desc()).offset(skip).limit(limit).all()
    
    # Flatten the result because query(Alert, Stream.name) returns tuples
    alerts = []
    for alert, stream_name in results:
        alert_dict = alert.__dict__
        alert_dict["stream_name"] = stream_name
        alerts.append(alert_dict)
    return alerts

@router.patch("/{id}/resolve", response_model=AlertResponse)
def resolve_alert(
    *,
    db: Session = Depends(get_db),
    id: UUID,
    current_user: User = Depends(dependencies.get_current_active_user),
) -> Any:
    alert = db.query(Alert).filter(Alert.id == id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.resolved = True
    alert.resolved_by = current_user.id
    from datetime import datetime
    alert.resolved_at = datetime.utcnow()
    
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert

@router.get("/{id}", response_model=AlertResponse)
def read_alert(
    *,
    db: Session = Depends(get_db),
    id: UUID,
    current_user: User = Depends(dependencies.get_current_active_user),
) -> Any:
    alert = db.query(Alert).filter(Alert.id == id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert
