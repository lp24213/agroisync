#!/usr/bin/env node

/**
 * Script de Migração para AgroSync Backend
 * Executa migrações e atualizações no banco de dados
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Importar modelos
const User = require('../src/models/User');
const Payment = require('../src/models/Payment');
const Conversation = require('../src/models/Conversation');
const Message = require('../src/models/Message');

// Configurações
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrosync';

// Lista de migrações
const migrations = [
  {
    version: '1.0.0',
    description: 'Migração inicial - Criar índices e estruturas básicas',
    up: async () => {
      console.log('📊 Criando índices para User...');
      await User.createIndexes();
      
      console.log('📊 Criando índices para Payment...');
      await Payment.createIndexes();
      
      console.log('📊 Criando índices para Conversation...');
      await Conversation.createIndexes();
      
      console.log('📊 Criando índices para Message...');
      await Message.createIndexes();
    },
    down: async () => {
      console.log('🔄 Removendo índices...');
      // Implementar remoção de índices se necessário
    }
  },
  {
    version: '1.0.1',
    description: 'Adicionar campos de verificação de email e telefone',
    up: async () => {
      console.log('📧 Adicionando campos de verificação...');
      
      // Adicionar campos se não existirem
      const users = await User.find({});
      for (const user of users) {
        if (!user.hasOwnProperty('emailVerifiedAt')) {
          user.emailVerifiedAt = user.isVerified ? new Date() : null;
        }
        if (!user.hasOwnProperty('phoneVerifiedAt')) {
          user.phoneVerifiedAt = user.isVerified ? new Date() : null;
        }
        await user.save();
      }
    },
    down: async () => {
      console.log('🔄 Removendo campos de verificação...');
      // Implementar remoção se necessário
    }
  },
  {
    version: '1.0.2',
    description: 'Atualizar estrutura de endereços',
    up: async () => {
      console.log('🏠 Atualizando estrutura de endereços...');
      
      const users = await User.find({});
      for (const user of users) {
        if (user.address && !user.address.country) {
          user.address.country = 'Brasil';
        }
        if (user.address && !user.address.complement) {
          user.address.complement = '';
        }
        await user.save();
      }
    },
    down: async () => {
      console.log('🔄 Revertendo estrutura de endereços...');
      // Implementar reversão se necessário
    }
  },
  {
    version: '1.0.3',
    description: 'Adicionar campos de preferências do usuário',
    up: async () => {
      console.log('⚙️ Adicionando preferências do usuário...');
      
      const users = await User.find({});
      for (const user of users) {
        if (!user.preferences) {
          user.preferences = {
            language: 'pt',
            timezone: 'America/Sao_Paulo',
            notifications: {
              email: true,
              push: true,
              sms: false
            }
          };
        }
        await user.save();
      }
    },
    down: async () => {
      console.log('🔄 Removendo preferências do usuário...');
      // Implementar remoção se necessário
    }
  },
  {
    version: '1.0.4',
    description: 'Atualizar estrutura de pagamentos',
    up: async () => {
      console.log('💳 Atualizando estrutura de pagamentos...');
      
      const payments = await Payment.find({});
      for (const payment of payments) {
        if (!payment.metadata) {
          payment.metadata = new Map();
        }
        if (!payment.source) {
          payment.source = 'web';
        }
        await payment.save();
      }
    },
    down: async () => {
      console.log('🔄 Revertendo estrutura de pagamentos...');
      // Implementar reversão se necessário
    }
  },
  {
    version: '1.0.5',
    description: 'Adicionar campos de configuração de conversas',
    up: async () => {
      console.log('💬 Atualizando configuração de conversas...');
      
      const conversations = await Conversation.find({});
      for (const conversation of conversations) {
        if (!conversation.settings) {
          conversation.settings = {
            allowFiles: true,
            maxFileSize: 10 * 1024 * 1024, // 10MB
            allowedFileTypes: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
          };
        }
        await conversation.save();
      }
    },
    down: async () => {
      console.log('🔄 Revertendo configuração de conversas...');
      // Implementar reversão se necessário
    }
  }
];

// Função para executar migração
async function runMigration(migration) {
  try {
    console.log(`🚀 Executando migração ${migration.version}: ${migration.description}`);
    await migration.up();
    console.log(`✅ Migração ${migration.version} executada com sucesso`);
    return true;
  } catch (error) {
    console.error(`❌ Erro na migração ${migration.version}:`, error);
    return false;
  }
}

// Função para reverter migração
async function rollbackMigration(migration) {
  try {
    console.log(`🔄 Revertendo migração ${migration.version}: ${migration.description}`);
    await migration.down();
    console.log(`✅ Migração ${migration.version} revertida com sucesso`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao reverter migração ${migration.version}:`, error);
    return false;
  }
}

// Função para verificar status das migrações
async function checkMigrationStatus() {
  try {
    // Criar coleção de controle de migrações se não existir
    const db = mongoose.connection.db;
    const migrationCollection = db.collection('migrations');
    
    const executedMigrations = await migrationCollection.find({}).toArray();
    const executedVersions = executedMigrations.map(m => m.version);
    
    console.log('📋 Status das migrações:');
    console.log('Executadas:', executedVersions);
    
    const pendingMigrations = migrations.filter(m => !executedVersions.includes(m.version));
    console.log('Pendentes:', pendingMigrations.map(m => m.version));
    
    return { executedMigrations, pendingMigrations };
  } catch (error) {
    console.error('❌ Erro ao verificar status das migrações:', error);
    return { executedMigrations: [], pendingMigrations: migrations };
  }
}

// Função para marcar migração como executada
async function markMigrationAsExecuted(version, description) {
  try {
    const db = mongoose.connection.db;
    const migrationCollection = db.collection('migrations');
    
    await migrationCollection.insertOne({
      version,
      description,
      executedAt: new Date(),
      timestamp: Date.now()
    });
  } catch (error) {
    console.error(`❌ Erro ao marcar migração ${version} como executada:`, error);
  }
}

// Função para remover migração executada
async function removeMigrationExecution(version) {
  try {
    const db = mongoose.connection.db;
    const migrationCollection = db.collection('migrations');
    
    await migrationCollection.deleteOne({ version });
  } catch (error) {
    console.error(`❌ Erro ao remover execução da migração ${version}:`, error);
  }
}

// Função principal de migração
async function migrate(targetVersion = null) {
  try {
    console.log('🚀 Iniciando processo de migração...');
    
    // Conectar ao MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');
    
    // Verificar status atual
    const { executedMigrations, pendingMigrations } = await checkMigrationStatus();
    
    if (pendingMigrations.length === 0) {
      console.log('✅ Nenhuma migração pendente');
      return;
    }
    
    // Executar migrações pendentes
    for (const migration of pendingMigrations) {
      if (targetVersion && migration.version !== targetVersion) {
        continue;
      }
      
      const success = await runMigration(migration);
      if (success) {
        await markMigrationAsExecuted(migration.version, migration.description);
      } else {
        console.error(`❌ Falha na migração ${migration.version}. Abortando...`);
        process.exit(1);
      }
    }
    
    console.log('🎉 Todas as migrações foram executadas com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Desconectado do MongoDB');
  }
}

// Função para reverter migrações
async function rollback(targetVersion = null) {
  try {
    console.log('🔄 Iniciando processo de rollback...');
    
    // Conectar ao MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');
    
    // Verificar status atual
    const { executedMigrations } = await checkMigrationStatus();
    
    if (executedMigrations.length === 0) {
      console.log('✅ Nenhuma migração executada para reverter');
      return;
    }
    
    // Reverter migrações em ordem reversa
    const migrationsToRollback = targetVersion 
      ? executedMigrations.filter(m => m.version === targetVersion)
      : executedMigrations.reverse();
    
    for (const migrationRecord of migrationsToRollback) {
      const migration = migrations.find(m => m.version === migrationRecord.version);
      if (migration) {
        const success = await rollbackMigration(migration);
        if (success) {
          await removeMigrationExecution(migration.version);
        } else {
          console.error(`❌ Falha ao reverter migração ${migration.version}. Abortando...`);
          process.exit(1);
        }
      }
    }
    
    console.log('🎉 Rollback concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante o rollback:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Desconectado do MongoDB');
  }
}

// Função para mostrar ajuda
function showHelp() {
  console.log(`
🚀 AgroSync Backend - Script de Migração

Uso: node scripts/migrate.js [comando] [opções]

Comandos:
  migrate [versão]     Executa migrações pendentes (opcional: versão específica)
  rollback [versão]    Reverte migrações (opcional: versão específica)
  status               Mostra status das migrações
  help                 Mostra esta ajuda

Exemplos:
  node scripts/migrate.js migrate           # Executa todas as migrações pendentes
  node scripts/migrate.js migrate 1.0.2    # Executa migração específica
  node scripts/migrate.js rollback         # Reverte última migração
  node scripts/migrate.js rollback 1.0.2   # Reverte migração específica
  node scripts/migrate.js status            # Mostra status

Opções:
  --help, -h           Mostra esta ajuda
  --version, -v        Mostra versão do script
  `);
}

// Função principal
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const targetVersion = args[1];
  
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    return;
  }
  
  if (command === '--version' || command === '-v') {
    console.log('AgroSync Migration Script v1.0.0');
    return;
  }
  
  switch (command) {
    case 'migrate':
      await migrate(targetVersion);
      break;
    case 'rollback':
      await rollback(targetVersion);
      break;
    case 'status':
      await mongoose.connect(MONGODB_URI);
      await checkMigrationStatus();
      await mongoose.disconnect();
      break;
    default:
      console.error(`❌ Comando desconhecido: ${command}`);
      showHelp();
      process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = { migrate, rollback, checkMigrationStatus };
