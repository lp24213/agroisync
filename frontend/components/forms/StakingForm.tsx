'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { TargetEvent } from '../../types/web3';

interface StakingFormProps {
  onStake?: (amount: string, poolId: string) => Promise<void>;
  onUnstake?: (amount: string, poolId: string) => Promise<void>;
  onClaimRewards?: (poolId: string) => Promise<void>;
  className?: string;
}

interface StakingPool {
  id: string;
  name: string;
  apr: number;
  totalStaked: string;
  userStaked: string;
  rewards: string;
  lockPeriod: number;
}

export const StakingForm: React.FC<StakingFormProps> = ({
  onStake,
  onUnstake,
  onClaimRewards,
  className = '',
}) => {
  const { isConnected, publicKey } = useWeb3();
  const [action, setAction] = useState<'stake' | 'unstake'>('stake');
  const [amount, setAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Safe type checking for events
  const isTargetEvent = (e: any): e is TargetEvent => {
    return e && typeof e === 'object' && 'target' in e && e.target;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isTargetEvent(e)) {
      const value = e.target.value;
      setAmount(value);
    }
  };

  const handlePoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isTargetEvent(e)) {
      setSelectedPool(e.target.value);
    }
  };

  const handleActionChange = (newAction: 'stake' | 'unstake') => {
    setAction(newAction);
    setAmount('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!amount || !selectedPool) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (action === 'stake' && onStake) {
        await onStake(amount, selectedPool);
      } else if (action === 'unstake' && onUnstake) {
        await onUnstake(amount, selectedPool);
      }
      
      setAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!selectedPool || !onClaimRewards) return;

    setIsLoading(true);
    setError('');

    try {
      await onClaimRewards(selectedPool);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim rewards');
    } finally {
      setIsLoading(false);
    }
  };

  const mockPools: StakingPool[] = [
    {
      id: 'pool-1',
      name: 'AGRO Token Pool',
      apr: 12.5,
      totalStaked: '1,000,000',
      userStaked: '5,000',
      rewards: '250',
      lockPeriod: 30
    },
    {
      id: 'pool-2',
      name: 'Liquidity Pool',
      apr: 18.2,
      totalStaked: '500,000',
      userStaked: '2,500',
      rewards: '150',
      lockPeriod: 60
    }
  ];

  const actionButtons = [
    { key: 'stake', label: 'Stake', icon: '🔒' },
    { key: 'unstake', label: 'Unstake', icon: '🔓' }
  ];

  return (
    <Card className={`staking-form ${className}`}>
      <div className="form-header">
        <h3 className="form-title">Staking Operations</h3>
        <p className="form-description">
          Stake your tokens to earn rewards or unstake to withdraw
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        {/* Action Selection */}
        <div className="action-selector">
          <label className="form-label">Action</label>
          <div className="action-buttons">
            {actionButtons.map((btn) => (
              <Button
                key={btn.key}
                type="button"
                variant={action === btn.key ? 'primary' : 'outline'}
                onClick={() => handleActionChange(btn.key as 'stake' | 'unstake')}
                className="action-button"
              >
                <span className="action-icon">{btn.icon}</span>
                <span className="action-label">{btn.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Pool Selection */}
        <div className="form-field">
          <label htmlFor="pool-select" className="form-label">
            Select Pool
          </label>
          <select
            id="pool-select"
            value={selectedPool}
            onChange={handlePoolChange}
            className="form-select"
            required
          >
            <option value="">Choose a pool...</option>
            {mockPools.map((pool) => (
              <option key={pool.id} value={pool.id}>
                {pool.name} - {pool.apr}% APR
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <div className="form-field">
          <label htmlFor="amount-input" className="form-label">
            Amount
          </label>
          <Input
            id="amount-input"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount..."
            min="0"
            step="0.01"
            required
            className="form-input"
          />
        </div>

        {/* Pool Info */}
        {selectedPool && (
          <div className="pool-info">
            <h4 className="pool-info-title">Pool Information</h4>
            {mockPools.find(p => p.id === selectedPool) && (
              <div className="pool-details">
                <div className="pool-stat">
                  <span className="stat-label">Your Staked:</span>
                  <span className="stat-value">
                    {mockPools.find(p => p.id === selectedPool)?.userStaked} AGRO
                  </span>
                </div>
                <div className="pool-stat">
                  <span className="stat-label">Available Rewards:</span>
                  <span className="stat-value">
                    {mockPools.find(p => p.id === selectedPool)?.rewards} AGRO
                  </span>
                </div>
                <div className="pool-stat">
                  <span className="stat-label">Lock Period:</span>
                  <span className="stat-value">
                    {mockPools.find(p => p.id === selectedPool)?.lockPeriod} days
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-text">{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="form-actions">
          <Button
            type="submit"
            disabled={!isConnected || isLoading}
            loading={isLoading}
            variant="primary"
            className="submit-button"
          >
            {action === 'stake' ? 'Stake Tokens' : 'Unstake Tokens'}
          </Button>

          {selectedPool && (
            <Button
              type="button"
              onClick={handleClaimRewards}
              disabled={!isConnected || isLoading}
              variant="outline"
              className="claim-button"
            >
              Claim Rewards
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default StakingForm;