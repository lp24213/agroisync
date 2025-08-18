#!/bin/bash

# 🔍 AGROISYNC - Script de Verificação de Status AWS Amplify
# Este script verifica o status completo da aplicação no AWS Amplify

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
APP_ID="d1234567890abc"  # Substitua pelo seu App ID
BRANCH="main"
DOMAIN="agroisync.com.br"

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Verificar se AWS CLI está instalado
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        error "AWS CLI não está instalado. Instale primeiro: https://aws.amazon.com/cli/"
        exit 1
    fi
    log "AWS CLI encontrado: $(aws --version)"
}

# Verificar se jq está instalado
check_jq() {
    if ! command -v jq &> /dev/null; then
        error "jq não está instalado. Instale primeiro: sudo apt-get install jq"
        exit 1
    fi
    log "jq encontrado: $(jq --version)"
}

# Verificar configuração AWS
check_aws_config() {
    if ! aws sts get-caller-identity &> /dev/null; then
        error "AWS não está configurado. Execute: aws configure"
        exit 1
    fi
    
    ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
    USER_ARN=$(aws sts get-caller-identity --query 'Arn' --output text)
    REGION=$(aws configure get region)
    
    log "AWS Configurado:"
    log "  Conta: $ACCOUNT_ID"
    log "  Usuário: $USER_ARN"
    log "  Região: $REGION"
}

# Verificar status da aplicação Amplify
check_app_status() {
    log "Verificando status da aplicação Amplify..."
    
    if ! aws amplify get-app --app-id $APP_ID &> /dev/null; then
        error "Aplicação com ID $APP_ID não encontrada ou sem permissão de acesso"
        exit 1
    fi
    
    APP_NAME=$(aws amplify get-app --app-id $APP_ID --query 'app.name' --output text)
    APP_STATUS=$(aws amplify get-app --app-id $APP_ID --query 'app.enableBranchAutoBuild' --output text)
    
    log "Aplicação: $APP_NAME"
    log "Status: $APP_STATUS"
}

# Verificar status da branch
check_branch_status() {
    log "Verificando status da branch $BRANCH..."
    
    if ! aws amplify get-branch --app-id $APP_ID --branch-name $BRANCH &> /dev/null; then
        error "Branch $BRANCH não encontrada"
        exit 1
    fi
    
    BRANCH_STATUS=$(aws amplify get-branch --app-id $APP_ID --branch-name $BRANCH --query 'branch.status' --output text)
    BRANCH_ENV=$(aws amplify get-branch --app-id $APP_ID --branch-name $BRANCH --query 'branch.environmentVariables' --output json)
    
    log "Status da Branch: $BRANCH_STATUS"
    log "Variáveis de Ambiente: $BRANCH_ENV"
}

# Verificar último job de build
check_last_build() {
    log "Verificando último job de build..."
    
    LAST_JOB=$(aws amplify list-jobs --app-id $APP_ID --branch-name $BRANCH --max-items 1 --query 'jobSummaries[0]' --output json)
    
    if [ "$LAST_JOB" != "null" ]; then
        JOB_ID=$(echo $LAST_JOB | jq -r '.jobId')
        JOB_STATUS=$(echo $LAST_JOB | jq -r '.status')
        JOB_TYPE=$(echo $LAST_JOB | jq -r '.jobType')
        JOB_START_TIME=$(echo $LAST_JOB | jq -r '.startTime')
        
        log "Último Job:"
        log "  ID: $JOB_ID"
        log "  Status: $JOB_STATUS"
        log "  Tipo: $JOB_TYPE"
        log "  Início: $JOB_START_TIME"
        
        # Verificar detalhes do job se estiver em execução
        if [ "$JOB_STATUS" = "RUNNING" ] || [ "$JOB_STATUS" = "PENDING" ]; then
            check_job_details $JOB_ID
        fi
    else
        warning "Nenhum job encontrado para a branch $BRANCH"
    fi
}

# Verificar detalhes de um job específico
check_job_details() {
    local job_id=$1
    log "Verificando detalhes do job $job_id..."
    
    JOB_DETAILS=$(aws amplify get-job --app-id $APP_ID --branch-name $BRANCH --job-id $job_id --output json)
    
    if [ "$JOB_DETAILS" != "null" ]; then
        JOB_STATUS=$(echo $JOB_DETAILS | jq -r '.job.status')
        JOB_STEPS=$(echo $JOB_DETAILS | jq -r '.job.steps')
        
        log "Status do Job: $JOB_STATUS"
        log "Passos do Job: $JOB_STEPS"
        
        # Verificar logs se disponível
        if [ "$JOB_STATUS" = "RUNNING" ] || [ "$JOB_STATUS" = "FAILED" ]; then
            check_job_logs $job_id
        fi
    fi
}

# Verificar logs de um job
check_job_logs() {
    local job_id=$1
    log "Verificando logs do job $job_id..."
    
    # Tentar obter logs (pode não estar disponível imediatamente)
    if aws amplify get-job --app-id $APP_ID --branch-name $BRANCH --job-id $job_id --query 'job.steps[].logUrl' --output text | grep -q "http"; then
        LOG_URLS=$(aws amplify get-job --app-id $APP_ID --branch-name $BRANCH --job-id $job_id --query 'job.steps[].logUrl' --output text)
        log "URLs dos Logs: $LOG_URLS"
    else
        info "Logs ainda não disponíveis para este job"
    fi
}

# Verificar domínio personalizado
check_custom_domain() {
    log "Verificando domínio personalizado..."
    
    DOMAINS=$(aws amplify list-domain-associations --app-id $APP_ID --output json)
    
    if [ "$DOMAINS" != "null" ] && [ "$(echo $DOMAINS | jq '.domainAssociations | length')" -gt 0 ]; then
        log "Domínios associados:"
        echo $DOMAINS | jq -r '.domainAssociations[].domainName'
        
        # Verificar status de cada domínio
        echo $DOMAINS | jq -r '.domainAssociations[] | "\(.domainName): \(.status)"'
    else
        info "Nenhum domínio personalizado configurado"
    fi
}

# Verificar certificado SSL
check_ssl_certificate() {
    log "Verificando certificado SSL..."
    
    # Verificar se o domínio tem certificado válido
    if command -v openssl &> /dev/null; then
        if openssl s_client -connect $DOMAIN:443 -servername $DOMAIN < /dev/null 2>/dev/null | openssl x509 -noout -dates &> /dev/null; then
            CERT_DATES=$(openssl s_client -connect $DOMAIN:443 -servername $DOMAIN < /dev/null 2>/dev/null | openssl x509 -noout -dates)
            log "Certificado SSL válido:"
            echo "$CERT_DATES"
        else
            warning "Não foi possível verificar o certificado SSL"
        fi
    else
        info "OpenSSL não disponível para verificação de certificado"
    fi
}

# Verificar conectividade
check_connectivity() {
    log "Verificando conectividade..."
    
    # Verificar se o domínio responde
    if command -v curl &> /dev/null; then
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN")
        if [ "$HTTP_STATUS" = "200" ]; then
            log "✅ Domínio responde com status HTTP $HTTP_STATUS"
        else
            warning "⚠️ Domínio responde com status HTTP $HTTP_STATUS"
        fi
    else
        info "curl não disponível para verificação de conectividade"
    fi
    
    # Verificar tempo de resposta
    if command -v ping &> /dev/null; then
        PING_RESULT=$(ping -c 1 $DOMAIN 2>/dev/null | grep "time=" | cut -d "=" -f4)
        if [ ! -z "$PING_RESULT" ]; then
            log "Tempo de resposta: $PING_RESULT"
        fi
    fi
}

# Verificar recursos AWS relacionados
check_aws_resources() {
    log "Verificando recursos AWS relacionados..."
    
    # Verificar CloudFront (se usado)
    if aws cloudfront list-distributions --query "DistributionList.Items[?contains(Comment, '$APP_ID')]" --output json | jq -e '.[0]' &> /dev/null; then
        CLOUDFRONT_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?contains(Comment, '$APP_ID')].Id" --output text)
        log "CloudFront Distribution: $CLOUDFRONT_ID"
    fi
    
    # Verificar S3 (se usado)
    if aws s3 ls "s3://$APP_ID" &> /dev/null; then
        log "Bucket S3 encontrado: $APP_ID"
    fi
}

# Verificar métricas de performance
check_performance() {
    log "Verificando métricas de performance..."
    
    # Verificar se CloudWatch está disponível
    if aws cloudwatch list-metrics --namespace "AWS/Amplify" --metric-name "BuildDuration" &> /dev/null; then
        log "Métricas CloudWatch disponíveis"
        
        # Tentar obter métricas recentes
        METRICS=$(aws cloudwatch get-metric-statistics \
            --namespace "AWS/Amplify" \
            --metric-name "BuildDuration" \
            --dimensions Name=AppId,Value=$APP_ID \
            --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
            --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
            --period 3600 \
            --statistics Average \
            --output json)
        
        if [ "$METRICS" != "null" ] && [ "$(echo $METRICS | jq '.Datapoints | length')" -gt 0 ]; then
            AVG_DURATION=$(echo $METRICS | jq -r '.Datapoints[0].Average')
            log "Duração média de build (última hora): ${AVG_DURATION}s"
        fi
    else
        info "Métricas CloudWatch não disponíveis"
    fi
}

# Função principal
main() {
    log "🔍 AGROISYNC - VERIFICAÇÃO COMPLETA DE STATUS AWS AMPLIFY"
    log "=========================================================="
    
    # Verificações prévias
    check_aws_cli
    check_jq
    check_aws_config
    
    log ""
    
    # Verificações principais
    check_app_status
    check_branch_status
    check_last_build
    check_custom_domain
    check_ssl_certificate
    check_connectivity
    check_aws_resources
    check_performance
    
    log ""
    log "✅ Verificação completa finalizada!"
    log "Para mais detalhes, consulte o console AWS Amplify:"
    log "https://console.aws.amazon.com/amplify/home"
}

# Executar função principal
main "$@"
