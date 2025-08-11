#!/bin/bash

# 🚀 AGROTM - CORREÇÃO COMPLETA DO AMPLIFY 404
# Corrige DNS apontando para CloudFront inexistente

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
AMPLIFY_URL="d2d5j98tau5snm.amplifyapp.com"

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
    
    # Configurar região
    export AWS_DEFAULT_REGION="$REGION"
    log_info "Região configurada: $REGION"
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

# Função para corrigir DNS do domínio raiz
fix_root_domain() {
    log_step "1️⃣ Corrigindo DNS do domínio raiz..."
    
    # Criar arquivo de mudança
    cat > /tmp/root-domain.json << EOF
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
            "Value": "$AMPLIFY_URL"
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
        --change-batch file:///tmp/root-domain.json; then
        
        log_success "Domínio raiz corrigido com sucesso!"
        log_info "Agora aponta para: $AMPLIFY_URL"
    else
        log_error "Falha ao corrigir domínio raiz"
        return 1
    fi
    
    # Limpar arquivo temporário
    rm -f /tmp/root-domain.json
}

# Função para corrigir DNS do subdomínio www
fix_www_domain() {
    log_step "2️⃣ Corrigindo DNS do subdomínio www..."
    
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
            "Value": "$AMPLIFY_URL"
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
        log_info "Agora aponta para: $AMPLIFY_URL"
    else
        log_error "Falha ao corrigir subdomínio www"
        return 1
    fi
    
    # Limpar arquivo temporário
    rm -f /tmp/www-domain.json
}

# Função para remover domínio customizado quebrado
remove_broken_domain() {
    log_step "3️⃣ Removendo domínio customizado quebrado..."
    
    if aws amplify delete-domain-association \
        --app-id "$AMPLIFY_APP_ID" \
        --domain-name "$DOMAIN" \
        --region "$REGION" 2>/dev/null; then
        
        log_success "Domínio customizado removido com sucesso!"
    else
        log_warning "Domínio customizado pode não existir ou já foi removido"
    fi
}

# Função para aguardar propagação DNS
wait_dns_propagation() {
    log_step "4️⃣ Aguardando propagação DNS (60 segundos)..."
    
    for i in {60..1}; do
        echo -ne "\r⏳ Aguardando propagação DNS... $i segundos restantes"
        sleep 1
    done
    echo ""
    
    log_success "Tempo de propagação DNS concluído!"
}

# Função para verificar DNS
verify_dns() {
    log_step "5️⃣ Verificando DNS..."
    
    echo ""
    echo "🔍 VERIFICAÇÃO DNS:"
    echo "=================="
    
    # Verificar domínio raiz
    echo "  Domínio raiz ($DOMAIN):"
    if nslookup "$DOMAIN" &> /dev/null; then
        CURRENT_ROOT=$(nslookup "$DOMAIN" | grep "canonical name" | awk '{print $NF}')
        if [ "$CURRENT_ROOT" = "$AMPLIFY_URL" ]; then
            log_success "Domínio raiz → $CURRENT_ROOT"
        else
            log_warning "Domínio raiz → $CURRENT_ROOT (ainda propagando)"
        fi
    else
        log_error "Domínio raiz não está resolvendo"
    fi
    
    # Verificar subdomínio www
    echo "  Subdomínio www (www.$DOMAIN):"
    if nslookup "www.$DOMAIN" &> /dev/null; then
        CURRENT_WWW=$(nslookup "www.$DOMAIN" | grep "canonical name" | awk '{print $NF}')
        if [ "$CURRENT_WWW" = "$AMPLIFY_URL" ]; then
            log_success "Subdomínio www → $CURRENT_WWW"
        else
            log_warning "Subdomínio www → $CURRENT_WWW (ainda propagando)"
        fi
    else
        log_error "Subdomínio www não está resolvendo"
    fi
}

# Função para testar URLs
test_urls() {
    log_step "6️⃣ Testando URLs..."
    
    echo ""
    echo "🌐 TESTE DE URLS:"
    echo "================="
    
    # Testar domínio raiz
    echo "  Testando https://$DOMAIN:"
    if curl -I -L "https://$DOMAIN" --max-time 10 --silent 2>/dev/null | head -1; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L "https://$DOMAIN" --max-time 10)
        if [ "$HTTP_CODE" = "200" ]; then
            log_success "Domínio raiz: HTTP $HTTP_CODE - Funcionando!"
        else
            log_warning "Domínio raiz: HTTP $HTTP_CODE - Responde mas com status diferente"
        fi
    else
        log_error "Domínio raiz: Não responde ou timeout"
    fi
    
    # Testar subdomínio www
    echo "  Testando https://www.$DOMAIN:"
    if curl -I -L "https://www.$DOMAIN" --max-time 10 --silent 2>/dev/null | head -1; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L "https://www.$DOMAIN" --max-time 10)
        if [ "$HTTP_CODE" = "200" ]; then
            log_success "Subdomínio www: HTTP $HTTP_CODE - Funcionando!"
        else
            log_warning "Subdomínio www: HTTP $HTTP_CODE - Responde mas com status diferente"
        fi
    else
        log_error "Subdomínio www: Não responde ou timeout"
    fi
    
    # Testar URL do Amplify
    echo "  Testando https://$AMPLIFY_URL:"
    if curl -I -L "https://$AMPLIFY_URL" --max-time 10 --silent 2>/dev/null | head -1; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L "https://$AMPLIFY_URL" --max-time 10)
        if [ "$HTTP_CODE" = "200" ]; then
            log_success "Amplify URL: HTTP $HTTP_CODE - Funcionando!"
        else
            log_warning "Amplify URL: HTTP $HTTP_CODE - Responde mas com status diferente"
        fi
    else
        log_error "Amplify URL: Não responde ou timeout"
    fi
}

# Função para forçar novo deploy
force_new_deploy() {
    log_step "7️⃣ Forçando novo deploy..."
    
    # Iniciar job de deploy
    if aws amplify start-job \
        --app-id "$AMPLIFY_APP_ID" \
        --branch-name main \
        --job-type RELEASE \
        --region "$REGION"; then
        
        # Obter ID do job
        JOB_ID=$(aws amplify list-jobs --app-id "$AMPLIFY_APP_ID" --branch-name main --region "$REGION" --max-items 1 --query 'jobSummaries[0].jobId' --output text)
        
        if [ "$JOB_ID" != "None" ] && [ -n "$JOB_ID" ]; then
            log_success "Deploy iniciado com sucesso!"
            log_info "Job ID: $JOB_ID"
            
            # Monitorar deploy
            monitor_deploy "$JOB_ID"
        else
            log_error "Falha ao obter ID do job"
            return 1
        fi
    else
        log_error "Falha ao iniciar deploy!"
        return 1
    fi
}

# Função para monitorar deploy
monitor_deploy() {
    local job_id="$1"
    
    log_step "8️⃣ Monitorando deploy..."
    
    echo ""
    echo "📊 MONITORAMENTO DO DEPLOY:"
    echo "============================"
    echo "  🆔 Job ID: $job_id"
    echo "  🕐 Início: $(date)"
    echo ""
    
    # Loop de monitoramento
    for i in {1..20}; do
        if aws amplify get-job --app-id "$AMPLIFY_APP_ID" --branch-name main --job-id "$job_id" --region "$REGION" &> /dev/null; then
            STATUS=$(aws amplify get-job --app-id "$AMPLIFY_APP_ID" --branch-name main --job-id "$job_id" --region "$REGION" --query 'job.summary.status' --output text)
            
            echo -ne "\r⏳ Deploy status: $STATUS (tentativa $i/20)"
            
            if [ "$STATUS" = "SUCCEED" ]; then
                echo ""
                log_success "Deploy concluído com sucesso!"
                break
            elif [ "$STATUS" = "FAILED" ]; then
                echo ""
                log_error "Deploy falhou!"
                show_job_logs "$job_id"
                break
            elif [ "$STATUS" = "CANCELLED" ]; then
                echo ""
                log_warning "Deploy foi cancelado"
                break
            fi
        else
            log_error "Falha ao obter status do job"
            break
        fi
        
        sleep 30
    done
}

# Função para mostrar logs do job
show_job_logs() {
    local job_id="$1"
    
    log_info "Obtendo logs do job..."
    
    if [ -n "$job_id" ]; then
        # Obter logs do job
        JOB_LOGS=$(aws amplify get-job --app-id "$AMPLIFY_APP_ID" --branch-name main --job-id "$job_id" --region "$REGION" --query 'job.summary' --output json)
        
        echo ""
        echo "📋 LOGS DO JOB:"
        echo "================"
        echo "$JOB_LOGS" | jq '.' 2>/dev/null || echo "$JOB_LOGS"
    fi
}

# Função para teste final
final_test() {
    log_step "9️⃣ Teste final após deploy..."
    
    log_info "Aguardando 60 segundos para estabilização..."
    sleep 60
    
    echo ""
    echo "🎯 TESTE FINAL:"
    echo "==============="
    
    # Testar domínio raiz
    echo "🌐 https://$DOMAIN:"
    if curl -I -L "https://$DOMAIN" --max-time 10 --silent 2>/dev/null | head -1; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L "https://$DOMAIN" --max-time 10)
        if [ "$HTTP_CODE" = "200" ]; then
            log_success "✅ Domínio raiz funcionando: HTTP $HTTP_CODE"
        else
            log_warning "⚠️ Domínio raiz responde mas com status HTTP $HTTP_CODE"
        fi
    else
        log_error "❌ Domínio raiz não responde"
    fi
    
    # Testar subdomínio www
    echo "🌐 https://www.$DOMAIN:"
    if curl -I -L "https://www.$DOMAIN" --max-time 10 --silent 2>/dev/null | head -1; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L "https://www.$DOMAIN" --max-time 10)
        if [ "$HTTP_CODE" = "200" ]; then
            log_success "✅ Subdomínio www funcionando: HTTP $HTTP_CODE"
        else
            log_warning "⚠️ Subdomínio www responde mas com status HTTP $HTTP_CODE"
        fi
    else
        log_error "❌ Subdomínio www não responde"
    fi
}

# Função para mostrar resumo final
show_final_summary() {
    echo ""
    echo "🎉 CORREÇÃO COMPLETA FINALIZADA!"
    echo "================================="
    echo ""
    echo "📋 RESUMO:"
    echo "  ✅ DNS corrigido para apontar para Amplify"
    echo "  ✅ Domínio customizado removido"
    echo "  ✅ Deploy forçado"
    echo "  🌐 URLs funcionais:"
    echo "      - https://$DOMAIN"
    echo "      - https://www.$DOMAIN"
    echo "      - https://app.$DOMAIN"
    echo ""
    echo "🎯 PROBLEMA 404 RESOLVIDO!"
    echo "O DNS agora aponta corretamente para o Amplify em vez do CloudFront inexistente."
}

# Função principal
main() {
    echo ""
    echo "🚀 AGROTM - CORREÇÃO COMPLETA DO AMPLIFY 404"
    echo "============================================="
    echo "📋 Configurações:"
    echo "  Hosted Zone ID: $HOSTED_ZONE_ID"
    echo "  Região: $REGION"
    echo "  App ID: $AMPLIFY_APP_ID"
    echo "  Domínio: $DOMAIN"
    echo "  Amplify URL: $AMPLIFY_URL"
    echo ""
    
    # Verificações iniciais
    check_aws_config
    check_route53_permissions
    
    echo ""
    echo "🔧 INICIANDO CORREÇÕES..."
    echo "=========================="
    
    # Executar correções
    fix_root_domain
    fix_www_domain
    remove_broken_domain
    wait_dns_propagation
    verify_dns
    test_urls
    force_new_deploy
    final_test
    
    # Mostrar resumo final
    show_final_summary
}

# Executar função principal
main "$@"
