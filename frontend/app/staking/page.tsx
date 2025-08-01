'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, Zap, ArrowRight, Star, Shield, Clock, BarChart3 } from 'lucide-react';

const stakingPools = [
  {
    id: 1,
    name: 'SOL Staking Pool',
    token: 'SOL',
    apy: 12.5,
    totalStaked: 1250000,
    participants: 15420,
    minStake: 1,
    maxStake: 10000,
    lockPeriod: '30 days',
    risk: 'Low',
    color: '#9945FF',
    description: 'Stake SOL and earn rewards with our secure staking pool.',
    features: ['Auto-compounding', 'Instant rewards', 'Flexible unstaking'],
  },
  {
    id: 2,
    name: 'AGROTM Staking Pool',
    token: 'AGROTM',
    apy: 18.2,
    totalStaked: 850000,
    participants: 8920,
    minStake: 100,
    maxStake: 50000,
    lockPeriod: '90 days',
    risk: 'Medium',
    color: '#22C55E',
    description: 'High-yield staking for AGROTM token holders with bonus rewards.',
    features: ['Bonus rewards', 'Governance rights', 'Early access to features'],
  },
  {
    id: 3,
    name: 'RAY Staking Pool',
    token: 'RAY',
    apy: 15.8,
    totalStaked: 450000,
    participants: 5670,
    minStake: 10,
    maxStake: 25000,
    lockPeriod: '60 days',
    risk: 'Medium',
    color: '#FF6B6B',
    description: 'Stake RAY tokens and participate in Raydium ecosystem rewards.',
    features: ['Liquidity mining', 'Trading fee sharing', 'Protocol governance'],
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

  const totalValueLocked = stakingPools.reduce((sum, pool) => sum + pool.totalStaked, 0);
  const averageApy = stakingPools.reduce((sum, pool) => sum + pool.apy, 0) / stakingPools.length;
  const totalParticipants = stakingPools.reduce((sum, pool) => sum + pool.participants, 0);

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
          if (activeTab === 'low') return pool.risk === 'Low';
          if (activeTab === 'medium') return pool.risk === 'Medium';
          if (activeTab === 'high') return pool.risk === 'High';
          return true;
        });

  return (
    <div className='min-h-screen bg-agro-darker overflow-hidden relative'>
      {/* Background grid animation */}
      <div className='absolute inset-0 z-0 opacity-10'>
        <div className='grid-animation'></div>
      </div>

      {/* Animated orbs */}
      <motion.div
        className='absolute top-1/4 -left-20 w-40 h-40 rounded-full bg-agro-blue/20 blur-xl z-0'
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
        className='absolute bottom-1/4 -right-20 w-40 h-40 rounded-full bg-agro-green/20 blur-xl z-0'
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
          <h1 className='text-5xl font-bold mb-4 text-glow'>
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-agro-blue to-agro-green'>
              Staking Pools
            </span>
          </h1>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
            Earn passive income by staking your tokens in our secure and high-yield pools
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
            className='cyberpunk-border p-0.5 rounded-lg overflow-hidden'
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <div className='card text-center bg-agro-darker/90 backdrop-blur-md p-6 rounded-lg'>
              <TrendingUp className='h-8 w-8 text-agro-blue mx-auto mb-3' />
              <p className='text-2xl font-bold text-white'>${animatedStats.tvl.toFixed(1)}M</p>
              <p className='text-gray-400'>Total Value Locked</p>
            </div>
          </motion.div>

          <motion.div
            className='cyberpunk-border p-0.5 rounded-lg overflow-hidden'
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <div className='card text-center bg-agro-darker/90 backdrop-blur-md p-6 rounded-lg'>
              <Zap className='h-8 w-8 text-agro-green mx-auto mb-3' />
              <p className='text-2xl font-bold text-white'>{animatedStats.apy.toFixed(1)}%</p>
              <p className='text-gray-400'>Average APY</p>
            </div>
          </motion.div>

          <motion.div
            className='cyberpunk-border p-0.5 rounded-lg overflow-hidden'
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <div className='card text-center bg-agro-darker/90 backdrop-blur-md p-6 rounded-lg'>
              <Users className='h-8 w-8 text-agro-purple mx-auto mb-3' />
              <p className='text-2xl font-bold text-white'>
                {animatedStats.stakers.toLocaleString()}
              </p>
              <p className='text-gray-400'>Active Stakers</p>
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
            className={`px-4 py-2 rounded-full transition-all ${activeTab === 'all' ? 'bg-agro-blue text-white' : 'bg-agro-dark/50 text-gray-300 hover:bg-agro-dark'}`}
          >
            All Pools
          </button>
          <button
            onClick={() => setActiveTab('low')}
            className={`px-4 py-2 rounded-full transition-all ${activeTab === 'low' ? 'bg-green-500 text-white' : 'bg-agro-dark/50 text-gray-300 hover:bg-agro-dark'}`}
          >
            Low Risk
          </button>
          <button
            onClick={() => setActiveTab('medium')}
            className={`px-4 py-2 rounded-full transition-all ${activeTab === 'medium' ? 'bg-yellow-500 text-white' : 'bg-agro-dark/50 text-gray-300 hover:bg-agro-dark'}`}
          >
            Medium Risk
          </button>
          <button
            onClick={() => setActiveTab('high')}
            className={`px-4 py-2 rounded-full transition-all ${activeTab === 'high' ? 'bg-red-500 text-white' : 'bg-agro-dark/50 text-gray-300 hover:bg-agro-dark'}`}
          >
            High Risk
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
              <div className='cyberpunk-border p-0.5 rounded-lg overflow-hidden'>
                <div className='bg-agro-darker/90 backdrop-blur-md p-6 rounded-lg relative overflow-hidden'>
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
                        className='w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold neon-box'
                        style={{
                          backgroundColor: `${pool.color}50`,
                          boxShadow: `0 0 10px ${pool.color}50`,
                        }}
                      >
                        {pool.token.charAt(0)}
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold text-white'>{pool.name}</h3>
                        <p className='text-sm text-gray-400'>{pool.token} Token</p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-2xl font-bold text-glow' style={{ color: pool.color }}>
                        {pool.apy}%
                      </p>
                      <p className='text-sm text-gray-400'>APY</p>
                    </div>
                  </div>

                  {/* Pool Description */}
                  <p className='text-gray-300 mb-4 relative z-10'>{pool.description}</p>

                  {/* Pool Stats */}
                  <div className='grid grid-cols-2 gap-4 mb-6 relative z-10'>
                    <div className='bg-agro-dark/30 p-3 rounded-lg'>
                      <div className='flex items-center space-x-2'>
                        <BarChart3 className='h-4 w-4 text-gray-400' />
                        <p className='text-sm text-gray-400'>Total Staked</p>
                      </div>
                      <p className='text-lg font-semibold text-white mt-1'>
                        ${(pool.totalStaked / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className='bg-agro-dark/30 p-3 rounded-lg'>
                      <div className='flex items-center space-x-2'>
                        <Users className='h-4 w-4 text-gray-400' />
                        <p className='text-sm text-gray-400'>Participants</p>
                      </div>
                      <p className='text-lg font-semibold text-white mt-1'>
                        {pool.participants.toLocaleString()}
                      </p>
                    </div>
                    <div className='bg-agro-dark/30 p-3 rounded-lg'>
                      <div className='flex items-center space-x-2'>
                        <Zap className='h-4 w-4 text-gray-400' />
                        <p className='text-sm text-gray-400'>Min Stake</p>
                      </div>
                      <p className='text-lg font-semibold text-white mt-1'>
                        {pool.minStake} {pool.token}
                      </p>
                    </div>
                    <div className='bg-agro-dark/30 p-3 rounded-lg'>
                      <div className='flex items-center space-x-2'>
                        <Clock className='h-4 w-4 text-gray-400' />
                        <p className='text-sm text-gray-400'>Lock Period</p>
                      </div>
                      <p className='text-lg font-semibold text-white mt-1'>{pool.lockPeriod}</p>
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div className='flex items-center justify-between mb-4 relative z-10'>
                    <span className='text-sm text-gray-400'>Risk Level</span>
                    <div className='flex items-center space-x-1'>
                      {pool.risk === 'Low' && (
                        <div className='px-3 py-1 bg-green-500/20 text-green-400 rounded-full flex items-center'>
                          <Shield className='h-4 w-4 mr-1' />
                          <span className='text-sm font-medium'>Low</span>
                        </div>
                      )}
                      {pool.risk === 'Medium' && (
                        <div className='px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center'>
                          <Star className='h-4 w-4 mr-1' />
                          <span className='text-sm font-medium'>Medium</span>
                        </div>
                      )}
                      {pool.risk === 'High' && (
                        <div className='px-3 py-1 bg-red-500/20 text-red-400 rounded-full flex items-center'>
                          <Zap className='h-4 w-4 mr-1' />
                          <span className='text-sm font-medium'>High</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className='mb-6 relative z-10'>
                    <p className='text-sm text-gray-400 mb-2'>Features</p>
                    <div className='space-y-1'>
                      {pool.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className='flex items-center space-x-2'>
                          <div
                            className='w-1.5 h-1.5 rounded-full'
                            style={{ backgroundColor: pool.color }}
                          />
                          <span className='text-sm text-gray-300'>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    onClick={() => {
                      setSelectedPool(pool);
                      setShowStakingForm(true);
                    }}
                    className='w-full group relative overflow-hidden neon-box'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      backgroundColor: `${pool.color}20`,
                      border: `1px solid ${pool.color}50`,
                    }}
                  >
                    <span className='relative z-10 flex items-center justify-center py-3 font-medium text-white'>
                      Stake Now
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </span>
                    <span
                      className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                      style={{
                        background: `linear-gradient(90deg, ${pool.color}00, ${pool.color}40, ${pool.color}00)`,
                      }}
                    ></span>
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
                <div className='cyberpunk-border p-0.5 rounded-lg overflow-hidden'>
                  <div className='bg-agro-darker p-6 rounded-lg'>
                    <div className='flex justify-between items-center mb-6'>
                      <h2 className='text-2xl font-bold text-white'>Stake {selectedPool.token}</h2>
                      <button
                        onClick={() => setShowStakingForm(false)}
                        className='text-gray-400 hover:text-white transition-colors'
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
                    <div className='p-4 bg-agro-dark/50 rounded-lg mb-4'>
                      <div className='flex items-center justify-between mb-4'>
                        <div>
                          <p className='text-gray-400 text-sm'>Pool</p>
                          <p className='text-white font-semibold'>{selectedPool.name}</p>
                        </div>
                        <div className='text-right'>
                          <p className='text-gray-400 text-sm'>APY</p>
                          <p className='text-agro-green font-bold'>{selectedPool.apy}%</p>
                        </div>
                      </div>

                      <div className='mb-4'>
                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                          Amount to Stake
                        </label>
                        <div className='relative'>
                          <input
                            type='number'
                            className='w-full p-3 bg-agro-dark border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-agro-blue transition-colors'
                            placeholder='0.00'
                          />
                          <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
                            <span className='text-gray-400'>{selectedPool.token}</span>
                          </div>
                        </div>
                        <p className='mt-1 text-sm text-gray-400'>
                          Min: {selectedPool.minStake} {selectedPool.token}, Max:{' '}
                          {selectedPool.maxStake} {selectedPool.token}
                        </p>
                      </div>

                      <div className='mb-6'>
                        <div className='flex justify-between mb-2'>
                          <span className='text-sm text-gray-400'>Lock Period</span>
                          <span className='text-sm text-white'>{selectedPool.lockPeriod}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-sm text-gray-400'>Estimated Rewards</span>
                          <span className='text-sm text-agro-green'>0.00 {selectedPool.token}</span>
                        </div>
                      </div>

                      <button className='w-full py-3 bg-gradient-to-r from-agro-blue to-agro-green text-white font-medium rounded-lg hover:opacity-90 transition-opacity'>
                        Stake Now
                      </button>
                    </div>

                    <p className='text-center text-sm text-gray-400'>
                      By staking, you agree to the terms and conditions of the {selectedPool.name}.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
