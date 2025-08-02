'use client';

import React, { memo, useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { validation } from '@/utils/validation';
import { cn } from '@/lib/utils';

/**
 * StakingForm Component - Premium staking interface with enhanced UX
 * 
 * @description A comprehensive staking form with validation, animations,
 * and optimized user experience for DeFi operations.
 * 
 * @features
 * - Multi-action support (stake, unstake, claim)
 * - Real-time validation and feedback
 * - Animated transitions and loading states
 * - Pool information display
 * - Error handling with user-friendly messages
 * - Performance optimized with React.memo
 * - TypeScript strict typing
 * - Accessibility compliant
 */

type StakingAction = 'stake' | 'unstake' | 'claim';

interface Pool {
  /** Unique identifier for the pool */
  id: string;
  /** Display name of the pool */
  name: string;
  /** Annual Percentage Rate */
  apr: number;
  /** Minimum stake amount */
  minStake: number;
  /** Maximum stake amount */
  maxStake: number;
  /** Lock period in days */
  lockPeriod: number;
  /** Total value locked in the pool */
  tvl?: number;
  /** Available rewards for claiming */
  availableRewards?: number;
  /** User's current stake in this pool */
  userStake?: number;
}

interface StakingFormProps {
  /** Available staking pools */
  pools: Pool[];
  /** Callback for stake action */
  onStake: (poolId: string, amount: number) => Promise<void>;
  /** Callback for unstake action */
  onUnstake: (poolId: string, amount: number) => Promise<void>;
  /** Callback for claim action */
  onClaim: (poolId: string) => Promise<void>;
  /** Whether the form is in loading state */
  loading?: boolean;
  /** User's wallet balance */
  walletBalance?: number;
  /** Success callback */
  onSuccess?: (action: StakingAction, poolId: string, amount?: number) => void;
  /** Error callback */
  onError?: (error: Error, action: StakingAction) => void;
}

const StakingForm = memo(({ 
  pools, 
  onStake, 
  onUnstake, 
  onClaim,
  loading: externalLoading = false,
  walletBalance = 0,
  onSuccess,
  onError
}: StakingFormProps) => {
  const [selectedPool, setSelectedPool] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [action, setAction] = useState<StakingAction>('stake');
  const [internalLoading, setInternalLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const loading = externalLoading || internalLoading;

  // Memoized selected pool data
  const selectedPoolData = useMemo(() => 
    pools.find(p => p.id === selectedPool), 
    [pools, selectedPool]
  );

  // Validation logic
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!selectedPool) {
      newErrors.pool = 'Selecione um pool para continuar';
    }

    if (action !== 'claim') {
      if (!amount || amount.trim() === '') {
        newErrors.amount = 'Insira um valor';
      } else {
        const numAmount = parseFloat(amount);
        
        if (isNaN(numAmount) || numAmount <= 0) {
          newErrors.amount = 'Valor deve ser maior que zero';
        } else if (selectedPoolData) {
          if (numAmount < selectedPoolData.minStake) {
            newErrors.amount = `Valor mínimo: ${selectedPoolData.minStake}`;
          } else if (numAmount > selectedPoolData.maxStake) {
            newErrors.amount = `Valor máximo: ${selectedPoolData.maxStake}`;
          } else if (action === 'stake' && numAmount > walletBalance) {
            newErrors.amount = 'Saldo insuficiente na carteira';
          } else if (action === 'unstake' && selectedPoolData.userStake && numAmount > selectedPoolData.userStake) {
            newErrors.amount = 'Valor maior que o stake atual';
          }
        }
      }
    }

    if (action === 'claim' && selectedPoolData?.availableRewards === 0) {
      newErrors.claim = 'Nenhuma recompensa disponível para reivindicar';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [selectedPool, amount, action, selectedPoolData, walletBalance]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ pool: true, amount: true, claim: true });
    
    if (!validateForm()) {
      return;
    }

    setInternalLoading(true);
    
    try {
      const numAmount = action !== 'claim' ? parseFloat(amount) : 0;
      
      if (action === 'stake') {
        await onStake(selectedPool, numAmount);
      } else if (action === 'unstake') {
        await onUnstake(selectedPool, numAmount);
      } else if (action === 'claim') {
        await onClaim(selectedPool);
      }
      
      // Reset form on success
      setAmount('');
      setErrors({});
      setTouched({});
      
      onSuccess?.(action, selectedPool, numAmount || undefined);
    } catch (error: any) {
      const errorObj = error instanceof Error ? error : new Error(error.message || 'Erro desconhecido');
      onError?.(errorObj, action);
    } finally {
      setInternalLoading(false);
    }
  }, [selectedPool, amount, action, validateForm, onStake, onUnstake, onClaim, onSuccess, onError]);

  // Handle action change
  const handleActionChange = useCallback((newAction: StakingAction) => {
    setAction(newAction);
    setAmount('');
    setErrors({});
    setTouched({});
  }, []);

  // Handle amount change with validation
  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    
    if (touched.amount) {
      // Re-validate on change if field was touched
      setTimeout(validateForm, 100);
    }
  }, [touched.amount, validateForm]);

  // Handle amount blur
  const handleAmountBlur = useCallback(() => {
    setTouched(prev => ({ ...prev, amount: true }));
    validateForm();
  }, [validateForm]);

  // Validate on dependency changes
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [selectedPool, action, validateForm, touched]);

  // Memoized pool options
  const poolOptions = useMemo(() => 
    pools.map(pool => ({
      value: pool.id,
      label: `${pool.name} (${validation.formatPercentage(pool.apr)} APR)`,
      disabled: false
    })), 
    [pools]
  );

  // Action button configuration
  const actionButtons: Array<{ key: StakingAction; label: string; icon: string }> = [
    { key: 'stake', label: 'Stake', icon: '⬆️' },
    { key: 'unstake', label: 'Unstake', icon: '⬇️' },
    { key: 'claim', label: 'Claim', icon: '🎁' }
  ];

  // Form validation state
  const isFormValid = useMemo(() => {
    return selectedPool && 
           (action === 'claim' || (amount && !errors.amount)) && 
           !errors.pool && 
           !errors.claim;
  }, [selectedPool, action, amount, errors]);

  return (
    <Card className="max-w-2xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <motion.h2 
            className="text-3xl font-bold text-agro-light mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Staking DeFi
          </motion.h2>
          <motion.p 
            className="text-agro-light/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Stake, unstake ou reivindique suas recompensas
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Action Selection */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {actionButtons.map((btn, index) => (
              <Button
                key={btn.key}
                type="button"
                variant={action === btn.key ? 'primary' : 'outline'}
                onClick={() => handleActionChange(btn.key)}
                className={cn(
                  'w-full transition-all duration-200',
                  action === btn.key && 'scale-105 shadow-lg'
                )}
                startIcon={<span className="text-lg">{btn.icon}</span>}
                disabled={loading}
              >
                {btn.label}
              </Button>
            ))}
          </motion.div>

          {/* Pool Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Select
              label="Selecionar Pool"
              options={poolOptions}
              value={selectedPool}
              onChange={(e) => {
                setSelectedPool(e.target.value);
                setTouched(prev => ({ ...prev, pool: true }));
              }}
              placeholder="Escolha um pool de staking"
              error={touched.pool ? errors.pool : undefined}
              disabled={loading}
            />
          </motion.div>

          {/* Pool Information */}
          <AnimatePresence>
            {selectedPoolData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 bg-gradient-to-r from-agro-dark/50 to-agro-primary/5 rounded-lg border border-agro-primary/20">
                  <h3 className="font-semibold text-agro-light mb-4 flex items-center gap-2">
                    <span className="text-agro-primary">📊</span>
                    Informações do Pool
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-agro-light/60">APR:</span>
                        <span className="text-agro-secondary font-bold">
                          {validation.formatPercentage(selectedPoolData.apr)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-agro-light/60">Lock Period:</span>
                        <span className="text-agro-light">{selectedPoolData.lockPeriod} dias</span>
                      </div>
                      {selectedPoolData.tvl && (
                        <div className="flex justify-between">
                          <span className="text-agro-light/60">TVL:</span>
                          <span className="text-agro-light">${selectedPoolData.tvl.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-agro-light/60">Min Stake:</span>
                        <span className="text-agro-light">{selectedPoolData.minStake}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-agro-light/60">Max Stake:</span>
                        <span className="text-agro-light">{selectedPoolData.maxStake}</span>
                      </div>
                      {selectedPoolData.userStake && (
                        <div className="flex justify-between">
                          <span className="text-agro-light/60">Seu Stake:</span>
                          <span className="text-agro-primary font-semibold">{selectedPoolData.userStake}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedPoolData.availableRewards && action === 'claim' && (
                    <div className="mt-4 p-3 bg-agro-secondary/10 rounded-lg border border-agro-secondary/20">
                      <div className="flex justify-between items-center">
                        <span className="text-agro-light/80">Recompensas Disponíveis:</span>
                        <span className="text-agro-secondary font-bold text-lg">
                          {selectedPoolData.availableRewards}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Amount Input */}
          <AnimatePresence>
            {action !== 'claim' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.1 }}
              >
                <Input
                  label="Quantidade"
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  onBlur={handleAmountBlur}
                  placeholder="0.00"
                  error={touched.amount ? errors.amount : undefined}
                  helperText={
                    selectedPoolData 
                      ? `Min: ${selectedPoolData.minStake} | Max: ${selectedPoolData.maxStake} | Saldo: ${walletBalance}`
                      : undefined
                  }
                  disabled={loading}
                  step="0.01"
                  min="0"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Messages */}
          <AnimatePresence>
            {errors.claim && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  {errors.claim}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              loadingText="Processando..."
              disabled={!isFormValid || loading}
              className="font-semibold"
            >
              {action === 'stake' && '🚀 Fazer Stake'}
              {action === 'unstake' && '📤 Fazer Unstake'}
              {action === 'claim' && '🎁 Reivindicar Recompensas'}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </Card>
  );
});

StakingForm.displayName = 'StakingForm';

export { StakingForm };
export type { StakingFormProps, Pool, StakingAction };