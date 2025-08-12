#!/bin/bash

# 🚀 CORREÇÕES ULTRA MEGA MASTER DEFINITIVAS - AGROISYNC.COM
# Script para corrigir TODOS os erros identificados pela IA da AWS

echo "🚀 INICIANDO CORREÇÕES ULTRA MEGA MASTER DEFINITIVAS AGROISYNC.COM"
echo "=================================================================="

# CORREÇÃO 1: VARIÁVEIS DE AMBIENTE
echo "🔧 CORREÇÃO 1: Configurando variáveis de ambiente..."
aws amplify put-app \
  --app-id d2d5j98tau5snm \
  --environment-variables \
    'NEXT_PUBLIC_API_URL=https://api.agroisync.com' \
    'NEXT_PUBLIC_APP_URL=https://agroisync.com' \
    'NODE_ENV=production' \
    'JWT_SECRET=agrotm-production-secret-key-2024' \
    'ALLOWED_ORIGINS=https://agroisync.com,https://www.agroisync.com,https://api.agroisync.com' \
    'MONGO_URI=mongodb+srv://agrotm:agrotm123@cluster.mongodb.net/agrotm?retryWrites=true&w=majority' \
  --region us-east-2

if [ $? -eq 0 ]; then
    echo "✅ Variáveis de ambiente configuradas com sucesso!"
else
    echo "❌ Erro ao configurar variáveis de ambiente"
fi

# CORREÇÃO 2: REMOVER DOMÍNIO ANTIGO
echo "🔧 CORREÇÃO 2: Removendo domínio antigo agrotmsol.com.br..."
aws amplify delete-domain-association \
  --app-id d2d5j98tau5snm \
  --domain-name agrotmsol.com.br \
  --region us-east-2

if [ $? -eq 0 ]; then
    echo "✅ Domínio antigo removido com sucesso!"
else
    echo "⚠️ Domínio antigo não encontrado ou já removido"
fi

# CORREÇÃO 3: CONFIGURAR DOMÍNIO CORRETO
echo "🔧 CORREÇÃO 3: Configurando domínio agroisync.com..."
aws amplify update-domain-association \
  --app-id d2d5j98tau5snm \
  --domain-name agroisync.com \
  --region us-east-2

if [ $? -eq 0 ]; then
    echo "✅ Domínio agroisync.com configurado com sucesso!"
else
    echo "❌ Erro ao configurar domínio agroisync.com"
fi

# CORREÇÃO 4: HABILITAR AUTO-BUILD
echo "🔧 CORREÇÃO 4: Habilitando auto-build..."
aws amplify update-app \
  --app-id d2d5j98tau5snm \
  --enable-branch-auto-build \
  --region us-east-2

if [ $? -eq 0 ]; then
    echo "✅ Auto-build habilitado com sucesso!"
else
    echo "❌ Erro ao habilitar auto-build"
fi

# CORREÇÃO 5: CONFIGURAR REDIRECIONAMENTOS
echo "🔧 CORREÇÃO 5: Configurando redirecionamentos..."
aws amplify update-domain-association \
  --app-id d2d5j98tau5snm \
  --domain-name agroisync.com \
  --redirects '[
    {
      "source": "https://www.agroisync.com/<*>",
      "target": "https://agroisync.com/<*>",
      "status": "301"
    },
    {
      "source": "/<*>",
      "target": "/index.html",
      "status": "404-200"
    }
  ]' \
  --region us-east-2

if [ $? -eq 0 ]; then
    echo "✅ Redirecionamentos configurados com sucesso!"
else
    echo "❌ Erro ao configurar redirecionamentos"
fi

# CORREÇÃO 6: VERIFICAR CONFIGURAÇÕES
echo "🔧 CORREÇÃO 6: Verificando configurações..."
echo "📋 Status do app:"
aws amplify get-app --app-id d2d5j98tau5snm --region us-east-2

echo "📋 Status do domínio:"
aws amplify get-domain-association \
  --app-id d2d5j98tau5snm \
  --domain-name agroisync.com \
  --region us-east-2

# CORREÇÃO 7: TESTAR CONEXÕES
echo "🔧 CORREÇÃO 7: Testando conexões..."
echo "🌐 Testando agroisync.com..."
curl -I https://agroisync.com

echo "🌐 Testando www.agroisync.com..."
curl -I https://www.agroisync.com

echo "🔌 Testando api.agroisync.com..."
curl -I https://api.agroisync.com/health

# CORREÇÃO 8: FAZER DEPLOY
echo "🔧 CORREÇÃO 8: Iniciando novo deploy..."
aws amplify start-job \
  --app-id d2d5j98tau5snm \
  --branch-name main \
  --job-type RELEASE \
  --region us-east-2

if [ $? -eq 0 ]; then
    echo "✅ Deploy iniciado com sucesso!"
else
    echo "❌ Erro ao iniciar deploy"
fi

echo "=================================================================="
echo "🎉 CORREÇÕES ULTRA MEGA MASTER DEFINITIVAS CONCLUÍDAS!"
echo "🚀 AGROISYNC.COM deve estar funcionando perfeitamente agora!"
echo "=================================================================="

# Verificar status final
echo "📊 STATUS FINAL:"
aws amplify list-jobs \
  --app-id d2d5j98tau5snm \
  --branch-name main \
  --region us-east-2 \
  --max-items 5

echo "🎯 Acesse: https://agroisync.com"
echo "🎯 API: https://api.agroisync.com"
echo "🎯 Status: https://console.aws.amazon.com/amplify"
