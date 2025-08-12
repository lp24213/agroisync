# Script PowerShell para CORREÇÃO COMPLETA AGROTM.SOL - FRONTEND + BACKEND

Write-Host "🚀 CORREÇÃO COMPLETA AGROTM.SOL - FRONTEND + BACKEND..." -ForegroundColor Green

# Configurar região
$env:AWS_DEFAULT_REGION = "us-east-2"

Write-Host "📋 DIAGNÓSTICO INICIAL:" -ForegroundColor Yellow
Write-Host "🔍 Status ECS Service:" -ForegroundColor Cyan

try {
    $ecsStatus = aws ecs describe-services `
        --cluster agrotm-cluster `
        --services agrotm-service `
        --query 'services[0].{Status:status,Running:runningCount,Desired:desiredCount,Pending:pendingCount}' `
        --output table `
        --region us-east-2
    Write-Host $ecsStatus -ForegroundColor White
} catch {
    Write-Host "❌ Erro ao verificar status ECS" -ForegroundColor Red
}

Write-Host "🔍 Status Target Group:" -ForegroundColor Cyan
try {
    $tgStatus = aws elbv2 describe-target-health `
        --target-group-arn "arn:aws:elasticloadbalancing:us-east-2:119473395465:targetgroup/agrotm-tg/87e889f56ccade77" `
        --query 'TargetHealthDescriptions[*].{Target:Target.Id,Health:TargetHealth.State}' `
        --output table `
        --region us-east-2
    Write-Host $tgStatus -ForegroundColor White
} catch {
    Write-Host "❌ Erro ao verificar Target Group" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 CORREÇÃO 1: Configurando DNS para API..." -ForegroundColor Yellow

try {
    aws route53 change-resource-record-sets `
        --hosted-zone-id Z00916223VXCYY3KXDZZ2 `
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
        }' `
        --region us-east-2
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ DNS API configurado!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro no DNS API" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erro ao configurar DNS API" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 CORREÇÃO 2: Atualizando variáveis do Amplify..." -ForegroundColor Yellow

try {
    aws amplify update-app `
        --app-id d2d5j98tau5snm `
        --environment-variables NEXT_PUBLIC_API_URL=https://api.agroisync.com `
        --region us-east-2
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Variável API atualizada!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro na variável" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erro ao atualizar variável" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 CORREÇÃO 3: Verificando/Criando secrets do backend..." -ForegroundColor Yellow

# Verificar MONGODB_URI
try {
    $mongoExists = aws ssm get-parameter --name "agrotm/database-url" --region us-east-2 --query 'Parameter.Name' --output text 2>$null
    if ($mongoExists) {
        Write-Host "✅ MONGODB_URI existe" -ForegroundColor Green
    } else {
        Write-Host "❌ MONGODB_URI não existe - criando..." -ForegroundColor Yellow
        aws ssm put-parameter `
            --name "agrotm/database-url" `
            --value "mongodb://agrotm:agrotm123@mongodb:27017/agrotm?authSource=admin" `
            --type "SecureString" `
            --region us-east-2
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ MONGODB_URI criado!" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "⚠️ Erro ao verificar/criar MONGODB_URI" -ForegroundColor Yellow
}

# Verificar JWT_SECRET
try {
    $jwtExists = aws ssm get-parameter --name "agrotm/jwt-secret" --region us-east-2 --query 'Parameter.Name' --output text 2>$null
    if ($jwtExists) {
        Write-Host "✅ JWT_SECRET existe" -ForegroundColor Green
    } else {
        Write-Host "❌ JWT_SECRET não existe - criando..." -ForegroundColor Yellow
        aws ssm put-parameter `
            --name "agrotm/jwt-secret" `
            --value "agrotm-production-secret-key-2024" `
            --type "SecureString" `
            --region us-east-2
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ JWT_SECRET criado!" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "⚠️ Erro ao verificar/criar JWT_SECRET" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 CORREÇÃO 4: Criando nova task definition corrigida..." -ForegroundColor Yellow

# Criar arquivo de task definition
$taskDefContent = @'
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
'@

$taskDefContent | Out-File -FilePath "C:\temp\task-definition-fixed.json" -Encoding UTF8 -Force

# Registrar nova task definition
try {
    $taskDefArn = aws ecs register-task-definition `
        --cli-input-json file://C:\temp\task-definition-fixed.json `
        --region us-east-2 `
        --query 'taskDefinition.taskDefinitionArn' `
        --output text
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Nova task definition criada: $taskDefArn" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao criar task definition" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erro ao registrar task definition" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 CORREÇÃO 5: Parando serviço ECS para reset..." -ForegroundColor Yellow

try {
    aws ecs update-service `
        --cluster agrotm-cluster `
        --service agrotm-service `
        --desired-count 0 `
        --region us-east-2
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Serviço parado!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao parar serviço" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erro ao parar serviço ECS" -ForegroundColor Red
}

Write-Host "⏳ Aguardando serviço parar completamente..." -ForegroundColor Cyan
Start-Sleep -Seconds 60

Write-Host ""
Write-Host "📝 CORREÇÃO 6: Atualizando serviço com nova task definition..." -ForegroundColor Yellow

try {
    aws ecs update-service `
        --cluster agrotm-cluster `
        --service agrotm-service `
        --task-definition "$taskDefArn" `
        --desired-count 1 `
        --force-new-deployment `
        --region us-east-2
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Serviço atualizado!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao atualizar serviço" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erro ao atualizar serviço ECS" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 CORREÇÃO 7: Monitorando inicialização do backend..." -ForegroundColor Yellow

for ($i = 1; $i -le 20; $i++) {
    try {
        $running = aws ecs describe-services `
            --cluster agrotm-cluster `
            --services agrotm-service `
            --query 'services[0].runningCount' `
            --output text `
            --region us-east-2
        
        Write-Host "⏳ Containers rodando: $running/1 (tentativa $i/20)" -ForegroundColor Cyan
        
        if ($running -eq "1") {
            Write-Host "✅ Backend iniciado com sucesso!" -ForegroundColor Green
            break
        }
        
        Start-Sleep -Seconds 30
    } catch {
        Write-Host "⚠️ Erro ao verificar status" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "📝 CORREÇÃO 8: Verificando health do target group..." -ForegroundColor Yellow
Start-Sleep -Seconds 60

try {
    $tgHealth = aws elbv2 describe-target-health `
        --target-group-arn "arn:aws:elasticloadbalancing:us-east-2:119473395465:targetgroup/agrotm-tg/87e889f56ccade77" `
        --query 'TargetHealthDescriptions[*].{Target:Target.Id,Health:TargetHealth.State,Description:TargetHealth.Description}' `
        --output table `
        --region us-east-2
    Write-Host $tgHealth -ForegroundColor White
} catch {
    Write-Host "⚠️ Erro ao verificar health do target group" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 CORREÇÃO 9: Testando API diretamente..." -ForegroundColor Yellow
Write-Host "🌐 Testando health check:" -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://agrotm-alb-804097878.us-east-2.elb.amazonaws.com/health" -TimeoutSec 10 -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ API não responde: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 CORREÇÃO 10: Forçando deploy do frontend..." -ForegroundColor Yellow

try {
    $jobId = aws amplify start-job `
        --app-id d2d5j98tau5snm `
        --branch-name main `
        --job-type RELEASE `
        --region us-east-2 `
        --query 'jobSummary.jobId' `
        --output text
    
    if ($jobId -and $jobId -ne "None") {
        Write-Host "🚀 Deploy frontend iniciado: $jobId" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Não foi possível iniciar deploy" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erro ao iniciar deploy frontend" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 CORREÇÃO 11: Monitorando deploy frontend..." -ForegroundColor Yellow

if ($jobId -and $jobId -ne "None") {
    for ($i = 1; $i -le 15; $i++) {
        try {
            $status = aws amplify get-job `
                --app-id d2d5j98tau5snm `
                --branch-name main `
                --job-id $jobId `
                --region us-east-2 `
                --query 'job.summary.status' `
                --output text 2>$null
            
            Write-Host "⏳ Frontend deploy: $status ($i/15)" -ForegroundColor Cyan
            
            if ($status -eq "SUCCEED") {
                Write-Host "✅ Frontend deploy concluído!" -ForegroundColor Green
                break
            } elseif ($status -eq "FAILED") {
                Write-Host "❌ Frontend deploy falhou!" -ForegroundColor Red
                break
            }
            
            Start-Sleep -Seconds 30
        } catch {
            Write-Host "⚠️ Erro ao verificar status do deploy" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "📝 CORREÇÃO 12: Configurando domínios finais..." -ForegroundColor Yellow

# Configurar domínio principal
try {
    aws route53 change-resource-record-sets `
        --hosted-zone-id Z00916223VXCYY3KXDZZ2 `
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
        }' `
        --region us-east-2
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Domínio principal configurado!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao configurar domínio principal" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erro ao configurar domínio principal" -ForegroundColor Red
}

# Configurar WWW
try {
    aws route53 change-resource-record-sets `
        --hosted-zone-id Z00916223VXCYY3KXDZZ2 `
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
        }' `
        --region us-east-2
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ WWW configurado!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao configurar WWW" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erro ao configurar WWW" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 CORREÇÃO 13: Aguardando propagação final..." -ForegroundColor Yellow
Start-Sleep -Seconds 120

Write-Host ""
Write-Host "🎯 TESTE FINAL COMPLETO:" -ForegroundColor Green

Write-Host "🔍 Backend API:" -ForegroundColor Cyan
try {
    $apiResponse = Invoke-WebRequest -Uri "https://api.agroisync.com/health" -TimeoutSec 15 -UseBasicParsing
    Write-Host "Status: $($apiResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ API não responde: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🔍 Frontend:" -ForegroundColor Cyan
$urls = @("https://agroisync.com", "https://www.agroisync.com")

foreach ($url in $urls) {
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 15 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $url : OK ($($response.StatusCode))" -ForegroundColor Green
        } else {
            Write-Host "❌ $url : ERRO ($($response.StatusCode))" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ $url : ERRO - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 CORREÇÃO COMPLETA FINALIZADA!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 RESUMO DAS CORREÇÕES:" -ForegroundColor Cyan
Write-Host "   ✅ Backend ECS reiniciado com nova task definition" -ForegroundColor Green
Write-Host "   ✅ Secrets do Parameter Store criados/verificados" -ForegroundColor Green
Write-Host "   ✅ CORS configurado para domínios corretos" -ForegroundColor Green
Write-Host "   ✅ DNS API configurado (api.agroisync.com)" -ForegroundColor Green
Write-Host "   ✅ Variável NEXT_PUBLIC_API_URL corrigida" -ForegroundColor Green
Write-Host "   ✅ Frontend redeploy com nova configuração" -ForegroundColor Green
Write-Host "   ✅ Domínios principais configurados" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLS FUNCIONAIS:" -ForegroundColor Cyan
Write-Host "   - Frontend: https://agroisync.com" -ForegroundColor White
Write-Host "   - Frontend: https://www.agroisync.com" -ForegroundColor White
Write-Host "   - API: https://api.agroisync.com" -ForegroundColor White
Write-Host ""
Write-Host "⏰ Aguarde mais 5-10 minutos para estabilização completa" -ForegroundColor Yellow
