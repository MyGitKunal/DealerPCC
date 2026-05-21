# Starts Dealer PCC in a "permanent" local mode on Windows.
# - Frontend: serves built ./dist on http://localhost:8080 (and proxies /api/* to backend)
# - Backend: auto-restarts on crash on http://localhost:3000
# Designed to be launched via Windows Task Scheduler (run at logon).

$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
$logsDir = Join-Path $projectRoot 'logs'
New-Item -ItemType Directory -Force -Path $logsDir | Out-Null

function Write-Log([string]$message) {
  $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
  Write-Host "[$ts] $message"
}

function Test-PortListening([int]$port) {
  try {
    $c = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction Stop
    return $null -ne $c
  } catch {
    return $false
  }
}

function Require-Command([string]$name) {
  $cmd = Get-Command $name -ErrorAction SilentlyContinue
  if (-not $cmd) {
    throw "Required command not found in PATH: $name"
  }
}

function Start-DetachedProcess(
  [string]$name,
  [string]$filePath,
  [string[]]$argumentList,
  [string]$workingDirectory,
  [string]$stdoutPath,
  [string]$stderrPath,
  [hashtable]$env = @{}
) {
  $previousEnv = @{}
  try {
    foreach ($k in $env.Keys) {
      $existing = Get-Item -Path "Env:$k" -ErrorAction SilentlyContinue
      $previousEnv[$k] = if ($null -ne $existing) { $existing.Value } else { $null }
      Set-Item -Path "Env:$k" -Value ([string]$env[$k])
    }

    $p = Start-Process -FilePath $filePath -ArgumentList $argumentList -WorkingDirectory $workingDirectory -NoNewWindow -PassThru -RedirectStandardOutput $stdoutPath -RedirectStandardError $stderrPath

    if (-not $p) {
      throw "Failed to start process: $name"
    }

    return $p
  } finally {
    foreach ($k in $previousEnv.Keys) {
      if ($null -eq $previousEnv[$k]) {
        Remove-Item -Path "Env:$k" -ErrorAction SilentlyContinue
      } else {
        Set-Item -Path "Env:$k" -Value ([string]$previousEnv[$k])
      }
    }
  }
}

try {
  Write-Log 'Starting Dealer PCC permanent local services...'

  Require-Command 'node'
  Require-Command 'pnpm'

  Set-Location $projectRoot

  # Build frontend if needed
  $distIndex = Join-Path $projectRoot 'dist\index.html'
  if (-not (Test-Path $distIndex)) {
    Write-Log 'Frontend dist not found. Building frontend...'
    & pnpm -s run build
  }

  # Build backend if needed
  $backendDist = Join-Path $projectRoot 'backend\dist\index.js'
  if (-not (Test-Path $backendDist)) {
    Write-Log 'Backend dist not found. Building backend...'
    & pnpm -s -C (Join-Path $projectRoot 'backend') run build
  }

  # Start backend (auto-restart script). Avoid duplicate instances.
  if (Test-PortListening 3000) {
    Write-Log 'Backend already listening on port 3000. Skipping backend start.'
  } else {
    $backendOut = Join-Path $logsDir 'backend.out.log'
    $backendErr = Join-Path $logsDir 'backend.err.log'
    Write-Log 'Starting backend (auto-restart) on port 3000...'
    $backendProc = Start-DetachedProcess `
      -name 'backend' `
      -filePath 'node' `
      -argumentList @('start-server-auto-restart.js') `
      -workingDirectory $projectRoot `
      -stdoutPath $backendOut `
      -stderrPath $backendErr `
      -env @{ PORT = '3000' }
    Write-Log "Backend started (PID: $($backendProc.Id))"
  }

  # Start frontend static server. Avoid duplicate instances.
  if (Test-PortListening 8080) {
    Write-Log 'Frontend already listening on port 8080. Skipping frontend start.'
  } else {
    $frontOut = Join-Path $logsDir 'frontend.out.log'
    $frontErr = Join-Path $logsDir 'frontend.err.log'
    Write-Log 'Starting frontend (dist) on port 8080...'
    $frontProc = Start-DetachedProcess `
      -name 'frontend' `
      -filePath 'node' `
      -argumentList @('serve-dist.js') `
      -workingDirectory $projectRoot `
      -stdoutPath $frontOut `
      -stderrPath $frontErr `
      -env @{ PORT = '8080' }
    Write-Log "Frontend started (PID: $($frontProc.Id))"
  }

  Write-Log 'Done. Open http://localhost:8080/'
} catch {
  Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host "See logs folder: $logsDir" -ForegroundColor Yellow
  exit 1
}
