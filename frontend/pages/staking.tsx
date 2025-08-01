'use client';

import React from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useDeFiPools } from '@/hooks/useDeFiPools';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { validation } from '@/utils/validation';

export default function Staking() {
  const { isConnected, connect, publicKey } = useWeb3();
  const { pools, loading, stakeInPool, unstakeFromPool, claimRewards } = useDeFiPools();
  const [selectedPool, setSelectedPool] = React.useState<string>('');
  const [stakeAmount, setStakeAmount] = React.useState<string>('');
  const [unstakeAmount, setUnstakeAmount] = React.useState<string>('');

  const selectedPoolData = pools.find(p => p.id === selectedPool);

  const handleStake = async () => {
    if (!selectedPool || !stakeAmount) {
      alert('Selecione um pool e insira um valor');
      return;
    }

    if (!validation.isValidTokenAmount(stakeAmount)) {
      alert('Valor inválido');
      return;
    }

    try {
      await stakeInPool(selectedPool, stakeAmount);
      alert('Stake realizado com sucesso!');
      setStakeAmount('');
    } catch (error: any) {
      alert(`Erro ao fazer stake: ${error.message}`);
    }
  };

  const handleUnstake = async () => {
    if (!selectedPool || !unstakeAmount) {
      alert('Selecione um pool e insira um valor');
      return;
    }

    if (!validation.isValidTokenAmount(unstakeAmount)) {
      alert('Valor inválido');
      return;
    }

    try {
      await unstakeFromPool(selectedPool, unstakeAmount);
      alert('Unstake realizado com sucesso!');
      setUnstakeAmount('');
    } catch (error: any) {
      alert(`Erro ao fazer unstake: ${error.message}`);
    }
  };

  const handleClaimRewards = async () => {
    if (!selectedPool) {
      alert('Selecione um pool');
      return;
    }

    try {
      await claimRewards(selectedPool);
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
              Para acessar o staking, você precisa conectar sua carteira Solana.
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Staking</h1>
          <p className="text-gray-400">
            Stake seus tokens AGRO e ganhe recompensas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pool Selection */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Selecionar Pool</h2>
            
            {loading ? (
              <p className="text-gray-400">Carregando pools...</p>
            ) : (
              <div className="space-y-3">
                {pools.map((pool) => (
                  <div
                    key={pool.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedPool === pool.id
                        ? 'border-agro-blue bg-agro-blue/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedPool(pool.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-white">{pool.name}</h3>
                        <p className="text-sm text-gray-400">{pool.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-agro-green font-bold">
                          {validation.formatPercentage(pool.apr)}
                        </p>
                        <p className="text-xs text-gray-400">APR</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">TVL:</span>
                        <span className="text-white ml-1">
                          {validation.formatCurrency(pool.tvl)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Seu Stake:</span>
                        <span className="text-white ml-1">
                          {validation.formatNumber(pool.userStaked)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Staking Actions */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Ações</h2>
            
            {selectedPoolData ? (
              <div className="space-y-6">
                {/* Pool Info */}
                <div className="p-4 bg-agro-dark/50 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">
                    Pool Selecionado: {selectedPoolData.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">APR:</span>
                      <span className="text-agro-green font-bold ml-1">
                        {validation.formatPercentage(selectedPoolData.apr)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Seu Stake:</span>
                      <span className="text-white ml-1">
                        {validation.formatNumber(selectedPoolData.userStaked)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Recompensas:</span>
                      <span className="text-agro-blue font-bold ml-1">
                        {validation.formatNumber(selectedPoolData.userRewards)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Risco:</span>
                      <span className="text-white ml-1">
                        {selectedPoolData.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stake */}
                <div>
                  <h4 className="font-semibold text-white mb-2">Fazer Stake</h4>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Quantidade de AGRO"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="w-full p-3 bg-agro-dark border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-agro-blue"
                    />
                    <Button
                      onClick={handleStake}
                      variant="primary"
                      className="w-full"
                      disabled={!stakeAmount}
                    >
                      Stake AGRO
                    </Button>
                  </div>
                </div>

                {/* Unstake */}
                {selectedPoolData.userStaked > 0 && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Fazer Unstake</h4>
                    <div className="space-y-3">
                      <input
                        type="number"
                        placeholder="Quantidade para unstake"
                        value={unstakeAmount}
                        onChange={(e) => setUnstakeAmount(e.target.value)}
                        className="w-full p-3 bg-agro-dark border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-agro-blue"
                      />
                      <Button
                        onClick={handleUnstake}
                        variant="outline"
                        className="w-full"
                        disabled={!unstakeAmount}
                      >
                        Unstake AGRO
                      </Button>
                    </div>
                  </div>
                )}

                {/* Claim Rewards */}
                {selectedPoolData.userRewards > 0 && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Reivindicar Recompensas</h4>
                    <Button
                      onClick={handleClaimRewards}
                      variant="secondary"
                      className="w-full"
                    >
                      Reivindicar {validation.formatNumber(selectedPoolData.userRewards)} AGRO
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">Selecione um pool para começar</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
} 