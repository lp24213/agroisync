#!/bin/bash
set -e
DATE=$(date +%Y-%m-%d-%H%M)
BACKUP_DIR=./backups
mkdir -p $BACKUP_DIR
docker exec db sh -c 'mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" $MYSQL_DATABASE' > $BACKUP_DIR/backup-mysql-$DATE.sql
echo "Backup MySQL salvo em $BACKUP_DIR/backup-mysql-$DATE.sql" 