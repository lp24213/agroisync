'use client';

import React, { Suspense, useEffect, useState, useCallback, useMemo } from 'react';
import type { Metadata } from 'next';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeb3 } from '@/hooks/useWeb3';
import { useAuth } from '@/hooks/useAuth';
import { useDeFiPools } from '@/hooks/useDeFiPools';
import { PortfolioOverview } from '@/components/dashboard/PortfolioOverview';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { StakingOverview } from '@/components/dashboard/StakingOverview';
import { WalletConnectForm } from '@/components/forms/WalletConnectForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { validation } from '@/utils/validation';
import { formatCurrency, formatPercentage, formatAddress } from '@/utils/format';
import { toast } from '@/utils/toast';

// Metadata para SEO
export const metadata: Metadata = {
  title: 'Dashboard - AGROTM Solana',
  description: 'Gerencie seu portfólio DeFi, visualize staking, transações e estatísticas em tempo real na plataforma AGROTM Solana.',
  keywords: [
    'dashboard DeFi',
    'portfólio crypto',
    'staking Solana',
    'transações blockchain',
    'métricas DeFi'
  ],
  robots: {
    index: false, // Dashboard é área privada
    follow: false
  }
};

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

/**
 * Componente de loading para o dashboard
 */
function DashboardLoading() {
  return (
    <div className="min-h-screen bg-agro-darker flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-agro-light/60">Carregando dashboard...</p>
      </div>
    </div>
  );
}

/**
 * Componente de erro para o dashboard
 */
function DashboardError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-agro-darker flex items-center justify-center p-6"
    >
      <Card className="max-w-md w-full text-center">
        <div className="p-6">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-agro-light mb-2">Erro no Dashboard</h2>
          <p className="text-agro-light/60 mb-4">{error}</p>
          <Button onClick={onRetry} variant="primary" className="w-full">
            Tentar Novamente
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

/**
 * Página principal do dashboard
 * 
 * Funcionalidades:
 * - Proteção de rota (requer autenticação)
 * - Visão geral do portfólio
 * - Gerenciamento de staking
 * - Histórico de transações
 * - Estatísticas em tempo real
 * - Interface responsiva e animada
 */
export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { isConnected, publicKey, getBalance, disconnect } = useWeb3();
  const { pools, loading: poolsLoading, stakeInPool, unstakeFromPool, claimRewards, refreshPools } = useDeFiPools();
  
  // Estados locais
  const [balance, setBalance] = useState<string>('0');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [portfolioAssets, setPortfolioAssets] = useState<PortfolioAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Proteção de rota - redireciona se não autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  // Carregamento inicial dos dados
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isConnected || !publicKey) {
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        setIsLoading(true);

        // Carregar saldo da carteira
        const walletBalance = await getBalance(publicKey);
        setBalance(walletBalance);

        // Carregar dados do portfólio (mock data por enquanto)
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
            balance: parseFloat(walletBalance) || 0,
            price: 98.50,
            value: (parseFloat(walletBalance) || 0) * 98.50,
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

        // Carregar transações recentes (mock data)
        const mockTransactions: Transaction[] = [
          {
            id: '1',
            type: 'stake',
            amount: 100,
            token: 'AGRO',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            status: 'confirmed',
            hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          },
          {
            id: '2',
            type: 'claim',
            amount: 25.5,
            token: 'AGRO',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            status: 'confirmed',
            hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          },
          {
            id: '3',
            type: 'transfer',
            amount: 500,
            token: 'USDC',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            status: 'confirmed',
            hash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
          },
        ];
        setTransactions(mockTransactions);

      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
        setError('Falha ao carregar dados do dashboard. Tente novamente.');
        toast.error('Erro ao carregar dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [isConnected, publicKey, getBalance]);

  // Função para atualizar dados
  const handleRefresh = useCallback(async () => {
    if (!isConnected || !publicKey) return;

    try {
      setRefreshing(true);
      setError(null);

      await Promise.all([
        getBalance(publicKey).then(setBalance),
        refreshPools()
      ]);

      toast.success('Dados atualizados com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar dados:', err);
      setError('Falha ao atualizar dados.');
      toast.error('Erro ao atualizar dados');
    } finally {
      setRefreshing(false);
    }
  }, [isConnected, publicKey, getBalance, refreshPools]);

  // Handlers para ações de staking
  const handleStake = useCallback(async (poolId: string, amount: string) => {
    try {
      await stakeInPool(poolId, amount);
      toast.success('Stake realizado com sucesso!');
      await handleRefresh();
    } catch (error: any) {
      console.error('Erro ao fazer stake:', error);
      toast.error(`Erro ao fazer stake: ${error.message}`);
    }
  }, [stakeInPool, handleRefresh]);

  const handleUnstake = useCallback(async (poolId: string, amount: string) => {
    try {
      await unstakeFromPool(poolId, amount);
      toast.success('Unstake realizado com sucesso!');
      await handleRefresh();
    } catch (error: any) {
      console.error('Erro ao fazer unstake:', error);
      toast.error(`Erro ao fazer unstake: ${error.message}`);
    }
  }, [unstakeFromPool, handleRefresh]);

  const handleClaim = useCallback(async (poolId: string) => {
    try {
      await claimRewards(poolId);
      toast.success('Recompensas reivindicadas com sucesso!');
      await handleRefresh();
    } catch (error: any) {
      console.error('Erro ao reivindicar recompensas:', error);
      toast.error(`Erro ao reivindicar recompensas: ${error.message}`);
    }
  }, [claimRewards, handleRefresh]);

  // Cálculos memoizados para performance
  const totalPortfolioValue = useMemo(() => 
    portfolioAssets.reduce((sum, asset) => sum + asset.value, 0),
    [portfolioAssets]
  );
  
  const portfolioChange24h = useMemo(() => 
    portfolioAssets.reduce((sum, asset) => sum + (asset.value * asset.change24h / 100), 0),
    [portfolioAssets]
  );
  
  const totalStaked = useMemo(() => 
    pools.reduce((sum, pool) => sum + pool.userStaked, 0),
    [pools]
  );
  
  const totalRewards = useMemo(() => 
    pools.reduce((sum, pool) => sum + pool.userRewards, 0),
    [pools]
  );
  
  const averageAPR = useMemo(() => 
    pools.length > 0 ? pools.reduce((sum, pool) => sum + pool.apr, 0) / pools.length : 0,
    [pools]
  );

  // Estados de loading
  if (authLoading || isLoading) {
    return <DashboardLoading />;
  }

  // Estado de erro
  if (error) {
    return <DashboardError error={error} onRetry={handleRefresh} />;
  }

  // Não autenticado
  if (!isAuthenticated) {
    return <DashboardLoading />; // Vai redirecionar via useEffect
  }

  // Carteira não conectada
  if (!isConnected) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-agro-darker flex items-center justify-center p-6"
      >
        <Card className="max-w-md w-full">
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">🔗</div>
            <h2 className="text-xl font-bold text-agro-light mb-2">Conecte sua Carteira</h2>
            <p className="text-agro-light/60 mb-6">
              Para acessar o dashboard, você precisa conectar uma carteira Solana.
            </p>
            <WalletConnectForm 
              onConnect={() => handleRefresh()}
              showWalletSelection={true}
            />
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-agro-darker"
    >
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-agro-light mb-2">
                Dashboard
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-agro-light/60">
                <span>Carteira: {formatAddress(publicKey || '')}</span>
                <Badge variant="success" className="w-fit">
                  Conectado
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                disabled={refreshing || poolsLoading}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {refreshing ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <span>🔄</span>
                )}
                Atualizar
              </Button>
              
              <Button
                onClick={disconnect}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300"
              >
                Desconectar
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Suspense fallback={<LoadingSpinner size="md" />}>
            <PortfolioOverview
              totalValue={totalPortfolioValue}
              change24h={portfolioChange24h}
              assets={portfolioAssets}
            />
          </Suspense>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* Staking Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Suspense fallback={<LoadingSpinner size="md" />}>
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
                onStake={(poolId: string) => handleStake(poolId, '100')}
                onUnstake={(poolId: string) => handleUnstake(poolId, '50')}
                onClaim={handleClaim}
                loading={poolsLoading}
              />
            </Suspense>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Suspense fallback={<LoadingSpinner size="md" />}>
              <RecentTransactions transactions={transactions} />
            </Suspense>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          <Card className="p-4 lg:p-6 bg-gradient-to-br from-agro-primary/10 to-agro-primary/5 border-agro-primary/20">
            <h3 className="text-sm lg:text-base font-semibold text-agro-light mb-2">
              Saldo Total
            </h3>
            <p className="text-xl lg:text-2xl font-bold text-agro-primary">
              {formatCurrency(totalPortfolioValue)}
            </p>
            <p className="text-xs text-agro-light/60 mt-1">
              +{formatPercentage(portfolioChange24h / totalPortfolioValue * 100)} (24h)
            </p>
          </Card>
          
          <Card className="p-4 lg:p-6 bg-gradient-to-br from-agro-secondary/10 to-agro-secondary/5 border-agro-secondary/20">
            <h3 className="text-sm lg:text-base font-semibold text-agro-light mb-2">
              Staking Ativo
            </h3>
            <p className="text-xl lg:text-2xl font-bold text-agro-secondary">
              {formatCurrency(totalStaked)}
            </p>
            <p className="text-xs text-agro-light/60 mt-1">
              {pools.length} pool{pools.length !== 1 ? 's' : ''} ativo{pools.length !== 1 ? 's' : ''}
            </p>
          </Card>
          
          <Card className="p-4 lg:p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
            <h3 className="text-sm lg:text-base font-semibold text-agro-light mb-2">
              Recompensas Pendentes
            </h3>
            <p className="text-xl lg:text-2xl font-bold text-yellow-400">
              {formatCurrency(totalRewards)}
            </p>
            <p className="text-xs text-agro-light/60 mt-1">
              Pronto para reivindicar
            </p>
          </Card>
          
          <Card className="p-4 lg:p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <h3 className="text-sm lg:text-base font-semibold text-agro-light mb-2">
              APR Médio
            </h3>
            <p className="text-xl lg:text-2xl font-bold text-purple-400">
              {formatPercentage(averageAPR)}
            </p>
            <p className="text-xs text-agro-light/60 mt-1">
              Rendimento anual
            </p>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}