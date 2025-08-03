#!/bin/bash

# AGROTM Setup Script
# This script sets up the AGROTM development environment

set -e

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge 20 ]; then
            print_success "Node.js version $(node --version) is compatible"
            return 0
        else
            print_error "Node.js version $(node --version) is too old. Please install Node.js 20 or higher."
            return 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 20 or higher."
        return 1
    fi
}

# Function to check pnpm version
check_pnpm_version() {
    if command_exists pnpm; then
        PNPM_VERSION=$(pnpm --version | cut -d'.' -f1)
        if [ "$PNPM_VERSION" -ge 8 ]; then
            print_success "pnpm version $(pnpm --version) is compatible"
            return 0
        else
            print_error "pnpm version $(pnpm --version) is too old. Please install pnpm 8 or higher."
            return 1
        fi
    else
        print_error "pnpm is not installed. Please install pnpm 8 or higher."
        return 1
    fi
}

# Function to install pnpm if not present
install_pnpm() {
    if ! command_exists pnpm; then
        print_status "Installing pnpm..."
        npm install -g pnpm
        print_success "pnpm installed successfully"
    fi
}

# Function to setup environment file
setup_env_file() {
    if [ ! -f .env.local ]; then
        print_status "Creating .env.local file..."
        cp env.example .env.local
        print_success ".env.local file created"
        print_warning "Please edit .env.local with your configuration"
    else
        print_warning ".env.local already exists"
    fi
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    # Create logs directory
    mkdir -p logs
    print_success "Created logs directory"
    
    # Create uploads directory
    mkdir -p uploads
    print_success "Created uploads directory"
    
    # Create backend logs directory
    mkdir -p backend/logs
    print_success "Created backend logs directory"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    pnpm install
    print_success "Root dependencies installed"
    
    # Install frontend dependencies
    cd frontend
    pnpm install
    cd ..
    print_success "Frontend dependencies installed"
    
    # Install backend dependencies
    cd backend
    pnpm install
    cd ..
    print_success "Backend dependencies installed"
}

# Function to setup Git hooks
setup_git_hooks() {
    print_status "Setting up Git hooks..."
    
    if [ -d .git ]; then
        pnpm prepare
        print_success "Git hooks configured"
    else
        print_warning "Not a Git repository, skipping Git hooks setup"
    fi
}

# Function to run initial checks
run_checks() {
    print_status "Running initial checks..."
    
    # Type checking
    cd frontend
    pnpm type-check
    cd ..
    print_success "TypeScript type checking passed"
    
    # Linting
    pnpm lint
    print_success "Linting passed"
}

# Function to setup database (if available)
setup_database() {
    print_status "Checking database setup..."
    
    # Check if MongoDB is running
    if command_exists mongod; then
        if pgrep -x "mongod" > /dev/null; then
            print_success "MongoDB is running"
        else
            print_warning "MongoDB is installed but not running. Please start MongoDB manually."
        fi
    else
        print_warning "MongoDB is not installed. Please install MongoDB for full functionality."
    fi
    
    # Check if Redis is running
    if command_exists redis-server; then
        if pgrep -x "redis-server" > /dev/null; then
            print_success "Redis is running"
        else
            print_warning "Redis is installed but not running. Please start Redis manually."
        fi
    else
        print_warning "Redis is not installed. Please install Redis for full functionality."
    fi
}

# Function to display next steps
display_next_steps() {
    echo ""
    echo "=========================================="
    echo "🎉 AGROTM Setup Complete!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Edit .env.local with your configuration"
    echo "2. Start MongoDB and Redis (if not already running)"
    echo "3. Run the development servers:"
    echo "   - Frontend: pnpm frontend:dev"
    echo "   - Backend:  pnpm backend:dev"
    echo ""
    echo "Access the application:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend:  http://localhost:3001"
    echo "   - API Docs: http://localhost:3001/api-docs"
    echo ""
    echo "Useful commands:"
    echo "   - pnpm dev          # Start both frontend and backend"
    echo "   - pnpm test         # Run tests"
    echo "   - pnpm lint         # Run linting"
    echo "   - pnpm build        # Build for production"
    echo ""
    echo "For more information, see the README.md file."
    echo ""
}

# Main setup function
main() {
    echo "=========================================="
    echo "🚀 AGROTM Development Environment Setup"
    echo "=========================================="
    echo ""
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    
    if ! check_node_version; then
        exit 1
    fi
    
    if ! check_pnpm_version; then
        install_pnpm
        if ! check_pnpm_version; then
            exit 1
        fi
    fi
    
    # Setup environment
    setup_env_file
    create_directories
    
    # Install dependencies
    install_dependencies
    
    # Setup Git hooks
    setup_git_hooks
    
    # Setup database
    setup_database
    
    # Run initial checks
    run_checks
    
    # Display next steps
    display_next_steps
}

# Run main function
main "$@" 