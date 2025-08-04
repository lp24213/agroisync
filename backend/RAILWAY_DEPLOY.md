# Railway Deployment Guide

## Overview
This guide explains how to deploy the AGROTM Backend to Railway.

## Prerequisites
- Railway account
- Railway CLI installed (`npm install -g @railway/cli`)
- Node.js 20+ and npm 7+

## Quick Deploy

### Option 1: Using Railway CLI
```bash
# Login to Railway
railway login

# Link to project
railway link

# Deploy
railway up
```

### Option 2: Using Scripts
```bash
# Linux/Mac
./deploy-railway.sh

# Windows
deploy-railway.bat
```

## Configuration Files

### railway.toml
- Configures build and deploy settings
- Sets health check path to `/health`
- Configures restart policy

### nixpacks.toml
- Configures build environment
- Installs Python3, make, and gcc for native dependencies
- Uses custom build script

### build-railway.sh
- Sets Python environment variables
- Installs dependencies with proper Python configuration
- Builds the application
- Verifies build success

## Environment Variables
Set these in Railway dashboard:
- `NODE_ENV=production`
- `PORT=3001`
- `DATABASE_URL` (if using database)
- `JWT_SECRET`
- `API_KEY`

## Troubleshooting

### Python/Node-gyp Issues
If you encounter Python-related errors:
1. Ensure Python3 is installed in build environment
2. Set `PYTHON=/usr/bin/python3` environment variable
3. Use `--python=/usr/bin/python3` flag with npm install

### Build Failures
1. Check build logs in Railway dashboard
2. Verify all dependencies are compatible
3. Ensure TypeScript compilation succeeds

### Health Check Failures
1. Verify `/health` endpoint is working
2. Check application logs
3. Ensure port 3001 is exposed

## Monitoring
- Health checks run every 30 seconds
- Application restarts on failure (max 3 retries)
- Logs available in Railway dashboard

## Support
For issues, check:
1. Railway documentation
2. Application logs
3. Build configuration files
