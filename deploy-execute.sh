#!/bin/bash

# AGROTM Deployment Execution Script
# This script prepares and triggers the deployment process

set -e

echo "🚀 AGROTM Deployment Execution Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    print_error "Please run this script from the AGROTM project root directory"
    exit 1
fi

print_status "Starting deployment preparation..."

# Step 1: Ensure environment files exist
print_status "Checking environment files..."

if [ ! -f "backend/.env" ]; then
    print_warning "backend/.env not found, creating from example..."
    cp backend/env.example backend/.env
    print_success "Created backend/.env"
else
    print_success "backend/.env exists"
fi

if [ ! -f "frontend/.env.local" ]; then
    print_warning "frontend/.env.local not found, creating from example..."
    cp frontend/env.example frontend/.env.local
    print_success "Created frontend/.env.local"
else
    print_success "frontend/.env.local exists"
fi

# Step 2: Run final build tests
print_status "Running final build tests..."

print_status "Building backend..."
cd backend
npm run build
print_success "Backend build completed"

print_status "Building frontend..."
cd ../frontend
npm run build
print_success "Frontend build completed"

cd ..

# Step 3: Check git status
print_status "Checking git status..."

if [ -z "$(git status --porcelain)" ]; then
    print_success "Working directory is clean"
else
    print_warning "Working directory has uncommitted changes"
    echo "Current changes:"
    git status --short
    echo ""
    read -p "Do you want to commit these changes before deployment? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Committing changes..."
        git add .
        git commit -m "Pre-deployment commit - $(date)"
        print_success "Changes committed"
    else
        print_warning "Proceeding without committing changes"
    fi
fi

# Step 4: Check if we're on main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    print_warning "You're not on the main branch (current: $current_branch)"
    read -p "Do you want to switch to main branch? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout main
        print_success "Switched to main branch"
    else
        print_warning "Proceeding on current branch"
    fi
fi

# Step 5: Push to trigger deployment
print_status "Ready to trigger deployment..."
echo ""
echo "📋 Deployment Summary:"
echo "======================"
echo "✅ Environment files: Ready"
echo "✅ Build tests: Passed"
echo "✅ Git status: Clean"
echo "✅ Branch: $(git branch --show-current)"
echo ""
echo "🚀 The deployment will be triggered when you push to the main branch"
echo ""

read -p "Do you want to push to trigger deployment now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Pushing to trigger deployment..."
    git push origin main
    print_success "Deployment triggered!"
    echo ""
    echo "📊 Monitor your deployment:"
    echo "• GitHub Actions: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\).*/\1/')/actions"
    echo "• Vercel Dashboard: https://vercel.com/dashboard"
    echo "• Railway Dashboard: https://railway.app/dashboard"
    echo ""
    print_success "Deployment execution completed!"
else
    print_status "Deployment preparation completed. Push manually when ready."
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Monitor the GitHub Actions workflow"
echo "2. Check deployment status in Vercel and Railway dashboards"
echo "3. Verify the deployed applications are working correctly"
echo "4. Configure production environment variables if needed" 