'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, Zap, ArrowRight, Star, Shield, Clock, BarChart3 } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';

const tokens = [
  {
    symbol: 'AGROTM',
    name: 'AgroTM Token',
    apy: 12.5,
    tvl: 2500000,
    color: '#00FF7F',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    apy: 8.2,
    tvl: 1800000,
    color: '#00FF7F',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    apy: 5.8,
    tvl: 1200000,
    color: '#00FF7F',
  },
];

const stakingPools = [
  {
    id: 1,
    name: 'AGROTM Staking Pool',
    token: 'AGROTM',
    apy: 12.5,
    tvl: 2500000,
    minStake: 100,
    maxStake: 100000,
    lockPeriod: 30,
    rewards: 'AGROTM',
    color: '#00FF7F',
  },
  {
    id: 2,
    name: 'SOL Staking Pool',
    token: 'SOL',
    apy: 8.2,
    tvl: 1800000,
    minStake: 10,
    maxStake: 50000,
    lockPeriod: 7,
    rewards: 'SOL',
    color: '#00FF7F',
  },
  {
    id: 3,
    name: 'USDC Staking Pool',
    token: 'USDC',
    apy: 5.8,
    tvl: 1200000,
    minStake: 1000,
    maxStake: 1000000,
    lockPeriod: 0,
    rewards: 'USDC',
    color: '#00FF7F',
  },
];

export default function StakingPage() {
  const [selectedPool, setSelectedPool] = useState(stakingPools[0]);
  const [showStakingForm, setShowStakingForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [hoveredPool, setHoveredPool] = useState<number | null>(null);
  const [animatedStats, setAnimatedStats] = useState({
    tvl: 0,
    apy: 0,
    stakers: 0,
  });

  const totalValueLocked = stakingPools.reduce((sum, pool) => sum + pool.tvl, 0);
  const averageApy = stakingPools.reduce((sum, pool) => sum + pool.apy, 0) / stakingPools.length;
  const totalParticipants = stakingPools.reduce((sum, pool) => sum + pool.tvl / pool.minStake, 0); // Simplified for animation

  // Animate stats on load
  useEffect(() => {
    const animationDuration = 2000; // 2 seconds
    const steps = 60; // 60 steps (for smooth animation)
    const interval = animationDuration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        tvl: Math.floor((totalValueLocked / 1000000) * progress * 10) / 10,
        apy: Math.floor(averageApy * progress * 10) / 10,
        stakers: Math.floor(totalParticipants * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [totalValueLocked, averageApy, totalParticipants]);

  const filteredPools =
    activeTab === 'all'
      ? stakingPools
      : stakingPools.filter(pool => {
          if (activeTab === 'low') return pool.apy < 10; // Simplified risk filter
          if (activeTab === 'medium') return pool.apy >= 10 && pool.apy < 15;
          if (activeTab === 'high') return pool.apy >= 15;
          return true;
        });

  return (
    <Layout>
      <div className='min-h-screen bg-[#000000] overflow-hidden relative'>
      {/* Background grid animation */}
      <div className='absolute inset-0 z-0 opacity-10'>
        <div className='grid-animation'></div>
      </div>

      {/* Animated orbs */}
      <motion.div
        className='absolute top-1/4 -left-20 w-40 h-40 rounded-full bg-[#00FF7F]/20 blur-xl z-0'
        animate={{
          x: [0, 30, 0],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className='absolute bottom-1/4 -right-20 w-40 h-40 rounded-full bg-[#00FF7F]/20 blur-xl z-0'
        animate={{
          x: [0, -30, 0],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: 'easeInOut',
        }}
      />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-12'
        >
          <h1 className='font-orbitron text-4xl md:text-5xl text-[#00FF7F] mb-4 animate-fadeIn'>
            Pools de Staking
          </h1>
          <p className='text-lg md:text-xl text-[#cccccc] leading-relaxed max-w-3xl mx-auto'>
            Ganhe renda passiva fazendo stake dos seus tokens em nossos pools seguros e de alta rentabilidade
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'
        >
          <motion.div
            className='bg-black/70 border border-[#00FF7F]/20 p-0.5 rounded-lg overflow-hidden hover:shadow-neon'
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <div className='text-center bg-black/90 backdrop-blur-md p-6 rounded-lg'>
              <TrendingUp className='h-8 w-8 text-[#00FF7F] mx-auto mb-3' />
              <p className='text-2xl font-orbitron font-bold text-[#ffffff]'>R$ {animatedStats.tvl.toFixed(1)}M</p>
              <p className='text-[#cccccc]'>Valor Total Bloqueado</p>
            </div>
          </motion.div>

          <motion.div
            className='bg-black/70 border border-[#00FF7F]/20 p-0.5 rounded-lg overflow-hidden hover:shadow-neon'
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <div className='text-center bg-black/90 backdrop-blur-md p-6 rounded-lg'>
              <Zap className='h-8 w-8 text-[#00FF7F] mx-auto mb-3' />
              <p className='text-2xl font-orbitron font-bold text-[#ffffff]'>{animatedStats.apy.toFixed(1)}%</p>
              <p className='text-[#cccccc]'>APY Médio</p>
            </div>
          </motion.div>

          <motion.div
            className='bg-black/70 border border-[#00FF7F]/20 p-0.5 rounded-lg overflow-hidden hover:shadow-neon'
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <div className='text-center bg-black/90 backdrop-blur-md p-6 rounded-lg'>
              <Users className='h-8 w-8 text-[#00FF7F] mx-auto mb-3' />
              <p className='text-2xl font-orbitron font-bold text-[#ffffff]'>
                {animatedStats.stakers.toLocaleString()}
              </p>
              <p className='text-[#cccccc]'>Stakers Ativos</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='flex justify-center mb-8 space-x-4'
        >
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full transition-all ${activeTab === 'all' ? 'bg-[#00FF7F] text-black' : 'bg-black/50 text-[#cccccc] hover:bg-black'}`}
          >
            Todos os Pools
          </button>
          <button
            onClick={() => setActiveTab('low')}
            className={`px-4 py-2 rounded-full transition-all ${activeTab === 'low' ? 'bg-[#00FF7F] text-black' : 'bg-black/50 text-[#cccccc] hover:bg-black'}`}
          >
            Baixo Risco
          </button>
          <button
            onClick={() => setActiveTab('medium')}
            className={`px-4 py-2 rounded-full transition-all ${activeTab === 'medium' ? 'bg-[#00FF7F] text-black' : 'bg-black/50 text-[#cccccc] hover:bg-black'}`}
          >
            Médio Risco
          </button>
          <button
            onClick={() => setActiveTab('high')}
            className={`px-4 py-2 rounded-full transition-all ${activeTab === 'high' ? 'bg-[#00FF7F] text-black' : 'bg-black/50 text-[#cccccc] hover:bg-black'}`}
          >
            Alto Risco
          </button>
        </motion.div>

        {/* Staking Pools Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {filteredPools.map((pool, index) => (
            <motion.div
              key={pool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className='relative'
              onMouseEnter={() => setHoveredPool(pool.id as number)}
              onMouseLeave={() => setHoveredPool(null)}
            >
              <div className='bg-black/70 border border-[#00FF7F]/20 p-0.5 rounded-lg overflow-hidden hover:shadow-neon'>
                <div className='bg-black/90 backdrop-blur-md p-6 rounded-lg relative overflow-hidden'>
                  {/* Animated background */}
                  <div
                    className='absolute inset-0 opacity-10 z-0'
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${pool.color}50, transparent 70%)`,
                    }}
                  ></div>

                  {/* Pool Header */}
                  <div className='flex items-center justify-between mb-4 relative z-10'>
                    <div className='flex items-center space-x-3'>
                      <div
                        className='w-10 h-10 rounded-lg flex items-center justify-center text-black font-bold'
                        style={{
                          backgroundColor: `${pool.color}`,
                          boxShadow: `0 0 10px ${pool.color}50`,
                        }}
                      >
                        {pool.token.charAt(0)}
                      </div>
                      <div>
                        <h3 className='text-lg font-orbitron font-semibold text-[#ffffff]'>{pool.name}</h3>
                        <p className='text-sm text-[#cccccc]'>Token {pool.token}</p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-2xl font-orbitron font-bold text-[#00FF7F]'>
                        {pool.apy}%
                      </p>
                      <p className='text-sm text-[#cccccc]'>APY</p>
                    </div>
                  </div>

                  {/* Pool Description */}
                  <p className='text-[#cccccc] mb-4 relative z-10'>{pool.name} Staking Pool</p>

                  {/* Pool Stats */}
                  <div className='grid grid-cols-2 gap-4 mb-6 relative z-10'>
                    <div className='bg-black/30 p-3 rounded-lg'>
                      <div className='flex items-center space-x-2'>
                        <BarChart3 className='h-4 w-4 text-[#00FF7F]' />
                        <p className='text-sm text-[#cccccc]'>Total Staked</p>
                      </div>
                      <p className='text-lg font-orbitron font-semibold text-[#ffffff] mt-1'>
                        R$ {(pool.tvl / 1000000).toFixed(0)}M
                      </p>
                    </div>
                    <div className='bg-black/30 p-3 rounded-lg'>
                      <div className='flex items-center space-x-2'>
                        <Users className='h-4 w-4 text-[#00FF7F]' />
                        <p className='text-sm text-[#cccccc]'>Participantes</p>
                      </div>
                      <p className='text-lg font-orbitron font-semibold text-[#ffffff] mt-1'>
                        {(pool.tvl / pool.minStake).toLocaleString()}
                      </p>
                    </div>
                    <div className='bg-black/30 p-3 rounded-lg'>
                      <div className='flex items-center space-x-2'>
                        <Zap className='h-4 w-4 text-[#00FF7F]' />
                        <p className='text-sm text-[#cccccc]'>Min Stake</p>
                      </div>
                      <p className='text-lg font-orbitron font-semibold text-[#ffffff] mt-1'>
                        {pool.minStake} {pool.token}
                      </p>
                    </div>
                    <div className='bg-black/30 p-3 rounded-lg'>
                      <div className='flex items-center space-x-2'>
                        <Clock className='h-4 w-4 text-[#00FF7F]' />
                        <p className='text-sm text-[#cccccc]'>Período de Lock</p>
                      </div>
                      <p className='text-lg font-orbitron font-semibold text-[#ffffff] mt-1'>{pool.lockPeriod} dias</p>
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div className='flex items-center justify-between mb-4 relative z-10'>
                    <span className='text-sm text-[#cccccc]'>Nível de Risco</span>
                    <div className='flex items-center space-x-1'>
                      {pool.apy < 10 && (
                        <div className='px-3 py-1 bg-[#00FF7F]/20 text-[#00FF7F] rounded-full flex items-center'>
                          <Shield className='h-4 w-4 mr-1' />
                          <span className='text-sm font-medium'>Baixo</span>
                        </div>
                      )}
                      {pool.apy >= 10 && pool.apy < 15 && (
                        <div className='px-3 py-1 bg-[#00FF7F]/20 text-[#00FF7F] rounded-full flex items-center'>
                          <Star className='h-4 w-4 mr-1' />
                          <span className='text-sm font-medium'>Médio</span>
                        </div>
                      )}
                      {pool.apy >= 15 && (
                        <div className='px-3 py-1 bg-[#00FF7F]/20 text-[#00FF7F] rounded-full flex items-center'>
                          <Zap className='h-4 w-4 mr-1' />
                          <span className='text-sm font-medium'>Alto</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className='mb-6 relative z-10'>
                    <p className='text-sm text-[#cccccc] mb-2'>Recursos</p>
                    <div className='space-y-1'>
                      <div className='flex items-center space-x-2'>
                        <div
                          className='w-1.5 h-1.5 rounded-full'
                          style={{ backgroundColor: pool.color }}
                        />
                        <span className='text-sm text-[#cccccc]'>Auto-compounding</span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <div
                          className='w-1.5 h-1.5 rounded-full'
                          style={{ backgroundColor: pool.color }}
                        />
                        <span className='text-sm text-[#cccccc]'>Recompensas instantâneas</span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <div
                          className='w-1.5 h-1.5 rounded-full'
                          style={{ backgroundColor: pool.color }}
                        />
                        <span className='text-sm text-[#cccccc]'>Unstaking flexível</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    onClick={() => {
                      setSelectedPool(pool);
                      setShowStakingForm(true);
                    }}
                    className='w-full group relative overflow-hidden bg-[#00FF7F] text-black px-6 py-3 rounded-xl hover:shadow-neon transition-all'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className='relative z-10 flex items-center justify-center font-medium'>
                      Fazer Stake Agora
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Floating animation when hovered */}
              <AnimatePresence>
                {hoveredPool === pool.id && (
                  <motion.div
                    className='absolute -inset-0.5 rounded-lg z-0'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className='absolute inset-0 rounded-lg'
                      style={{
                        background: `linear-gradient(45deg, ${pool.color}00, ${pool.color}40, ${pool.color}00)`,
                        filter: 'blur(8px)',
                        animation: 'pulse-glow 2s infinite',
                      }}
                    ></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Staking Form Modal */}
        <AnimatePresence>
          {showStakingForm && (
            <motion.div
              className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStakingForm(false)}
            >
              <motion.div
                className='w-full max-w-lg'
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <div className='bg-black/70 border border-[#00FF7F]/20 p-0.5 rounded-lg overflow-hidden'>
                  <div className='bg-black p-6 rounded-lg'>
                    <div className='flex justify-between items-center mb-6'>
                      <h2 className='text-2xl font-orbitron font-bold text-[#ffffff]'>Stake {selectedPool.token}</h2>
                      <button
                        onClick={() => setShowStakingForm(false)}
                        className='text-[#cccccc] hover:text-[#ffffff] transition-colors'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-6 w-6'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Placeholder for StakingForm component */}
                    <div className='p-4 bg-black/50 rounded-lg mb-4'>
                      <div className='flex items-center justify-between mb-4'>
                        <div>
                          <p className='text-[#cccccc] text-sm'>Pool</p>
                          <p className='text-[#ffffff] font-orbitron font-semibold'>{selectedPool.name}</p>
                        </div>
                        <div className='text-right'>
                          <p className='text-[#cccccc] text-sm'>APY</p>
                          <p className='text-[#00FF7F] font-orbitron font-bold'>{selectedPool.apy}%</p>
                        </div>
                      </div>

                      <div className='mb-4'>
                        <label className='block text-sm font-medium text-[#cccccc] mb-2'>
                          Quantidade para Stake
                        </label>
                        <div className='relative'>
                          <input
                            type='number'
                            className='w-full p-3 bg-black border border-[#00FF7F]/20 rounded-lg text-[#ffffff] placeholder-[#cccccc] focus:outline-none focus:ring-2 focus:ring-[#00FF7F] transition-colors'
                            placeholder='0.00'
                          />
                          <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
                            <span className='text-[#cccccc]'>{selectedPool.token}</span>
                          </div>
                        </div>
                        <p className='mt-1 text-sm text-[#cccccc]'>
                          Min: {selectedPool.minStake} {selectedPool.token}, Max:{' '}
                          {selectedPool.maxStake} {selectedPool.token}
                        </p>
                      </div>

                      <div className='mb-6'>
                        <div className='flex justify-between mb-2'>
                          <span className='text-sm text-[#cccccc]'>Período de Lock</span>
                          <span className='text-sm text-[#ffffff]'>{selectedPool.lockPeriod} dias</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-sm text-[#cccccc]'>Recompensas Estimadas</span>
                          <span className='text-sm text-[#00FF7F]'>0.00 {selectedPool.token}</span>
                        </div>
                      </div>

                      <button className='w-full py-3 bg-[#00FF7F] text-black font-orbitron font-medium rounded-lg hover:bg-[#00d4e0] transition-all'>
                        Fazer Stake Agora
                      </button>
                    </div>

                    <p className='text-center text-sm text-[#cccccc]'>
                      Ao fazer stake, você concorda com os termos e condições do {selectedPool.name}.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </Layout>
  );
}
