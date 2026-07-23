#!/bin/sh

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SIDRA Installation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "Installing Dependencies..."
echo ""

npm ci

echo ""
echo "Running TypeScript..."
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
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SIDRA Installed Successfully"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
