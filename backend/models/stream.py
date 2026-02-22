from sqlalchemy import Column, String, Text, JSON, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from core.database import Base

class Stream(Base):
    __tablename__ = "streams"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    url = Column(Text, nullable=False)
    status = Column(String(20), default="inactive") # active | inactive | error
    config_preset = Column(String(50), default="security")
    detection_zones = Column(JSON, nullable=True) # detection_zones in JSONB
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.now())

    owner = relationship("User")
