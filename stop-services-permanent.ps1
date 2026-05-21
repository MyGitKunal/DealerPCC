# Stops Dealer PCC permanent local services by freeing ports 8080 and 3000.

$ErrorActionPreference = 'Continue'

function Stop-Port([int]$port) {
  $pids = @()
  try {
    $pids = (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction Stop | Select-Object -ExpandProperty OwningProcess) | Select-Object -Unique
  } catch {
    $pids = @()
  }

  if (-not $pids -or $pids.Count -eq 0) {
    Write-Host "No listener found on port $port"
    return
  }

  foreach ($processId in $pids) {
    try {
      Stop-Process -Id $processId -Force -ErrorAction Stop
      Write-Host "Stopped PID $processId (port $port)"
    } catch {
      Write-Host "Failed stopping PID $processId (port $port): $($_.Exception.Message)"
    }
  }
}

Stop-Port 8080
Stop-Port 3000
