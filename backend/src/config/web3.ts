import { Connection, clusterApiUrl, Commitment } from '@solana/web3.js';
import { logger } from '../../../utils/logger';

// Solana Network Configuration
const NETWORK = process.env.SOLANA_NETWORK || 'devnet';
const COMMITMENT: Commitment = 'confirmed';

// RPC Endpoints
const RPC_ENDPOINTS = {
  mainnet: process.env.SOLANA_MAINNET_RPC || 'https://api.mainnet-beta.solana.com',
  devnet: process.env.SOLANA_DEVNET_RPC || 'https://api.devnet.solana.com',
  testnet: process.env.SOLANA_TESTNET_RPC || 'https://api.testnet.solana.com',
  localnet: process.env.SOLANA_LOCALNET_RPC || 'http://localhost:8899',
};

// Web3 Configuration
export const web3Config = {
  connection: new Connection(RPC_ENDPOINTS[NETWORK as keyof typeof RPC_ENDPOINTS], {
    commitment: COMMITMENT,
    confirmTransactionInitialTimeout: 60000,
  }),

  network: NETWORK,
  commitment: COMMITMENT,

  // Health check for Web3 connection
  healthCheck: async (): Promise<boolean> => {
    try {
      const connection = web3Config.connection;
      const blockHeight = await connection.getBlockHeight();
      logger.info(`✅ Web3 health check passed. Block height: ${blockHeight}`);
      return true;
    } catch (error) {
      logger.error('❌ Web3 health check failed:', error);
      return false;
    }
  },

  // Get connection for specific network
  getConnection: (network?: string): Connection => {
    const targetNetwork = network || NETWORK;
    const endpoint = RPC_ENDPOINTS[targetNetwork as keyof typeof RPC_ENDPOINTS];
    
    if (!endpoint) {
      throw new Error(`Invalid network: ${targetNetwork}`);
    }

    return new Connection(endpoint, {
      commitment: COMMITMENT,
      confirmTransactionInitialTimeout: 60000,
    });
  },

  // Get current network info
  getNetworkInfo: () => ({
    network: NETWORK,
    endpoint: RPC_ENDPOINTS[NETWORK as keyof typeof RPC_ENDPOINTS],
    commitment: COMMITMENT,
  }),
};

// Initialize Web3 connection
export const initializeWeb3 = async (): Promise<void> => {
  try {
    const isHealthy = await web3Config.healthCheck();
    if (!isHealthy) {
      throw new Error('Web3 health check failed');
    }
    logger.info(`✅ Web3 initialized successfully on ${NETWORK}`);
  } catch (error) {
    logger.error('❌ Web3 initialization failed:', error);
    throw error;
  }
}; 