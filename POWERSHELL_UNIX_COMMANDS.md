# PowerShell Unix Commands Reference

This file documents how to use Unix-like commands in PowerShell for the Dealer PCC project.

## Quick Reference

### Load Unix Commands Helper
```powershell
. .\UnixCommands.ps1
```

### Commands Available

| Unix Command | PowerShell Alternative | Example |
|--------------|----------------------|---------|
| `head -n 10` | `Select-Object -First 10` | `Get-Content file.txt \| Select-Object -First 10` |
| `head -c 200` | `[string].Substring()` | See below |
| `tail -n 10` | `Select-Object -Last 10` | `Get-Content file.txt \| Select-Object -Last 10` |
| `grep "pattern"` | `Where-Object { $_ -match "pattern" }` | `Get-Content file.txt \| Where-Object { $_ -match "error" }` |
| `wc -l` | `Measure-Object -Line` | `Get-Content file.txt \| Measure-Object -Line` |

### Common Patterns

#### Get first 10 lines of file
```powershell
Get-Content file.txt | Select-Object -First 10
```

#### Get last 20 lines of file
```powershell
Get-Content file.txt | Select-Object -Last 20
```

#### Filter lines containing "error"
```powershell
Get-Content file.txt | Where-Object { $_ -match "error" }
```

#### Count lines
```powershell
@(Get-Content file.txt).Length
# or
Get-Content file.txt | Measure-Object -Line
```

#### Get first 200 characters of curl response
```powershell
# Option 1: Using Select-Object
curl http://localhost:8080/ | Select-Object -First 1 | ForEach-Object { $_.Substring(0, 200) }

# Option 2: Using ConvertTo-Json first
curl http://localhost:8080/ -s | ConvertFrom-Json | ConvertTo-Json | Select-Object -First 1
```

#### Get first 50 lines from command output
```powershell
curl http://localhost:3000/health | Select-Object -First 50
```

### Why These Are Needed

Unix/Linux commands like `head`, `tail`, and `grep` don't exist natively in PowerShell (which is Windows-first). Instead, PowerShell uses different cmdlets:

- **`head`** → **`Select-Object -First`**
- **`tail`** → **`Select-Object -Last`**  
- **`grep`** → **`Where-Object { $_ -match "..." }`**
- **`wc -l`** → **`Measure-Object -Line`**

### Using with curl/Invoke-WebRequest

#### Getting first N lines from HTTP response
```powershell
# Using curl
curl http://localhost:3000/health | Select-Object -First 10

# Using Invoke-WebRequest
(Invoke-WebRequest http://localhost:3000/health).Content | Select-Object -First 10
```

#### Parsing JSON response
```powershell
curl http://localhost:3000/health | ConvertFrom-Json | Select-Object status, uptime
```

### Error Example & Fix

❌ **This won't work on Windows PowerShell:**
```powershell
curl http://localhost:8080/ | head -c 200
# Error: head: The term 'head' is not recognized...
```

✅ **Use this instead:**
```powershell
$response = curl http://localhost:8080/
$response.Content.Substring(0, 200)
# or
$response | Select-Object -First 1
```

### For Bash/Linux Users

If you're used to Linux/Bash, here's the mapping:

| Bash | PowerShell |
|------|-----------|
| `cat file.txt` | `Get-Content file.txt` |
| `head -n 10 file.txt` | `Get-Content file.txt \| Select-Object -First 10` |
| `tail -n 10 file.txt` | `Get-Content file.txt \| Select-Object -Last 10` |
| `grep "text" file.txt` | `Get-Content file.txt \| Where-Object { $_ -match "text" }` |
| `wc -l file.txt` | `(Get-Content file.txt).Length` |
| `ls -la` | `Get-ChildItem -Force` |
| `ps aux` | `Get-Process` |
| `kill -9 PID` | `Stop-Process -Id PID -Force` |
| `cd /path` | `Set-Location /path` or `cd /path` |
| `echo "text"` | `Write-Host "text"` or `Write-Output "text"` |

### Tips

1. **Chain commands** using the pipe `|` operator (same as Unix)
   ```powershell
   Get-Content file.txt | Where-Object { $_ -match "error" } | Select-Object -First 10
   ```

2. **Save output to variable**
   ```powershell
   $lines = Get-Content file.txt | Select-Object -First 10
   ```

3. **Convert to JSON** for better readability
   ```powershell
   $response | ConvertTo-Json | Select-Object -First 20
   ```

4. **Measure object count**
   ```powershell
   $lines = Get-Content file.txt
   $lines.Count
   ```
