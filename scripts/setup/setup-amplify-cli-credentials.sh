#!/bin/bash

# AGROTM - Configuração de Credenciais Amplify CLI
# Script para configurar as novas chaves de acesso automaticamente

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Novas credenciais do Amplify CLI
AMPLIFY_ACCESS_KEY_ID="AKIARXUJLK4EQEIIMUS2"
AMPLIFY_SECRET_ACCESS_KEY="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"
AMPLIFY_REGION="us-east-1"
AMPLIFY_OUTPUT="json"

# Função para log
log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log_success() {
    echo -e "✅ $1"
}

log_error() {
    echo -e "❌ $1"
}

log_warning() {
    echo -e "⚠️ $1"
}

log_info() {
    echo -e "ℹ️ $1"
}

# Função para verificar se AWS CLI está instalado
check_aws_cli() {
    log "Verificando se AWS CLI está instalado..." "$BLUE"
    if command -v aws &> /dev/null; then
        local version=$(aws --version)
        log_success "AWS CLI está instalado: $version"
        return 0
    else
        log_error "AWS CLI não está instalado!"
        echo ""
        echo "📦 Instale o AWS CLI primeiro:"
        echo ""
        echo "Para Ubuntu/Debian:"
        echo "  sudo apt update && sudo apt install awscli"
        echo ""
        echo "Para macOS (com Homebrew):"
        echo "  brew install awscli"
        echo ""
        echo "Para CentOS/RHEL:"
        echo "  sudo yum install awscli"
        echo ""
        return 1
    fi
}

# Função para verificar se Amplify CLI está instalado
check_amplify_cli() {
    log "Verificando se Amplify CLI está instalado..." "$BLUE"
    if command -v amplify &> /dev/null; then
        local version=$(amplify --version)
        log_success "Amplify CLI está instalado: $version"
        return 0
    else
        log_warning "Amplify CLI não está instalado!"
        echo ""
        echo "📦 Instale o Amplify CLI:"
        echo "  npm install -g @aws-amplify/cli"
        echo ""
        return 1
    fi
}

# Função para configurar credenciais AWS
configure_amplify_credentials() {
    log "Configurando credenciais do Amplify CLI..." "$BLUE"
    
    # Configurar perfil específico para Amplify
    aws configure set aws_access_key_id "$AMPLIFY_ACCESS_KEY_ID" --profile amplify-cli
    aws configure set aws_secret_access_key "$AMPLIFY_SECRET_ACCESS_KEY" --profile amplify-cli
    aws configure set default.region "$AMPLIFY_REGION" --profile amplify-cli
    aws configure set default.output "$AMPLIFY_OUTPUT" --profile amplify-cli
    
    # Configurar como perfil padrão também
    aws configure set aws_access_key_id "$AMPLIFY_ACCESS_KEY_ID"
    aws configure set aws_secret_access_key "$AMPLIFY_SECRET_ACCESS_KEY"
    aws configure set default.region "$AMPLIFY_REGION"
    aws configure set default.output "$AMPLIFY_OUTPUT"
    
    log_success "Credenciais do Amplify CLI configuradas com sucesso!"
}

# Função para testar configuração
test_amplify_configuration() {
    log "Testando configuração do Amplify CLI..." "$BLUE"
    
    # Testar identidade
    if aws sts get-caller-identity &> /dev/null; then
        local identity=$(aws sts get-caller-identity --query 'Arn' --output text)
        local account=$(aws sts get-caller-identity --query 'Account' --output text)
        local userId=$(aws sts get-caller-identity --query 'UserId' --output text)
        
        log_success "Autenticação bem-sucedida!"
        echo "  👤 Usuário: $identity"
        echo "  🏢 Conta: $account"
        echo "  🆔 User ID: $userId"
    else
        log_error "Falha na autenticação AWS!"
        return 1
    fi
    
    # Testar acesso ao Amplify
    log "Testando acesso ao Amplify..." "$BLUE"
    if aws amplify list-apps --region "$AMPLIFY_REGION" --max-items 1 &> /dev/null; then
        log_success "Acesso ao Amplify: OK"
    else
        log_warning "Sem acesso ao Amplify (verifique permissões)"
    fi
    
    return 0
}

# Função para mostrar configuração atual
show_amplify_config() {
    log "Configuração atual do Amplify CLI:" "$BLUE"
    echo ""
    echo "📋 CONFIGURAÇÃO AMPLIFY CLI:"
    echo "============================="
    
    local region=$(aws configure get default.region 2>/dev/null || echo "N/A")
    local output=$(aws configure get default.output 2>/dev/null || echo "N/A")
    local accessKey=$(aws configure get aws_access_key_id 2>/dev/null || echo "N/A")
    local secretKey=$(aws configure get aws_secret_access_key 2>/dev/null || echo "N/A")
    
    echo "  🌍 Região: $region"
    echo "  📊 Output: $output"
    if [ "$accessKey" != "N/A" ]; then
        echo "  🔑 Access Key: ${accessKey:0:8}..."
    else
        echo "  🔑 Access Key: $accessKey"
    fi
    if [ "$secretKey" != "N/A" ]; then
        echo "  🔒 Secret Key: ${secretKey:0:8}..."
    else
        echo "  🔒 Secret Key: $secretKey"
    fi
}

# Função para configurar variáveis de ambiente
set_environment_variables() {
    log "Configurando variáveis de ambiente..." "$BLUE"
    
    # Adicionar ao .bashrc ou .zshrc
    local shell_rc=""
    if [ -f "$HOME/.bashrc" ]; then
        shell_rc="$HOME/.bashrc"
    elif [ -f "$HOME/.zshrc" ]; then
        shell_rc="$HOME/.zshrc"
    elif [ -f "$HOME/.profile" ]; then
        shell_rc="$HOME/.profile"
    fi
    
    if [ -n "$shell_rc" ]; then
        # Verificar se já existem
        if ! grep -q "AWS_ACCESS_KEY_ID" "$shell_rc"; then
            echo "" >> "$shell_rc"
            echo "# AGROTM Amplify CLI Environment Variables" >> "$shell_rc"
            echo "export AWS_ACCESS_KEY_ID=$AMPLIFY_ACCESS_KEY_ID" >> "$shell_rc"
            echo "export AWS_SECRET_ACCESS_KEY=$AMPLIFY_SECRET_ACCESS_KEY" >> "$shell_rc"
            echo "export AWS_REGION=$AMPLIFY_REGION" >> "$shell_rc"
            echo "export AWS_DEFAULT_OUTPUT=$AMPLIFY_OUTPUT" >> "$shell_rc"
            log_success "Variáveis de ambiente adicionadas ao $shell_rc"
        else
            log_info "Variáveis de ambiente já existem em $shell_rc"
        fi
    fi
    
    # Configurar para a sessão atual
    export AWS_ACCESS_KEY_ID="$AMPLIFY_ACCESS_KEY_ID"
    export AWS_SECRET_ACCESS_KEY="$AMPLIFY_SECRET_ACCESS_KEY"
    export AWS_REGION="$AMPLIFY_REGION"
    export AWS_DEFAULT_OUTPUT="$AMPLIFY_OUTPUT"
    
    log_success "Variáveis de ambiente configuradas para a sessão atual!"
}

# Função para criar arquivo de configuração do Amplify
create_amplify_config() {
    log "Criando arquivo de configuração do Amplify..." "$BLUE"
    
    cat > "amplify-cli-config.json" << EOF
{
  "amplify-cli": {
    "accessKeyId": "$AMPLIFY_ACCESS_KEY_ID",
    "secretAccessKey": "$AMPLIFY_SECRET_ACCESS_KEY",
    "region": "$AMPLIFY_REGION",
    "output": "$AMPLIFY_OUTPUT",
    "description": "AGROTM Amplify CLI Credentials",
    "created": "$(date +%Y-%m-%d)",
    "environment": "production"
  }
}
EOF
    
    log_success "Arquivo de configuração criado: amplify-cli-config.json"
}

# Função principal
main() {
    echo ""
    echo -e "🚀 CONFIGURAÇÃO AMPLIFY CLI - AGROTM$MAGENTA"
    echo "====================================="
    echo ""
    
    # Verificar pré-requisitos
    if ! check_aws_cli; then
        log_error "AWS CLI não está instalado. Instale primeiro."
        exit 1
    fi
    
    if ! check_amplify_cli; then
        log_warning "Amplify CLI não está instalado. Continue mesmo assim."
    fi
    
    echo ""
    echo -e "🔐 CONFIGURANDO NOVAS CREDENCIAIS AMPLIFY CLI$YELLOW"
    echo "============================================="
    echo ""
    echo "  🔑 Access Key: ${AMPLIFY_ACCESS_KEY_ID:0:8}..."
    echo "  🌍 Região: $AMPLIFY_REGION"
    echo "  📊 Output: $AMPLIFY_OUTPUT"
    echo ""
    
    # Configurar credenciais
    configure_amplify_credentials
    
    # Configurar variáveis de ambiente
    set_environment_variables
    
    # Criar arquivo de configuração
    create_amplify_config
    
    # Testar configuração
    echo ""
    if test_amplify_configuration; then
        log_success "Configuração do Amplify CLI concluída com sucesso!"
    else
        log_warning "Configuração concluída, mas alguns testes falharam."
    fi
    
    # Mostrar configuração final
    echo ""
    show_amplify_config
    
    echo ""
    echo -e "🎉 CONFIGURAÇÃO CONCLUÍDA!$GREEN"
    echo "========================="
    echo ""
    echo -e "📝 Próximos passos:$YELLOW"
    echo "  1. Execute: amplify init"
    echo "  2. Execute: amplify configure"
    echo "  3. Execute: amplify push"
    echo ""
    echo -e "📚 Documentação: https://docs.amplify.aws/$BLUE"
    echo ""
    
    # Recarregar configuração do shell
    if [ -f "$HOME/.bashrc" ]; then
        source "$HOME/.bashrc"
    elif [ -f "$HOME/.zshrc" ]; then
        source "$HOME/.zshrc"
    fi
}

# Executar função principal
main "$@"
