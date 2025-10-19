from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api.routes import auth, skills, questions, pets

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="🌌 Astrarium - Skill Retention Companion",
    description="""
    Battle the forgetting curve with your cosmic companion!

    Astrarium tracks skills you've already mastered and helps prevent knowledge decay through:
    - AI-powered detection of skills falling out of practice
    - Personalized micro-practice sessions based on what you're forgetting
    - Questions that reinforce concepts lost to the learning curve
    - Your alien pet that grows as you maintain your skill constellation

    Don't let your hard-earned knowledge drift into the void!
    """,
    version="1.0.0"
)

# CORS middleware (for frontend later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(skills.router)
app.include_router(questions.router)
app.include_router(pets.router)

@app.get("/")
async def root():
    return {
        "message": "🌟 Welcome to Astrarium - Your Skill Retention Guardian",
        "mission": "🌠 Battle the forgetting curve and prevent knowledge decay",
        "how_it_works": {
            "1": "Track skills you've already mastered",
            "2": "AI detects which skills are fading from memory",
            "3": "Answer micro-practice questions to reinforce forgotten concepts",
            "4": "Feed your cosmic alien pet as you maintain your knowledge constellation"
        },
        "key_insight": "If you don't use it, you lose it - but we help you remember!"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "cosmic_energy": "optimal"}