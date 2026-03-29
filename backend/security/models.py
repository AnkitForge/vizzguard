from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .database import Base


# ═══════════════════════════════════════════════════════════
#  SQLAlchemy Models (Database Tables)
# ═══════════════════════════════════════════════════════════

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    alerts = relationship("Alert", back_populates="user")
    video_reports = relationship("VideoAnalysisReport", back_populates="user")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(String, unique=True, index=True, nullable=False)  # UUID from edge agent
    type = Column(String, nullable=False)             # weapon, violence, pose
    camera_id = Column(String, nullable=False)
    location = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    timestamp = Column(String, nullable=False)         # ISO timestamp from edge
    thumbnail = Column(Text, nullable=True)            # Base64 encoded thumbnail
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Who was logged in when alert was received (nullable for edge-agent-pushed alerts)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user = relationship("User", back_populates="alerts")


class VideoAnalysisReport(Base):
    __tablename__ = "video_analysis_reports"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    summary = Column(String, nullable=False)           # "Threatening" or "Clean"
    duration = Column(Float, nullable=False)
    weapon_count = Column(Integer, default=0)
    violence_count = Column(Integer, default=0)
    timeline_json = Column(Text, nullable=True)        # Full timeline stored as JSON string
    significant_frames_json = Column(Text, nullable=True)  # Frames stored as JSON string
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Who uploaded the video
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="video_reports")


# ═══════════════════════════════════════════════════════════
#  Pydantic Models (API Validation Schemas)
# ═══════════════════════════════════════════════════════════

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str = "user"

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class AlertResponse(BaseModel):
    id: int
    alert_id: str
    type: str
    camera_id: str
    location: str
    confidence: float
    timestamp: str
    thumbnail: Optional[str] = None
    created_at: datetime
    username: Optional[str] = None

    class Config:
        from_attributes = True

class VideoReportResponse(BaseModel):
    id: int
    filename: str
    summary: str
    duration: float
    weapon_count: int
    violence_count: int
    created_at: datetime
    username: Optional[str] = None

    class Config:
        from_attributes = True
