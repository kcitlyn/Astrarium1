from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_name = Column(String, nullable=False)
    category = Column(String, nullable=True)  # Optional, freeform category tag
    proficiency_level = Column(Float, default=3.0)
    last_used = Column(DateTime, default=datetime.utcnow)
    last_practiced = Column(DateTime, nullable=True)
    decay_rate = Column(Float, default=0.1)
    health_score = Column(Float, default=100.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    star_power = Column(Float, default=50.0)

    # Spaced Repetition (Anki-style)
    next_review_date = Column(DateTime, nullable=True)  # When to review next
    review_interval_days = Column(Float, default=1.0)  # Current interval in days
    ease_factor = Column(Float, default=2.5)  # How easy this skill is (2.5 is default)
    consecutive_correct = Column(Integer, default=0)  # Streak of correct answers
    consecutive_wrong = Column(Integer, default=0)  # Streak of wrong answers (for pet health)

    user = relationship("User", back_populates="skills")
    practice_sessions = relationship("PracticeSession", back_populates="skill", cascade="all, delete-orphan")

    def calculate_next_review(self, answer_quality: int):
        """
        Calculate next review date using spaced repetition (SM-2 algorithm like Anki)

        answer_quality: 0-5 scale
        0-1: Complete failure, restart
        2: Hard, but recalled
        3: Good
        4-5: Easy
        """
        from datetime import timedelta

        if answer_quality < 2:
            # Failed - reset to beginning
            self.review_interval_days = 1.0
            self.consecutive_correct = 0
            self.ease_factor = max(1.3, self.ease_factor - 0.2)
        else:
            # Success - increase interval
            self.consecutive_correct += 1

            if self.consecutive_correct == 1:
                self.review_interval_days = 1.0
            elif self.consecutive_correct == 2:
                self.review_interval_days = 6.0
            else:
                # Use ease factor for subsequent reviews
                self.review_interval_days = self.review_interval_days * self.ease_factor

            # Adjust ease factor based on difficulty
            if answer_quality == 2:  # Hard
                self.ease_factor = max(1.3, self.ease_factor - 0.15)
            elif answer_quality == 3:  # Good
                pass  # Keep ease factor
            elif answer_quality >= 4:  # Easy
                self.ease_factor = self.ease_factor + 0.1

        # Set next review date
        self.next_review_date = datetime.utcnow() + timedelta(days=self.review_interval_days)
        self.last_practiced = datetime.utcnow()

        return self.next_review_date

class PracticeSession(Base):
    __tablename__ = "practice_sessions"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("user_skills.id"), nullable=False)
    questions_answered = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    session_date = Column(DateTime, default=datetime.utcnow)
    duration_minutes = Column(Integer, default=0)
    xp_earned = Column(Integer, default=0)
    
    skill = relationship("UserSkill", back_populates="practice_sessions")