import { useState, useEffect } from 'react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

import type { ToastProps } from '../components/Toast';

export function useWallet(setToast: (toast: ToastProps) => void) {
  const [account, setAccount] = useState<string | null>(null);

  async function connectWallet() {
    if (typeof window === 'undefined') return;
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (err) {
        setToast({
          message: 'Permissão da carteira negada ou erro ao conectar.',
          type: 'error',
          onClose: () => setToast(null as any),
        });
      }
    } else {
      setToast({
        message: 'Metamask não encontrada',
        type: 'warning',
        onClose: () => setToast(null as any),
      });
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    const handleAccountsChanged = (accounts: string[]) => {
      setAccount(accounts[0] || null);
    };
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  return { connectWallet, account };
}
