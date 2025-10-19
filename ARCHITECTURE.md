# Astrarium Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                     http://localhost:3000                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │
        ┌───────────────────┴────────────────────┐
        │                                        │
        │                                        │
┌───────▼──────────┐                  ┌──────────▼──────────┐
│   Supabase Auth  │                  │  Astrarium Backend  │
│  (User Sessions) │                  │   FastAPI + AI      │
│                  │                  │  localhost:8000     │
│  - JWT Tokens    │                  │                     │
│  - User DB       │                  │  - Skills Tracking  │
└──────────────────┘                  │  - AI Questions     │
                                      │  - Pet System       │
                                      │  - Spaced Rep.      │
                                      └──────────┬──────────┘
                                                 │
                                                 │
                                      ┌──────────▼──────────┐
                                      │  OpenAI GPT-4o-mini │
                                      │  Question Generator │
                                      └─────────────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRIVATE DASHBOARD PAGE                       │
│                    (/private/page.tsx)                          │
│                                                                 │
│  ┌──────────────────┐    ┌────────────────────────────────┐   │
│  │  Pet Dashboard   │    │  Tabs (Skills | Recommendations)│   │
│  │  - Pet Visual    │    │                                 │   │
│  │  - Stats Bars    │    │  ┌──────────────────────────┐  │   │
│  │  - Mood Display  │    │  │   Skills List            │  │   │
│  │  - Interaction   │    │  │   - Health Scores        │  │   │
│  └──────────────────┘    │  │   - Practice Buttons     │  │   │
│                          │  │   - Decay Indicators     │  │   │
│  ┌──────────────────┐    │  └──────────────────────────┘  │   │
│  │  User Stats      │    │                                 │   │
│  │  - Level & XP    │    │  ┌──────────────────────────┐  │   │
│  │  - Streak        │    │  │   AI Recommendations      │  │   │
│  │  - Progress      │    │  │   - Urgency Analysis     │  │   │
│  └──────────────────┘    │  │   - Practice Suggestions │  │   │
│                          │  └──────────────────────────┘  │   │
│                          └────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          PRACTICE SESSION OVERLAY (when active)          │  │
│  │  - AI Generated Question                                 │  │
│  │  - Answer Input (Multiple Choice or Open Ended)         │  │
│  │  - Submit Button                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Signup Flow
```
User Input (Form)
      ↓
Supabase Auth Signup
      ↓
Database User Creation
      ↓
Astrarium Backend Registration
      ↓
Alien Pet Auto-Created
      ↓
Redirect to Success
```

### Practice Session Flow
```
Click "Practice Now"
      ↓
generateQuestion() API Call
      ↓
Backend → AI Service (GPT)
      ↓
Question Returned (Multiple Choice or Open Ended)
      ↓
User Answers
      ↓
submitAnswer() API Call
      ↓
Backend Evaluates:
  - AI checks answer (for open-ended)
  - Updates skill health
  - Applies spaced repetition (SM-2)
  - Updates pet stats
  - Calculates XP
      ↓
AnswerResult Returned
      ↓
Feedback Dialog Shows:
  - Correct/Incorrect
  - Explanation
  - XP Earned
  - Pet Impact
  - Next Review Date
      ↓
Dashboard Refreshes
```

### Spaced Repetition Algorithm (SM-2)
```
Answer Submitted
      ↓
Quality Assessed (0-5):
  0-1: Complete Blackout → 1 day interval
  2:   Hard → Reduce ease factor
  3:   Good → Keep ease factor
  4-5: Easy → Increase ease factor
      ↓
Calculate Next Interval:
  First review: 1 day
  Second review: 6 days
  Subsequent: Previous × Ease Factor
      ↓
Update Skill Record:
  - next_review_date
  - review_interval_days
  - ease_factor
  - consecutive_correct/wrong
      ↓
Skill appears in "Due Today" when date arrives
```

### Pet Evolution Logic
```
XP Earned from Practice
      ↓
User total_xp += earned_xp
      ↓
Pet experience += earned_xp
      ↓
Calculate Level: floor(xp / 100) + 1
      ↓
Evolution Stage Based on Level:
  L0-5:   Egg 🥚
  L6-15:  Larvae 🐛
  L16-30: Juvenile 🦋
  L31-50: Adult ✨
  L51+:   Celestial 🌟
      ↓
Mood Based on Average Health:
  80-100: Radiant
  60-79:  Content
  40-59:  Dimming
  20-39:  Flickering
  0-19:   Eclipse
```

## API Endpoints Map

### Authentication
```
POST /auth/register
  Body: { email, username, password }
  Returns: { access_token, token_type, user }
  Side Effect: Creates alien pet

POST /auth/login
  Body: { email, password }
  Returns: { access_token, token_type, user }

GET /auth/me
  Headers: { Authorization: Bearer <token> }
  Returns: User object
```

### Skills Management
```
POST /skills/add
  Body: { skill_name, category?, proficiency_level?, star_power? }
  Returns: UserSkill

GET /skills/my-skills
  Returns: UserSkill[]

GET /skills/decaying
  Returns: SkillDecayInfo[] (urgency: CRITICAL|HIGH|MEDIUM|LOW)

GET /skills/due-today
  Returns: UserSkill[] (spaced repetition queue)

GET /skills/recommendations
  Returns: SkillRecommendation[] (AI analysis)

PATCH /skills/skill/{id}
  Body: { proficiency_level?, health_score?, star_power? }
  Returns: UserSkill

DELETE /skills/skill/{id}
  Returns: { message }
```

### Practice & Questions
```
POST /questions/generate
  Body: { skill_id, difficulty?, question_type? }
  Returns: Question (AI-generated)

POST /questions/answer
  Body: { question_id, user_answer }
  Returns: AnswerResult {
    is_correct, xp_earned, correct_answer,
    explanation, skill_health_change,
    pet_luminosity_change, pet_knowledge_hunger_change,
    next_review_date, new_interval_days, message
  }

GET /questions/history/{skill_id}
  Returns: AnswerHistory[]
```

### Pet System
```
GET /pets/my-pet
  Returns: AlienPet (full stats)

GET /pets/my-pet/state
  Returns: PetState {
    pet, narrative, health_status, mood_description
  }

POST /pets/interact
  Returns: PetInteractionResult {
    message, energy_change, new_mood?
  }

POST /pets/update-decay
  Returns: AlienPet (after decay applied)
```

## State Management

```
Dashboard Component State:
├── activeSkill (UserSkill | null)
├── answerResult (AnswerResult | null)
├── showFeedback (boolean)
└── refreshKey (number) - triggers child component reloads

Child Components:
├── PetDashboard
│   ├── pet (AlienPet)
│   ├── petState (PetState)
│   └── loading, interacting
│
├── SkillsList
│   ├── skills (UserSkill[])
│   └── loading
│
├── SkillRecommendations
│   ├── recommendations (SkillRecommendation[])
│   └── loading
│
├── PracticeSession
│   ├── question (Question)
│   ├── userAnswer (string)
│   └── loading, submitting
│
└── UserStats
    ├── user (User)
    └── loading
```

## TypeScript Type System

```typescript
Core Types Flow:

User (auth) → UserSkill (tracking) → Question (AI) → AnswerResult (feedback)
                    ↓
                AlienPet (gamification)

Enums:
- PetSpecies, PetMood, EvolutionStage
- DecayUrgency, QuestionType, Difficulty

The type system ensures end-to-end type safety from
API calls → Component props → UI rendering
```

## Styling Theme System

```
Color Palette:
├── Primary: Purple (#9333EA, #A855F7, #C084FC)
├── Secondary: Blue (#3B82F6, #60A5FA, #93C5FD)
├── Backgrounds: Dark Space (slate-950, purple-950)
├── Accents: Neon borders (purple-500/20-30)
└── Status Colors:
    ├── Green: Healthy
    ├── Yellow: Needs Practice
    ├── Orange: Decaying
    └── Red: Critical

Gradients:
- from-purple-600 to-blue-600 (buttons)
- from-purple-950/20 to-blue-950/20 (cards)
- from-slate-950 via-purple-950 to-slate-950 (background)

Effects:
- Glassmorphic cards (backdrop-blur)
- Animated pulse (pet display)
- HSL hue rotation (pet color customization)
```

## Security Considerations

Current Implementation:
- ✅ Supabase JWT auth for frontend
- ⚠️ Basic password hashing in backend (needs bcrypt)
- ⚠️ Simple auth token (needs JWT implementation)
- ✅ CORS configuration
- ✅ Environment variables for secrets

Production TODO:
- Implement JWT in FastAPI
- Add bcrypt password hashing
- Rate limiting on API endpoints
- Input validation/sanitization
- HTTPS only in production
