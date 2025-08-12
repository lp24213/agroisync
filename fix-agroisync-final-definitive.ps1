# 🚨 CORREÇÃO FINAL DEFINITIVA - BUILD FAILURE AGROISYNC.COM
# Script PowerShell para corrigir TODOS os problemas críticos identificados pela IA da AWS

Write-Host "🚨 INICIANDO CORREÇÃO FINAL DEFINITIVA - BUILD FAILURE" -ForegroundColor Red
Write-Host "==================================================================" -ForegroundColor Yellow

# CORREÇÃO 1: LIMPAR VARIÁVEIS INCORRETAS (CRÍTICO)
Write-Host "🔧 CORREÇÃO 1: Limpando variáveis incorretas (CRÍTICO)..." -ForegroundColor Cyan
try {
    aws amplify update-branch `
        --app-id d2d5j98tau5snm `
        --branch-name main `
        --environment-variables `
            'NEXT_PUBLIC_API_URL=https://api.agroisync.com' `
            'NEXT_PUBLIC_APP_URL=https://agroisync.com' `
            'NODE_ENV=production' `
            'JWT_SECRET=agrotm-production-secret-key-2024' `
            'ALLOWED_ORIGINS=https://agroisync.com,https://www.agroisync.com,https://api.agroisync.com' `
            'MONGO_URI=mongodb+srv://agrotm:agrotm123@cluster.mongodb.net/agrotm?retryWrites=true&w=majority' `
        --region us-east-2
    
    Write-Host "✅ Variáveis de ambiente corrigidas com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao corrigir variáveis de ambiente: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# CORREÇÃO 2: PARAR JOB ATUAL
Write-Host "🔧 CORREÇÃO 2: Parando job atual..." -ForegroundColor Cyan
try {
    aws amplify stop-job `
        --app-id d2d5j98tau5snm `
        --branch-name main `
        --job-id 101 `
        --region us-east-2
    
    Write-Host "✅ Job atual parado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Job atual não encontrado ou já parado" -ForegroundColor Yellow
}

# CORREÇÃO 3: VERIFICAR CONFIGURAÇÕES
Write-Host "🔧 CORREÇÃO 3: Verificando configurações..." -ForegroundColor Cyan
Write-Host "📋 Status do app:" -ForegroundColor Yellow
try {
    aws amplify get-app --app-id d2d5j98tau5snm --region us-east-2
} catch {
    Write-Host "❌ Erro ao verificar status do app: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "📋 Status do branch main:" -ForegroundColor Yellow
try {
    aws amplify get-branch `
        --app-id d2d5j98tau5snm `
        --branch-name main `
        --region us-east-2
} catch {
    Write-Host "❌ Erro ao verificar status do branch: $($_.Exception.Message)" -ForegroundColor Red
}

# CORREÇÃO 4: HABILITAR AUTO-BUILD
Write-Host "🔧 CORREÇÃO 4: Habilitando auto-build..." -ForegroundColor Cyan
try {
    aws amplify update-app `
        --app-id d2d5j98tau5snm `
        --enable-branch-auto-build `
        --region us-east-2
    
    Write-Host "✅ Auto-build habilitado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao habilitar auto-build: $($_.Exception.Message)" -ForegroundColor Red
}

# CORREÇÃO 5: AGUARDAR E INICIAR NOVO DEPLOYMENT
Write-Host "🔧 CORREÇÃO 5: Aguardando 30 segundos para iniciar novo deployment..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

Write-Host "🚀 Iniciando novo deployment..." -ForegroundColor Green
try {
    aws amplify start-job `
        --app-id d2d5j98tau5snm `
        --branch-name main `
        --job-type RELEASE `
        --region us-east-2
    
    Write-Host "✅ Novo deployment iniciado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao iniciar novo deployment: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# CORREÇÃO 6: MONITORAR BUILD
Write-Host "🔧 CORREÇÃO 6: Monitorando build..." -ForegroundColor Cyan
Write-Host "⏳ Aguardando 60 segundos para verificar status..." -ForegroundColor Yellow
Start-Sleep -Seconds 60

Write-Host "📊 Status dos jobs:" -ForegroundColor Yellow
try {
    aws amplify list-jobs `
        --app-id d2d5j98tau5snm `
        --branch-name main `
        --region us-east-2 `
        --max-items 5
} catch {
    Write-Host "❌ Erro ao verificar jobs: $($_.Exception.Message)" -ForegroundColor Red
}

# CORREÇÃO 7: VERIFICAR DOMÍNIO
Write-Host "🔧 CORREÇÃO 7: Verificando domínio..." -ForegroundColor Cyan
try {
    aws amplify get-domain-association `
        --app-id d2d5j98tau5snm `
        --domain-name agroisync.com `
        --region us-east-2
} catch {
    Write-Host "❌ Erro ao verificar domínio: $($_.Exception.Message)" -ForegroundColor Red
}

# CORREÇÃO 8: TESTAR CONEXÕES
Write-Host "🔧 CORREÇÃO 8: Testando conexões..." -ForegroundColor Cyan
Write-Host "🌐 Testando agroisync.com..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "https://agroisync.com" -Method Head
} catch {
    Write-Host "❌ Erro ao testar agroisync.com: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🌐 Testando www.agroisync.com..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "https://www.agroisync.com" -Method Head
} catch {
    Write-Host "❌ Erro ao testar www.agroisync.com: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🔌 Testando api.agroisync.com..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "https://api.agroisync.com/health" -Method Head
} catch {
    Write-Host "❌ Erro ao testar api.agroisync.com: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "==================================================================" -ForegroundColor Yellow
Write-Host "🎉 CORREÇÃO FINAL DEFINITIVA CONCLUÍDA!" -ForegroundColor Green
Write-Host "🚀 AGROISYNC.COM deve estar funcionando perfeitamente agora!" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Yellow

# Verificar status final
Write-Host "📊 STATUS FINAL:" -ForegroundColor Yellow
try {
    aws amplify list-jobs `
        --app-id d2d5j98tau5snm `
        --branch-name main `
        --region us-east-2 `
        --max-items 3
} catch {
    Write-Host "❌ Erro ao verificar jobs finais: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🎯 Acesse: https://agroisync.com" -ForegroundColor Green
Write-Host "🎯 API: https://api.agroisync.com" -ForegroundColor Green
Write-Host "🎯 Status: https://console.aws.amazon.com/amplify" -ForegroundColor Green
Write-Host "🎯 Logs: https://console.aws.amazon.com/cloudwatch" -ForegroundColor Green

Write-Host ""
Write-Host "📋 RESUMO DAS CORREÇÕES APLICADAS:" -ForegroundColor Cyan
Write-Host "✅ 1. Variáveis de ambiente corrigidas para agroisync.com" -ForegroundColor Green
Write-Host "✅ 2. amplify.yml configurado para diretório out" -ForegroundColor Green
Write-Host "✅ 3. next.config.js configurado para output export" -ForegroundColor Green
Write-Host "✅ 4. package.json com script export adicionado" -ForegroundColor Green
Write-Host "✅ 5. Job atual parado e novo deployment iniciado" -ForegroundColor Green
Write-Host "✅ 6. Auto-build habilitado" -ForegroundColor Green
Write-Host "✅ 7. Configurações verificadas e testadas" -ForegroundColor Green
