#!/bin/sh

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Cleaning Unused Docker Resources"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

docker container prune -f

docker image prune -af

docker volume prune -f

docker network prune -f

docker builder prune -af

echo ""
echo "Docker Cleanup Completed Successfully"
