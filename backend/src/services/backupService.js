// Sistema de Backup e Recuperação - AGROISYNC
// Backup automático de dados críticos e recuperação de desastres

import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { AuditLog } from '../models/AuditLog.js';
import { SecurityLog } from '../models/SecurityLog.js';

const execAsync = promisify(exec);

class BackupSystem {
  constructor() {
    this.backupConfig = {
      // Configurações de backup
      enabled: process.env.BACKUP_ENABLED === 'true',
      interval: parseInt(process.env.BACKUP_INTERVAL, 10) || 24 * 60 * 60 * 1000, // 24 horas
      retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS, 10) || 30,
      maxBackups: parseInt(process.env.BACKUP_MAX_COUNT, 10) || 10,

      // Configurações de armazenamento
      localPath: process.env.BACKUP_LOCAL_PATH || './backups',
      s3Bucket: process.env.BACKUP_S3_BUCKET,
      s3Region: process.env.BACKUP_S3_REGION || 'us-east-1',

      // Configurações de criptografia
      encryptionKey: process.env.BACKUP_ENCRYPTION_KEY,
      encryptBackups: process.env.BACKUP_ENCRYPT === 'true',

      // Configurações de notificação
      notifyOnSuccess: process.env.BACKUP_NOTIFY_SUCCESS === 'true',
      notifyOnFailure: process.env.BACKUP_NOTIFY_FAILURE === 'true',
      notificationEmail: process.env.BACKUP_NOTIFICATION_EMAIL
    };

    this.isRunning = false;
    this.lastBackup = null;
    this.backupHistory = [];

    if (this.backupConfig.enabled) {
      this.startScheduledBackups();
    }
  }

  // Iniciar backups agendados
  startScheduledBackups() {
    console.log('🔄 Sistema de backup iniciado');

    // Executar backup inicial
    this.performBackup();

    // Agendar backups regulares
    setInterval(() => {
      this.performBackup();
    }, this.backupConfig.interval);
  }

  // Executar backup completo
  async performBackup() {
    if (this.isRunning) {
      console.log('⚠️ Backup já em execução, pulando...');
      return;
    }

    this.isRunning = true;
    const backupId = `backup_${Date.now()}`;
    const startTime = new Date();

    try {
      console.log(`🔄 Iniciando backup: ${backupId}`);

      // Criar diretório de backup
      await this.createBackupDirectory();

      // Executar backup do banco de dados
      const dbBackup = await this.backupDatabase(backupId);

      // Executar backup de arquivos
      const filesBackup = await this.backupFiles(backupId);

      // Executar backup de configurações
      const configBackup = await this.backupConfigurations(backupId);

      // Criar arquivo de manifesto
      const manifest = await this.createManifest(backupId, {
        dbBackup,
        filesBackup,
        configBackup,
        startTime,
        endTime: new Date()
      });

      // Criptografar backup se necessário
      if (this.backupConfig.encryptBackups) {
        await this.encryptBackup(backupId);
      }

      // Upload para S3 se configurado
      if (this.backupConfig.s3Bucket) {
        await this.uploadToS3(backupId);
      }

      // Limpar backups antigos
      await this.cleanupOldBackups();

      // Registrar sucesso
      await this.logBackupSuccess(backupId, startTime, new Date());

      this.lastBackup = {
        id: backupId,
        timestamp: startTime,
        status: 'success',
        size: await this.getBackupSize(backupId)
      };

      console.log(`✅ Backup concluído: ${backupId}`);

      // Notificar sucesso
      if (this.backupConfig.notifyOnSuccess) {
        await this.sendNotification('success', backupId);
      }
    } catch (error) {
      console.error(`❌ Erro no backup ${backupId}:`, error);

      // Registrar erro
      await this.logBackupError(backupId, error);

      // Notificar erro
      if (this.backupConfig.notifyOnFailure) {
        await this.sendNotification('error', backupId, error.message);
      }
    } finally {
      this.isRunning = false;
    }
  }

  // Backup do banco de dados
  async backupDatabase(backupId) {
    const dbBackupPath = path.join(this.backupConfig.localPath, backupId, 'database');
    await fs.mkdir(dbBackupPath, { recursive: true });

    try {
      // MongoDB dump
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agroisync';
      const dbName = mongoUri.split('/').pop().split('?')[0];

      const dumpCommand = `mongodump --uri="${mongoUri}" --out="${dbBackupPath}"`;
      await execAsync(dumpCommand);

      console.log(`📊 Backup do banco de dados concluído: ${dbBackupPath}`);

      return {
        type: 'database',
        path: dbBackupPath,
        size: await this.getDirectorySize(dbBackupPath),
        collections: await this.getCollectionCount(dbBackupPath)
      };
    } catch (error) {
      console.error('Erro no backup do banco:', error);
      throw error;
    }
  }

  // Backup de arquivos
  async backupFiles(backupId) {
    const filesBackupPath = path.join(this.backupConfig.localPath, backupId, 'files');
    await fs.mkdir(filesBackupPath, { recursive: true });

    try {
      // Backup de uploads
      const uploadsPath = path.join(process.cwd(), 'uploads');
      if (await this.pathExists(uploadsPath)) {
        await this.copyDirectory(uploadsPath, path.join(filesBackupPath, 'uploads'));
      }

      // Backup de logs
      const logsPath = path.join(process.cwd(), 'logs');
      if (await this.pathExists(logsPath)) {
        await this.copyDirectory(logsPath, path.join(filesBackupPath, 'logs'));
      }

      // Backup de configurações
      const configPath = path.join(process.cwd(), 'config');
      if (await this.pathExists(configPath)) {
        await this.copyDirectory(configPath, path.join(filesBackupPath, 'config'));
      }

      console.log(`📁 Backup de arquivos concluído: ${filesBackupPath}`);

      return {
        type: 'files',
        path: filesBackupPath,
        size: await this.getDirectorySize(filesBackupPath)
      };
    } catch (error) {
      console.error('Erro no backup de arquivos:', error);
      throw error;
    }
  }

  // Backup de configurações
  async backupConfigurations(backupId) {
    const configBackupPath = path.join(this.backupConfig.localPath, backupId, 'configurations');
    await fs.mkdir(configBackupPath, { recursive: true });

    try {
      // Backup de variáveis de ambiente (sem valores sensíveis)
      const envBackup = {};
      for (const [key, value] of Object.entries(process.env)) {
        if (key.startsWith('AGROISYNC_') || key.startsWith('BACKUP_')) {
          // Mascarar valores sensíveis
          if (key.includes('PASSWORD') || key.includes('SECRET') || key.includes('KEY')) {
            envBackup[key] = '***MASKED***';
          } else {
            envBackup[key] = value;
          }
        }
      }

      await fs.writeFile(
        path.join(configBackupPath, 'environment.json'),
        JSON.stringify(envBackup, null, 2)
      );

      // Backup de configurações da aplicação
      const appConfig = {
        version: process.env.npm_package_version || '1.0.0',
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      };

      await fs.writeFile(
        path.join(configBackupPath, 'application.json'),
        JSON.stringify(appConfig, null, 2)
      );

      console.log(`⚙️ Backup de configurações concluído: ${configBackupPath}`);

      return {
        type: 'configurations',
        path: configBackupPath,
        size: await this.getDirectorySize(configBackupPath)
      };
    } catch (error) {
      console.error('Erro no backup de configurações:', error);
      throw error;
    }
  }

  // Criar manifesto do backup
  async createManifest(backupId, backupData) {
    const manifest = {
      id: backupId,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      type: 'full',
      components: backupData,
      metadata: {
        totalSize: 0,
        fileCount: 0,
        duration: backupData.endTime.getTime() - backupData.startTime.getTime()
      }
    };

    // Calcular tamanho total
    manifest.metadata.totalSize =
      backupData.dbBackup.size + backupData.filesBackup.size + backupData.configBackup.size;

    const manifestPath = path.join(this.backupConfig.localPath, backupId, 'manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    return manifest;
  }

  // Criptografar backup
  async encryptBackup(backupId) {
    if (!this.backupConfig.encryptionKey) {
      throw new Error('Chave de criptografia não configurada');
    }

    const backupPath = path.join(this.backupConfig.localPath, backupId);
    const encryptedPath = `${backupPath}.encrypted`;

    try {
      // Usar openssl para criptografar
      const encryptCommand = `openssl enc -aes-256-cbc -salt -in "${backupPath}" -out "${encryptedPath}" -k "${this.backupConfig.encryptionKey}"`;
      await execAsync(encryptCommand);

      // Remover backup não criptografado
      await fs.rm(backupPath, { recursive: true, force: true });

      console.log(`🔐 Backup criptografado: ${encryptedPath}`);
    } catch (error) {
      console.error('Erro na criptografia:', error);
      throw error;
    }
  }

  // Upload para S3
  async uploadToS3(backupId) {
    if (!this.backupConfig.s3Bucket) {
      return;
    }

    try {
      const backupPath = path.join(this.backupConfig.localPath, backupId);
      const s3Key = `backups/${backupId}.tar.gz`;

      // Criar arquivo tar.gz
      const tarCommand = `tar -czf "${backupPath}.tar.gz" -C "${this.backupConfig.localPath}" "${backupId}"`;
      await execAsync(tarCommand);

      // Upload para S3 (implementar com AWS SDK)
      console.log(`☁️ Upload para S3: ${s3Key}`);

      // Remover arquivo local após upload
      await fs.rm(`${backupPath}.tar.gz`, { force: true });
    } catch (error) {
      console.error('Erro no upload S3:', error);
      throw error;
    }
  }

  // Limpar backups antigos
  async cleanupOldBackups() {
    try {
      const backups = await fs.readdir(this.backupConfig.localPath);
      const backupDirs = backups.filter(dir => dir.startsWith('backup_'));

      // Ordenar por data
      backupDirs.sort((a, b) => {
        const aTime = parseInt(a.split('_', 10)[1]);
        const bTime = parseInt(b.split('_', 10)[1]);
        return bTime - aTime;
      });

      // Remover backups antigos
      if (backupDirs.length > this.backupConfig.maxBackups) {
        const toRemove = backupDirs.slice(this.backupConfig.maxBackups);

        for (const dir of toRemove) {
          const dirPath = path.join(this.backupConfig.localPath, dir);
          await fs.rm(dirPath, { recursive: true, force: true });
          console.log(`🗑️ Backup antigo removido: ${dir}`);
        }
      }
    } catch (error) {
      console.error('Erro na limpeza de backups:', error);
    }
  }

  // Restaurar backup
  async restoreBackup(backupId, options = {}) {
    const { restoreDatabase = true, restoreFiles = true, restoreConfigurations = false } = options;

    try {
      console.log(`🔄 Iniciando restauração: ${backupId}`);

      const backupPath = path.join(this.backupConfig.localPath, backupId);

      // Verificar se backup existe
      if (!(await this.pathExists(backupPath))) {
        throw new Error(`Backup não encontrado: ${backupId}`);
      }

      // Ler manifesto
      const manifestPath = path.join(backupPath, 'manifest.json');
      const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));

      // Restaurar banco de dados
      if (restoreDatabase && manifest.components.dbBackup) {
        await this.restoreDatabase(backupId);
      }

      // Restaurar arquivos
      if (restoreFiles && manifest.components.filesBackup) {
        await this.restoreFiles(backupId);
      }

      // Restaurar configurações
      if (restoreConfigurations && manifest.components.configBackup) {
        await this.restoreConfigurations(backupId);
      }

      console.log(`✅ Restauração concluída: ${backupId}`);
    } catch (error) {
      console.error(`❌ Erro na restauração ${backupId}:`, error);
      throw error;
    }
  }

  // Restaurar banco de dados
  async restoreDatabase(backupId) {
    const backupPath = path.join(this.backupConfig.localPath, backupId, 'database');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agroisync';

    try {
      const restoreCommand = `mongorestore --uri="${mongoUri}" --drop "${backupPath}"`;
      await execAsync(restoreCommand);

      console.log(`📊 Banco de dados restaurado: ${backupId}`);
    } catch (error) {
      console.error('Erro na restauração do banco:', error);
      throw error;
    }
  }

  // Restaurar arquivos
  async restoreFiles(backupId) {
    const backupPath = path.join(this.backupConfig.localPath, backupId, 'files');

    try {
      // Restaurar uploads
      const uploadsBackup = path.join(backupPath, 'uploads');
      if (await this.pathExists(uploadsBackup)) {
        const uploadsPath = path.join(process.cwd(), 'uploads');
        await this.copyDirectory(uploadsBackup, uploadsPath);
      }

      // Restaurar logs
      const logsBackup = path.join(backupPath, 'logs');
      if (await this.pathExists(logsBackup)) {
        const logsPath = path.join(process.cwd(), 'logs');
        await this.copyDirectory(logsBackup, logsPath);
      }

      console.log(`📁 Arquivos restaurados: ${backupId}`);
    } catch (error) {
      console.error('Erro na restauração de arquivos:', error);
      throw error;
    }
  }

  // Restaurar configurações
  async restoreConfigurations(backupId) {
    const backupPath = path.join(this.backupConfig.localPath, backupId, 'configurations');

    try {
      const configBackup = path.join(backupPath, 'config');
      if (await this.pathExists(configBackup)) {
        const configPath = path.join(process.cwd(), 'config');
        await this.copyDirectory(configBackup, configPath);
      }

      console.log(`⚙️ Configurações restauradas: ${backupId}`);
    } catch (error) {
      console.error('Erro na restauração de configurações:', error);
      throw error;
    }
  }

  // Funções auxiliares
  async createBackupDirectory() {
    await fs.mkdir(this.backupConfig.localPath, { recursive: true });
  }

  async pathExists(path) {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  async copyDirectory(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  async getDirectorySize(dirPath) {
    let size = 0;
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        size += await this.getDirectorySize(entryPath);
      } else {
        const stats = await fs.stat(entryPath);
        size += stats.size;
      }
    }

    return size;
  }

  async getBackupSize(backupId) {
    const backupPath = path.join(this.backupConfig.localPath, backupId);
    return await this.getDirectorySize(backupPath);
  }

  async getCollectionCount(backupPath) {
    try {
      const entries = await fs.readdir(backupPath, { withFileTypes: true });
      return entries.filter(entry => entry.isDirectory()).length;
    } catch {
      return 0;
    }
  }

  async logBackupSuccess(backupId, startTime, endTime) {
    await AuditLog.create({
      userId: 'system',
      userEmail: 'system@agroisync.com',
      action: 'BACKUP_SUCCESS',
      resource: 'backup_system',
      resourceId: backupId,
      details: `Backup concluído com sucesso: ${backupId}`,
      ip: '127.0.0.1',
      userAgent: 'BackupSystem',
      metadata: {
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime()
      }
    });
  }

  async logBackupError(backupId, error) {
    await AuditLog.create({
      userId: 'system',
      userEmail: 'system@agroisync.com',
      action: 'BACKUP_ERROR',
      resource: 'backup_system',
      resourceId: backupId,
      details: `Erro no backup: ${backupId} - ${error.message}`,
      ip: '127.0.0.1',
      userAgent: 'BackupSystem',
      error: {
        message: error.message,
        stack: error.stack
      }
    });
  }

  async sendNotification(type, backupId, errorMessage = null) {
    // Implementar envio de notificação por email
    console.log(`📧 Notificação ${type}: ${backupId}`);
  }

  // Obter status do sistema
  getStatus() {
    return {
      enabled: this.backupConfig.enabled,
      isRunning: this.isRunning,
      lastBackup: this.lastBackup,
      nextBackup: this.lastBackup
        ? new Date(this.lastBackup.timestamp.getTime() + this.backupConfig.interval)
        : null,
      config: {
        interval: this.backupConfig.interval,
        retentionDays: this.backupConfig.retentionDays,
        maxBackups: this.backupConfig.maxBackups,
        encryptBackups: this.backupConfig.encryptBackups,
        s3Bucket: this.backupConfig.s3Bucket
      }
    };
  }
}

export default BackupSystem;
