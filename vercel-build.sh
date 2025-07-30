#!/bin/bash

# Install pnpm if not available or version is too old
if ! command -v pnpm &> /dev/null || [[ $(pnpm --version) < "8.0.0" ]]; then
    echo "Installing pnpm..."
    npm install -g pnpm@8.15.0
fi

# Install dependencies
pnpm install --no-frozen-lockfile

# Build the frontend
cd frontend
pnpm build
