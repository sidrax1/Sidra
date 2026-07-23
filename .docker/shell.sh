#!/bin/sh

set -e

SERVICE=${1:-sidra}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Opening Shell"
echo "Container : ${SERVICE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

docker compose exec "${SERVICE}" sh
