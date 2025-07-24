/**
 * Agrotm-Solana - Ponto de entrada principal
 * Aplicação descentralizada para o setor agroindustrial usando Solana
 * 
 * @author AGROTM Team
 * @version 1.0.0
 */

import { initializeApp } from './core/app';
import { logger } from './utils/logger';
import { config } from './config/environment';

async function main() {
  try {
    logger.info('🌱 Iniciando Agrotm-Solana...');
    logger.info(`Ambiente: ${config.NODE_ENV}`);
    logger.info(`Rede Solana: ${config.SOLANA_NETWORK}`);
    
    // Inicializar aplicação
    const app = await initializeApp();
    
    logger.info('✅ Agrotm-Solana iniciado com sucesso!');
    logger.info('🚀 Bem-vindo ao futuro da agricultura descentralizada!');
    
    return app;
  } catch (error) {
    logger.error('❌ Erro ao inicializar Agrotm-Solana:', error);
    process.exit(1);
  }
}

// Executar apenas se for o módulo principal
if (require.main === module) {
  main().catch((error) => {
    console.error('Erro fatal:', error);
    process.exit(1);
  });
}

export { main };
export default main;
