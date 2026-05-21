# 🚀 Automatic Server Startup Guide

## Overview
Your project now has automatic server startup with auto-restart capabilities. The backend will automatically restart if it crashes, and VS Code can launch everything with a single command.

## Requirements Met ✅
1. ✅ **Project Type Detection**: Detected Node.js backend (uses `node dist/index.js`)
2. ✅ **Auto-Restart Script**: `start-server-auto-restart.js` created with crash recovery
3. ✅ **VS Code Tasks**: 6 build and run tasks configured
4. ✅ **Launch Configurations**: Debug and auto-start configurations ready
5. ✅ **Auto-Restart Logic**: 3-second recovery delay on crashes
6. ✅ **Port Configuration**: Frontend runs on localhost:8080, backend API on localhost:3000
7. ✅ **Confirmation Logging**: Timestamped console output with emoji indicators

## Quick Start

### Option 1: VS Code Run & Debug (Easiest)
1. Press `F5` or go to **Run → Start Debugging**
2. Select **"🎯 Auto-Start Backend Server"** (auto-starts on project open)
3. Backend API starts on localhost:3000 with auto-restart enabled
4. Open browser to http://localhost:8080

### Option 2: VS Code Tasks Menu
1. Press `Ctrl+Shift+B` or **Terminal → Run Task**
2. Select from available tasks:
   - **📦 Build Backend** - Compile TypeScript to dist/
   - **🎨 Build Frontend** - Build Vite project
   - **🚀 Start Backend Server (Auto-Restart)** - Backend only with auto-restart
   - **🌐 Start Frontend Server** - Frontend only
   - **🔥 Start Both Servers** - Backend + Frontend (RECOMMENDED)
   - **✅ Full Development Setup** - Build everything + start both servers

### Option 3: Command Line
```bash
# Start backend with auto-restart
node start-server-auto-restart.js

# Or in background with logs
node start-server-auto-restart.js > server.log 2>&1 &
```

### Option 4: pnpm Scripts
```bash
# Build backend
cd backend && pnpm run build && cd ..

# Start frontend
node serve-dist.js

# In another terminal: start backend
node start-server-auto-restart.js
```

## What Happens on Startup

### Initialization Phase
```
ℹ️  [13:45:22] Checking backend build status...
ℹ️  [13:45:22] Backend dist/ found, skipping build
```

### Running Phase
```
✅ [13:45:23] Backend server started successfully
ℹ️  [13:45:23] Listening on port 3000
ℹ️  [13:45:23] API is running on http://localhost:3000
```

### Auto-Restart on Crash
```
❌ [13:46:45] Server crashed with code 1
⚠️  [13:46:45] Restarting in 3 seconds...
ℹ️  [13:46:48] Backend server started successfully
```

### Graceful Shutdown
```
ℹ️  [13:50:00] Received shutdown signal
✅ [13:50:00] Server stopped gracefully
```

## File Structure
```
DPgitproject/
├── start-server-auto-restart.js      ← Auto-restart script
├── .vscode/
│   ├── tasks.json                    ← 6 VS Code tasks
│   └── launch.json                   ← Debug configurations
├── backend/
│   ├── dist/                         ← Compiled backend
│   ├── src/
│   │   └── index.ts                 ← Backend entry point
│   └── package.json                 ← Backend scripts
├── serve-dist.js                     ← Frontend server
└── src/
    └── main.tsx                      ← Frontend entry point
```

## Features

### Auto-Restart
- Restarts automatically on crash (exit code ≠ 0)
- 3-second delay between restarts prevents rapid loops
- Gracefully handles SIGINT (Ctrl+C) and SIGTERM signals
- No manual intervention needed

### Smart Build Detection
- Checks if `backend/dist/` exists before starting
- Automatically runs `pnpm run build` in backend if needed
- Ensures latest code is always running

### Comprehensive Logging
- Timestamped console output (`[HH:MM:SS]`)
- Clear emoji indicators:
  - ✅ Success operations
  - ❌ Errors
  - ⚠️ Warnings
  - ℹ️ Information

### Environment Configuration
- Uses `PORT` env var for backend (default: `3000`)
- Working directory set to `backend/` for proper module resolution
- Node.js environment variables inherited from parent

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 8080 (frontend)
lsof -i :8080  (Mac/Linux)
netstat -ano | findstr :8080  (Windows)

# Find process using port 3000 (backend API)
lsof -i :3000  (Mac/Linux)
netstat -ano | findstr :3000  (Windows)

# Kill the process
kill -9 <PID>  (Mac/Linux)
taskkill /PID <PID> /F  (Windows)

# Then start again
node start-server-auto-restart.js
```

### Backend Build Fails
```bash
# Manually rebuild
cd backend
pnpm install
pnpm run build
cd ..

# Then start
node start-server-auto-restart.js
```

### Rapid Restart Loop
- Check backend/logs/ for error details
- Ensure all environment variables are set
- Verify database connection if applicable
- Check console output for specific error message

### VS Code Tasks Don't Appear
```bash
# Reload VS Code
Ctrl+Shift+P → Developer: Reload Window

# Or manually run from Command Palette
Ctrl+Shift+P → Tasks: Run Task
```

## Configuration

### Modify Restart Delay
Edit `start-server-auto-restart.js`:
```javascript
const RESTART_DELAY = 3000; // Change milliseconds (current: 3 seconds)
```

### Change Port
The port is controlled by environment variable. To use different port:
```bash
# In start-server-auto-restart.js, modify:
PORT: '3000'  // Change to desired backend API port
```

### Add Pre-Start Tasks
Edit `.vscode/tasks.json` - add "preLaunchTask" to backend task

## Integration Tips

### With GitHub
Add to `.gitignore`:
```
server.log
.vscode/settings.json
node_modules/
backend/dist/
```

### With Docker (Optional)
The script can also run in Docker:
```dockerfile
ENTRYPOINT ["node", "start-server-auto-restart.js"]
```

### With PM2 (Production)
```bash
pm2 start start-server-auto-restart.js --name "dealer-pcc-backend"
pm2 save
pm2 startup
```

## Environment Details

- **Backend**: Node.js + TypeScript
- **Frontend**: React 18 + Vite
- **Ports**: Frontend 8080, Backend API 3000
- **Database**: PostgreSQL (ready to integrate)
- **Authentication**: Implemented (roles: service_manager, service_head, warranty_manager, master_technician, manufacturer_admin, super_admin)

## Next Steps

1. **Frontend Access**: http://localhost:8080
2. **Test Login**: Use test credentials from TEST_ADMIN_PANEL.md
3. **Monitor Logs**: Watch console for real-time server status
4. **Check Health**: Backend API should respond within 2-3 seconds

## Commands Reference

| Command | Action |
|---------|--------|
| `F5` | Launch debugger (auto-start backend) |
| `Ctrl+Shift+B` | Show build tasks |
| `Ctrl+Shift+D` | Open Debug view |
| `node start-server-auto-restart.js` | Manual backend start |
| `node serve-dist.js` | Manual frontend start |
| `Ctrl+C` | Gracefully stop any process |

## Support

For detailed backend setup, see: `backend/README.md`
For deployment info, see: `DEPLOYMENT_GUIDE.md`
For security details, see: `SECURITY_GUIDE.md`

---
**Last Updated**: Auto-setup complete
**Status**: ✅ Ready for development
**Frontend URL**: http://localhost:8080
**Backend API URL**: http://localhost:3000
