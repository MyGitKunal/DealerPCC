# Start both frontend and backend services

# Set JWT env vars for backend
$env:JWT_SECRET = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
$env:JWT_REFRESH_SECRET = "x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6"

# Start frontend server (background job)
Write-Host "Starting frontend server on port 8080..." -ForegroundColor Green
Start-Job -ScriptBlock {
    Set-Location "c:\Users\a2eljls\OneDrive - Volkswagen AG\D Drive\Workshop Systems\Dealer PCC\DPgitproject"
    node serve-dist.js
} -Name "frontend"

Start-Sleep -Seconds 2

# Start backend server (background job)
Write-Host "Starting backend server on port 3000..." -ForegroundColor Green
Start-Job -ScriptBlock {
    $env:JWT_SECRET = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
    $env:JWT_REFRESH_SECRET = "x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6"
    Set-Location "c:\Users\a2eljls\OneDrive - Volkswagen AG\D Drive\Workshop Systems\Dealer PCC\DPgitproject\backend"
    node dist/index.js
} -Name "backend"

Start-Sleep -Seconds 3

# Show status
Write-Host "`nServices started. Current jobs:" -ForegroundColor Cyan
Get-Job | Select-Object Name, State, @{Name="Command"; Expression={$_.Command.Substring(0, [Math]::Min(40, $_.Command.Length))}}

Write-Host "`nAccess application at: http://localhost:8080" -ForegroundColor Green
Write-Host "API endpoint: http://localhost:3000/api/v1" -ForegroundColor Green

Write-Host "`nTo view logs:" -ForegroundColor Cyan
Write-Host "  Frontend: Receive-Job -Name frontend -Keep" 
Write-Host "  Backend: Receive-Job -Name backend -Keep"
Write-Host "`nTo stop all: Get-Job | Stop-Job"
