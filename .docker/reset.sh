#!/bin/sh

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SIDRA Complete Reset"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "[1/8] Stopping Containers..."
docker compose down --remove-orphans || true

echo ""
echo "[2/8] Removing Docker Resources..."
docker system prune -af --volumes

echo ""
echo "[3/8] Removing Node Modules..."
rm -rf node_modules

echo ""
echo "[4/8] Removing Build Files..."
rm -rf .next
rm -rf out
rm -rf dist
rm -rf coverage
rm -rf .turbo

echo ""
echo "[5/8] Removing Lock Files..."
rm -f package-lock.json

echo ""
echo "[6/8] Cleaning npm Cache..."
npm cache clean --force

echo ""
echo "[7/8] Installing Fresh Dependencies..."
npm install

echo ""

echo "[8/8] Verifying Production Build..."
npm run typecheck
npm run lint
npm run build

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SIDRA Reset Completed Successfully"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Run:"
echo "npm run dev"
