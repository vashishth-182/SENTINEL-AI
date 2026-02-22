from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from core import dependencies
from core.database import get_db
from models.detection import Detection
from models.stream import Stream
from schemas.detection import DetectionResponse
from models.user import User

router = APIRouter()

@router.get("/", response_model=List[DetectionResponse])
def read_detections(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_active_user),
    limit: int = 50,
    stream_id: str = None
) -> Any:
    """
    Retrieve recent detections.
    If admin, see all. If user, see only their streams' detections.
    """
    query = db.query(Detection).join(Stream)
    
    if current_user.role != "admin":
        query = query.filter(Stream.owner_id == current_user.id)
        
    if stream_id:
        query = query.filter(Detection.stream_id == stream_id)
    
    return query.order_by(desc(Detection.timestamp)).limit(limit).all()
