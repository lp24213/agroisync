'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { ethers } from 'ethers';
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';

/**
 * Web3 Hook - Comprehensive Web3 integration for Solana and Ethereum
 * 
 * @description A powerful hook that provides unified Web3 functionality
 * for both Solana and Ethereum networks with proper error handling,
 * connection management, and transaction support.
 */

export interface Web3State {
  // Solana
  solanaConnected: boolean;
  solanaWallet: string | null;
  solanaBalance: number | null;
  solanaNetwork: WalletAdapterNetwork | null;
  
  // Ethereum
  ethereumConnected: boolean;
  ethereumWallet: string | null;
  ethereumBalance: string | null;
  ethereumNetwork: number | null;
  
  // General
  isLoading: boolean;
  error: string | null;
}

export interface Web3Actions {
  // Solana
  connectSolana: () => Promise<void>;
  disconnectSolana: () => Promise<void>;
  sendSolanaTransaction: (transaction: Transaction | VersionedTransaction) => Promise<string>;
  getSolanaBalance: (address?: string) => Promise<number>;
  
  // Ethereum
  connectEthereum: (connector?: string) => Promise<void>;
  disconnectEthereum: () => Promise<void>;
  sendEthereumTransaction: (to: string, amount: string, data?: string) => Promise<string>;
  getEthereumBalance: (address?: string) => Promise<string>;
  
  // General
  clearError: () => void;
  refreshBalances: () => Promise<void>;
}

export interface UseWeb3Options {
  autoConnect?: boolean;
  networks?: {
    solana?: WalletAdapterNetwork;
    ethereum?: number;
  };
  rpcEndpoints?: {
    solana?: string;
    ethereum?: string;
  };
}

const DEFAULT_OPTIONS: UseWeb3Options = {
  autoConnect: true,
  networks: {
    solana: WalletAdapterNetwork.Mainnet,
    ethereum: 1, // Ethereum mainnet
  },
  rpcEndpoints: {
    solana: 'https://api.mainnet-beta.solana.com',
    ethereum: 'https://eth-mainnet.alchemyapi.io/v2/your-api-key',
  },
};

export function useWeb3(options: UseWeb3Options = {}): Web3State & Web3Actions {
  const opts = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);
  
  // State
  const [state, setState] = useState<Web3State>({
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
  });

  // Solana hooks
  const { connection } = useConnection();
  const { 
    wallet, 
    connected: solanaConnected, 
    connecting: solanaConnecting,
    disconnect: disconnectSolanaWallet,
    select,
    wallets,
    publicKey: solanaPublicKey,
  } = useWallet();

  // Ethereum hooks
  const { address: ethereumAddress, isConnected: ethereumConnected } = useAccount();
  const { connect: connectEthereumWallet, isPending: ethereumConnecting } = useConnect();
  const { disconnect: disconnectEthereumWallet } = useDisconnect();
  const { chain: ethereumChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  // Ethereum providers
  const ethereumProvider = useMemo(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    }
    return null;
  }, []);

  // Update state when connections change
  useEffect(() => {
    setState(prev => ({
      ...prev,
      solanaConnected,
      solanaWallet: solanaPublicKey?.toString() || null,
      isLoading: solanaConnecting || ethereumConnecting,
    }));
  }, [solanaConnected, solanaPublicKey, solanaConnecting, ethereumConnecting]);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      ethereumConnected,
      ethereumWallet: ethereumAddress || null,
      ethereumNetwork: ethereumChain?.id || null,
    }));
  }, [ethereumConnected, ethereumAddress, ethereumChain]);

  // Auto-connect
  useEffect(() => {
    if (opts.autoConnect) {
      // Auto-connect logic can be implemented here
    }
  }, [opts.autoConnect]);

  // Solana actions
  const connectSolana = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      if (wallets.length === 0) {
        throw new Error('No Solana wallets available');
      }
      
      // Select the first available wallet
      select(wallets[0].adapter.name);
      
      // Wait for connection
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 10000);
        
        const checkConnection = () => {
          if (solanaConnected) {
            clearTimeout(timeout);
            resolve();
          } else if (solanaConnecting) {
            setTimeout(checkConnection, 100);
          } else {
            clearTimeout(timeout);
            reject(new Error('Failed to connect'));
          }
        };
        
        checkConnection();
      });
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to connect Solana wallet' 
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [wallets, select, solanaConnected, solanaConnecting]);

  const disconnectSolana = useCallback(async () => {
    try {
      await disconnectSolanaWallet();
      setState(prev => ({
        ...prev,
        solanaConnected: false,
        solanaWallet: null,
        solanaBalance: null,
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to disconnect Solana wallet' 
      }));
    }
  }, [disconnectSolanaWallet]);

  const sendSolanaTransaction = useCallback(async (transaction: Transaction | VersionedTransaction): Promise<string> => {
    if (!wallet || !solanaConnected) {
      throw new Error('Solana wallet not connected');
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const signature = await wallet.adapter.sendTransaction(transaction, connection);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }
      
      return signature;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [wallet, solanaConnected, connection]);

  const getSolanaBalance = useCallback(async (address?: string): Promise<number> => {
    try {
      const publicKey = address ? new PublicKey(address) : solanaPublicKey;
      if (!publicKey) {
        throw new Error('No Solana address available');
      }
      
      const balance = await connection.getBalance(publicKey);
      const balanceInSol = balance / 1e9; // Convert lamports to SOL
      
      setState(prev => ({ ...prev, solanaBalance: balanceInSol }));
      return balanceInSol;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get Solana balance';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, [connection, solanaPublicKey]);

  // Ethereum actions
  const connectEthereum = useCallback(async (connectorType = 'injected') => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      let connector;
      switch (connectorType) {
        case 'metamask':
          connector = new MetaMaskConnector();
          break;
        case 'walletconnect':
          connector = new WalletConnectConnector({
            options: {
              projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
            },
          });
          break;
        case 'coinbase':
          connector = new CoinbaseWalletConnector({
            options: {
              appName: 'AGROTM',
            },
          });
          break;
        default:
          connector = new InjectedConnector();
      }
      
      await connectEthereumWallet({ connector });
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to connect Ethereum wallet' 
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [connectEthereumWallet]);

  const disconnectEthereum = useCallback(async () => {
    try {
      disconnectEthereumWallet();
      setState(prev => ({
        ...prev,
        ethereumConnected: false,
        ethereumWallet: null,
        ethereumBalance: null,
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to disconnect Ethereum wallet' 
      }));
    }
  }, [disconnectEthereumWallet]);

  const sendEthereumTransaction = useCallback(async (
    to: string, 
    amount: string, 
    data?: string
  ): Promise<string> => {
    if (!ethereumProvider || !ethereumAddress) {
      throw new Error('Ethereum wallet not connected');
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const signer = await ethereumProvider.getSigner();
      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(amount),
        data: data || '0x',
      });
      
      const receipt = await tx.wait();
      return receipt?.hash || tx.hash;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [ethereumProvider, ethereumAddress]);

  const getEthereumBalance = useCallback(async (address?: string): Promise<string> => {
    try {
      if (!ethereumProvider) {
        throw new Error('Ethereum provider not available');
      }
      
      const targetAddress = address || ethereumAddress;
      if (!targetAddress) {
        throw new Error('No Ethereum address available');
      }
      
      const balance = await ethereumProvider.getBalance(targetAddress);
      const balanceInEth = ethers.formatEther(balance);
      
      setState(prev => ({ ...prev, ethereumBalance: balanceInEth }));
      return balanceInEth;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get Ethereum balance';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, [ethereumProvider, ethereumAddress]);

  // General actions
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const refreshBalances = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const promises: Promise<unknown>[] = [];
      
      if (solanaConnected && solanaPublicKey) {
        promises.push(getSolanaBalance());
      }
      
      if (ethereumConnected && ethereumAddress) {
        promises.push(getEthereumBalance());
      }
      
      await Promise.all(promises);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to refresh balances' 
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [solanaConnected, solanaPublicKey, ethereumConnected, ethereumAddress, getSolanaBalance, getEthereumBalance]);

  // Auto-refresh balances when connections change
  useEffect(() => {
    if (solanaConnected || ethereumConnected) {
      refreshBalances();
    }
  }, [solanaConnected, ethereumConnected, refreshBalances]);

  return {
    ...state,
    connectSolana,
    disconnectSolana,
    sendSolanaTransaction,
    getSolanaBalance,
    connectEthereum,
    disconnectEthereum,
    sendEthereumTransaction,
    getEthereumBalance,
    clearError,
    refreshBalances,
  };
}

// Export types for external use
export type { Web3State, Web3Actions, UseWeb3Options }; 