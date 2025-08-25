# AGROISYNC - Dependency Update Script (PowerShell)
# ================================================

Write-Host "🔄 AGROISYNC - Dependency Update Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json") -and -not (Test-Path "frontend") -and -not (Test-Path "backend")) {
    Write-Host "❌ Error: Please run this script from the root directory of the project" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Checking current dependency status..." -ForegroundColor Yellow

# Update frontend dependencies
if (Test-Path "frontend") {
    Write-Host "`n🔄 Updating Frontend Dependencies..." -ForegroundColor Green
    Set-Location frontend
    
    # Check for outdated packages
    Write-Host "📊 Checking for outdated packages..." -ForegroundColor White
    try {
        npm outdated
    } catch {
        Write-Host "No outdated packages found or error occurred" -ForegroundColor Yellow
    }
    
    # Update specific deprecated packages
    Write-Host "🔄 Updating deprecated packages..." -ForegroundColor White
    
    # Update Babel plugins
    npm install --save-dev @babel/plugin-transform-private-methods@latest
    npm install --save-dev @babel/plugin-transform-numeric-separator@latest
    npm install --save-dev @babel/plugin-transform-optional-chaining@latest
    npm install --save-dev @babel/plugin-transform-nullish-coalescing-operator@latest
    npm install --save-dev @babel/plugin-transform-private-property-in-object@latest
    
    # Update ESLint packages
    npm install --save-dev @eslint/object-schema@latest
    npm install --save-dev @eslint/config-array@latest
    
    # Update other deprecated packages
    npm install --save-dev @jridgewell/sourcemap-codec@latest
    
    # Update SVGO
    npm install --save-dev svgo@latest
    
    # Clean install
    Write-Host "🧹 Cleaning and reinstalling dependencies..." -ForegroundColor White
    if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
    if (Test-Path "package-lock.json") { Remove-Item "package-lock.json" }
    npm install
    
    Set-Location ..
}

# Update backend dependencies
if (Test-Path "backend") {
    Write-Host "`n🔄 Updating Backend Dependencies..." -ForegroundColor Green
    Set-Location backend
    
    # Check for outdated packages
    Write-Host "📊 Checking for outdated packages..." -ForegroundColor White
    try {
        npm outdated
    } catch {
        Write-Host "No outdated packages found or error occurred" -ForegroundColor Yellow
    }
    
    # Update specific deprecated packages
    Write-Host "🔄 Updating deprecated packages..." -ForegroundColor White
    
    # Update ESLint
    npm install --save-dev eslint@latest
    
    # Clean install
    Write-Host "🧹 Cleaning and reinstalling dependencies..." -ForegroundColor White
    if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
    if (Test-Path "package-lock.json") { Remove-Item "package-lock.json" }
    npm install
    
    Set-Location ..
}

# Update root dependencies if they exist
if (Test-Path "package.json") {
    Write-Host "`n🔄 Updating Root Dependencies..." -ForegroundColor Green
    
    # Check for outdated packages
    Write-Host "📊 Checking for outdated packages..." -ForegroundColor White
    try {
        npm outdated
    } catch {
        Write-Host "No outdated packages found or error occurred" -ForegroundColor Yellow
    }
    
    # Clean install
    Write-Host "🧹 Cleaning and reinstalling dependencies..." -ForegroundColor White
    if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
    if (Test-Path "package-lock.json") { Remove-Item "package-lock.json" }
    npm install
}

Write-Host "`n✅ Dependency update completed!" -ForegroundColor Green
Write-Host "💡 Next steps:" -ForegroundColor Yellow
Write-Host "1. Test your application to ensure everything still works" -ForegroundColor White
Write-Host "2. Commit the updated package.json and package-lock.json files" -ForegroundColor White
Write-Host "3. Run the build process to verify deprecation warnings are reduced" -ForegroundColor White
Write-Host "4. Consider updating to the latest LTS Node.js version if not already done" -ForegroundColor White

# Check Node.js version
Write-Host "`n📊 Current Node.js version:" -ForegroundColor Yellow
try {
    node --version
    npm --version
} catch {
    Write-Host "Node.js or npm not found in PATH" -ForegroundColor Red
}

Write-Host "`n🎉 Script completed successfully!" -ForegroundColor Green
