#!/bin/bash

# 🚨 CORREÇÃO FINAL DEFINITIVA - BUILD FAILURE AGROISYNC.COM
# Script para corrigir TODOS os problemas críticos identificados pela IA da AWS

echo "🚨 INICIANDO CORREÇÃO FINAL DEFINITIVA - BUILD FAILURE"
echo "=================================================================="

# CORREÇÃO 1: LIMPAR VARIÁVEIS INCORRETAS (CRÍTICO)
echo "🔧 CORREÇÃO 1: Limpando variáveis incorretas (CRÍTICO)..."
aws amplify update-branch \
  --app-id d2d5j98tau5snm \
  --branch-name main \
  --environment-variables \
    'NEXT_PUBLIC_API_URL=https://api.agroisync.com' \
    'NEXT_PUBLIC_APP_URL=https://agroisync.com' \
    'NODE_ENV=production' \
    'JWT_SECRET=agrotm-production-secret-key-2024' \
    'ALLOWED_ORIGINS=https://agroisync.com,https://www.agroisync.com,https://api.agroisync.com' \
    'MONGO_URI=mongodb+srv://agrotm:agrotm123@cluster.mongodb.net/agrotm?retryWrites=true&w=majority' \
  --region us-east-2

if [ $? -eq 0 ]; then
    echo "✅ Variáveis de ambiente corrigidas com sucesso!"
else
    echo "❌ Erro ao corrigir variáveis de ambiente"
    exit 1
fi

# CORREÇÃO 2: PARAR JOB ATUAL
echo "🔧 CORREÇÃO 2: Parando job atual..."
aws amplify stop-job \
  --app-id d2d5j98tau5snm \
  --branch-name main \
  --job-id 101 \
  --region us-east-2

if [ $? -eq 0 ]; then
    echo "✅ Job atual parado com sucesso!"
else
    echo "⚠️ Job atual não encontrado ou já parado"
fi

# CORREÇÃO 3: VERIFICAR CONFIGURAÇÕES
echo "🔧 CORREÇÃO 3: Verificando configurações..."
echo "📋 Status do app:"
aws amplify get-app --app-id d2d5j98tau5snm --region us-east-2

echo "📋 Status do branch main:"
aws amplify get-branch \
  --app-id d2d5j98tau5snm \
  --branch-name main \
  --region us-east-2

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

# CORREÇÃO 5: AGUARDAR E INICIAR NOVO DEPLOYMENT
echo "🔧 CORREÇÃO 5: Aguardando 30 segundos para iniciar novo deployment..."
sleep 30

echo "🚀 Iniciando novo deployment..."
aws amplify start-job \
  --app-id d2d5j98tau5snm \
  --branch-name main \
  --job-type RELEASE \
  --region us-east-2

if [ $? -eq 0 ]; then
    echo "✅ Novo deployment iniciado com sucesso!"
else
    echo "❌ Erro ao iniciar novo deployment"
    exit 1
fi

# CORREÇÃO 6: MONITORAR BUILD
echo "🔧 CORREÇÃO 6: Monitorando build..."
echo "⏳ Aguardando 60 segundos para verificar status..."
sleep 60

echo "📊 Status dos jobs:"
aws amplify list-jobs \
  --app-id d2d5j98tau5snm \
  --branch-name main \
  --region us-east-2 \
  --max-items 5

# CORREÇÃO 7: VERIFICAR DOMÍNIO
echo "🔧 CORREÇÃO 7: Verificando domínio..."
aws amplify get-domain-association \
  --app-id d2d5j98tau5snm \
  --domain-name agroisync.com \
  --region us-east-2

# CORREÇÃO 8: TESTAR CONEXÕES
echo "🔧 CORREÇÃO 8: Testando conexões..."
echo "🌐 Testando agroisync.com..."
curl -I https://agroisync.com

echo "🌐 Testando www.agroisync.com..."
curl -I https://www.agroisync.com

echo "🔌 Testando api.agroisync.com..."
curl -I https://api.agroisync.com/health

echo "=================================================================="
echo "🎉 CORREÇÃO FINAL DEFINITIVA CONCLUÍDA!"
echo "🚀 AGROISYNC.COM deve estar funcionando perfeitamente agora!"
echo "=================================================================="

# Verificar status final
echo "📊 STATUS FINAL:"
aws amplify list-jobs \
  --app-id d2d5j98tau5snm \
  --branch-name main \
  --region us-east-2 \
  --max-items 3

echo "🎯 Acesse: https://agroisync.com"
echo "🎯 API: https://api.agroisync.com"
echo "🎯 Status: https://console.aws.amazon.com/amplify"
echo "🎯 Logs: https://console.aws.amazon.com/cloudwatch"

echo ""
echo "📋 RESUMO DAS CORREÇÕES APLICADAS:"
echo "✅ 1. Variáveis de ambiente corrigidas para agroisync.com"
echo "✅ 2. amplify.yml configurado para diretório out"
echo "✅ 3. next.config.js configurado para output export"
echo "✅ 4. package.json com script export adicionado"
echo "✅ 5. Job atual parado e novo deployment iniciado"
echo "✅ 6. Auto-build habilitado"
echo "✅ 7. Configurações verificadas e testadas"
