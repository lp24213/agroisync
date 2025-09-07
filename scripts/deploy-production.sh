#!/bin/bash

# Script de Deploy Profissional - AgroSync
# Este script automatiza todo o processo de deploy para produção

set -e  # Exit on any error

echo "🚀 Iniciando deploy profissional do AgroSync para produção..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar se estamos na branch correta
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    error "Deploy deve ser feito apenas da branch main. Branch atual: $CURRENT_BRANCH"
fi

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    error "Há mudanças não commitadas. Faça commit antes do deploy."
fi

# Verificar se as variáveis de ambiente estão configuradas
required_vars=(
    "AWS_ACCESS_KEY_ID"
    "AWS_SECRET_ACCESS_KEY"
    "MONGODB_URI"
    "JWT_SECRET"
    "STRIPE_SECRET_KEY"
    "REDIS_URL"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        error "Variável de ambiente $var não está configurada"
    fi
done

log "✅ Verificações de segurança concluídas"

# 1. Instalar dependências
log "📦 Instalando dependências..."
cd frontend
npm ci --prefer-offline --no-audit
cd ../backend
npm ci --prefer-offline --no-audit
cd ..

# 2. Executar testes
log "🧪 Executando testes..."
cd frontend
npm run test:ci
cd ../backend
npm run test:ci
cd ..

# 3. Linting
log "🔍 Executando linting..."
cd frontend
npm run lint:check
cd ../backend
npm run lint:check
cd ..

# 4. Build do frontend
log "🏗️ Construindo frontend..."
cd frontend
npm run build:production
cd ..

# 5. Build do backend
log "🏗️ Construindo backend..."
cd backend
npm run build:production
cd ..

# 6. Deploy para AWS Amplify
log "☁️ Fazendo deploy para AWS Amplify..."
amplify push --yes

# 7. Deploy do backend para Lambda
log "⚡ Fazendo deploy do backend para AWS Lambda..."
cd backend
npm run deploy:production
cd ..

# 8. Configurar CloudFront
log "🌐 Configurando CloudFront..."
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"

# 9. Verificar saúde da aplicação
log "🏥 Verificando saúde da aplicação..."
sleep 30  # Aguardar deploy completar

# Testar endpoints críticos
endpoints=(
    "https://api.agrosync.com/health"
    "https://api.agrosync.com/api/health"
    "https://www.agrosync.com"
)

for endpoint in "${endpoints[@]}"; do
    if curl -f -s "$endpoint" > /dev/null; then
        success "✅ $endpoint está funcionando"
    else
        error "❌ $endpoint não está respondendo"
    fi
done

# 10. Executar testes de integração
log "🔗 Executando testes de integração..."
npm run test:integration

# 11. Configurar monitoramento
log "📊 Configurando monitoramento..."
# Configurar alertas do CloudWatch
aws cloudwatch put-metric-alarm \
    --alarm-name "AgroSync-API-Error-Rate" \
    --alarm-description "Alerta para taxa de erro da API" \
    --metric-name "ErrorCount" \
    --namespace "AWS/Lambda" \
    --statistic "Sum" \
    --period 300 \
    --threshold 10 \
    --comparison-operator "GreaterThanThreshold" \
    --evaluation-periods 2

# 12. Backup do banco de dados
log "💾 Criando backup do banco de dados..."
mongodump --uri="$MONGODB_URI" --out="backup-$(date +%Y%m%d-%H%M%S)"

# 13. Notificar sucesso
log "📧 Enviando notificação de sucesso..."
# Aqui você pode adicionar notificação por email/Slack/etc.

# 14. Atualizar documentação
log "📚 Atualizando documentação..."
git tag -a "v$(date +%Y.%m.%d)" -m "Deploy para produção - $(date)"
git push origin "v$(date +%Y.%m.%d)"

success "🎉 Deploy para produção concluído com sucesso!"
success "🌐 Aplicação disponível em: https://www.agrosync.com"
success "📊 API disponível em: https://api.agrosync.com"
success "📈 Monitoramento: https://console.aws.amazon.com/cloudwatch"

log "📋 Próximos passos:"
log "   1. Verificar logs no CloudWatch"
log "   2. Monitorar métricas de performance"
log "   3. Verificar alertas de segurança"
log "   4. Testar funcionalidades críticas"
log "   5. Notificar equipe sobre o deploy"

echo ""
echo "🚀 AgroSync está online e pronto para gerar receita! 💰"
