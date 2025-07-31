declare module '@solana/wallet-adapter-react-ui' {
  import { FC, ReactNode } from 'react';
  import { WalletName } from '@solana/wallet-adapter-base';

  export interface WalletModalProps {
    className?: string;
    logo?: ReactNode;
    featuredWallets?: number;
    container?: string | Element;
  }

  export interface WalletMultiButtonProps {
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    endIcon?: ReactNode;
    startIcon?: ReactNode;
    tabIndex?: number;
  }

  export interface WalletConnectButtonProps {
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    endIcon?: ReactNode;
    startIcon?: ReactNode;
    tabIndex?: number;
  }

  export interface WalletDisconnectButtonProps {
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    endIcon?: ReactNode;
    startIcon?: ReactNode;
    tabIndex?: number;
  }

  export interface WalletIconProps {
    wallet?: { adapter: { icon: string; name: WalletName } } | null;
    className?: string;
  }

  export const WalletModalProvider: FC<WalletModalProps & { children?: ReactNode }>;
  export const WalletModal: FC;
  export const WalletMultiButton: FC<WalletMultiButtonProps>;
  export const WalletConnectButton: FC<WalletConnectButtonProps>;
  export const WalletDisconnectButton: FC<WalletDisconnectButtonProps>;
  export const WalletIcon: FC<WalletIconProps>;
  export const useWalletModal: () => {
    visible: boolean;
    setVisible: (visible: boolean) => void;
  };
}

declare module '@solana/wallet-adapter-react' {
  import { Adapter, WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
  import { Connection } from '@solana/web3.js';
  import { ReactNode, FC } from 'react';

  export interface Wallet {
    adapter: Adapter;
    readyState: WalletReadyState;
  }

  export interface WalletContextState {
    autoConnect: boolean;
    wallets: Wallet[];
    wallet: Wallet | null;
    publicKey: any | null;
    connecting: boolean;
    connected: boolean;
    disconnecting: boolean;
    select(walletName: WalletName): void;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction: any;
    signTransaction: any;
    signAllTransactions: any;
    signMessage: any;
    signIn: any;
  }

  export interface ConnectionContextState {
    connection: Connection;
  }

  export interface WalletProviderProps {
    children: ReactNode;
    wallets: Adapter[];
    autoConnect?: boolean;
    onError?: (error: any) => void;
    localStorageKey?: string;
  }

  export interface ConnectionProviderProps {
    children: ReactNode;
    endpoint: string;
    config?: any;
  }

  export const useWallet: () => WalletContextState;
  export const useConnection: () => ConnectionContextState;
  export const WalletProvider: FC<WalletProviderProps>;
  export const ConnectionProvider: FC<ConnectionProviderProps>;
}

declare module '@solana/wallet-adapter-base' {
  export type WalletName<T extends string = string> = T & { __brand__: 'WalletName' };

  export enum WalletReadyState {
    Installed = 'Installed',
    NotDetected = 'NotDetected',
    Loadable = 'Loadable',
    Unsupported = 'Unsupported',
  }

  export enum WalletAdapterNetwork {
    Mainnet = 'mainnet-beta',
    Testnet = 'testnet',
    Devnet = 'devnet',
  }

  export interface WalletAdapterEvents {
    connect(publicKey: any): void;
    disconnect(): void;
    error(error: any): void;
    readyStateChange(readyState: WalletReadyState): void;
  }

  export interface Adapter {
    name: WalletName;
    url: string;
    icon: string;
    readyState: WalletReadyState;
    publicKey: any | null;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
    signTransaction?(transaction: any): Promise<any>;
    signAllTransactions?(transactions: any[]): Promise<any[]>;
    signMessage?(message: Uint8Array): Promise<Uint8Array>;
    signIn?(input?: any): Promise<any>;
  }

  export abstract class BaseWalletAdapter implements Adapter {
    abstract name: WalletName;
    abstract url: string;
    abstract icon: string;
    abstract readyState: WalletReadyState;
    abstract publicKey: any | null;
    abstract connecting: boolean;
    abstract connected: boolean;
    abstract autoConnect(): Promise<void>;
    abstract connect(options?: any): Promise<void>;
    abstract disconnect(): Promise<void>;
    abstract sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
    signTransaction?(transaction: any): Promise<any>;
    signAllTransactions?(transactions: any[]): Promise<any[]>;
    signMessage?(message: Uint8Array): Promise<Uint8Array>;
    signIn?(input?: any): Promise<any>;
  }
}

declare module '@solana/wallet-adapter-wallets' {
  import { Adapter } from '@solana/wallet-adapter-base';

  export class PhantomWalletAdapter implements Adapter {
    name: any;
    url: string;
    icon: string;
    readyState: any;
    publicKey: any;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
  export class SolflareWalletAdapter implements Adapter {
    name: any;
    url: string;
    icon: string;
    readyState: any;
    publicKey: any;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
  export class TorusWalletAdapter implements Adapter {
    name: any;
    url: string;
    icon: string;
    readyState: any;
    publicKey: any;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
  export class LedgerWalletAdapter implements Adapter {
    name: any;
    url: string;
    icon: string;
    readyState: any;
    publicKey: any;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
  export class SolletWalletAdapter implements Adapter {
    name: any;
    url: string;
    icon: string;
    readyState: any;
    publicKey: any;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
  export class SolletExtensionWalletAdapter implements Adapter {
    name: any;
    url: string;
    icon: string;
    readyState: any;
    publicKey: any;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
  export class MathWalletAdapter implements Adapter {
    name: any;
    url: string;
    icon: string;
    readyState: any;
    publicKey: any;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
  export class Coin98WalletAdapter implements Adapter {
    name: any;
    url: string;
    icon: string;
    readyState: any;
    publicKey: any;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
  export class SlopeWalletAdapter implements Adapter {
    name: any;
    url: string;
    icon: string;
    readyState: any;
    publicKey: any;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
  export class BitpieWalletAdapter implements Adapter {
    name: any;
    url: string;
    icon: string;
    readyState: any;
    publicKey: any;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
  export class BitKeepWalletAdapter implements Adapter {
    name: any;
    url: string;
    icon: string;
    readyState: any;
    publicKey: any;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
  export class CloverWalletAdapter implements Adapter {
    name: any;
    url: string;
    icon: string;
    readyState: any;
    publicKey: any;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
  export class SafePalWalletAdapter implements Adapter {
    name: any;
    url: string;
    icon: string;
    readyState: any;
    publicKey: any;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
  export class TokenPocketWalletAdapter implements Adapter {
    name: any;
    url: string;
    icon: string;
    readyState: any;
    publicKey: any;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
  export class CoinbaseWalletAdapter implements Adapter {
    name: any;
    url: string;
    icon: string;
    readyState: any;
    publicKey: any;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
  export class BackpackWalletAdapter implements Adapter {
    name: any;
    url: string;
    icon: string;
    readyState: any;
    publicKey: any;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
  export class GlowWalletAdapter implements Adapter {
    name: any;
    url: string;
    icon: string;
    readyState: any;
    publicKey: any;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
  export class ExodusWalletAdapter implements Adapter {
    name: any;
    url: string;
    icon: string;
    readyState: any;
    publicKey: any;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
  export class TrustWalletAdapter implements Adapter {
    name: any;
    url: string;
    icon: string;
    readyState: any;
    publicKey: any;
    connecting: boolean;
    connected: boolean;
    autoConnect(): Promise<void>;
    connect(options?: any): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
}
