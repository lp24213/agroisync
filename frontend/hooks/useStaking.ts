import { useState, useEffect } from 'react';

export function useStaking(account: string | null) {
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    if (account) {
      // Aqui você pode integrar com o contrato real
      setBalance('1000'); // Simulação
    }
  }, [account]);

  async function stake(amount: string) {
    // Integração real com contrato de staking
    alert(`Stake de ${amount} AGROTM`);
  }

  async function unstake(amount: string) {
    alert(`Unstake de ${amount} AGROTM`);
  }

  return { stake, unstake, balance };
}
