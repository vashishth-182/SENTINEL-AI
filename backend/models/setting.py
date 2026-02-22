from sqlalchemy import Column, String, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid
from core.database import Base

class SystemSetting(Base):
    __tablename__ = "system_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category = Column(String(50), nullable=False, unique=True) # e.g., 'neural_engine', 'storage', 'alerts'
    settings = Column(JSON, nullable=False)
