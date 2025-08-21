#!/bin/bash

# AGROISYNC - Otimização da Estrutura do Projeto
# Este script reorganiza e otimiza a estrutura do projeto

echo "🏗️ AGROISYNC - Otimização da Estrutura do Projeto"
echo "================================================="

# 1. CRIAR PASTA PARA SCRIPTS ESSENCIAIS
echo "📁 Criando estrutura otimizada..."
mkdir -p scripts/deployment
mkdir -p scripts/setup
mkdir -p scripts/verification
mkdir -p docs
mkdir -p config/dns
mkdir -p config/aws

# 2. MOVER SCRIPTS ESSENCIAIS PARA PASTAS APROPRIADAS
echo "📦 Movendo scripts essenciais..."

# Scripts de verificação
mv verify-amplify-*.sh scripts/verification/ 2>/dev/null || true
mv verify-amplify-*.ps1 scripts/verification/ 2>/dev/null || true
mv check-amplify-ready.ps1 scripts/verification/ 2>/dev/null || true

# Scripts de setup
mv setup-*.sh scripts/setup/ 2>/dev/null || true
mv setup-*.ps1 scripts/setup/ 2>/dev/null || true
mv configure-*.ps1 scripts/setup/ 2>/dev/null || true

# Scripts de deployment (manter apenas os essenciais)
if [ -f "fix-amplify-build-complete.sh" ]; then
    mv fix-amplify-build-complete.sh scripts/deployment/
fi
if [ -f "fix-amplify-build-complete.ps1" ]; then
    mv fix-amplify-build-complete.ps1 scripts/deployment/
fi

# Scripts de monitoramento
mv monitor-*.sh scripts/verification/ 2>/dev/null || true

echo "✅ Scripts reorganizados"

# 3. CONSOLIDAR ARQUIVO DE CONFIGURAÇÃO PRINCIPAL
echo "⚙️ Criando configuração consolidada..."

cat > config/project-config.yml << 'EOF'
# AGROISYNC - Configuração Principal do Projeto
project:
  name: "AGROISYNC"
  version: "2.3.1"
  description: "Plataforma de Agricultura Inteligente com Web3"

aws:
  region: "us-east-2"
  amplify:
    app_id: "d2d5j98tau5snm"
    domain: "agroisync.com"
  
deployment:
  frontend:
    platform: "aws-amplify"
    build_command: "npm run build:final"
    output_directory: "out"
  
  backend:
    platform: "aws-ecs"
    image: "agroisync-backend"
    cluster: "agroisync-cluster"

domains:
  primary: "agroisync.com"
  api: "api.agroisync.com"
  www: "www.agroisync.com"

environment:
  node_version: "20"
  package_manager: "npm"
EOF

echo "✅ Configuração consolidada criada"

# 4. CRIAR DOCUMENTAÇÃO PRINCIPAL
echo "📚 Criando documentação principal..."

cat > docs/README.md << 'EOF'
# AGROISYNC - Documentação

## Estrutura do Projeto

### Frontend
- **Tecnologia**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **Deploy**: AWS Amplify

### Backend
- **Tecnologia**: Node.js + Express + TypeScript
- **Deploy**: AWS ECS
- **Database**: MongoDB Atlas

### Blockchain
- **Plataforma**: Solana
- **Framework**: Anchor

## Scripts Disponíveis

### Deployment
- `scripts/deployment/fix-amplify-build-complete.sh` - Fix do build Amplify
- `scripts/deployment/fix-amplify-build-complete.ps1` - Versão PowerShell

### Setup
- `scripts/setup/setup-aws-credentials.sh` - Configurar credenciais AWS
- `scripts/setup/setup-amplify-cli-credentials.sh` - Configurar Amplify CLI

### Verification
- `scripts/verification/verify-amplify-deployment-ready.sh` - Verificar se está pronto para deploy
- `scripts/verification/verify-amplify-status.sh` - Verificar status do Amplify

## Configuração

Todas as configurações estão centralizadas em:
- `config/project-config.yml` - Configuração principal
- `amplify.yml` - Configuração do Amplify
- `package.json` - Configuração dos workspaces

## Deploy

### Frontend (Automático via Amplify)
```bash
git push origin main
```

### Backend (Manual via ECS)
```bash
cd backend
docker build -t agroisync-backend .
# Deploy via workflow GitHub Actions
```

## Monitoramento

- **Frontend**: AWS Amplify Console
- **Backend**: AWS ECS Console + CloudWatch
- **Logs**: CloudWatch Logs
EOF

echo "✅ Documentação principal criada"

# 5. CRIAR SCRIPT DE BUILD PRINCIPAL
echo "🔨 Criando script de build principal..."

cat > build-project.sh << 'EOF'
#!/bin/bash

echo "🚀 AGROISYNC - Build Principal"
echo "=============================="

# 1. Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado"
    exit 1
fi

echo "✅ Node.js: $(node --version)"

# 2. Instalar dependências do workspace principal
echo "📦 Instalando dependências do workspace..."
npm ci

# 3. Build do frontend
echo "🎨 Building frontend..."
cd frontend
npm ci
npm run build
cd ..

# 4. Build do backend
echo "⚙️ Building backend..."
cd backend
npm ci
npm run build
cd ..

# 5. Verificar builds
if [ -d "frontend/.next" ] || [ -d "frontend/out" ]; then
    echo "✅ Frontend build concluído"
else
    echo "❌ Frontend build falhou"
    exit 1
fi

if [ -d "backend/dist" ]; then
    echo "✅ Backend build concluído"
else
    echo "❌ Backend build falhou"
    exit 1
fi

echo "🎉 Build completo!"
echo "Frontend: ✅"
echo "Backend: ✅"
EOF

chmod +x build-project.sh
echo "✅ Script de build principal criado"

# 6. CRIAR GITIGNORE OTIMIZADO
echo "📝 Otimizando .gitignore..."

cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Build outputs
.next/
out/
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Cache
.npm
.eslintcache
*.tsbuildinfo

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Logs
logs
*.log

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# AWS
.aws/

# Local Netlify folder
.netlify

# Amplify
amplify/backend/awscloudformation/
amplify/.config/
amplify/mock-data/
amplify/mock-api-resources/

# ZIP files
*.zip

# Temporary files
h origin main
how HEADamplify.yml
tatus
tatus --porcelain
s... && git add . && git commit*

# Build artifacts
function.zip
AGROTM-AWS-DEPLOY-COMPLETO.zip
*.tmp
EOF

echo "✅ .gitignore otimizado"

echo ""
echo "🎉 OTIMIZAÇÃO DA ESTRUTURA CONCLUÍDA!"
echo "===================================="
echo "✅ Scripts organizados em pastas apropriadas"
echo "✅ Configuração consolidada criada"
echo "✅ Documentação principal criada"
echo "✅ Script de build principal criado"
echo "✅ .gitignore otimizado"
echo ""
echo "📊 NOVA ESTRUTURA:"
echo "├── scripts/"
echo "│   ├── deployment/"
echo "│   ├── setup/"
echo "│   └── verification/"
echo "├── config/"
echo "│   └── project-config.yml"
echo "├── docs/"
echo "│   └── README.md"
echo "├── build-project.sh"
echo "└── .gitignore (otimizado)"
echo ""
echo "🚀 Projeto AGROISYNC estruturado e otimizado!"
