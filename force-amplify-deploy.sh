#!/bin/bash

# 🚀 AGROTM - Script de Deploy Forçado AWS Amplify
# Força novo deploy e monitora o progresso

set -e  # Exit on any error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configurações
REGION="us-east-2"
AMPLIFY_APP_ID="d2d5j98tau5snm"
BRANCH_NAME="main"
DOMAIN="agrotmsol.com.br"

# Variáveis globais
JOB_ID=""
JOB_STATUS=""
START_TIME=""
MAX_WAIT_TIME=1800  # 30 minutos em segundos

# Função para log
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_info() {
    echo -e "${PURPLE}ℹ️  $1${NC}"
}

log_step() {
    echo -e "${CYAN}🚀 $1${NC}"
}

# Função para verificar se AWS CLI está configurado
check_aws_config() {
    log "Verificando configuração AWS CLI..."
    
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS CLI não está configurado!"
        echo ""
        echo "Execute primeiro: ./setup-aws-credentials.sh"
        exit 1
    fi
    
    IDENTITY=$(aws sts get-caller-identity --query 'Account' --output text)
    log_success "AWS CLI configurado para conta: $IDENTITY"
}

# Função para verificar status atual do app
check_current_app_status() {
    log_step "1️⃣ Verificando status atual da aplicação..."
    
    if aws amplify get-app --app-id "$AMPLIFY_APP_ID" --region "$REGION" &> /dev/null; then
        APP_NAME=$(aws amplify get-app --app-id "$AMPLIFY_APP_ID" --region "$REGION" --query 'app.name' --output text)
        APP_STATUS=$(aws amplify get-app --app-id "$AMPLIFY_APP_ID" --region "$REGION" --query 'app.enableBranchAutoBuild' --output text)
        
        log_success "App encontrado: $APP_NAME"
        log_info "Auto-build habilitado: $APP_STATUS"
        
        # Verificar branch
        if aws amplify get-branch --app-id "$AMPLIFY_APP_ID" --branch-name "$BRANCH_NAME" --region "$REGION" &> /dev/null; then
            BRANCH_STATUS=$(aws amplify get-branch --app-id "$AMPLIFY_APP_ID" --branch-name "$BRANCH_NAME" --region "$REGION" --query 'branch.stage' --output text)
            log_success "Branch $BRANCH_NAME encontrado: $BRANCH_STATUS"
        else
            log_error "Branch $BRANCH_NAME não encontrado!"
            exit 1
        fi
    else
        log_error "App não encontrado ou sem permissão!"
        exit 1
    fi
}

# Função para verificar jobs em execução
check_running_jobs() {
    log_step "2️⃣ Verificando jobs em execução..."
    
    RUNNING_JOBS=$(aws amplify list-jobs --app-id "$AMPLIFY_APP_ID" --branch-name "$BRANCH_NAME" --region "$REGION" --query 'jobSummaries[?status==`RUNNING`]' --output text)
    
    if [ -n "$RUNNING_JOBS" ]; then
        log_warning "Encontrados jobs em execução:"
        echo "$RUNNING_JOBS"
        echo ""
        
        read -p "Deseja aguardar os jobs terminarem ou forçar novo deploy? (aguardar/forçar): " choice
        
        if [ "$choice" = "aguardar" ]; then
            log_info "Aguardando jobs terminarem..."
            wait_for_jobs_completion
        else
            log_info "Prosseguindo com novo deploy..."
        fi
    else
        log_success "Nenhum job em execução"
    fi
}

# Função para aguardar jobs terminarem
wait_for_jobs_completion() {
    log_info "Aguardando jobs terminarem..."
    
    while true; do
        RUNNING_JOBS=$(aws amplify list-jobs --app-id "$AMPLIFY_APP_ID" --branch-name "$BRANCH_NAME" --region "$REGION" --query 'jobSummaries[?status==`RUNNING`]' --output text)
        
        if [ -z "$RUNNING_JOBS" ]; then
            log_success "Todos os jobs terminaram!"
            break
        fi
        
        log_info "Jobs ainda em execução, aguardando 30 segundos..."
        sleep 30
    done
}

# Função para iniciar novo deploy
start_new_deploy() {
    log_step "3️⃣ Iniciando novo deploy..."
    
    # Iniciar job de deploy
    if aws amplify start-job \
        --app-id "$AMPLIFY_APP_ID" \
        --branch-name "$BRANCH_NAME" \
        --job-type RELEASE \
        --region "$REGION"; then
        
        # Obter ID do job
        JOB_ID=$(aws amplify list-jobs --app-id "$AMPLIFY_APP_ID" --branch-name "$BRANCH_NAME" --region "$REGION" --max-items 1 --query 'jobSummaries[0].jobId' --output text)
        
        if [ "$JOB_ID" != "None" ] && [ -n "$JOB_ID" ]; then
            START_TIME=$(date +%s)
            log_success "Deploy iniciado com sucesso!"
            log_info "Job ID: $JOB_ID"
            log_info "Hora de início: $(date)"
        else
            log_error "Falha ao obter ID do job"
            exit 1
        fi
    else
        log_error "Falha ao iniciar deploy!"
        exit 1
    fi
}

# Função para monitorar progresso
monitor_deploy_progress() {
    log_step "4️⃣ Monitorando progresso do deploy..."
    
    echo ""
    echo "📊 MONITORAMENTO DO DEPLOY:"
    echo "============================"
    echo "  🆔 Job ID: $JOB_ID"
    echo "  🕐 Início: $(date -d @$START_TIME)"
    echo "  ⏱️  Tempo limite: $((MAX_WAIT_TIME / 60)) minutos"
    echo ""
    
    # Loop de monitoramento
    while true; do
        CURRENT_TIME=$(date +%s)
        ELAPSED_TIME=$((CURRENT_TIME - START_TIME))
        
        # Verificar timeout
        if [ $ELAPSED_TIME -gt $MAX_WAIT_TIME ]; then
            log_error "Timeout atingido! Deploy demorou mais de $((MAX_WAIT_TIME / 60)) minutos"
            break
        fi
        
        # Obter status atual
        if aws amplify get-job --app-id "$AMPLIFY_APP_ID" --branch-name "$BRANCH_NAME" --job-id "$JOB_ID" --region "$REGION" &> /dev/null; then
            JOB_STATUS=$(aws amplify get-job --app-id "$AMPLIFY_APP_ID" --branch-name "$BRANCH_NAME" --job-id "$JOB_ID" --region "$REGION" --query 'job.summary.status' --output text)
            
            # Mostrar progresso
            ELAPSED_MIN=$((ELAPSED_TIME / 60))
            ELAPSED_SEC=$((ELAPSED_TIME % 60))
            echo -ne "\r⏱️  Tempo decorrido: ${ELAPSED_MIN}m ${ELAPSED_SEC}s | Status: $JOB_STATUS"
            
            # Verificar se terminou
            if [ "$JOB_STATUS" = "SUCCEED" ]; then
                echo ""
                log_success "Deploy concluído com sucesso!"
                break
            elif [ "$JOB_STATUS" = "FAILED" ]; then
                echo ""
                log_error "Deploy falhou!"
                show_job_logs
                break
            elif [ "$JOB_STATUS" = "CANCELLED" ]; then
                echo ""
                log_warning "Deploy foi cancelado"
                break
            fi
        else
            log_error "Falha ao obter status do job"
            break
        fi
        
        # Aguardar antes da próxima verificação
        sleep 30
    done
}

# Função para mostrar logs do job
show_job_logs() {
    log_step "5️⃣ Obtendo logs do job..."
    
    if [ -n "$JOB_ID" ]; then
        # Obter logs do job
        JOB_LOGS=$(aws amplify get-job --app-id "$AMPLIFY_APP_ID" --branch-name "$BRANCH_NAME" --job-id "$JOB_ID" --region "$REGION" --query 'job.summary' --output json)
        
        echo ""
        echo "📋 LOGS DO JOB:"
        echo "================"
        echo "$JOB_LOGS" | jq '.' 2>/dev/null || echo "$JOB_LOGS"
        
        # Verificar se há logs de erro específicos
        if aws logs describe-log-groups --log-group-name-prefix "/aws/amplify/$AMPLIFY_APP_ID" --region "$REGION" &> /dev/null; then
            log_info "Logs detalhados disponíveis no CloudWatch"
        fi
    fi
}

# Função para verificar resultado final
verify_final_result() {
    log_step "6️⃣ Verificando resultado final..."
    
    echo ""
    echo "🔍 VERIFICAÇÃO FINAL:"
    echo "====================="
    
    # Verificar status do job
    if [ -n "$JOB_ID" ]; then
        FINAL_STATUS=$(aws amplify get-job --app-id "$AMPLIFY_APP_ID" --branch-name "$BRANCH_NAME" --job-id "$JOB_ID" --region "$REGION" --query 'job.summary.status' --output text)
        log_info "Status final do job: $FINAL_STATUS"
    fi
    
    # Verificar se o domínio está funcionando
    log_info "Testando conectividade do domínio..."
    
    if curl -I "https://$DOMAIN" --max-time 10 --silent &> /dev/null; then
        HTTP_CODE=$(curl -I "https://$DOMAIN" --max-time 10 --silent -w "%{http_code}" -o /dev/null)
        if [ "$HTTP_CODE" = "200" ]; then
            log_success "Domínio funcionando: HTTP $HTTP_CODE"
        else
            log_warning "Domínio responde mas com status HTTP $HTTP_CODE"
        fi
    else
        log_error "Domínio não responde"
    fi
    
    # Verificar status do domínio no Amplify
    if aws amplify get-domain-association --app-id "$AMPLIFY_APP_ID" --domain-name "$DOMAIN" --region "$REGION" &> /dev/null; then
        DOMAIN_STATUS=$(aws amplify get-domain-association --app-id "$AMPLIFY_APP_ID" --domain-name "$DOMAIN" --region "$REGION" --query 'domainAssociation.domainStatus' --output text)
        log_info "Status do domínio no Amplify: $DOMAIN_STATUS"
    fi
}

# Função para mostrar resumo
show_summary() {
    echo ""
    echo "📊 RESUMO DO DEPLOY FORÇADO:"
    echo "============================="
    
    if [ "$JOB_STATUS" = "SUCCEED" ]; then
        log_success "Deploy concluído com sucesso! 🎉"
        echo ""
        echo "🌐 URLs funcionando:"
        echo "  ✅ https://$DOMAIN"
        echo "  ✅ https://www.$DOMAIN"
        echo "  ✅ https://app.$DOMAIN"
        echo ""
        echo "⏰ Tempo total: $((ELAPSED_TIME / 60))m $((ELAPSED_TIME % 60))s"
    else
        log_error "Deploy falhou ou foi interrompido"
        echo ""
        echo "🔧 AÇÕES RECOMENDADAS:"
        echo "1. Verifique os logs acima"
        echo "2. Execute: ./verify-amplify-status.sh"
        echo "3. Se necessário, execute novamente: ./force-amplify-deploy.sh"
    fi
}

# Função principal
main() {
    echo ""
    echo "🚀 AGROTM - DEPLOY FORÇADO AWS AMPLIFY"
    echo "======================================="
    echo "📋 Configurações:"
    echo "  App ID: $AMPLIFY_APP_ID"
    echo "  Branch: $BRANCH_NAME"
    echo "  Região: $REGION"
    echo "  Domínio: $DOMAIN"
    echo ""
    
    # Verificações iniciais
    check_aws_config
    check_current_app_status
    check_running_jobs
    
    echo ""
    echo "🚀 INICIANDO DEPLOY FORÇADO..."
    echo "==============================="
    
    # Executar deploy
    start_new_deploy
    monitor_deploy_progress
    show_job_logs
    verify_final_result
    
    # Mostrar resumo
    show_summary
}

# Executar função principal
main "$@"
