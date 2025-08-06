'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Download,
  RefreshCw,
  Shield,
  Star,
  Wallet,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const portfolioData = {
  totalValue: 'R$ 124.567,89',
  change24h: '+12,5%',
  isPositive: true,
  assets: [
    {
      name: 'AGROTM',
      value: 'R$ 45.234,56',
      percentage: 36.3,
      change: '+8,2%',
      color: 'from-[#00F0FF] to-[#00d4e0]',
    },
    {
      name: 'SOL',
      value: 'R$ 32.123,45',
      percentage: 25.8,
      change: '+15,7%',
      color: 'from-[#00F0FF] to-[#00d4e0]',
    },
    {
      name: 'USDC',
      value: 'R$ 28.456,78',
      percentage: 22.9,
      change: '+0,1%',
      color: 'from-[#00F0FF] to-[#00d4e0]',
    },
    {
      name: 'ETH',
      value: 'R$ 18.753,10',
      percentage: 15.0,
      change: '+5,3%',
      color: 'from-[#00F0FF] to-[#00d4e0]',
    },
  ],
};

const recentTransactions = [
  { type: 'Stake', amount: '+1.000 AGROTM', time: '2 min atrás', status: 'success' },
  { type: 'Farm', amount: '+500 SOL', time: '15 min atrás', status: 'success' },
  { type: 'Swap', amount: '-2.000 USDC', time: '1 hora atrás', status: 'success' },
  { type: 'Harvest', amount: '+150 AGROTM', time: '3 horas atrás', status: 'success' },
  { type: 'Unstake', amount: '-500 AGROTM', time: '1 dia atrás', status: 'pending' },
];

const farmingPools = [
  { name: 'AGROTM-SOL LP', apy: '156,7%', tvl: 'R$ 2,4M', staked: 'R$ 12.345', rewards: '234 AGROTM' },
  { name: 'AGROTM-USDC LP', apy: '89,2%', tvl: 'R$ 1,8M', staked: 'R$ 8.901', rewards: '156 AGROTM' },
  { name: 'SOL-USDC LP', apy: '45,3%', tvl: 'R$ 3,2M', staked: 'R$ 5.678', rewards: '89 SOL' },
];

export default function DashboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7D');

  const timeframes = ['1H', '24H', '7D', '30D', '1Y', 'TUDO'];

  useEffect(() => {
    // Loading simulation removed for now
    // setIsLoading(true);
    // const timer = setTimeout(() => setIsLoading(false), 1000);
    // return () => clearTimeout(timer);
  }, [selectedTimeframe]);

  return (
    <div className='min-h-screen bg-[#000000] pt-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='font-orbitron text-4xl md:text-5xl text-[#00F0FF] mb-4 animate-fadeIn'
          >
            Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='text-lg md:text-xl text-[#cccccc] leading-relaxed'
          >
            Bem-vindo de volta! Aqui está a visão geral do seu portfólio.
          </motion.p>
        </div>

        {/* Portfolio Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'
        >
          {/* Total Portfolio Value */}
          <div className='lg:col-span-2 bg-black/70 border border-[#00F0FF]/20 backdrop-blur-xl rounded-2xl p-6 hover:shadow-neon'>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h3 className='text-lg font-orbitron font-semibold text-[#ffffff] mb-1'>Valor do Portfólio</h3>
                <div className='flex items-center space-x-2'>
                  <span className='text-3xl font-orbitron font-bold text-[#ffffff]'>{portfolioData.totalValue}</span>
                  <div className='flex items-center space-x-1'>
                    {portfolioData.isPositive ? (
                      <ArrowUpRight className='w-4 h-4 text-[#00F0FF]' />
                    ) : (
                      <ArrowDownRight className='w-4 h-4 text-[#00F0FF]' />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        portfolioData.isPositive ? 'text-[#00F0FF]' : 'text-[#00F0FF]'
                      }`}
                    >
                      {portfolioData.change24h}
                    </span>
                  </div>
                </div>
              </div>
              <div className='w-16 h-16 bg-[#00F0FF]/20 rounded-2xl flex items-center justify-center'>
                <DollarSign className='w-8 h-8 text-[#00F0FF]' />
              </div>
            </div>

            {/* Asset Distribution Chart */}
            <div className='h-32 flex items-end space-x-2'>
              {portfolioData.assets.map(asset => (
                <div
                  key={asset.name}
                  className='flex-1 bg-[#00F0FF]/30 rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer'
                  style={{ height: `${asset.percentage}%` }}
                />
              ))}
            </div>

            {/* Asset List */}
            <div className='mt-4 space-y-2'>
              {portfolioData.assets.map(asset => (
                <div key={asset.name} className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className={`w-3 h-3 bg-[#00F0FF] rounded-full`} />
                    <span className='text-sm text-[#cccccc]'>{asset.name}</span>
                  </div>
                  <div className='text-right'>
                    <div className='text-sm font-medium text-[#ffffff]'>{asset.value}</div>
                    <div className='text-xs text-[#00F0FF]'>{asset.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className='bg-black/70 border border-[#00F0FF]/20 backdrop-blur-xl rounded-2xl p-6 hover:shadow-neon'>
            <h3 className='text-lg font-orbitron font-semibold text-[#ffffff] mb-6'>Ações Rápidas</h3>
            <div className='space-y-4'>
              <button className='w-full flex items-center justify-between p-4 bg-[#00F0FF]/20 border border-[#00F0FF]/30 rounded-xl hover:bg-[#00F0FF]/30 transition-all duration-300'>
                <div className='flex items-center space-x-3'>
                  <Wallet className='w-5 h-5 text-[#00F0FF]' />
                  <span className='text-[#ffffff] font-medium'>Conectar Carteira</span>
                </div>
                <ArrowUpRight className='w-4 h-4 text-[#00F0FF]' />
              </button>

              <button className='w-full flex items-center justify-between p-4 bg-black/50 border border-[#00F0FF]/20 rounded-xl hover:bg-[#00F0FF]/10 transition-all duration-300'>
                <div className='flex items-center space-x-3'>
                  <Star className='w-5 h-5 text-[#00F0FF]' />
                  <span className='text-[#ffffff] font-medium'>Iniciar Farming</span>
                </div>
                <ArrowUpRight className='w-4 h-4 text-[#00F0FF]' />
              </button>

              <button className='w-full flex items-center justify-between p-4 bg-black/50 border border-[#00F0FF]/20 rounded-xl hover:bg-[#00F0FF]/10 transition-all duration-300'>
                <div className='flex items-center space-x-3'>
                  <Shield className='w-5 h-5 text-[#00F0FF]' />
                  <span className='text-[#ffffff] font-medium'>Stake de Tokens</span>
                </div>
                <ArrowUpRight className='w-4 h-4 text-[#00F0FF]' />
              </button>

              <button className='w-full flex items-center justify-between p-4 bg-black/50 border border-[#00F0FF]/20 rounded-xl hover:bg-[#00F0FF]/10 transition-all duration-300'>
                <div className='flex items-center space-x-3'>
                  <Zap className='w-5 h-5 text-[#00F0FF]' />
                  <span className='text-[#ffffff] font-medium'>Trocar Tokens</span>
                </div>
                <ArrowUpRight className='w-4 h-4 text-[#00F0FF]' />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'
        >
          {/* Performance Chart */}
          <div className='bg-black/70 border border-[#00F0FF]/20 backdrop-blur-xl rounded-2xl p-6 hover:shadow-neon'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-lg font-orbitron font-semibold text-[#ffffff]'>Performance do Portfólio</h3>
              <div className='flex items-center space-x-2'>
                {timeframes.map(timeframe => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedTimeframe === timeframe
                        ? 'bg-[#00F0FF] text-black'
                        : 'text-[#cccccc] hover:text-[#ffffff] hover:bg-[#00F0FF]/10'
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>

            <div className='h-64 flex items-end space-x-2'>
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className='flex-1 bg-[#00F0FF] rounded-t transition-all duration-300 hover:opacity-80'
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                />
              ))}
            </div>
          </div>

          {/* Farming Pools */}
          <div className='bg-black/70 border border-[#00F0FF]/20 backdrop-blur-xl rounded-2xl p-6 hover:shadow-neon'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-lg font-orbitron font-semibold text-[#ffffff]'>Farms Ativos</h3>
              <button className='p-2 bg-[#00F0FF]/10 rounded-lg hover:bg-[#00F0FF]/20 transition-colors duration-300'>
                <RefreshCw className='w-4 h-4 text-[#00F0FF]' />
              </button>
            </div>

            <div className='space-y-4'>
              {farmingPools.map(pool => (
                <div key={pool.name} className='p-4 bg-black/50 rounded-xl border border-[#00F0FF]/20'>
                  <div className='flex items-center justify-between mb-3'>
                    <h4 className='font-orbitron font-semibold text-[#ffffff]'>{pool.name}</h4>
                    <span className='text-[#00F0FF] font-bold'>{pool.apy}</span>
                  </div>
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <span className='text-[#cccccc]'>TVL:</span>
                      <span className='text-[#ffffff] ml-2'>{pool.tvl}</span>
                    </div>
                    <div>
                      <span className='text-[#cccccc]'>Staked:</span>
                      <span className='text-[#ffffff] ml-2'>{pool.staked}</span>
                    </div>
                  </div>
                  <div className='mt-3 pt-3 border-t border-[#00F0FF]/20'>
                    <span className='text-[#cccccc] text-sm'>Recompensas:</span>
                    <span className='text-[#00F0FF] ml-2 font-medium'>{pool.rewards}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='bg-black/70 border border-[#00F0FF]/20 backdrop-blur-xl rounded-2xl p-6 hover:shadow-neon'
        >
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-orbitron font-semibold text-[#ffffff]'>Transações Recentes</h3>
            <button className='flex items-center space-x-2 px-4 py-2 bg-[#00F0FF]/10 rounded-lg hover:bg-[#00F0FF]/20 transition-colors duration-300'>
              <Download className='w-4 h-4 text-[#00F0FF]' />
              <span className='text-sm text-[#00F0FF]'>Exportar</span>
            </button>
          </div>

          <div className='space-y-3'>
            {recentTransactions.map((transaction, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-4 bg-black/50 rounded-xl border border-[#00F0FF]/20'
              >
                <div className='flex items-center space-x-4'>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      transaction.status === 'success' ? 'bg-[#00F0FF]/20' : 'bg-[#00F0FF]/20'
                    }`}
                  >
                    <Activity
                      className={`w-5 h-5 ${
                        transaction.status === 'success' ? 'text-[#00F0FF]' : 'text-[#00F0FF]'
                      }`}
                    />
                  </div>
                  <div>
                    <div className='font-medium text-[#ffffff]'>{transaction.type}</div>
                    <div className='text-sm text-[#cccccc]'>{transaction.time}</div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-medium text-[#ffffff]'>{transaction.amount}</div>
                  <div
                    className={`text-sm ${
                      transaction.status === 'success' ? 'text-[#00F0FF]' : 'text-[#00F0FF]'
                    }`}
                  >
                    {transaction.status === 'success' ? 'Sucesso' : 'Pendente'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
