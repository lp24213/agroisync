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