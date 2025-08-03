#!/bin/bash

# 🚀 Script de Configuração Vercel - AGROTM
# Este script ajuda a configurar o deploy automático no Vercel

set -e

echo "🚀 Configurando Deploy Automático - Vercel + GitHub Actions"
echo "=========================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ] || [ ! -d "frontend" ]; then
    print_error "Execute este script na raiz do projeto AGROTM"
    exit 1
fi

print_status "Verificando estrutura do projeto..."

# Verificar arquivos necessários
required_files=(
    ".github/workflows/ci-cd.yml"
    "frontend/vercel.json"
    "frontend/package.json"
    "frontend/next.config.js"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Arquivo necessário não encontrado: $file"
        exit 1
    fi
done

print_status "Estrutura do projeto verificada"

echo ""
print_info "📋 PRÓXIMOS PASSOS PARA CONFIGURAR O VERCEL:"
echo ""

print_info "1. 🌐 Criar Projeto no Vercel:"
echo "   - Acesse: https://vercel.com/dashboard"
echo "   - Clique em 'New Project'"
echo "   - Importe este repositório GitHub"
echo "   - Configure:"
echo "     • Framework Preset: Next.js"
echo "     • Root Directory: frontend"
echo "     • Build Command: pnpm build"
echo "     • Output Directory: .next"
echo "     • Install Command: pnpm install --frozen-lockfile"
echo ""

print_info "2. 🔑 Obter Credenciais do Vercel:"
echo ""

print_info "   VERCEL_TOKEN:"
echo "   - Acesse: https://vercel.com/account/tokens"
echo "   - Clique em 'Create Token'"
echo "   - Nome: AGROTM-GitHub-Actions"
echo "   - Expiration: No Expiration"
echo "   - Scope: Full Account"
echo "   - Copie o token gerado"
echo ""

print_info "   VERCEL_ORG_ID:"
echo "   - Acesse: https://vercel.com/account"
echo "   - Vá para 'Settings' > 'General'"
echo "   - Copie o 'Team ID' (team) ou 'User ID' (pessoal)"
echo ""

print_info "   VERCEL_PROJECT_ID:"
echo "   - No dashboard do Vercel, abra seu projeto"
echo "   - Vá para 'Settings' > 'General'"
echo "   - Copie o 'Project ID'"
echo ""

print_info "3. 🔐 Configurar Secrets no GitHub:"
echo "   - Vá para seu repositório no GitHub"
echo "   - Settings > Secrets and variables > Actions"
echo "   - Adicione os seguintes secrets:"
echo "     • VERCEL_TOKEN"
echo "     • VERCEL_ORG_ID"
echo "     • VERCEL_PROJECT_ID"
echo ""

print_info "4. 🚀 Testar Deploy:"
echo "   - Faça um push para a branch main"
echo "   - Verifique o status em:"
echo "     • GitHub: Actions tab"
echo "     • Vercel: Deployments"
echo ""

# Verificar se o Vercel CLI está instalado
if command -v vercel &> /dev/null; then
    print_status "Vercel CLI encontrado"

    echo ""
    print_info "🔧 Comandos úteis do Vercel CLI:"
    echo "   vercel login                    # Fazer login"
    echo "   vercel projects                # Listar projetos"
    echo "   vercel env ls                  # Listar variáveis de ambiente"
    echo "   vercel logs                    # Ver logs do deploy"
    echo "   vercel --help                  # Ver todos os comandos"
else
    print_warning "Vercel CLI não encontrado"
    echo "   Para instalar: npm i -g vercel"
fi

echo ""
print_info "📚 Documentação Completa:"
echo "   - Vercel: https://vercel.com/docs"
echo "   - GitHub Actions: https://docs.github.com/en/actions"
echo "   - Este projeto: VERCEL_DEPLOY.md"
echo ""

print_status "Configuração concluída! Siga os passos acima para finalizar."

# Verificar se há problemas comuns
echo ""
print_info "🔍 Verificações adicionais:"

# Verificar se o frontend tem as dependências necessárias
if [ -f "frontend/package.json" ]; then
    if grep -q '"next"' "frontend/package.json"; then
        print_status "Next.js encontrado no frontend"
    else
        print_warning "Next.js não encontrado no frontend/package.json"
    fi

    if grep -q '"build"' "frontend/package.json"; then
        print_status "Script build encontrado no frontend"
    else
        print_warning "Script build não encontrado no frontend/package.json"
    fi
fi

# Verificar se o workflow está configurado corretamente
if grep -q "amondnet/vercel-action" ".github/workflows/ci-cd.yml"; then
    print_status "Vercel action configurada no workflow"
else
    print_warning "Vercel action não encontrada no workflow"
fi

if grep -q "working-directory: ./frontend" ".github/workflows/ci-cd.yml"; then
    print_status "Working directory configurado corretamente"
else
    print_warning "Working directory não configurado no workflow"
fi

echo ""
print_status "✅ Script de configuração concluído!"
echo ""
print_info "💡 Dica: Execute 'cat VERCEL_DEPLOY.md' para ver a documentação completa"
