from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="student")  # "student" or "admin"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Upload(Base):
    __tablename__ = "uploads"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course = Column(String, nullable=False)
    chapter = Column(String, nullable=False)
    visibility = Column(String, default="private")  # "private" | "public" | "official"
    filename = Column(String, nullable=False)
    stored_path = Column(String, nullable=False)
    extracted_text_path = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SiteVisit(Base):
    __tablename__ = "site_visits"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    # Optional: store crude location or just count
    meta_info = Column(String, nullable=True)

class QuestionGenerationLog(Base):
    __tablename__ = "question_generation_logs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    course = Column(String, nullable=True)
    chapter = Column(String, nullable=True)
    exam_type = Column(String, nullable=True)
