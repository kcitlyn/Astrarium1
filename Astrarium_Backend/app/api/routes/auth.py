from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from datetime import datetime
import hashlib
import random

from app.database import get_db
from app.models.user import User
from app.models.alien_pet import AlienPet, AlienSpecies

router = APIRouter(prefix="/auth", tags=["authentication"])

# Simple but secure hashing (works with Python 3.14)
def hash_password(password: str) -> str:
    """Hash password using SHA-256 with salt"""
    salt = "astral_cosmic_salt_2024"  # In production, use environment variable
    return hashlib.sha256(f"{salt}{password}".encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password"""
    return hash_password(plain_password) == hashed_password

# Pydantic schemas
class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str
    pet_name: str = "Nebula"
    pet_species: str = "nebula_sprite"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    created_at: datetime
    streak_count: int
    total_xp: int
    pet_id: int
    pet_name: str

@router.post("/register", response_model=UserResponse)
async def register_user(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):
    """
    🌟 Register a new user and birth their cosmic companion
    """
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )
    
    # Validate pet species
    try:
        species = AlienSpecies(user_data.pet_species)
    except ValueError:
        species = AlienSpecies.NEBULA_SPRITE
    
    # Create user
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hash_password(user_data.password),
        created_at=datetime.utcnow()
    )
    
    db.add(new_user)
    db.flush()  # Get user.id before creating pet
    
    # Birth the alien pet!
    alien_pet = AlienPet(
        user_id=new_user.id,
        name=user_data.pet_name,
        species=species,
        color_hue=random.randint(0, 360)  # Random cosmic color
    )
    
    db.add(alien_pet)
    db.commit()
    db.refresh(new_user)
    db.refresh(alien_pet)
    
    return UserResponse(
        id=new_user.id,
        email=new_user.email,
        username=new_user.username,
        created_at=new_user.created_at,
        streak_count=new_user.streak_count,
        total_xp=new_user.total_xp,
        pet_id=alien_pet.id,
        pet_name=alien_pet.name
    )

@router.post("/login")
async def login_user(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """
    ✨ Login and reconnect with your cosmic companion
    """
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Verify password
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Get pet info
    pet = db.query(AlienPet).filter(AlienPet.user_id == user.id).first()
    
    return {
        "message": f"✨ Welcome back, {user.username}! {pet.name if pet else 'Your pet'} awaits!",
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "streak_count": user.streak_count,
        "total_xp": user.total_xp,
        "pet_name": pet.name if pet else None,
        "pet_mood": pet.mood.value if pet else None
    }

@router.get("/me")
async def get_current_user_info(
    db: Session = Depends(get_db)
):
    """
    👤 Get current user info (simplified - no real JWT auth yet)
    """
    # TODO: Implement proper JWT authentication
    # For now, return first user
    user = db.query(User).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user found. Please register first!"
        )
    
    pet = db.query(AlienPet).filter(AlienPet.user_id == user.id).first()
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "streak_count": user.streak_count,
        "total_xp": user.total_xp,
        "created_at": user.created_at,
        "pet_name": pet.name if pet else None,
        "pet_level": pet.level if pet else None,
        "pet_mood": pet.mood.value if pet else None
    }