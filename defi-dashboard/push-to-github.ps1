# PowerShell script to initialize and push the DeFi Dashboard repository to GitHub

Write-Host "DeFi Dashboard - GitHub Push Script" -ForegroundColor Yellow
Write-Host "This script will help you push your DeFi Dashboard project to GitHub."
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Git is not installed. Please install Git and try again." -ForegroundColor Red
    exit 1
}

# Check if the directory is already a git repository
if (Test-Path ".git") {
    Write-Host "This directory is already a Git repository." -ForegroundColor Yellow
} else {
    Write-Host "Initializing Git repository..." -ForegroundColor Green
    try {
        git init
    } catch {
        Write-Host "Error: Failed to initialize Git repository." -ForegroundColor Red
        exit 1
    }
}

# Add all files to the repository
Write-Host "Adding files to the repository..." -ForegroundColor Green
try {
    git add .
} catch {
    Write-Host "Error: Failed to add files to the repository." -ForegroundColor Red
    exit 1
}

# Commit the changes
Write-Host "Committing changes..." -ForegroundColor Green
try {
    git commit -m "Initial commit: DeFi Dashboard project"
} catch {
    Write-Host "Error: Failed to commit changes." -ForegroundColor Red
    exit 1
}

# Ask for GitHub repository URL
Write-Host ""
Write-Host "Please enter your GitHub repository URL:" -ForegroundColor Yellow
$repoUrl = Read-Host "URL"

if ([string]::IsNullOrEmpty($repoUrl)) {
    Write-Host "Error: No repository URL provided." -ForegroundColor Red
    exit 1
}

# Add remote repository
Write-Host "Adding remote repository..." -ForegroundColor Green
try {
    git remote add origin $repoUrl
} catch {
    Write-Host "Error: Failed to add remote repository." -ForegroundColor Red
    exit 1
}

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Green
try {
    git push -u origin main
} catch {
    Write-Host "Trying to push to master branch instead..." -ForegroundColor Yellow
    try {
        git push -u origin master
    } catch {
        Write-Host "Error: Failed to push to GitHub. Please check your repository URL and credentials." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Success! Your DeFi Dashboard project has been pushed to GitHub." -ForegroundColor Green
Write-Host "Repository URL: $repoUrl"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Set up GitHub Pages or Vercel for deployment"
Write-Host "2. Configure environment variables in your deployment platform"
Write-Host "3. Share your project with others!"
Write-Host ""