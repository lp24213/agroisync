# Deploy completo do Agroisync no Cloudflare (PowerShell)
# Uso: .\scripts\deploy-all.ps1 [production|staging]

param(
    [string]$ENV = "staging"
)

$ErrorActionPreference = "Stop"

Write-Host "Iniciando deploy para ambiente: $ENV" -ForegroundColor Cyan

Write-Host "`n----------------------------------------" -ForegroundColor Blue
Write-Host "   AGROISYNC DEPLOY TO CLOUDFLARE" -ForegroundColor Green
Write-Host "----------------------------------------`n" -ForegroundColor Blue

# 1. Deploy Backend Worker
Write-Host "[1/3] Deploying Backend Worker..." -ForegroundColor Blue
Set-Location backend

Write-Host "Building backend..." -ForegroundColor Yellow
npm run build

if ($ENV -eq "production") {
    Write-Host "Deploying to PRODUCTION..." -ForegroundColor Yellow
    wrangler deploy --env production
} else {
    Write-Host "Deploying to STAGING..." -ForegroundColor Yellow
    wrangler deploy --env staging
}

Set-Location ..
Write-Host "Backend Worker deployed!" -ForegroundColor Green

# 2. Deploy Frontend (React SPA)
Write-Host "`n[2/3] Deploying Frontend (React)..." -ForegroundColor Blue
Set-Location frontend

Write-Host "Building frontend..." -ForegroundColor Yellow
npm run build

if ($ENV -eq "production") {
    Write-Host "Deploying to PRODUCTION (agroisync)..." -ForegroundColor Yellow
    wrangler pages deploy build --project-name=agroisync --branch=main
} else {
    Write-Host "Deploying to STAGING (agroisync-staging)..." -ForegroundColor Yellow
    wrangler pages deploy build --project-name=agroisync-staging --branch=staging
}

Set-Location ..
Write-Host "Frontend deployed!" -ForegroundColor Green

# 3. Deploy Frontend-Next (SSR/SSG)
Write-Host "`n[3/3] Deploying Frontend-Next (Next.js SSR)..." -ForegroundColor Blue
Set-Location frontend-next

Write-Host "Building Next.js..." -ForegroundColor Yellow
npm run build

if ($ENV -eq "production") {
    Write-Host "Deploying to PRODUCTION (agroisync-next)..." -ForegroundColor Yellow
    wrangler pages deploy out --project-name=agroisync-next --branch=main
} else {
    Write-Host "Deploying to STAGING (agroisync-next-staging)..." -ForegroundColor Yellow
    wrangler pages deploy out --project-name=agroisync-next-staging --branch=staging
}

Set-Location ..
Write-Host "Frontend-Next deployed!" -ForegroundColor Green

Write-Host "`n----------------------------------------" -ForegroundColor Blue
Write-Host "DEPLOY COMPLETO" -ForegroundColor Green
Write-Host "----------------------------------------`n" -ForegroundColor Blue

if ($ENV -eq "production") {
    Write-Host "URLs de Producao:" -ForegroundColor Cyan
    Write-Host "  - Backend API: https://agroisync.com/api"
    Write-Host "  - Frontend: https://agroisync.com"
    Write-Host "  - Frontend-Next: https://next.agroisync.com (configure DNS)"
} else {
    Write-Host "URLs de Staging:" -ForegroundColor Cyan
    Write-Host "  - Backend API: https://agroisync-staging.workers.dev"
    Write-Host "  - Frontend: https://agroisync-staging.pages.dev"
    Write-Host "  - Frontend-Next: https://agroisync-next-staging.pages.dev"
}

Write-Host "`nTodos os componentes foram deployados com sucesso!" -ForegroundColor Green
Write-Host "Agroisync is live!" -ForegroundColor Yellow
Write-Host ""

