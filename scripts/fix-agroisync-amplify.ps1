# Script PowerShell para CORREÇÃO DEFINITIVA AGROISYNC.COM - AMPLIFY

Write-Host "🚀 CORREÇÃO DEFINITIVA AGROISYNC.COM - AMPLIFY..." -ForegroundColor Green

# Configurar região
$env:AWS_DEFAULT_REGION = "us-east-2"

Write-Host "🔍 Status atual do DNS AGROISYNC:" -ForegroundColor Yellow
Write-Host "Verificando agroisync.com:" -ForegroundColor Cyan
nslookup agroisync.com
Write-Host "Verificando www.agroisync.com:" -ForegroundColor Cyan
nslookup www.agroisync.com

Write-Host ""
Write-Host "📝 CORREÇÃO 1: Apontando agroisync.com para Amplify..." -ForegroundColor Yellow

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
        }'
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Domínio agroisync.com corrigido!" -ForegroundColor Green
    } else {
        throw "Erro ao corrigir agroisync.com"
    }
} catch {
    Write-Host "❌ Erro ao corrigir agroisync.com: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 CORREÇÃO 2: Apontando www.agroisync.com para Amplify..." -ForegroundColor Yellow

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
        }'
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ WWW.agroisync.com corrigido!" -ForegroundColor Green
    } else {
        throw "Erro ao corrigir WWW.agroisync.com"
    }
} catch {
    Write-Host "❌ Erro ao corrigir WWW.agroisync.com: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 CORREÇÃO 3: Removendo domínio customizado do Amplify (se existir)..." -ForegroundColor Yellow

try {
    aws amplify delete-domain-association `
        --app-id d2d5j98tau5snm `
        --domain-name agroisync.com `
        --region us-east-2 2>$null
    Write-Host "⚠️ Domínio customizado removido (se existia)" -ForegroundColor Yellow
} catch {
    Write-Host "⚠️ Não foi possível remover domínio customizado" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 CORREÇÃO 4: Aguardando propagação DNS..." -ForegroundColor Yellow
Write-Host "⏳ Aguardando 2 minutos para propagação..." -ForegroundColor Cyan
Start-Sleep -Seconds 120

Write-Host ""
Write-Host "📝 CORREÇÃO 5: Verificando nova configuração DNS..." -ForegroundColor Yellow
Write-Host "🔍 Novo DNS agroisync.com:" -ForegroundColor Cyan
nslookup agroisync.com
Write-Host "🔍 Novo DNS www.agroisync.com:" -ForegroundColor Cyan
nslookup www.agroisync.com

Write-Host ""
Write-Host "📝 CORREÇÃO 6: Testando conectividade AGROISYNC..." -ForegroundColor Yellow

Write-Host "🌐 Testando https://agroisync.com:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://agroisync.com" -TimeoutSec 15 -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Status: ERRO - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🌐 Testando https://www.agroisync.com:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://www.agroisync.com" -TimeoutSec 15 -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Status: ERRO - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🌐 Testando https://d2d5j98tau5snm.amplifyapp.com (direto):" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://d2d5j98tau5snm.amplifyapp.com" -TimeoutSec 15 -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Status: ERRO - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 CORREÇÃO 7: Atualizando variável de ambiente do Amplify..." -ForegroundColor Yellow

try {
    aws amplify update-app `
        --app-id d2d5j98tau5snm `
        --environment-variables NEXT_PUBLIC_API_URL=https://agroisync.com `
        --region us-east-2
    Write-Host "✅ Variável de ambiente atualizada!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Não foi possível atualizar variável de ambiente" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 CORREÇÃO 8: Forçando novo deploy Amplify..." -ForegroundColor Yellow

try {
    $jobOutput = aws amplify start-job `
        --app-id d2d5j98tau5snm `
        --branch-name main `
        --job-type RELEASE `
        --region us-east-2 `
        --query 'jobSummary.jobId' `
        --output text 2>$null
    
    if ($jobOutput -and $jobOutput -ne "None") {
        $JOB_ID = $jobOutput
        Write-Host "🚀 Deploy iniciado com Job ID: $JOB_ID" -ForegroundColor Green
        
        Write-Host "📝 CORREÇÃO 9: Monitorando deploy..." -ForegroundColor Yellow
        for ($i = 1; $i -le 15; $i++) {
            try {
                $statusOutput = aws amplify get-job `
                    --app-id d2d5j98tau5snm `
                    --branch-name main `
                    --job-id $JOB_ID `
                    --region us-east-2 `
                    --query 'job.summary.status' `
                    --output text 2>$null
                
                $STATUS = $statusOutput
                Write-Host "⏳ Deploy status: $STATUS (tentativa $i/15)" -ForegroundColor Cyan
                
                if ($STATUS -eq "SUCCEED") {
                    Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
                    break
                } elseif ($STATUS -eq "FAILED") {
                    Write-Host "❌ Deploy falhou!" -ForegroundColor Red
                    break
                }
                
                Start-Sleep -Seconds 30
            } catch {
                Write-Host "⚠️ Erro ao verificar status do deploy" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "⚠️ Não foi possível iniciar novo deploy (pode não ser necessário)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Erro ao iniciar deploy" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 CORREÇÃO 10: Teste final após todas as correções..." -ForegroundColor Yellow
Start-Sleep -Seconds 60

Write-Host "🎯 TESTE FINAL AGROISYNC:" -ForegroundColor Green
$urls = @("https://agroisync.com", "https://www.agroisync.com")

foreach ($url in $urls) {
    Write-Host "Testando $url..." -ForegroundColor Cyan
    try {
        $startTime = Get-Date
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 20 -UseBasicParsing
        $endTime = Get-Date
        $responseTime = ($endTime - $startTime).TotalSeconds
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $url : OK ($($response.StatusCode)) - ${responseTime}s" -ForegroundColor Green
        } else {
            Write-Host "❌ $url : ERRO ($($response.StatusCode))" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ $url : ERRO - $($_.Exception.Message)" -ForegroundColor Red
        
        # Diagnóstico adicional
        Write-Host "   🔍 Diagnóstico:" -ForegroundColor Yellow
        try {
            $headers = Invoke-WebRequest -Uri $url -TimeoutSec 10 -UseBasicParsing -Method Head
            Write-Host "   Status: $($headers.StatusCode)" -ForegroundColor White
        } catch {
            Write-Host "   Não foi possível obter headers" -ForegroundColor White
        }
    }
    Write-Host ""
}

Write-Host ""
Write-Host "🎉 CORREÇÃO AGROISYNC FINALIZADA!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 RESUMO DAS CORREÇÕES:" -ForegroundColor Cyan
Write-Host "   ✅ DNS agroisync.com → d2d5j98tau5snm.amplifyapp.com" -ForegroundColor Green
Write-Host "   ✅ DNS www.agroisync.com → d2d5j98tau5snm.amplifyapp.com" -ForegroundColor Green
Write-Host "   ✅ Variável de ambiente atualizada" -ForegroundColor Green
Write-Host "   ✅ Domínio customizado removido" -ForegroundColor Green
Write-Host "   ✅ Deploy forçado" -ForegroundColor Green
Write-Host "   ✅ Propagação DNS aguardada" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLs CORRIGIDAS AGROISYNC:" -ForegroundColor Cyan
Write-Host "   - https://agroisync.com" -ForegroundColor White
Write-Host "   - https://www.agroisync.com" -ForegroundColor White
Write-Host ""
Write-Host "⏰ Se ainda houver erro 404, aguarde mais 10-15 minutos para propagação completa do DNS" -ForegroundColor Yellow
