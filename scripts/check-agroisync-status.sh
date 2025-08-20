#!/bin/bash

# 🔍 AGROISYNC - Verificação de Status (Bash)
# Este script verifica o status do projeto e suas configurações

set -e  # Parar em caso de erro

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔍 AGROISYNC - Verificação de Status${NC}"
echo -e "${GREEN}=====================================${NC}"

# Navegar para o diretório do projeto
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

echo -e "${BLUE}📁 Diretório do projeto: $PROJECT_DIR${NC}"
echo ""

# Verificar estrutura do projeto
echo -e "${YELLOW}📁 Verificando estrutura do projeto...${NC}"

if [ -d "frontend" ]; then
    echo -e "${GREEN}   ✅ Diretório frontend encontrado${NC}"
else
    echo -e "${RED}   ❌ Diretório frontend não encontrado${NC}"
fi

if [ -d "amplify" ]; then
    echo -e "${GREEN}   ✅ Diretório amplify encontrado${NC}"
else
    echo -e "${RED}   ❌ Diretório amplify não encontrado${NC}"
fi

if [ -d "backend" ]; then
    echo -e "${GREEN}   ✅ Diretório backend encontrado${NC}"
else
    echo -e "${RED}   ❌ Diretório backend não encontrado${NC}"
fi

echo ""

# Verificar arquivos de configuração
echo -e "${YELLOW}⚙️  Verificando arquivos de configuração...${NC}"

if [ -f "amplify.yml" ]; then
    echo -e "${GREEN}   ✅ amplify.yml encontrado${NC}"
else
    echo -e "${RED}   ❌ amplify.yml não encontrado${NC}"
fi

if [ -f "frontend/next.config.js" ]; then
    echo -e "${GREEN}   ✅ next.config.js encontrado${NC}"
else
    echo -e "${RED}   ❌ next.config.js não encontrado${NC}"
fi

if [ -f "frontend/env.production" ]; then
    echo -e "${GREEN}   ✅ env.production encontrado${NC}"
else
    echo -e "${RED}   ❌ env.production não encontrado${NC}"
fi

echo ""

# Verificar dependências
echo -e "${YELLOW}📦 Verificando dependências...${NC}"

if [ -f "frontend/package.json" ]; then
    echo -e "${GREEN}   ✅ package.json encontrado${NC}"
    
    if [ -d "frontend/node_modules" ]; then
        echo -e "${GREEN}   ✅ node_modules instalado${NC}"
    else
        echo -e "${YELLOW}   ⚠️  node_modules não instalado${NC}"
    fi
else
    echo -e "${RED}   ❌ package.json não encontrado${NC}"
fi

echo ""

# Verificar build
echo -e "${YELLOW}🔨 Verificando build...${NC}"

if [ -d "frontend/out" ]; then
    echo -e "${GREEN}   ✅ Build encontrado em out/${NC}"
    
    # Contar arquivos
    FILE_COUNT=$(find frontend/out -type f | wc -l)
    echo -e "${BLUE}   📊 Total de arquivos: $FILE_COUNT${NC}"
else
    echo -e "${YELLOW}   ⚠️  Build não encontrado${NC}"
fi

if [ -d "frontend/.next" ]; then
    echo -e "${YELLOW}   ⚠️  Diretório .next encontrado (deve ser removido para build estático)${NC}"
fi

echo ""

# Verificar Amplify CLI
echo -e "${YELLOW}🔧 Verificando Amplify CLI...${NC}"

if command -v amplify &> /dev/null; then
    echo -e "${GREEN}   ✅ Amplify CLI instalado${NC}"
    
    # Verificar versão
    AMPLIFY_VERSION=$(amplify --version)
    echo -e "${BLUE}   📊 Versão: $AMPLIFY_VERSION${NC}"
else
    echo -e "${RED}   ❌ Amplify CLI não instalado${NC}"
fi

echo ""

# Verificar AWS CLI
echo -e "${YELLOW}☁️  Verificando AWS CLI...${NC}"

if command -v aws &> /dev/null; then
    echo -e "${GREEN}   ✅ AWS CLI instalado${NC}"
    
    # Verificar se está configurado
    if aws sts get-caller-identity &> /dev/null; then
        echo -e "${GREEN}   ✅ AWS CLI configurado${NC}"
        
        # Obter informações da conta
        ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
        USER_ARN=$(aws sts get-caller-identity --query Arn --output text)
        echo -e "${BLUE}   📊 Account ID: $ACCOUNT_ID${NC}"
        echo -e "${BLUE}   👤 Usuário: $USER_ARN${NC}"
    else
        echo -e "${RED}   ❌ AWS CLI não configurado${NC}"
    fi
else
    echo -e "${RED}   ❌ AWS CLI não instalado${NC}"
fi

echo ""

# Verificar Node.js
echo -e "${YELLOW}🟢 Verificando Node.js...${NC}"

if command -v node &> /dev/null; then
    echo -e "${GREEN}   ✅ Node.js instalado${NC}"
    
    # Verificar versão
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    echo -e "${BLUE}   📊 Node.js: $NODE_VERSION${NC}"
    echo -e "${BLUE}   📦 npm: $NPM_VERSION${NC}"
    
    # Verificar se a versão é compatível
    if [[ "$NODE_VERSION" == v18* ]] || [[ "$NODE_VERSION" == v20* ]] || [[ "$NODE_VERSION" == v22* ]]; then
        echo -e "${GREEN}   ✅ Versão compatível para o projeto${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Versão pode não ser compatível (recomendado: v18+ ou v20+)${NC}"
    fi
else
    echo -e "${RED}   ❌ Node.js não instalado${NC}"
fi

echo ""

# Verificar status do projeto Amplify
if [ -d "amplify" ] && command -v amplify &> /dev/null; then
    echo -e "${YELLOW}🚀 Verificando status do projeto Amplify...${NC}"
    
    cd amplify
    
    if [ -f "team-provider-info.json" ]; then
        echo -e "${GREEN}   ✅ Projeto Amplify configurado${NC}"
        
        # Obter informações do projeto
        if command -v jq &> /dev/null; then
            APP_ID=$(jq -r '.dev.awscloudformation.AmplifyAppId' team-provider-info.json 2>/dev/null || echo "N/A")
            REGION=$(jq -r '.dev.awscloudformation.Region' team-provider-info.json 2>/dev/null || echo "N/A")
            
            if [ "$APP_ID" != "null" ] && [ "$APP_ID" != "N/A" ]; then
                echo -e "${BLUE}   📊 App ID: $APP_ID${NC}"
                echo -e "${BLUE}   🌍 Região: $REGION${NC}"
            fi
        fi
    else
        echo -e "${YELLOW}   ⚠️  Projeto Amplify não configurado${NC}"
    fi
    
    cd ..
fi

echo ""
echo -e "${GREEN}✅ Verificação de status concluída!${NC}"
echo ""
echo -e "${BLUE}📋 Próximos passos recomendados:${NC}"

if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}   1. Instalar dependências: cd frontend && npm install${NC}"
fi

if [ ! -d "frontend/out" ]; then
    echo -e "${YELLOW}   2. Fazer build: cd frontend && npm run build${NC}"
fi

if [ ! -d "amplify" ]; then
    echo -e "${YELLOW}   3. Inicializar Amplify: amplify init${NC}"
fi

if ! command -v amplify &> /dev/null; then
    echo -e "${YELLOW}   4. Instalar Amplify CLI: npm install -g @aws-amplify/cli${NC}"
fi

echo -e "${YELLOW}   5. Executar deploy completo: ./scripts/deploy-agroisync-complete.sh${NC}"
echo ""
