'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { validation } from '@/utils/validation';

interface Pool {
  id: string;
  name: string;
  apr: number;
  minStake: number;
  maxStake: number;
  lockPeriod: number;
}

interface StakingFormProps {
  pools: Pool[];
  onStake: (poolId: string, amount: number) => void;
  onUnstake: (poolId: string, amount: number) => void;
  onClaim: (poolId: string) => void;
}

export function StakingForm({ pools, onStake, onUnstake, onClaim }: StakingFormProps) {
  const [selectedPool, setSelectedPool] = React.useState<string>('');
  const [amount, setAmount] = React.useState<string>('');
  const [action, setAction] = React.useState<'stake' | 'unstake' | 'claim'>('stake');
  const [loading, setLoading] = React.useState(false);

  const selectedPoolData = pools.find(p => p.id === selectedPool);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPool) {
      alert('Selecione um pool');
      return;
    }

    if (action !== 'claim' && !amount) {
      alert('Insira um valor');
      return;
    }

    if (action !== 'claim' && !validation.isValidTokenAmount(amount)) {
      alert('Valor inválido');
      return;
    }

    setLoading(true);
    try {
      if (action === 'stake') {
        await onStake(selectedPool, parseFloat(amount));
      } else if (action === 'unstake') {
        await onUnstake(selectedPool, parseFloat(amount));
      } else if (action === 'claim') {
        await onClaim(selectedPool);
      }
      
      setAmount('');
      alert(`${action === 'stake' ? 'Stake' : action === 'unstake' ? 'Unstake' : 'Claim'} realizado com sucesso!`);
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const poolOptions = pools.map(pool => ({
    value: pool.id,
    label: `${pool.name} (${validation.formatPercentage(pool.apr)} APR)`
  }));

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Staking</h2>
        <p className="text-gray-400">Stake, unstake ou reivindique recompensas</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            type="button"
            variant={action === 'stake' ? 'primary' : 'outline'}
            onClick={() => setAction('stake')}
            className="w-full"
          >
            Stake
          </Button>
          <Button
            type="button"
            variant={action === 'unstake' ? 'primary' : 'outline'}
            onClick={() => setAction('unstake')}
            className="w-full"
          >
            Unstake
          </Button>
          <Button
            type="button"
            variant={action === 'claim' ? 'primary' : 'outline'}
            onClick={() => setAction('claim')}
            className="w-full"
          >
            Claim
          </Button>
        </div>

        <Select
          label="Selecionar Pool"
          options={poolOptions}
          value={selectedPool}
          onChange={(e) => setSelectedPool(e.target.value)}
          placeholder="Escolha um pool"
        />

        {selectedPoolData && (
          <div className="p-4 bg-agro-dark/50 rounded-lg">
            <h3 className="font-semibold text-white mb-2">Informações do Pool</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">APR:</span>
                <span className="text-agro-green font-semibold ml-2">
                  {validation.formatPercentage(selectedPoolData.apr)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Lock Period:</span>
                <span className="text-white ml-2">{selectedPoolData.lockPeriod} dias</span>
              </div>
              <div>
                <span className="text-gray-400">Min Stake:</span>
                <span className="text-white ml-2">{selectedPoolData.minStake}</span>
              </div>
              <div>
                <span className="text-gray-400">Max Stake:</span>
                <span className="text-white ml-2">{selectedPoolData.maxStake}</span>
              </div>
            </div>
          </div>
        )}

        {action !== 'claim' && (
          <Input
            label="Quantidade"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            helperText={`Min: ${selectedPoolData?.minStake || 0}, Max: ${selectedPoolData?.maxStake || 0}`}
          />
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading || !selectedPool || (action !== 'claim' && !amount)}
        >
          {loading ? 'Processando...' : 
           action === 'stake' ? 'Fazer Stake' :
           action === 'unstake' ? 'Fazer Unstake' : 'Reivindicar Recompensas'}
        </Button>
      </form>
    </Card>
  );
} 