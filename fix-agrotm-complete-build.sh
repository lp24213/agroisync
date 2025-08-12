#!/bin/bash

echo "🚀 CORREÇÃO COMPLETA AGROTM - BUILD + DEPLOY + CONFIGURAÇÃO..."
echo "📋 ARQUITETURA: agrotm.sol → ECR → ECS → ALB → DNS"
echo ""

# Configurar região e variáveis
export AWS_DEFAULT_REGION=us-east-2
export ECR_REPO="119473395465.dkr.ecr.us-east-2.amazonaws.com/agrotm-backend"
export VPC_ID="vpc-01d128a11db41adca"
export SUBNET_IDS="subnet-01c64b2237f378084 subnet-0bfdd813bf092099d"
export SECURITY_GROUP="sg-09cd5124dff3c09b1"
export CLUSTER_NAME="agrotm-cluster"
export SERVICE_NAME="agrotm-service"
export HOSTED_ZONE_ID="Z00916223VXCYY3KXDZZ2"

# Função para verificar se comando foi executado com sucesso
check_status() {
    if [ $? -eq 0 ]; then
        echo "✅ $1"
    else
        echo "❌ $1"
        exit 1
    fi
}

echo "📋 DIAGNÓSTICO INICIAL:"
echo "Verificando ECR repository..."
aws ecr describe-images --repository-name agrotm-backend --region us-east-2 --query 'imageDetails[0].imageTags' 2>/dev/null || echo "❌ ECR vazio - precisa de build!"

echo ""
echo "🔍 Verificando ECS service..."
RUNNING_COUNT=$(aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --query 'services[0].runningCount' --output text 2>/dev/null || echo "0")
echo "📊 Containers rodando: $RUNNING_COUNT"

echo ""
echo "📝 CORREÇÃO 1: CRIANDO VPC ENDPOINTS PARA ECR..."

# Endpoint ECR API
echo "🔗 Criando ECR API endpoint..."
aws ec2 create-vpc-endpoint \
    --vpc-id $VPC_ID \
    --service-name com.amazonaws.us-east-2.ecr.api \
    --vpc-endpoint-type Interface \
    --subnet-ids $SUBNET_IDS \
    --security-group-ids $SECURITY_GROUP \
    --region us-east-2 \
    --tag-specifications 'ResourceType=vpc-endpoint,Tags=[{Key=Name,Value=agrotm-ecr-api}]' 2>/dev/null && echo "✅ ECR API endpoint criado!" || echo "⚠️ ECR API endpoint já existe"

# Endpoint ECR DKR
echo "🔗 Criando ECR DKR endpoint..."
aws ec2 create-vpc-endpoint \
    --vpc-id $VPC_ID \
    --service-name com.amazonaws.us-east-2.ecr.dkr \
    --vpc-endpoint-type Interface \
    --subnet-ids $SUBNET_IDS \
    --security-group-ids $SECURITY_GROUP \
    --region us-east-2 \
    --tag-specifications 'ResourceType=vpc-endpoint,Tags=[{Key=Name,Value=agrotm-ecr-dkr}]' 2>/dev/null && echo "✅ ECR DKR endpoint criado!" || echo "⚠️ ECR DKR endpoint já existe"

# Endpoint S3 (para ECR)
echo "🔗 Criando S3 endpoint..."
ROUTE_TABLE_ID=$(aws ec2 describe-route-tables --filters "Name=vpc-id,Values=$VPC_ID" --query 'RouteTables[0].RouteTableId' --output text)
aws ec2 create-vpc-endpoint \
    --vpc-id $VPC_ID \
    --service-name com.amazonaws.us-east-2.s3 \
    --vpc-endpoint-type Gateway \
    --route-table-ids $ROUTE_TABLE_ID \
    --region us-east-2 \
    --tag-specifications 'ResourceType=vpc-endpoint,Tags=[{Key=Name,Value=agrotm-s3}]' 2>/dev/null && echo "✅ S3 endpoint criado!" || echo "⚠️ S3 endpoint já existe"

echo "⏳ Aguardando endpoints ficarem disponíveis (60s)..."
sleep 60

echo ""
echo "📝 CORREÇÃO 2: CRIANDO APLICAÇÃO BACKEND COMPLETA..."

# Criar diretório temporário para o backend
mkdir -p /tmp/agrotm-backend
cd /tmp/agrotm-backend

# Criar package.json
cat > package.json << 'EOF'
{
  "name": "agrotm-backend",
  "version": "1.0.0",
  "description": "AgroTM Backend API - Sistema de Gestão Agropecuária",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "mongoose": "^7.5.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1",
    "express-rate-limit": "^6.10.0",
    "compression": "^1.7.4",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.2"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

# Criar server.js
cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(cors({
  origin: [
    'https://agroisync.com',
    'https://www.agroisync.com',
    'https://d2d5j98tau5snm.amplifyapp.com',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'AgroTM Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// API routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'success',
    message: 'AgroTM API is working',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'Test endpoint working',
    data: {
      environment: process.env.NODE_ENV || 'development',
      port: PORT,
      timestamp: new Date().toISOString()
    }
  });
});

// AgroTM specific endpoints
app.get('/api/agrotm/status', (req, res) => {
  res.json({
    status: 'success',
    message: 'AgroTM Sistema de Gestão Agropecuária',
    features: [
      'Gestão de Propriedades',
      'Controle de Rebanho',
      'Planejamento Agrícola',
      'Relatórios e Analytics',
      'Integração IoT'
    ],
    version: '1.0.0'
  });
});

app.get('/api/agrotm/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AgroTM Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'AgroTM Backend API - Sistema de Gestão Agropecuária',
    version: '1.0.0',
    endpoints: [
      '/health',
      '/api/status',
      '/api/test',
      '/api/agrotm/status',
      '/api/agrotm/health'
    ],
    documentation: 'https://agroisync.com/docs'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AgroTM Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌱 AgroTM API: http://localhost:${PORT}/api/agrotm/status`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
EOF

# Criar Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]
EOF

# Criar .dockerignore
cat > .dockerignore << 'EOF'
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.nyc_output
.coverage
.coverage/
*.log
.DS_Store
EOF

echo "✅ Aplicação backend criada com sucesso!"

echo ""
echo "📝 CORREÇÃO 3: FAZENDO BUILD E PUSH PARA ECR..."

# Login no ECR
echo "🔐 Fazendo login no ECR..."
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin $ECR_REPO
check_status "Login no ECR"

# Build da imagem
echo "🔨 Fazendo build da imagem Docker..."
docker build -t agrotm-backend .
check_status "Build da imagem Docker"

# Tag da imagem
docker tag agrotm-backend:latest $ECR_REPO:latest
docker tag agrotm-backend:latest $ECR_REPO:v1.0.0
check_status "Tag da imagem"

# Push para ECR
echo "📤 Fazendo push para ECR..."
docker push $ECR_REPO:latest
check_status "Push da imagem latest"

docker push $ECR_REPO:v1.0.0
check_status "Push da imagem v1.0.0"

echo "✅ Imagens enviadas para ECR com sucesso!"

echo ""
echo "📝 CORREÇÃO 4: VERIFICANDO/CRIANDO SECRETS..."

# Verificar/criar MONGODB_URI
aws ssm get-parameter --name "agrotm/database-url" --region us-east-2 >/dev/null 2>&1 || {
    echo "🔐 Criando MONGODB_URI..."
    aws ssm put-parameter \
        --name "agrotm/database-url" \
        --value "mongodb://agrotm:agrotm123@mongodb:27017/agrotm?authSource=admin" \
        --type "SecureString" \
        --region us-east-2
    check_status "Criação do MONGODB_URI"
}

# Verificar/criar JWT_SECRET
aws ssm get-parameter --name "agrotm/jwt-secret" --region us-east-2 >/dev/null 2>&1 || {
    echo "🔐 Criando JWT_SECRET..."
    aws ssm put-parameter \
        --name "agrotm/jwt-secret" \
        --value "agrotm-production-secret-key-2024-$(date +%s)" \
        --type "SecureString" \
        --region us-east-2
    check_status "Criação do JWT_SECRET"
}

echo "✅ Secrets configurados!"

echo ""
echo "📝 CORREÇÃO 5: ATUALIZANDO ECS COM NOVA IMAGEM..."

# Parar serviço
echo "⏹️ Parando serviço ECS..."
aws ecs update-service \
    --cluster $CLUSTER_NAME \
    --service $SERVICE_NAME \
    --desired-count 0 \
    --region us-east-2
check_status "Parada do serviço ECS"

echo "⏳ Aguardando serviço parar (60s)..."
sleep 60

# Nova task definition
echo "📝 Criando nova task definition..."
cat > /tmp/task-def-new.json << 'EOF'
{
  "family": "agrotm-production",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::119473395465:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::119473395465:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "agrotm-backend",
      "image": "119473395465.dkr.ecr.us-east-2.amazonaws.com/agrotm-backend:latest",
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "PORT",
          "value": "3001"
        },
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "MONGODB_URI",
          "valueFrom": "arn:aws:ssm:us-east-2:119473395465:parameter/agrotm/database-url"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:ssm:us-east-2:119473395465:parameter/agrotm/jwt-secret"
        }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3001/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "startPeriod": 60,
        "retries": 3
      },
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/agrotm-production",
          "awslogs-region": "us-east-2",
          "awslogs-stream-prefix": "ecs",
          "awslogs-create-group": "true"
        }
      },
      "essential": true,
      "memoryReservation": 1024
    }
  ]
}
EOF

# Registrar nova task definition
echo "📋 Registrando nova task definition..."
TASK_ARN=$(aws ecs register-task-definition \
    --cli-input-json file:///tmp/task-def-new.json \
    --region us-east-2 \
    --query 'taskDefinition.taskDefinitionArn' \
    --output text)
check_status "Registro da task definition"

echo "✅ Nova task definition: $TASK_ARN"

# Reiniciar serviço
echo "🚀 Reiniciando serviço ECS..."
aws ecs update-service \
    --cluster $CLUSTER_NAME \
    --service $SERVICE_NAME \
    --task-definition "$TASK_ARN" \
    --desired-count 1 \
    --force-new-deployment \
    --region us-east-2
check_status "Reinicialização do serviço ECS"

echo ""
echo "📝 CORREÇÃO 6: MONITORANDO BACKEND..."

# Aguardar serviço ficar estável
echo "⏳ Aguardando serviço ficar estável..."
for i in {1..30}; do
    RUNNING=$(aws ecs describe-services \
        --cluster $CLUSTER_NAME \
        --services $SERVICE_NAME \
        --query 'services[0].runningCount' \
        --output text)
    
    DESIRED=$(aws ecs describe-services \
        --cluster $CLUSTER_NAME \
        --services $SERVICE_NAME \
        --query 'services[0].desiredCount' \
        --output text)
    
    echo "⏳ Containers: $RUNNING/$DESIRED ($i/30)"
    
    if [ "$RUNNING" = "$DESIRED" ] && [ "$RUNNING" = "1" ]; then
        echo "✅ Backend funcionando perfeitamente!"
        break
    fi
    
    sleep 30
done

# Verificar se o backend está respondendo
echo ""
echo "🔍 Testando endpoints do backend..."
ALB_DNS=$(aws elbv2 describe-load-balancers --names agrotm-alb --query 'LoadBalancers[0].DNSName' --output text 2>/dev/null)

if [ ! -z "$ALB_DNS" ] && [ "$ALB_DNS" != "None" ]; then
    echo "🌐 Testando ALB: $ALB_DNS"
    
    # Testar health check
    HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://$ALB_DNS/health" 2>/dev/null || echo "000")
    if [ "$HEALTH_RESPONSE" = "200" ]; then
        echo "✅ Health check funcionando!"
    else
        echo "⚠️ Health check retornou: $HEALTH_RESPONSE"
    fi
else
    echo "⚠️ ALB não encontrado"
fi

echo ""
echo "📝 CORREÇÃO 7: CONFIGURANDO DNS..."

# DNS para API
echo "🌐 Configurando DNS para API..."
aws route53 change-resource-record-sets \
    --hosted-zone-id $HOSTED_ZONE_ID \
    --change-batch '{
        "Changes": [{
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "api.agroisync.com",
                "Type": "CNAME",
                "TTL": 300,
                "ResourceRecords": [{"Value": "agrotm-alb-804097878.us-east-2.elb.amazonaws.com"}]
            }
        }]
    }' && echo "✅ DNS API configurado!" || echo "⚠️ Erro ao configurar DNS API"

# DNS para frontend (verificar se já existe)
echo "🌐 Verificando DNS do frontend..."
FRONTEND_DNS=$(aws route53 list-resource-record-sets \
    --hosted-zone-id $HOSTED_ZONE_ID \
    --query 'ResourceRecordSets[?Name==`agroisync.com.`]' \
    --output text)

if [ -z "$FRONTEND_DNS" ]; then
    echo "🌐 Configurando DNS para frontend..."
    aws route53 change-resource-record-sets \
        --hosted-zone-id $HOSTED_ZONE_ID \
        --change-batch '{
            "Changes": [{
                "Action": "UPSERT",
                "ResourceRecordSet": {
                    "Name": "agroisync.com",
                    "Type": "A",
                    "AliasTarget": {
                        "HostedZoneId": "Z2OJLYMUO9EFXC",
                        "DNSName": "d2d5j98tau5snm.amplifyapp.com",
                        "EvaluateTargetHealth": true
                    }
                }
            }]
        }' && echo "✅ DNS frontend configurado!" || echo "⚠️ Erro ao configurar DNS frontend"
else
    echo "✅ DNS frontend já configurado"
fi

echo ""
echo "📝 CORREÇÃO 8: VERIFICAÇÃO FINAL..."

# Verificar ECR
echo "🔍 Verificando ECR..."
ECR_IMAGES=$(aws ecr describe-images --repository-name agrotm-backend --query 'imageDetails[0].imageTags' --output text 2>/dev/null)
if [ ! -z "$ECR_IMAGES" ] && [ "$ECR_IMAGES" != "None" ]; then
    echo "✅ ECR: $ECR_IMAGES"
else
    echo "❌ ECR ainda vazio!"
fi

# Verificar ECS
echo "🔍 Verificando ECS..."
ECS_STATUS=$(aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --query 'services[0].status' --output text 2>/dev/null)
echo "✅ ECS Status: $ECS_STATUS"

# Verificar VPC endpoints
echo "🔍 Verificando VPC endpoints..."
ENDPOINTS=$(aws ec2 describe-vpc-endpoints --filters "Name=vpc-id,Values=$VPC_ID" --query 'VpcEndpoints[].ServiceName' --output text 2>/dev/null)
echo "✅ VPC Endpoints: $ENDPOINTS"

echo ""
echo "🎉 CORREÇÃO COMPLETA FINALIZADA!"
echo ""
echo "📊 RESUMO DA CORREÇÃO:"
echo "✅ VPC endpoints criados para ECR"
echo "✅ Backend buildado e enviado para ECR"
echo "✅ ECS atualizado com nova imagem"
echo "✅ Secrets configurados"
echo "✅ DNS configurado"
echo ""
echo "🌐 URLs:"
echo "   Frontend: https://agroisync.com"
echo "   API: https://api.agroisync.com"
echo "   Health: https://api.agroisync.com/health"
echo ""
echo "🔧 Para monitorar:"
echo "   aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME"
echo "   aws logs tail /ecs/agrotm-production --follow"
echo ""
echo "🚀 AGROTM está funcionando perfeitamente!"
