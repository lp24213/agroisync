#!/bin/bash

# IBM Cloud Code Engine Deploy Script for AgroSync Frontend
# This script deploys the frontend to IBM Cloud Code Engine

echo "🚀 Starting IBM Cloud Code Engine deployment..."

# Check if IBM Cloud CLI is installed
if ! command -v ibmcloud &> /dev/null; then
    echo "❌ IBM Cloud CLI not found. Please install it first."
    echo "Download from: https://cloud.ibm.com/docs/cli?topic=cli-install-ibmcloud-cli"
    exit 1
fi

# Login to IBM Cloud (if not already logged in)
echo "🔐 Checking IBM Cloud login status..."
if ! ibmcloud account show &> /dev/null; then
    echo "Please login to IBM Cloud:"
    ibmcloud login
fi

# Set target region
echo "🌍 Setting target region..."
ibmcloud target -r br-sao

# Build the application
echo "🔨 Building React application..."
npm run build:production

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Create Docker image
echo "🐳 Building Docker image..."
docker build -f Dockerfile.codeengine -t agroisync-frontend:latest .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

# Deploy to Code Engine
echo "🚀 Deploying to IBM Cloud Code Engine..."

# Create or update the application
ibmcloud code-engine application create \
    --name agroisync-web \
    --image agroisync-frontend:latest \
    --port 8080 \
    --cpu 0.25 \
    --memory 0.5Gi \
    --min-scale 1 \
    --max-scale 3 \
    --env PORT=8080

if [ $? -ne 0 ]; then
    echo "⚠️  Application creation failed, trying to update..."
    ibmcloud code-engine application update \
        --name agroisync-web \
        --image agroisync-frontend:latest \
        --port 8080 \
        --cpu 0.25 \
        --memory 0.5Gi \
        --min-scale 1 \
        --max-scale 3 \
        --env PORT=8080
fi

echo "✅ Deployment completed!"
echo "🌐 Your application should be available at:"
echo "https://agroisync-web.205skg1rs46a.br-sao.codeengine.appdomain.cloud"

# Show application status
echo "📊 Application status:"
ibmcloud code-engine application get --name agroisync-web
