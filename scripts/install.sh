#!/bin/bash

echo "🚀 Iniciando instalação automática do AGROTM..."

npm install

echo "✅ Dependências instaladas."

echo "🔧 Configurando ambiente..."
cp .env.example .env.local

echo "📦 Buildando projeto..."
npm run build

echo "✅ Projeto AGROTM pronto para iniciar!"
echo "🔥 Rode com: npm run dev"