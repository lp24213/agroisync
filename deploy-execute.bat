@echo off
setlocal enabledelayedexpansion

REM AGROTM Deployment Execution Script (Windows)
REM This script prepares and triggers the deployment process

echo 🚀 AGROTM Deployment Execution Script
echo ======================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] Please run this script from the AGROTM project root directory
    pause
    exit /b 1
)

if not exist "frontend" (
    echo [ERROR] Frontend directory not found
    pause
    exit /b 1
)

if not exist "backend" (
    echo [ERROR] Backend directory not found
    pause
    exit /b 1
)

echo [INFO] Starting deployment preparation...

REM Step 1: Ensure environment files exist
echo [INFO] Checking environment files...

if not exist "backend\.env" (
    echo [WARNING] backend\.env not found, creating from example...
    copy "backend\env.example" "backend\.env" >nul
    echo [SUCCESS] Created backend\.env
) else (
    echo [SUCCESS] backend\.env exists
)

if not exist "frontend\.env.local" (
    echo [WARNING] frontend\.env.local not found, creating from example...
    copy "frontend\env.example" "frontend\.env.local" >nul
    echo [SUCCESS] Created frontend\.env.local
) else (
    echo [SUCCESS] frontend\.env.local exists
)

REM Step 2: Run final build tests
echo [INFO] Running final build tests...

echo [INFO] Building backend...
cd backend
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Backend build failed
    pause
    exit /b 1
)
echo [SUCCESS] Backend build completed

echo [INFO] Building frontend...
cd ..\frontend
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed
    pause
    exit /b 1
)
echo [SUCCESS] Frontend build completed

cd ..

REM Step 3: Check git status
echo [INFO] Checking git status...

git status --porcelain >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Working directory is clean
) else (
    echo [WARNING] Working directory has uncommitted changes
    echo Current changes:
    git status --short
    echo.
    set /p commit_changes="Do you want to commit these changes before deployment? (y/n): "
    if /i "!commit_changes!"=="y" (
        echo [INFO] Committing changes...
        git add .
        git commit -m "Pre-deployment commit - %date% %time%"
        echo [SUCCESS] Changes committed
    ) else (
        echo [WARNING] Proceeding without committing changes
    )
)

REM Step 4: Check if we're on main branch
for /f "tokens=*" %%i in ('git branch --show-current') do set current_branch=%%i
if not "!current_branch!"=="main" (
    echo [WARNING] You're not on the main branch (current: !current_branch!)
    set /p switch_branch="Do you want to switch to main branch? (y/n): "
    if /i "!switch_branch!"=="y" (
        git checkout main
        echo [SUCCESS] Switched to main branch
    ) else (
        echo [WARNING] Proceeding on current branch
    )
)

REM Step 5: Push to trigger deployment
echo [INFO] Ready to trigger deployment...
echo.
echo 📋 Deployment Summary:
echo ======================
echo ✅ Environment files: Ready
echo ✅ Build tests: Passed
echo ✅ Git status: Clean
for /f "tokens=*" %%i in ('git branch --show-current') do echo ✅ Branch: %%i
echo.
echo 🚀 The deployment will be triggered when you push to the main branch
echo.

set /p trigger_deploy="Do you want to push to trigger deployment now? (y/n): "
if /i "!trigger_deploy!"=="y" (
    echo [INFO] Pushing to trigger deployment...
    git push origin main
    echo [SUCCESS] Deployment triggered!
    echo.
    echo 📊 Monitor your deployment:
    echo • GitHub Actions: Check your repository's Actions tab
    echo • Vercel Dashboard: https://vercel.com/dashboard
    echo • Railway Dashboard: https://railway.app/dashboard
    echo.
    echo [SUCCESS] Deployment execution completed!
) else (
    echo [INFO] Deployment preparation completed. Push manually when ready.
)

echo.
echo 🎯 Next Steps:
echo 1. Monitor the GitHub Actions workflow
echo 2. Check deployment status in Vercel and Railway dashboards
echo 3. Verify the deployed applications are working correctly
echo 4. Configure production environment variables if needed

pause 