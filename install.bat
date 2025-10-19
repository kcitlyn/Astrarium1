@echo off
echo ========================================
echo Astrarium Installation Script
echo ========================================
echo.

echo [1/3] Installing frontend dependencies...
cd Astrarium_Frontend
call pnpm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Setting up Python virtual environment...
cd ..\Astrarium_Backend
python -m venv venv
if %errorlevel% neq 0 (
    echo ERROR: Virtual environment creation failed
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] Installing backend dependencies...
call venv\Scripts\activate
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo IMPORTANT: Before running, create Astrarium_Backend\.env with:
echo   OPENAI_API_KEY=your_key_here
echo   DATABASE_URL=sqlite:///./astral_pet.db
echo   ALLOWED_ORIGINS=http://localhost:3000
echo.
echo To start the app:
echo   1. Terminal 1: cd Astrarium_Backend
echo                  venv\Scripts\activate
echo                  uvicorn app.main:app --reload --port 8000
echo   2. Terminal 2: cd Astrarium_Frontend
echo                  pnpm dev
echo   3. Open: http://localhost:3000
echo.
pause
