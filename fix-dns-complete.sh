#!/bin/bash

echo "🚀 CORREÇÃO COMPLETA DE DNS - AGROTM"
echo "======================================"

# Configurações
HOSTED_ZONE_ID="Z1014720F19TBNCSVRC1"
REGION="us-east-2"
APP_ID="d2d5j98tau5snm"

echo "📋 Configurações:"
echo "  Hosted Zone ID: $HOSTED_ZONE_ID"
echo "  Região: $REGION"
echo "  App ID: $APP_ID"
echo ""

# 1️⃣ CORRIGIR VALIDAÇÃO DO CERTIFICADO ACM
echo "1️⃣ Corrigindo validação do certificado ACM..."
aws route53 change-resource-record-sets \
    --hosted-zone-id $HOSTED_ZONE_ID \
    --change-batch file://fix-acm-validation.json

if [ $? -eq 0 ]; then
    echo "✅ Registro de validação ACM criado com sucesso!"
else
    echo "❌ Erro ao criar registro de validação ACM"
    exit 1
fi

echo ""

# 2️⃣ CORRIGIR DNS DO DOMÍNIO PRINCIPAL
echo "2️⃣ Corrigindo domínio principal..."
aws route53 change-resource-record-sets \
    --hosted-zone-id $HOSTED_ZONE_ID \
    --change-batch file://fix-main-domain.json

if [ $? -eq 0 ]; then
    echo "✅ Domínio principal corrigido!"
else
    echo "❌ Erro ao corrigir domínio principal"
    exit 1
fi

echo ""

# 3️⃣ CORRIGIR SUBDOMÍNIO WWW
echo "3️⃣ Corrigindo subdomínio www..."
aws route53 change-resource-record-sets \
    --hosted-zone-id $HOSTED_ZONE_ID \
    --change-batch file://fix-www-domain.json

if [ $? -eq 0 ]; then
    echo "✅ Subdomínio www corrigido!"
else
    echo "❌ Erro ao corrigir subdomínio www"
    exit 1
fi

echo ""

# 4️⃣ VERIFICAR STATUS
echo "4️⃣ Verificando status dos registros..."
echo "🔍 Verificando propagação DNS..."

echo "  Domínio principal:"
nslookup agrotmsol.com.br

echo "  Subdomínio www:"
nslookup www.agrotmsol.com.br

echo "  Registro de validação:"
nslookup _3978cce7ded379adc6cc9704bdff5269.agrotmsol.com.br

echo ""

# 5️⃣ VERIFICAR STATUS DO AMPLIFY
echo "5️⃣ Verificando status do Amplify..."
aws amplify get-domain-association \
    --app-id $APP_ID \
    --domain-name agrotmsol.com.br \
    --region $REGION \
    --query 'domainAssociation.{Status:domainStatus,CertStatus:certificateVerificationDNSRecord}'

echo ""

# 6️⃣ INSTRUÇÕES FINAIS
echo "🎯 CORREÇÕES IMPLEMENTADAS COM SUCESSO!"
echo "======================================"
echo "✅ Registro de validação ACM criado"
echo "✅ Domínio principal corrigido"
echo "✅ Subdomínio www corrigido"
echo ""
echo "⏳ AGUARDE PARA PROPAGAÇÃO:"
echo "  5-10 minutos: DNS propaga"
echo "  10-15 minutos: Certificado valida"
echo "  15-20 minutos: Site funcionando"
echo ""
echo "🌐 URLS FINAIS:"
echo "  https://agrotmsol.com.br"
echo "  https://www.agrotmsol.com.br"
echo "  https://app.agrotmsol.com.br"
echo ""
echo "🔍 Para verificar status:"
echo "  aws amplify get-domain-association --app-id $APP_ID --domain-name agrotmsol.com.br --region $REGION"
echo ""
echo "🚀 Correção completa finalizada!"
