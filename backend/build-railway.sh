#!/bin/bash

echo "🔧 Building AGROTM Backend for Railway..."

# Set Python environment
export PYTHON=/usr/bin/python3
export npm_config_python=/usr/bin/python3

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf node_modules package-lock.json dist

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production --python=/usr/bin/python3

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