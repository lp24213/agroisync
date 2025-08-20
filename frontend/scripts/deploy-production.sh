#!/bin/bash

# Script de Deploy para Produção - AGROISYNC
# Este script prepara e executa o deploy de produção

set -e  # Parar em caso de erro

echo "🚀 AGROISYNC - Deploy de Produção"
echo "=================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório frontend/"
    exit 1
fi

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Erro: Node.js não está instalado"
    exit 1
fi

# Verificar versão do Node.js (requer 18+)
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Erro: Node.js 18+ é necessário. Versão atual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) - OK"

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ Erro: npm não está instalado"
    exit 1
fi

echo "✅ npm $(npm -v) - OK"

# Verificar se o arquivo de ambiente de produção existe
if [ ! -f "env.production" ]; then
    echo "❌ Erro: Arquivo env.production não encontrado"
    echo "Crie o arquivo com as configurações de produção"
    exit 1
fi

echo "✅ Arquivo de ambiente de produção - OK"

# Limpar instalações anteriores
echo "🧹 Limpando instalações anteriores..."
rm -rf node_modules
rm -rf .next
rm -rf out

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci --only=production

# Verificar se não há vulnerabilidades críticas
echo "🔒 Verificando vulnerabilidades..."
npm audit --audit-level=moderate || {
    echo "⚠️  Aviso: Vulnerabilidades encontradas. Verifique antes do deploy."
    read -p "Continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deploy cancelado pelo usuário"
        exit 1
    fi
}

# Configurar variáveis de ambiente
echo "⚙️  Configurando variáveis de ambiente..."
cp env.production .env.production

# Executar build de produção
echo "🔨 Executando build de produção..."
npm run build

# Verificar se o build foi bem-sucedido
if [ ! -d ".next" ]; then
    echo "❌ Erro: Build falhou - diretório .next não foi criado"
    exit 1
fi

echo "✅ Build de produção concluído com sucesso!"

# Verificar tamanho do build
BUILD_SIZE=$(du -sh .next | cut -f1)
echo "📊 Tamanho do build: $BUILD_SIZE"

# Verificar se há arquivos estáticos
if [ ! -d ".next/static" ]; then
    echo "⚠️  Aviso: Diretório de arquivos estáticos não encontrado"
fi

# Preparar para deploy
echo "🚀 Preparando para deploy..."

# Criar arquivo de status do deploy
echo "Deploy realizado em: $(date)" > deploy-status.txt
echo "Versão: $(node -v)" >> deploy-status.txt
echo "Build size: $BUILD_SIZE" >> deploy-status.txt

echo ""
echo "🎉 Deploy de produção preparado com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis de ambiente no AWS Amplify"
echo "2. Use o arquivo amplify-production.yml para o build"
echo "3. Configure o domínio personalizado se necessário"
echo "4. Monitore os logs de deploy"
echo ""
echo "📁 Arquivos gerados:"
echo "- .next/ (build de produção)"
echo "- deploy-status.txt (status do deploy)"
echo "- amplify-production.yml (configuração do Amplify)"
echo ""
echo "🔗 Para fazer o deploy no AWS Amplify:"
echo "1. Faça commit e push das alterações"
echo "2. Configure o arquivo amplify-production.yml no console"
echo "3. Configure as variáveis de ambiente"
echo "4. Execute o deploy"
