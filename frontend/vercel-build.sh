#!/bin/bash

# Script de build para Vercel
echo "🚀 Iniciando build para Vercel..."

# Navegar para o diretório frontend
cd frontend

# Instalar dependências
echo "📦 Instalando dependências..."
npm install --production=false

# Verificar se a instalação foi bem-sucedida
if [ $? -ne 0 ]; then
    echo "❌ Erro na instalação das dependências"
    exit 1
fi

# Executar build
echo "🔨 Executando build..."
npm run build

# Verificar se o build foi bem-sucedido
if [ $? -ne 0 ]; then
    echo "❌ Erro no build"
    exit 1
fi

echo "✅ Build concluído com sucesso!"
echo "📁 Diretório de saída: frontend/.next"

# Listar arquivos gerados
echo "📋 Arquivos gerados:"
ls -la .next/

exit 0
