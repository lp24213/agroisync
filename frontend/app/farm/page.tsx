'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpDown,
  RefreshCw,
  ChevronDown,
  Plus,
  Minus,
  Info,
  Clock,
  Zap,
  TrendingUp,
  Filter,
  Search,
} from 'lucide-react';

// Types
interface Token {
  symbol: string;
  color: string;
}

interface Farm {
  id: number;
  name: string;
  type: string;
  apr: number;
  tvl: number;
  multiplier: string;
  token1: Token;
  token2: Token;
  userStaked: number;
  userStakedValue: number;
  earned: number;
  earnedValue: number;
  featured: boolean;
}

interface FarmCardProps {
  farm: Farm;
  onStake: (farmId: number, amount: string) => void;
  onUnstake: (farmId: number, amount: string) => void;
  onHarvest: (farmId: number) => void;
}

const farms = [
  {
    id: 1,
    name: 'AGROTM-SOL',
    type: 'Liquidity Pool',
    apr: 125.5,
    tvl: 1250000,
    multiplier: '40x',
    token1: {
      symbol: 'AGROTM',
      color: '#22C55E',
    },
    token2: {
      symbol: 'SOL',
      color: '#9945FF',
    },
    userStaked: 125.75,
    userStakedValue: 2500,
    earned: 45.5,
    earnedValue: 106.42,
    featured: true,
  },
  {
    id: 2,
    name: 'AGROTM-USDC',
    type: 'Liquidity Pool',
    apr: 85.2,
    tvl: 3500000,
    multiplier: '25x',
    token1: {
      symbol: 'AGROTM',
      color: '#22C55E',
    },
    token2: {
      symbol: 'USDC',
      color: '#3B82F6',
    },
    userStaked: 500.25,
    userStakedValue: 1175.59,
    earned: 32.8,
    earnedValue: 76.87,
    featured: true,
  },
  {
    id: 3,
    name: 'AGROTM-RAY',
    type: 'Liquidity Pool',
    apr: 95.8,
    tvl: 750000,
    multiplier: '30x',
    token1: {
      symbol: 'AGROTM',
      color: '#22C55E',
    },
    token2: {
      symbol: 'RAY',
      color: '#FF6B6B',
    },
    userStaked: 0,
    userStakedValue: 0,
    earned: 0,
    earnedValue: 0,
    featured: false,
  },
  {
    id: 4,
    name: 'SOL-USDC',
    type: 'Liquidity Pool',
    apr: 65.3,
    tvl: 5250000,
    multiplier: '20x',
    token1: {
      symbol: 'SOL',
      color: '#9945FF',
    },
    token2: {
      symbol: 'USDC',
      color: '#3B82F6',
    },
    userStaked: 0,
    userStakedValue: 0,
    earned: 0,
    earnedValue: 0,
    featured: false,
  },
  {
    id: 5,
    name: 'AGROTM-BONK',
    type: 'Liquidity Pool',
    apr: 150.7,
    tvl: 450000,
    multiplier: '45x',
    token1: {
      symbol: 'AGROTM',
      color: '#22C55E',
    },
    token2: {
      symbol: 'BONK',
      color: '#F59E0B',
    },
    userStaked: 0,
    userStakedValue: 0,
    earned: 0,
    earnedValue: 0,
    featured: true,
  },
];

const FarmCard = ({ farm, onStake, onUnstake, onHarvest }: FarmCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isHarvesting, setIsHarvesting] = useState(false);

  const handleStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;

    setIsStaking(true);

    // Simulate staking process
    setTimeout(() => {
      onStake(farm.id, stakeAmount);
      setIsStaking(false);
      setStakeAmount('');
    }, 1500);
  };

  const handleUnstake = () => {
    if (
      !unstakeAmount ||
      parseFloat(unstakeAmount) <= 0 ||
      parseFloat(unstakeAmount) > farm.userStaked
    )
      return;

    setIsUnstaking(true);

    // Simulate unstaking process
    setTimeout(() => {
      onUnstake(farm.id, unstakeAmount);
      setIsUnstaking(false);
      setUnstakeAmount('');
    }, 1500);
  };

  const handleHarvest = () => {
    if (farm.earned <= 0) return;

    setIsHarvesting(true);

    // Simulate harvesting process
    setTimeout(() => {
      onHarvest(farm.id);
      setIsHarvesting(false);
    }, 1500);
  };

  return (
    <motion.div
      className={`cyberpunk-border p-0.5 rounded-lg overflow-hidden ${farm.featured ? 'border-agro-green' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='bg-agro-darker/90 backdrop-blur-md rounded-lg overflow-hidden'>
        {/* Farm Header */}
        <div className='p-5'>
          <div className='flex justify-between items-center mb-4'>
            <div className='flex items-center space-x-3'>
              <div className='relative'>
                <div
                  className='w-10 h-10 rounded-full flex items-center justify-center neon-box z-10'
                  style={{
                    backgroundColor: `${farm.token1.color}20`,
                    boxShadow: `0 0 10px ${farm.token1.color}30`,
                  }}
                >
                  <span className='text-sm font-bold' style={{ color: farm.token1.color }}>
                    {farm.token1.symbol.charAt(0)}
                  </span>
                </div>
                <div
                  className='w-10 h-10 rounded-full flex items-center justify-center neon-box absolute -right-4 top-0'
                  style={{
                    backgroundColor: `${farm.token2.color}20`,
                    boxShadow: `0 0 10px ${farm.token2.color}30`,
                  }}
                >
                  <span className='text-sm font-bold' style={{ color: farm.token2.color }}>
                    {farm.token2.symbol.charAt(0)}
                  </span>
                </div>
              </div>
              <div>
                <h3 className='text-xl font-bold text-white'>{farm.name}</h3>
                <p className='text-sm text-gray-400'>{farm.type}</p>
              </div>
            </div>
            {farm.featured && (
              <span className='px-3 py-1 text-xs rounded-full bg-agro-green/20 text-agro-green font-medium'>
                Featured
              </span>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div className='bg-agro-dark/30 p-3 rounded-lg'>
              <p className='text-sm text-gray-400 mb-1'>APR</p>
              <div className='flex items-center'>
                <p className='text-xl font-bold text-white'>{farm.apr}%</p>
                <TrendingUp className='h-4 w-4 text-agro-green ml-2' />
              </div>
            </div>
            <div className='bg-agro-dark/30 p-3 rounded-lg'>
              <p className='text-sm text-gray-400 mb-1'>TVL</p>
              <p className='text-xl font-bold text-white'>${farm.tvl.toLocaleString()}</p>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div className='bg-agro-dark/30 p-3 rounded-lg'>
              <p className='text-sm text-gray-400 mb-1'>Earned</p>
              <div className='flex flex-col'>
                <p className='text-lg font-bold text-white'>{farm.earned.toFixed(2)} AGROTM</p>
                <p className='text-xs text-gray-400'>${farm.earnedValue.toFixed(2)}</p>
              </div>
            </div>
            <div className='bg-agro-dark/30 p-3 rounded-lg'>
              <p className='text-sm text-gray-400 mb-1'>Staked</p>
              <div className='flex flex-col'>
                <p className='text-lg font-bold text-white'>
                  {farm.userStaked > 0 ? farm.userStaked.toFixed(2) : '0'} LP
                </p>
                <p className='text-xs text-gray-400'>
                  ${farm.userStakedValue > 0 ? farm.userStakedValue.toFixed(2) : '0'}
                </p>
              </div>
            </div>
          </div>

          <div className='flex space-x-3'>
            <motion.button
              onClick={() => setExpanded(!expanded)}
              className='flex-1 py-3 rounded-lg bg-agro-dark/50 text-white hover:bg-agro-dark transition-colors'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {expanded ? 'Hide' : 'Details'}
            </motion.button>
            <motion.button
              onClick={handleHarvest}
              disabled={farm.earned <= 0 || isHarvesting}
              className={`flex-1 py-3 rounded-lg font-medium text-white ${farm.earned <= 0 ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-agro-blue to-agro-green hover:opacity-90'} transition-all`}
              whileHover={farm.earned > 0 && !isHarvesting ? { scale: 1.02 } : {}}
              whileTap={farm.earned > 0 && !isHarvesting ? { scale: 0.98 } : {}}
            >
              {isHarvesting ? (
                <span className='flex items-center justify-center'>
                  <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                  Harvesting
                </span>
              ) : (
                'Harvest'
              )}
            </motion.button>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='overflow-hidden'
            >
              <div className='border-t border-gray-800 p-5'>
                <div className='grid grid-cols-2 gap-4 mb-6'>
                  <div>
                    <p className='text-sm text-gray-400 mb-2'>Multiplier</p>
                    <p className='text-lg font-bold text-white'>{farm.multiplier}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-400 mb-2'>Deposit Fee</p>
                    <p className='text-lg font-bold text-white'>0%</p>
                  </div>
                </div>

                {/* Stake Section */}
                <div className='mb-6'>
                  <h4 className='text-lg font-bold text-white mb-3'>Stake LP Tokens</h4>
                  <div className='bg-agro-dark/30 p-4 rounded-lg mb-3'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm text-gray-400'>Stake</span>
                      <span className='text-sm text-gray-400'>Balance: 250.00 LP</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <input
                        type='text'
                        value={stakeAmount}
                        onChange={e => setStakeAmount(e.target.value)}
                        placeholder='0.00'
                        className='flex-1 bg-agro-dark/50 border border-gray-700 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-agro-blue transition-colors'
                      />
                      <button
                        onClick={() => setStakeAmount('250')}
                        className='px-2 py-1 text-xs rounded bg-agro-blue/20 text-agro-blue hover:bg-agro-blue/30 transition-colors'
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleStake}
                    disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || isStaking}
                    className={`w-full py-3 rounded-lg font-medium text-white ${!stakeAmount || parseFloat(stakeAmount) <= 0 ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-agro-blue to-agro-green hover:opacity-90'} transition-all`}
                    whileHover={
                      stakeAmount && parseFloat(stakeAmount) > 0 && !isStaking
                        ? { scale: 1.02 }
                        : {}
                    }
                    whileTap={
                      stakeAmount && parseFloat(stakeAmount) > 0 && !isStaking
                        ? { scale: 0.98 }
                        : {}
                    }
                  >
                    {isStaking ? (
                      <span className='flex items-center justify-center'>
                        <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                        Staking
                      </span>
                    ) : (
                      'Stake'
                    )}
                  </motion.button>
                </div>

                {/* Unstake Section */}
                {farm.userStaked > 0 && (
                  <div>
                    <h4 className='text-lg font-bold text-white mb-3'>Unstake LP Tokens</h4>
                    <div className='bg-agro-dark/30 p-4 rounded-lg mb-3'>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm text-gray-400'>Unstake</span>
                        <span className='text-sm text-gray-400'>
                          Staked: {farm.userStaked.toFixed(2)} LP
                        </span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <input
                          type='text'
                          value={unstakeAmount}
                          onChange={e => setUnstakeAmount(e.target.value)}
                          placeholder='0.00'
                          className='flex-1 bg-agro-dark/50 border border-gray-700 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-agro-blue transition-colors'
                        />
                        <button
                          onClick={() => setUnstakeAmount(farm.userStaked.toString())}
                          className='px-2 py-1 text-xs rounded bg-agro-blue/20 text-agro-blue hover:bg-agro-blue/30 transition-colors'
                        >
                          MAX
                        </button>
                      </div>
                    </div>
                    <motion.button
                      onClick={handleUnstake}
                      disabled={
                        !unstakeAmount ||
                        parseFloat(unstakeAmount) <= 0 ||
                        parseFloat(unstakeAmount) > farm.userStaked ||
                        isUnstaking
                      }
                      className={`w-full py-3 rounded-lg font-medium text-white ${!unstakeAmount || parseFloat(unstakeAmount) <= 0 || parseFloat(unstakeAmount) > farm.userStaked ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-agro-blue to-agro-green hover:opacity-90'} transition-all`}
                      whileHover={
                        unstakeAmount &&
                        parseFloat(unstakeAmount) > 0 &&
                        parseFloat(unstakeAmount) <= farm.userStaked &&
                        !isUnstaking
                          ? { scale: 1.02 }
                          : {}
                      }
                      whileTap={
                        unstakeAmount &&
                        parseFloat(unstakeAmount) > 0 &&
                        parseFloat(unstakeAmount) <= farm.userStaked &&
                        !isUnstaking
                          ? { scale: 0.98 }
                          : {}
                      }
                    >
                      {isUnstaking ? (
                        <span className='flex items-center justify-center'>
                          <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                          Unstaking
                        </span>
                      ) : (
                        'Unstake'
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function FarmPage() {
  const [activeFarms, setActiveFarms] = useState(farms);
  const [userFarms, setUserFarms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, staked, featured
  const [sortBy, setSortBy] = useState('apr'); // apr, tvl, earned
  const [sortDirection, setSortDirection] = useState('desc'); // asc, desc
  const [totalStaked, setTotalStaked] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);

  // Calculate user stats
  useEffect(() => {
    const userStakedFarms = farms.filter(farm => farm.userStaked > 0);
    setUserFarms(userStakedFarms);

    const stakedValue = userStakedFarms.reduce((acc, farm) => acc + farm.userStakedValue, 0);
    setTotalStaked(stakedValue);

    const earnedValue = farms.reduce((acc, farm) => acc + farm.earnedValue, 0);
    setTotalEarned(earnedValue);
  }, [farms]);

  // Filter and sort farms
  useEffect(() => {
    let filtered = [...farms];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(farm =>
        farm.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply type filter
    if (filterType === 'staked') {
      filtered = filtered.filter(farm => farm.userStaked > 0);
    } else if (filterType === 'featured') {
      filtered = filtered.filter(farm => farm.featured);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'apr':
          aValue = a.apr;
          bValue = b.apr;
          break;
        case 'tvl':
          aValue = a.tvl;
          bValue = b.tvl;
          break;
        case 'earned':
          aValue = a.earnedValue;
          bValue = b.earnedValue;
          break;
        default:
          aValue = a.apr;
          bValue = b.apr;
      }

      return sortDirection === 'desc' ? bValue - aValue : aValue - bValue;
    });

    setActiveFarms(filtered);
  }, [searchTerm, filterType, sortBy, sortDirection]);

  const handleStake = (farmId: number, amount: string) => {
    // In a real app, this would call a contract method
    console.log(`Staking ${amount} LP tokens in farm ${farmId}`);
  };

  const handleUnstake = (farmId: number, amount: string) => {
    // In a real app, this would call a contract method
    console.log(`Unstaking ${amount} LP tokens from farm ${farmId}`);
  };

  const handleHarvest = (farmId: number) => {
    // In a real app, this would call a contract method
    console.log(`Harvesting rewards from farm ${farmId}`);
  };

  const handleHarvestAll = () => {
    // In a real app, this would call a contract method to harvest from all farms
    console.log('Harvesting rewards from all farms');
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  };

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
              Yield Farming
            </span>
          </h1>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
            Stake your LP tokens and earn AGROTM rewards
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'
        >
          <div className='cyberpunk-border p-0.5 rounded-lg overflow-hidden'>
            <div className='bg-agro-darker/90 backdrop-blur-md p-6 rounded-lg'>
              <p className='text-gray-400 mb-2'>Total Value Locked</p>
              <div className='flex items-baseline'>
                <h3 className='text-3xl font-bold text-white'>
                  ${farms.reduce((acc, farm) => acc + farm.tvl, 0).toLocaleString()}
                </h3>
                <span className='ml-2 text-sm text-agro-green'>+5.2%</span>
              </div>
            </div>
          </div>

          <div className='cyberpunk-border p-0.5 rounded-lg overflow-hidden'>
            <div className='bg-agro-darker/90 backdrop-blur-md p-6 rounded-lg'>
              <p className='text-gray-400 mb-2'>Your Total Staked</p>
              <div className='flex items-baseline'>
                <h3 className='text-3xl font-bold text-white'>${totalStaked.toFixed(2)}</h3>
                <span className='ml-2 text-xs text-gray-400'>across {userFarms.length} farms</span>
              </div>
            </div>
          </div>

          <div className='cyberpunk-border p-0.5 rounded-lg overflow-hidden'>
            <div className='bg-agro-darker/90 backdrop-blur-md p-6 rounded-lg'>
              <p className='text-gray-400 mb-2'>Your Total Earnings</p>
              <div className='flex items-baseline'>
                <h3 className='text-3xl font-bold text-white'>${totalEarned.toFixed(2)}</h3>
                <motion.button
                  onClick={handleHarvestAll}
                  disabled={totalEarned <= 0}
                  className={`ml-auto px-3 py-1 rounded-lg text-sm font-medium ${totalEarned <= 0 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-agro-blue to-agro-green text-white hover:opacity-90'}`}
                  whileHover={totalEarned > 0 ? { scale: 1.05 } : {}}
                  whileTap={totalEarned > 0 ? { scale: 0.95 } : {}}
                >
                  Harvest All
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='mb-8'
        >
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0'>
            <div className='flex items-center space-x-4'>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Search className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='text'
                  placeholder='Search farms'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10 pr-4 py-2 bg-agro-dark/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-agro-blue transition-colors w-full md:w-64'
                />
              </div>

              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 rounded-lg text-sm ${filterType === 'all' ? 'bg-agro-blue text-white' : 'bg-agro-dark/50 text-gray-300 hover:bg-agro-dark/80'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('staked')}
                  className={`px-3 py-1 rounded-lg text-sm ${filterType === 'staked' ? 'bg-agro-blue text-white' : 'bg-agro-dark/50 text-gray-300 hover:bg-agro-dark/80'}`}
                >
                  Staked
                </button>
                <button
                  onClick={() => setFilterType('featured')}
                  className={`px-3 py-1 rounded-lg text-sm ${filterType === 'featured' ? 'bg-agro-blue text-white' : 'bg-agro-dark/50 text-gray-300 hover:bg-agro-dark/80'}`}
                >
                  Featured
                </button>
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <span className='text-sm text-gray-400'>Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className='bg-agro-dark/50 border border-gray-700 rounded-lg text-white px-3 py-1 focus:outline-none focus:ring-2 focus:ring-agro-blue transition-colors text-sm'
              >
                <option value='apr'>APR</option>
                <option value='tvl'>TVL</option>
                <option value='earned'>Earned</option>
              </select>
              <button
                onClick={toggleSortDirection}
                className='p-1 rounded-lg bg-agro-dark/50 text-gray-300 hover:bg-agro-dark/80 hover:text-white transition-colors'
              >
                <ArrowUpDown className='h-5 w-5' />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Farms Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {activeFarms.length > 0 ? (
            activeFarms.map(farm => (
              <FarmCard
                key={farm.id}
                farm={farm}
                onStake={handleStake}
                onUnstake={handleUnstake}
                onHarvest={handleHarvest}
              />
            ))
          ) : (
            <div className='col-span-2 text-center py-12'>
              <p className='text-xl text-gray-400'>No farms found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
