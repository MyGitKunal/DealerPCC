# Dealer PCC Auto-Restart Script for Windows
# This ensures both services restart automatically if they crash
# Run this script from the project root directory

$ErrorActionPreference = "Continue"

# PowerShell equivalent of 'head' command
function Get-Head {
    param(
        [Parameter(ValueFromPipeline=$true)]
        [string[]]$InputObject,
        
        [int]$Lines = 10,
        
        [int]$Characters = -1
    )
    
    if ($Characters -gt 0) {
        # Return first N characters
        $text = $InputObject -join "`n"
        return $text.Substring(0, [Math]::Min($Characters, $text.Length))
    } else {
        # Return first N lines
        return $InputObject | Select-Object -First $Lines
    }
}

Set-Alias -Name head -Value Get-Head -Scope Global -Force

Write-Host "Starting Dealer PCC Services with Auto-Restart..." -ForegroundColor Cyan
Write-Host "Frontend will run on http://localhost:8080" -ForegroundColor Green
Write-Host "Backend API will run on http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

$backendProcess = $null
$frontendProcess = $null

try {
    # Start backend in background
    $backendProcess = Start-Process -FilePath "pnpm" -ArgumentList "run", "dev" -WorkingDirectory "backend" -NoNewWindow -PassThru
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] Backend started (PID: $($backendProcess.Id))" -ForegroundColor Green

    Start-Sleep -Seconds 2

    # Start frontend in background
    $frontendProcess = Start-Process -FilePath "pnpm" -ArgumentList "run", "dev" -NoNewWindow -PassThru
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] Frontend started (PID: $($frontendProcess.Id))" -ForegroundColor Green

    Write-Host ""
    Write-Host "Services are now running with auto-restart enabled!" -ForegroundColor Cyan
    Write-Host "  Backend:  http://localhost:3000" -ForegroundColor Green
    Write-Host "  Frontend: http://localhost:8080" -ForegroundColor Green
    Write-Host ""
    Write-Host "Monitoring for crashes (will auto-restart if needed)..." -ForegroundColor Yellow
    Write-Host ""

    # Keep monitoring both processes
    $restartBackend = $false
    $restartFrontend = $false

    while ($true) {
        # Check if backend is still running
        if ($backendProcess -and $backendProcess.HasExited) {
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            Write-Host "[$timestamp] Backend crashed! Auto-restarting in 2 seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds 2
            
            $backendProcess = Start-Process -FilePath "pnpm" -ArgumentList "run", "dev" -WorkingDirectory "backend" -NoNewWindow -PassThru
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            Write-Host "[$timestamp] Backend restarted (PID: $($backendProcess.Id))" -ForegroundColor Green
        }

        # Check if frontend is still running
        if ($frontendProcess -and $frontendProcess.HasExited) {
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            Write-Host "[$timestamp] Frontend crashed! Auto-restarting in 2 seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds 2
            
            $frontendProcess = Start-Process -FilePath "pnpm" -ArgumentList "run", "dev" -NoNewWindow -PassThru
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            Write-Host "[$timestamp] Frontend restarted (PID: $($frontendProcess.Id))" -ForegroundColor Green
        }

        Start-Sleep -Seconds 3
    }
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
finally {
    # Cleanup on exit
    if ($backendProcess -and -not $backendProcess.HasExited) {
        Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    if ($frontendProcess -and -not $frontendProcess.HasExited) {
        Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "Services stopped." -ForegroundColor Yellow
}
