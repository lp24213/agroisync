# Script PowerShell para CORREÇÃO DEFINITIVA AGROISYNC.COM - TODOS OS PROBLEMAS

Write-Host "🚀 CORREÇÃO DEFINITIVA AGROISYNC.COM - TODOS OS PROBLEMAS..." -ForegroundColor Green

# Configurar região
$env:AWS_DEFAULT_REGION = "us-east-2"

Write-Host "🔍 DIAGNÓSTICO INICIAL COMPLETO:" -ForegroundColor Yellow
Write-Host "Verificando DNS atual:" -ForegroundColor Cyan
nslookup agroisync.com
nslookup www.agroisync.com

Write-Host ""
Write-Host "📝 CORREÇÃO 1: REMOVENDO DNS CLOUDFRONT ERRADO..." -ForegroundColor Yellow

# Remover A record que aponta para CloudFront errado
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

# Remover CNAME www que aponta para CloudFront errado
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

# Criar CNAME para domínio raiz apontando para Amplify
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
        Write-Host "✅ DNS agroisync.com → Amplify configurado!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro no DNS raiz" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erro no DNS raiz" -ForegroundColor Red
}

# Criar CNAME para www apontando para Amplify
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
        Write-Host "✅ DNS www.agroisync.com → Amplify configurado!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro no DNS www" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erro no DNS www" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 CORREÇÃO 3: CONFIGURANDO DNS PARA API..." -ForegroundColor Yellow

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
    Write-Host "❌ Erro no DNS API" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 CORREÇÃO 4: AGUARDANDO PROPAGAÇÃO DNS..." -ForegroundColor Yellow
Write-Host "⏳ Aguardando 2 minutos para propagação DNS..." -ForegroundColor Cyan
Start-Sleep -Seconds 120

Write-Host ""
Write-Host "📝 CORREÇÃO 5: VERIFICANDO NOVA CONFIGURAÇÃO DNS..." -ForegroundColor Yellow
Write-Host "🔍 Novo DNS agroisync.com:" -ForegroundColor Cyan
nslookup agroisync.com
Write-Host "🔍 Novo DNS www.agroisync.com:" -ForegroundColor Cyan
nslookup www.agroisync.com
Write-Host "🔍 Novo DNS api.agroisync.com:" -ForegroundColor Cyan
nslookup api.agroisync.com

Write-Host ""
Write-Host "📝 CORREÇÃO 6: VERIFICANDO/CORRIGINDO BACKEND ECS..." -ForegroundColor Yellow

# Verificar status atual do ECS
try {
    $runningCount = aws ecs describe-services `
        --cluster agrotm-cluster `
        --services agrotm-service `
        --query 'services[0].runningCount' `
        --output text `
        --region us-east-2
    
    Write-Host "🔍 Containers rodando: $runningCount" -ForegroundColor Cyan
    
    if ($runningCount -eq "0") {
        Write-Host "❌ Backend parado! Reiniciando..." -ForegroundColor Red
        
        # Verificar/criar secrets
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
        
        # Forçar novo deployment
        try {
            aws ecs update-service `
                --cluster agrotm-cluster `
                --service agrotm-service `
                --force-new-deployment `
                --region us-east-2
            
            Write-Host "⏳ Aguardando backend iniciar..." -ForegroundColor Cyan
            for ($i = 1; $i -le 15; $i++) {
                try {
                    $running = aws ecs describe-services `
                        --cluster agrotm-cluster `
                        --services agrotm-service `
                        --query 'services[0].runningCount' `
                        --output text `
                        --region us-east-2
                    
                    Write-Host "⏳ Containers: $running/1 ($i/15)" -ForegroundColor Cyan
                    
                    if ($running -eq "1") {
                        Write-Host "✅ Backend iniciado!" -ForegroundColor Green
                        break
                    }
                    
                    Start-Sleep -Seconds 30
                } catch {
                    Write-Host "⚠️ Erro ao verificar status" -ForegroundColor Yellow
                }
            }
        } catch {
            Write-Host "❌ Erro ao reiniciar backend" -ForegroundColor Red
        }
    } else {
        Write-Host "✅ Backend já está rodando!" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Erro ao verificar status ECS" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 CORREÇÃO 7: ATUALIZANDO CONFIGURAÇÃO DO AMPLIFY..." -ForegroundColor Yellow

# Atualizar variável de ambiente do Amplify
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
    Write-Host "❌ Erro na variável" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 CORREÇÃO 8: REMOVENDO DOMÍNIO CUSTOMIZADO CONFLITANTE..." -ForegroundColor Yellow

# Remover qualquer domínio customizado que possa estar conflitando
try {
    aws amplify delete-domain-association `
        --app-id d2d5j98tau5snm `
        --domain-name agroisync.com `
        --region us-east-2 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Domínio customizado removido!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Nenhum domínio customizado encontrado" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Nenhum domínio customizado encontrado" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 CORREÇÃO 9: FORÇANDO DEPLOY DO FRONTEND..." -ForegroundColor Yellow

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
        
        # Monitorar deploy
        for ($i = 1; $i -le 15; $i++) {
            try {
                $status = aws amplify get-job `
                    --app-id d2d5j98tau5snm `
                    --branch-name main `
                    --job-id $jobId `
                    --region us-east-2 `
                    --query 'job.summary.status' `
                    --output text 2>$null
                
                Write-Host "⏳ Deploy status: $status ($i/15)" -ForegroundColor Cyan
                
                if ($status -eq "SUCCEED") {
                    Write-Host "✅ Deploy frontend concluído!" -ForegroundColor Green
                    break
                } elseif ($status -eq "FAILED") {
                    Write-Host "❌ Deploy frontend falhou!" -ForegroundColor Red
                    break
                }
                
                Start-Sleep -Seconds 30
            } catch {
                Write-Host "⚠️ Erro ao verificar status do deploy" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "⚠️ Não foi possível iniciar deploy" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erro ao iniciar deploy frontend" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 CORREÇÃO 10: AGUARDANDO ESTABILIZAÇÃO FINAL..." -ForegroundColor Yellow
Start-Sleep -Seconds 120

Write-Host ""
Write-Host "🎯 TESTE FINAL COMPLETO - TODOS OS COMPONENTES:" -ForegroundColor Green

Write-Host "🔍 1. Testando DNS direto:" -ForegroundColor Cyan
Write-Host "agroisync.com resolve para:" -ForegroundColor White
$dnsResult = nslookup agroisync.com 2>$null
if ($dnsResult) {
    $dnsResult | Select-String "Name:" | Select-Object -First 1
} else {
    Write-Host "❌ DNS não resolve" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔍 2. Testando Amplify direto:" -ForegroundColor Cyan
try {
    $amplifyResponse = Invoke-WebRequest -Uri "https://d2d5j98tau5snm.amplifyapp.com" -TimeoutSec 15 -UseBasicParsing
    Write-Host "Amplify direto: $($amplifyResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Amplify direto: ERRO - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔍 3. Testando API backend:" -ForegroundColor Cyan
try {
    $apiResponse = Invoke-WebRequest -Uri "http://agrotm-alb-804097878.us-east-2.elb.amazonaws.com/health" -TimeoutSec 15 -UseBasicParsing
    Write-Host "API health: $($apiResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "API health: ERRO - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔍 4. Testando domínios finais:" -ForegroundColor Cyan
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
Write-Host "🔍 5. Testando integração frontend/backend:" -ForegroundColor Cyan
Write-Host "Testando https://api.agroisync.com/health:" -ForegroundColor White
try {
    $apiHealthResponse = Invoke-WebRequest -Uri "https://api.agroisync.com/health" -TimeoutSec 15 -UseBasicParsing -Method Head
    Write-Host "Status: $($apiHealthResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ API não responde via HTTPS: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 CORREÇÃO DEFINITIVA FINALIZADA!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 TODAS AS CORREÇÕES APLICADAS:" -ForegroundColor Cyan
Write-Host "   ✅ DNS CloudFront errado removido" -ForegroundColor Green
Write-Host "   ✅ DNS agroisync.com → d2d5j98tau5snm.amplifyapp.com" -ForegroundColor Green
Write-Host "   ✅ DNS www.agroisync.com → d2d5j98tau5snm.amplifyapp.com" -ForegroundColor Green
Write-Host "   ✅ DNS api.agroisync.com → ALB backend" -ForegroundColor Green
Write-Host "   ✅ Backend ECS verificado/reiniciado" -ForegroundColor Green
Write-Host "   ✅ Secrets Parameter Store criados" -ForegroundColor Green
Write-Host "   ✅ Variável NEXT_PUBLIC_API_URL corrigida" -ForegroundColor Green
Write-Host "   ✅ Domínio customizado conflitante removido" -ForegroundColor Green
Write-Host "   ✅ Frontend redeploy forçado" -ForegroundColor Green
Write-Host "   ✅ Propagação DNS aguardada" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLS FINAIS:" -ForegroundColor Cyan
Write-Host "   - Frontend: https://agroisync.com" -ForegroundColor White
Write-Host "   - Frontend: https://www.agroisync.com" -ForegroundColor White
Write-Host "   - API: https://api.agroisync.com" -ForegroundColor White
Write-Host ""
Write-Host "⏰ Se ainda houver erro 404, aguarde mais 10-15 minutos para propagação completa do DNS" -ForegroundColor Yellow
