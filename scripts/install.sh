#!/bin/bash
set -e

if ! command -v pnpm &> /dev/null; then
  npm install -g pnpm
fi

pnpm install
cd backend && pnpm install
dcd frontend && pnpm install
cd ../contracts && echo "Instale dependências do seu framework de contratos aqui (ex: npm install, yarn, cargo)"