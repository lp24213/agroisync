# IBM Cloud Code Engine Deploy Script for AgroSync Frontend (PowerShell)
# This script deploys the frontend to IBM Cloud Code Engine

Write-Host "Starting IBM Cloud Code Engine deployment..." -ForegroundColor Green

# Check if IBM Cloud CLI is installed
try {
    ibmcloud --version | Out-Null
    Write-Host "IBM Cloud CLI found" -ForegroundColor Green
} catch {
    Write-Host "IBM Cloud CLI not found. Please install it first." -ForegroundColor Red
    Write-Host "Download from: https://cloud.ibm.com/docs/cli?topic=cli-install-ibmcloud-cli" -ForegroundColor Yellow
    exit 1
}

# Login to IBM Cloud (if not already logged in)
Write-Host "Checking IBM Cloud login status..." -ForegroundColor Blue
try {
    ibmcloud account show | Out-Null
    Write-Host "Already logged in to IBM Cloud" -ForegroundColor Green
} catch {
    Write-Host "Please login to IBM Cloud:" -ForegroundColor Yellow
    ibmcloud login
}

# Set target region
Write-Host "Setting target region..." -ForegroundColor Blue
ibmcloud target -r br-sao

# Build the application
Write-Host "Building React application..." -ForegroundColor Blue
npm run build:production

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Create Docker image
Write-Host "Building Docker image..." -ForegroundColor Blue
docker build -f Dockerfile.codeengine -t agroisync-frontend:latest .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed!" -ForegroundColor Red
    exit 1
}

# Deploy to Code Engine
Write-Host "Deploying to IBM Cloud Code Engine..." -ForegroundColor Blue

# Create or update the application
Write-Host "Creating/updating application..." -ForegroundColor Blue
ibmcloud code-engine application create --name agroisync-web --image agroisync-frontend:latest --port 8080 --cpu 0.25 --memory 0.5Gi --min-scale 1 --max-scale 3 --env PORT=8080

if ($LASTEXITCODE -ne 0) {
    Write-Host "Application creation failed, trying to update..." -ForegroundColor Yellow
    ibmcloud code-engine application update --name agroisync-web --image agroisync-frontend:latest --port 8080 --cpu 0.25 --memory 0.5Gi --min-scale 1 --max-scale 3 --env PORT=8080
}

Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "Your application should be available at:" -ForegroundColor Cyan
Write-Host "https://agroisync-web.205skg1rs46a.br-sao.codeengine.appdomain.cloud" -ForegroundColor Yellow

# Show application status
Write-Host "Application status:" -ForegroundColor Blue
ibmcloud code-engine application get --name agroisync-web
