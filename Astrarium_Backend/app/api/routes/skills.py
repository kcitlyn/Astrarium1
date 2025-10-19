from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta

from app.database import get_db
from app.models.skill import UserSkill, PracticeSession
from app.models.user import User
from app.core.ai_service import CelestialAIOracle

router = APIRouter(prefix="/skills", tags=["skills"])

# Pydantic schemas
class SkillCreate(BaseModel):
    skill_name: str
    category: Optional[str] = None  # Optional freeform category
    proficiency_level: float = 5.0  # 1-10 scale

class SkillResponse(BaseModel):
    id: int
    skill_name: str
    category: Optional[str] = None  # Optional category
    proficiency_level: float
    health_score: float
    star_power: float
    last_practiced: Optional[datetime] = None  # Allow None
    created_at: datetime
    # Spaced repetition fields
    next_review_date: Optional[datetime] = None
    review_interval_days: float = 1.0
    ease_factor: float = 2.5
    consecutive_correct: int = 0

    class Config:
        from_attributes = True  # Allow ORM models

class SkillUpdate(BaseModel):
    proficiency_level: Optional[float] = None
    health_score: Optional[float] = None

# Dependency to get current user
def get_current_user(db: Session = Depends(get_db)) -> User:
    # TODO: Implement proper JWT authentication
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=401, detail="No user found. Please register first!")
    return user

@router.post("/add", response_model=SkillResponse)
async def add_skill(
    skill_data: SkillCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ⭐ Add ANY skill you've already mastered to prevent it from fading

    Track any skill you've learned - from Python to Piano, Excel to Empathy!
    Your proficiency level indicates your current mastery (1-10 scale).
    Category is optional - use it to organize if you want.
    """
    # Check if skill already exists for user
    existing = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id,
        UserSkill.skill_name == skill_data.skill_name
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="You already have this skill tracked!"
        )
    
    # Create skill
    new_skill = UserSkill(
        user_id=current_user.id,
        skill_name=skill_data.skill_name,
        category=skill_data.category,  # Freeform, can be anything or None
        proficiency_level=min(10.0, max(1.0, skill_data.proficiency_level)),
        health_score=100.0,  # Start at full health
        star_power=50.0,
        created_at=datetime.utcnow()
    )
    
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)
    
    return SkillResponse(
        id=new_skill.id,
        skill_name=new_skill.skill_name,
        category=new_skill.category,
        proficiency_level=new_skill.proficiency_level,
        health_score=new_skill.health_score,
        star_power=new_skill.star_power,
        last_practiced=new_skill.last_practiced,
        created_at=new_skill.created_at
    )

@router.get("/my-skills", response_model=List[SkillResponse])
async def get_my_skills(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    📚 Get all your tracked skills
    """
    skills = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id
    ).order_by(UserSkill.health_score.desc()).all()
    
    return [
        SkillResponse(
            id=s.id,
            skill_name=s.skill_name,
            category=s.category,
            proficiency_level=s.proficiency_level,
            health_score=s.health_score,
            star_power=s.star_power,
            last_practiced=s.last_practiced,
            created_at=s.created_at
        )
        for s in skills
    ]

@router.get("/skill/{skill_id}", response_model=SkillResponse)
async def get_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    🔍 Get details for a specific skill
    """
    skill = db.query(UserSkill).filter(
        UserSkill.id == skill_id,
        UserSkill.user_id == current_user.id
    ).first()
    
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    return SkillResponse(
        id=skill.id,
        skill_name=skill.skill_name,
        category=skill.category,
        proficiency_level=skill.proficiency_level,
        health_score=skill.health_score,
        star_power=skill.star_power,
        last_practiced=skill.last_practiced,
        created_at=skill.created_at
    )

@router.patch("/skill/{skill_id}", response_model=SkillResponse)
async def update_skill(
    skill_id: int,
    update_data: SkillUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ✏️ Update skill stats
    """
    skill = db.query(UserSkill).filter(
        UserSkill.id == skill_id,
        UserSkill.user_id == current_user.id
    ).first()
    
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    if update_data.proficiency_level is not None:
        skill.proficiency_level = min(10.0, max(1.0, update_data.proficiency_level))
    
    if update_data.health_score is not None:
        skill.health_score = min(100.0, max(0.0, update_data.health_score))
    
    db.commit()
    db.refresh(skill)

    return SkillResponse(
        id=skill.id,
        skill_name=skill.skill_name,
        category=skill.category,
        proficiency_level=skill.proficiency_level,
        health_score=skill.health_score,
        star_power=skill.star_power,
        last_practiced=skill.last_practiced,
        created_at=skill.created_at
    )

@router.delete("/skill/{skill_id}")
async def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    🗑️ Remove a skill from tracking
    """
    skill = db.query(UserSkill).filter(
        UserSkill.id == skill_id,
        UserSkill.user_id == current_user.id
    ).first()
    
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    skill_name = skill.skill_name
    db.delete(skill)
    db.commit()
    
    return {
        "message": f"✨ {skill_name} has been released into the cosmos",
        "skill_id": skill_id
    }

@router.get("/decaying")
async def get_decaying_skills(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ⚠️ CRITICAL: Skills fading from memory due to the forgetting curve

    These skills haven't been practiced recently and are at risk of knowledge decay.
    Battle the forgetting curve by practicing these first!
    """
    skills = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id
    ).all()
    
    oracle = CelestialAIOracle()
    decaying_skills = []
    
    for skill in skills:
        analysis = oracle.analyze_skill_decay({
            "last_practiced": skill.last_practiced,
            "health_score": skill.health_score
        })
        
        if analysis["urgency"] in ["high", "critical"]:
            decaying_skills.append({
                "skill_id": skill.id,
                "skill_name": skill.skill_name,
                "category": skill.category,
                "health_score": skill.health_score,
                "days_idle": analysis["days_idle"],
                "urgency": analysis["urgency"],
                "message": analysis["message"],
                "questions_recommended": analysis["questions_recommended"]
            })
    
    # Sort by urgency (critical first)
    decaying_skills.sort(key=lambda x: (x["urgency"] == "critical", x["days_idle"]), reverse=True)
    
    return {
        "total_decaying": len(decaying_skills),
        "skills": decaying_skills
    }

@router.get("/due-today")
async def get_skills_due_today(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    📅 Get skills due for review TODAY (Anki-style spaced repetition)

    Returns skills where next_review_date is today or earlier.
    Practice these to stay ahead of the forgetting curve!
    """
    from datetime import datetime

    now = datetime.utcnow()

    # Get skills that are due (next_review_date <= now OR never reviewed)
    due_skills = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id
    ).filter(
        (UserSkill.next_review_date <= now) | (UserSkill.next_review_date == None)
    ).order_by(UserSkill.next_review_date.asc()).all()

    return {
        "total_due": len(due_skills),
        "skills": [
            {
                "skill_id": s.id,
                "skill_name": s.skill_name,
                "category": s.category,
                "next_review_date": s.next_review_date,
                "review_interval_days": s.review_interval_days,
                "consecutive_correct": s.consecutive_correct,
                "health_score": s.health_score,
                "is_new": s.next_review_date is None
            }
            for s in due_skills
        ],
        "message": f"🌟 {len(due_skills)} skills ready for retention practice!" if due_skills else "✨ All caught up! No skills due today."
    }

@router.get("/recommendations")
async def get_practice_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    💡 AI-powered micro-practice recommendations to prevent knowledge decay

    Get personalized suggestions for which skills need retention work.
    Prioritizes skills falling victim to the forgetting curve.
    """
    skills = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id
    ).all()
    
    if not skills:
        return {
            "message": "No skills tracked yet! Add some skills to get started.",
            "recommendations": []
        }
    
    oracle = CelestialAIOracle()
    recommendations = []
    
    for skill in skills:
        analysis = oracle.analyze_skill_decay({
            "last_practiced": skill.last_practiced,
            "health_score": skill.health_score
        })
        
        recommendations.append({
            "skill_id": skill.id,
            "skill_name": skill.skill_name,
            "priority": analysis["urgency"],
            "reason": analysis["message"],
            "suggested_questions": analysis["questions_recommended"],
            "health_score": skill.health_score,
            "days_idle": analysis["days_idle"]
        })
    
    # Sort by urgency and health score
    urgency_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
    recommendations.sort(key=lambda x: (urgency_order.get(x["priority"], 4), x["health_score"]))
    
    return {
        "total_skills": len(skills),
        "recommendations": recommendations[:5],  # Top 5 recommendations
        "cosmic_wisdom": "🌟 Focus on the skills that need you most!"
    }