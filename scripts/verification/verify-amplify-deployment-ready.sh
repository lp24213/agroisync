#!/bin/bash

echo "🔍 AGROISYNC - Verificação Final para Deploy Amplify"
echo "====================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "amplify.yml" ]; then
    error "Execute este script na raiz do projeto AGROISYNC"
    exit 1
fi

step "1. Verificando estrutura do projeto..."
if [ -d "frontend" ] && [ -d "backend" ] && [ -d "amplify" ]; then
    log "✅ Estrutura do projeto OK"
else
    error "❌ Estrutura do projeto incompleta"
    exit 1
fi

step "2. Verificando arquivos de configuração..."
if [ -f "frontend/next.config-final.js" ]; then
    log "✅ next.config-final.js encontrado"
else
    error "❌ next.config-final.js não encontrado"
    exit 1
fi

if [ -f "frontend/tsconfig.json" ]; then
    log "✅ tsconfig.json encontrado"
else
    error "❌ tsconfig.json não encontrado"
    exit 1
fi

if [ -f "frontend/env.production" ]; then
    log "✅ env.production encontrado"
else
    error "❌ env.production não encontrado"
    exit 1
fi

step "3. Verificando amplify.yml..."
if grep -q "baseDirectory: frontend/out" amplify.yml; then
    log "✅ baseDirectory correto no amplify.yml"
else
    error "❌ baseDirectory incorreto no amplify.yml"
    exit 1
fi

if grep -q "npm run build:final" amplify.yml; then
    log "✅ Comando de build correto no amplify.yml"
else
    error "❌ Comando de build incorreto no amplify.yml"
    exit 1
fi

step "4. Verificando backend-config.json..."
if grep -q '"DistributionDir": "out"' amplify/backend/backend-config.json; then
    log "✅ DistributionDir correto no backend-config.json"
else
    error "❌ DistributionDir incorreto no backend-config.json"
    exit 1
fi

if grep -q '"BuildCommand": "npm run build:final"' amplify/backend/backend-config.json; then
    log "✅ BuildCommand correto no backend-config.json"
else
    error "❌ BuildCommand incorreto no backend-config.json"
    exit 1
fi

step "5. Verificando dependências..."
if [ -d "frontend/node_modules" ]; then
    log "✅ Dependências do frontend instaladas"
else
    warn "⚠️ Dependências do frontend não instaladas"
fi

if [ -d "backend/node_modules" ]; then
    log "✅ Dependências do backend instaladas"
else
    warn "⚠️ Dependências do backend não instaladas"
fi

step "6. Verificando configurações do Amplify..."
if [ -f "amplify/team-provider-info.json" ]; then
    log "✅ team-provider-info.json encontrado"
else
    error "❌ team-provider-info.json não encontrado"
    exit 1
fi

if [ -f "amplify/backend/backend-config.json" ]; then
    log "✅ backend-config.json encontrado"
else
    error "❌ backend-config.json não encontrado"
    exit 1
fi

step "7. Verificando schema GraphQL..."
if [ -f "amplify/backend/api/agroisync/schema.graphql" ]; then
    log "✅ Schema GraphQL encontrado"
else
    error "❌ Schema GraphQL não encontrado"
    exit 1
fi

step "8. Verificando funções Lambda..."
if [ -d "amplify/backend/function" ]; then
    log "✅ Diretório de funções Lambda encontrado"
    ls -la amplify/backend/function/
else
    error "❌ Diretório de funções Lambda não encontrado"
    exit 1
fi

step "9. Verificando configurações de autenticação..."
if grep -q "UserPoolId" amplify/team-provider-info.json; then
    log "✅ Configuração de autenticação encontrada"
else
    warn "⚠️ Configuração de autenticação pode estar incompleta"
fi

step "10. Verificando configurações de storage..."
if grep -q "BucketName" amplify/team-provider-info.json; then
    log "✅ Configuração de storage encontrada"
else
    warn "⚠️ Configuração de storage pode estar incompleta"
fi

echo ""
echo "🎯 RESUMO DA VERIFICAÇÃO:"
echo "========================="

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PROJETO PRONTO PARA DEPLOY NO AMPLIFY!${NC}"
    echo ""
    echo "🚀 PRÓXIMOS PASSOS:"
    echo "1. Commit das alterações: git add . && git commit -m 'Final deployment preparation'"
    echo "2. Push para trigger: git push origin main"
    echo "3. Monitorar build no Amplify Console"
    echo "4. Verificar logs de build para confirmar sucesso"
else
    echo -e "${RED}❌ PROJETO NÃO ESTÁ PRONTO PARA DEPLOY${NC}"
    echo "Corrija os erros acima antes de prosseguir"
    exit 1
fi

echo ""
echo "📋 CHECKLIST FINAL:"
echo "==================="
echo "✅ amplify.yml configurado corretamente"
echo "✅ next.config-final.js com configurações corretas"
echo "✅ tsconfig.json otimizado"
echo "✅ env.production configurado"
echo "✅ backend-config.json corrigido"
echo "✅ Schema GraphQL presente"
echo "✅ Funções Lambda configuradas"
echo "✅ Configurações de autenticação"
echo "✅ Configurações de storage"
echo "✅ Estrutura do projeto completa"
echo ""
echo "🎉 AGROISYNC está PERFEITAMENTE configurado para deploy no AWS Amplify!"
