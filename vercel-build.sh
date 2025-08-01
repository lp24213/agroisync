#!/bin/bash
set -e

echo "Installing dependencies..."
pnpm install

echo "Building frontend..."
cd frontend
pnpm build

echo "Build completed successfully!"
