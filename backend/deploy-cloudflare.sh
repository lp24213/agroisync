#!/bin/bash

# ========================================
# Script de Deploy - AgroSync Backend
# Cloudflare Workers + D1 Database
# ========================================

echo "=================================="
echo "AgroSync - Deploy do Backend"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 1. Verificar se está logado no Cloudflare
echo -e "${YELLOW}[1/6] Verificando login no Cloudflare...${NC}"
if ! npx wrangler whoami > /dev/null 2>&1; then
    echo -e "${RED}❌ Não está logado no Cloudflare.${NC}"
    echo -e "${YELLOW}Executando login...${NC}"
    npx wrangler login
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Falha no login. Abortando.${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ Login verificado${NC}"

# 2. Verificar/Criar D1 Database
echo ""
echo -e "${YELLOW}[2/6] Verificando banco de dados D1...${NC}"
if ! npx wrangler d1 list | grep -q "agroisync-db"; then
    echo -e "${YELLOW}⚠️  Banco de dados 'agroisync-db' não encontrado.${NC}"
    echo -e "${YELLOW}Criando banco de dados...${NC}"
    npx wrangler d1 create agroisync-db
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Falha ao criar banco de dados. Abortando.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Banco de dados criado${NC}"
else
    echo -e "${GREEN}✅ Banco de dados encontrado${NC}"
fi

# 3. Aplicar Schema SQL
echo ""
echo -e "${YELLOW}[3/6] Aplicando schema SQL ao D1...${NC}"
if [ -f "schema.sql" ]; then
    npx wrangler d1 execute agroisync-db --file=./schema.sql --remote
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Schema aplicado com sucesso${NC}"
    else
        echo -e "${YELLOW}⚠️  Aviso: Possível erro ao aplicar schema (pode ser que já exista)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Arquivo schema.sql não encontrado. Pulando...${NC}"
fi

# 4. Verificar secrets
echo ""
echo -e "${YELLOW}[4/6] Verificando secrets...${NC}"
echo -e "${CYAN}ℹ️  Secrets devem ser configurados manualmente:${NC}"
echo "   - JWT_SECRET"
echo "   - STRIPE_SECRET_KEY"
echo "   - STRIPE_WEBHOOK_SECRET"
echo "   - RESEND_API_KEY"
echo ""
read -p "Deseja configurar secrets agora? (s/N): " configure_secrets
if [ "$configure_secrets" = "s" ] || [ "$configure_secrets" = "S" ]; then
    echo -e "${YELLOW}Configurando JWT_SECRET...${NC}"
    npx wrangler secret put JWT_SECRET
    
    echo -e "${YELLOW}Configurando STRIPE_SECRET_KEY...${NC}"
    npx wrangler secret put STRIPE_SECRET_KEY
    
    echo -e "${YELLOW}Configurando STRIPE_WEBHOOK_SECRET...${NC}"
    npx wrangler secret put STRIPE_WEBHOOK_SECRET
    
    echo -e "${YELLOW}Configurando RESEND_API_KEY...${NC}"
    npx wrangler secret put RESEND_API_KEY
    
    echo -e "${GREEN}✅ Secrets configurados${NC}"
else
    echo -e "${YELLOW}⏭️  Pulando configuração de secrets${NC}"
fi

# 5. Build/Lint do projeto
echo ""
echo -e "${YELLOW}[5/6] Executando lint...${NC}"
npm run lint
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Lint passou${NC}"
else
    echo -e "${YELLOW}⚠️  Avisos no lint. Continuando...${NC}"
fi

# 6. Deploy do Worker
echo ""
echo -e "${YELLOW}[6/6] Fazendo deploy do Worker...${NC}"
npx wrangler deploy --config wrangler-worker.toml
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
    echo ""
    echo "=================================="
    echo -e "${GREEN}✨ Backend deployado com sucesso!${NC}"
    echo "=================================="
    echo ""
    echo -e "${CYAN}URLs disponíveis:${NC}"
    echo "  🌐 https://agroisync.com/api/health"
    echo "  🌐 https://www.agroisync.com/api/health"
    echo ""
    echo -e "${CYAN}Próximos passos:${NC}"
    echo "  1. Testar health check: curl https://agroisync.com/api/health"
    echo "  2. Verificar logs: npx wrangler tail"
    echo "  3. Ver dashboard: https://dash.cloudflare.com"
    echo ""
else
    echo -e "${RED}❌ Falha no deploy. Verifique os erros acima.${NC}"
    exit 1
fi

