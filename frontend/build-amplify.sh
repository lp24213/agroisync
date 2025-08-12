#!/bin/bash

# Script de build robusto para AWS Amplify
# AGROTM Frontend

set -e

echo "🚀 AGROTM Frontend - Build para AWS Amplify"
echo "=============================================="

# Verificar Node.js
echo "📋 Verificando Node.js..."
node --version
npm --version

# Limpar instalações anteriores
echo "🧹 Limpando instalações anteriores..."
rm -rf node_modules package-lock.json .next out

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci --production=false --include=dev

# Verificar TypeScript
echo "🔍 Verificando TypeScript..."
npx tsc --version

# Verificar dependências críticas
echo "✅ Verificando dependências críticas..."
npm list typescript
npm list next
npm list react

# Copiar configuração específica para AWS Amplify
echo "⚙️ Configurando Next.js para AWS Amplify..."
cp next.config.amplify.js next.config.js

# Build de produção
echo "🔨 Executando build de produção..."
npm run build

# Verificar arquivos gerados
echo "📁 Verificando arquivos gerados..."
ls -la .next/standalone/frontend/

# Verificar arquivos essenciais
echo "🔍 Verificando arquivos essenciais..."
if [ -f ".next/standalone/frontend/server.js" ]; then
    echo "✅ server.js encontrado"
else
    echo "❌ server.js não encontrado"
    exit 1
fi

if [ -d ".next/standalone/frontend/app" ]; then
    echo "✅ app directory encontrado"
else
    echo "❌ app directory não encontrado"
    exit 1
fi

if [ -d ".next/standalone/frontend/public" ]; then
    echo "✅ public directory encontrado"
else
    echo "❌ public directory não encontrado"
    exit 1
fi

echo "🎉 Build concluído com sucesso!"
echo "📦 Frontend pronto para deploy no AWS Amplify"
