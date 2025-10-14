#!/bin/bash
# Deploy completo do Agroisync no Cloudflare
# Uso: ./scripts/deploy-all.sh [production|staging]

set -e

ENV=${1:-staging}
echo "🚀 Iniciando deploy para ambiente: $ENV"

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   AGROISYNC DEPLOY TO CLOUDFLARE${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# 1. Deploy Backend Worker
echo -e "\n${BLUE}[1/3]${NC} Deploying Backend Worker..."
cd backend
echo "Building backend..."
npm run build

if [ "$ENV" = "production" ]; then
  echo "Deploying to PRODUCTION..."
  wrangler deploy --env production
else
  echo "Deploying to STAGING..."
  wrangler deploy --env staging
fi
cd ..
echo -e "${GREEN}✓${NC} Backend Worker deployed!"

# 2. Deploy Frontend (React SPA)
echo -e "\n${BLUE}[2/3]${NC} Deploying Frontend (React)..."
cd frontend
echo "Building frontend..."
npm run build

if [ "$ENV" = "production" ]; then
  echo "Deploying to PRODUCTION (agroisync)..."
  wrangler pages deploy build --project-name=agroisync --branch=main
else
  echo "Deploying to STAGING (agroisync-staging)..."
  wrangler pages deploy build --project-name=agroisync-staging --branch=staging
fi
cd ..
echo -e "${GREEN}✓${NC} Frontend deployed!"

# 3. Deploy Frontend-Next (SSR/SSG)
echo -e "\n${BLUE}[3/3]${NC} Deploying Frontend-Next (Next.js SSR)..."
cd frontend-next
echo "Building Next.js..."
npm run build

if [ "$ENV" = "production" ]; then
  echo "Deploying to PRODUCTION (agroisync-next)..."
  wrangler pages deploy out --project-name=agroisync-next --branch=main
else
  echo "Deploying to STAGING (agroisync-next-staging)..."
  wrangler pages deploy out --project-name=agroisync-next-staging --branch=staging
fi
cd ..
echo -e "${GREEN}✓${NC} Frontend-Next deployed!"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ DEPLOY COMPLETO!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ "$ENV" = "production" ]; then
  echo -e "\n📍 URLs de Produção:"
  echo "   • Backend API: https://agroisync.com/api"
  echo "   • Frontend: https://agroisync.com"
  echo "   • Frontend-Next: https://next.agroisync.com (configure DNS)"
else
  echo -e "\n📍 URLs de Staging:"
  echo "   • Backend API: https://agroisync-staging.pages.dev/api"
  echo "   • Frontend: https://agroisync-staging.pages.dev"
  echo "   • Frontend-Next: https://agroisync-next-staging.pages.dev"
fi

echo -e "\n${GREEN}✓ Todos os componentes foram deployados com sucesso!${NC}"
echo -e "🎉 Agroisync está no ar!\n"

