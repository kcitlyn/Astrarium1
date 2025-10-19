# Astrarium Testing Instructions

## Prerequisites Check

Before testing, ensure you have:
1. ✅ Python 3.10+ installed
2. ✅ Node.js 18+ and pnpm installed
3. ✅ OpenAI API key (or be prepared to skip AI features for now)

## Installation (One-Time Setup)

### Backend Setup
```bash
cd Astrarium_Backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file (if it doesn't exist)
# Copy .env.example to .env and add your OpenAI key
```

### Frontend Setup
```bash
cd Astrarium_Frontend

# Install dependencies
pnpm install
```

## Running the Application

### Terminal 1: Backend
```bash
cd Astrarium_Backend
venv\Scripts\activate  # Windows
uvicorn app.main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Terminal 2: Frontend
```bash
cd Astrarium_Frontend
pnpm dev
```

**Expected Output:**
```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in Xms
```

## Testing Steps

### Test 1: Backend Health Check

**URL:** `http://localhost:8000`

**Expected Response:**
```json
{
  "message": "🌟 Welcome to Astrarium - Your Skill Retention Guardian",
  "mission": "🌠 Battle the forgetting curve and prevent knowledge decay",
  ...
}
```

**If Failed:**
- Check if backend is running on port 8000
- Check for error messages in Terminal 1
- Verify venv is activated

### Test 2: Frontend-Backend Connection

**URL:** `http://localhost:3000/test`

**Steps:**
1. Click "Test Connection" button
2. Should show: `✅ Connected! 🌟 Welcome to Astrarium...`
3. Click "Test Registration" button
4. Should show: `✅ Registration successful! Token: ...`

**If Failed:**
- Verify backend is running
- Check browser console (F12) for CORS errors
- Verify .env has `NEXT_PUBLIC_API_URL=http://localhost:8000`
- Check backend terminal for incoming requests

### Test 3: User Registration Flow

**URL:** `http://localhost:3000/signup`

**Steps:**
1. Fill in the form:
   - Email: `test@test.com`
   - Full Name: `Test User`
   - Password: `testpass123`
   - Confirm Password: `testpass123`
2. Click "Sign Up"
3. Should redirect to `/dashboard`
4. Check backend terminal - should see POST requests to `/auth/register`

**Expected in Backend Terminal:**
```
INFO:     127.0.0.1:xxxxx - "POST /auth/register HTTP/1.1" 200 OK
```

**If Failed:**
- Check browser console for errors
- Check Network tab in browser dev tools
- Look for red error messages in the signup form
- Verify Supabase credentials are in .env

### Test 4: Dashboard Loads

**After successful signup, you should see:**

1. **Header:** "Astrarium" with gradient text
2. **Sign Out** button in top right
3. **Left Column:**
   - Pet Dashboard card
   - User Stats card
4. **Right Column:**
   - Tabs: "My Skills" | "Recommendations"
   - "**+ Add Skill**" button visible

**If "+ Add Skill" button is NOT visible:**
- Open browser console (F12)
- Look for component errors
- Check if the button component is rendering properly
- Refresh the page

### Test 5: Add a Skill

**Steps:**
1. Click the **"+ Add Skill"** button
2. A dialog should pop up
3. Fill in:
   - Skill Name: `Docker`
   - Category: `DevOps` (optional)
   - Proficiency Level: Drag slider to `5`
   - Importance: Drag slider to `70`
4. Click "Add Skill"
5. Dialog closes
6. Skill should appear in the list

**Expected:**
- Backend request: `POST /skills/add`
- Skill card appears with:
  - Skill name "Docker"
  - Health score 100/100
  - Proficiency 5/10
  - "Practice Now" button

**If Failed:**
- Check browser console
- Check backend terminal for `/skills/add` request
- Verify backend connection is working

### Test 6: View AI Recommendations

**Steps:**
1. Click "Recommendations" tab
2. Should show recommendations or "All Skills Healthy!"

**Note:** If you just added a skill, it will be healthy (100/100 health), so you might see "All Skills Healthy!" That's correct!

### Test 7: Practice Session (Requires OpenAI API Key)

**Steps:**
1. Go back to "My Skills" tab
2. Click "Practice Now" on a skill
3. Wait 3-5 seconds for AI to generate question
4. A question should appear
5. Select or type an answer
6. Click "Submit Answer"
7. Feedback dialog appears showing:
   - Correct/Incorrect
   - XP earned
   - Pet health change
   - Explanation

**If AI Question Generation Fails:**
- Check if OPENAI_API_KEY is set in backend .env
- Check backend terminal for errors
- Backend should have fallback questions if AI fails

### Test 8: Pet System

**Check if pet loads:**
1. Look at left sidebar
2. Pet Dashboard card should show:
   - Pet name
   - Pet emoji (likely 🥚 for new users at level 1)
   - Stats bars (Luminosity, Energy, Knowledge Hunger, Cosmic Resonance)
   - "Pet Your Companion" button

**If "No pet found":**
- Check backend terminal for errors during registration
- Backend should auto-create pet when user registers
- Try registering a new user
- Check backend database: `SELECT * FROM alien_pets;`

## Common Issues and Fixes

### Issue: Frontend won't connect to backend
**Fix:**
1. Restart both servers
2. Check .env file has `NEXT_PUBLIC_API_URL=http://localhost:8000`
3. Try test page first: `http://localhost:3000/test`

### Issue: Components not showing
**Fix:**
```bash
cd Astrarium_Frontend
pnpm install  # Reinstall dependencies
```

### Issue: Backend database errors
**Fix:**
```bash
cd Astrarium_Backend
rm astral_pet.db  # Delete database
# Restart backend - it will recreate tables
```

### Issue: CORS errors in browser
**Fix:**
- Check backend CORS settings in `app/main.py`
- Should have `allow_origins=["*"]` for development
- Restart backend after changes

### Issue: "Module not found" errors
**Fix Frontend:**
```bash
cd Astrarium_Frontend
rm -rf node_modules
pnpm install
```

**Fix Backend:**
```bash
cd Astrarium_Backend
venv\Scripts\activate
pip install -r requirements.txt
```

## Success Criteria

The app is working correctly when:

- [x] Backend responds on port 8000
- [x] Frontend loads on port 3000
- [x] Test page shows "✅ Connected"
- [x] Can sign up successfully
- [x] Redirected to `/dashboard` after signup
- [x] **"+ Add Skill" button is visible**
- [x] Can click "+ Add Skill" and dialog opens
- [x] Can add a skill successfully
- [x] Skill appears in list with health score
- [x] Pet dashboard loads (with or without pet data)
- [x] User stats show (even if 0 XP, 0 streak)

## Minimal Working Test

If you just want to verify the **absolute basics** work:

1. Start backend: `uvicorn app.main:app --reload --port 8000`
2. Start frontend: `pnpm dev`
3. Visit: `http://localhost:3000/test`
4. Click "Test Connection" - should see ✅
5. Visit: `http://localhost:3000/signup`
6. Sign up
7. Look for **"+ Add Skill" button** on dashboard

**If you see the "+ Add Skill" button, the frontend is rendering correctly!**

## Next Steps After Testing

Once all tests pass:
1. Try the full flow: Add skill → Practice → Answer question → See pet update
2. Add multiple skills to test recommendations
3. Practice multiple times to level up and see pet evolve

## Getting Help

If tests fail:
1. Check both terminal outputs for error messages
2. Check browser console (F12) for frontend errors
3. Copy error messages
4. Check if backend .env has OpenAI key (for AI features)
5. Verify all dependencies installed correctly
