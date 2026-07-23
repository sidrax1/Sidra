#!/bin/sh

set -e

SERVICE=${1:-sidra}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SIDRA Docker Logs"
echo "Service : ${SERVICE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

docker compose logs \
  --follow \
  --tail=200 \
  "${SERVICE}"
