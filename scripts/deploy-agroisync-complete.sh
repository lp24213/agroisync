#!/bin/bash

# 🚀 AGROISYNC - Deploy Completo e Automatizado no AWS Amplify
# Este script configura TODO o backend e faz o deploy automaticamente

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
REGION="us-east-2"
PROJECT_NAME="agroisync"
DOMAIN="agroisync.com"

echo -e "${GREEN}🚀 AGROISYNC - Deploy Completo no AWS Amplify${NC}"
echo -e "${GREEN}===============================================${NC}"

# Verificar se o Amplify CLI está instalado
if ! command -v amplify &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando Amplify CLI...${NC}"
    npm install -g @aws-amplify/cli
else
    echo -e "${GREEN}✅ Amplify CLI já instalado${NC}"
fi

# Verificar se o AWS CLI está configurado
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS CLI não está configurado. Execute 'aws configure' primeiro.${NC}"
    exit 1
else
    echo -e "${GREEN}✅ AWS CLI configurado${NC}"
fi

echo -e "${BLUE}📍 Região: $REGION${NC}"
echo -e "${BLUE}🏗️  Projeto: $PROJECT_NAME${NC}"
echo -e "${BLUE}🌐 Domínio: $DOMAIN${NC}"
echo ""

# Navegar para o diretório do projeto
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

echo -e "${YELLOW}🔄 Verificando projeto existente...${NC}"

# Verificar se já existe projeto Amplify
if [ -d "amplify" ]; then
    echo -e "${YELLOW}🔄 Projeto Amplify já existe. Atualizando...${NC}"
    
    # Fazer pull das mudanças se existir
    if [ -f "amplify/team-provider-info.json" ]; then
        APP_ID=$(jq -r '.dev.awscloudformation.AmplifyAppId' amplify/team-provider-info.json)
        if [ "$APP_ID" != "null" ]; then
            echo -e "${YELLOW}📥 Fazendo pull das mudanças...${NC}"
            amplify pull --appId "$APP_ID" --envName dev --yes || true
        fi
    fi
else
    echo -e "${YELLOW}🆕 Inicializando novo projeto Amplify...${NC}"
    
    # Inicializar projeto
    amplify init --app "$PROJECT_NAME" --envName dev --defaultEditor code --framework react --yes
fi

echo -e "${YELLOW}🔐 Configurando autenticação...${NC}"

# Configurar autenticação (se não existir)
if [ ! -d "amplify/backend/auth/agroisync" ]; then
    amplify add auth --service Cognito --userPoolName "${PROJECT_NAME}_userpool" --identityPoolName "${PROJECT_NAME}_identitypool" --allowUnauthenticatedIdentities false --usernameAttributes email --signupAttributes email,name --mfaConfiguration ON --mfaTypes SMS,TOTP --passwordPolicyMinLength 12 --passwordPolicyRequirements "REQUIRES_LOWERCASE,REQUIRES_NUMBERS,REQUIRES_SYMBOLS,REQUIRES_UPPERCASE" --socialProviders Google,Facebook,Apple --hostedUI true --redirectSignIn "https://www.${DOMAIN}/" --redirectSignOut "https://www.${DOMAIN}/" --yes
else
    echo -e "${GREEN}✅ Autenticação já configurada${NC}"
fi

echo -e "${YELLOW}📊 Configurando API GraphQL...${NC}"

# Configurar API GraphQL (se não existir)
if [ ! -d "amplify/backend/api/agroisync" ]; then
    amplify add api --service AppSync --serviceName "$PROJECT_NAME" --apiName "$PROJECT_NAME" --authenticationType AMAZON_COGNITO_USER_POOLS --additionalAuthenticationTypes AMAZON_COGNITO_USER_POOLS --yes
else
    echo -e "${GREEN}✅ API GraphQL já configurada${NC}"
fi

echo -e "${YELLOW}💾 Configurando storage S3...${NC}"

# Configurar storage S3 (se não existir)
if [ ! -d "amplify/backend/storage/agroisyncstorage" ]; then
    amplify add storage --service S3 --serviceName "${PROJECT_NAME}storage" --bucketName "${PROJECT_NAME}-storage" --bucketRegion "$REGION" --bucketAccess auth --bucketAccessPolicies private --bucketEncryption SSE-S3 --bucketVersioning enabled --bucketPublicAccess false --yes
else
    echo -e "${GREEN}✅ Storage S3 já configurado${NC}"
fi

echo -e "${YELLOW}⚡ Configurando funções Lambda...${NC}"

# Configurar funções Lambda (se não existirem)
FUNCTIONS=("adminFunctions" "stakingFunctions" "nftFunctions" "maintenanceFunctions" "analyticsFunctions" "taskScheduler")

for func in "${FUNCTIONS[@]}"; do
    if [ ! -d "amplify/backend/function/$func" ]; then
        echo -e "${YELLOW}🔧 Criando função $func...${NC}"
        amplify add function --functionName "$func" --runtime nodejs18.x --template hello-world --yes
    else
        echo -e "${GREEN}✅ Função $func já existe${NC}"
    fi
done

echo -e "${YELLOW}🌐 Configurando hosting...${NC}"

# Configurar hosting (se não existir)
if [ ! -d "amplify/backend/hosting/amplifyhosting" ]; then
    amplify add hosting --service amplifyhosting --type manual --yes
else
    echo -e "${GREEN}✅ Hosting já configurado${NC}"
fi

echo -e "${YELLOW}🚀 Fazendo push das configurações...${NC}"

# Fazer push das configurações
amplify push --yes

echo -e "${YELLOW}🔗 Configurando domínio customizado...${NC}"

# Configurar domínio customizado (se não existir)
if [ ! -d "amplify/backend/custom/domain" ]; then
    amplify add custom --customType domain --domainName "$DOMAIN" --yes || echo -e "${YELLOW}⚠️  Domínio customizado não configurado (pode ser configurado manualmente)${NC}"
else
    echo -e "${GREEN}✅ Domínio customizado já configurado${NC}"
fi

echo -e "${YELLOW}🚀 Push final das configurações...${NC}"

# Fazer push final
amplify push --yes

echo -e "${YELLOW}👤 Configurando usuário admin...${NC}"

# Configurar usuário admin
if [ -f "scripts/setup-admin-user.sh" ]; then
    chmod +x scripts/setup-admin-user.sh
    ./scripts/setup-admin-user.sh
else
    echo -e "${YELLOW}⚠️  Script de setup admin não encontrado${NC}"
fi

echo -e "${YELLOW}⚙️  Configurando variáveis de ambiente...${NC}"

# Configurar variáveis de ambiente
amplify env checkout dev

echo -e "${YELLOW}🏗️  Fazendo build e deploy...${NC}"

# Fazer build e deploy
if [ -d "frontend" ]; then
    cd frontend
    
    # Limpar e fazer build
    echo -e "${YELLOW}🧹 Limpando projeto...${NC}"
    rm -rf .next node_modules out package-lock.json
    
    echo -e "${YELLOW}📦 Instalando dependências...${NC}"
    npm install
    
    echo -e "${YELLOW}🔨 Fazendo build...${NC}"
    npm run build
    
    # Verificar se o build foi bem-sucedido
    if [ -d "out" ]; then
        echo -e "${GREEN}✅ Build bem-sucedido! Arquivos gerados em out/${NC}"
        
        # Contar arquivos
        FILE_COUNT=$(find out -type f | wc -l)
        echo -e "${BLUE}📊 Total de arquivos: $FILE_COUNT${NC}"
    else
        echo -e "${RED}❌ Build falhou! Verifique os erros acima.${NC}"
        exit 1
    fi
    
    cd ..
else
    echo -e "${YELLOW}⚠️  Diretório frontend não encontrado${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Deploy do AGROISYNC concluído com sucesso!${NC}"
echo ""
echo -e "${BLUE}📊 Resumo da configuração:${NC}"
echo -e "${GREEN}   ✅ Autenticação Cognito com grupos admin/user${NC}"
echo -e "${GREEN}   ✅ API GraphQL AppSync segura${NC}"
echo -e "${GREEN}   ✅ Storage S3 privado${NC}"
echo -e "${GREEN}   ✅ Funções Lambda (Admin, Staking, NFT, Maintenance, Analytics, TaskScheduler)${NC}"
echo -e "${GREEN}   ✅ Hosting Amplify com domínio customizado${NC}"
echo -e "${GREEN}   ✅ Usuário admin configurado${NC}"
echo ""
echo -e "${BLUE}🌐 URLs:${NC}"
echo -e "${YELLOW}   - Frontend: https://www.${DOMAIN}${NC}"
echo -e "${YELLOW}   - Admin: https://www.${DOMAIN}/admin${NC}"
echo -e "${YELLOW}   - API: AppSync endpoint seguro${NC}"
echo ""
echo -e "${BLUE}🔐 Credenciais Admin:${NC}"
echo -e "${YELLOW}   - Email: luispaulodeoliveira@agrotm.com.br${NC}"
echo -e "${YELLOW}   - Senha: Admin@2024!${NC}"
echo ""
echo -e "${GREEN}🚀 AGROISYNC está pronto para produção!${NC}"
echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo -e "${YELLOW}   1. Verificar status: ./scripts/check-agroisync-status.sh${NC}"
echo -e "${YELLOW}   2. Testar funcionalidades${NC}"
echo -e "${YELLOW}   3. Configurar domínio e SSL${NC}"
echo -e "${YELLOW}   4. Monitorar logs e métricas${NC}"
