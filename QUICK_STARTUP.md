# ⚡ Quick Server Startup Commands

## Fastest Ways to Start

### 1️⃣ VS Code (One Click)
```
Press F5 → Select "🎯 Auto-Start Backend Server"
```
✅ Starts immediately, auto-restarts on crash

### 2️⃣ VS Code Task Menu
```
Press Ctrl+Shift+B → Select "🔥 Start Both Servers"
```
✅ Builds and starts frontend + backend

### 3️⃣ Terminal Command
```bash
node start-server-auto-restart.js
```
✅ Manual start with auto-restart

### 4️⃣ Background (Keep Terminal Free)
```bash
# Mac/Linux
node start-server-auto-restart.js > server.log 2>&1 &

# Windows (PowerShell)
Start-Process node -ArgumentList "start-server-auto-restart.js" -NoNewWindow
```

---

## What Gets Started

| Component | Port | URL | Start Time |
|-----------|------|-----|------------|
| Backend API | 3000 | http://localhost:3000 | ~2-3s |
| Frontend | 8080 | http://localhost:8080 | ~1s |
| Auto-Restart | N/A | Monitors backend | Always active |

---

## File Locations

- **Auto-Restart Script**: `start-server-auto-restart.js`
- **VS Code Tasks**: `.vscode/tasks.json`
- **VS Code Debug**: `.vscode/launch.json`
- **Backend Entry**: `backend/src/index.ts`
- **Frontend Entry**: `src/main.tsx`
- **Full Guide**: `AUTO_STARTUP_GUIDE.md`

---

## If Something Goes Wrong

| Problem | Solution |
|---------|----------|
| Port 8080 in use | Kill process: `lsof -i :8080` then `kill -9 <PID>` |
| Backend won't build | `cd backend && pnpm install && pnpm run build` |
| Tasks don't show | `Ctrl+Shift+P` → Reload Window |
| Server keeps restarting | Check `backend/src/index.ts` for errors |
| Port not binding | Check firewall settings |

---

## Server Status Indicators

- ✅ **Green** = Server healthy, ready for requests
- ⚠️ **Yellow** = Server recovering, wait 3 seconds
- ❌ **Red** = Server error, check logs
- ℹ️ **Blue** = Information message

---

## 🎯 Recommended Setup

1. **Daily Use**: Press `F5` in VS Code (auto-starts all)
2. **Keep Running**: Terminal with auto-restart script in background
3. **Debugging**: Attach debugger to running server (port 9229)
4. **Production**: Use PM2 or Docker (see `AUTO_STARTUP_GUIDE.md`)

---

## Test It Works

After starting, verify in browser:
```
✅ http://localhost:8080
   Should show Dealer PCC application
   
✅ http://localhost:8080/api/health (if available)
   Should return 200 OK
```

---

**Version**: 1.0 | **Status**: ✅ Ready | **Last Test**: Auto-restart verified
