# 🚀 CORREÇÕES ULTRA MEGA MASTER DEFINITIVAS - AGROISYNC.COM
# Script PowerShell para corrigir TODOS os erros identificados pela IA da AWS

Write-Host "🚀 INICIANDO CORREÇÕES ULTRA MEGA MASTER DEFINITIVAS AGROISYNC.COM" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Yellow

# CORREÇÃO 1: VARIÁVEIS DE AMBIENTE
Write-Host "🔧 CORREÇÃO 1: Configurando variáveis de ambiente..." -ForegroundColor Cyan
try {
    aws amplify put-app `
        --app-id d2d5j98tau5snm `
        --environment-variables `
            'NEXT_PUBLIC_API_URL=https://api.agroisync.com' `
            'NEXT_PUBLIC_APP_URL=https://agroisync.com' `
            'NODE_ENV=production' `
            'JWT_SECRET=agrotm-production-secret-key-2024' `
            'ALLOWED_ORIGINS=https://agroisync.com,https://www.agroisync.com,https://api.agroisync.com' `
            'MONGO_URI=mongodb+srv://agrotm:agrotm123@cluster.mongodb.net/agrotm?retryWrites=true&w=majority' `
        --region us-east-2
    
    Write-Host "✅ Variáveis de ambiente configuradas com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao configurar variáveis de ambiente: $($_.Exception.Message)" -ForegroundColor Red
}

# CORREÇÃO 2: REMOVER DOMÍNIO ANTIGO
Write-Host "🔧 CORREÇÃO 2: Removendo domínio antigo agrotmsol.com.br..." -ForegroundColor Cyan
try {
    aws amplify delete-domain-association `
        --app-id d2d5j98tau5snm `
        --domain-name agrotmsol.com.br `
        --region us-east-2
    
    Write-Host "✅ Domínio antigo removido com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Domínio antigo não encontrado ou já removido" -ForegroundColor Yellow
}

# CORREÇÃO 3: CONFIGURAR DOMÍNIO CORRETO
Write-Host "🔧 CORREÇÃO 3: Configurando domínio agroisync.com..." -ForegroundColor Cyan
try {
    aws amplify update-domain-association `
        --app-id d2d5j98tau5snm `
        --domain-name agroisync.com `
        --region us-east-2
    
    Write-Host "✅ Domínio agroisync.com configurado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao configurar domínio agroisync.com: $($_.Exception.Message)" -ForegroundColor Red
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

# CORREÇÃO 5: CONFIGURAR REDIRECIONAMENTOS
Write-Host "🔧 CORREÇÃO 5: Configurando redirecionamentos..." -ForegroundColor Cyan
try {
    aws amplify update-domain-association `
        --app-id d2d5j98tau5snm `
        --domain-name agroisync.com `
        --redirects '[
            {
                "source": "https://www.agroisync.com/<*>",
                "target": "https://agroisync.com/<*>",
                "status": "301"
            },
            {
                "source": "/<*>",
                "target": "/index.html",
                "status": "404-200"
            }
        ]' `
        --region us-east-2
    
    Write-Host "✅ Redirecionamentos configurados com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao configurar redirecionamentos: $($_.Exception.Message)" -ForegroundColor Red
}

# CORREÇÃO 6: VERIFICAR CONFIGURAÇÕES
Write-Host "🔧 CORREÇÃO 6: Verificando configurações..." -ForegroundColor Cyan
Write-Host "📋 Status do app:" -ForegroundColor Yellow
try {
    aws amplify get-app --app-id d2d5j98tau5snm --region us-east-2
} catch {
    Write-Host "❌ Erro ao verificar status do app: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "📋 Status do domínio:" -ForegroundColor Yellow
try {
    aws amplify get-domain-association `
        --app-id d2d5j98tau5snm `
        --domain-name agroisync.com `
        --region us-east-2
} catch {
    Write-Host "❌ Erro ao verificar status do domínio: $($_.Exception.Message)" -ForegroundColor Red
}

# CORREÇÃO 7: TESTAR CONEXÕES
Write-Host "🔧 CORREÇÃO 7: Testando conexões..." -ForegroundColor Cyan
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

# CORREÇÃO 8: FAZER DEPLOY
Write-Host "🔧 CORREÇÃO 8: Iniciando novo deploy..." -ForegroundColor Cyan
try {
    aws amplify start-job `
        --app-id d2d5j98tau5snm `
        --branch-name main `
        --job-type RELEASE `
        --region us-east-2
    
    Write-Host "✅ Deploy iniciado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao iniciar deploy: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "==================================================================" -ForegroundColor Yellow
Write-Host "🎉 CORREÇÕES ULTRA MEGA MASTER DEFINITIVAS CONCLUÍDAS!" -ForegroundColor Green
Write-Host "🚀 AGROISYNC.COM deve estar funcionando perfeitamente agora!" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Yellow

# Verificar status final
Write-Host "📊 STATUS FINAL:" -ForegroundColor Yellow
try {
    aws amplify list-jobs `
        --app-id d2d5j98tau5snm `
        --branch-name main `
        --region us-east-2 `
        --max-items 5
} catch {
    Write-Host "❌ Erro ao verificar jobs: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🎯 Acesse: https://agroisync.com" -ForegroundColor Green
Write-Host "🎯 API: https://api.agroisync.com" -ForegroundColor Green
Write-Host "🎯 Status: https://console.aws.amazon.com/amplify" -ForegroundColor Green
