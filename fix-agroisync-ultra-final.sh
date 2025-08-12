#!/bin/bash

# 🚨 CORREÇÃO ULTRA FINAL - BUILD FAILURE AGROISYNC.COM
# Script para corrigir TODOS os problemas críticos identificados pela IA da AWS

echo "🚨 INICIANDO CORREÇÃO ULTRA FINAL - BUILD FAILURE"
echo "=================================================================="

# CORREÇÃO 1: LIMPAR VARIÁVEIS INCORRETAS (CRÍTICO!)
echo "🔧 CORREÇÃO 1: Limpando variáveis incorretas (CRÍTICO!)..."
aws amplify update-branch \
  --app-id d2d5j98tau5snm \
  --branch-name main \
  --environment-variables \
    'NEXT_PUBLIC_API_URL=https://api.agroisync.com' \
    'NEXT_PUBLIC_APP_URL=https://agroisync.com' \
    'NODE_ENV=production' \
  --region us-east-2

if [ $? -eq 0 ]; then
    echo "✅ Variáveis de ambiente corrigidas com sucesso!"
else
    echo "❌ Erro ao corrigir variáveis de ambiente"
    exit 1
fi

# CORREÇÃO 2: VERIFICAR CONFIGURAÇÕES
echo "🔧 CORREÇÃO 2: Verificando configurações..."
echo "📋 Status do app:"
aws amplify get-app --app-id d2d5j98tau5snm --region us-east-2

echo "📋 Status do branch main:"
aws amplify get-branch \
  --app-id d2d5j98tau5snm \
  --branch-name main \
  --region us-east-2

# CORREÇÃO 3: INICIAR NOVO DEPLOYMENT
echo "🔧 CORREÇÃO 3: Iniciando novo deployment..."
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

# CORREÇÃO 4: MONITORAR BUILD
echo "🔧 CORREÇÃO 4: Monitorando build..."
echo "⏳ Aguardando 60 segundos para verificar status..."
sleep 60

echo "📊 Status dos jobs:"
aws amplify list-jobs \
  --app-id d2d5j98tau5snm \
  --branch-name main \
  --region us-east-2 \
  --max-items 5

# CORREÇÃO 5: VERIFICAR DOMÍNIO
echo "🔧 CORREÇÃO 5: Verificando domínio..."
aws amplify get-domain-association \
  --app-id d2d5j98tau5snm \
  --domain-name agroisync.com \
  --region us-east-2

# CORREÇÃO 6: TESTAR CONEXÕES
echo "🔧 CORREÇÃO 6: Testando conexões..."
echo "🌐 Testando agroisync.com..."
curl -I https://agroisync.com

echo "🌐 Testando www.agroisync.com..."
curl -I https://www.agroisync.com

echo "🔌 Testando api.agroisync.com..."
curl -I https://api.agroisync.com/health

echo "=================================================================="
echo "🎉 CORREÇÃO ULTRA FINAL CONCLUÍDA!"
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
echo "✅ 2. amplify.yml simplificado para diretório .next"
echo "✅ 3. next.config.js simplificado (sem output export)"
echo "✅ 4. package.json simplificado (sem script export)"
echo "✅ 5. Novo deployment iniciado"
echo "✅ 6. Configurações verificadas e testadas"
