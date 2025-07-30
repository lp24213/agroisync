'use client';

import React from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useDeFiPools } from '@/hooks/useDeFiPools';
import { PortfolioOverview } from '@/components/dashboard/PortfolioOverview';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { StakingOverview } from '@/components/dashboard/StakingOverview';
import { WalletConnectForm } from '@/components/forms/WalletConnectForm';
import { validation } from '@/utils/validation';

interface Transaction {
  id: string;
  type: 'stake' | 'unstake' | 'claim' | 'transfer';
  amount: number;
  token: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  hash: string;
}

interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  price: number;
  value: number;
  change24h: number;
}

export default function DashboardPage() {
  const { isConnected, publicKey, getBalance } = useWeb3();
  const { pools, loading, stakeInPool, unstakeFromPool, claimRewards } = useDeFiPools();
  const [balance, setBalance] = React.useState<string>('0');
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [portfolioAssets, setPortfolioAssets] = React.useState<PortfolioAsset[]>([]);

  React.useEffect(() => {
    if (isConnected && publicKey) {
      getBalance(publicKey).then(setBalance);
      
      // Simular dados do portfólio
      const mockAssets: PortfolioAsset[] = [
        {
          id: '1',
          symbol: 'AGRO',
          name: 'AGRO Token',
          balance: 1000,
          price: 2.45,
          value: 2450,
          change24h: 5.2,
        },
        {
          id: '2',
          symbol: 'SOL',
          name: 'Solana',
          balance: 50,
          price: 98.50,
          value: 4925,
          change24h: -1.8,
        },
        {
          id: '3',
          symbol: 'USDC',
          name: 'USD Coin',
          balance: 5000,
          price: 1.00,
          value: 5000,
          change24h: 0.0,
        },
      ];
      setPortfolioAssets(mockAssets);

      // Simular transações recentes
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'stake',
          amount: 100,
          token: 'AGRO',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          status: 'confirmed',
          hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        },
        {
          id: '2',
          type: 'claim',
          amount: 25.5,
          token: 'AGRO',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          status: 'confirmed',
          hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        },
        {
          id: '3',
          type: 'transfer',
          amount: 500,
          token: 'USDC',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          status: 'confirmed',
          hash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
        },
      ];
      setTransactions(mockTransactions);
    }
  }, [isConnected, publicKey, getBalance]);

  const totalPortfolioValue = portfolioAssets.reduce((sum, asset) => sum + asset.value, 0);
  const portfolioChange24h = portfolioAssets.reduce((sum, asset) => sum + (asset.value * asset.change24h / 100), 0);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-agro-darker flex items-center justify-center">
        <WalletConnectForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-agro-darker p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Carteira: {publicKey?.slice(0, 8)}...{publicKey?.slice(-8)}
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="mb-8">
          <PortfolioOverview
            totalValue={totalPortfolioValue}
            change24h={portfolioChange24h}
            assets={portfolioAssets}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Staking Overview */}
          <div>
            <StakingOverview
              pools={pools.map(pool => ({
                id: pool.id,
                name: pool.name,
                token: pool.token0,
                stakedAmount: pool.userStaked,
                rewards: pool.userRewards,
                apr: pool.apr,
                lockPeriod: pool.lockPeriod,
                isLocked: false,
              }))}
              onStake={async (poolId: string) => {
                try {
                  await stakeInPool(poolId, '100');
                  alert('Stake realizado com sucesso!');
                } catch (error: any) {
                  alert(`Erro ao fazer stake: ${error.message}`);
                }
              }}
              onUnstake={async (poolId: string) => {
                try {
                  await unstakeFromPool(poolId, '50');
                  alert('Unstake realizado com sucesso!');
                } catch (error: any) {
                  alert(`Erro ao fazer unstake: ${error.message}`);
                }
              }}
              onClaim={async (poolId: string) => {
                try {
                  await claimRewards(poolId);
                  alert('Recompensas reivindicadas com sucesso!');
                } catch (error: any) {
                  alert(`Erro ao reivindicar recompensas: ${error.message}`);
                }
              }}
            />
          </div>

          {/* Recent Transactions */}
          <div>
            <RecentTransactions transactions={transactions} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-agro-dark p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Saldo Total</h3>
            <p className="text-2xl font-bold text-agro-green">
              {validation.formatCurrency(totalPortfolioValue)}
            </p>
          </div>
          
          <div className="bg-agro-dark p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Staking Ativo</h3>
            <p className="text-2xl font-bold text-agro-blue">
              {validation.formatCurrency(pools.reduce((sum, pool) => sum + pool.userStaked, 0))}
            </p>
          </div>
          
          <div className="bg-agro-dark p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Recompensas Pendentes</h3>
            <p className="text-2xl font-bold text-yellow-400">
              {validation.formatCurrency(pools.reduce((sum, pool) => sum + pool.userRewards, 0))}
            </p>
          </div>
          
          <div className="bg-agro-dark p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">APR Médio</h3>
            <p className="text-2xl font-bold text-purple-400">
              {validation.formatPercentage(pools.reduce((sum, pool) => sum + pool.apr, 0) / pools.length)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 