#!/bin/bash

# Dealer PCC Auto-Restart Script
# This ensures both services restart automatically if they crash

echo "Starting Dealer PCC Services with Auto-Restart..."
echo "Press Ctrl+C to stop"
echo ""

# Function to start backend with auto-restart
start_backend() {
    while true; do
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting Backend on port 3000..."
        cd "backend" && pnpm run dev
        BACKEND_EXIT=$?
        if [ $BACKEND_EXIT -ne 0 ]; then
            echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backend crashed with code $BACKEND_EXIT. Restarting in 2 seconds..."
            sleep 2
        fi
        cd ..
    done
}

# Function to start frontend with auto-restart
start_frontend() {
    while true; do
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting Frontend on port 8080..."
        pnpm run dev
        FRONTEND_EXIT=$?
        if [ $FRONTEND_EXIT -ne 0 ]; then
            echo "[$(date '+%Y-%m-%d %H:%M:%S')] Frontend crashed with code $FRONTEND_EXIT. Restarting in 2 seconds..."
            sleep 2
        fi
    done
}

# Start both services in background
start_backend &
BACKEND_PID=$!

start_frontend &
FRONTEND_PID=$!

echo ""
echo "Services started:"
echo "  Backend (PID: $BACKEND_PID) - http://localhost:3000"
echo "  Frontend (PID: $FRONTEND_PID) - http://localhost:8080"
echo ""

# Trap Ctrl+C to stop both processes
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Services stopped'; exit 0" INT

# Wait for both processes
wait
