#!/bin/bash

echo "🚀 AGROSYNC - Deploy Limpo e Definitivo"
echo "=========================================="

# Verificar se estamos no diretório correto
if [ ! -f "amplify.yml" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto"
    exit 1
fi

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf frontend/build/
rm -rf frontend/node_modules/
rm -rf backend/dist/
rm -rf backend/node_modules/

# Limpar cache do Amplify
echo "🗑️ Limpando cache do Amplify..."
amplify clean

# Reinstalar dependências do frontend
echo "📦 Reinstalando dependências do frontend..."
cd frontend
npm ci --production=false
cd ..

# Reinstalar dependências do backend
echo "📦 Reinstalando dependências do backend..."
cd backend
npm ci --production=false
cd ..

# Verificar configuração do Amplify
echo "🔍 Verificando configuração do Amplify..."
amplify status

# Fazer push das alterações
echo "🚀 Fazendo push das alterações..."
amplify push

# Verificar se o deploy foi bem-sucedido
echo "✅ Deploy concluído!"
echo "🌐 Verifique o status no console do AWS Amplify"
echo "🔗 URL: https://console.aws.amazon.com/amplify/"
