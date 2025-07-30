'use client';

import { useState, useEffect, useCallback } from 'react';

interface Web3State {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  publicKey: string | null;
  account: string | null;
}

export function useWeb3() {
  const [state, setState] = useState<Web3State>({
    isConnected: false,
    isConnecting: false,
    error: null,
    publicKey: null,
    account: null,
  });

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Simulação de conexão com wallet
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockPublicKey = 'mock-public-key-' + Date.now();
      
      setState({
        isConnected: true,
        isConnecting: false,
        error: null,
        publicKey: mockPublicKey,
        account: mockPublicKey,
      });

      // Salvar no localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('walletConnected', 'true');
      }
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Erro ao conectar carteira',
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      isConnecting: false,
      error: null,
      publicKey: null,
      account: null,
    });

    if (typeof window !== 'undefined') {
      localStorage.removeItem('walletConnected');
    }
  }, []);

  const getBalance = useCallback(async (address?: string): Promise<string> => {
    // Simulação de busca de saldo
    return '1000.00';
  }, []);

  const sendTransaction = useCallback(async (to: string, amount: string) => {
    // Simulação de envio de transação
    return { signature: 'mock-signature-' + Date.now() };
  }, []);

  // Auto-conectar se já estava conectado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const wasConnected = localStorage.getItem('walletConnected');
      if (wasConnected) {
        connect();
      }
    }
  }, [connect]);

  return {
    ...state,
    connect,
    connectWallet: connect,
    disconnect,
    getBalance,
    sendTransaction,
  };
} 