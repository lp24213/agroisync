# Deploy simples para IBM Cloud Code Engine
Write-Host "Building React app..." -ForegroundColor Green
npm run build:production

Write-Host "Building Docker image..." -ForegroundColor Green
docker build -t agroisync-frontend .

Write-Host "Deploy completed! Use the IBM Cloud console to update your Code Engine app with this image." -ForegroundColor Yellow
Write-Host "Image name: agroisync-frontend" -ForegroundColor Cyan
