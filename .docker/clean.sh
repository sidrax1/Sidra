#!/bin/sh

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SIDRA Cleanup Started"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "Stopping Containers..."
echo ""

docker compose down --remove-orphans || true

echo ""
echo "Removing Containers..."
echo ""

docker container prune -f

echo ""
echo "Removing Images..."
echo ""

docker image prune -af

echo ""
echo "Removing Volumes..."
echo ""

docker volume prune -f

echo ""
echo "Removing Networks..."
echo ""

docker network prune -f

echo ""
echo "Cleaning Build Cache..."
echo ""

docker builder prune -af

echo ""
echo "Removing Next.js Cache..."
echo ""

rm -rf .next
rm -rf out
rm -rf dist
rm -rf coverage

echo ""
echo "Removing npm Cache..."
echo ""

npm cache clean --force

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SIDRA Cleanup Completed Successfully"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
