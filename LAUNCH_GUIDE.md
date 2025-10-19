# 🚀 Astrarium Launch Guide

## Prerequisites
Before launching, ensure you have:
- ✅ Python 3.14 installed
- ✅ Node.js and pnpm installed
- ✅ Git (for version control)

---

## 🔧 One-Time Setup (First Time Only)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd C:\Users\kcitl\hackathon\hacktx25\Astrarium_Backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic email-validator openai python-dotenv
   ```

3. **Verify `.env` file exists** with these contents:
   ```env
   DATABASE_URL=sqlite:///./astral_pet.db
   SECRET_KEY=astral-celestial-secret-key-12345
   OPENAI_API_KEY=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
   OPENAI_BASE_URL=https://openrouter.ai/api/v1
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd C:\Users\kcitl\hackathon\hacktx25\Astrarium_Frontend
   ```

2. **Install frontend dependencies:**
   ```bash
   pnpm install
   ```

3. **Verify `.env` file** in `apps/web/.env`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://cydenjmonhaysqhuscov.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5ZGVuam1vbmhheXNxaHVzY292Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3OTUyMzYsImV4cCI6MjA3NjM3MTIzNn0.We4kT5wDCKCKIPGJWrVo45LLV_cozgmaS29SIrxrIZk

   # Backend API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

---

## 🏃 Launching the Application

### Step 1: Start the Backend Server

Open a terminal/command prompt:

```bash
cd C:\Users\kcitl\hackathon\hacktx25\Astrarium_Backend
python -m uvicorn app.main:app --reload --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Application startup complete.
```

✅ Backend is now running at: **http://localhost:8000**

---

### Step 2: Start the Frontend Server

Open a **NEW** terminal/command prompt (keep backend running):

```bash
cd C:\Users\kcitl\hackathon\hacktx25\Astrarium_Frontend
pnpm dev
```

**Expected output:**
```
▲ Next.js 15.5.4 (Turbopack)
- Local:        http://localhost:3000
- Network:      http://10.155.225.191:3000

✓ Ready in 2.4s
```

✅ Frontend is now running at: **http://localhost:3000** (or :3001 if 3000 is in use)

---

## 🌐 Accessing the Application

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🎮 Using Astrarium

### First Time Users:

1. **Sign Up**: Create a new account
   - Enter email, username, password
   - Name your alien pet
   - Click "Sign Up"

2. **Dashboard**: You'll see:
   - Your baby alien pet (🥚 Egg stage)
   - Pet stats (Luminosity, Energy, Knowledge Hunger, Cosmic Resonance)
   - Skills list (empty initially)

### Adding Skills:

1. Click **"Add Skill"** button (top right of Skills section)
2. Enter skill details:
   - **Skill Name**: e.g., "JavaScript", "Python", "React"
   - **Category** (optional): e.g., "Programming", "Design"
   - **Proficiency Level**: 1-10 scale
3. Click **"Add"**

### Practicing Skills:

1. Find your skill in the list
2. Click **"Practice"** button
3. Click **"Start Practice"** to generate a question
4. Answer the question (multiple choice or open-ended)
5. Click **"Submit Answer"**

### Pet Growth Mechanics:

- **✅ Correct Answer:**
  - Pet gains XP
  - Knowledge Hunger decreases
  - Cosmic Resonance increases
  - Mood improves (becomes more radiant)

- **❌ First Wrong Answer:**
  - Small penalty (-2 health)
  - Pet shows concern

- **❌ Second Wrong Answer in a Row:**
  - **BIG penalty (-10 health)**
  - Pet health drops significantly
  - Pet mood dims (flickering/eclipse)

- **🎉 Pet Evolution:**
  - Level 1-5: 🥚 Egg
  - Level 6-15: 🐛 Larvae
  - Level 16-30: 🦋 Juvenile
  - Level 31-50: ✨ Adult
  - Level 51+: 🌟 Celestial

---

## 🐛 Troubleshooting

### Issue: tsconfig.json shows errors after `pnpm install`

**Solution:**
1. The types ARE installed (pnpm workspaces work differently)
2. **Reload VS Code's TypeScript server:**
   - Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
   - Type: "TypeScript: Restart TS Server"
   - Press Enter
3. Errors should disappear

**Why this happens:** pnpm uses symlinks for workspace packages, and VS Code's TypeScript server needs to be restarted to recognize them.

### Issue: Port 3000 already in use

**Solution:**
- Next.js will automatically use port 3001
- Or kill the process using port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID_NUMBER> /F
  ```

### Issue: Backend can't find modules

**Solution:**
```bash
cd C:\Users\kcitl\hackathon\hacktx25\Astrarium_Backend
pip install fastapi uvicorn sqlalchemy pydantic email-validator openai python-dotenv
```

### Issue: Frontend build errors

**Solution:**
```bash
cd C:\Users\kcitl\hackathon\hacktx25\Astrarium_Frontend
rm -rf node_modules
pnpm install
```

---

## 🔍 Verifying Everything Works

### Backend Health Check:
```bash
curl http://localhost:8000/health
```
Expected: `{"status":"healthy","cosmic_energy":"optimal"}`

### Frontend Check:
Open browser to `http://localhost:3000` - you should see the landing page

---

## 📝 Quick Start Commands (Copy-Paste)

**Terminal 1 (Backend):**
```bash
cd C:\Users\kcitl\hackathon\hacktx25\Astrarium_Backend && python -m uvicorn app.main:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```bash
cd C:\Users\kcitl\hackathon\hacktx25\Astrarium_Frontend && pnpm dev
```

**Then open:** http://localhost:3000

---

## 🎯 Features Checklist

- ✅ User authentication (signup/login)
- ✅ Add skills to track
- ✅ Generate AI-powered practice questions
- ✅ Submit answers and get feedback
- ✅ Pet grows with correct answers
- ✅ Pet gets hurt with consecutive wrong answers
- ✅ Visual pet dashboard with stats
- ✅ Pet evolution system (Egg → Celestial)
- ✅ Spaced repetition algorithm
- ✅ Skill health scoring
- ✅ XP and leveling system
- ✅ User stats tracking

---

## 🛑 Stopping the Application

1. **Stop Frontend**: In the frontend terminal, press `Ctrl+C`
2. **Stop Backend**: In the backend terminal, press `Ctrl+C`

---

## 📊 API Endpoints (for testing)

- `GET /` - Welcome message
- `GET /health` - Health check
- `POST /auth/register` - Create account
- `POST /auth/login` - Login
- `POST /skills/add` - Add skill
- `GET /skills/my-skills` - Get all skills
- `POST /questions/generate` - Generate question
- `POST /questions/answer` - Submit answer
- `GET /pets/my-pet` - Get pet info
- `POST /pets/interact` - Pet your companion

Full API docs: http://localhost:8000/docs

---

## 💡 Pro Tips

1. **Practice consistently** to keep your pet healthy
2. **Get 2 wrong in a row** to see the pet suffer (then get one right to recover)
3. **Watch the pet evolve** as you level up
4. **Try different skills** - the AI generates unique questions for each
5. **Check the pet stats** after each answer to see the changes

---

## 🎉 You're Ready!

Your Astrarium application is fully functional and ready to help you (and others) battle the forgetting curve while nurturing a cosmic companion!

**Enjoy growing your alien pet!** 🌟👽✨
