Write-Host "========================================" -ForegroundColor Cyan
Write-Host "COMPLETE FIX - Astrarium Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/4] Removing old installations..." -ForegroundColor Yellow
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue node_modules
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue apps\web\node_modules
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue packages\ui\node_modules
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue packages\db\node_modules
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue packages\eslint-config\node_modules
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue packages\typescript-config\node_modules
Remove-Item -Force -ErrorAction SilentlyContinue pnpm-lock.yaml

Write-Host ""
Write-Host "[2/4] Clearing pnpm cache..." -ForegroundColor Yellow
pnpm store prune

Write-Host ""
Write-Host "[3/4] Installing fresh dependencies..." -ForegroundColor Yellow
pnpm install

Write-Host ""
Write-Host "[4/4] Done!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "SUCCESS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Now you can run:" -ForegroundColor Cyan
Write-Host "  pnpm dev" -ForegroundColor White
Write-Host ""
