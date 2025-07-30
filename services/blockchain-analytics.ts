import { logger } from '@/utils/logger';

interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: number;
  token: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: number;
  gasPrice?: number;
}

interface AnalyticsData {
  totalTransactions: number;
  totalVolume: number;
  averageTransactionSize: number;
  uniqueUsers: number;
  topTokens: Array<{
    symbol: string;
    volume: number;
    transactions: number;
  }>;
  dailyStats: Array<{
    date: string;
    transactions: number;
    volume: number;
  }>;
}

class BlockchainAnalytics {
  private mockTransactions: Transaction[] = [
    {
      id: '1',
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b7',
      amount: 1000,
      token: 'AGRO',
      timestamp: new Date('2024-01-15T10:30:00Z'),
      status: 'confirmed',
      gasUsed: 21000,
      gasPrice: 20,
    },
    {
      id: '2',
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b8',
      to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9',
      amount: 500,
      token: 'USDC',
      timestamp: new Date('2024-01-15T11:15:00Z'),
      status: 'confirmed',
      gasUsed: 65000,
      gasPrice: 25,
    },
  ];

  async getTransactionHistory(
    address?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Transaction[]> {
    try {
      logger.info('Fetching transaction history', { address, limit, offset });
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredTransactions = this.mockTransactions;
      
      if (address) {
        filteredTransactions = this.mockTransactions.filter(
          tx => tx.from.toLowerCase() === address.toLowerCase() || 
                tx.to.toLowerCase() === address.toLowerCase()
        );
      }
      
      return filteredTransactions
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(offset, offset + limit);
    } catch (error: any) {
      logger.error('Error fetching transaction history', error);
      throw new Error('Failed to fetch transaction history');
    }
  }

  async getAnalyticsData(timeRange: '24h' | '7d' | '30d' | '1y' = '7d'): Promise<AnalyticsData> {
    try {
      logger.info('Fetching analytics data', { timeRange });
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simular dados de analytics
      const totalTransactions = 156789;
      const totalVolume = 12500000;
      const averageTransactionSize = totalVolume / totalTransactions;
      const uniqueUsers = 25430;
      
      const topTokens = [
        { symbol: 'AGRO', volume: 5000000, transactions: 78901 },
        { symbol: 'USDC', volume: 3000000, transactions: 45678 },
        { symbol: 'SOL', volume: 2000000, transactions: 23456 },
        { symbol: 'BTC', volume: 1500000, transactions: 8754 },
      ];
      
      const dailyStats = [
        { date: '2024-01-09', transactions: 1234, volume: 98765 },
        { date: '2024-01-10', transactions: 1456, volume: 112345 },
        { date: '2024-01-11', transactions: 1678, volume: 134567 },
        { date: '2024-01-12', transactions: 1890, volume: 156789 },
        { date: '2024-01-13', transactions: 2102, volume: 178901 },
        { date: '2024-01-14', transactions: 2324, volume: 201234 },
        { date: '2024-01-15', transactions: 2546, volume: 223456 },
      ];
      
      return {
        totalTransactions,
        totalVolume,
        averageTransactionSize,
        uniqueUsers,
        topTokens,
        dailyStats,
      };
    } catch (error: any) {
      logger.error('Error fetching analytics data', error);
      throw new Error('Failed to fetch analytics data');
    }
  }

  async getTransactionDetails(hash: string): Promise<Transaction | null> {
    try {
      logger.info('Fetching transaction details', { hash });
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return this.mockTransactions.find(tx => tx.hash === hash) || null;
    } catch (error: any) {
      logger.error('Error fetching transaction details', error);
      throw new Error('Failed to fetch transaction details');
    }
  }

  async getAddressAnalytics(address: string): Promise<{
    totalTransactions: number;
    totalVolume: number;
    averageTransactionSize: number;
    firstTransaction: Date | null;
    lastTransaction: Date | null;
    mostUsedTokens: Array<{ symbol: string; count: number }>;
  }> {
    try {
      logger.info('Fetching address analytics', { address });
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const addressTransactions = this.mockTransactions.filter(
        tx => tx.from.toLowerCase() === address.toLowerCase() || 
              tx.to.toLowerCase() === address.toLowerCase()
      );
      
      const totalTransactions = addressTransactions.length;
      const totalVolume = addressTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      const averageTransactionSize = totalTransactions > 0 ? totalVolume / totalTransactions : 0;
      
      const timestamps = addressTransactions.map(tx => tx.timestamp);
      const firstTransaction = timestamps.length > 0 ? new Date(Math.min(...timestamps.map(t => t.getTime()))) : null;
      const lastTransaction = timestamps.length > 0 ? new Date(Math.max(...timestamps.map(t => t.getTime()))) : null;
      
      // Contar tokens mais usados
      const tokenCounts: { [key: string]: number } = {};
      addressTransactions.forEach(tx => {
        tokenCounts[tx.token] = (tokenCounts[tx.token] || 0) + 1;
      });
      
      const mostUsedTokens = Object.entries(tokenCounts)
        .map(([symbol, count]) => ({ symbol, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      return {
        totalTransactions,
        totalVolume,
        averageTransactionSize,
        firstTransaction,
        lastTransaction,
        mostUsedTokens,
      };
    } catch (error: any) {
      logger.error('Error fetching address analytics', error);
      throw new Error('Failed to fetch address analytics');
    }
  }

  async getGasEstimate(
    from: string,
    to: string,
    amount: number,
    token: string
  ): Promise<{
    gasLimit: number;
    gasPrice: number;
    estimatedCost: number;
  }> {
    try {
      logger.info('Estimating gas', { from, to, amount, token });
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Simulação de estimativa de gas
      const baseGasLimit = 21000;
      const tokenGasMultiplier = token === 'AGRO' ? 1.2 : 1.0;
      const gasLimit = Math.round(baseGasLimit * tokenGasMultiplier);
      const gasPrice = 20; // Gwei
      const estimatedCost = gasLimit * gasPrice * 1e-9; // Convert to ETH
      
      return {
        gasLimit,
        gasPrice,
        estimatedCost,
      };
    } catch (error: any) {
      logger.error('Error estimating gas', error);
      throw new Error('Failed to estimate gas');
    }
  }

  async getNetworkStatus(): Promise<{
    isHealthy: boolean;
    blockHeight: number;
    averageBlockTime: number;
    pendingTransactions: number;
    networkLoad: 'low' | 'medium' | 'high';
  }> {
    try {
      logger.info('Fetching network status');
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return {
        isHealthy: true,
        blockHeight: 12345678,
        averageBlockTime: 0.4, // seconds
        pendingTransactions: 1234,
        networkLoad: 'medium',
      };
    } catch (error: any) {
      logger.error('Error fetching network status', error);
      throw new Error('Failed to fetch network status');
    }
  }
}

export const blockchainAnalytics = new BlockchainAnalytics();
export default blockchainAnalytics; 