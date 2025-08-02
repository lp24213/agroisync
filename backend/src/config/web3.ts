import { Commitment, Connection, PublicKey } from '@solana/web3.js';

// Web3 Configuration
export const web3Config = {
  // Solana connection
  connection: new Connection(
    process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    'confirmed' as Commitment
  ),

  // AGROTM token mint address
  agrotmMint: new PublicKey(process.env.AGROTM_MINT_ADDRESS || '11111111111111111111111111111111'),

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const slot = await this.connection.getSlot();
      return slot > 0;
    } catch (error) {
      console.error('Web3 health check failed:', error);
      return false;
    }
  },

  // Get token balance
  async getTokenBalance(walletAddress: string, _mintAddress?: string): Promise<number> {
    try {
      const publicKey = new PublicKey(walletAddress);
      
      const balance = await this.connection.getTokenAccountBalance(publicKey);
      return balance.value.uiAmount || 0;
    } catch (error) {
      console.error('Error getting token balance:', error);
      return 0;
    }
  },

  // Get SOL balance
  async getSolBalance(walletAddress: string): Promise<number> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('Error getting SOL balance:', error);
      return 0;
    }
  }
};
