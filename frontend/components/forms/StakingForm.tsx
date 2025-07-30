'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';

interface StakingFormProps {
  pool: {
    id: number;
    name: string;
    token: string;
    apy: number;
    minStake: number;
    maxStake: number;
    lockPeriod: string;
    color: string;
  };
  onClose: () => void;
}

export function StakingForm({ pool, onClose }: StakingFormProps) {
  const [amount, setAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [step, setStep] = useState(1);
  const { connected } = useWallet();

  const handleStake = async () => {
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!amount || parseFloat(amount) < pool.minStake || parseFloat(amount) > pool.maxStake) {
      alert(`Please enter a valid amount between ${pool.minStake} and ${pool.maxStake} ${pool.token}`);
      return;
    }

    setIsStaking(true);
    setStep(2);

    // Simulate staking process
    setTimeout(() => {
      setStep(3);
      setIsStaking(false);
    }, 3000);
  };

  const estimatedRewards = amount ? (parseFloat(amount) * pool.apy) / 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: pool.color }}
              >
                {pool.token.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Stake {pool.token}</h3>
                <p className="text-sm text-gray-400">{pool.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-primary-500 text-white' : 'bg-white/10 text-gray-400'
              }`}>
                1
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-primary-500 text-white' : 'bg-white/10 text-gray-400'
              }`}>
                2
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? 'bg-primary-500 text-white' : 'bg-white/10 text-gray-400'
              }`}>
                3
              </div>
            </div>
          </div>

          {/* Step 1: Input Amount */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount to Stake
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Enter amount (${pool.minStake}-${pool.maxStake} ${pool.token})`}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {pool.token}
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => setAmount(pool.minStake.toString())}
                    className="text-xs text-primary-400 hover:text-primary-300"
                  >
                    Min: {pool.minStake}
                  </button>
                  <button
                    onClick={() => setAmount(pool.maxStake.toString())}
                    className="text-xs text-primary-400 hover:text-primary-300"
                  >
                    Max: {pool.maxStake}
                  </button>
                </div>
              </div>

              {/* Pool Info */}
              <div className="bg-white/5 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">APY</span>
                  <span className="text-sm font-medium text-primary-400">{pool.apy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Lock Period</span>
                  <span className="text-sm font-medium text-white">{pool.lockPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Estimated Rewards (1 year)</span>
                  <span className="text-sm font-medium text-green-400">
                    {estimatedRewards.toFixed(2)} {pool.token}
                  </span>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-400">Important</p>
                  <p className="text-xs text-gray-300 mt-1">
                    Your tokens will be locked for {pool.lockPeriod}. Early unstaking may incur penalties.
                  </p>
                </div>
              </div>

              <button
                onClick={handleStake}
                disabled={!amount || !connected}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connected ? 'Stake Now' : 'Connect Wallet First'}
              </button>
            </motion.div>
          )}

          {/* Step 2: Processing */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto" />
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Processing Transaction</h4>
                <p className="text-gray-400">Please wait while we process your staking transaction...</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white">{amount} {pool.token}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-400">Pool:</span>
                  <span className="text-white">{pool.name}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Staking Successful!</h4>
                <p className="text-gray-400">Your tokens have been successfully staked in the pool.</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Staked Amount:</span>
                  <span className="text-white">{amount} {pool.token}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">APY:</span>
                  <span className="text-primary-400">{pool.apy}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Lock Period:</span>
                  <span className="text-white">{pool.lockPeriod}</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 btn-outline"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onClose();
                    // Navigate to dashboard
                  }}
                  className="flex-1 btn-primary"
                >
                  View Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 