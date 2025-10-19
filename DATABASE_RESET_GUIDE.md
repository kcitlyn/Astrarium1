# 🔄 Database Reset Guide

This guide explains how to completely wipe your Astrarium database and start fresh.

## Quick Reset (Windows)

Simply run the reset script:

```bash
reset-database.bat
```

This will automatically:
1. Stop the backend server
2. Delete the database file
3. Restart the backend with a fresh database

## Manual Reset

If you prefer to reset manually, follow these steps:

### Step 1: Stop the Backend

Kill all Python processes (this stops the backend):

```bash
taskkill /F /IM python.exe
```

### Step 2: Delete the Database

Navigate to the backend directory and delete the database file:

```bash
cd Astrarium_Backend
rm astral_pet.db
```

Or on Windows:
```bash
cd Astrarium_Backend
del astral_pet.db
```

### Step 3: Restart the Backend

Start the backend server (it will create a new empty database):

```bash
cd Astrarium_Backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Step 4: Refresh the Frontend

In your browser:
1. Press `Ctrl+Shift+R` to hard refresh
2. You'll start with a completely clean slate

## What Gets Deleted

When you reset the database, you lose ALL data:

- ❌ All user accounts
- ❌ All skills
- ❌ All questions and answers
- ❌ All practice history
- ❌ Your alien pet
- ❌ All XP and progress

## After Reset

After resetting, you'll need to:

1. **Create a new account** or start as a guest
2. **Add your skills** again
3. **Start practicing** - question generation will work reliably now with gpt-4o-mini!

## Troubleshooting

### Database Won't Delete

If the database file won't delete, it's probably locked by the backend process:

```bash
# Make sure backend is stopped
taskkill /F /IM python.exe

# Wait a moment
timeout /t 2

# Try deleting again
cd Astrarium_Backend
del astral_pet.db
```

### Backend Won't Start

If the backend fails to start after reset:

1. Check if port 8000 is already in use:
   ```bash
   netstat -ano | findstr :8000
   ```

2. Kill any processes using port 8000
3. Try starting the backend again

### Frontend Still Shows Old Data

If the frontend still shows old data after reset:

1. **Hard refresh**: Press `Ctrl+Shift+R`
2. **Clear browser cache**: Open DevTools (F12) → Application → Clear storage
3. **Restart the frontend**: Stop and restart the Next.js dev server

## Quick Start After Reset

```bash
# 1. Start backend (if not already running)
cd Astrarium_Backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# 2. In another terminal, start frontend
cd Astrarium_Frontend/apps/web
npm run dev

# 3. Open browser to http://localhost:3000
# 4. Add skills and start practicing!
```

## Database Location

The SQLite database is located at:
```
Astrarium_Backend/astral_pet.db
```

You can also manually inspect or backup this file if needed.

## Backup Before Reset (Optional)

If you want to save your data before resetting:

```bash
# Backup the database
cd Astrarium_Backend
copy astral_pet.db astral_pet_backup_2025-10-19.db

# Later, to restore:
copy astral_pet_backup_2025-10-19.db astral_pet.db
```
