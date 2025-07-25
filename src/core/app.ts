/**
 * Core Application Initialization
 * Configuração principal da aplicação AGROTM
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { config } from '../config/environment';
import { logger } from '../utils/logger';
import { validateEnvironment } from '../utils/validation';

export interface AppInstance {
  connection: Connection;
  programId: PublicKey;
  isInitialized: boolean;
  network: string;
}

export async function initializeApp(): Promise<AppInstance> {
  logger.info('🔧 Inicializando core da aplicação...');

  // Validar variáveis de ambiente
  validateEnvironment();

  // Conectar à rede Solana
  const connection = new Connection(config.SOLANA_RPC_URL, 'confirmed');

  // Verificar conexão
  try {
    const version = await connection.getVersion();
    logger.info(
      `✅ Conectado à Solana ${config.SOLANA_NETWORK} - Versão: ${version['solana-core']}`,
    );
  } catch (error) {
    logger.error('❌ Falha ao conectar com Solana:', error);
    throw new Error('Não foi possível conectar à rede Solana');
  }

  // Configurar Program ID
  const programId = new PublicKey(config.PROGRAM_ID);
  logger.info(`📋 Program ID: ${programId.toString()}`);

  const app: AppInstance = {
    connection,
    programId,
    isInitialized: true,
    network: config.SOLANA_NETWORK,
  };

  logger.info('✅ Core da aplicação inicializado com sucesso');
  return app;
}

export async function getAppHealth(app: AppInstance): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  details: Record<string, any>;
}> {
  try {
    const slot = await app.connection.getSlot();
    const blockTime = await app.connection.getBlockTime(slot);

    return {
      status: 'healthy',
      details: {
        network: app.network,
        currentSlot: slot,
        blockTime: blockTime ? new Date(blockTime * 1000).toISOString() : null,
        programId: app.programId.toString(),
      },
    };
  } catch (error) {
    logger.error('Health check failed:', error);
    return {
      status: 'unhealthy',
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
    };
  }
}
