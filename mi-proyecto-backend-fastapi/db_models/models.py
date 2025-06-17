from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Enum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notification_settings = relationship("UserNotificationSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    first_name = Column(String(255))
    last_name = Column(String(255))
    bio = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="profile")

class UserNotificationSettings(Base):
    __tablename__ = "user_notification_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    email_notifications = Column(Boolean, default=True)
    push_notifications = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="notification_settings")

class VerificationStatus(enum.Enum):
    pending = "pending"
    verified = "verified"
    failed = "failed"

class UserVerification(Base):
    __tablename__ = "user_verifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    verification_code = Column(String(255), nullable=False)
    status = Column(Enum(VerificationStatus), default=VerificationStatus.pending)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 