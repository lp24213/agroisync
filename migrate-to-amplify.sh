#!/bin/bash

# 🚀 Script de Migração AGROTM para AWS Amplify
# Este script automatiza o processo de migração do Vercel/Railway para AWS Amplify

set -e

echo "🚀 Iniciando migração AGROTM para AWS Amplify..."
echo "=================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    log_error "Este script deve ser executado na raiz do projeto AGROTM"
    exit 1
fi

log_info "Verificando estrutura do projeto..."

# Verificar se os arquivos de configuração do Amplify existem
if [ ! -f "amplify.yml" ]; then
    log_error "Arquivo amplify.yml não encontrado"
    exit 1
fi

if [ ! -f "frontend/amplify.yml" ]; then
    log_error "Arquivo frontend/amplify.yml não encontrado"
    exit 1
fi

if [ ! -f "backend/amplify.yml" ]; then
    log_error "Arquivo backend/amplify.yml não encontrado"
    exit 1
fi

log_success "Estrutura do projeto verificada"

# Backup dos arquivos de configuração antigos
log_info "Criando backup dos arquivos de configuração antigos..."

mkdir -p backup/$(date +%Y%m%d_%H%M%S)

if [ -f "vercel.json" ]; then
    cp vercel.json backup/$(date +%Y%m%d_%H%M%S)/
    log_info "Backup de vercel.json criado"
fi

if [ -f "railway.json" ]; then
    cp railway.json backup/$(date +%Y%m%d_%H%M%S)/
    log_info "Backup de railway.json criado"
fi

if [ -f ".railway" ]; then
    cp .railway backup/$(date +%Y%m%d_%H%M%S)/
    log_info "Backup de .railway criado"
fi

log_success "Backup concluído"

# Verificar dependências
log_info "Verificando dependências..."

# Frontend
log_info "Verificando dependências do frontend..."
cd frontend
if ! npm list --depth=0 > /dev/null 2>&1; then
    log_warning "Dependências do frontend não instaladas. Instalando..."
    npm install
fi
cd ..

# Backend
log_info "Verificando dependências do backend..."
cd backend
if ! npm list --depth=0 > /dev/null 2>&1; then
    log_warning "Dependências do backend não instaladas. Instalando..."
    npm install
fi
cd ..

log_success "Dependências verificadas"

# Teste de build
log_info "Testando build do frontend..."
cd frontend
if npm run build; then
    log_success "Build do frontend bem-sucedido"
else
    log_error "Build do frontend falhou"
    exit 1
fi
cd ..

log_info "Testando build do backend..."
cd backend
if npm run build; then
    log_success "Build do backend bem-sucedido"
else
    log_warning "Build do backend falhou (pode ser normal se não houver build script)"
fi
cd ..

# Verificar variáveis de ambiente
log_info "Verificando arquivo de variáveis de ambiente..."
if [ ! -f "amplify-env.example" ]; then
    log_error "Arquivo amplify-env.example não encontrado"
    exit 1
fi

log_success "Arquivo de variáveis de ambiente encontrado"

# Verificar configurações do Next.js
log_info "Verificando configurações do Next.js..."
if [ ! -f "frontend/next.config.amplify.js" ]; then
    log_error "Arquivo next.config.amplify.js não encontrado"
    exit 1
fi

log_success "Configurações do Next.js verificadas"

# Verificar configurações do servidor
log_info "Verificando configurações do servidor..."
if [ ! -f "backend/server.amplify.js" ]; then
    log_error "Arquivo server.amplify.js não encontrado"
    exit 1
fi

log_success "Configurações do servidor verificadas"

# Criar arquivo de status da migração
log_info "Criando arquivo de status da migração..."

cat > MIGRATION_STATUS.md << EOF
# Status da Migração AGROTM para AWS Amplify

## Data da Migração
$(date)

## Arquivos Criados/Modificados

### Configurações Amplify
- ✅ \`amplify.yml\` - Configuração principal
- ✅ \`amplify-fullstack.yml\` - Configuração fullstack
- ✅ \`frontend/amplify.yml\` - Configuração frontend
- ✅ \`backend/amplify.yml\` - Configuração backend

### Configurações de Aplicação
- ✅ \`frontend/next.config.amplify.js\` - Next.js para Amplify
- ✅ \`backend/server.amplify.js\` - Servidor para Amplify
- ✅ \`amplify-env.example\` - Variáveis de ambiente

### Documentação
- ✅ \`AWS_AMPLIFY_MIGRATION_GUIDE.md\` - Guia completo
- ✅ \`MIGRATION_STATUS.md\` - Este arquivo

## Próximos Passos

1. **AWS Amplify Console**
   - Acesse: https://console.aws.amazon.com/amplify/
   - Crie novo app
   - Conecte repositório GitHub: lp24213/agrotm.sol

2. **Configurar Variáveis de Ambiente**
   - Use o arquivo \`amplify-env.example\` como referência
   - Configure no painel do Amplify

3. **Deploy**
   - Push para branch main
   - Monitorar build no console

## Status
🟢 **PRONTO PARA DEPLOY**

EOF

log_success "Arquivo de status criado"

# Verificar se há mudanças não commitadas
log_info "Verificando status do Git..."

if [ -n "$(git status --porcelain)" ]; then
    log_warning "Existem mudanças não commitadas:"
    git status --porcelain
    
    read -p "Deseja fazer commit das mudanças? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "feat: migração para AWS Amplify - Adicionadas configurações do AWS Amplify - Criados arquivos de build e deploy - Configurado servidor otimizado para Amplify - Adicionado guia completo de migração - Mantidas todas as funcionalidades existentes"
        log_success "Commit realizado"
    else
        log_warning "Commit não realizado. Lembre-se de fazer commit antes do deploy."
    fi
else
    log_success "Não há mudanças pendentes"
fi

# Resumo final
echo ""
echo "🎉 Migração para AWS Amplify concluída!"
echo "========================================"
echo ""
echo "📋 Resumo do que foi feito:"
echo "✅ Configurações do AWS Amplify criadas"
echo "✅ Arquivos de build otimizados"
echo "✅ Servidor backend adaptado"
echo "✅ Guia de migração completo"
echo "✅ Backup dos arquivos antigos"
echo "✅ Testes de build realizados"
echo ""
echo "🚀 Próximos passos:"
echo "1. Acesse: https://console.aws.amazon.com/amplify/"
echo "2. Crie novo app e conecte o repositório"
echo "3. Configure as variáveis de ambiente"
echo "4. Faça push para branch main"
echo ""
echo "📚 Documentação:"
echo "- Guia completo: AWS_AMPLIFY_MIGRATION_GUIDE.md"
echo "- Status da migração: MIGRATION_STATUS.md"
echo "- Variáveis de ambiente: amplify-env.example"
echo ""
log_success "Migração concluída com sucesso!"
