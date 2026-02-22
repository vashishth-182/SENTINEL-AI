from sqlalchemy import Column, Date, JSON, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
import uuid
from core.database import Base

class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stream_id = Column(UUID(as_uuid=True), ForeignKey("streams.id", ondelete="CASCADE"))
    date = Column(Date, nullable=False)
    detection_counts = Column(JSON, nullable=True)
    action_counts = Column(JSON, nullable=True)
    alert_counts = Column(JSON, nullable=True)
    peak_hours = Column(JSON, nullable=True)

    __table_args__ = (
        UniqueConstraint('stream_id', 'date', name='uix_stream_date'),
    )
