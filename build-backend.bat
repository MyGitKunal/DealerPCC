@echo off
echo.
echo 🚀 Building Backend with Real Email Service...
echo ================================================
echo.

cd backend

echo 📦 Installing dependencies...
call npm install

if errorlevel 1 (
    echo ❌ npm install failed
    pause
    exit /b 1
)

echo.
echo 🏗️  Building TypeScript...
call npm run build

if errorlevel 1 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo.
echo ✅ Backend build complete!
echo.
echo 📧 Next Steps to Enable Email:
echo 1. Configure backend\.env with SMTP credentials
echo 2. Run: npm start
echo 3. Email service will initialize automatically
echo.
echo For setup guide: See REAL_EMAIL_SETUP.md
echo.
pause
