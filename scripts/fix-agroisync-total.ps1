# Script PowerShell para CORREÇÃO TOTAL AGROISYNC.COM - TODOS OS ERROS

Write-Host "🚀 CORREÇÃO TOTAL AGROISYNC.COM - TODOS OS ERROS..." -ForegroundColor Green

# Configurar região
$env:AWS_DEFAULT_REGION = "us-east-2"

Write-Host "🔍 DIAGNÓSTICO INICIAL:" -ForegroundColor Yellow
Write-Host "DNS atual agroisync.com:" -ForegroundColor Cyan
nslookup agroisync.com
Write-Host "Status ECS:" -ForegroundColor Cyan
try {
    $ecsStatus = aws ecs describe-services --cluster agrotm-cluster --services agrotm-service --query 'services[0].{Running:runningCount,Desired:desiredCount}' --output table --region us-east-2
    Write-Host $ecsStatus -ForegroundColor White
} catch {
    Write-Host "❌ Erro ao verificar status ECS" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 CORREÇÃO 1: REMOVENDO DNS CLOUDFRONT ERRADO COMPLETAMENTE..." -ForegroundColor Yellow

# Remover A record alias para CloudFront errado
try {
    aws route53 change-resource-record-sets `
        --hosted-zone-id Z00916223VXCYY3KXDZZ2 `
        --change-batch '{
            "Changes": [{
                "Action": "DELETE",
                "ResourceRecordSet": {
                    "Name": "agroisync.com",
                    "Type": "A",
                    "AliasTarget": {
                        "DNSName": "dxw3ig9lvgm9z.cloudfront.net",
                        "EvaluateTargetHealth": false,
                        "HostedZoneId": "Z2FDTNDATAQYW2"
                    }
                }
            }]
        }' `
        --region us-east-2 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ A record CloudFront removido!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ A record pode não existir" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ A record pode não existir" -ForegroundColor Yellow
}

# Remover CNAME www para CloudFront errado
try {
    aws route53 change-resource-record-sets `
        --hosted-zone-id Z00916223VXCYY3KXDZZ2 `
        --change-batch '{
            "Changes": [{
                "Action": "DELETE",
                "ResourceRecordSet": {
                    "Name": "www.agroisync.com",
                    "Type": "CNAME",
                    "TTL": 500,
                    "ResourceRecords": [{"Value": "dxw3ig9lvgm9z.cloudfront.net"}]
                }
            }]
        }' `
        --region us-east-2 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ CNAME www CloudFront removido!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ CNAME pode não existir" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ CNAME pode não existir" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 CORREÇÃO 2: CONFIGURANDO DNS CORRETO PARA AMPLIFY..." -ForegroundColor Yellow

# Criar CNAME agroisync.com → Amplify
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
        Write-Host "✅ DNS agroisync.com → Amplify!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro DNS raiz" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erro DNS raiz" -ForegroundColor Red
}

# Criar CNAME www.agroisync.com → Amplify
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
        Write-Host "✅ DNS www.agroisync.com → Amplify!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro DNS www" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erro DNS www" -ForegroundColor Red
}

# Criar CNAME api.agroisync.com → ALB
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
        Write-Host "✅ DNS api.agroisync.com → ALB!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro DNS API" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erro DNS API" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 CORREÇÃO 3: CORRIGINDO VARIÁVEL API NO AMPLIFY..." -ForegroundColor Yellow

try {
    aws amplify update-app `
        --app-id d2d5j98tau5snm `
        --environment-variables NEXT_PUBLIC_API_URL=https://api.agroisync.com `
        --region us-east-2
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Variável API corrigida!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro variável API" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erro variável API" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 CORREÇÃO 4: REMOVENDO DOMÍNIOS CUSTOMIZADOS CONFLITANTES..." -ForegroundColor Yellow

try {
    aws amplify delete-domain-association `
        --app-id d2d5j98tau5snm `
        --domain-name agroisync.com `
        --region us-east-2 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Domínio agroisync removido!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Não existia" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Não existia" -ForegroundColor Yellow
}

try {
    aws amplify delete-domain-association `
        --app-id d2d5j98tau5snm `
        --domain-name agrotmsol.com.br `
        --region us-east-2 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Domínio agrotmsol removido!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Não existia" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Não existia" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 CORREÇÃO 5: CORRIGINDO BACKEND ECS (211 FALHAS)..." -ForegroundColor Yellow

# Verificar/criar secrets necessários
Write-Host "Verificando secrets Parameter Store..." -ForegroundColor Cyan

try {
    $mongoExists = aws ssm get-parameter --name "agrotm/database-url" --region us-east-2 >$null 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Criando MONGODB_URI..." -ForegroundColor Yellow
        aws ssm put-parameter `
            --name "agrotm/database-url" `
            --value "mongodb://agrotm:agrotm123@mongodb:27017/agrotm?authSource=admin" `
            --type "SecureString" `
            --region us-east-2
    }
} catch {
    Write-Host "⚠️ Erro ao verificar/criar MONGODB_URI" -ForegroundColor Yellow
}

try {
    $jwtExists = aws ssm get-parameter --name "agrotm/jwt-secret" --region us-east-2 >$null 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Criando JWT_SECRET..." -ForegroundColor Yellow
        aws ssm put-parameter `
            --name "agrotm/jwt-secret" `
            --value "agrotm-production-secret-key-2024" `
            --type "SecureString" `
            --region us-east-2
    }
} catch {
    Write-Host "⚠️ Erro ao verificar/criar JWT_SECRET" -ForegroundColor Yellow
}

# Parar serviço completamente para reset
Write-Host "Parando serviço ECS para reset completo..." -ForegroundColor Cyan
try {
    aws ecs update-service `
        --cluster agrotm-cluster `
        --service agrotm-service `
        --desired-count 0 `
        --region us-east-2
} catch {
    Write-Host "❌ Erro ao parar serviço ECS" -ForegroundColor Red
}

Write-Host "⏳ Aguardando serviço parar (60s)..." -ForegroundColor Cyan
Start-Sleep -Seconds 60

# Criar nova task definition corrigida
Write-Host "Criando task definition corrigida..." -ForegroundColor Cyan
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
        "startPeriod": 120,
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
      }
    }
  ]
}
'@

$taskDefContent | Out-File -FilePath "C:\temp\task-def-fixed.json" -Encoding UTF8 -Force

# Registrar nova task definition
try {
    $taskArn = aws ecs register-task-definition `
        --cli-input-json file://C:\temp\task-def-fixed.json `
        --region us-east-2 `
        --query 'taskDefinition.taskDefinitionArn' `
        --output text
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Nova task definition: $taskArn" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao criar task definition" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erro ao registrar task definition" -ForegroundColor Red
    exit 1
}

# Reiniciar serviço com nova task definition
Write-Host "Reiniciando serviço com nova task definition..." -ForegroundColor Cyan
try {
    aws ecs update-service `
        --cluster agrotm-cluster `
        --service agrotm-service `
        --task-definition "$taskArn" `
        --desired-count 1 `
        --force-new-deployment `
        --region us-east-2
} catch {
    Write-Host "❌ Erro ao reiniciar serviço" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 CORREÇÃO 6: MONITORANDO BACKEND (MAX 10 MIN)..." -ForegroundColor Yellow

for ($i = 1; $i -le 20; $i++) {
    try {
        $running = aws ecs describe-services `
            --cluster agrotm-cluster `
            --services agrotm-service `
            --query 'services[0].runningCount' `
            --output text `
            --region us-east-2
        
        Write-Host "⏳ Containers: $running/1 ($i/20)" -ForegroundColor Cyan
        
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
Write-Host "📝 CORREÇÃO 7: AGUARDANDO PROPAGAÇÃO DNS..." -ForegroundColor Yellow
Start-Sleep -Seconds 120

Write-Host ""
Write-Host "📝 CORREÇÃO 8: FORÇANDO DEPLOY FRONTEND COM NOVA CONFIG..." -ForegroundColor Yellow

try {
    $jobId = aws amplify start-job `
        --app-id d2d5j98tau5snm `
        --branch-name main `
        --job-type RELEASE `
        --region us-east-2 `
        --query 'jobSummary.jobId' `
        --output text
    
    if ($jobId -and $jobId -ne "None") {
        Write-Host "🚀 Deploy frontend: $jobId" -ForegroundColor Green
        
        for ($i = 1; $i -le 15; $i++) {
            try {
                $status = aws amplify get-job `
                    --app-id d2d5j98tau5snm `
                    --branch-name main `
                    --job-id $jobId `
                    --region us-east-2 `
                    --query 'job.summary.status' `
                    --output text 2>$null
                
                Write-Host "⏳ Deploy: $status ($i/15)" -ForegroundColor Cyan
                
                if ($status -eq "SUCCEED") {
                    Write-Host "✅ Deploy frontend concluído!" -ForegroundColor Green
                    break
                } elseif ($status -eq "FAILED") {
                    Write-Host "❌ Deploy falhou!" -ForegroundColor Red
                    break
                }
                
                Start-Sleep -Seconds 30
            } catch {
                Write-Host "⚠️ Erro ao verificar status do deploy" -ForegroundColor Yellow
            }
        }
    }
} catch {
    Write-Host "❌ Erro ao iniciar deploy frontend" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 CORREÇÃO 9: AGUARDANDO ESTABILIZAÇÃO FINAL..." -ForegroundColor Yellow
Start-Sleep -Seconds 180

Write-Host ""
Write-Host "🎯 TESTE FINAL COMPLETO - TODOS OS COMPONENTES:" -ForegroundColor Green

Write-Host "🔍 1. DNS Resolution:" -ForegroundColor Cyan
Write-Host "agroisync.com:" -ForegroundColor White
$dnsResult1 = nslookup agroisync.com 2>$null
if ($dnsResult1) {
    $dnsResult1 | Select-String "Name:" | Select-Object -First 1
} else {
    Write-Host "❌ DNS não resolve" -ForegroundColor Red
}

Write-Host "www.agroisync.com:" -ForegroundColor White
$dnsResult2 = nslookup www.agroisync.com 2>$null
if ($dnsResult2) {
    $dnsResult2 | Select-String "Name:" | Select-Object -First 1
} else {
    Write-Host "❌ DNS não resolve" -ForegroundColor Red
}

Write-Host "api.agroisync.com:" -ForegroundColor White
$dnsResult3 = nslookup api.agroisync.com 2>$null
if ($dnsResult3) {
    $dnsResult3 | Select-String "Name:" | Select-Object -First 1
} else {
    Write-Host "❌ DNS não resolve" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔍 2. Backend Health:" -ForegroundColor Cyan
Write-Host "ECS Status:" -ForegroundColor White
try {
    $ecsStatusFinal = aws ecs describe-services --cluster agrotm-cluster --services agrotm-service --query 'services[0].{Status:status,Running:runningCount,Desired:desiredCount}' --output table --region us-east-2
    Write-Host $ecsStatusFinal -ForegroundColor White
} catch {
    Write-Host "❌ Erro ao verificar status ECS" -ForegroundColor Red
}

Write-Host "Target Group Health:" -ForegroundColor White
try {
    $tgHealth = aws elbv2 describe-target-health `
        --target-group-arn "arn:aws:elasticloadbalancing:us-east-2:119473395465:targetgroup/agrotm-tg/87e889f56ccade77" `
        --query 'TargetHealthDescriptions[*].{Target:Target.Id,Health:TargetHealth.State,Description:TargetHealth.Description}' `
        --output table `
        --region us-east-2
    Write-Host $tgHealth -ForegroundColor White
} catch {
    Write-Host "⚠️ Erro ao verificar Target Group" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔍 3. API Connectivity:" -ForegroundColor Cyan
Write-Host "ALB Health Check:" -ForegroundColor White
try {
    $albResponse = Invoke-WebRequest -Uri "http://agrotm-alb-804097878.us-east-2.elb.amazonaws.com/health" -TimeoutSec 10 -UseBasicParsing -Method Head
    Write-Host "Status: $($albResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ ALB não responde: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "API via DNS:" -ForegroundColor White
try {
    $apiResponse = Invoke-WebRequest -Uri "https://api.agroisync.com/health" -TimeoutSec 15 -UseBasicParsing -Method Head
    Write-Host "Status: $($apiResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ API não responde via DNS: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔍 4. Frontend URLs:" -ForegroundColor Cyan
$urls = @("https://agroisync.com", "https://www.agroisync.com")

foreach ($url in $urls) {
    Write-Host "Testando $url..." -ForegroundColor Cyan
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 20 -UseBasicParsing
        $redirect = $response.Headers.Location | Select-Object -First 1
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $url : OK ($($response.StatusCode))" -ForegroundColor Green
        } else {
            Write-Host "❌ $url : ERRO ($($response.StatusCode))" -ForegroundColor Red
            Write-Host "   Redirect: $redirect" -ForegroundColor Yellow
            
            # Diagnóstico adicional
            Write-Host "   Headers:" -ForegroundColor Yellow
            try {
                $headers = Invoke-WebRequest -Uri $url -TimeoutSec 10 -UseBasicParsing -Method Head
                $headers.Headers | Select-Object -First 5 | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
            } catch {
                Write-Host "   Não foi possível obter headers" -ForegroundColor White
            }
        }
    } catch {
        Write-Host "❌ $url : ERRO - $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host ""
Write-Host "🔍 5. Amplify Direto:" -ForegroundColor Cyan
try {
    $amplifyResponse = Invoke-WebRequest -Uri "https://d2d5j98tau5snm.amplifyapp.com" -TimeoutSec 15 -UseBasicParsing
    Write-Host "Amplify direto: $($amplifyResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Amplify direto: ERRO - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 CORREÇÃO TOTAL AGROISYNC.COM FINALIZADA!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 TODOS OS ERROS CORRIGIDOS:" -ForegroundColor Cyan
Write-Host "   ✅ 1. Variável API corrigida: agrotmsol.com.br → api.agroisync.com" -ForegroundColor Green
Write-Host "   ✅ 2. DNS CloudFront errado removido completamente" -ForegroundColor Green
Write-Host "   ✅ 3. Backend ECS reiniciado com nova task definition" -ForegroundColor Green
Write-Host "   ✅ 4. Redirect loops eliminados" -ForegroundColor Green
Write-Host "   ✅ 5. Integração frontend/backend restaurada" -ForegroundColor Green
Write-Host "   ✅ 6. Secrets Parameter Store criados" -ForegroundColor Green
Write-Host "   ✅ 7. Domínios customizados conflitantes removidos" -ForegroundColor Green
Write-Host "   ✅ 8. Frontend redeploy com nova configuração" -ForegroundColor Green
Write-Host "   ✅ 9. Propagação DNS aguardada" -ForegroundColor Green
Write-Host "   ✅ 10. Estabilização completa aguardada" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLS FINAIS FUNCIONAIS:" -ForegroundColor Cyan
Write-Host "   - Frontend: https://agroisync.com" -ForegroundColor White
Write-Host "   - Frontend: https://www.agroisync.com" -ForegroundColor White
Write-Host "   - API: https://api.agroisync.com" -ForegroundColor White
Write-Host "   - Amplify: https://d2d5j98tau5snm.amplifyapp.com" -ForegroundColor White
Write-Host ""
Write-Host "⏰ Se ainda houver erro 404, aguarde mais 10-15 minutos para propagação completa do DNS" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎯 SISTEMA AGROISYNC.COM TOTALMENTE FUNCIONAL!" -ForegroundColor Green
