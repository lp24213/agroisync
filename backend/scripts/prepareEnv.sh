#!/bin/bash

# AGROTM Environment Setup Script
# This script prepares the development environment for the AGROTM project

set -e  # Exit on any error

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
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        REQUIRED_VERSION="18.0.0"
        
        if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
            print_success "Node.js version $NODE_VERSION is compatible"
            return 0
        else
            print_error "Node.js version $NODE_VERSION is too old. Required: $REQUIRED_VERSION or higher"
            return 1
        fi
    else
        print_error "Node.js is not installed"
        return 1
    fi
}

# Function to check pnpm version
check_pnpm_version() {
    if command_exists pnpm; then
        PNPM_VERSION=$(pnpm --version)
        REQUIRED_VERSION="8.0.0"
        
        if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PNPM_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
            print_success "pnpm version $PNPM_VERSION is compatible"
            return 0
        else
            print_error "pnpm version $PNPM_VERSION is too old. Required: $REQUIRED_VERSION or higher"
            return 1
        fi
    else
        print_error "pnpm is not installed"
        return 1
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    
    if [ -f "package.json" ]; then
        pnpm install
        print_success "Dependencies installed successfully"
    else
        print_error "package.json not found"
        exit 1
    fi
}

# Function to setup environment variables
setup_env() {
    print_status "Setting up environment variables..."
    
    if [ ! -f ".env" ]; then
        if [ -f "env.example" ]; then
            cp env.example .env
            print_success "Created .env file from env.example"
            print_warning "Please update .env with your actual values"
        else
            print_warning "env.example not found, creating basic .env file"
            cat > .env << EOF
# AGROTM Environment Configuration

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/agrotm
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=agrotm
DATABASE_USER=agrotm_user
DATABASE_PASSWORD=agrotm_password

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# Blockchain Networks
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
POLYGON_RPC_URL=https://polygon-rpc.com
BSC_RPC_URL=https://bsc-dataseed.binance.org
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# API Keys
INFURA_API_KEY=your_infura_api_key
ALCHEMY_API_KEY=your_alchemy_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
BSCSCAN_API_KEY=your_bscscan_api_key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@agrotm.com

# IPFS Configuration
IPFS_GATEWAY=https://ipfs.io/ipfs/
IPFS_API_URL=https://ipfs.infura.io:5001/api/v0
IPFS_PROJECT_ID=your_ipfs_project_id
IPFS_PROJECT_SECRET=your_ipfs_project_secret

# AWS S3 (removed - using Cloudinary instead)
# AWS_ACCESS_KEY_ID=your_aws_access_key
# AWS_SECRET_ACCESS_KEY=your_aws_secret_key
# AWS_REGION=us-east-1
# AWS_S3_BUCKET=agrotm-uploads

# Cloudinary (alternative file storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Monitoring and Analytics
# SENTRY_DSN=your_sentry_dsn  # Removed - using console logging instead
GOOGLE_ANALYTICS_ID=your_ga_id
MIXPANEL_TOKEN=your_mixpanel_token

# Security
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
ENCRYPTION_KEY=your_encryption_key_here
SESSION_SECRET=your_session_secret_here

# Feature Flags
ENABLE_AI_FEATURES=true
ENABLE_ORACLE_FEATURES=true
ENABLE_ENTERPRISE_FEATURES=true
ENABLE_KYC_VERIFICATION=true

# Development
NODE_ENV=development
LOG_LEVEL=debug
PORT=3000
API_PORT=3001
BACKEND_PORT=3002

# Testing
TEST_DATABASE_URL=postgresql://test_user:test_password@localhost:5432/agrotm_test
COVERAGE_THRESHOLD=80

# Docker
DOCKER_REGISTRY=your_docker_registry
DOCKER_IMAGE_TAG=latest
EOF
            print_success "Created basic .env file"
            print_warning "Please update .env with your actual values"
        fi
    else
        print_success ".env file already exists"
    fi
}

# Function to setup database
setup_database() {
    print_status "Setting up database..."
    
    if command_exists docker; then
        print_status "Starting PostgreSQL with Docker..."
        docker run -d \
            --name agrotm-postgres \
            -e POSTGRES_DB=agrotm \
            -e POSTGRES_USER=agrotm_user \
            -e POSTGRES_PASSWORD=agrotm_password \
            -p 5432:5432 \
            postgres:15
        
        print_status "Starting Redis with Docker..."
        docker run -d \
            --name agrotm-redis \
            -p 6379:6379 \
            redis:7-alpine
        
        print_success "Database containers started"
        print_warning "Wait a few seconds for databases to be ready"
        sleep 5
    else
        print_warning "Docker not found. Please install PostgreSQL and Redis manually"
    fi
}

# Function to run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    if [ -f "database/init.sql" ]; then
        if command_exists psql; then
            psql -h localhost -U agrotm_user -d agrotm -f database/init.sql
            print_success "Database migrations completed"
        else
            print_warning "psql not found. Please run migrations manually"
        fi
    else
        print_warning "No migration files found"
    fi
}

# Function to setup Git hooks
setup_git_hooks() {
    print_status "Setting up Git hooks..."
    
    if [ -d ".git" ]; then
        # Create pre-commit hook
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."

# Run linting
npm run lint
if [ $? -ne 0 ]; then
    echo "Linting failed. Please fix the issues before committing."
    exit 1
fi

# Run type checking
npm run type-check
if [ $? -ne 0 ]; then
    echo "Type checking failed. Please fix the issues before committing."
    exit 1
fi

# Run tests
npm test
if [ $? -ne 0 ]; then
    echo "Tests failed. Please fix the issues before committing."
    exit 1
fi

echo "Pre-commit checks passed!"
EOF
        
        chmod +x .git/hooks/pre-commit
        print_success "Git hooks configured"
    else
        print_warning "Not a Git repository"
    fi
}

# Function to setup development tools
setup_dev_tools() {
    print_status "Setting up development tools..."
    
    # Install global dependencies
    if command_exists pnpm; then
        pnpm add -g @types/node typescript ts-node nodemon
        print_success "Global development tools installed"
    fi
    
    # Setup VS Code settings if VS Code is installed
    if command_exists code; then
        mkdir -p .vscode
        cat > .vscode/settings.json << EOF
{
    "typescript.preferences.importModuleSpecifier": "relative",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
        "source.organizeImports": true
    },
    "eslint.workingDirectories": [
        "frontend",
        "backend",
        "api"
    ],
    "typescript.suggest.autoImports": true,
    "typescript.updateImportsOnFileMove.enabled": "always"
}
EOF
        print_success "VS Code settings configured"
    fi
}

# Function to verify setup
verify_setup() {
    print_status "Verifying setup..."
    
    local errors=0
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        print_error ".env file not found"
        ((errors++))
    fi
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_error "node_modules not found. Run 'pnpm install'"
        ((errors++))
    fi
    
    # Check if databases are running
    if command_exists docker; then
        if ! docker ps | grep -q agrotm-postgres; then
            print_warning "PostgreSQL container not running"
        fi
        if ! docker ps | grep -q agrotm-redis; then
            print_warning "Redis container not running"
        fi
    fi
    
    if [ $errors -eq 0 ]; then
        print_success "Setup verification completed successfully!"
    else
        print_error "Setup verification found $errors issue(s)"
        return 1
    fi
}

# Function to display help
show_help() {
    echo "AGROTM Environment Setup Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help          Show this help message"
    echo "  -s, --skip-deps     Skip dependency installation"
    echo "  -e, --skip-env      Skip environment setup"
    echo "  -d, --skip-db       Skip database setup"
    echo "  -g, --skip-git      Skip Git hooks setup"
    echo "  -t, --skip-tools    Skip development tools setup"
    echo "  -v, --verify-only   Only verify the current setup"
    echo ""
    echo "Examples:"
    echo "  $0                  Full setup"
    echo "  $0 --skip-deps      Setup without installing dependencies"
    echo "  $0 --verify-only    Only verify the setup"
}

# Main function
main() {
    echo "🌾 AGROTM Environment Setup"
    echo "=========================="
    echo ""
    
    # Parse command line arguments
    SKIP_DEPS=false
    SKIP_ENV=false
    SKIP_DB=false
    SKIP_GIT=false
    SKIP_TOOLS=false
    VERIFY_ONLY=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -s|--skip-deps)
                SKIP_DEPS=true
                shift
                ;;
            -e|--skip-env)
                SKIP_ENV=true
                shift
                ;;
            -d|--skip-db)
                SKIP_DB=true
                shift
                ;;
            -g|--skip-git)
                SKIP_GIT=true
                shift
                ;;
            -t|--skip-tools)
                SKIP_TOOLS=true
                shift
                ;;
            -v|--verify-only)
                VERIFY_ONLY=true
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    if [ "$VERIFY_ONLY" = true ]; then
        verify_setup
        exit $?
    fi
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    
    if ! check_node_version; then
        print_error "Please install Node.js 18+ and try again"
        exit 1
    fi
    
    if ! check_pnpm_version; then
        print_error "Please install pnpm 8+ and try again"
        exit 1
    fi
    
    # Run setup steps
    if [ "$SKIP_DEPS" = false ]; then
        install_dependencies
    fi
    
    if [ "$SKIP_ENV" = false ]; then
        setup_env
    fi
    
    if [ "$SKIP_DB" = false ]; then
        setup_database
    fi
    
    if [ "$SKIP_DB" = false ]; then
        run_migrations
    fi
    
    if [ "$SKIP_GIT" = false ]; then
        setup_git_hooks
    fi
    
    if [ "$SKIP_TOOLS" = false ]; then
        setup_dev_tools
    fi
    
    # Verify setup
    verify_setup
    
    echo ""
    print_success "🎉 AGROTM environment setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Update .env file with your actual values"
    echo "2. Run 'pnpm dev' to start the development server"
    echo "3. Visit http://localhost:3000 to see the application"
    echo ""
    echo "For more information, visit: https://docs.agrotm.com"
}

# Run main function
main "$@" 