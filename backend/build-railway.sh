#!/bin/bash

echo "🔧 Building AGROTM Backend for Railway..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Verify build
echo "✅ Verifying build..."
if [ -f "dist/server.js" ]; then
    echo "✅ Build successful! Server file found at dist/server.js"
else
    echo "❌ Build failed! Server file not found"
    exit 1
fi

echo "🚀 Ready for deployment!" 