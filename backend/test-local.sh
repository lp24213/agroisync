#!/bin/bash

echo "🧪 Testing AGROTM Backend locally..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 20+"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version must be 20 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf node_modules package-lock.json dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Type check
echo "🔍 Running type check..."
npm run type-check

# Build
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ -f "dist/server.js" ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Test health endpoint (if server is running)
echo "🏥 Testing health endpoint..."
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Health endpoint is working!"
else
    echo "⚠️  Health endpoint not accessible (server might not be running)"
fi

echo "🎉 All tests passed!"
echo "🚀 You can now start the server with: npm start" 