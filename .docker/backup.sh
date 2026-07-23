#!/bin/sh

set -e

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

BACKUP_DIR="./backups/${TIMESTAMP}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SIDRA Backup Started"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

mkdir -p "${BACKUP_DIR}"

echo "Backing up configuration..."

cp package.json "${BACKUP_DIR}/" 2>/dev/null || true
cp package-lock.json "${BACKUP_DIR}/" 2>/dev/null || true
cp tsconfig.json "${BACKUP_DIR}/" 2>/dev/null || true
cp next.config.ts "${BACKUP_DIR}/" 2>/dev/null || true
cp firebase.json "${BACKUP_DIR}/" 2>/dev/null || true
cp firestore.rules "${BACKUP_DIR}/" 2>/dev/null || true
cp firestore.indexes.json "${BACKUP_DIR}/" 2>/dev/null || true
cp storage.rules "${BACKUP_DIR}/" 2>/dev/null || true

echo "Backing up environment templates..."

cp .env.example "${BACKUP_DIR}/" 2>/dev/null || true

echo "Creating compressed archive..."

tar -czf "sidra-backup-${TIMESTAMP}.tar.gz" "${BACKUP_DIR}"

rm -rf "${BACKUP_DIR}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Backup Created Successfully"
echo "Archive:"
echo "sidra-backup-${TIMESTAMP}.tar.gz"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
