#!/bin/bash

# AGROISYNC Frontend - Deploy no AWS Amplify
# Este script faz deploy do frontend no AWS Amplify

set -e

echo "🚀 Iniciando deploy do AGROISYNC Frontend no Amplify..."

# Verificar se o AWS CLI está configurado
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI não configurado. Configure suas credenciais primeiro."
    exit 1
fi

# Verificar se o arquivo de ambiente existe
if [ ! -f ".env.local" ]; then
    echo "⚠️  Arquivo .env.local não encontrado. Usando .env.example..."
    cp env.local.example .env.local
    echo "📝 Edite o arquivo .env.local com suas configurações reais antes de continuar."
    echo "   Pressione Enter quando estiver pronto..."
    read
fi

# Verificar se as variáveis obrigatórias estão definidas
if ! grep -q "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" .env.local; then
    echo "❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY não encontrada no .env.local"
    exit 1
fi

echo "✅ Configurações verificadas"

# Build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build falhou!"
    exit 1
fi

echo "✅ Build concluído"

# Export estático
echo "📦 Fazendo export estático..."
npm run export

if [ $? -ne 0 ]; then
    echo "❌ Export falhou!"
    exit 1
fi

echo "✅ Export concluído"

# Verificar se a pasta out foi criada
if [ ! -d "out" ]; then
    echo "❌ Pasta 'out' não encontrada após export!"
    exit 1
fi

echo "📁 Conteúdo da pasta out:"
ls -la out/

# Deploy no S3 (alternativa ao Amplify)
echo "🚀 Fazendo deploy no S3..."
BUCKET_NAME="agroisync-frontend-$(date +%s)"

# Criar bucket S3
aws s3 mb s3://$BUCKET_NAME --region us-east-1

# Configurar bucket para website estático
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document error.html

# Upload dos arquivos
aws s3 sync out/ s3://$BUCKET_NAME --delete

# Configurar política de bucket para acesso público
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

# Limpar arquivo temporário
rm bucket-policy.json

echo "✅ Deploy no S3 concluído!"
echo "🌐 Website disponível em: http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com"

# Configurar CloudFront (opcional)
echo "☁️  Configurando CloudFront..."
DISTRIBUTION_ID=$(aws cloudfront create-distribution \
    --distribution-config file://<(cat << EOF
{
    "CallerReference": "$(date +%s)",
    "Comment": "AGROISYNC Frontend",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$BUCKET_NAME",
                "DomainName": "$BUCKET_NAME.s3.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": ""
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$BUCKET_NAME",
        "ViewerProtocolPolicy": "redirect-to-https",
        "MinTTL": 0,
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        }
    },
    "Enabled": true
}
EOF
) --query 'Distribution.Id' --output text)

echo "✅ CloudFront configurado!"
echo "🌐 CDN URL: https://$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)"

echo ""
echo "🎉 AGROISYNC Frontend deployado com sucesso!"
echo ""
echo "📝 URLs de acesso:"
echo "   S3: http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com"
echo "   CloudFront: https://$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)"
echo ""
echo "📝 Próximos passos:"
echo "   1. Configure o domínio personalizado no Route 53"
echo "   2. Configure SSL no Certificate Manager"
echo "   3. Configure as variáveis de ambiente no Amplify"
echo "   4. Teste todas as funcionalidades"
echo "   5. Configure monitoramento e alertas"
echo ""
echo "🔒 Lembre-se de não commitar o arquivo .env.local no repositório!"
