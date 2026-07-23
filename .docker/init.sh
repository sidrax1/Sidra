#!/bin/sh

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SIDRA Container Initialization"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "Node Version:"

node -v

echo "NPM Version:"
npm -v

if [ ! -f ".env.local" ] && [ -f ".docker/.env.docker.example" ]; then
   cp .docker/.env.docker.example .env.local
   echo ".env.local created from template."
fi

if [ ! -d "node_modules" ]; then
   echo "Installing dependencies..."
   npm ci
fi

echo "Running TypeScript Check..."
npm run typecheck

echo "Running ESLint..."
npm run lint

echo "Initialization completed successfully."
