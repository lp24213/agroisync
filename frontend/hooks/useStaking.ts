import { useState, useEffect } from 'react';
import type { ToastProps } from '../components/Toast';

export function useStaking(account: string | null, setToast: (toast: ToastProps) => void) {
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    if (account) {
      // Aqui você pode integrar com o contrato real
      setBalance('1000'); // Simulação
    }
  }, [account]);

  async function stake(amount: string) {
    // Integração real com contrato de staking
    setToast({
      message: `Stake de ${amount} AGROTM realizado com sucesso!`,
      type: 'success',
      onClose: () => setToast(null as any),
    });
  }

  async function unstake(amount: string) {
    setToast({
      message: `Unstake de ${amount} AGROTM realizado!`,
      type: 'info',
      onClose: () => setToast(null as any),
    });
  }

  return { stake, unstake, balance };
}
