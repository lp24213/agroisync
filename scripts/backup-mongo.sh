#!/bin/bash
set -e
DATE=$(date +%Y-%m-%d-%H%M)
BACKUP_DIR=./backups
mkdir -p $BACKUP_DIR
docker exec db mongodump --archive=$BACKUP_DIR/backup-mongo-$DATE.archive --gzip
ls -lh $BACKUP_DIR/backup-mongo-$DATE.archive
echo "Backup MongoDB salvo em $BACKUP_DIR/backup-mongo-$DATE.archive" 