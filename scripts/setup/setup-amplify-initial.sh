#!/bin/bash

# 🚀 AGROTM - Script de Configuração Inicial AWS Amplify
# Correção completa de problemas DNS

set -e  # Exit on any error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
REGION="us-east-2"
ACCOUNT_ID="119473395465"
HOSTED_ZONE_ID="Z1014720F19TBNCSVRC1"
AMPLIFY_APP_ID="d2d5j98tau5snm"
DOMAIN="agrotmsol.com.br"
CLOUDFRONT="d3cg8n66fpfnfp.cloudfront.net"
ACM_VALIDATION_NAME="_3978cce7ded379adc6cc9704bdff5269.agrotmsol.com.br"
ACM_VALIDATION_VALUE="_83bf8471385abf31a452d69c0008d3df.xlfgrmvvlj.acm-validations.aws"

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

# Função para verificar se AWS CLI está instalado
check_aws_cli() {
    log "Verificando se AWS CLI está instalado..."
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI não está instalado. Instale primeiro:"
        echo "  curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip'"
        echo "  unzip awscliv2.zip"
        echo "  sudo ./aws/install"
        exit 1
    fi
    log_success "AWS CLI está instalado: $(aws --version)"
}

# Função para verificar configuração AWS
check_aws_config() {
    log "Verificando configuração AWS..."
    
    if ! aws sts get-caller-identity &> /dev/null; then
        log_warning "AWS CLI não está configurado. Execute setup-aws-credentials.sh primeiro."
        return 1
    fi
    
    IDENTITY=$(aws sts get-caller-identity --query 'Account' --output text)
    if [ "$IDENTITY" = "$ACCOUNT_ID" ]; then
        log_success "AWS CLI configurado para conta correta: $IDENTITY"
        return 0
    else
        log_warning "AWS CLI configurado para conta diferente: $IDENTITY (esperado: $ACCOUNT_ID)"
        return 1
    fi
}

# Função para verificar permissões
check_permissions() {
    log "Verificando permissões AWS..."
    
    # Verificar Route53
    if aws route53 list-hosted-zones --query "HostedZones[?Id=='/hostedzone/$HOSTED_ZONE_ID']" --output text | grep -q "$HOSTED_ZONE_ID"; then
        log_success "Permissão Route53: OK"
    else
        log_error "Sem permissão para acessar Route53 ou Hosted Zone não encontrada"
        return 1
    fi
    
    # Verificar Amplify
    if aws amplify get-app --app-id "$AMPLIFY_APP_ID" --region "$REGION" &> /dev/null; then
        log_success "Permissão Amplify: OK"
    else
        log_error "Sem permissão para acessar Amplify ou App não encontrado"
        return 1
    fi
    
    # Verificar ACM
    if aws acm list-certificates --region us-east-1 --query 'CertificateSummaryList[?DomainName==`'"$DOMAIN"'`]' --output text &> /dev/null; then
        log_success "Permissão ACM: OK"
    else
        log_warning "Sem permissão para acessar ACM (pode não ser necessário)"
    fi
}

# Função para verificar status atual
check_current_status() {
    log "Verificando status atual dos domínios..."
    
    echo ""
    echo "🔍 Status atual dos registros DNS:"
    echo "=================================="
    
    # Verificar domínio principal
    if nslookup "$DOMAIN" &> /dev/null; then
        CURRENT_MAIN=$(nslookup "$DOMAIN" | grep "canonical name" | awk '{print $NF}')
        log "Domínio principal ($DOMAIN) → $CURRENT_MAIN"
        
        if [ "$CURRENT_MAIN" = "$CLOUDFRONT" ]; then
            log_success "Domínio principal já está correto"
        else
            log_warning "Domínio principal precisa ser corrigido"
        fi
    else
        log_error "Não foi possível resolver domínio principal"
    fi
    
    # Verificar subdomínio www
    if nslookup "www.$DOMAIN" &> /dev/null; then
        CURRENT_WWW=$(nslookup "www.$DOMAIN" | grep "canonical name" | awk '{print $NF}')
        log "Subdomínio www (www.$DOMAIN) → $CURRENT_WWW"
        
        if [ "$CURRENT_WWW" = "$CLOUDFRONT" ]; then
            log_success "Subdomínio www já está correto"
        else
            log_warning "Subdomínio www precisa ser corrigido"
        fi
    else
        log_error "Não foi possível resolver subdomínio www"
    fi
    
    # Verificar registro de validação ACM
    if nslookup "$ACM_VALIDATION_NAME" &> /dev/null; then
        CURRENT_ACM=$(nslookup "$ACM_VALIDATION_NAME" | grep "canonical name" | awk '{print $NF}')
        log "Validação ACM ($ACM_VALIDATION_NAME) → $CURRENT_ACM"
        
        if [ "$CURRENT_ACM" = "$ACM_VALIDATION_VALUE" ]; then
            log_success "Validação ACM já está correta"
        else
            log_warning "Validação ACM precisa ser corrigida"
        fi
    else
        log_warning "Registro de validação ACM não encontrado (será criado)"
    fi
}

# Função principal
main() {
    echo ""
    echo "🚀 AGROTM - CONFIGURAÇÃO INICIAL AWS AMPLIFY"
    echo "============================================="
    echo "📋 Configurações:"
    echo "  Região: $REGION"
    echo "  Conta: $ACCOUNT_ID"
    echo "  Hosted Zone: $HOSTED_ZONE_ID"
    echo "  App ID: $AMPLIFY_APP_ID"
    echo "  Domínio: $DOMAIN"
    echo "  CloudFront: $CLOUDFRONT"
    echo ""
    
    # Verificações
    check_aws_cli
    check_aws_config
    check_permissions
    check_current_status
    
    echo ""
    echo "🎯 Próximos passos:"
    echo "1. Execute: ./fix-amplify-dns.sh"
    echo "2. Aguarde 5-10 minutos para propagação DNS"
    echo "3. Execute: ./verify-amplify-status.sh"
    echo "4. Se necessário: ./force-amplify-deploy.sh"
    echo ""
    echo "✅ Configuração inicial concluída!"
}

# Executar função principal
main "$@"
