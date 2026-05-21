@echo off
REM Permanent local start (runs at login via Startup folder)
REM Frontend: http://localhost:8080
REM Backend:  http://localhost:3000

set SCRIPT="%~dp0start-services-permanent.ps1"

powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File %SCRIPT%
