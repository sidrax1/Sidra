#!/bin/sh

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Rebuilding SIDRA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

docker compose down

docker compose build --no-cache

docker compose up -d

docker compose ps

echo ""
echo "SIDRA Rebuild Completed Successfully"
