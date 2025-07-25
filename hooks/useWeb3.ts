'use client';
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

interface Web3State {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export function useWeb3() {
  const [state, setState] = useState<Web3State>({
    provider: null,
    signer: null,
    account: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setState((prev) => ({ ...prev, error: 'MetaMask não encontrado' }));
      return;
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);

      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      setState({
        provider,
        signer,
        account,
        chainId,
        isConnected: true,
        isConnecting: false,
        error: null,
      });

      // Salvar no localStorage
      localStorage.setItem('walletConnected', 'true');
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
      provider: null,
      signer: null,
      account: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
    localStorage.removeItem('walletConnected');
  }, []);

  const switchNetwork = useCallback(async (targetChainId: number) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Rede não adicionada, tentar adicionar
        setState((prev) => ({ ...prev, error: 'Rede não encontrada' }));
      } else {
        setState((prev) => ({ ...prev, error: error.message }));
      }
    }
  }, []);

  const getBalance = useCallback(
    async (address?: string): Promise<string> => {
      if (!state.provider) return '0';

      try {
        const targetAddress = address || state.account;
        if (!targetAddress) return '0';

        const balance = await state.provider.getBalance(targetAddress);
        return ethers.formatEther(balance);
      } catch (error) {
        console.error('Erro ao buscar saldo:', error);
        return '0';
      }
    },
    [state.provider, state.account],
  );

  const sendTransaction = useCallback(
    async (to: string, value: string, data?: string) => {
      if (!state.signer) throw new Error('Signer não disponível');

      try {
        const tx = await state.signer.sendTransaction({
          to,
          value: ethers.parseEther(value),
          data: data || '0x',
        });

        return await tx.wait();
      } catch (error: any) {
        throw new Error(error.message || 'Erro ao enviar transação');
      }
    },
    [state.signer],
  );

  // Auto-conectar se já estava conectado
  useEffect(() => {
    const autoConnect = async () => {
      const wasConnected = localStorage.getItem('walletConnected');
      if (wasConnected && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await connect();
          }
        } catch (error) {
          console.error('Erro no auto-connect:', error);
        }
      }
    };

    autoConnect();
  }, [connect]);

  // Listeners para mudanças de conta/rede
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== state.account) {
        connect();
      }
    };

    const handleChainChanged = () => {
      connect(); // Reconectar para atualizar chainId
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [connect, disconnect, state.account]);

  return {
    ...state,
    connect,
    connectWallet: connect, // Alias para compatibilidade
    disconnect,
    switchNetwork,
    getBalance,
    sendTransaction,
  };
}
