#!/bin/bash

echo "🚀 Building Backend with Real Email Service..."
echo "================================================"

cd backend

echo "📦 Installing dependencies..."
npm install

echo "🏗️  Building TypeScript..."
npm run build

echo ""
echo "✅ Backend build complete!"
echo ""
echo "📧 Next Steps to Enable Email:"
echo "1. Configure .env with SMTP credentials"
echo "2. Run: npm start"
echo "3. Email service will initialize automatically"
echo ""
echo "For setup guide: See REAL_EMAIL_SETUP.md"
