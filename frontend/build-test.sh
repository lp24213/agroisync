#!/bin/bash

# AGROTM Frontend Build Test Script
# Este script testa o build local antes do deploy

echo "🧪 Iniciando teste de build local..."

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

# Verificar tipos TypeScript
echo "🔍 Verificando tipos TypeScript..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "❌ Erros de tipo encontrados"
    exit 1
fi

# Executar lint
echo "🔍 Executando lint..."
npm run lint

if [ $? -ne 0 ]; then
    echo "❌ Erros de lint encontrados"
    exit 1
fi

# Build de produção
echo "🔨 Executando build de produção..."
NODE_ENV=production npm run build

# Verificar se o build foi bem-sucedido
if [ $? -ne 0 ]; then
    echo "❌ Falha no build"
    exit 1
fi

echo "✅ Build local bem-sucedido!"
echo "📁 Arquivos gerados em .next/"

# Listar arquivos importantes
echo "📋 Arquivos de build:"
ls -la .next/

echo "🎉 Teste de build concluído com sucesso!"
echo "🚀 O projeto está pronto para deploy!" 