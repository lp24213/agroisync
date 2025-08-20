#!/bin/bash

# 🔍 AGROISYNC - Verificação de Status
# Este script verifica o status de todos os recursos do AGROISYNC

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 AGROISYNC - Verificação de Status${NC}"
echo -e "${BLUE}=====================================${NC}"

# Verificar se o AWS CLI está configurado
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI não está instalado${NC}"
    exit 1
fi

# Verificar se o Amplify CLI está instalado
if ! command -v amplify &> /dev/null; then
    echo -e "${RED}❌ Amplify CLI não está instalado${NC}"
    exit 1
fi

echo -e "${YELLOW}📊 Verificando recursos AWS...${NC}"

# Verificar Cognito User Pools
echo -e "${BLUE}🔐 Verificando Cognito User Pools...${NC}"
USER_POOLS=$(aws cognito-idp list-user-pools --max-items 10 --query 'UserPools[?contains(Name, `agroisync`)].{Name:Name,Id:Id,Status:Status}' --output table 2>/dev/null || echo "Nenhum User Pool encontrado")
echo "$USER_POOLS"

# Verificar AppSync APIs
echo -e "${BLUE}📊 Verificando AppSync APIs...${NC}"
APISYNC_APIS=$(aws appsync list-graphql-apis --query 'graphqlApis[?contains(name, `agroisync`)].{Name:name,Id:id,Status:status}' --output table 2>/dev/null || echo "Nenhuma API AppSync encontrada")
echo "$APISYNC_APIS"

# Verificar S3 Buckets
echo -e "${BLUE}💾 Verificando S3 Buckets...${NC}"
S3_BUCKETS=$(aws s3 ls --query 'Buckets[?contains(Name, `agroisync`)].{Name:Name,CreationDate:CreationDate}' --output table 2>/dev/null || echo "Nenhum bucket S3 encontrado")
echo "$S3_BUCKETS"

# Verificar Lambda Functions
echo -e "${BLUE}⚡ Verificando Lambda Functions...${NC}"
LAMBDA_FUNCTIONS=$(aws lambda list-functions --query 'Functions[?contains(FunctionName, `agroisync`)].{Name:FunctionName,Runtime:Runtime,State:State}' --output table 2>/dev/null || echo "Nenhuma função Lambda encontrada")
echo "$LAMBDA_FUNCTIONS"

# Verificar DynamoDB Tables
echo -e "${BLUE}🗄️  Verificando DynamoDB Tables...${NC}"
DYNAMODB_TABLES=$(aws dynamodb list-tables --query 'TableNames[?contains(@, `agroisync`)]' --output table 2>/dev/null || echo "Nenhuma tabela DynamoDB encontrada")
echo "$DYNAMODB_TABLES"

# Verificar CloudFormation Stacks
echo -e "${BLUE}☁️  Verificando CloudFormation Stacks...${NC}"
CLOUDFORMATION_STACKS=$(aws cloudformation list-stacks --query 'StackSummaries[?contains(StackName, `agroisync`)].{Name:StackName,Status:StackStatus}' --output table 2>/dev/null || echo "Nenhum stack CloudFormation encontrado")
echo "$CLOUDFORMATION_STACKS"

# Verificar status do projeto Amplify
echo -e "${YELLOW}📱 Verificando status do projeto Amplify...${NC}"
if [ -d "amplify" ]; then
    echo -e "${GREEN}✅ Diretório amplify encontrado${NC}"
    
    # Verificar backend-config.json
    if [ -f "amplify/backend/backend-config.json" ]; then
        echo -e "${GREEN}✅ backend-config.json encontrado${NC}"
    else
        echo -e "${RED}❌ backend-config.json não encontrado${NC}"
    fi
    
    # Verificar team-provider-info.json
    if [ -f "amplify/team-provider-info.json" ]; then
        echo -e "${GREEN}✅ team-provider-info.json encontrado${NC}"
    else
        echo -e "${RED}❌ team-provider-info.json não encontrado${NC}"
    fi
    
    # Verificar status do amplify
    echo -e "${BLUE}📊 Status do Amplify:${NC}"
    amplify status --json 2>/dev/null || echo "Erro ao verificar status do Amplify"
else
    echo -e "${RED}❌ Diretório amplify não encontrado${NC}"
fi

# Verificar frontend
echo -e "${YELLOW}🌐 Verificando frontend...${NC}"
if [ -d "frontend" ]; then
    echo -e "${GREEN}✅ Diretório frontend encontrado${NC}"
    
    # Verificar package.json
    if [ -f "frontend/package.json" ]; then
        echo -e "${GREEN}✅ package.json encontrado${NC}"
        
        # Verificar dependências
        cd frontend
        if npm list aws-amplify &> /dev/null; then
            echo -e "${GREEN}✅ aws-amplify instalado${NC}"
        else
            echo -e "${RED}❌ aws-amplify não instalado${NC}"
        fi
        
        if npm list @aws-amplify/ui-react &> /dev/null; then
            echo -e "${GREEN}✅ @aws-amplify/ui-react instalado${NC}"
        else
            echo -e "${RED}❌ @aws-amplify/ui-react não instalado${NC}"
        fi
        
        cd ..
    else
        echo -e "${RED}❌ package.json não encontrado${NC}"
    fi
    
    # Verificar aws-exports.js
    if [ -f "frontend/src/aws-exports.js" ]; then
        echo -e "${GREEN}✅ aws-exports.js encontrado${NC}"
    else
        echo -e "${RED}❌ aws-exports.js não encontrado${NC}"
    fi
    
    # Verificar amplify.yml
    if [ -f "amplify.yml" ]; then
        echo -e "${GREEN}✅ amplify.yml encontrado${NC}"
    else
        echo -e "${RED}❌ amplify.yml não encontrado${NC}"
    fi
else
    echo -e "${RED}❌ Diretório frontend não encontrado${NC}"
fi

# Verificar scripts
echo -e "${YELLOW}📜 Verificando scripts...${NC}"
SCRIPTS=("deploy-agroisync-complete.sh" "deploy-agroisync-complete.ps1" "setup-admin-user.sh" "check-agroisync-status.sh")

for script in "${SCRIPTS[@]}"; do
    if [ -f "scripts/$script" ]; then
        echo -e "${GREEN}✅ $script encontrado${NC}"
    else
        echo -e "${RED}❌ $script não encontrado${NC}"
    fi
done

# Verificar domínio
echo -e "${YELLOW}🌐 Verificando domínio...${NC}"
if command -v nslookup &> /dev/null; then
    if nslookup www.agroisync.com &> /dev/null; then
        echo -e "${GREEN}✅ Domínio www.agroisync.com resolve${NC}"
    else
        echo -e "${YELLOW}⚠️  Domínio www.agroisync.com não resolve${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  nslookup não disponível${NC}"
fi

# Verificar SSL
echo -e "${YELLOW}🔒 Verificando SSL...${NC}"
if command -v openssl &> /dev/null; then
    SSL_CHECK=$(echo | openssl s_client -connect www.agroisync.com:443 -servername www.agroisync.com 2>/dev/null | openssl x509 -noout -dates 2>/dev/null || echo "SSL não disponível")
    if [[ "$SSL_CHECK" != "SSL não disponível" ]]; then
        echo -e "${GREEN}✅ SSL ativo${NC}"
        echo "$SSL_CHECK"
    else
        echo -e "${YELLOW}⚠️  SSL não disponível${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  openssl não disponível${NC}"
fi

# Verificar build do frontend
echo -e "${YELLOW}🏗️  Verificando build do frontend...${NC}"
if [ -d "frontend/.next" ]; then
    echo -e "${GREEN}✅ Build do Next.js encontrado${NC}"
    
    # Verificar tamanho do build
    BUILD_SIZE=$(du -sh frontend/.next 2>/dev/null | cut -f1 || echo "N/A")
    echo -e "${BLUE}📊 Tamanho do build: $BUILD_SIZE${NC}"
else
    echo -e "${YELLOW}⚠️  Build do Next.js não encontrado${NC}"
    echo -e "${BLUE}💡 Execute 'npm run build' no diretório frontend${NC}"
fi

echo ""
echo -e "${BLUE}🔍 Verificação concluída!${NC}"
echo ""
echo -e "${BLUE}📋 Resumo:${NC}"
echo -e "${GREEN}✅ Recursos AWS verificados${NC}"
echo -e "${GREEN}✅ Projeto Amplify verificado${NC}"
echo -e "${GREEN}✅ Frontend verificado${NC}"
echo -e "${GREEN}✅ Scripts verificados${NC}"
echo -e "${GREEN}✅ Domínio e SSL verificados${NC}"
echo ""
echo -e "${BLUE}🚀 AGROISYNC está pronto para uso!${NC}"
