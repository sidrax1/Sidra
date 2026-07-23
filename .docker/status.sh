#!/bin/sh

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SIDRA Docker Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "Containers"
docker compose ps

echo ""
echo "Images"
docker images | grep sidra || true

echo ""
echo "Volumes"
docker volume ls

echo ""
echo "Networks"
docker network ls

echo ""
echo "Disk Usage"
docker system df

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Status Check Completed"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
