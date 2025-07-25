'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '@/hooks/useWeb3';
import { useDeFiPools } from '@/hooks/useDeFiPools';
import { AnimatedCard } from '@/components/AnimatedCard';
import { NeonButton } from '@/components/NeonButton';
import { Modal } from '@/components/Modal';
import { Loader } from '@/components/Loader';
import {
  Coins,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  Info,
  Calculator,
  Award,
  Lock,
  Plus,
  Minus,
} from 'lucide-react';

interface StakeModalData {
  poolId: string;
  action: 'stake' | 'unstake';
  maxAmount: number;
}

export default function StakingPage() {
  const { isConnected, connectWallet } = useWeb3();
  const { pools, loading, stakeInPool, unstakeFromPool, claimRewards } = useDeFiPools();

  const [selectedPool] = useState<string>('');
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeModalData, setStakeModalData] = useState<StakeModalData | null>(null);
  const [calculatedRewards, setCalculatedRewards] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (stakeAmount && selectedPool) {
      calculateProjectedRewards();
    }
  }, [stakeAmount, selectedPool]);

  const calculateProjectedRewards = () => {
    const pool = pools.find((p) => p.id === selectedPool);
    if (!pool || !stakeAmount) return;

    const amount = parseFloat(stakeAmount);
    const dailyRewards = (amount * pool.apr) / 365 / 100;
    setCalculatedRewards(dailyRewards);
  };

  const handleStakeAction = (poolId: string, action: 'stake' | 'unstake') => {
    const pool = pools.find((p) => p.id === poolId);
    const maxAmount = pool ? (action === 'stake' ? pool.minStake : pool.userStaked) : 0;
    setStakeModalData({ poolId, action, maxAmount });
    setShowStakeModal(true);
    setStakeAmount('');
  };

  const executeStakeAction = async () => {
    if (!stakeModalData || !stakeAmount) return;

    setIsProcessing(true);
    try {
      const amount = parseFloat(stakeAmount);

      if (stakeModalData.action === 'stake') {
        await stakeInPool(stakeModalData.poolId, amount.toString());
      } else {
        await unstakeFromPool(stakeModalData.poolId, amount.toString());
      }

      setShowStakeModal(false);
      setStakeAmount('');
    } catch (error) {
      console.error('Stake action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClaimRewards = async (poolId: string) => {
    setIsProcessing(true);
    try {
      await claimRewards(poolId);
    } catch (error) {
      console.error('Claim rewards failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <Coins className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Start Staking</h1>
          <p className="text-gray-400 mb-8">
            Connect your wallet to start earning rewards through AGROTM staking pools.
          </p>

          <NeonButton onClick={connectWallet} size="md" className="w-full">
            Connect Wallet
          </NeonButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-800 bg-black/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Coins className="w-8 h-8 mr-3 text-blue-400" />
                Staking Pools
              </h1>
              <p className="text-gray-400 mt-1">
                Stake your tokens and earn rewards in AGROTM ecosystem
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-400">Available Pools</p>
              <p className="text-xl font-semibold text-white">{pools.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <AnimatedCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Staked</p>
                <p className="text-2xl font-bold text-white">
                  $
                  {pools
                    .reduce((sum: number, pool) => sum + (pool.userStaked || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Pending Rewards</p>
                <p className="text-2xl font-bold text-white">
                  $
                  {pools
                    .reduce((sum: number, pool) => sum + (pool.userRewards || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <Award className="w-8 h-8 text-yellow-400" />
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Active Pools</p>
                <p className="text-2xl font-bold text-white">{pools.length}</p>
              </div>
              <Zap className="w-8 h-8 text-green-400" />
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Avg APR</p>
                <p className="text-2xl font-bold text-white">
                  {pools.length > 0
                    ? (pools.reduce((sum, pool) => sum + pool.apr, 0) / pools.length).toFixed(1)
                    : '0'}
                  %
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Staking Pools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-blue-400" />
            Available Staking Pools
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pools.map((pool) => {
                return (
                  <motion.div
                    key={pool.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <AnimatedCard className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white flex items-center">
                            {pool.name}
                            {pool.isVerified && <Shield className="w-4 h-4 ml-2 text-green-400" />}
                          </h3>
                          <p className="text-gray-400 text-sm">{pool.description}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-400">{pool.apr.toFixed(1)}%</p>
                          <p className="text-xs text-gray-400">APR</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Total Value Locked</p>
                          <p className="text-sm font-semibold text-white">
                            ${pool.tvl.toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 mb-1">Lock Period</p>
                          <p className="text-sm font-semibold text-white flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {pool.lockPeriod} days
                          </p>
                        </div>

                        {pool.userStaked && (
                          <>
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Your Stake</p>
                              <p className="text-sm font-semibold text-green-400">
                                ${pool.userStaked.toLocaleString()}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400 mb-1">Pending Rewards</p>
                              <p className="text-sm font-semibold text-yellow-400">
                                ${pool.userRewards.toLocaleString()}
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex space-x-3">
                        <NeonButton
                          onClick={() => handleStakeAction(pool.id, 'stake')}
                          size="sm"
                          className="flex-1"
                          disabled={isProcessing}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Stake
                        </NeonButton>

                        {pool.userStaked && pool.userStaked > 0 && (
                          <>
                            <NeonButton
                              onClick={() => handleStakeAction(pool.id, 'unstake')}
                              variant="secondary"
                              size="sm"
                              className="flex-1"
                              disabled={isProcessing}
                            >
                              <Minus className="w-4 h-4 mr-1" />
                              Unstake
                            </NeonButton>

                            {pool.userRewards && pool.userRewards > 0 && (
                              <NeonButton
                                onClick={() => handleClaimRewards(pool.id)}
                                variant="secondary"
                                size="sm"
                                disabled={isProcessing}
                              >
                                <Award className="w-4 h-4 mr-1" />
                                Claim
                              </NeonButton>
                            )}
                          </>
                        )}
                      </div>

                      {/* Pool Info */}
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex items-center text-xs text-gray-400">
                          <Info className="w-3 h-3 mr-1" />
                          Risk Level: {pool.riskLevel} | Min Stake: ${pool.minStake} | Max Stake: $
                          {pool.maxStake?.toLocaleString() || 'Unlimited'}
                        </div>
                      </div>
                    </AnimatedCard>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Stake/Unstake Modal */}
        <Modal
          isOpen={showStakeModal}
          onClose={() => setShowStakeModal(false)}
          title={`${stakeModalData?.action === 'stake' ? 'Stake' : 'Unstake'} Tokens`}
        >
          {stakeModalData && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount to {stakeModalData.action}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    max={stakeModalData.maxAmount}
                    step="0.01"
                  />
                  <button
                    onClick={() => setStakeAmount(stakeModalData.maxAmount.toString())}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 text-sm hover:text-blue-300"
                  >
                    MAX
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Available: {stakeModalData.maxAmount.toFixed(4)} SOL
                </p>
              </div>

              {stakeModalData.action === 'stake' && stakeAmount && (
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center">
                      <Calculator className="w-4 h-4 mr-1" />
                      Estimated Daily Rewards:
                    </span>
                    <span className="text-green-400 font-semibold">
                      ${calculatedRewards.toFixed(4)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <NeonButton
                  onClick={() => setShowStakeModal(false)}
                  variant="secondary"
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Cancel
                </NeonButton>

                <NeonButton
                  onClick={executeStakeAction}
                  className="flex-1"
                  disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || isProcessing}
                  loading={isProcessing}
                >
                  {stakeModalData.action === 'stake' ? 'Stake' : 'Unstake'}
                </NeonButton>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
