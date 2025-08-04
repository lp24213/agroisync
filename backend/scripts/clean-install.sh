#!/bin/bash

echo "🧹 Cleaning backend dependencies..."
rm -rf node_modules package-lock.json

echo "📦 Installing dependencies..."
npm install --production

echo "✅ Backend dependencies installed successfully!" 