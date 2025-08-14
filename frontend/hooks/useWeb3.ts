'use client';

import { useState, useEffect, useCallback } from 'react';
// import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { useWeb3 as useWeb3Context } from '../contexts/Web3Context';

interface Web3HookState {
  connection: any | null; // Mock type for development
  balance: number;
  isConnected: boolean;
  publicKey: string | null;
  loading: boolean;
  error: string | null;
}

interface Web3HookActions {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendTransaction: (transaction: any) => Promise<string>; // Mock type for development
  getBalance: () => Promise<number>;
  signMessage: (message: string) => Promise<string>;
}

export const useWeb3Hook = (): Web3HookState & Web3HookActions => {
  const { isConnected, publicKey, connect, disconnect, signMessage } = useWeb3Context();
  const [connection, setConnection] = useState<any | null>(null); // Mock type for development
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize connection
  useEffect(() => {
    // Mock connection for development
    // const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    // const newConnection = new Connection(rpcUrl);
    // setConnection(newConnection);
  }, []);

  // Get balance when connected
  useEffect(() => {
    if (isConnected && publicKey && connection) {
      getBalance();
    } else {
      setBalance(0);
    }
  }, [isConnected, publicKey, connection]);

  const getBalance = useCallback(async (): Promise<number> => {
    // Mock balance for development
    const mockBalance = 1000; // Mock SOL balance
    setBalance(mockBalance);
    return mockBalance;
    
    /* Original code commented for development
    if (!connection || !publicKey) return 0;

    try {
      const pubKey = new PublicKey(publicKey);
      const balance = await connection.getBalance(pubKey);
      const balanceInSol = balance / 1e9; // Convert lamports to SOL
      setBalance(balanceInSol);
      return balanceInSol;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get balance';
      setError(errorMessage);
      console.error('Failed to get balance:', errorMessage);
      return 0;
    }
    */
  }, []);

  const sendTransaction = useCallback(async (transaction: any): Promise<string> => { // Mock type for development
    if (!connection || !publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      // Mock transaction sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Sign the transaction with the wallet
      // 2. Send it to the network
      // 3. Wait for confirmation
      
      const mockSignature = 'mock-signature-' + Date.now();
      
      // Update balance after transaction
      await getBalance();
      
      return mockSignature;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey, getBalance]);

  const signMessageWithWallet = useCallback(async (message: string): Promise<string> => {
    if (!isConnected || !publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      return await signMessage(message);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign message';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isConnected, publicKey, signMessage]);

  return {
    connection,
    balance,
    isConnected,
    publicKey,
    loading,
    error,
    connect,
    disconnect,
    sendTransaction,
    getBalance,
    signMessage: signMessageWithWallet
  };
}; 