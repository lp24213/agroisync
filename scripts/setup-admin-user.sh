#!/bin/bash

# Script para configurar usuário admin inicial do AGROISYNC
# Este script deve ser executado após o deploy inicial do Amplify

set -e

echo "🚀 Configurando usuário admin inicial para AGROISYNC..."

# Verificar se o AWS CLI está configurado
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI não está configurado. Execute 'aws configure' primeiro."
    exit 1
fi

# Obter informações do projeto
PROJECT_NAME="agroisync"
REGION="us-east-2"

echo "📍 Região: $REGION"
echo "🏗️  Projeto: $PROJECT_NAME"

# Obter User Pool ID
echo "🔍 Obtendo User Pool ID..."
USER_POOL_ID=$(aws cognito-idp list-user-pools --max-items 20 --region $REGION --query "UserPools[?Name=='${PROJECT_NAME}_userpool'].Id" --output text)

if [ -z "$USER_POOL_ID" ]; then
    echo "❌ User Pool não encontrado. Verifique se o Amplify foi deployado."
    exit 1
fi

echo "✅ User Pool ID: $USER_POOL_ID"

# Obter Client ID
echo "🔍 Obtendo Client ID..."
CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id $USER_POOL_ID --region $REGION --query "UserPoolClients[0].ClientId" --output text)

if [ -z "$CLIENT_ID" ]; then
    echo "❌ Client ID não encontrado."
    exit 1
fi

echo "✅ Client ID: $CLIENT_ID"

# Criar grupo admin se não existir
echo "👥 Criando grupo admin..."
aws cognito-idp create-group \
    --user-pool-id $USER_POOL_ID \
    --group-name "admin" \
    --description "Administradores do sistema AGROISYNC" \
    --region $REGION \
    --precedence 1 || echo "⚠️  Grupo admin já existe"

# Criar usuário admin
ADMIN_EMAIL="luispaulodeoliveira@agrotm.com.br"
ADMIN_NAME="Luis Paulo de Oliveira"
TEMP_PASSWORD="Admin@2024!"

echo "👤 Criando usuário admin: $ADMIN_EMAIL"

# Criar usuário
aws cognito-idp admin-create-user \
    --user-pool-id $USER_POOL_ID \
    --username $ADMIN_EMAIL \
    --user-attributes \
        Name=email,Value=$ADMIN_EMAIL \
        Name=name,Value="$ADMIN_NAME" \
        Name=email_verified,Value=true \
    --temporary-password $TEMP_PASSWORD \
    --region $REGION

# Adicionar usuário ao grupo admin
echo "🔐 Adicionando usuário ao grupo admin..."
aws cognito-idp admin-add-user-to-group \
    --user-pool-id $USER_POOL_ID \
    --username $ADMIN_EMAIL \
    --group-name "admin" \
    --region $REGION

# Configurar atributos customizados
echo "⚙️  Configurando atributos customizados..."
aws cognito-idp admin-update-user-attributes \
    --user-pool-id $USER_POOL_ID \
    --username $ADMIN_EMAIL \
    --user-attributes \
        Name="custom:group",Value="admin" \
        Name="custom:role",Value="SUPER_ADMIN" \
    --region $REGION

echo ""
echo "✅ Usuário admin configurado com sucesso!"
echo ""
echo "📧 Email: $ADMIN_EMAIL"
echo "🔑 Senha temporária: $TEMP_PASSWORD"
echo "👥 Grupo: admin"
echo "🎭 Role: SUPER_ADMIN"
echo ""
echo "⚠️  IMPORTANTE: O usuário deve alterar a senha no primeiro login!"
echo ""
echo "🌐 Para fazer login, acesse: https://www.agroisync.com/"
echo ""

# Configurar domínio OAuth se necessário
echo "🔗 Configurando domínio OAuth..."
DOMAIN_NAME="${PROJECT_NAME}-${RANDOM}"

aws cognito-idp create-user-pool-domain \
    --domain $DOMAIN_NAME \
    --user-pool-id $USER_POOL_ID \
    --region $REGION || echo "⚠️  Domínio já existe ou erro na criação"

echo "✅ Domínio OAuth: $DOMAIN_NAME.auth.$REGION.amazoncognito.com"

# Configurar providers sociais (Google, Facebook, Apple)
echo "🔐 Configurando providers sociais..."
echo "⚠️  Configure manualmente os providers sociais no console AWS Cognito:"
echo "   - Google: https://console.aws.amazon.com/cognito/"
echo "   - Facebook: https://console.aws.amazon.com/cognito/"
echo "   - Apple: https://console.aws.amazon.com/cognito/"

echo ""
echo "🎉 Configuração do usuário admin concluída!"
echo "🚀 AGROISYNC está pronto para uso!"
