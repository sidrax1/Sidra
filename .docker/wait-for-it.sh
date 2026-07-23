#!/usr/bin/env sh

set -e

HOST="$1"

shift

CMD="$@"

if [ -z "$HOST" ]; then
   echo "Usage: wait-for-it.sh host:port command"
   exit 1
fi

HOSTNAME=$(echo "$HOST" | cut -d: -f1)

PORT=$(echo "$HOST" | cut -d: -f2)

echo "Waiting for ${HOSTNAME}:${PORT}..."

until nc -z "$HOSTNAME" "$PORT"; do
 sleep 1
done

echo "${HOSTNAME}:${PORT} is available."

exec $CMD
