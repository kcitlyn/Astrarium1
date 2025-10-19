# START HERE - Astrarium Quick Test Guide

## Step 1: Start Backend

Open Terminal 1:
```bash
cd Astrarium_Backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Verify**: You should see "Application startup complete" and server running on http://127.0.0.1:8000

## Step 2: Test Backend is Working

Open your browser to: `http://localhost:8000`

You should see a JSON response with "Welcome to Astrarium"

## Step 3: Start Frontend

Open Terminal 2:
```bash
cd Astrarium_Frontend
pnpm dev
```

**Verify**: You should see "Local: http://localhost:3000"

## Step 4: Test Connection

1. Go to: `http://localhost:3000/test`
2. Click "Test Connection" button
3. You should see "✅ Connected!"
4. Click "Test Registration" button
5. You should see "✅ Registration successful!"

## Step 5: Try the App

1. Go to: `http://localhost:3000/signup`
2. Create an account with:
   - Email: test@test.com
   - Full Name: Test User
   - Password: testpass123
   - Confirm Password: testpass123
3. Click "Sign Up"
4. You should be redirected to `/dashboard`
5. You should see:
   - "Astrarium" header
   - Pet dashboard on the left (might show loading or "No pet found" if backend connection failed)
   - Skills section with "+ Add Skill" button
6. Click "+ Add Skill" button
7. Add a skill (e.g., "Docker")
8. Click "Practice Now" to test the full flow

## Troubleshooting

### Backend won't start
- Make sure you're in the venv: `venv\Scripts\activate`
- Make sure .env file exists in Astrarium_Backend with OPENAI_API_KEY
- Try: `pip install -r requirements.txt` again

### Frontend won't start
- Try: `pnpm install` in Astrarium_Frontend directory
- Check for port conflicts (kill process on port 3000)

### "No pet found" or API errors
- Backend might not be running - check Terminal 1
- Check .env has `NEXT_PUBLIC_API_URL=http://localhost:8000`
- Try the test page first: `http://localhost:3000/test`

### Signup not working
- Check browser console (F12) for errors
- Check backend terminal for error messages
- Make sure Supabase credentials are in .env

## Quick Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Test page shows ✅ Connected
- [ ] Can sign up successfully
- [ ] Can see dashboard after signup
- [ ] Can see "+ Add Skill" button
- [ ] Can add a skill
- [ ] Pet displays (or shows "loading" or error message clearly)

If all checks pass, the app is working! 🎉
