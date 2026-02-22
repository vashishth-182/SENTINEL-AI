from sqlalchemy import Column, String, Float, Integer, JSON, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from core.database import Base

class Action(Base):
    __tablename__ = "actions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stream_id = Column(UUID(as_uuid=True), ForeignKey("streams.id", ondelete="CASCADE"))
    timestamp = Column(DateTime, nullable=False)
    action_type = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    duration_ms = Column(Integer, nullable=True)
    related_detection_ids = Column(JSON, nullable=True)
