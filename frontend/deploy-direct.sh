#!/bin/bash

echo "🚀 AGROTM.SOL - Deploy Direto para Vercel"
echo "=========================================="

# Navegar para o diretório frontend
cd frontend

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Build do projeto
echo "🔨 Fazendo build..."
npm run build

# Deploy para Vercel
echo "🚀 Fazendo deploy..."
vercel --prod --yes

echo "✅ Deploy concluído!" 