@echo off
echo Installing missing dependencies...
cd /d "%~dp0\Astrarium_Frontend"
pnpm add @radix-ui/react-dialog @radix-ui/react-progress @radix-ui/react-tabs
echo.
echo Done! Press any key to close.
pause
