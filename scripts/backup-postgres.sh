#!/bin/bash
set -e
DATE=$(date +%Y-%m-%d-%H%M)
BACKUP_DIR=./backups
mkdir -p $BACKUP_DIR
docker exec db pg_dump -U agrotm agrotm > $BACKUP_DIR/backup-$DATE.sql
echo "Backup salvo em $BACKUP_DIR/backup-$DATE.sql" 