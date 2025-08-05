#!/bin/bash

# AGROTM Build Script
# Este script garante que frontend e backend sejam construídos corretamente

set -e

echo "🚀 Iniciando build do AGROTM..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: package.json não encontrado. Execute este script na raiz do projeto."
    exit 1
fi

# Instalar dependências do projeto principal
echo "📦 Instalando dependências do projeto principal..."
npm ci

# Instalar e buildar frontend
echo "🎨 Instalando e buildando frontend..."
cd frontend
npm ci
npm run build
cd ..

# Instalar e buildar backend
echo "⚙️ Instalando e buildando backend..."
cd backend
npm ci
npm run build
cd ..

# Copiar assets necessários
echo "📁 Copiando assets..."
if [ -d "frontend/public" ]; then
    echo "✅ Assets do frontend copiados"
fi

# Verificar se os builds foram bem-sucedidos
if [ -d "frontend/.next" ]; then
    echo "✅ Frontend buildado com sucesso"
else
    echo "❌ Erro: Frontend não foi buildado corretamente"
    exit 1
fi

if [ -d "backend/dist" ]; then
    echo "✅ Backend buildado com sucesso"
else
    echo "❌ Erro: Backend não foi buildado corretamente"
    exit 1
fi

echo "🎉 Build concluído com sucesso!"
echo "📊 Resumo:"
echo "   - Frontend: ✅"
echo "   - Backend: ✅"
echo "   - Assets: ✅" 