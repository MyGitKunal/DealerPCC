@echo off
REM Dealer PCC Auto-Restart Script for Windows
REM This ensures both services restart automatically if they crash

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Starting Dealer PCC Services...
echo ========================================
echo.

:restart_backend
echo [%date% %time%] Starting Backend on port 3000...
cd backend
call pnpm run dev
cd ..

if %errorlevel% neq 0 (
    echo [%date% %time%] Backend crashed! Restarting in 2 seconds...
    timeout /t 2 /nobreak
    goto restart_backend
)

:restart_frontend
echo [%date% %time%] Starting Frontend on port 8080...
call pnpm run dev

if %errorlevel% neq 0 (
    echo [%date% %time%] Frontend crashed! Restarting in 2 seconds...
    timeout /t 2 /nobreak
    goto restart_frontend
)

endlocal
pause
