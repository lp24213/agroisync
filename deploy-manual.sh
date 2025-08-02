#!/bin/bash

echo "🚀 AGROTM.SOL - Deploy Manual"
echo "=============================="

# Verificar se estamos no diretório correto
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

echo "📦 Instalando dependências do frontend..."
cd frontend
npm install

echo "🔨 Fazendo build do frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build realizado com sucesso!"
    echo "🚀 Deploy manual concluído!"
    echo "🌐 Acesse: https://agrotm-solana.vercel.app"
    echo "🌐 Status: https://agrotm-solana.vercel.app/status"
    echo "🧪 Teste: https://agrotm-solana.vercel.app/test"
else
    echo "❌ Erro no build"
    exit 1
fi 