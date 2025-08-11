#!/bin/bash

# 🚀 AGROTM - Script de Correção DNS AWS Amplify
# Corrige todos os problemas de DNS automaticamente

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
ACM_VALIDATION_VALUE="_83bf8471385abf31a452d69c0008d3df.xlfgrmvvlj.acm-validations.aws"

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
    echo -e "${CYAN}🔧 $1${NC}"
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

# Função para verificar permissões Route53
check_route53_permissions() {
    log "Verificando permissões Route53..."
    
    if aws route53 list-hosted-zones --query "HostedZones[?Id=='/hostedzone/$HOSTED_ZONE_ID']" --output text | grep -q "$HOSTED_ZONE_ID"; then
        log_success "Permissão Route53: OK"
    else
        log_error "Sem permissão para acessar Route53 ou Hosted Zone não encontrada"
        exit 1
    fi
}

# Função para criar registro de validação ACM
fix_acm_validation() {
    log_step "1️⃣ Corrigindo validação do certificado ACM..."
    
    # Criar arquivo de mudança
    cat > /tmp/acm-validation.json << EOF
{
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "$ACM_VALIDATION_NAME",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [
          {
            "Value": "$ACM_VALIDATION_VALUE"
          }
        ]
      }
    }
  ]
}
EOF
    
    # Executar mudança
    if aws route53 change-resource-record-sets \
        --hosted-zone-id "$HOSTED_ZONE_ID" \
        --change-batch file:///tmp/acm-validation.json; then
        
        log_success "Registro de validação ACM criado com sucesso!"
        
        # Aguardar propagação
        log_info "Aguardando propagação do registro ACM..."
        sleep 10
        
        # Verificar se foi criado
        if nslookup "$ACM_VALIDATION_NAME" &> /dev/null; then
            CURRENT_ACM=$(nslookup "$ACM_VALIDATION_NAME" | grep "canonical name" | awk '{print $NF}')
            if [ "$CURRENT_ACM" = "$ACM_VALIDATION_VALUE" ]; then
                log_success "Validação ACM propagada e funcionando!"
            else
                log_warning "Validação ACM criada mas ainda não propagou completamente"
            fi
        else
            log_warning "Validação ACM criada mas ainda não resolvendo"
        fi
    else
        log_error "Falha ao criar registro de validação ACM"
        return 1
    fi
    
    # Limpar arquivo temporário
    rm -f /tmp/acm-validation.json
}

# Função para corrigir domínio principal
fix_main_domain() {
    log_step "2️⃣ Corrigindo domínio principal..."
    
    # Criar arquivo de mudança
    cat > /tmp/main-domain.json << EOF
{
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "$DOMAIN",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [
          {
            "Value": "$CLOUDFRONT"
          }
        ]
      }
    }
  ]
}
EOF
    
    # Executar mudança
    if aws route53 change-resource-record-sets \
        --hosted-zone-id "$HOSTED_ZONE_ID" \
        --change-batch file:///tmp/main-domain.json; then
        
        log_success "Domínio principal corrigido com sucesso!"
        
        # Aguardar propagação
        log_info "Aguardando propagação do domínio principal..."
        sleep 10
        
        # Verificar se foi corrigido
        if nslookup "$DOMAIN" &> /dev/null; then
            CURRENT_MAIN=$(nslookup "$DOMAIN" | grep "canonical name" | awk '{print $NF}')
            if [ "$CURRENT_MAIN" = "$CLOUDFRONT" ]; then
                log_success "Domínio principal propagado e funcionando!"
            else
                log_warning "Domínio principal corrigido mas ainda não propagou completamente"
            fi
        else
            log_warning "Domínio principal corrigido mas ainda não resolvendo"
        fi
    else
        log_error "Falha ao corrigir domínio principal"
        return 1
    fi
    
    # Limpar arquivo temporário
    rm -f /tmp/main-domain.json
}

# Função para corrigir subdomínio www
fix_www_domain() {
    log_step "3️⃣ Corrigindo subdomínio www..."
    
    # Criar arquivo de mudança
    cat > /tmp/www-domain.json << EOF
{
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "www.$DOMAIN",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [
          {
            "Value": "$CLOUDFRONT"
          }
        ]
      }
    }
  ]
}
EOF
    
    # Executar mudança
    if aws route53 change-resource-record-sets \
        --hosted-zone-id "$HOSTED_ZONE_ID" \
        --change-batch file:///tmp/www-domain.json; then
        
        log_success "Subdomínio www corrigido com sucesso!"
        
        # Aguardar propagação
        log_info "Aguardando propagação do subdomínio www..."
        sleep 10
        
        # Verificar se foi corrigido
        if nslookup "www.$DOMAIN" &> /dev/null; then
            CURRENT_WWW=$(nslookup "www.$DOMAIN" | grep "canonical name" | awk '{print $NF}')
            if [ "$CURRENT_WWW" = "$CLOUDFRONT" ]; then
                log_success "Subdomínio www propagado e funcionando!"
            else
                log_warning "Subdomínio www corrigido mas ainda não propagou completamente"
            fi
        else
            log_warning "Subdomínio www corrigido mas ainda não resolvendo"
        fi
    else
        log_error "Falha ao corrigir subdomínio www"
        return 1
    fi
    
    # Limpar arquivo temporário
    rm -f /tmp/www-domain.json
}

# Função para verificar status final
verify_final_status() {
    log_step "4️⃣ Verificando status final dos registros..."
    
    echo ""
    echo "🔍 STATUS FINAL DOS REGISTROS DNS:"
    echo "=================================="
    
    # Verificar domínio principal
    if nslookup "$DOMAIN" &> /dev/null; then
        CURRENT_MAIN=$(nslookup "$DOMAIN" | grep "canonical name" | awk '{print $NF}')
        if [ "$CURRENT_MAIN" = "$CLOUDFRONT" ]; then
            log_success "Domínio principal ($DOMAIN) → $CURRENT_MAIN"
        else
            log_warning "Domínio principal ($DOMAIN) → $CURRENT_MAIN (ainda propagando)"
        fi
    else
        log_error "Domínio principal não está resolvendo"
    fi
    
    # Verificar subdomínio www
    if nslookup "www.$DOMAIN" &> /dev/null; then
        CURRENT_WWW=$(nslookup "www.$DOMAIN" | grep "canonical name" | awk '{print $NF}')
        if [ "$CURRENT_WWW" = "$CLOUDFRONT" ]; then
            log_success "Subdomínio www (www.$DOMAIN) → $CURRENT_WWW"
        else
            log_warning "Subdomínio www (www.$DOMAIN) → $CURRENT_WWW (ainda propagando)"
        fi
    else
        log_error "Subdomínio www não está resolvendo"
    fi
    
    # Verificar registro de validação ACM
    if nslookup "$ACM_VALIDATION_NAME" &> /dev/null; then
        CURRENT_ACM=$(nslookup "$ACM_VALIDATION_NAME" | grep "canonical name" | awk '{print $NF}')
        if [ "$CURRENT_ACM" = "$ACM_VALIDATION_VALUE" ]; then
            log_success "Validação ACM ($ACM_VALIDATION_NAME) → $CURRENT_ACM"
        else
            log_warning "Validação ACM ($ACM_VALIDATION_NAME) → $CURRENT_ACM (ainda propagando)"
        fi
    else
        log_error "Registro de validação ACM não está resolvendo"
    fi
}

# Função para mostrar resumo
show_summary() {
    echo ""
    echo "📊 RESUMO DA CORREÇÃO DNS:"
    echo "==========================="
    echo "  ✅ Sucessos: $SUCCESS_COUNT"
    echo "  ❌ Erros: $ERROR_COUNT"
    echo "  ⚠️  Avisos: $WARNING_COUNT"
    echo ""
    
    if [ $ERROR_COUNT -eq 0 ]; then
        log_success "Todas as correções DNS foram aplicadas com sucesso!"
        echo ""
        echo "🎯 PRÓXIMOS PASSOS:"
        echo "1. Aguarde 5-10 minutos para propagação completa do DNS"
        echo "2. Execute: ./verify-amplify-status.sh"
        echo "3. Se necessário: ./force-amplify-deploy.sh"
        echo ""
        echo "⏰ TEMPO ESTIMADO PARA FUNCIONAMENTO: 15-20 minutos"
    else
        log_error "Algumas correções falharam. Verifique os logs acima."
        echo ""
        echo "🔧 AÇÕES RECOMENDADAS:"
        echo "1. Verifique as permissões AWS"
        echo "2. Execute novamente: ./fix-amplify-dns.sh"
        echo "3. Se persistir, execute: ./setup-aws-credentials.sh"
    fi
}

# Função principal
main() {
    echo ""
    echo "🚀 AGROTM - CORREÇÃO COMPLETA DE DNS AWS AMPLIFY"
    echo "================================================="
    echo "📋 Configurações:"
    echo "  Hosted Zone ID: $HOSTED_ZONE_ID"
    echo "  Região: $REGION"
    echo "  App ID: $AMPLIFY_APP_ID"
    echo "  Domínio: $DOMAIN"
    echo "  CloudFront: $CLOUDFRONT"
    echo ""
    
    # Verificações iniciais
    check_aws_config
    check_route53_permissions
    
    echo ""
    echo "🔧 INICIANDO CORREÇÕES DNS..."
    echo "=============================="
    
    # Executar correções
    fix_acm_validation
    fix_main_domain
    fix_www_domain
    
    # Verificar status final
    verify_final_status
    
    # Mostrar resumo
    show_summary
}

# Executar função principal
main "$@"
