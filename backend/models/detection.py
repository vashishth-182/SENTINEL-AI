from sqlalchemy import Column, String, Float, Integer, JSON, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from core.database import Base

class Detection(Base):
    __tablename__ = "detections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stream_id = Column(UUID(as_uuid=True), ForeignKey("streams.id", ondelete="CASCADE"))
    timestamp = Column(DateTime, nullable=False)
    object_class = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    bbox_json = Column(JSON, nullable=False)
    frame_number = Column(Integer, nullable=True)
