#!/usr/bin/env node

/**
 * Auto-restart server script for Node.js backend
 * Automatically restarts the server if it crashes
 * Runs on port 3000 by default (override with PORT env var)
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RESTART_DELAY = 3000; // 3 seconds before restart
const LOG_PREFIX = '🚀 [AUTO-RESTART]';

let serverProcess = null;
let isRestarting = false;

function log(message, level = 'INFO') {
  const timestamp = new Date().toLocaleTimeString();
  const emoji = level === 'ERROR' ? '❌' : level === 'WARN' ? '⚠️' : 'ℹ️';
  console.log(`${emoji} [${timestamp}] ${LOG_PREFIX} ${message}`);
}

function startServer() {
  if (isRestarting) return;

  const backendDir = path.join(__dirname, 'backend');
  const distPath = path.join(backendDir, 'dist');

  // Check if backend is built
  if (!fs.existsSync(distPath)) {
    log('Backend not built. Building now...', 'WARN');
    const build = spawn('pnpm', ['run', 'build'], { 
      cwd: backendDir,
      stdio: 'inherit'
    });

    build.on('close', (code) => {
      if (code === 0) {
        log('Backend build successful');
        startServer();
      } else {
        log('Backend build failed', 'ERROR');
      }
    });
    return;
  }

  const port = process.env.PORT || '3000';
  log(`Starting backend server on port ${port}...`);
  
  serverProcess = spawn('node', ['dist/index.js'], {
    cwd: backendDir,
    stdio: 'inherit',
    env: { ...process.env, PORT: port }
  });

  serverProcess.on('close', (code) => {
    if (code !== 0) {
      log(`Server crashed with code ${code}. Restarting in ${RESTART_DELAY}ms...`, 'ERROR');
      isRestarting = true;
      setTimeout(() => {
        isRestarting = false;
        startServer();
      }, RESTART_DELAY);
    } else {
      log('Server stopped gracefully');
    }
  });

  serverProcess.on('error', (err) => {
    log(`Server error: ${err.message}`, 'ERROR');
  });
}

process.on('SIGINT', () => {
  log('Shutting down server...');
  if (serverProcess) {
    serverProcess.kill();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Terminating server...');
  if (serverProcess) {
    serverProcess.kill();
  }
  process.exit(0);
});

log('Auto-restart server initialized');
log('Any crashes will trigger automatic restart');
startServer();
