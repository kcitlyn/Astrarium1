from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import random

from app.database import get_db
from app.models.skill import UserSkill, PracticeSession
from app.models.question import Question, UserAnswer
from app.models.alien_pet import AlienPet
from app.models.user import User
from app.core.ai_service import CelestialAIOracle

router = APIRouter(prefix="/questions", tags=["questions"])

# ------------------------------
# Pydantic schemas
# ------------------------------
class QuestionRequest(BaseModel):
    skill_id: int

class QuestionResponse(BaseModel):
    question_id: int
    question_text: str
    question_type: str
    options: Optional[List[str]] = None
    difficulty: str
    cosmic_reward: int

class AnswerSubmission(BaseModel):
    question_id: int
    user_answer: str
    time_taken_seconds: Optional[int] = None
    difficulty_rating: Optional[int] = None

class AnswerResult(BaseModel):
    is_correct: bool
    correct_answer: str
    explanation: Optional[str]
    xp_earned: int
    skill_health_change: float
    pet_mood: str
    pet_message: str
    next_review_date: Optional[datetime] = None
    review_interval_days: float
    pet_luminosity_change: float = 0
    pet_knowledge_hunger_change: float = 0
    new_interval_days: float = 0
    message: str = ""

# ------------------------------
# Dependency: current user
# ------------------------------
def get_current_user(
    db: Session = Depends(get_db)
) -> User:
    # Simple authentication - will be replaced with proper auth later
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=401, detail="No users found")
    return user

# ------------------------------
# Generate a new question
# ------------------------------
@router.post("/generate", response_model=QuestionResponse)
async def generate_question(
    request: QuestionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    skill = db.query(UserSkill).filter(
        UserSkill.id == request.skill_id,
        UserSkill.user_id == current_user.id
    ).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    oracle = CelestialAIOracle()
    question_data = oracle.generate_skill_question(
        skill_name=skill.skill_name,
        category=skill.category,
        proficiency_level=skill.proficiency_level
    )

    question = Question(
        skill_id=skill.id,
        question_text=question_data["question"],
        question_type=question_data["type"],
        options=question_data.get("options"),
        correct_answer=question_data["correct_answer"],
        explanation=question_data.get("explanation"),
        difficulty=question_data.get("difficulty", "medium"),
        cosmic_reward=question_data.get("cosmic_reward", 10)
    )
    db.add(question)
    db.commit()
    db.refresh(question)

    response = QuestionResponse(
        question_id=question.id,
        question_text=question.question_text,
        question_type=question.question_type,
        options=question.options,
        difficulty=question.difficulty,
        cosmic_reward=question.cosmic_reward
    )
    print(f"[DEBUG] Returning question response: question_id={response.question_id}, text={response.question_text[:50]}...")
    return response

# ------------------------------
# Submit answer
# ------------------------------
@router.post("/answer", response_model=AnswerResult)
async def submit_answer(
    submission: AnswerSubmission,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    question = db.query(Question).filter(Question.id == submission.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    skill = db.query(UserSkill).filter(UserSkill.id == question.skill_id).first()
    if not skill or skill.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    oracle = CelestialAIOracle()
    evaluation_feedback = None

    # For multiple choice, do direct comparison
    if question.question_type == "multiple_choice":
        is_correct = submission.user_answer.strip() == question.correct_answer.strip()
        evaluation_feedback = None
    else:
        # For open-ended questions, use AI evaluation
        acceptable_answers = question.options if question.options else []
        evaluation = oracle.evaluate_open_ended_answer(
            question_text=question.question_text,
            user_answer=submission.user_answer,
            correct_answer=question.correct_answer,
            acceptable_answers=acceptable_answers
        )
        is_correct = evaluation["is_correct"]
        evaluation_feedback = evaluation["feedback"]

    base_xp = question.cosmic_reward
    xp_earned = base_xp if is_correct else base_xp // 2

    user_answer = UserAnswer(
        user_id=current_user.id,
        question_id=question.id,
        user_answer=submission.user_answer,
        is_correct=is_correct,
        time_taken_seconds=submission.time_taken_seconds
    )
    db.add(user_answer)

    answer_quality = submission.difficulty_rating if submission.difficulty_rating is not None else (3 if is_correct else 0)
    next_review_date = skill.calculate_next_review(answer_quality)

    # Update skill
    if is_correct:
        skill.consecutive_wrong = 0
        skill.health_score = min(100.0, skill.health_score + 5.0)
        skill.star_power = min(100.0, skill.star_power + 3.0)
    else:
        skill.consecutive_wrong += 1
        skill.health_score = max(0.0, skill.health_score - 2.0)

    # Update user stats
    current_user.total_xp += xp_earned
    today = datetime.utcnow().date()
    if current_user.last_practice_date:
        last_date = current_user.last_practice_date.date()
        if (today - last_date).days == 1:
            current_user.streak_count += 1
        elif (today - last_date).days > 1:
            current_user.streak_count = 1
    else:
        current_user.streak_count = 1
    current_user.last_practice_date = datetime.utcnow()

    # Record practice session
    session = PracticeSession(
        skill_id=skill.id,
        questions_answered=1,
        correct_answers=1 if is_correct else 0,
        xp_earned=xp_earned
    )
    db.add(session)

    # Update alien pet
    alien_pet = db.query(AlienPet).filter(AlienPet.user_id == current_user.id).first()
    pet_health_change = 0.0
    pet_luminosity_change = 0.0
    pet_knowledge_hunger_change = 0.0

    if alien_pet:
        old_luminosity = alien_pet.luminosity or 100.0
        old_knowledge_hunger = alien_pet.knowledge_hunger or 50.0
        if is_correct:
            alien_pet.luminosity = min(100.0, old_luminosity + 5.0)
            pet_health_change = alien_pet.luminosity - old_luminosity
            alien_pet.feed_knowledge(skill_complexity=skill.proficiency_level / 10.0)
            alien_pet.gain_experience(xp_earned)
            skill.consecutive_wrong = 0
        else:
            if skill.consecutive_wrong >= 2:
                alien_pet.luminosity = max(0.0, old_luminosity - 10.0)
            else:
                alien_pet.luminosity = max(0.0, old_luminosity - 2.0)
            pet_health_change = alien_pet.luminosity - old_luminosity
        pet_luminosity_change = alien_pet.luminosity - old_luminosity
        pet_knowledge_hunger_change = (alien_pet.knowledge_hunger or 50.0) - old_knowledge_hunger
        alien_pet.update_mood()
        alien_pet.last_updated = datetime.utcnow()

        # Generate pet message
        if is_correct:
            if pet_health_change >= 5.0:
                pet_messages = [
                    f"✨ {alien_pet.name} feeds on your knowledge! Health +{pet_health_change:.0f}!",
                    f"🌟 {alien_pet.name} glows brighter! Health at {alien_pet.luminosity:.0f}%!"
                ]
            else:
                pet_messages = [f"⭐ {alien_pet.name} is already at max health! Keep it up!"]
        else:
            if skill.consecutive_wrong >= 2:
                pet_messages = [
                    f"🚨 {alien_pet.name} suffers! 2 wrong in a row! Health -{abs(pet_health_change):.0f}",
                    f"⚠️ {alien_pet.name} dims significantly! Study harder!"
                ]
            else:
                pet_messages = [
                    f"🌙 {alien_pet.name} dims slightly (Health -{abs(pet_health_change):.0f})",
                    f"☁️ {alien_pet.name} encourages: Learn from this! Review the explanation."
                ]
        pet_message = random.choice(pet_messages)
        pet_mood = alien_pet.mood.value
    else:
        pet_message = "No pet found"
        pet_mood = "neutral"
        pet_luminosity_change = 0.0
        pet_knowledge_hunger_change = 0.0

    db.commit()
    db.refresh(skill)

    full_explanation = question.explanation
    if evaluation_feedback and not is_correct:
        full_explanation = f"{evaluation_feedback}\n\nExpected: {question.correct_answer}\n\n{question.explanation}"

    return AnswerResult(
        is_correct=is_correct,
        correct_answer=question.correct_answer,
        explanation=full_explanation,
        xp_earned=xp_earned,
        skill_health_change=pet_health_change,
        pet_mood=pet_mood,
        pet_message=pet_message,
        next_review_date=skill.next_review_date,
        review_interval_days=skill.review_interval_days,
        pet_luminosity_change=pet_luminosity_change,
        pet_knowledge_hunger_change=pet_knowledge_hunger_change,
        new_interval_days=skill.review_interval_days,
        message=pet_message
    )

# ------------------------------
# Get practice history
# ------------------------------
@router.get("/history/{skill_id}")
async def get_practice_history(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    skill = db.query(UserSkill).filter(
        UserSkill.id == skill_id,
        UserSkill.user_id == current_user.id
    ).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    sessions = db.query(PracticeSession).filter(
        PracticeSession.skill_id == skill_id
    ).order_by(PracticeSession.session_date.desc()).limit(20).all()

    return {
        "skill_name": skill.skill_name,
        "total_sessions": len(sessions),
        "sessions": [
            {
                "date": s.session_date,
                "questions_answered": s.questions_answered,
                "correct_answers": s.correct_answers,
                "accuracy": (s.correct_answers / s.questions_answered * 100) if s.questions_answered > 0 else 0,
                "xp_earned": s.xp_earned
            } for s in sessions
        ]
    }
