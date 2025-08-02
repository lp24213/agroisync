// Tipos para blockchain
export interface WalletInfo {
  address: string;
  balance: number;
  tokens: TokenBalance[];
  isConnected: boolean;
}

export interface TokenBalance {
  mint: string;
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  price?: number;
  value?: number;
}

export interface TransactionInfo {
  signature: string;
  slot: number;
  blockTime: number;
  fee: number;
  status: 'confirmed' | 'pending' | 'failed';
  logs?: string[];
}

export interface PoolInfo {
  address: string;
  token0: TokenInfo;
  token1: TokenInfo;
  reserve0: number;
  reserve1: number;
  totalSupply: number;
  fee: number;
}

export interface TokenInfo {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export interface StakingPool {
  address: string;
  token: TokenInfo;
  totalStaked: number;
  totalRewards: number;
  apr: number;
  lockPeriod: number;
  minStake: number;
  maxStake: number;
  isActive: boolean;
}

export interface UserStake {
  poolAddress: string;
  amount: number;
  startTime: number;
  endTime?: number;
  rewards: number;
  isLocked: boolean;
}

export interface NetworkInfo {
  name: string;
  rpcUrl: string;
  chainId: number;
  explorerUrl: string;
  isTestnet: boolean;
}

export interface GasEstimate {
  gasLimit: number;
  gasPrice: number;
  estimatedCost: number;
  priorityFee?: number;
}

export interface BlockInfo {
  slot: number;
  blockTime: number;
  blockHeight: number;
  transactions: number;
  rewards: number;
} 