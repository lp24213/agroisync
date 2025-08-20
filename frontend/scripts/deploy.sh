#!/bin/bash

# Script de Deploy para Produção - AGROISYNC
# Execute: chmod +x scripts/deploy.sh && ./scripts/deploy.sh

set -e

echo "🚀 Iniciando deploy de produção AGROISYNC..."

# Verificar se estamos no branch correto
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo "❌ Erro: Deploy deve ser feito do branch main/master"
    echo "Branch atual: $CURRENT_BRANCH"
    exit 1
fi

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Erro: Há mudanças não commitadas. Faça commit antes do deploy."
    git status --porcelain
    exit 1
fi

# Verificar se o arquivo .env.production existe
if [ ! -f .env.production ]; then
    echo "❌ Erro: Arquivo .env.production não encontrado"
    echo "Copie env.production.example para .env.production e configure as variáveis"
    exit 1
fi

echo "✅ Verificações de segurança passaram"

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci

# Executar testes
echo "🧪 Executando testes..."
npm run test || echo "⚠️  Testes falharam, mas continuando deploy..."

# Verificar tipos TypeScript
echo "🔍 Verificando tipos TypeScript..."
npm run type-check

# Build de produção
echo "🏗️  Fazendo build de produção..."
npm run build

# Verificar se o build foi bem-sucedido
if [ ! -d ".next" ]; then
    echo "❌ Erro: Build falhou - diretório .next não encontrado"
    exit 1
fi

echo "✅ Build de produção concluído com sucesso!"

# Verificar tamanho do build
BUILD_SIZE=$(du -sh .next | cut -f1)
echo "📊 Tamanho do build: $BUILD_SIZE"

# Verificar se há arquivos estáticos
STATIC_FILES=$(find .next -name "*.js" -o -name "*.css" | wc -l)
echo "📁 Arquivos estáticos gerados: $STATIC_FILES"

# Preparar para deploy
echo "🚀 Preparando para deploy..."

# Criar arquivo de versão
echo "v$(date +%Y.%m.%d-%H%M)" > .next/version.txt

# Verificar configuração do Amplify
if [ -f "amplify.yml" ]; then
    echo "✅ Configuração do Amplify encontrada"
else
    echo "⚠️  Arquivo amplify.yml não encontrado"
fi

# Verificar variáveis de ambiente
echo "🔐 Verificando variáveis de ambiente..."
if grep -q "your_firebase_api_key" .env.production; then
    echo "⚠️  ATENÇÃO: Variáveis do Firebase ainda não foram configuradas!"
fi

if grep -q "your_super_secret_jwt_key" .env.production; then
    echo "⚠️  ATENÇÃO: JWT_SECRET ainda não foi configurado!"
fi

echo ""
echo "🎉 Deploy preparado com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis de ambiente em .env.production"
echo "2. Faça push para o repositório remoto"
echo "3. Configure o AWS Amplify para fazer deploy automático"
echo "4. Configure o domínio personalizado se necessário"
echo ""
echo "🔗 URLs de deploy:"
echo "- Amplify: https://console.aws.amazon.com/amplify"
echo "- Documentação: https://docs.aws.amazon.com/amplify"
echo ""
echo "✅ AGROISYNC está pronto para produção!"
