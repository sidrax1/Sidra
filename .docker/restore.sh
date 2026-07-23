#!/bin/sh

set -e

if [ -z "$1" ]; then
   echo "Usage:"
   echo "./restore.sh sidra-backup-YYYY-MM-DD_HH-MM-SS.tar.gz"
   exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
   echo "Backup file not found."
   exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SIDRA Restore Started"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

TMP_DIR="./restore-temp"

rm -rf "$TMP_DIR"

mkdir -p "$TMP_DIR"

tar -xzf "$BACKUP_FILE" -C "$TMP_DIR"

LATEST_DIR=$(find "$TMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -n 1)

if [ -z "$LATEST_DIR" ]; then
   echo "Invalid backup archive."
   exit 1
fi

echo "Restoring configuration..."

cp -f "$LATEST_DIR"/package.json . 2>/dev/null || true
cp -f "$LATEST_DIR"/package-lock.json . 2>/dev/null || true
cp -f "$LATEST_DIR"/tsconfig.json . 2>/dev/null || true
cp -f "$LATEST_DIR"/next.config.ts . 2>/dev/null || true
cp -f "$LATEST_DIR"/firebase.json . 2>/dev/null || true
cp -f "$LATEST_DIR"/firestore.rules . 2>/dev/null || true
cp -f "$LATEST_DIR"/firestore.indexes.json . 2>/dev/null || true
cp -f "$LATEST_DIR"/storage.rules . 2>/dev/null || true
cp -f "$LATEST_DIR"/.env.example . 2>/dev/null || true

rm -rf "$TMP_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SIDRA Restore Completed Successfully"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
