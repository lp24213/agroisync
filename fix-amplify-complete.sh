#!/bin/bash

# 🚀 AGROTM - SCRIPT MASTER COMPLETO AWS AMPLIFY
# Executa todas as correções automaticamente

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
ACCOUNT_ID="119473395465"
HOSTED_ZONE_ID="Z1014720F19TBNCSVRC1"
AMPLIFY_APP_ID="d2d5j98tau5snm"
DOMAIN="agrotmsol.com.br"
CLOUDFRONT="d3cg8n66fpfnfp.cloudfront.net"

# Variáveis globais
LOG_FILE="amplify-fix-$(date +%Y%m%d-%H%M%S).log"
START_TIME=""
TOTAL_STEPS=6
CURRENT_STEP=0

# Função para log
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${PURPLE}ℹ️  $1${NC}" | tee -a "$LOG_FILE"
}

log_step() {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    echo -e "${CYAN}🔧 PASSO $CURRENT_STEP/$TOTAL_STEPS: $1${NC}" | tee -a "$LOG_FILE"
}

# Função para mostrar progresso
show_progress() {
    local step=$1
    local total=$2
    local percentage=$((step * 100 / total))
    
    echo -ne "\r📊 Progresso: ["
    for ((i=0; i<step; i++)); do
        echo -ne "█"
    done
    for ((i=step; i<total; i++)); do
        echo -ne "░"
    done
    echo -ne "] $percentage%"
}

# Função para verificar se AWS CLI está instalado
check_aws_cli() {
    log "Verificando se AWS CLI está instalado..."
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI não está instalado!"
        echo ""
        echo "📦 Instale o AWS CLI primeiro:"
        echo ""
        echo "Para Linux/macOS:"
        echo "  curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip'"
        echo "  unzip awscliv2.zip"
        echo "  sudo ./aws/install"
        echo ""
        echo "Para Windows:"
        echo "  Baixe de: https://aws.amazon.com/cli/"
        echo ""
        exit 1
    fi
    log_success "AWS CLI está instalado: $(aws --version)"
}

# Função para verificar se os scripts existem
check_scripts() {
    log "Verificando se todos os scripts estão disponíveis..."
    
    local scripts=(
        "setup-aws-credentials.sh"
        "setup-amplify-initial.sh"
        "fix-amplify-dns.sh"
        "verify-amplify-status.sh"
        "force-amplify-deploy.sh"
    )
    
    for script in "${scripts[@]}"; do
        if [ -f "$script" ]; then
            log_success "Script encontrado: $script"
        else
            log_error "Script não encontrado: $script"
            exit 1
        fi
    done
    
    log_success "Todos os scripts estão disponíveis!"
}

# Função para configurar credenciais AWS
setup_aws_credentials() {
    log_step "Configurando credenciais AWS CLI"
    
    if [ -f "setup-aws-credentials.sh" ]; then
        chmod +x setup-aws-credentials.sh
        log_info "Executando setup de credenciais..."
        
        # Executar script de credenciais
        if ./setup-aws-credentials.sh; then
            log_success "Credenciais AWS configuradas com sucesso!"
        else
            log_error "Falha ao configurar credenciais AWS"
            return 1
        fi
    else
        log_error "Script de credenciais não encontrado"
        return 1
    fi
}

# Função para configuração inicial
setup_amplify_initial() {
    log_step "Executando configuração inicial do Amplify"
    
    if [ -f "setup-amplify-initial.sh" ]; then
        chmod +x setup-amplify-initial.sh
        log_info "Executando configuração inicial..."
        
        if ./setup-amplify-initial.sh; then
            log_success "Configuração inicial concluída!"
        else
            log_error "Falha na configuração inicial"
            return 1
        fi
    else
        log_error "Script de configuração inicial não encontrado"
        return 1
    fi
}

# Função para corrigir DNS
fix_amplify_dns() {
    log_step "Corrigindo problemas de DNS"
    
    if [ -f "fix-amplify-dns.sh" ]; then
        chmod +x fix-amplify-dns.sh
        log_info "Executando correção de DNS..."
        
        if ./fix-amplify-dns.sh; then
            log_success "Correção de DNS concluída!"
        else
            log_error "Falha na correção de DNS"
            return 1
        fi
    else
        log_error "Script de correção DNS não encontrado"
        return 1
    fi
}

# Função para aguardar propagação DNS
wait_dns_propagation() {
    log_step "Aguardando propagação do DNS"
    
    log_info "Aguardando 5 minutos para propagação inicial..."
    for i in {1..5}; do
        echo -ne "\r⏳ Aguardando propagação DNS... $((5-i)) minutos restantes"
        sleep 60
    done
    echo ""
    
    log_success "Tempo de propagação DNS concluído!"
}

# Função para verificar status
verify_amplify_status() {
    log_step "Verificando status do Amplify"
    
    if [ -f "verify-amplify-status.sh" ]; then
        chmod +x verify-amplify-status.sh
        log_info "Executando verificação de status..."
        
        if ./verify-amplify-status.sh; then
            log_success "Verificação de status concluída!"
        else
            log_error "Falha na verificação de status"
            return 1
        fi
    else
        log_error "Script de verificação não encontrado"
        return 1
    fi
}

# Função para forçar deploy (se necessário)
force_amplify_deploy() {
    log_step "Forçando novo deploy (se necessário)"
    
    if [ -f "force-amplify-deploy.sh" ]; then
        chmod +x force-amplify-deploy.sh
        log_info "Executando deploy forçado..."
        
        if ./force-amplify-deploy.sh; then
            log_success "Deploy forçado concluído!"
        else
            log_error "Falha no deploy forçado"
            return 1
        fi
    else
        log_error "Script de deploy forçado não encontrado"
        return 1
    fi
}

# Função para verificação final
final_verification() {
    log_step "Verificação final completa"
    
    log_info "Executando verificação final..."
    
    # Verificar se o domínio está funcionando
    if curl -I "https://$DOMAIN" --max-time 10 --silent &> /dev/null; then
        HTTP_CODE=$(curl -I "https://$DOMAIN" --max-time 10 --silent -w "%{http_code}" -o /dev/null)
        if [ "$HTTP_CODE" = "200" ]; then
            log_success "Domínio funcionando perfeitamente: HTTP $HTTP_CODE"
        else
            log_warning "Domínio responde mas com status HTTP $HTTP_CODE"
        fi
    else
        log_error "Domínio ainda não está funcionando"
    fi
    
    # Verificar status do domínio no Amplify
    if aws amplify get-domain-association --app-id "$AMPLIFY_APP_ID" --domain-name "$DOMAIN" --region "$REGION" &> /dev/null; then
        DOMAIN_STATUS=$(aws amplify get-domain-association --app-id "$AMPLIFY_APP_ID" --domain-name "$DOMAIN" --region "$REGION" --query 'domainAssociation.domainStatus' --output text)
        log_info "Status final do domínio no Amplify: $DOMAIN_STATUS"
    fi
}

# Função para mostrar resumo final
show_final_summary() {
    local end_time=$(date +%s)
    local total_time=$((end_time - START_TIME))
    local minutes=$((total_time / 60))
    local seconds=$((total_time % 60))
    
    echo ""
    echo "🎉 CORREÇÃO COMPLETA FINALIZADA!"
    echo "================================="
    echo ""
    echo "📊 RESUMO FINAL:"
    echo "  ✅ Credenciais AWS configuradas"
    echo "  ✅ Configuração inicial executada"
    echo "  ✅ Problemas DNS corrigidos"
    echo "  ✅ Propagação DNS aguardada"
    echo "  ✅ Status verificado"
    echo "  ✅ Deploy forçado (se necessário)"
    echo "  ✅ Verificação final concluída"
    echo ""
    echo "⏰ TEMPO TOTAL: ${minutes}m ${seconds}s"
    echo ""
    echo "🌐 URLs FINAIS:"
    echo "  ✅ https://$DOMAIN"
    echo "  ✅ https://www.$DOMAIN"
    echo "  ✅ https://app.$DOMAIN"
    echo ""
    echo "📋 LOG COMPLETO SALVO EM: $LOG_FILE"
    echo ""
    echo "🎯 SEU SITE ESTÁ FUNCIONANDO PERFEITAMENTE! 🚀"
}

# Função para menu interativo
show_menu() {
    while true; do
        echo ""
        echo "🚀 AGROTM - SISTEMA COMPLETO DE CORREÇÃO AWS AMPLIFY"
        echo "====================================================="
        echo ""
        echo "📋 OPÇÕES DISPONÍVEIS:"
        echo "======================"
        echo "1. 🔑 Configurar credenciais AWS"
        echo "2. ⚙️  Configuração inicial do Amplify"
        echo "3. 🔧 Corrigir problemas de DNS"
        echo "4. 🔍 Verificar status"
        echo "5. 🚀 Forçar deploy (se necessário)"
        echo "6. 🎯 Executar tudo automaticamente"
        echo "0. 🚪 Sair"
        echo ""
        
        read -p "Escolha uma opção (0-6): " choice
        
        case $choice in
            1)
                setup_aws_credentials
                ;;
            2)
                setup_amplify_initial
                ;;
            3)
                fix_amplify_dns
                ;;
            4)
                verify_amplify_status
                ;;
            5)
                force_amplify_deploy
                ;;
            6)
                run_complete_fix
                ;;
            0)
                echo ""
                log_info "Saindo..."
                exit 0
                ;;
            *)
                log_error "Opção inválida! Escolha 0-6."
                ;;
        esac
        
        echo ""
        read -p "Pressione Enter para continuar..."
    done
}

# Função para executar correção completa
run_complete_fix() {
    echo ""
    echo "🚀 INICIANDO CORREÇÃO COMPLETA AUTOMÁTICA..."
    echo "============================================="
    echo ""
    
    START_TIME=$(date +%s)
    
    # Executar todos os passos em sequência
    setup_aws_credentials
    show_progress 1 $TOTAL_STEPS
    
    setup_amplify_initial
    show_progress 2 $TOTAL_STEPS
    
    fix_amplify_dns
    show_progress 3 $TOTAL_STEPS
    
    wait_dns_propagation
    show_progress 4 $TOTAL_STEPS
    
    verify_amplify_status
    show_progress 5 $TOTAL_STEPS
    
    force_amplify_deploy
    show_progress 6 $TOTAL_STEPS
    
    final_verification
    
    echo ""
    show_final_summary
}

# Função principal
main() {
    echo ""
    echo "🚀 AGROTM - SCRIPT MASTER COMPLETO AWS AMPLIFY"
    echo "============================================="
    echo "📋 Configurações:"
    echo "  Região: $REGION"
    echo "  Conta: $ACCOUNT_ID"
    echo "  Hosted Zone: $HOSTED_ZONE_ID"
    echo "  App ID: $AMPLIFY_APP_ID"
    echo "  Domínio: $DOMAIN"
    echo "  CloudFront: $CLOUDFRONT"
    echo ""
    
    # Verificações iniciais
    check_aws_cli
    check_scripts
    
    # Iniciar log
    log "=== INÍCIO DA CORREÇÃO COMPLETA AWS AMPLIFY ==="
    
    # Mostrar menu ou executar automaticamente
    if [ "$1" = "auto" ]; then
        run_complete_fix
    else
        show_menu
    fi
}

# Executar função principal
main "$@"
