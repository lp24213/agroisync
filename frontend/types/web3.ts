// Web3 Types for AGROTM Platform

export type ButtonVariant = 
  | 'default' 
  | 'destructive' 
  | 'outline' 
  | 'secondary' 
  | 'ghost' 
  | 'link' 
  | 'primary' 
  | 'contained' 
  | 'text' 
  | 'outlined';

export interface Web3Provider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (eventName: string, handler: (params: any) => void) => void;
  removeListener: (eventName: string, handler: (params: any) => void) => void;
}

export interface Web3ContextType {
  account: string | null;
  publicKey?: string | null;
  provider: Web3Provider | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage?: (message: string) => Promise<string>;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
}

export interface NFTData {
  id: string;
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
  owner: string;
  mintAddress: string;
  supply: number;
  price: string;
  category: string;
  rarity: string;
  createdAt: string;
  updatedAt: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
  external_url?: string;
  animation_url?: string;
}

export interface StakingStats {
  totalStaked: number;
  totalRewards: number;
  averageAPR: number;
  stakersCount: number;
  totalValueLocked: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  retentionRate: number;
}

export interface NFTStats {
  totalNFTs: number;
  totalVolume: number;
  averagePrice: number;
  floorPrice: number;
  uniqueOwners: number;
}

export interface CommodityPrice {
  symbol: string;
  current: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  timestamp: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  visibility: number;
  timestamp: string;
  analysis?: {
    cropImpact: string;
  };
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
  name?: string;
}

export interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export interface Logger {
  info: (message: string, data?: any) => void;
  error: (message: string, error?: any) => void;
  warn: (message: string, data?: any) => void;
  debug: (message: string, data?: any) => void;
}

// Additional missing types
export interface TargetEvent {
  target: {
    value: string;
  };
}

export interface AlertVariant {
  variant: 'default' | 'destructive' | 'success' | 'warning';
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
}

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';

export interface WalletAdapter {
  name: string;
  url: string;
  icon: string;
  description: string;
}

export interface Wallet {
  name?: string;
  adapter: WalletAdapter;
}

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  timestamp: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

export type SecurityEventType = 'login_attempt' | 'transaction' | 'withdrawal' | 'suspicious_activity';

export interface PremiumDeFiService {
  id: string;
  name: string;
  description: string;
  apy: number;
  tvl: number;
  risk: 'low' | 'medium' | 'high';
  minStake: number;
  maxStake: number;
} 