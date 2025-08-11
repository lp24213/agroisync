#!/bin/bash

# 🔍 AGROTM - Script de Verificação de Status AWS Amplify
# Verifica status completo dos domínios, certificados e aplicação

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
HOSTED_ZONE_ID="Z1014720F19TBNCSVRC1"
REGION="us-east-2"
AMPLIFY_APP_ID="d2d5j98tau5snm"
DOMAIN="agrotmsol.com.br"
CLOUDFRONT="d3cg8n66fpfnfp.cloudfront.net"
ACM_VALIDATION_NAME="_3978cce7ded379adc6cc9704bdff5269.agrotmsol.com.br"

# Contadores
SUCCESS_COUNT=0
ERROR_COUNT=0
WARNING_COUNT=0

# Função para log
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((SUCCESS_COUNT++))
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    ((ERROR_COUNT++))
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNING_COUNT++))
}

log_info() {
    echo -e "${PURPLE}ℹ️  $1${NC}"
}

log_step() {
    echo -e "${CYAN}🔍 $1${NC}"
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

# Função para verificar status do domínio no Amplify
check_amplify_domain_status() {
    log_step "1️⃣ Verificando status do domínio no Amplify..."
    
    if aws amplify get-domain-association \
        --app-id "$AMPLIFY_APP_ID" \
        --domain-name "$DOMAIN" \
        --region "$REGION" &> /dev/null; then
        
        # Obter status detalhado
        DOMAIN_STATUS=$(aws amplify get-domain-association \
            --app-id "$AMPLIFY_APP_ID" \
            --domain-name "$DOMAIN" \
            --region "$REGION" \
            --query 'domainAssociation.domainStatus' \
            --output text)
        
        SUBDOMAIN_STATUS=$(aws amplify get-domain-association \
            --app-id "$AMPLIFY_APP_ID" \
            --domain-name "$DOMAIN" \
            --region "$REGION" \
            --query 'domainAssociation.subDomains[0].status' \
            --output text)
        
        log_info "Status do domínio: $DOMAIN_STATUS"
        log_info "Status do subdomínio: $SUBDOMAIN_STATUS"
        
        if [ "$DOMAIN_STATUS" = "AVAILABLE" ] && [ "$SUBDOMAIN_STATUS" = "AVAILABLE" ]; then
            log_success "Domínio Amplify: Disponível e funcionando!"
        elif [ "$DOMAIN_STATUS" = "PENDING_VERIFICATION" ]; then
            log_warning "Domínio Amplify: Aguardando verificação DNS"
        elif [ "$DOMAIN_STATUS" = "PENDING_DEPLOYMENT" ]; then
            log_warning "Domínio Amplify: Aguardando deploy"
        else
            log_error "Domínio Amplify: Status desconhecido ($DOMAIN_STATUS)"
        fi
    else
        log_error "Não foi possível obter status do domínio no Amplify"
    fi
}

# Função para verificação DNS
check_dns_resolution() {
    log_step "2️⃣ Verificando resolução DNS..."
    
    echo ""
    echo "🔍 VERIFICAÇÃO DNS:"
    echo "=================="
    
    # Verificar domínio principal
    if nslookup "$DOMAIN" &> /dev/null; then
        CURRENT_MAIN=$(nslookup "$DOMAIN" | grep "canonical name" | awk '{print $NF}')
        if [ "$CURRENT_MAIN" = "$CLOUDFRONT" ]; then
            log_success "Domínio principal ($DOMAIN) → $CURRENT_MAIN"
        else
            log_warning "Domínio principal ($DOMAIN) → $CURRENT_MAIN (esperado: $CLOUDFRONT)"
        fi
    else
        log_error "Domínio principal ($DOMAIN) → Não resolve"
    fi
    
    # Verificar subdomínio www
    if nslookup "www.$DOMAIN" &> /dev/null; then
        CURRENT_WWW=$(nslookup "www.$DOMAIN" | grep "canonical name" | awk '{print $NF}')
        if [ "$CURRENT_WWW" = "$CLOUDFRONT" ]; then
            log_success "Subdomínio www (www.$DOMAIN) → $CURRENT_WWW"
        else
            log_warning "Subdomínio www (www.$DOMAIN) → $CURRENT_WWW (esperado: $CLOUDFRONT)"
        fi
    else
        log_error "Subdomínio www (www.$DOMAIN) → Não resolve"
    fi
    
    # Verificar registro de validação ACM
    if nslookup "$ACM_VALIDATION_NAME" &> /dev/null; then
        CURRENT_ACM=$(nslookup "$ACM_VALIDATION_NAME" | grep "canonical name" | awk '{print $NF}')
        log_info "Validação ACM ($ACM_VALIDATION_NAME) → $CURRENT_ACM"
    else
        log_warning "Registro de validação ACM não encontrado"
    fi
}

# Função para verificar status do certificado SSL
check_ssl_certificate() {
    log_step "3️⃣ Verificando status do certificado SSL..."
    
    # Verificar certificados ACM na região us-east-1 (global)
    if aws acm list-certificates --region us-east-1 --query 'CertificateSummaryList[?DomainName==`'"$DOMAIN"'`]' --output text &> /dev/null; then
        CERT_ARN=$(aws acm list-certificates --region us-east-1 --query 'CertificateSummaryList[?DomainName==`'"$DOMAIN"'`].CertificateArn' --output text)
        
        if [ -n "$CERT_ARN" ]; then
            log_success "Certificado encontrado: $CERT_ARN"
            
            # Obter status detalhado do certificado
            CERT_STATUS=$(aws acm describe-certificate --region us-east-1 --certificate-arn "$CERT_ARN" --query 'Certificate.Status' --output text)
            log_info "Status do certificado: $CERT_STATUS"
            
            if [ "$CERT_STATUS" = "ISSUED" ]; then
                log_success "Certificado SSL: Válido e emitido!"
            elif [ "$CERT_STATUS" = "PENDING_VALIDATION" ]; then
                log_warning "Certificado SSL: Aguardando validação DNS"
            elif [ "$CERT_STATUS" = "FAILED" ]; then
                log_error "Certificado SSL: Falha na validação"
            else
                log_warning "Certificado SSL: Status desconhecido ($CERT_STATUS)"
            fi
        else
            log_warning "Nenhum certificado encontrado para o domínio"
        fi
    else
        log_warning "Não foi possível verificar certificados ACM"
    fi
}

# Função para teste HTTP das URLs
test_http_urls() {
    log_step "4️⃣ Testando conectividade HTTP..."
    
    echo ""
    echo "🌐 TESTE DE CONECTIVIDADE:"
    echo "==========================="
    
    # Testar domínio principal
    log_info "Testando https://$DOMAIN..."
    if curl -I "https://$DOMAIN" --max-time 10 --silent &> /dev/null; then
        HTTP_CODE=$(curl -I "https://$DOMAIN" --max-time 10 --silent -w "%{http_code}" -o /dev/null)
        if [ "$HTTP_CODE" = "200" ]; then
            log_success "Domínio principal: HTTP $HTTP_CODE - Funcionando!"
        else
            log_warning "Domínio principal: HTTP $HTTP_CODE - Responde mas com status diferente"
        fi
    else
        log_error "Domínio principal: Não responde ou timeout"
    fi
    
    # Testar subdomínio www
    log_info "Testando https://www.$DOMAIN..."
    if curl -I "https://www.$DOMAIN" --max-time 10 --silent &> /dev/null; then
        HTTP_CODE=$(curl -I "https://www.$DOMAIN" --max-time 10 --silent -w "%{http_code}" -o /dev/null)
        if [ "$HTTP_CODE" = "200" ]; then
            log_success "Subdomínio www: HTTP $HTTP_CODE - Funcionando!"
        else
            log_warning "Subdomínio www: HTTP $HTTP_CODE - Responde mas com status diferente"
        fi
    else
        log_error "Subdomínio www: Não responde ou timeout"
    fi
    
    # Testar subdomínio app
    log_info "Testando https://app.$DOMAIN..."
    if curl -I "https://app.$DOMAIN" --max-time 10 --silent &> /dev/null; then
        HTTP_CODE=$(curl -I "https://app.$DOMAIN" --max-time 10 --silent -w "%{http_code}" -o /dev/null)
        if [ "$HTTP_CODE" = "200" ]; then
            log_success "Subdomínio app: HTTP $HTTP_CODE - Funcionando!"
        else
            log_warning "Subdomínio app: HTTP $HTTP_CODE - Responde mas com status diferente"
        fi
    else
        log_error "Subdomínio app: Não responde ou timeout"
    fi
}

# Função para verificar status do build mais recente
check_latest_build() {
    log_step "5️⃣ Verificando status do build mais recente..."
    
    if aws amplify list-jobs --app-id "$AMPLIFY_APP_ID" --branch-name main --region "$REGION" --max-items 1 &> /dev/null; then
        LATEST_JOB_ID=$(aws amplify list-jobs --app-id "$AMPLIFY_APP_ID" --branch-name main --region "$REGION" --max-items 1 --query 'jobSummaries[0].jobId' --output text)
        
        if [ "$LATEST_JOB_ID" != "None" ] && [ -n "$LATEST_JOB_ID" ]; then
            log_info "Job ID mais recente: $LATEST_JOB_ID"
            
            # Obter status do job
            JOB_STATUS=$(aws amplify get-job --app-id "$AMPLIFY_APP_ID" --branch-name main --job-id "$LATEST_JOB_ID" --region "$REGION" --query 'job.summary.status' --output text)
            log_info "Status do job: $JOB_STATUS"
            
            if [ "$JOB_STATUS" = "SUCCEED" ]; then
                log_success "Build mais recente: Sucesso!"
            elif [ "$JOB_STATUS" = "FAILED" ]; then
                log_error "Build mais recente: Falhou!"
            elif [ "$JOB_STATUS" = "RUNNING" ]; then
                log_warning "Build mais recente: Em execução"
            else
                log_warning "Build mais recente: Status desconhecido ($JOB_STATUS)"
            fi
        else
            log_warning "Nenhum job encontrado"
        fi
    else
        log_warning "Não foi possível verificar jobs do Amplify"
    fi
}

# Função para mostrar resumo
show_summary() {
    echo ""
    echo "📊 RESUMO DA VERIFICAÇÃO:"
    echo "=========================="
    echo "  ✅ Sucessos: $SUCCESS_COUNT"
    echo "  ❌ Erros: $ERROR_COUNT"
    echo "  ⚠️  Avisos: $WARNING_COUNT"
    echo ""
    
    if [ $ERROR_COUNT -eq 0 ] && [ $WARNING_COUNT -eq 0 ]; then
        log_success "Tudo funcionando perfeitamente! 🎉"
        echo ""
        echo "🌐 URLs funcionando:"
        echo "  ✅ https://$DOMAIN"
        echo "  ✅ https://www.$DOMAIN"
        echo "  ✅ https://app.$DOMAIN"
    elif [ $ERROR_COUNT -eq 0 ]; then
        log_warning "Alguns avisos, mas sem erros críticos"
        echo ""
        echo "🔧 AÇÕES RECOMENDADAS:"
        echo "1. Aguarde propagação completa do DNS (5-10 minutos)"
        echo "2. Execute novamente: ./verify-amplify-status.sh"
    else
        log_error "Encontrados erros que precisam ser corrigidos"
        echo ""
        echo "🔧 AÇÕES RECOMENDADAS:"
        echo "1. Execute: ./fix-amplify-dns.sh"
        echo "2. Aguarde propagação DNS (5-10 minutos)"
        echo "3. Execute novamente: ./verify-amplify-status.sh"
    fi
}

# Função principal
main() {
    echo ""
    echo "🔍 AGROTM - VERIFICAÇÃO COMPLETA DE STATUS AWS AMPLIFY"
    echo "======================================================"
    echo "📋 Configurações:"
    echo "  Hosted Zone ID: $HOSTED_ZONE_ID"
    echo "  Região: $REGION"
    echo "  App ID: $AMPLIFY_APP_ID"
    echo "  Domínio: $DOMAIN"
    echo "  CloudFront: $CLOUDFRONT"
    echo ""
    
    # Verificações iniciais
    check_aws_config
    
    echo ""
    echo "🔍 INICIANDO VERIFICAÇÕES..."
    echo "============================="
    
    # Executar verificações
    check_amplify_domain_status
    check_dns_resolution
    check_ssl_certificate
    test_http_urls
    check_latest_build
    
    # Mostrar resumo
    show_summary
}

# Executar função principal
main "$@"
