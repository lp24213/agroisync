#!/bin/bash

echo "🚀 AGROTM Deployment Script"
echo "=========================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "📦 Node.js version: $NODE_VERSION"

# Check npm version
NPM_VERSION=$(npm --version)
echo "📦 npm version: $NPM_VERSION"

# Test frontend build
echo "🔨 Testing frontend build..."
cd frontend
npm ci
npm run type-check
npm run build
cd ..

# Test backend build
echo "🔨 Testing backend build..."
cd backend
npm ci
npm run type-check
npm run build
cd ..

echo "✅ All builds successful!"
echo "🚀 Ready for deployment to Vercel and Railway"
echo ""
echo "Next steps:"
echo "1. Push to main branch to trigger GitHub Actions"
echo "2. Monitor deployment in GitHub Actions"
echo "3. Check Vercel dashboard for frontend"
echo "4. Check Railway dashboard for backend" 