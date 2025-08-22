#!/bin/bash

# AGROISYNC Backend Deploy Script
# Este script faz deploy do backend com os secrets configurados

set -e

echo "🚀 Iniciando deploy do AGROISYNC Backend..."

# Verificar se o SAM CLI está instalado
if ! command -v sam &> /dev/null; then
    echo "❌ SAM CLI não encontrado. Instale o AWS SAM CLI primeiro."
    exit 1
fi

# Verificar se o arquivo de secrets existe
if [ ! -f "secrets.yaml" ]; then
    echo "❌ Arquivo secrets.yaml não encontrado!"
    echo "Crie o arquivo secrets.yaml com suas configurações antes de continuar."
    exit 1
fi

# Verificar se as variáveis obrigatórias estão definidas
if ! grep -q "StripeSecretKey" secrets.yaml; then
    echo "❌ StripeSecretKey não encontrada no secrets.yaml"
    exit 1
fi

if ! grep -q "MetamaskAdminAddress" secrets.yaml; then
    echo "❌ MetamaskAdminAddress não encontrada no secrets.yaml"
    exit 1
fi

echo "✅ Configurações verificadas"

# Build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build falhou!"
    exit 1
fi

echo "✅ Build concluído"

# Deploy com SAM
echo "🚀 Fazendo deploy com SAM..."

# Extrair valores dos secrets
STRIPE_SECRET_KEY=$(grep "StripeSecretKey:" secrets.yaml | cut -d'"' -f2)
METAMASK_ADDRESS=$(grep "MetamaskAdminAddress:" secrets.yaml | cut -d'"' -f2)
ENVIRONMENT=$(grep "Environment:" secrets.yaml | cut -d'"' -f2)

echo "📋 Configurações de deploy:"
echo "   Environment: $ENVIRONMENT"
echo "   Metamask Address: $METAMASK_ADDRESS"
echo "   Stripe Key: ${STRIPE_SECRET_KEY:0:20}..."

# Deploy
sam deploy \
    --template-file template.yaml \
    --stack-name agroisync-backend \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
        StripeSecretKey="$STRIPE_SECRET_KEY" \
        MetamaskAddress="$METAMASK_ADDRESS" \
        Environment="$ENVIRONMENT" \
    --region us-east-1 \
    --no-fail-on-empty-changeset

if [ $? -eq 0 ]; then
    echo "✅ Deploy concluído com sucesso!"
    
    # Obter outputs
    echo "📊 Outputs do deploy:"
    sam describe-stacks --stack-name agroisync-backend --query 'Stacks[0].Outputs' --output table
    
else
    echo "❌ Deploy falhou!"
    exit 1
fi

echo "🎉 AGROISYNC Backend deployado com sucesso!"
echo ""
echo "📝 Próximos passos:"
echo "   1. Configure as variáveis de ambiente no frontend"
echo "   2. Teste as APIs de pagamento"
echo "   3. Verifique os logs no CloudWatch"
echo "   4. Configure monitoramento e alertas"
