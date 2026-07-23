#!/bin/sh

set -e

HOST="${HOSTNAME:-localhost}"
PORT="${PORT:-3000}"

URL="http://${HOST}:${PORT}"

STATUS=$(wget \
 --server-response \
 --spider \
 --quiet \
 "$URL" \
 2>&1 | awk '/HTTP\// {print $2}' | tail -1)

if [ "$STATUS" = "200" ]; then
   exit 0
fi

echo "SIDRA Health Check Failed"

exit 1
