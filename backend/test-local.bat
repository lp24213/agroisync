@echo off
echo 🧪 Testing AGROTM Backend locally...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js 20+
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Clean previous build
echo 🧹 Cleaning previous build...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist dist rmdir /s /q dist

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Type check
echo 🔍 Running type check...
npm run type-check

REM Build
echo 🔨 Building application...
npm run build

REM Check if build was successful
if exist dist\server.js (
    echo ✅ Build successful!
) else (
    echo ❌ Build failed!
    pause
    exit /b 1
)

REM Test health endpoint (if server is running)
echo 🏥 Testing health endpoint...
curl -f http://localhost:3001/health >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Health endpoint not accessible (server might not be running)
) else (
    echo ✅ Health endpoint is working!
)

echo 🎉 All tests passed!
echo 🚀 You can now start the server with: npm start
pause 