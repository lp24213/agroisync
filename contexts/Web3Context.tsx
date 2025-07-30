'use client';

import React, { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter, BackpackWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { WagmiConfig, createConfig, configureChains, mainnet, polygon, arbitrum, optimism } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useWeb3, type Web3State, type Web3Actions, type UseWeb3Options } from '@/hooks/useWeb3';

/**
 * Web3 Context - Comprehensive Web3 provider for AGROTM platform
 * 
 * @description A powerful context provider that manages Web3 state,
 * connections, and provides unified access to Solana and Ethereum
 * functionality throughout the application.
 */

// Context state interface
export interface Web3ContextState extends Web3State {
  // Additional context-specific state
  isInitialized: boolean;
  isConnecting: boolean;
  lastTransaction: {
    hash: string | null;
    network: 'solana' | 'ethereum' | null;
    timestamp: number | null;
  };
  transactionHistory: Array<{
    hash: string;
    network: 'solana' | 'ethereum';
    timestamp: number;
    status: 'pending' | 'confirmed' | 'failed';
    amount?: string;
    to?: string;
  }>;
  preferences: {
    defaultNetwork: 'solana' | 'ethereum';
    autoConnect: boolean;
    notifications: boolean;
  };
}

// Context actions interface
export interface Web3ContextActions extends Web3Actions {
  // Additional context-specific actions
  initialize: () => Promise<void>;
  setDefaultNetwork: (network: 'solana' | 'ethereum') => void;
  setPreferences: (preferences: Partial<Web3ContextState['preferences']>) => void;
  addTransaction: (transaction: Web3ContextState['transactionHistory'][0]) => void;
  clearTransactionHistory: () => void;
  getTransactionStatus: (hash: string, network: 'solana' | 'ethereum') => Promise<'pending' | 'confirmed' | 'failed'>;
}

// Combined context type
export type Web3ContextType = Web3ContextState & Web3ContextActions;

// Action types for reducer
type Web3Action =
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_CONNECTING'; payload: boolean }
  | { type: 'SET_LAST_TRANSACTION'; payload: Web3ContextState['lastTransaction'] }
  | { type: 'ADD_TRANSACTION'; payload: Web3ContextState['transactionHistory'][0] }
  | { type: 'CLEAR_TRANSACTION_HISTORY' }
  | { type: 'SET_PREFERENCES'; payload: Partial<Web3ContextState['preferences']> }
  | { type: 'UPDATE_TRANSACTION_STATUS'; payload: { hash: string; status: 'pending' | 'confirmed' | 'failed' } }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: Web3ContextState = {
  // Web3 state
  solanaConnected: false,
  solanaWallet: null,
  solanaBalance: null,
  solanaNetwork: null,
  ethereumConnected: false,
  ethereumWallet: null,
  ethereumBalance: null,
  ethereumNetwork: null,
  isLoading: false,
  error: null,
  
  // Context-specific state
  isInitialized: false,
  isConnecting: false,
  lastTransaction: {
    hash: null,
    network: null,
    timestamp: null,
  },
  transactionHistory: [],
  preferences: {
    defaultNetwork: 'solana',
    autoConnect: true,
    notifications: true,
  },
};

// Reducer function
function web3Reducer(state: Web3ContextState, action: Web3Action): Web3ContextState {
  switch (action.type) {
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    
    case 'SET_CONNECTING':
      return { ...state, isConnecting: action.payload };
    
    case 'SET_LAST_TRANSACTION':
      return { ...state, lastTransaction: action.payload };
    
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactionHistory: [action.payload, ...state.transactionHistory].slice(0, 50), // Keep last 50
        lastTransaction: {
          hash: action.payload.hash,
          network: action.payload.network,
          timestamp: action.payload.timestamp,
        },
      };
    
    case 'CLEAR_TRANSACTION_HISTORY':
      return { ...state, transactionHistory: [] };
    
    case 'SET_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };
    
    case 'UPDATE_TRANSACTION_STATUS':
      return {
        ...state,
        transactionHistory: state.transactionHistory.map(tx =>
          tx.hash === action.payload.hash
            ? { ...tx, status: action.payload.status }
            : tx
        ),
      };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
}

// Create context
const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Solana wallet adapters
const getSolanaWallets = () => [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new BackpackWalletAdapter(),
];

// Wagmi configuration
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, arbitrum, optimism],
  [publicProvider()]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'AGROTM',
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

// Provider component
export interface Web3ProviderProps {
  children: React.ReactNode;
  options?: UseWeb3Options;
  endpoint?: string;
  network?: WalletAdapterNetwork;
}

export function Web3Provider({ 
  children, 
  options = {}, 
  endpoint = clusterApiUrl('mainnet-beta'),
  network = WalletAdapterNetwork.Mainnet 
}: Web3ProviderProps) {
  const [state, dispatch] = useReducer(web3Reducer, initialState);
  const wallets = useMemo(() => getSolanaWallets(), []);

  // Initialize Web3 hook
  const web3Hook = useWeb3({
    ...options,
    autoConnect: state.preferences.autoConnect,
  });

  // Initialize context
  const initialize = useCallback(async () => {
    try {
      dispatch({ type: 'SET_INITIALIZED', payload: false });
      dispatch({ type: 'SET_CONNECTING', payload: true });
      
      // Load preferences from localStorage
      if (typeof window !== 'undefined') {
        const savedPreferences = localStorage.getItem('agrotm-web3-preferences');
        if (savedPreferences) {
          const preferences = JSON.parse(savedPreferences);
          dispatch({ type: 'SET_PREFERENCES', payload: preferences });
        }
        
        const savedTransactions = localStorage.getItem('agrotm-transaction-history');
        if (savedTransactions) {
          const transactions = JSON.parse(savedTransactions);
          transactions.forEach((tx: Web3ContextState['transactionHistory'][0]) => {
            dispatch({ type: 'ADD_TRANSACTION', payload: tx });
          });
        }
      }
      
      // Auto-connect if enabled
      if (state.preferences.autoConnect) {
        if (state.preferences.defaultNetwork === 'solana') {
          await web3Hook.connectSolana();
        } else {
          await web3Hook.connectEthereum();
        }
      }
      
      dispatch({ type: 'SET_INITIALIZED', payload: true });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to initialize Web3' 
      });
    } finally {
      dispatch({ type: 'SET_CONNECTING', payload: false });
    }
  }, [state.preferences.autoConnect, state.preferences.defaultNetwork, web3Hook]);

  // Set default network
  const setDefaultNetwork = useCallback((network: 'solana' | 'ethereum') => {
    dispatch({ type: 'SET_PREFERENCES', payload: { defaultNetwork: network } });
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      const currentPreferences = { ...state.preferences, defaultNetwork: network };
      localStorage.setItem('agrotm-web3-preferences', JSON.stringify(currentPreferences));
    }
  }, [state.preferences]);

  // Set preferences
  const setPreferences = useCallback((preferences: Partial<Web3ContextState['preferences']>) => {
    dispatch({ type: 'SET_PREFERENCES', payload: preferences });
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      const currentPreferences = { ...state.preferences, ...preferences };
      localStorage.setItem('agrotm-web3-preferences', JSON.stringify(currentPreferences));
    }
  }, [state.preferences]);

  // Add transaction to history
  const addTransaction = useCallback((transaction: Web3ContextState['transactionHistory'][0]) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      const currentTransactions = [transaction, ...state.transactionHistory].slice(0, 50);
      localStorage.setItem('agrotm-transaction-history', JSON.stringify(currentTransactions));
    }
  }, [state.transactionHistory]);

  // Clear transaction history
  const clearTransactionHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_TRANSACTION_HISTORY' });
    
    // Clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agrotm-transaction-history');
    }
  }, []);

  // Get transaction status
  const getTransactionStatus = useCallback(async (
    hash: string, 
    network: 'solana' | 'ethereum'
  ): Promise<'pending' | 'confirmed' | 'failed'> => {
    try {
      if (network === 'solana') {
        // Implement Solana transaction status check
        return 'confirmed';
      } else {
        // Implement Ethereum transaction status check
        return 'confirmed';
      }
    } catch (error) {
      return 'failed';
    }
  }, []);

  // Enhanced transaction functions
  const sendSolanaTransaction = useCallback(async (transaction: any) => {
    try {
      const hash = await web3Hook.sendSolanaTransaction(transaction);
      
      const txRecord = {
        hash,
        network: 'solana' as const,
        timestamp: Date.now(),
        status: 'pending' as const,
      };
      
      addTransaction(txRecord);
      
      // Update status after confirmation
      setTimeout(async () => {
        const status = await getTransactionStatus(hash, 'solana');
        dispatch({ type: 'UPDATE_TRANSACTION_STATUS', payload: { hash, status } });
      }, 5000);
      
      return hash;
    } catch (error) {
      throw error;
    }
  }, [web3Hook, addTransaction, getTransactionStatus]);

  const sendEthereumTransaction = useCallback(async (to: string, amount: string, data?: string) => {
    try {
      const hash = await web3Hook.sendEthereumTransaction(to, amount, data);
      
      const txRecord = {
        hash,
        network: 'ethereum' as const,
        timestamp: Date.now(),
        status: 'pending' as const,
        amount,
        to,
      };
      
      addTransaction(txRecord);
      
      // Update status after confirmation
      setTimeout(async () => {
        const status = await getTransactionStatus(hash, 'ethereum');
        dispatch({ type: 'UPDATE_TRANSACTION_STATUS', payload: { hash, status } });
      }, 5000);
      
      return hash;
    } catch (error) {
      throw error;
    }
  }, [web3Hook, addTransaction, getTransactionStatus]);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Combine state and actions
  const contextValue = useMemo<Web3ContextType>(() => ({
    // State
    ...web3Hook,
    ...state,
    
    // Actions
    initialize,
    setDefaultNetwork,
    setPreferences,
    addTransaction,
    clearTransactionHistory,
    getTransactionStatus,
    sendSolanaTransaction,
    sendEthereumTransaction,
  }), [
    web3Hook,
    state,
    initialize,
    setDefaultNetwork,
    setPreferences,
    addTransaction,
    clearTransactionHistory,
    getTransactionStatus,
    sendSolanaTransaction,
    sendEthereumTransaction,
  ]);

  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={state.preferences.autoConnect}>
          <WalletModalProvider>
            <Web3Context.Provider value={contextValue}>
              {children}
            </Web3Context.Provider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </WagmiConfig>
  );
}

// Hook to use Web3 context
export function useWeb3Context(): Web3ContextType {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3Context must be used within a Web3Provider');
  }
  return context;
}

// Error boundary for Web3 errors
export class Web3ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Web3 Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-red-50">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              Web3 Connection Error
            </h2>
            <p className="text-red-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Export types
export type { Web3ContextState, Web3ContextActions, Web3ContextType }; 