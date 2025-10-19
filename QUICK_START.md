# Astrarium - Quick Start Guide

## What You Need to Do

### 1. Install Frontend Dependencies
```bash
cd Astrarium_Frontend
pnpm install
```

### 2. Start the Backend
```bash
cd ../Astrarium_Backend

# Create virtual environment (if not exists)
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload --port 8000
```

### 3. Configure Backend Environment
Create `Astrarium_Backend/.env`:
```env
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=sqlite:///./astral_pet.db
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 4. Start the Frontend
```bash
cd ../Astrarium_Frontend
pnpm dev
```

### 5. Open Your Browser
Navigate to: `http://localhost:3000`

## First Time User Flow

1. **Sign Up** at `/signup`
   - Your alien pet is automatically created!

2. **Add Your First Skill**
   - Click "+ Add Skill"
   - Try: "Docker", "React", "Python", etc.

3. **Get AI Recommendations**
   - Click "Recommendations" tab
   - See which skills need practice

4. **Practice!**
   - Click "Practice Now"
   - Answer AI-generated questions
   - Watch your pet evolve!

## That's It!

Your cosmic learning companion is ready. Feed it knowledge! 🚀✨
