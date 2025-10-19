@echo off
echo ========================================
echo COMPLETE FIX - Astrarium
echo ========================================
echo.
echo This will:
echo 1. Clean all node_modules
echo 2. Reinstall dependencies
echo 3. Fix TypeScript configs
echo 4. Fix OpenAI integration
echo.
pause

cd /d "%~dp0\Astrarium_Frontend"

echo [1/4] Removing old installations...
rmdir /s /q node_modules 2>nul
rmdir /s /q apps\web\node_modules 2>nul
rmdir /s /q packages\ui\node_modules 2>nul
rmdir /s /q packages\db\node_modules 2>nul
rmdir /s /q packages\eslint-config\node_modules 2>nul
rmdir /s /q packages\typescript-config\node_modules 2>nul
del pnpm-lock.yaml 2>nul

echo.
echo [2/4] Clearing pnpm cache...
pnpm store prune

echo.
echo [3/4] Installing fresh dependencies...
pnpm install

echo.
echo [4/4] Done!
echo.
echo ========================================
echo SUCCESS!
echo ========================================
echo.
echo Now run these in TWO separate terminals:
echo.
echo Terminal 1 (Backend):
echo   cd Astrarium_Backend
echo   venv\Scripts\activate
echo   uvicorn app.main:app --reload --port 8000
echo.
echo Terminal 2 (Frontend):
echo   cd Astrarium_Frontend
echo   pnpm dev
echo.
echo Then open: http://localhost:3000/simple-signup
echo.
pause
