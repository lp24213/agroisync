#!/bin/bash

# Script de Deploy - AGROISYNC
# Este script automatiza o processo de deploy da aplicação

set -e  # Exit on any error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções de log
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    log_error "package.json não encontrado. Execute este script na raiz do projeto."
    exit 1
fi

# Configurações
ENVIRONMENT=${1:-production}
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
LOG_FILE="deploy.log"

# Função para verificar dependências
check_dependencies() {
    log "Verificando dependências..."
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js não está instalado"
        exit 1
    fi
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        log_error "npm não está instalado"
        exit 1
    fi
    
    # Verificar MongoDB (se local)
    if [ "$ENVIRONMENT" = "development" ]; then
        if ! command -v mongod &> /dev/null; then
            log_warning "MongoDB não está instalado localmente"
        fi
    fi
    
    log_success "Dependências verificadas"
}

# Função para verificar variáveis de ambiente
check_environment_variables() {
    log "Verificando variáveis de ambiente..."
    
    # Lista de variáveis obrigatórias
    REQUIRED_VARS=(
        "MONGO_URI"
        "JWT_SECRET"
        "OPENAI_API_KEY"
        "EMAIL_API_KEY"
        "CLOUDFLARE_TURNSTILE_SECRET_KEY"
    )
    
    # Verificar se arquivo .env existe
    if [ ! -f ".env" ]; then
        log_error "Arquivo .env não encontrado"
        exit 1
    fi
    
    # Verificar variáveis obrigatórias
    for var in "${REQUIRED_VARS[@]}"; do
        if ! grep -q "^${var}=" .env; then
            log_error "Variável ${var} não encontrada no .env"
            exit 1
        fi
    done
    
    log_success "Variáveis de ambiente verificadas"
}

# Função para executar testes
run_tests() {
    log "Executando testes..."
    
    # Testes do backend
    log "Executando testes do backend..."
    cd backend
    if [ -f "package.json" ]; then
        npm test 2>&1 | tee -a "../${LOG_FILE}"
        if [ ${PIPESTATUS[0]} -ne 0 ]; then
            log_error "Testes do backend falharam"
            exit 1
        fi
    fi
    cd ..
    
    # Testes do frontend
    log "Executando testes do frontend..."
    cd frontend
    if [ -f "package.json" ]; then
        npm test -- --coverage --watchAll=false 2>&1 | tee -a "../${LOG_FILE}"
        if [ ${PIPESTATUS[0]} -ne 0 ]; then
            log_error "Testes do frontend falharam"
            exit 1
        fi
    fi
    cd ..
    
    # Testes automatizados
    log "Executando testes automatizados..."
    if [ -f "scripts/test-automation.js" ]; then
        node scripts/test-automation.js 2>&1 | tee -a "${LOG_FILE}"
        if [ ${PIPESTATUS[0]} -ne 0 ]; then
            log_error "Testes automatizados falharam"
            exit 1
        fi
    fi
    
    log_success "Todos os testes passaram"
}

# Função para fazer backup
create_backup() {
    log "Criando backup..."
    
    # Criar diretório de backup
    mkdir -p "$BACKUP_DIR"
    
    # Backup do banco de dados (se MongoDB local)
    if [ "$ENVIRONMENT" = "development" ] && command -v mongodump &> /dev/null; then
        log "Fazendo backup do banco de dados..."
        mongodump --out "$BACKUP_DIR/mongodb" 2>&1 | tee -a "${LOG_FILE}"
    fi
    
    # Backup dos arquivos de configuração
    log "Fazendo backup dos arquivos de configuração..."
    cp -r backend/src/config "$BACKUP_DIR/" 2>/dev/null || true
    cp -r frontend/src/config "$BACKUP_DIR/" 2>/dev/null || true
    cp .env "$BACKUP_DIR/" 2>/dev/null || true
    
    log_success "Backup criado em $BACKUP_DIR"
}

# Função para instalar dependências
install_dependencies() {
    log "Instalando dependências..."
    
    # Backend
    log "Instalando dependências do backend..."
    cd backend
    npm ci --production 2>&1 | tee -a "../${LOG_FILE}"
    cd ..
    
    # Frontend
    log "Instalando dependências do frontend..."
    cd frontend
    npm ci 2>&1 | tee -a "../${LOG_FILE}"
    cd ..
    
    log_success "Dependências instaladas"
}

# Função para build
build_application() {
    log "Fazendo build da aplicação..."
    
    # Build do frontend
    log "Fazendo build do frontend..."
    cd frontend
    npm run build 2>&1 | tee -a "../${LOG_FILE}"
    if [ ${PIPESTATUS[0]} -ne 0 ]; then
        log_error "Build do frontend falhou"
        exit 1
    fi
    cd ..
    
    # Build do backend (se necessário)
    log "Verificando build do backend..."
    cd backend
    if [ -f "package.json" ] && grep -q '"build"' package.json; then
        npm run build 2>&1 | tee -a "../${LOG_FILE}"
        if [ ${PIPESTATUS[0]} -ne 0 ]; then
            log_error "Build do backend falhou"
            exit 1
        fi
    fi
    cd ..
    
    log_success "Build concluído"
}

# Função para deploy
deploy_application() {
    log "Fazendo deploy da aplicação..."
    
    # Parar serviços existentes
    log "Parando serviços existentes..."
    pm2 stop agroisync-backend 2>/dev/null || true
    pm2 stop agroisync-frontend 2>/dev/null || true
    
    # Iniciar backend
    log "Iniciando backend..."
    cd backend
    pm2 start ecosystem.config.js --env $ENVIRONMENT 2>&1 | tee -a "../${LOG_FILE}"
    cd ..
    
    # Iniciar frontend (se necessário)
    log "Iniciando frontend..."
    cd frontend
    pm2 start ecosystem.config.js --env $ENVIRONMENT 2>&1 | tee -a "../${LOG_FILE}"
    cd ..
    
    # Verificar status
    log "Verificando status dos serviços..."
    pm2 status
    
    log_success "Deploy concluído"
}

# Função para verificar saúde da aplicação
health_check() {
    log "Verificando saúde da aplicação..."
    
    # Aguardar serviços iniciarem
    sleep 10
    
    # Verificar backend
    log "Verificando backend..."
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        log_success "Backend está funcionando"
    else
        log_error "Backend não está respondendo"
        exit 1
    fi
    
    # Verificar frontend
    log "Verificando frontend..."
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log_success "Frontend está funcionando"
    else
        log_error "Frontend não está respondendo"
        exit 1
    fi
    
    log_success "Aplicação está saudável"
}

# Função para limpeza
cleanup() {
    log "Limpando arquivos temporários..."
    
    # Limpar node_modules se solicitado
    if [ "$2" = "--clean" ]; then
        log "Removendo node_modules..."
        rm -rf backend/node_modules
        rm -rf frontend/node_modules
    fi
    
    # Limpar logs antigos
    find . -name "*.log" -mtime +7 -delete 2>/dev/null || true
    
    log_success "Limpeza concluída"
}

# Função para rollback
rollback() {
    log "Fazendo rollback..."
    
    # Parar serviços
    pm2 stop agroisync-backend
    pm2 stop agroisync-frontend
    
    # Restaurar backup mais recente
    LATEST_BACKUP=$(ls -t backups/ | head -n1)
    if [ -n "$LATEST_BACKUP" ]; then
        log "Restaurando backup: $LATEST_BACKUP"
        cp -r "backups/$LATEST_BACKUP"/* ./
        
        # Reiniciar serviços
        pm2 start ecosystem.config.js --env $ENVIRONMENT
        
        log_success "Rollback concluído"
    else
        log_error "Nenhum backup encontrado para rollback"
        exit 1
    fi
}

# Função principal
main() {
    log "🚀 Iniciando deploy do AGROISYNC"
    log "Ambiente: $ENVIRONMENT"
    log "Log: $LOG_FILE"
    
    # Verificar argumentos
    case "$2" in
        "rollback")
            rollback
            exit 0
            ;;
        "clean")
            cleanup "$@"
            exit 0
            ;;
    esac
    
    # Executar pipeline de deploy
    check_dependencies
    check_environment_variables
    run_tests
    create_backup
    install_dependencies
    build_application
    deploy_application
    health_check
    
    log_success "🎉 Deploy concluído com sucesso!"
    log "Aplicação disponível em:"
    log "  Backend: http://localhost:3001"
    log "  Frontend: http://localhost:3000"
    log "  API Docs: http://localhost:3001/api-docs"
}

# Executar função principal
main "$@"
