#!/bin/sh

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SIDRA Update Process"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "Pulling Latest Changes..."
echo ""

git pull --rebase

echo ""
echo "Installing Dependencies..."
echo ""

npm ci

echo ""
echo "Running TypeScript Check..."

echo ""

npm run typecheck

echo ""
echo "Running ESLint..."
echo ""

npm run lint

echo ""
echo "Building Production..."
echo ""

npm run build

echo ""
echo "Restarting Docker..."
echo ""

docker compose down

docker compose up -d --build

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SIDRA Updated Successfully"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
