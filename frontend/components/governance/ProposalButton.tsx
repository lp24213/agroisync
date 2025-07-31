'use client';

import { Button } from '@/components/ui/Button';
import React, { useState } from 'react';

interface ProposalButtonProps {
  proposalId: string;
  onVote: (proposalId: string, vote: 'yes' | 'no' | 'abstain') => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export const ProposalButton: React.FC<ProposalButtonProps> = ({
  proposalId,
  onVote,
  disabled = false,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVote, setSelectedVote] = useState<'yes' | 'no' | 'abstain' | null>(null);

  const handleVote = async (vote: 'yes' | 'no' | 'abstain') => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    setSelectedVote(vote);

    try {
      await onVote(proposalId, vote);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsLoading(false);
      setSelectedVote(null);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        onClick={() => handleVote('yes')}
        disabled={disabled || isLoading}
        className={`flex-1 ${selectedVote === 'yes' ? 'bg-green-600 hover:bg-green-700' : ''}`}
      >
        {isLoading && selectedVote === 'yes' ? 'Votando...' : 'Sim'}
      </Button>

      <Button
        onClick={() => handleVote('no')}
        disabled={disabled || isLoading}
        className={`flex-1 ${selectedVote === 'no' ? 'bg-red-600 hover:bg-red-700' : ''}`}
      >
        {isLoading && selectedVote === 'no' ? 'Votando...' : 'Não'}
      </Button>

      <Button
        onClick={() => handleVote('abstain')}
        disabled={disabled || isLoading}
        className={`flex-1 ${selectedVote === 'abstain' ? 'bg-gray-600 hover:bg-gray-700' : ''}`}
      >
        {isLoading && selectedVote === 'abstain' ? 'Votando...' : 'Abster'}
      </Button>
    </div>
  );
};
