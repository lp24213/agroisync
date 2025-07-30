// Tipos para APIs
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Pool {
  id: string;
  name: string;
  address: string;
  token0: string;
  token1: string;
  apr: number;
  tvl: number;
  userStaked: number;
  userRewards: number;
  isActive: boolean;
  lockPeriod: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  minStake: number;
  maxStake: number;
  description: string;
  isVerified: boolean;
}

export interface Stats {
  totalValueLocked: number;
  totalUsers: number;
  averageAPR: number;
  totalTransactions: number;
  dailyVolume: number;
  weeklyVolume: number;
  monthlyVolume: number;
  activePools: number;
  totalRewardsDistributed: number;
  platformFee: number;
}

export interface Transaction {
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

export interface User {
  id: string;
  address: string;
  username?: string;
  email?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface YieldStrategy {
  id: string;
  name: string;
  description: string;
  expectedAPR: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  minInvestment: number;
  maxInvestment: number;
  lockPeriod: number;
  isActive: boolean;
}

export interface MarketPrediction {
  token: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  timeframe: '1h' | '24h' | '7d' | '30d';
  factors: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface TradingSignal {
  token: string;
  signal: 'buy' | 'sell' | 'hold';
  confidence: number;
  reason: string;
  targetPrice?: number;
  stopLoss?: number;
  timestamp: Date;
} 