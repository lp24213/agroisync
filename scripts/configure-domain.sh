#!/bin/bash

# Script para configurar domínio personalizado no AWS Amplify
# AGROTM - agrisync.com.br

echo "🚀 Configurando domínio personalizado para AGROTM..."

# Configurar variáveis
APP_ID="d2d5j98tau5snm"
DOMAIN="agrisync.com.br"
BRANCH="main"

# Verificar se o AWS CLI está configurado
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI não encontrado. Instale o AWS CLI primeiro."
    exit 1
fi

# Verificar se o Amplify CLI está configurado
if ! command -v amplify &> /dev/null; then
    echo "❌ Amplify CLI não encontrado. Instale o Amplify CLI primeiro."
    exit 1
fi

echo "✅ AWS CLI e Amplify CLI encontrados"

# Configurar domínio personalizado
echo "🔧 Configurando domínio personalizado: $DOMAIN"

# Adicionar domínio personalizado
aws amplify create-domain-association \
    --app-id $APP_ID \
    --domain-name $DOMAIN \
    --sub-domains subdomain=www,branchName=$BRANCH

if [ $? -eq 0 ]; then
    echo "✅ Domínio personalizado configurado com sucesso!"
    echo "🌐 URL principal: https://$DOMAIN"
    echo "🌐 Subdomínio: https://www.$DOMAIN"
else
    echo "❌ Erro ao configurar domínio personalizado"
    exit 1
fi

# Verificar status da configuração
echo "🔍 Verificando status da configuração..."
aws amplify get-domain-association \
    --app-id $APP_ID \
    --domain-name $DOMAIN

echo "✅ Configuração de domínio concluída!"
echo "📋 Próximos passos:"
echo "1. Configure os nameservers no seu provedor de domínio"
echo "2. Aguarde a propagação DNS (pode levar até 48 horas)"
echo "3. O SSL será configurado automaticamente pela AWS"
