# Astrarium Setup Guide

Your cosmic companion for skill mastery - an astral-themed alien pet simulator that helps tech workers prevent skill decay through AI-powered practice sessions.

## Overview

Astrarium combines:
- **Spaced Repetition Learning** (like Anki) for optimal retention
- **Forgetting Curve Theory** to identify decaying skills
- **AI-Generated Questions** for personalized practice
- **Gamification** with alien pet companions that evolve based on your learning

## Architecture

- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend**: FastAPI (Python) with SQLAlchemy
- **AI**: OpenAI GPT-4o-mini for question generation
- **Auth**: Supabase

## Prerequisites

- Node.js 18+ and pnpm
- Python 3.10+
- OpenAI API key (or OpenRouter)
- Supabase account (already configured)

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd Astrarium_Backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file in `Astrarium_Backend/`:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
# Optional: Use OpenRouter instead
# OPENROUTER_API_KEY=your_openrouter_key_here

# Database (SQLite by default)
DATABASE_URL=sqlite:///./astral_pet.db

# CORS (allow frontend)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 5. Initialize Database
```bash
# The database will be created automatically on first run
python -m app.main
```

### 6. Start Backend Server
```bash
uvicorn app.main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd Astrarium_Frontend
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Variables
The `.env` file in `apps/web/` is already configured:

```env
NEXT_PUBLIC_SUPABASE_URL=https://cydenjmonhaysqhuscov.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_key>
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Start Frontend Development Server
```bash
pnpm dev
```

Frontend will be available at `http://localhost:3000`

## Usage Flow

### 1. Sign Up
- Navigate to `http://localhost:3000/signup`
- Create an account (registers in both Supabase and Astrarium backend)
- Your alien pet is automatically created!

### 2. Add Skills to Track
- Click "+ Add Skill" button
- Enter skill name (e.g., "Docker", "D3.js", "Regex")
- Set proficiency level (1-10)
- Set importance (Star Power)
- Optional: Add category (e.g., "DevOps", "Frontend")

### 3. View Recommendations
- AI analyzes your skills based on:
  - Time since last use
  - Health score (0-100)
  - Decay urgency (Critical, High, Medium, Low, Maintenance)
- Get personalized practice suggestions

### 4. Practice Session
- Click "Practice Now" on any skill
- AI generates a retention-focused question
- Question types:
  - **Multiple Choice**: Select the correct answer
  - **Open Ended**: Type your answer (AI evaluates)
- Submit your answer

### 5. Answer Feedback
- See if you're correct/incorrect
- Earn XP (feeds into user level)
- Pet health changes:
  - ✅ Correct: +5 luminosity, +15 knowledge hunger
  - ❌ Incorrect: -2 to -10 luminosity
- Skill health updates
- Spaced repetition scheduling (next review date)

### 6. Pet Evolution
Your alien pet evolves through stages based on level:
- **Egg** (L0-5) 🥚
- **Larvae** (L6-15) 🐛
- **Juvenile** (L16-30) 🦋
- **Adult** (L31-50) ✨
- **Celestial** (L51+) 🌟

Pet species available:
- Nebula Sprite
- Star Crawler
- Void Wisp
- Cosmic Blob
- Quantum Beetle

### 7. Track Progress
- **Streak Counter**: Consecutive days of practice
- **Total XP**: Levels up every 100 XP
- **Skill Health**: Visual decay indicators
- **Pet Stats**: Luminosity, Energy, Knowledge Hunger, Cosmic Resonance

## Features

### Knowledge Decay Tracking
- Implements forgetting curve algorithm
- Urgency levels based on time idle:
  - **Critical**: 6+ months
  - **High**: 3+ months
  - **Medium**: 1+ month
  - **Low**: 1+ week
  - **Maintenance**: Recent practice

### Spaced Repetition (SM-2 Algorithm)
- Answer quality affects review intervals
- Ease factor adjusts based on performance
- Review intervals: 1 day → 6 days → exponential growth
- Tracks consecutive correct/wrong answers

### AI-Powered Questions
- GPT-4o-mini generates questions for ANY skill
- Difficulty adapts to proficiency level
- Includes explanations for learning
- Cosmic-themed rewards (XP values)

### Pet Mechanics
- 5 unique alien species
- 5 mood states (Radiant, Content, Dimming, Flickering, Eclipse)
- Stats decrease 0.5% per day without practice
- Pet interactions for small energy boosts
- Color customization (HSL hue)

## API Endpoints Reference

### Auth
- `POST /auth/register` - Create account + spawn pet
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user

### Skills
- `POST /skills/add` - Add skill to track
- `GET /skills/my-skills` - List all skills
- `GET /skills/decaying` - Get decaying skills
- `GET /skills/due-today` - Spaced repetition queue
- `GET /skills/recommendations` - AI recommendations
- `PATCH /skills/skill/{id}` - Update skill
- `DELETE /skills/skill/{id}` - Remove skill

### Questions
- `POST /questions/generate` - Generate AI question
- `POST /questions/answer` - Submit answer
- `GET /questions/history/{skill_id}` - Practice history

### Pets
- `GET /pets/my-pet` - Get pet stats
- `GET /pets/my-pet/state` - Pet narrative description
- `POST /pets/interact` - Pet interaction
- `POST /pets/update-decay` - Manual decay trigger

## Troubleshooting

### Backend not connecting
- Ensure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env`
- Verify CORS settings in backend

### OpenAI API errors
- Verify `OPENAI_API_KEY` is set correctly
- Check API quota/billing
- Consider using OpenRouter as alternative

### Pet not appearing
- Ensure user registered through `/auth/register` endpoint
- Check backend logs for pet creation errors
- Verify database has `alien_pets` table

### Questions not generating
- Verify OpenAI API key
- Check backend logs for AI service errors
- Ensure skill exists in database

## Development Notes

### Frontend Structure
```
apps/web/
├── app/
│   ├── private/page.tsx          # Main dashboard
│   └── actions/auth/             # Server actions
├── modules/
│   ├── pet/                      # Pet components
│   ├── skills/                   # Skills management
│   ├── practice/                 # Practice session
│   └── user/                     # User stats
├── lib/api/
│   └── astrarium-client.ts       # Backend API client
└── types/
    └── astrarium.ts              # TypeScript types
```

### Backend Structure
```
app/
├── api/routes/                   # FastAPI endpoints
├── core/
│   └── ai_service.py            # AI question generation
├── models/                       # SQLAlchemy models
└── main.py                       # FastAPI app
```

## Future Enhancements

- [ ] JWT authentication (currently basic)
- [ ] Production-ready password hashing (bcrypt)
- [ ] Pet customization options
- [ ] Multiplayer leaderboards
- [ ] Mobile app
- [ ] Additional question types (coding challenges, etc.)
- [ ] Skill import from GitHub/LinkedIn
- [ ] Team/organization features
- [ ] Custom learning paths

## License

MIT

## Credits

Built for HackTX 2025 - Where learning meets the cosmos! 🚀✨
