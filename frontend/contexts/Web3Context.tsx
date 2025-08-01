'use client';

import React, { createContext, useContext, useState } from 'react';

interface Web3ContextType {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate connection for now
      setAccount('0x1234567890123456789012345678901234567890');
      setIsConnected(true);
      setChainId(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAccount(null);
    setChainId(null);
    setError(null);
  };

  const switchNetwork = async (targetChainId: number) => {
    try {
      setChainId(targetChainId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch network');
    }
  };

  const value: Web3ContextType = {
    isConnected,
    account,
    chainId,
    connect,
    disconnect,
    switchNetwork,
    isLoading,
    error,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
