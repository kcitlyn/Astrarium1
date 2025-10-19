from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    skills = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")
    alien_pet = relationship("AlienPet", back_populates="user", uselist=False, cascade="all, delete-orphan")
    streak_count = Column(Integer, default=0)
    last_practice_date = Column(DateTime, nullable=True)
    total_xp = Column(Integer, default=0)