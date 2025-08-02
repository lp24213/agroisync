// Web3 Types
export interface Web3State {
  isConnected: boolean;
  isConnecting: boolean;
  publicKey: string | null;
  account: string | null;
  provider: any;
  error: string | null;
}

export interface Web3Actions {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  signTransaction: (transaction: any) => Promise<any>;
}

export interface Web3ContextType extends Web3State, Web3Actions {}

// Event Types
export interface InputEvent {
  target: {
    value: string;
    name?: string;
    files?: FileList | null;
    checked?: boolean;
  };
}

export interface WalletAdapter {
  publicKey: {
    toString(): string;
  } | null;
  connected: boolean;
  connecting: boolean;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  name?: string;
}

export interface Wallet {
  adapter: WalletAdapter;
  name?: string;
}

// Button Variant Types
export type ButtonVariant = "contained" | "outlined" | "text" | "default" | "primary" | "secondary" | "ghost" | "destructive" | "link";

// Alert Variant Types
export type AlertVariant = "info" | "warning" | "error" | "success";

// Target Event Types
export interface TargetEvent {
  target: {
    value: string;
    name?: string;
    files?: FileList | null;
    checked?: boolean;
  };
}

// Public Key Types
export interface PublicKeyObject {
  toString(): string;
}

export interface WalletWithPublicKey {
  publicKey: PublicKeyObject | null;
  connected: boolean;
  connecting: boolean;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

// Security Event Types
export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  ip: string;
  threatLevel: string;
  timestamp: string | number;
}

export type SecurityEventType = 'login' | 'logout' | 'failed_login' | 'suspicious_activity' | 'blocked_ip';

// Logger Type
export interface Logger {
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
}

// DeFi Service Types
export interface PremiumDeFiService {
  fetchUserPools: (publicKey: string) => Promise<any[]>;
  [key: string]: any;
}

// Button Size Types
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

// Card Props Types
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

// Loading Spinner Types
export interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
}

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'default' | 'primary' | 'secondary'; 