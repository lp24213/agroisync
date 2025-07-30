'use client';

import React, { Suspense, useEffect, useState, useCallback, useMemo } from 'react';
import type { Metadata } from 'next';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeb3 } from '@/hooks/useWeb3';
import { useAuth } from '@/hooks/useAuth';
import { useDeFiPools } from '@/hooks/useDeFiPools';
import { StakingForm } from '@/components/forms/StakingForm';
import { WalletConnectForm } from '@/components/forms/WalletConnectForm';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { validation } from '@/utils/validation';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/format';
import { toast } from '@/utils/toast';

// Metadata para SEO
export const metadata: Metadata = {
  title: 'Staking - AGROTM Solana',
  description: 'Faça staking de tokens AGRO e ganhe recompensas sustentáveis. Pools verificados com APRs competitivos na blockchain Solana.',
  keywords: [
    'staking AGRO',
    'yield farming',
    'DeFi staking',
    'Solana staking',
    'agricultura sustentável',
    'recompensas crypto'
  ],
  openGraph: {
    title: 'Staking - AGROTM Solana',
    description: 'Faça staking de tokens AGRO e ganhe recompensas sustentáveis. Pools verificados com APRs competitivos.',
    type: 'website',
    images: [
      {
        url: '/assets/img/staking-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROTM Staking Platform'
      }
    ]
  }
};

// Tipos para filtros e ordenação
type SortOption = 'apr' | 'tvl' | 'name' | 'rewards';
type FilterOption = 'all' | 'active' | 'verified' | 'low-risk' | 'medium-risk' | 'high-risk';

interface StakingFilters {
  search: string;
  sort: SortOption;
  filter: FilterOption;
  minAPR: number;
  maxAPR: number;
}

/**
 * Componente de loading para a página de staking
 */
function StakingLoading() {
  return (
    <div className="min-h-screen bg-agro-darker flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-agro-light/60">Carregando pools de staking...</p>
      </div>
    </div>
  );
}

/**
 * Componente de erro para a página de staking
 */
function StakingError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-agro-darker flex items-center justify-center p-6"
    >
      <Card className="max-w-md w-full text-center">
        <div className="p-6">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-agro-light mb-2">Erro no Staking</h2>
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
 * Página principal de staking
 * 
 * Funcionalidades:
 * - Visualização de pools de staking
 * - Filtros e ordenação avançados
 * - Formulário de staking integrado
 * - Estatísticas em tempo real
 * - Interface responsiva e animada
 */
export default function StakingPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isConnected, publicKey, disconnect } = useWeb3();
  const { pools, loading: poolsLoading, stakeInPool, unstakeFromPool, claimRewards, refreshPools } = useDeFiPools();
  
  // Estados locais
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para filtros
  const [filters, setFilters] = useState<StakingFilters>({
    search: '',
    sort: 'apr',
    filter: 'all',
    minAPR: 0,
    maxAPR: 1000
  });
  
  // Proteção de rota
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/staking');
    }
  }, [authLoading, isAuthenticated, router]);
  
  // Carregamento inicial
  useEffect(() => {
    const loadStakingData = async () => {
      try {
        setError(null);
        setIsLoading(true);
        // Dados já carregados pelo hook useDeFiPools
      } catch (err) {
        console.error('Erro ao carregar dados de staking:', err);
        setError('Falha ao carregar pools de staking.');
        toast.error('Erro ao carregar staking');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStakingData();
  }, []);
  
  // Função para atualizar dados
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      await refreshPools();
      toast.success('Dados atualizados com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar dados:', err);
      setError('Falha ao atualizar dados.');
      toast.error('Erro ao atualizar dados');
    } finally {
      setRefreshing(false);
    }
  }, [refreshPools]);
  
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
  
  // Filtrar e ordenar pools
  const filteredPools = useMemo(() => {
    let filtered = pools.filter(pool => {
      // Filtro de busca
      if (filters.search && !pool.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Filtro de categoria
      switch (filters.filter) {
        case 'active':
          return pool.isActive;
        case 'verified':
          return pool.isVerified;
        case 'low-risk':
          return pool.riskLevel === 'Low';
        case 'medium-risk':
          return pool.riskLevel === 'Medium';
        case 'high-risk':
          return pool.riskLevel === 'High';
        default:
          return true;
      }
    });
    
    // Filtro de APR
    filtered = filtered.filter(pool => 
      pool.apr >= filters.minAPR && pool.apr <= filters.maxAPR
    );
    
    // Ordenação
    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'apr':
          return b.apr - a.apr;
        case 'tvl':
          return b.tvl - a.tvl;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rewards':
          return b.userRewards - a.userRewards;
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [pools, filters]);
  
  // Estatísticas calculadas
  const stats = useMemo(() => {
    const totalTVL = pools.reduce((sum, pool) => sum + pool.tvl, 0);
    const averageAPR = pools.length > 0 ? pools.reduce((sum, pool) => sum + pool.apr, 0) / pools.length : 0;
    const activePools = pools.filter(pool => pool.isActive).length;
    const totalUserStaked = pools.reduce((sum, pool) => sum + pool.userStaked, 0);
    const totalUserRewards = pools.reduce((sum, pool) => sum + pool.userRewards, 0);
    
    return {
      totalTVL,
      averageAPR,
      activePools,
      totalUserStaked,
      totalUserRewards
    };
  }, [pools]);
  
  // Estados de loading
  if (authLoading || isLoading) {
    return <StakingLoading />;
  }
  
  // Estado de erro
  if (error) {
    return <StakingError error={error} onRetry={handleRefresh} />;
  }
  
  // Não autenticado
  if (!isAuthenticated) {
    return <StakingLoading />; // Vai redirecionar via useEffect
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
              Para fazer staking, você precisa conectar uma carteira Solana.
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
        {/* Header com estatísticas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-agro-light mb-2">
                Staking Pools
              </h1>
              <p className="text-agro-light/60 text-lg">
                Faça stake dos seus tokens e ganhe recompensas passivas
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                className="flex items-center gap-2"
              >
                {refreshing ? <LoadingSpinner size="sm" /> : '🔄'}
                Atualizar
              </Button>
              {isConnected && (
                <Badge variant="success" className="flex items-center gap-2">
                  🟢 Conectado
                </Badge>
              )}
            </div>
          </div>
          
          {/* Estatísticas principais */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-agro-primary">
                  {formatCurrency(stats.totalTVL)}
                </div>
                <div className="text-sm text-agro-light/60">TVL Total</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {formatPercentage(stats.averageAPR)}
                </div>
                <div className="text-sm text-agro-light/60">APR Médio</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-agro-light">
                  {stats.activePools}
                </div>
                <div className="text-sm text-agro-light/60">Pools Ativos</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {formatCurrency(stats.totalUserStaked)}
                </div>
                <div className="text-sm text-agro-light/60">Seu Stake</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {formatCurrency(stats.totalUserRewards)}
                </div>
                <div className="text-sm text-agro-light/60">Recompensas</div>
              </div>
            </Card>
          </div>
        </motion.div>
        
        {/* Filtros e busca */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-agro-light mb-2">
                  Buscar Pool
                </label>
                <Input
                  type="text"
                  placeholder="Nome do pool..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-agro-light mb-2">
                  Ordenar por
                </label>
                <Select
                  value={filters.sort}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value as SortOption }))}
                >
                  <option value="apr">APR (Maior)</option>
                  <option value="tvl">TVL (Maior)</option>
                  <option value="name">Nome (A-Z)</option>
                  <option value="rewards">Recompensas</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-agro-light mb-2">
                  Filtrar por
                </label>
                <Select
                  value={filters.filter}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, filter: value as FilterOption }))}
                >
                  <option value="all">Todos</option>
                  <option value="active">Ativos</option>
                  <option value="verified">Verificados</option>
                  <option value="low-risk">Baixo Risco</option>
                  <option value="medium-risk">Médio Risco</option>
                  <option value="high-risk">Alto Risco</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-agro-light mb-2">
                  APR Mínimo (%)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minAPR}
                  onChange={(e) => setFilters(prev => ({ ...prev, minAPR: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Lista de pools */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {poolsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-4 bg-agro-light/20 rounded mb-4"></div>
                  <div className="h-8 bg-agro-light/20 rounded mb-2"></div>
                  <div className="h-4 bg-agro-light/20 rounded mb-4"></div>
                  <div className="h-10 bg-agro-light/20 rounded"></div>
                </Card>
              ))}
            </div>
          ) : filteredPools.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-agro-light mb-2">
                Nenhum pool encontrado
              </h3>
              <p className="text-agro-light/60 mb-4">
                Tente ajustar os filtros ou buscar por outro termo.
              </p>
              <Button 
                onClick={() => setFilters({
                  search: '',
                  sort: 'apr',
                  filter: 'all',
                  minAPR: 0,
                  maxAPR: 1000
                })}
                variant="outline"
              >
                Limpar Filtros
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredPools.map((pool, index) => (
                  <motion.div
                    key={pool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-all duration-300 group">
                      {/* Header do pool */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-agro-light group-hover:text-agro-primary transition-colors">
                            {pool.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant={pool.isActive ? 'success' : 'error'}
                              className="text-xs"
                            >
                              {pool.isActive ? 'Ativo' : 'Inativo'}
                            </Badge>
                            {pool.isVerified && (
                              <Badge variant="info" className="text-xs">
                                ✓ Verificado
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-agro-primary">
                            {formatPercentage(pool.apr)}
                          </div>
                          <div className="text-xs text-agro-light/60">APR</div>
                        </div>
                      </div>
                      
                      {/* Estatísticas do pool */}
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-agro-light/60">TVL:</span>
                          <span className="text-agro-light font-medium">
                            {formatCurrency(pool.tvl)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-agro-light/60">Seu Stake:</span>
                          <span className="text-blue-400 font-medium">
                            {formatCurrency(pool.userStaked)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-agro-light/60">Recompensas:</span>
                          <span className="text-yellow-400 font-medium">
                            {formatCurrency(pool.userRewards)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-agro-light/60">Lock Period:</span>
                          <span className="text-agro-light">
                            {pool.lockPeriod} dias
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-agro-light/60">Risco:</span>
                          <Badge 
                            variant={
                              pool.riskLevel === 'Low' ? 'success' :
                              pool.riskLevel === 'Medium' ? 'warning' : 'error'
                            }
                            className="text-xs"
                          >
                            {pool.riskLevel}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Ações */}
                      <div className="space-y-2">
                        <Button 
                          onClick={() => setSelectedPool(pool.id)}
                          variant="primary"
                          className="w-full"
                          disabled={!pool.isActive}
                        >
                          {selectedPool === pool.id ? 'Selecionado' : 'Fazer Stake'}
                        </Button>
                        
                        {pool.userStaked > 0 && (
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              onClick={() => handleUnstake(pool.id, pool.userStaked.toString())}
                              variant="outline"
                              className="text-red-400 border-red-400 hover:bg-red-400/10"
                            >
                              Unstake
                            </Button>
                            <Button 
                              onClick={() => handleClaim(pool.id)}
                              variant="outline"
                              className="text-green-400 border-green-400 hover:bg-green-400/10"
                              disabled={pool.userRewards === 0}
                            >
                              Claim
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
        
        {/* Formulário de staking (se pool selecionado) */}
        <AnimatePresence>
          {selectedPool && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <Suspense fallback={<LoadingSpinner />}>
                <StakingForm 
                  selectedPool={selectedPool}
                  onStake={handleStake}
                  onClose={() => setSelectedPool(null)}
                />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}