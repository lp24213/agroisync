'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Type definition for Web3ContextType
interface Web3ContextType {
  isConnected: boolean;
  isConnecting: boolean;
  publicKey: string | null;
  account: string | null;
  provider: any;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  signTransaction: (transaction: any) => Promise<any>;
}

interface Web3ProviderProps {
  children: ReactNode;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      // Simulate connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsConnected(true);
      setPublicKey('demo-public-key-123');
      setAccount('demo-account-123');
      setProvider({ type: 'demo' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      setIsConnected(false);
      setPublicKey(null);
      setAccount(null);
      setProvider(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Disconnection failed');
    }
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }
    return `signed-${message}-${Date.now()}`;
  };

  const signTransaction = async (transaction: any): Promise<any> => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }
    return { ...transaction, signed: true };
  };

  const value: Web3ContextType = {
    isConnected,
    isConnecting,
    publicKey,
    account,
    provider,
    error,
    connect,
    disconnect,
    signMessage,
    signTransaction,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
