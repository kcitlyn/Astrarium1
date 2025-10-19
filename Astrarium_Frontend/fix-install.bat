@echo off
echo Cleaning and reinstalling dependencies...
cd /d "%~dp0"

echo Removing node_modules...
rmdir /s /q node_modules 2>nul
rmdir /s /q apps\web\node_modules 2>nul
rmdir /s /q packages\ui\node_modules 2>nul

echo Removing lock files...
del pnpm-lock.yaml 2>nul

echo Installing fresh dependencies...
pnpm install

echo.
echo Done! Now restart your dev server with: pnpm dev
pause
