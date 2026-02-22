from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from core import dependencies
from core.database import get_db
from models.stream import Stream
from schemas.stream import StreamCreate, StreamUpdate, StreamResponse
from models.user import User

router = APIRouter()

@router.get("/", response_model=List[StreamResponse])
def read_streams(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve streams.
    """
    if current_user.role == "admin":
        return db.query(Stream).offset(skip).limit(limit).all()
    return db.query(Stream).filter(Stream.owner_id == current_user.id).offset(skip).limit(limit).all()

@router.post("/", response_model=StreamResponse)
def create_stream(
    *,
    db: Session = Depends(get_db),
    stream_in: StreamCreate,
    current_user: User = Depends(dependencies.get_current_active_user),
) -> Any:
    """
    Create new stream.
    """
    stream = Stream(
        name=stream_in.name,
        url=stream_in.url,
        status=stream_in.status,
        config_preset=stream_in.config_preset,
        owner_id=current_user.id,
        detection_zones=stream_in.detection_zones
    )
    db.add(stream)
    db.commit()
    db.refresh(stream)
    return stream

@router.get("/{id}", response_model=StreamResponse)
def read_stream(
    *,
    db: Session = Depends(get_db),
    id: UUID,
    current_user: User = Depends(dependencies.get_current_active_user),
) -> Any:
    """
    Get stream by ID.
    """
    stream = db.query(Stream).filter(Stream.id == id).first()
    if not stream:
        raise HTTPException(status_code=404, detail="Stream not found")
    if stream.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return stream

@router.patch("/{id}", response_model=StreamResponse)
def update_stream(
    *,
    db: Session = Depends(get_db),
    id: UUID,
    stream_in: StreamUpdate,
    current_user: User = Depends(dependencies.get_current_active_user),
) -> Any:
    """
    Update a stream.
    """
    stream = db.query(Stream).filter(Stream.id == id).first()
    if not stream:
        raise HTTPException(status_code=404, detail="Stream not found")
    if stream.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    update_data = stream_in.model_dump(exclude_unset=True) # use model_dump for Pydantic v2
    for field, value in update_data.items():
        setattr(stream, field, value)
        
    db.add(stream)
    db.commit()
    db.refresh(stream)
    return stream

@router.delete("/{id}", response_model=StreamResponse)
def delete_stream(
    *,
    db: Session = Depends(get_db),
    id: UUID,
    current_user: User = Depends(dependencies.get_current_active_user),
) -> Any:
    """
    Delete a stream.
    """
    stream = db.query(Stream).filter(Stream.id == id).first()
    if not stream:
        raise HTTPException(status_code=404, detail="Stream not found")
    if stream.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    db.delete(stream)
    db.commit()
    return stream

@router.post("/{id}/start")
def start_stream(
    *,
    db: Session = Depends(get_db),
    id: UUID,
    current_user: User = Depends(dependencies.get_current_active_user),
) -> Any:
    """
    Start AI processing on stream.
    """
    stream = db.query(Stream).filter(Stream.id == id).first()
    if not stream:
        raise HTTPException(status_code=404, detail="Stream not found")
    
    # Logic to start stream (e.g. Celery task)
    # from tasks.celery_tasks import start_stream_processing
    # start_stream_processing.delay(str(id)) 
    
    stream.status = "active"
    db.commit()
    return {"status": "started"}

@router.post("/{id}/stop")
def stop_stream(
    *,
    db: Session = Depends(get_db),
    id: UUID,
    current_user: User = Depends(dependencies.get_current_active_user),
) -> Any:
    """
    Stop AI processing on stream.
    """
    stream = db.query(Stream).filter(Stream.id == id).first()
    if not stream:
        raise HTTPException(status_code=404, detail="Stream not found")
    
    # Logic to stop stream
    
    stream.status = "inactive"
    db.commit()
    return {"status": "stopped"}
