@echo off
echo =======================================
echo  Astrarium Database Reset Script
echo =======================================
echo.
echo This will:
echo  1. Stop the backend server
echo  2. Delete the database (all data will be lost)
echo  3. Restart the backend server
echo.
pause

echo.
echo [1/3] Stopping backend server...
taskkill /F /IM python.exe >nul 2>&1
if %errorlevel% == 0 (
    echo Backend stopped successfully
) else (
    echo No backend process found
)
timeout /t 2 /nobreak >nul

echo.
echo [2/3] Deleting database...
cd Astrarium_Backend
if exist astral_pet.db (
    del astral_pet.db
    echo Database deleted successfully
) else (
    echo No database file found
)

echo.
echo [3/3] Starting fresh backend server...
start cmd /k "python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
echo Backend starting in new window...

echo.
echo =======================================
echo  Database Reset Complete!
echo =======================================
echo.
echo Next steps:
echo  1. Refresh your browser (Ctrl+Shift+R)
echo  2. Create a new user and pet
echo  3. Add skills and start practicing
echo.
pause
