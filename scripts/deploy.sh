#!/bin/bash
set -e

cd backend && pnpm deploy
cd ../frontend && vercel --prod
cd ../contracts && echo "Deploy manual dos contratos: veja README.md" 