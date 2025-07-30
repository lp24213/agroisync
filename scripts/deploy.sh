#!/bin/bash

# AGROTM Deployment Script
# This script handles automated deployment of the AGROTM platform

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENVIRONMENT=${1:-staging}
DEPLOY_TYPE=${2:-full}

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    log "Checking dependencies..."
    
    local missing_deps=()
    
    for cmd in docker docker-compose git node npm; do
        if ! command -v "$cmd" &> /dev/null; then
            missing_deps+=("$cmd")
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        error "Missing dependencies: ${missing_deps[*]}"
        exit 1
    fi
    
    success "All dependencies are installed"
}

# Load environment variables
load_env() {
    log "Loading environment variables..."
    
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        error "Environment file not found. Please copy env.example to .env and configure it."
        exit 1
    fi
    
    source "$PROJECT_ROOT/.env"
    
    # Validate required environment variables
    local required_vars=(
        "NODE_ENV"
        "DATABASE_URL"
        "REDIS_URL"
        "JWT_SECRET"
        "SOLANA_RPC_URL"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var:-}" ]; then
            error "Required environment variable $var is not set"
            exit 1
        fi
    done
    
    success "Environment variables loaded"
}

# Backup current deployment
backup_deployment() {
    log "Creating backup of current deployment..."
    
    local backup_dir="$PROJECT_ROOT/backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    # Backup database
    if [ "$ENVIRONMENT" = "production" ]; then
        docker-compose exec -T postgres pg_dump -U postgres agrotm > "$backup_dir/database.sql"
        success "Database backup created: $backup_dir/database.sql"
    fi
    
    # Backup configuration files
    cp -r "$PROJECT_ROOT/.env" "$backup_dir/"
    cp -r "$PROJECT_ROOT/docker-compose.yml" "$backup_dir/"
    
    success "Backup completed: $backup_dir"
}

# Run security checks
security_checks() {
    log "Running security checks..."
    
    # Run npm audit
    cd "$PROJECT_ROOT"
    if npm audit --audit-level=moderate; then
        success "npm audit passed"
    else
        warning "npm audit found vulnerabilities. Consider updating dependencies."
    fi
    
    # Check for secrets in code
    if grep -r "password\|secret\|key" --include="*.js" --include="*.ts" --include="*.json" "$PROJECT_ROOT" | grep -v "node_modules" | grep -v ".git"; then
        warning "Potential secrets found in code. Please review."
    fi
    
    success "Security checks completed"
}

# Build Docker images
build_images() {
    log "Building Docker images..."
    
    cd "$PROJECT_ROOT"
    
    # Build all services
    docker-compose build --no-cache
    
    success "Docker images built successfully"
}

# Run tests
run_tests() {
    log "Running tests..."
    
    cd "$PROJECT_ROOT"
    
    # Install dependencies
    npm ci
    npm run install:workspaces
    
    # Run tests
    npm run test
    
    success "All tests passed"
}

# Deploy to environment
deploy() {
    log "Deploying to $ENVIRONMENT environment..."
    
    cd "$PROJECT_ROOT"
    
    case "$ENVIRONMENT" in
        "staging")
            deploy_staging
            ;;
        "production")
            deploy_production
            ;;
        *)
            error "Invalid environment: $ENVIRONMENT"
            exit 1
            ;;
    esac
}

# Deploy to staging
deploy_staging() {
    log "Deploying to staging..."
    
    # Stop existing services
    docker-compose down
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be healthy
    wait_for_health_checks
    
    success "Staging deployment completed"
}

# Deploy to production
deploy_production() {
    log "Deploying to production..."
    
    # Additional production checks
    if [ "$NODE_ENV" != "production" ]; then
        error "NODE_ENV must be set to 'production' for production deployment"
        exit 1
    fi
    
    # Deploy using Docker Swarm or Kubernetes
    if command -v docker &> /dev/null && docker info | grep -q "Swarm: active"; then
        deploy_docker_swarm
    else
        deploy_docker_compose
    fi
    
    success "Production deployment completed"
}

# Deploy using Docker Swarm
deploy_docker_swarm() {
    log "Deploying using Docker Swarm..."
    
    # Initialize swarm if not already done
    if ! docker info | grep -q "Swarm: active"; then
        docker swarm init
    fi
    
    # Deploy stack
    docker stack deploy -c docker-compose.yml agrotm
}

# Deploy using Docker Compose
deploy_docker_compose() {
    log "Deploying using Docker Compose..."
    
    # Stop existing services
    docker-compose down
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be healthy
    wait_for_health_checks
}

# Wait for health checks
wait_for_health_checks() {
    log "Waiting for health checks..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if check_health; then
            success "All services are healthy"
            return 0
        fi
        
        log "Health check attempt $attempt/$max_attempts failed, retrying in 10 seconds..."
        sleep 10
        ((attempt++))
    done
    
    error "Health checks failed after $max_attempts attempts"
    return 1
}

# Check health of services
check_health() {
    local services=("frontend" "backend" "api-gateway" "staking" "defi-dashboard")
    
    for service in "${services[@]}"; do
        if ! docker-compose ps "$service" | grep -q "Up"; then
            return 1
        fi
    done
    
    # Check HTTP health endpoints
    local health_endpoints=(
        "http://localhost:3000/api/health"
        "http://localhost:3001/health"
        "http://localhost:3002/health"
        "http://localhost:3003/health"
        "http://localhost:3004/health"
    )
    
    for endpoint in "${health_endpoints[@]}"; do
        if ! curl -f -s "$endpoint" > /dev/null; then
            return 1
        fi
    done
    
    return 0
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    cd "$PROJECT_ROOT"
    
    # Run migrations
    npm run db:migrate
    
    success "Database migrations completed"
}

# Seed database
seed_database() {
    log "Seeding database..."
    
    cd "$PROJECT_ROOT"
    
    # Run seed script
    npm run db:seed
    
    success "Database seeding completed"
}

# Monitor deployment
monitor_deployment() {
    log "Monitoring deployment..."
    
    # Monitor logs for errors
    docker-compose logs -f --tail=100 &
    local log_pid=$!
    
    # Monitor for 5 minutes
    sleep 300
    
    # Stop log monitoring
    kill $log_pid 2>/dev/null || true
    
    success "Deployment monitoring completed"
}

# Rollback deployment
rollback() {
    log "Rolling back deployment..."
    
    cd "$PROJECT_ROOT"
    
    # Stop current services
    docker-compose down
    
    # Restore from backup
    local latest_backup=$(ls -t "$PROJECT_ROOT/backups" | head -1)
    if [ -n "$latest_backup" ]; then
        log "Restoring from backup: $latest_backup"
        cp "$PROJECT_ROOT/backups/$latest_backup/.env" "$PROJECT_ROOT/"
        cp "$PROJECT_ROOT/backups/$latest_backup/docker-compose.yml" "$PROJECT_ROOT/"
        
        # Restart services
        docker-compose up -d
        
        success "Rollback completed"
    else
        error "No backup found for rollback"
        exit 1
    fi
}

# Cleanup old backups
cleanup_backups() {
    log "Cleaning up old backups..."
    
    # Keep only last 7 days of backups
    find "$PROJECT_ROOT/backups" -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true
    
    success "Backup cleanup completed"
}

# Main deployment function
main() {
    log "Starting AGROTM deployment to $ENVIRONMENT environment"
    
    # Check dependencies
    check_dependencies
    
    # Load environment variables
    load_env
    
    # Create backup
    backup_deployment
    
    # Run security checks
    security_checks
    
    # Build images
    build_images
    
    # Run tests
    run_tests
    
    # Run migrations
    run_migrations
    
    # Deploy
    deploy
    
    # Seed database (only for staging)
    if [ "$ENVIRONMENT" = "staging" ]; then
        seed_database
    fi
    
    # Monitor deployment
    monitor_deployment
    
    # Cleanup
    cleanup_backups
    
    success "Deployment to $ENVIRONMENT completed successfully!"
}

# Handle script arguments
case "${1:-}" in
    "staging"|"production")
        main
        ;;
    "rollback")
        rollback
        ;;
    "health")
        check_health && success "All services are healthy" || error "Health check failed"
        ;;
    "logs")
        docker-compose logs -f
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [environment] [deploy_type]"
        echo ""
        echo "Environments:"
        echo "  staging     Deploy to staging environment"
        echo "  production  Deploy to production environment"
        echo ""
        echo "Commands:"
        echo "  rollback    Rollback to previous deployment"
        echo "  health      Check health of all services"
        echo "  logs        Show logs from all services"
        echo "  help        Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 staging"
        echo "  $0 production"
        echo "  $0 rollback"
        ;;
    *)
        error "Invalid argument. Use 'help' for usage information."
        exit 1
        ;;
esac 