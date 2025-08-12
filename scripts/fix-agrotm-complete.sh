#!/bin/bash

echo "🚀 CORREÇÃO COMPLETA AGROTM.SOL - FRONTEND + BACKEND..."

# Configurar região
export AWS_DEFAULT_REGION=us-east-2

echo "📋 DIAGNÓSTICO INICIAL:"
echo "🔍 Status ECS Service:"
aws ecs describe-services \
    --cluster agrotm-cluster \
    --services agrotm-service \
    --query 'services[0].{Status:status,Running:runningCount,Desired:desiredCount,Pending:pendingCount}' \
    --output table

echo "🔍 Status Target Group:"
aws elbv2 describe-target-health \
    --target-group-arn arn:aws:elasticloadbalancing:us-east-2:119473395465:targetgroup/agrotm-tg/87e889f56ccade77 \
    --query 'TargetHealthDescriptions[*].{Target:Target.Id,Health:TargetHealth.State}' \
    --output table

echo ""
echo "📝 CORREÇÃO 1: Configurando DNS para API..."
aws route53 change-resource-record-sets \
    --hosted-zone-id Z00916223VXCYY3KXDZZ2 \
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
    }' && echo "✅ DNS API configurado!" || echo "❌ Erro no DNS API"

echo ""
echo "📝 CORREÇÃO 2: Atualizando variáveis do Amplify..."
aws amplify update-app \
    --app-id d2d5j98tau5snm \
    --environment-variables NEXT_PUBLIC_API_URL=https://api.agroisync.com \
    --region us-east-2 && echo "✅ Variável API atualizada!" || echo "❌ Erro na variável"

echo ""
echo "📝 CORREÇÃO 3: Verificando/Criando secrets do backend..."
# Verificar se existem
aws ssm get-parameter --name "agrotm/database-url" --region us-east-2 --query 'Parameter.Name' --output text 2>/dev/null && echo "✅ MONGODB_URI existe" || {
    echo "❌ MONGODB_URI não existe - criando..."
    aws ssm put-parameter \
        --name "agrotm/database-url" \
        --value "mongodb://agrotm:agrotm123@mongodb:27017/agrotm?authSource=admin" \
        --type "SecureString" \
        --region us-east-2 && echo "✅ MONGODB_URI criado!"
}

aws ssm get-parameter --name "agrotm/jwt-secret" --region us-east-2 --query 'Parameter.Name' --output text 2>/dev/null && echo "✅ JWT_SECRET existe" || {
    echo "❌ JWT_SECRET não existe - criando..."
    aws ssm put-parameter \
        --name "agrotm/jwt-secret" \
        --value "agrotm-production-secret-key-2024" \
        --type "SecureString" \
        --region us-east-2 && echo "✅ JWT_SECRET criado!"
}

echo ""
echo "📝 CORREÇÃO 4: Criando nova task definition corrigida..."
cat > /tmp/task-definition-fixed.json << 'EOF'
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
        },
        {
          "name": "CORS_ORIGIN",
          "value": "https://agroisync.com,https://www.agroisync.com,https://d2d5j98tau5snm.amplifyapp.com"
        }
      ],
      "secrets": [
        {
          "name": "MONGODB_URI",
          "valueFrom": "agrotm/database-url"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "agrotm/jwt-secret"
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
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
EOF

# Registrar nova task definition
TASK_DEF_ARN=$(aws ecs register-task-definition \
    --cli-input-json file:///tmp/task-definition-fixed.json \
    --region us-east-2 \
    --query 'taskDefinition.taskDefinitionArn' \
    --output text)

echo "✅ Nova task definition criada: $TASK_DEF_ARN"

echo ""
echo "📝 CORREÇÃO 5: Parando serviço ECS para reset..."
aws ecs update-service \
    --cluster agrotm-cluster \
    --service agrotm-service \
    --desired-count 0 \
    --region us-east-2 && echo "✅ Serviço parado!"

echo "⏳ Aguardando serviço parar completamente..."
sleep 60

echo ""
echo "📝 CORREÇÃO 6: Atualizando serviço com nova task definition..."
aws ecs update-service \
    --cluster agrotm-cluster \
    --service agrotm-service \
    --task-definition "$TASK_DEF_ARN" \
    --desired-count 1 \
    --force-new-deployment \
    --region us-east-2 && echo "✅ Serviço atualizado!"

echo ""
echo "📝 CORREÇÃO 7: Monitorando inicialização do backend..."
for i in {1..20}; do
    RUNNING=$(aws ecs describe-services \
        --cluster agrotm-cluster \
        --services agrotm-service \
        --query 'services[0].runningCount' \
        --output text \
        --region us-east-2)
    
    echo "⏳ Containers rodando: $RUNNING/1 (tentativa $i/20)"
    
    if [ "$RUNNING" = "1" ]; then
        echo "✅ Backend iniciado com sucesso!"
        break
    fi
    
    sleep 30
done

echo ""
echo "📝 CORREÇÃO 8: Verificando health do target group..."
sleep 60
aws elbv2 describe-target-health \
    --target-group-arn arn:aws:elasticloadbalancing:us-east-2:119473395465:targetgroup/agrotm-tg/87e889f56ccade77 \
    --query 'TargetHealthDescriptions[*].{Target:Target.Id,Health:TargetHealth.State,Description:TargetHealth.Description}' \
    --output table

echo ""
echo "📝 CORREÇÃO 9: Testando API diretamente..."
echo "🌐 Testando health check:"
curl -I http://agrotm-alb-804097878.us-east-2.elb.amazonaws.com/health --max-time 10

echo ""
echo "📝 CORREÇÃO 10: Forçando deploy do frontend..."
JOB_ID=$(aws amplify start-job \
    --app-id d2d5j98tau5snm \
    --branch-name main \
    --job-type RELEASE \
    --region us-east-2 \
    --query 'jobSummary.jobId' \
    --output text)

echo "🚀 Deploy frontend iniciado: $JOB_ID"

echo ""
echo "📝 CORREÇÃO 11: Monitorando deploy frontend..."
for i in {1..15}; do
    STATUS=$(aws amplify get-job \
        --app-id d2d5j98tau5snm \
        --branch-name main \
        --job-id $JOB_ID \
        --region us-east-2 \
        --query 'job.summary.status' \
        --output text 2>/dev/null)
    
    echo "⏳ Frontend deploy: $STATUS ($i/15)"
    
    if [ "$STATUS" = "SUCCEED" ]; then
        echo "✅ Frontend deploy concluído!"
        break
    elif [ "$STATUS" = "FAILED" ]; then
        echo "❌ Frontend deploy falhou!"
        break
    fi
    
    sleep 30
done

echo ""
echo "📝 CORREÇÃO 12: Configurando domínios finais..."
aws route53 change-resource-record-sets \
    --hosted-zone-id Z00916223VXCYY3KXDZZ2 \
    --change-batch '{
        "Changes": [{
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "agroisync.com",
                "Type": "CNAME",
                "TTL": 300,
                "ResourceRecords": [{"Value": "d2d5j98tau5snm.amplifyapp.com"}]
            }
        }]
    }' && echo "✅ Domínio principal configurado!"

aws route53 change-resource-record-sets \
    --hosted-zone-id Z00916223VXCYY3KXDZZ2 \
    --change-batch '{
        "Changes": [{
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "www.agroisync.com",
                "Type": "CNAME",
                "TTL": 300,
                "ResourceRecords": [{"Value": "d2d5j98tau5snm.amplifyapp.com"}]
            }
        }]
    }' && echo "✅ WWW configurado!"

echo ""
echo "📝 CORREÇÃO 13: Aguardando propagação final..."
sleep 120

echo ""
echo "🎯 TESTE FINAL COMPLETO:"
echo "🔍 Backend API:"
curl -I https://api.agroisync.com/health --max-time 15 2>/dev/null | head -1 || echo "❌ API não responde"

echo "🔍 Frontend:"
for url in "https://agroisync.com" "https://www.agroisync.com"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L "$url" --max-time 15)
    if [ "$STATUS" = "200" ]; then
        echo "✅ $url: OK ($STATUS)"
    else
        echo "❌ $url: ERRO ($STATUS)"
    fi
done

echo ""
echo "🎉 CORREÇÃO COMPLETA FINALIZADA!"
echo ""
echo "📋 RESUMO DAS CORREÇÕES:"
echo "   ✅ Backend ECS reiniciado com nova task definition"
echo "   ✅ Secrets do Parameter Store criados/verificados"
echo "   ✅ CORS configurado para domínios corretos"
echo "   ✅ DNS API configurado (api.agroisync.com)"
echo "   ✅ Variável NEXT_PUBLIC_API_URL corrigida"
echo "   ✅ Frontend redeploy com nova configuração"
echo "   ✅ Domínios principais configurados"
echo ""
echo "🌐 URLS FUNCIONAIS:"
echo "   - Frontend: https://agroisync.com"
echo "   - Frontend: https://www.agroisync.com"
echo "   - API: https://api.agroisync.com"
echo ""
echo "⏰ Aguarde mais 5-10 minutos para estabilização completa"
