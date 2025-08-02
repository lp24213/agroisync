#!/bin/bash

# AGROTM Frontend Vercel Build Script
# Este script é executado durante o deploy no Vercel

echo "🚀 Iniciando build do AGROTM Frontend..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ package.json não encontrado. Certifique-se de estar no diretório frontend."
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci --only=production

# Verificar se a instalação foi bem-sucedida
if [ $? -ne 0 ]; then
    echo "❌ Falha na instalação das dependências"
    exit 1
fi

# Executar build
echo "🔨 Executando build..."
npm run build

# Verificar se o build foi bem-sucedido
if [ $? -ne 0 ]; then
    echo "❌ Falha no build"
    exit 1
fi

echo "✅ Build concluído com sucesso!"
echo "📁 Arquivos gerados em .next/"

# Listar arquivos importantes
echo "📋 Arquivos de build:"
ls -la .next/

echo "🎉 Deploy pronto!" 