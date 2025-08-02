#!/bin/bash

# AGROTM Frontend - Teste Local
# Este script testa o build e start local

echo "🧪 Iniciando teste local do frontend..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ package.json não encontrado. Execute este script no diretório frontend."
    exit 1
fi

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf .next out

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci

# Verificar se a instalação foi bem-sucedida
if [ $? -ne 0 ]; then
    echo "❌ Falha na instalação das dependências"
    exit 1
fi

# Build de produção
echo "🔨 Executando build de produção..."
npm run build

# Verificar se o build foi bem-sucedido
if [ $? -ne 0 ]; then
    echo "❌ Falha no build"
    exit 1
fi

echo "✅ Build local bem-sucedido!"
echo "🚀 Iniciando servidor local..."

# Iniciar servidor
npm start 