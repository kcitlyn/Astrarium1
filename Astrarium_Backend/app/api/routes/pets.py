from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.models.alien_pet import AlienPet, AlienSpecies
from app.models.user import User

router = APIRouter(prefix="/pets", tags=["pets"])

class PetResponse(BaseModel):
    id: int
    name: str
    species: str
    mood: str
    luminosity: float
    energy: float
    knowledge_hunger: float
    cosmic_resonance: float
    evolution_stage: str
    level: int
    experience: int
    last_fed: Optional[datetime]
    hatched_at: datetime
    color_hue: int
    particle_effect: str
    total_skills_mastered: int

class PetStateResponse(BaseModel):
    narrative: str
    mood: str
    evolution_stage: str
    level: int
    next_evolution_at: int

def get_current_user(db: Session = Depends(get_db)) -> User:
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=401, detail="No user found")
    return user

@router.get("/my-pet", response_model=PetResponse)
async def get_my_pet(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    🌟 Get your cosmic companion
    """
    pet = db.query(AlienPet).filter(AlienPet.user_id == current_user.id).first()
    
    if not pet:
        raise HTTPException(status_code=404, detail="No pet found. Register first to get your alien!")
    
    return PetResponse(
        id=pet.id,
        name=pet.name,
        species=pet.species.value,
        mood=pet.mood.value,
        luminosity=pet.luminosity,
        energy=pet.energy,
        knowledge_hunger=pet.knowledge_hunger,
        cosmic_resonance=pet.cosmic_resonance,
        evolution_stage=pet.evolution_stage.value,
        level=pet.level,
        experience=pet.experience,
        last_fed=pet.last_fed,
        hatched_at=pet.created_at,
        color_hue=pet.color_hue,
        particle_effect=pet.particle_effect,
        total_skills_mastered=pet.total_skills_mastered
    )

@router.get("/my-pet/state", response_model=PetStateResponse)
async def get_pet_state(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    📖 Get a narrative description of your pet's state
    """
    pet = db.query(AlienPet).filter(AlienPet.user_id == current_user.id).first()
    
    if not pet:
        raise HTTPException(status_code=404, detail="No pet found")
    
    state = pet.get_state_description()

    return PetStateResponse(
        narrative=state["description"],
        mood=state["mood"],
        evolution_stage=state["evolution_stage"],
        level=state["level"],
        next_evolution_at=state["next_evolution_at"]
    )

@router.post("/interact")
async def interact_with_pet(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ✨ Pet your alien companion (small energy boost)
    """
    pet = db.query(AlienPet).filter(AlienPet.user_id == current_user.id).first()
    
    if not pet:
        raise HTTPException(status_code=404, detail="No pet found")
    
    # Small boost from petting
    pet.energy = min(100.0, pet.energy + 2.0)
    pet.luminosity = min(100.0, pet.luminosity + 1.0)
    pet.last_updated = datetime.utcnow()
    pet.update_mood()
    
    db.commit()
    
    return {
        "message": f"✨ {pet.name} feels your cosmic energy!",
        "luminosity": pet.luminosity,
        "energy": pet.energy,
        "mood": pet.mood.value
    }

@router.post("/update-decay")
async def update_pet_decay(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ⏰ Manually trigger decay calculation (useful for testing)
    """
    pet = db.query(AlienPet).filter(AlienPet.user_id == current_user.id).first()

    if not pet:
        raise HTTPException(status_code=404, detail="No pet found")

    # Calculate hours since last feed
    hours_since = (datetime.utcnow() - pet.last_fed).total_seconds() / 3600

    pet.decay_stats(hours_since)
    db.commit()

    return {
        "message": f"⏰ Updated {pet.name}'s stats",
        "hours_since_last_feed": round(hours_since, 2),
        "luminosity": pet.luminosity,
        "knowledge_hunger": pet.knowledge_hunger,
        "mood": pet.mood.value
    }

@router.post("/debug/force-evolve")
async def force_evolve_pet(
    db: Session = Depends(get_db)
):
    """
    🚀 DEBUG: Force pet to evolve to next stage (no auth required for demo)
    """
    # For debug purposes, just get the first user's pet
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="No user found in database")

    pet = db.query(AlienPet).filter(AlienPet.user_id == user.id).first()

    if not pet:
        raise HTTPException(status_code=404, detail="No pet found")

    old_stage = pet.evolution_stage.value
    old_level = pet.level
    old_xp = pet.experience

    print(f"[DEBUG] Before XP gain: Level {old_level}, XP {old_xp}, Stage {old_stage}")

    # Add moderate XP for gradual progression
    pet.gain_experience(150)

    # Force check evolution to ensure sprite matches level
    pet.check_evolution()

    print(f"[DEBUG] After XP gain: Level {pet.level}, XP {pet.experience}, Stage {pet.evolution_stage.value}")

    db.commit()

    return {
        "message": f"🚀 {pet.name} gained experience!",
        "old_stage": old_stage,
        "new_stage": pet.evolution_stage.value,
        "old_level": old_level,
        "new_level": pet.level,
        "xp_gained": 150,
        "current_xp": pet.experience
    }

class DecayRateUpdate(BaseModel):
    multiplier: float  # 1.0 = normal, 2.0 = 2x faster, 0.5 = half speed

@router.post("/debug/set-decay-rate")
async def set_decay_rate(
    rate: DecayRateUpdate,
    db: Session = Depends(get_db)
):
    """
    ⚙️ DEBUG: Set decay rate multiplier (for demo/testing - no auth required)
    """
    # Store in user session or global config
    # For now, we'll just return success and the actual decay happens in decay_stats
    return {
        "message": f"Decay rate set to {rate.multiplier}x",
        "multiplier": rate.multiplier,
        "note": "This affects how quickly stats decay over time"
    }