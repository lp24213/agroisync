#!/bin/bash

# AGROISYNC - Correção de Conflitos no package.json
# Este script corrige inconsistências entre os package.json files

echo "📦 AGROISYNC - Correção de Conflitos package.json"
echo "================================================="

# 1. CORRIGIR PACKAGE.JSON PRINCIPAL
echo "🔧 Corrigindo package.json principal..."

cat > package.json << 'EOF'
{
  "name": "agroisync",
  "version": "2.3.1",
  "description": "Plataforma de Agricultura Inteligente com Web3",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ],
  "scripts": {
    "dev": "pnpm run dev:frontend & pnpm run dev:backend",
    "dev:frontend": "pnpm --filter frontend dev",
    "dev:backend": "pnpm --filter backend dev",
    "build": "pnpm run build:frontend && pnpm run build:backend",
    "build:frontend": "pnpm --filter frontend build",
    "build:backend": "pnpm --filter backend build",
    "test": "pnpm run test:frontend && pnpm run test:backend",
    "test:frontend": "pnpm --filter frontend test",
    "test:backend": "pnpm --filter backend test",
    "lint": "pnpm run lint:frontend && pnpm run lint:backend",
    "lint:frontend": "pnpm --filter frontend lint",
    "lint:backend": "pnpm --filter backend lint",
    "clean": "pnpm run clean:frontend && pnpm run clean:backend",
    "clean:frontend": "pnpm --filter frontend clean",
    "clean:backend": "pnpm --filter backend clean",
    "type-check": "pnpm run type-check:frontend && pnpm run type-check:backend",
    "type-check:frontend": "pnpm --filter frontend type-check",
    "type-check:backend": "pnpm --filter backend type-check"
  },
  "keywords": [
    "agriculture",
    "web3",
    "solana",
    "defi",
    "nft",
    "blockchain",
    "smart-contracts"
  ],
  "author": "AGROISYNC Team",
  "license": "MIT",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.14.9",
    "typescript": "^5.5.3",
    "turbo": "^2.0.12"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/lp24213/agrotm.sol.git"
  },
  "homepage": "https://agroisync.com",
  "bugs": {
    "url": "https://github.com/lp24213/agrotm.sol/issues"
  }
}
EOF

echo "✅ package.json principal corrigido"

# 2. CORRIGIR PACKAGE.JSON DO FRONTEND
echo "🎨 Corrigindo package.json do frontend..."

cat > frontend/package.json << 'EOF'
{
  "name": "@agroisync/frontend",
  "version": "2.3.1",
  "description": "AGROISYNC Frontend - Next.js Application",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:final": "next build && next export",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .next out node_modules/.cache",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "dependencies": {
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@solana/web3.js": "^1.95.2",
    "@solana/wallet-adapter-base": "^0.9.23",
    "@solana/wallet-adapter-react": "^0.15.35",
    "@solana/wallet-adapter-react-ui": "^0.9.35",
    "@solana/wallet-adapter-wallets": "^0.19.32",
    "@project-serum/anchor": "^0.29.0",
    "axios": "^1.7.2",
    "tailwindcss": "^3.4.4",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "lucide-react": "^0.400.0",
    "framer-motion": "^11.2.10",
    "date-fns": "^3.6.0",
    "js-cookie": "^3.0.5",
    "react-hot-toast": "^2.4.1"
  },
  "devDependencies": {
    "@types/node": "^20.14.9",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@types/js-cookie": "^3.0.6",
    "typescript": "^5.5.3",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.5",
    "@typescript-eslint/eslint-plugin": "^7.16.0",
    "@typescript-eslint/parser": "^7.16.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.4.6"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  }
}
EOF

echo "✅ package.json do frontend corrigido"

# 3. CORRIGIR PACKAGE.JSON DO BACKEND
echo "⚙️ Corrigindo package.json do backend..."

cat > backend/package.json << 'EOF'
{
  "name": "@agroisync/backend",
  "version": "2.3.1",
  "description": "AGROISYNC Backend - Node.js API",
  "private": true,
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc && tsc-alias",
    "start": "node dist/server.js",
    "start:prod": "NODE_ENV=production node dist/server.js",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "type-check": "tsc --noEmit",
    "type-check:final": "tsc --noEmit --skipLibCheck",
    "clean": "rm -rf dist node_modules/.cache",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "security": "npm audit",
    "docker:build": "docker build -t agroisync-backend .",
    "docker:run": "docker run -p 3001:3001 agroisync-backend"
  },
  "dependencies": {
    "express": "^4.19.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "compression": "^1.7.4",
    "express-rate-limit": "^7.3.1",
    "express-validator": "^7.1.0",
    "mongoose": "^8.5.1",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.33.4",
    "aws-sdk": "^2.1657.0",
    "@aws-sdk/client-s3": "^3.613.0",
    "@aws-sdk/s3-request-presigner": "^3.613.0",
    "redis": "^4.6.14",
    "winston": "^3.13.1",
    "joi": "^17.13.3",
    "dotenv": "^16.4.5"
  },
  "devDependencies": {
    "@types/node": "^20.14.9",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/morgan": "^1.9.9",
    "@types/compression": "^1.7.5",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/bcryptjs": "^2.4.6",
    "@types/multer": "^1.4.11",
    "@types/js-cookie": "^3.0.6",
    "typescript": "^5.5.3",
    "tsc-alias": "^1.8.10",
    "nodemon": "^3.1.4",
    "ts-node": "^10.9.2",
    "eslint": "^8.57.0",
    "@typescript-eslint/eslint-plugin": "^7.16.0",
    "@typescript-eslint/parser": "^7.16.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.12",
    "supertest": "^7.0.0",
    "@types/supertest": "^6.0.2"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  }
}
EOF

echo "✅ package.json do backend corrigido"

# 4. VERIFICAR SE EXISTEM LOCK FILES CONFLITANTES
echo "🔍 Verificando lock files..."

if [ -f "package-lock.json" ]; then
    echo "⚠️ Removendo package-lock.json (usando pnpm)"
    rm package-lock.json
fi

if [ -f "frontend/package-lock.json" ]; then
    echo "⚠️ Removendo frontend/package-lock.json"
    rm frontend/package-lock.json
fi

if [ -f "backend/package-lock.json" ]; then
    echo "⚠️ Removendo backend/package-lock.json"
    rm backend/package-lock.json
fi

if [ -f "yarn.lock" ]; then
    echo "⚠️ Removendo yarn.lock"
    rm yarn.lock
fi

echo "✅ Lock files verificados"

# 5. CRIAR ARQUIVO PNPM-WORKSPACE
echo "📝 Criando pnpm-workspace.yaml..."

cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'frontend'
  - 'backend'
EOF

echo "✅ pnpm-workspace.yaml criado"

# 6. INSTALAR DEPENDÊNCIAS
echo "📥 Instalando dependências..."

if command -v pnpm &> /dev/null; then
    echo "🔄 Usando pnpm..."
    pnpm install
else
    echo "🔄 pnpm não encontrado, usando npm..."
    npm install
fi

echo ""
echo "🎉 CORREÇÃO DE CONFLITOS CONCLUÍDA!"
echo "=================================="
echo "✅ package.json principal padronizado"
echo "✅ package.json do frontend corrigido"
echo "✅ package.json do backend corrigido"
echo "✅ Lock files conflitantes removidos"
echo "✅ pnpm-workspace.yaml criado"
echo "✅ Dependências instaladas"
echo ""
echo "📊 COMANDOS DISPONÍVEIS:"
echo "🎨 Frontend:"
echo "  - pnpm run dev:frontend"
echo "  - pnpm run build:frontend"
echo "  - pnpm run test:frontend"
echo ""
echo "⚙️ Backend:"
echo "  - pnpm run dev:backend"
echo "  - pnpm run build:backend"
echo "  - pnpm run test:backend"
echo ""
echo "🚀 Projeto:"
echo "  - pnpm run dev (ambos)"
echo "  - pnpm run build (ambos)"
echo "  - pnpm run test (ambos)"
echo ""
echo "🚀 Projeto AGROISYNC com dependências alinhadas!"
