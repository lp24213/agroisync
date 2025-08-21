#!/bin/bash

# 🔐 AGROTM - Configuração de Credenciais AWS CLI
# Script para configurar acesso AWS automaticamente

set -e  # Exit on any error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configurações padrão
DEFAULT_REGION="us-east-2"
DEFAULT_OUTPUT="json"

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
        echo "Para macOS (com Homebrew):"
        echo "  brew install awscli"
        echo ""
        exit 1
    fi
    log_success "AWS CLI está instalado: $(aws --version)"
}

# Função para solicitar credenciais
get_credentials() {
    echo ""
    echo "🔐 CONFIGURAÇÃO DE CREDENCIAIS AWS"
    echo "=================================="
    echo ""
    
    # Solicitar Access Key ID
    while true; do
        read -p "🔑 AWS Access Key ID: " AWS_ACCESS_KEY_ID
        if [ -n "$AWS_ACCESS_KEY_ID" ]; then
            break
        else
            log_error "Access Key ID não pode estar vazio!"
        fi
    done
    
    # Solicitar Secret Access Key
    while true; do
        read -s -p "🔒 AWS Secret Access Key: " AWS_SECRET_ACCESS_KEY
        echo ""
        if [ -n "$AWS_SECRET_ACCESS_KEY" ]; then
            break
        else
            log_error "Secret Access Key não pode estar vazio!"
        fi
    done
    
    # Solicitar região (com padrão)
    read -p "🌍 AWS Region [$DEFAULT_REGION]: " AWS_REGION
    AWS_REGION=${AWS_REGION:-$DEFAULT_REGION}
    
    # Solicitar formato de output (com padrão)
    read -p "📊 Output format [$DEFAULT_OUTPUT]: " AWS_OUTPUT
    AWS_OUTPUT=${AWS_OUTPUT:-$DEFAULT_OUTPUT}
}

# Função para configurar AWS CLI
configure_aws() {
    log "Configurando AWS CLI..."
    
    # Configurar credenciais
    aws configure set aws_access_key_id "$AWS_ACCESS_KEY_ID"
    aws configure set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY"
    aws configure set default.region "$AWS_REGION"
    aws configure set default.output "$AWS_OUTPUT"
    
    log_success "AWS CLI configurado com sucesso!"
}

# Função para testar configuração
test_configuration() {
    log "Testando configuração AWS..."
    
    # Testar identidade
    if aws sts get-caller-identity &> /dev/null; then
        IDENTITY=$(aws sts get-caller-identity --query 'Arn' --output text)
        ACCOUNT=$(aws sts get-caller-identity --query 'Account' --output text)
        USER_ID=$(aws sts get-caller-identity --query 'UserId' --output text)
        
        log_success "Autenticação bem-sucedida!"
        echo "  👤 Usuário: $IDENTITY"
        echo "  🏢 Conta: $ACCOUNT"
        echo "  🆔 User ID: $USER_ID"
    else
        log_error "Falha na autenticação AWS!"
        return 1
    fi
    
    # Testar acesso ao Route53
    log "Testando acesso ao Route53..."
    if aws route53 list-hosted-zones --max-items 1 &> /dev/null; then
        log_success "Acesso ao Route53: OK"
    else
        log_warning "Sem acesso ao Route53 (verifique permissões)"
    fi
    
    # Testar acesso ao Amplify
    log "Testando acesso ao Amplify..."
    if aws amplify list-apps --region "$AWS_REGION" --max-items 1 &> /dev/null; then
        log_success "Acesso ao Amplify: OK"
    else
        log_warning "Sem acesso ao Amplify (verifique permissões)"
    fi
    
    # Testar acesso ao ACM
    log "Testando acesso ao ACM..."
    if aws acm list-certificates --region us-east-1 --max-items 1 &> /dev/null; then
        log_success "Acesso ao ACM: OK"
    else
        log_warning "Sem acesso ao ACM (verifique permissões)"
    fi
}

# Função para verificar permissões necessárias
check_required_permissions() {
    log "Verificando permissões necessárias..."
    
    echo ""
    echo "🔐 PERMISSÕES NECESSÁRIAS:"
    echo "=========================="
    
    # Lista de permissões necessárias
    PERMISSIONS=(
        "route53:ChangeResourceRecordSets"
        "route53:ListResourceRecordSets"
        "route53:ListHostedZones"
        "amplify:GetDomainAssociation"
        "amplify:ListDomainAssociations"
        "amplify:StartJob"
        "amplify:GetJob"
        "acm:ListCertificates"
        "acm:DescribeCertificate"
    )
    
    for permission in "${PERMISSIONS[@]}"; do
        SERVICE=$(echo "$permission" | cut -d: -f1)
        ACTION=$(echo "$permission" | cut -d: -f2)
        
        case $SERVICE in
            "route53")
                if aws route53 list-hosted-zones --max-items 1 &> /dev/null; then
                    log_success "$permission"
                else
                    log_error "$permission"
                fi
                ;;
            "amplify")
                if aws amplify list-apps --region "$AWS_REGION" --max-items 1 &> /dev/null; then
                    log_success "$permission"
                else
                    log_error "$permission"
                fi
                ;;
            "acm")
                if aws acm list-certificates --region us-east-1 --max-items 1 &> /dev/null; then
                    log_success "$permission"
                else
                    log_error "$permission"
                fi
                ;;
        esac
    done
}

# Função para mostrar configuração atual
show_current_config() {
    log "Configuração atual do AWS CLI:"
    echo ""
    echo "📋 CONFIGURAÇÃO ATUAL:"
    echo "======================"
    echo "  🌍 Região: $(aws configure get default.region)"
    echo "  📊 Output: $(aws configure get default.output)"
    echo "  🔑 Access Key: $(aws configure get aws_access_key_id | cut -c1-8)..."
    echo "  🔒 Secret Key: $(aws configure get aws_secret_access_key | cut -c1-8)..."
}

# Função para limpar configuração
clear_configuration() {
    log_warning "Limpando configuração AWS..."
    
    read -p "Tem certeza que deseja limpar a configuração? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        aws configure set aws_access_key_id ""
        aws configure set aws_secret_access_key ""
        aws configure set default.region ""
        aws configure set default.output ""
        log_success "Configuração limpa com sucesso!"
    else
        log_info "Operação cancelada."
    fi
}

# Função principal
main() {
    echo ""
    echo "🔐 AGROTM - CONFIGURAÇÃO DE CREDENCIAIS AWS CLI"
    echo "================================================"
    echo ""
    
    # Verificar AWS CLI
    check_aws_cli
    
    # Menu de opções
    while true; do
        echo ""
        echo "📋 OPÇÕES DISPONÍVEIS:"
        echo "======================"
        echo "1. 🔑 Configurar novas credenciais"
        echo "2. ✅ Testar configuração atual"
        echo "3. 🔐 Verificar permissões"
        echo "4. 📋 Mostrar configuração atual"
        echo "5. 🗑️  Limpar configuração"
        echo "0. 🚪 Sair"
        echo ""
        
        read -p "Escolha uma opção (0-5): " choice
        
        case $choice in
            1)
                get_credentials
                configure_aws
                test_configuration
                ;;
            2)
                test_configuration
                ;;
            3)
                check_required_permissions
                ;;
            4)
                show_current_config
                ;;
            5)
                clear_configuration
                ;;
            0)
                echo ""
                log_info "Saindo..."
                exit 0
                ;;
            *)
                log_error "Opção inválida! Escolha 0-5."
                ;;
        esac
        
        echo ""
        read -p "Pressione Enter para continuar..."
    done
}

# Executar função principal
main "$@"
