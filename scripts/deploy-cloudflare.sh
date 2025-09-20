#!/bin/bash

# Script de Deploy para Cloudflare Workers
echo "🚀 DEPLOY AGROSYNC BACKEND PARA CLOUDFLARE WORKERS"
echo "=================================================="

# Verificar se wrangler está instalado
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler não encontrado. Instalando..."
    npm install -g wrangler
fi

# Verificar se está logado
echo "🔐 Verificando autenticação..."
wrangler whoami

if [ $? -ne 0 ]; then
    echo "❌ Não está logado no Cloudflare. Faça login primeiro:"
    echo "wrangler login"
    exit 1
fi

# Configurar secrets
echo "🔑 Configurando secrets..."
echo "Configure os seguintes secrets no Cloudflare:"
echo "1. STRIPE_SECRET_KEY"
echo "2. STRIPE_WEBHOOK_SECRET" 
echo "3. MONGODB_URI"
echo "4. JWT_SECRET"
echo ""

read -p "Pressione Enter quando tiver configurado os secrets..."

# Deploy para staging
echo "📦 Deploy para staging..."
wrangler deploy --env staging

if [ $? -eq 0 ]; then
    echo "✅ Deploy staging concluído!"
    echo "URL: https://agroisync-staging.luispaulooliveira767.workers.dev"
else
    echo "❌ Erro no deploy staging"
    exit 1
fi

# Teste de health check
echo "🔍 Testando health check..."
curl -f https://agroisync-staging.luispaulooliveira767.workers.dev/health

if [ $? -eq 0 ]; then
    echo "✅ Health check OK!"
    
    # Deploy para produção
    read -p "Deploy para produção? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Deploy para produção..."
        wrangler deploy --env production
        
        if [ $? -eq 0 ]; then
        echo "✅ Deploy produção concluído!"
        echo "URL: https://agroisync-prod.luispaulooliveira767.workers.dev"
        else
            echo "❌ Erro no deploy produção"
            exit 1
        fi
    fi
else
    echo "❌ Health check falhou"
    exit 1
fi

echo ""
echo "🎉 DEPLOY CONCLUÍDO!"
echo "===================="
echo "Staging: https://agroisync-staging.luispaulooliveira767.workers.dev"
echo "Produção: https://agroisync-prod.luispaulooliveira767.workers.dev"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Configure webhook no Stripe: https://agroisync-prod.luispaulooliveira767.workers.dev/api/payments/stripe/webhook"
echo "2. Atualize REACT_APP_API_URL no frontend"
echo "3. Teste pagamentos"
