#!/bin/bash

# AGROTM Production Deployment Script
# Professional deployment automation with safety checks

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOYMENT_ENV="production"
REQUIRED_NODE_VERSION="18"
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"

echo -e "${BLUE}🚀 AGROTM Production Deployment Script${NC}"
echo -e "${BLUE}======================================${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Node.js version
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt "$REQUIRED_NODE_VERSION" ]; then
        print_error "Node.js version $REQUIRED_NODE_VERSION or higher is required"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check git
    if ! command -v git &> /dev/null; then
        print_error "git is not installed"
        exit 1
    fi
    
    # Check if we're on main branch
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "main" ]; then
        print_error "Must be on main branch for production deployment. Current branch: $CURRENT_BRANCH"
        exit 1
    fi
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        print_error "There are uncommitted changes. Please commit or stash them first."
        exit 1
    fi
    
    print_status "Prerequisites check passed"
}

# Create backup
create_backup() {
    print_info "Creating backup..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup current deployment
    if [ -d ".next" ]; then
        cp -r .next "$BACKUP_DIR/"
        print_status "Build backup created"
    fi
    
    # Backup environment files
    if [ -f ".env.production" ]; then
        cp .env.production "$BACKUP_DIR/"
    fi
    
    print_status "Backup created at $BACKUP_DIR"
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    
    # Clean install
    rm -rf node_modules package-lock.json
    npm ci --production=false
    
    print_status "Dependencies installed"
}

# Run tests
run_tests() {
    print_info "Running tests..."
    
    # Type checking
    npm run type-check
    print_status "Type checking passed"
    
    # Linting
    npm run lint
    print_status "Linting passed"
    
    # Unit tests
    npm run test:unit
    print_status "Unit tests passed"
    
    # Security audit
    npm audit --audit-level=moderate
    print_status "Security audit passed"
}

# Build application
build_application() {
    print_info "Building application..."
    
    # Set production environment
    export NODE_ENV=production
    
    # Build
    npm run build
    
    # Verify build
    if [ ! -d ".next" ]; then
        print_error "Build failed - .next directory not found"
        exit 1
    fi
    
    print_status "Application built successfully"
}

# Deploy to Vercel
deploy_to_vercel() {
    print_info "Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_info "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Deploy
    vercel --prod --confirm
    
    print_status "Deployed to Vercel"
}

# Health check
health_check() {
    print_info "Performing health check..."
    
    # Wait for deployment to be ready
    sleep 30
    
    # Check health endpoint
    HEALTH_URL="https://agrotm.vercel.app/api/health"
    
    for i in {1..5}; do
        print_info "Health check attempt $i/5..."
        
        if curl -f "$HEALTH_URL" > /dev/null 2>&1; then
            print_status "Health check passed"
            return 0
        fi
        
        if [ $i -lt 5 ]; then
            print_warning "Health check failed, retrying in 10 seconds..."
            sleep 10
        fi
    done
    
    print_error "Health check failed after 5 attempts"
    return 1
}

# Rollback function
rollback() {
    print_warning "Rolling back deployment..."
    
    if [ -d "$BACKUP_DIR/.next" ]; then
        rm -rf .next
        cp -r "$BACKUP_DIR/.next" ./
        print_status "Rollback completed"
    else
        print_error "No backup found for rollback"
    fi
}

# Cleanup
cleanup() {
    print_info "Cleaning up..."
    
    # Remove old backups (keep last 5)
    if [ -d "./backups" ]; then
        cd ./backups
        ls -t | tail -n +6 | xargs -r rm -rf
        cd ..
    fi
    
    print_status "Cleanup completed"
}

# Send notification
send_notification() {
    local status=$1
    local message=$2
    
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚀 AGROTM Production Deployment $status: $message\"}" \
            "$SLACK_WEBHOOK_URL"
    fi
}

# Main deployment function
main() {
    local start_time=$(date +%s)
    
    print_info "Starting production deployment..."
    
    # Trap errors for rollback
    trap 'print_error "Deployment failed!"; rollback; send_notification "FAILED" "Deployment failed and rolled back"; exit 1' ERR
    
    # Run deployment steps
    check_prerequisites
    create_backup
    install_dependencies
    run_tests
    build_application
    deploy_to_vercel
    
    # Health check with rollback on failure
    if ! health_check; then
        print_error "Health check failed, rolling back..."
        rollback
        send_notification "FAILED" "Health check failed, deployment rolled back"
        exit 1
    fi
    
    cleanup
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    print_status "Production deployment completed successfully in ${duration}s"
    send_notification "SUCCESS" "Deployment completed successfully in ${duration}s"
}

# Confirmation prompt
echo -e "${YELLOW}⚠️  You are about to deploy to PRODUCTION environment.${NC}"
echo -e "${YELLOW}This will affect live users and services.${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " -r
echo ""

if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    main
else
    print_info "Deployment cancelled by user"
    exit 0
fi
