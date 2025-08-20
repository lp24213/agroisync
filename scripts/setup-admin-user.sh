#!/bin/bash

# 👤 AGROISYNC - Setup Usuário Admin
# Este script configura o usuário admin no Cognito

set -e  # Parar em caso de erro

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}👤 AGROISYNC - Setup Usuário Admin${NC}"
echo -e "${GREEN}===================================${NC}"

# Verificar se o Amplify CLI está instalado
if ! command -v amplify &> /dev/null; then
    echo -e "${RED}❌ Amplify CLI não está instalado${NC}"
    exit 1
fi

# Verificar se o projeto Amplify existe
if [ ! -d "amplify" ]; then
    echo -e "${RED}❌ Projeto Amplify não encontrado. Execute o deploy primeiro.${NC}"
    exit 1
fi

# Obter informações do projeto
if [ -f "amplify/team-provider-info.json" ]; then
    USER_POOL_ID=$(jq -r '.dev.awscloudformation.UserPoolId' amplify/team-provider-info.json)
    if [ "$USER_POOL_ID" = "null" ] || [ -z "$USER_POOL_ID" ]; then
        echo -e "${RED}❌ User Pool ID não encontrado. Execute 'amplify push' primeiro.${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ team-provider-info.json não encontrado${NC}"
    exit 1
fi

echo -e "${BLUE}📊 User Pool ID: $USER_POOL_ID${NC}"

# Configurações do usuário admin
ADMIN_EMAIL="luispaulodeoliveira@agrotm.com.br"
ADMIN_PASSWORD="Admin@2024!"
ADMIN_NAME="Luis Paulo Admin"

echo -e "${YELLOW}🔐 Criando usuário admin...${NC}"

# Criar usuário admin
aws cognito-idp admin-create-user \
    --user-pool-id "$USER_POOL_ID" \
    --username "$ADMIN_EMAIL" \
    --user-attributes \
        Name=email,Value="$ADMIN_EMAIL" \
        Name=name,Value="$ADMIN_NAME" \
        Name=email_verified,Value=true \
    --temporary-password "$ADMIN_PASSWORD" \
    --message-action SUPPRESS

echo -e "${GREEN}✅ Usuário admin criado com sucesso!${NC}"

# Definir senha permanente
echo -e "${YELLOW}🔑 Definindo senha permanente...${NC}"

aws cognito-idp admin-set-user-password \
    --user-pool-id "$USER_POOL_ID" \
    --username "$ADMIN_EMAIL" \
    --password "$ADMIN_PASSWORD" \
    --permanent

echo -e "${GREEN}✅ Senha definida com sucesso!${NC}"

# Adicionar usuário ao grupo admin (se existir)
echo -e "${YELLOW}👥 Adicionando usuário ao grupo admin...${NC}"

# Verificar se o grupo admin existe
if aws cognito-idp get-group --user-pool-id "$USER_POOL_ID" --group-name "admin" &> /dev/null; then
    aws cognito-idp admin-add-user-to-group \
        --user-pool-id "$USER_POOL_ID" \
        --username "$ADMIN_EMAIL" \
        --group-name "admin"
    echo -e "${GREEN}✅ Usuário adicionado ao grupo admin${NC}"
else
    echo -e "${YELLOW}⚠️  Grupo admin não encontrado. Criando...${NC}"
    
    # Criar grupo admin
    aws cognito-idp create-group \
        --user-pool-id "$USER_POOL_ID" \
        --group-name "admin" \
        --description "Administradores do sistema" \
        --precedence 1
    
    # Adicionar usuário ao grupo
    aws cognito-idp admin-add-user-to-group \
        --user-pool-id "$USER_POOL_ID" \
        --username "$ADMIN_EMAIL" \
        --group-name "admin"
    
    echo -e "${GREEN}✅ Grupo admin criado e usuário adicionado${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Usuário admin configurado com sucesso!${NC}"
echo ""
echo -e "${BLUE}🔐 Credenciais de Acesso:${NC}"
echo -e "${YELLOW}   Email: $ADMIN_EMAIL${NC}"
echo -e "${YELLOW}   Senha: $ADMIN_PASSWORD${NC}"
echo -e "${YELLOW}   Grupo: admin${NC}"
echo ""
echo -e "${BLUE}🌐 URLs de Acesso:${NC}"
echo -e "${YELLOW}   Frontend: https://www.agroisync.com${NC}"
echo -e "${YELLOW}   Admin: https://www.agroisync.com/admin${NC}"
echo ""
echo -e "${GREEN}🚀 AGROISYNC está pronto para uso!${NC}"
