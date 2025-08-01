'use client';

import React from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useDeFiPools } from '@/hooks/useDeFiPools';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { validation } from '@/utils/validation';

export default function Dashboard() {
  const { isConnected, connect, disconnect, publicKey, getBalance } = useWeb3();
  const { pools, loading, stakeInPool, unstakeFromPool, claimRewards } = useDeFiPools();
  const [balance, setBalance] = React.useState<string>('0');

  React.useEffect(() => {
    if (isConnected && publicKey) {
      getBalance(publicKey).then(setBalance);
    }
  }, [isConnected, publicKey, getBalance]);

  const handleStake = async (poolId: string, amount: string) => {
    try {
      await stakeInPool(poolId, amount);
      alert('Stake realizado com sucesso!');
    } catch (error: any) {
      alert(`Erro ao fazer stake: ${error.message}`);
    }
  };

  const handleUnstake = async (poolId: string, amount: string) => {
    try {
      await unstakeFromPool(poolId, amount);
      alert('Unstake realizado com sucesso!');
    } catch (error: any) {
      alert(`Erro ao fazer unstake: ${error.message}`);
    }
  };

  const handleClaimRewards = async (poolId: string) => {
    try {
      await claimRewards(poolId);
      alert('Recompensas reivindicadas com sucesso!');
    } catch (error: any) {
      alert(`Erro ao reivindicar recompensas: ${error.message}`);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-agro-darker flex items-center justify-center">
        <Card className="max-w-md w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Conecte sua Carteira</h1>
            <p className="text-gray-400 mb-6">
              Para acessar o dashboard, você precisa conectar sua carteira Solana.
            </p>
            <Button onClick={connect} variant="primary" size="lg">
              Conectar Carteira
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-agro-darker p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">
              Carteira: {publicKey?.slice(0, 8)}...{publicKey?.slice(-8)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-400">Saldo</p>
            <p className="text-2xl font-bold text-agro-green">
              {validation.formatNumber(parseFloat(balance))} SOL
            </p>
            <Button onClick={disconnect} variant="outline" size="sm" className="mt-2">
              Desconectar
            </Button>
          </div>
        </div>

        {/* Pools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center">
              <p className="text-gray-400">Carregando pools...</p>
            </div>
          ) : (
            pools.map((pool) => (
              <Card key={pool.id} className="relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{pool.name}</h3>
                    <p className="text-gray-400 text-sm">{pool.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    pool.riskLevel === 'Low' ? 'bg-green-500/20 text-green-400' :
                    pool.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {pool.riskLevel}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">APR:</span>
                    <span className="text-agro-green font-bold">
                      {validation.formatPercentage(pool.apr)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">TVL:</span>
                    <span className="text-white">
                      {validation.formatCurrency(pool.tvl)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Seu Stake:</span>
                    <span className="text-white">
                      {validation.formatNumber(pool.userStaked)}
                    </span>
                  </div>
                  {pool.userRewards > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Recompensas:</span>
                      <span className="text-agro-blue font-bold">
                        {validation.formatNumber(pool.userRewards)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => handleStake(pool.id, '100')}
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    Stake 100 AGRO
                  </Button>
                  
                  {pool.userStaked > 0 && (
                    <>
                      <Button
                        onClick={() => handleUnstake(pool.id, '50')}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Unstake 50 AGRO
                      </Button>
                      
                      {pool.userRewards > 0 && (
                        <Button
                          onClick={() => handleClaimRewards(pool.id)}
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          Reivindicar Recompensas
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 