'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Coins,
  Lock,
  Unlock,
  Calculator,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react';

const stakingSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Amount must be a positive number'),
  pool: z.string().min(1, 'Please select a staking pool'),
  lockPeriod: z.string().optional(),
});

type StakingFormData = z.infer<typeof stakingSchema>;

const stakingPools = [
  {
    id: 'flexible',
    name: 'Flexible Staking',
    apy: 8.5,
    minStake: 100,
    maxStake: 100000,
    lockPeriod: 0,
    description: 'No lock period, withdraw anytime',
    color: '#22c55e',
    icon: Unlock,
  },
  {
    id: '30-day',
    name: '30-Day Lock',
    apy: 12.3,
    minStake: 500,
    maxStake: 50000,
    lockPeriod: 30,
    description: 'Lock for 30 days, higher rewards',
    color: '#3b82f6',
    icon: Lock,
  },
  {
    id: '90-day',
    name: '90-Day Lock',
    apy: 15.7,
    minStake: 1000,
    maxStake: 100000,
    lockPeriod: 90,
    description: 'Lock for 90 days, premium rewards',
    color: '#f59e0b',
    icon: Lock,
  },
  {
    id: '180-day',
    name: '180-Day Lock',
    apy: 18.2,
    minStake: 2000,
    maxStake: 100000,
    lockPeriod: 180,
    description: 'Lock for 180 days, maximum rewards',
    color: '#8b5cf6',
    icon: Lock,
  },
];

interface StakingFormProps {
  onStake: (data: StakingFormData) => void;
  onCancel: () => void;
  userBalance?: number;
  isLoading?: boolean;
}

export function StakingForm({
  onStake,
  onCancel,
  userBalance = 0,
  isLoading = false,
}: StakingFormProps) {
  const [selectedPool, setSelectedPool] = useState(stakingPools[0]);
  const [estimatedRewards, setEstimatedRewards] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<StakingFormData>({
    resolver: zodResolver(stakingSchema),
    mode: 'onChange',
  });

  const watchedAmount = watch('amount');
  const watchedPool = watch('pool');

  // Calculate estimated rewards
  useEffect(() => {
    if (watchedAmount && watchedPool) {
      setIsCalculating(true);
      const amount = parseFloat(watchedAmount);
      const pool = stakingPools.find(p => p.id === watchedPool);

      if (pool && !isNaN(amount)) {
        // Simple calculation: (amount * apy) / 100
        const rewards = (amount * pool.apy) / 100;
        setEstimatedRewards(rewards);
      }

      setTimeout(() => setIsCalculating(false), 500);
    }
  }, [watchedAmount, watchedPool]);

  // Update selected pool when form value changes
  useEffect(() => {
    if (watchedPool) {
      const pool = stakingPools.find(p => p.id === watchedPool);
      if (pool) {
        setSelectedPool(pool);
      }
    }
  }, [watchedPool]);

  const onSubmit = (data: StakingFormData) => {
    onStake(data);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getValidationError = () => {
    if (!watchedAmount) return null;

    const amount = parseFloat(watchedAmount);
    if (isNaN(amount)) return 'Please enter a valid amount';

    if (amount < selectedPool.minStake) {
      return `Minimum stake is ${formatNumber(selectedPool.minStake)} AGROTM`;
    }

    if (amount > selectedPool.maxStake) {
      return `Maximum stake is ${formatNumber(selectedPool.maxStake)} AGROTM`;
    }

    if (amount > userBalance) {
      return 'Insufficient balance';
    }

    return null;
  };

  const validationError = getValidationError();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className='bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 max-w-md w-full'
    >
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-bold text-white'>Stake AGROTM</h2>
        <button onClick={onCancel} className='text-gray-400 hover:text-white transition-colors'>
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Pool Selection */}
        <div>
          <label className='block text-sm font-medium text-gray-300 mb-3'>
            Select Staking Pool
          </label>
          <div className='grid grid-cols-2 gap-3'>
            {stakingPools.map(pool => (
              <button
                key={pool.id}
                type='button'
                onClick={() => setValue('pool', pool.id)}
                className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                  watchedPool === pool.id
                    ? 'border-primary-500 bg-primary-500/20'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className='flex items-center justify-between mb-2'>
                  <pool.icon className='w-4 h-4' style={{ color: pool.color }} />
                  <span className='text-xs font-medium text-green-400'>{pool.apy}% APY</span>
                </div>
                <div className='text-sm font-medium text-white'>{pool.name}</div>
                <div className='text-xs text-gray-400 mt-1'>{pool.description}</div>
              </button>
            ))}
          </div>
          {errors.pool && (
            <p className='text-red-400 text-xs mt-2 flex items-center'>
              <AlertCircle className='w-3 h-3 mr-1' />
              {errors.pool.message}
            </p>
          )}
        </div>

        {/* Amount Input */}
        <div>
          <label className='block text-sm font-medium text-gray-300 mb-2'>Amount to Stake</label>
          <div className='relative'>
            <input
              type='number'
              step='0.01'
              placeholder='0.00'
              {...register('amount')}
              className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500'
            />
            <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm'>
              AGROTM
            </div>
          </div>

          {/* Balance Info */}
          <div className='flex items-center justify-between mt-2 text-xs text-gray-400'>
            <span>Available: {formatNumber(userBalance)} AGROTM</span>
            <button
              type='button'
              onClick={() => setValue('amount', userBalance.toString())}
              className='text-primary-400 hover:text-primary-300 transition-colors'
            >
              Max
            </button>
          </div>

          {errors.amount && (
            <p className='text-red-400 text-xs mt-2 flex items-center'>
              <AlertCircle className='w-3 h-3 mr-1' />
              {errors.amount.message}
            </p>
          )}

          {validationError && (
            <p className='text-red-400 text-xs mt-2 flex items-center'>
              <AlertCircle className='w-3 h-3 mr-1' />
              {validationError}
            </p>
          )}
        </div>

        {/* Pool Details */}
        {selectedPool && (
          <div className='p-4 bg-white/5 rounded-lg border border-white/10'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-sm font-medium text-white'>{selectedPool.name}</h3>
              <div className='flex items-center text-green-400'>
                <TrendingUp className='w-4 h-4 mr-1' />
                <span className='text-sm font-medium'>{selectedPool.apy}% APY</span>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4 text-xs'>
              <div>
                <span className='text-gray-400'>Min Stake:</span>
                <span className='text-white ml-1'>
                  {formatNumber(selectedPool.minStake)} AGROTM
                </span>
              </div>
              <div>
                <span className='text-gray-400'>Max Stake:</span>
                <span className='text-white ml-1'>
                  {formatNumber(selectedPool.maxStake)} AGROTM
                </span>
              </div>
              <div>
                <span className='text-gray-400'>Lock Period:</span>
                <span className='text-white ml-1'>
                  {selectedPool.lockPeriod === 0 ? 'None' : `${selectedPool.lockPeriod} days`}
                </span>
              </div>
              <div>
                <span className='text-gray-400'>Estimated Rewards:</span>
                <span className='text-green-400 ml-1'>
                  {isCalculating ? '...' : `${estimatedRewards.toFixed(2)} AGROTM/year`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Lock Period Warning */}
        {selectedPool.lockPeriod > 0 && (
          <div className='p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg'>
            <div className='flex items-start'>
              <Clock className='w-4 h-4 text-yellow-400 mr-2 mt-0.5' />
              <div className='text-xs text-yellow-300'>
                <p className='font-medium mb-1'>Lock Period Notice</p>
                <p>
                  Your tokens will be locked for {selectedPool.lockPeriod} days. You cannot withdraw
                  or transfer them during this period.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex space-x-3'>
          <button
            type='button'
            onClick={onCancel}
            className='flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={!isValid || !!validationError || isLoading}
            className='flex-1 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
          >
            {isLoading ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                Staking...
              </>
            ) : (
              <>
                <Coins className='w-4 h-4 mr-2' />
                Stake Tokens
              </>
            )}
          </button>
        </div>

        {/* Terms */}
        <div className='text-xs text-gray-400 text-center'>
          By staking, you agree to our{' '}
          <a href='#' className='text-primary-400 hover:text-primary-300'>
            Terms of Service
          </a>{' '}
          and{' '}
          <a href='#' className='text-primary-400 hover:text-primary-300'>
            Privacy Policy
          </a>
        </div>
      </form>
    </motion.div>
  );
}
