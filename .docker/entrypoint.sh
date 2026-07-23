#!/bin/sh

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Starting SIDRA..."
echo "Environment : ${NODE_ENV}"
echo "Port     : ${PORT}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -d "node_modules" ]; then
   echo "Installing dependencies..."
   npm ci
fi

if [ "$NODE_ENV" = "development" ]; then
   exec npm run dev
fi

exec "$@"
