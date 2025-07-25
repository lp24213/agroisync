'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '@/hooks/useWeb3';
import { AnimatedCard } from '@/components/AnimatedCard';
import { NeonButton } from '@/components/NeonButton';
import { Modal } from '@/components/Modal';
import {
  Vote,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Minus,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  startTime: Date;
  endTime: Date;
  votesFor: number;
  votesAgainst: number;
  abstain: number;
  totalVotes: number;
  quorum: number;
  category: 'treasury' | 'protocol' | 'governance' | 'partnership';
  impact: 'low' | 'medium' | 'high' | 'critical';
  executionDelay: number;
  minVotingPower: number;
}

interface Vote {
  proposalId: string;
  voter: string;
  choice: 'for' | 'against' | 'abstain';
  votingPower: number;
  timestamp: Date;
  reason?: string;
}

const mockProposals: Proposal[] = [
  {
    id: 'prop-001',
    title: 'Increase Staking Rewards by 2%',
    description:
      'Proposal to increase the annual staking rewards from 12% to 14% to incentivize more participation in the network.',
    proposer: '0x1234...5678',
    status: 'active',
    startTime: new Date(Date.now() - 86400000),
    endTime: new Date(Date.now() + 518400000),
    votesFor: 1250000,
    votesAgainst: 340000,
    abstain: 85000,
    totalVotes: 1675000,
    quorum: 1000000,
    category: 'protocol',
    impact: 'medium',
    executionDelay: 172800,
    minVotingPower: 1000,
  },
  {
    id: 'prop-002',
    title: 'Treasury Allocation for Marketing',
    description:
      'Allocate 500,000 AGROTM tokens from treasury for Q1 2024 marketing initiatives and partnerships.',
    proposer: '0x9876...4321',
    status: 'active',
    startTime: new Date(Date.now() - 172800000),
    endTime: new Date(Date.now() + 432000000),
    votesFor: 890000,
    votesAgainst: 1200000,
    abstain: 150000,
    totalVotes: 2240000,
    quorum: 1500000,
    category: 'treasury',
    impact: 'high',
    executionDelay: 259200,
    minVotingPower: 5000,
  },
];

export function GovernanceVoting() {
  const { isConnected, connectWallet } = useWeb3();
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [voteChoice, setVoteChoice] = useState<'for' | 'against' | 'abstain'>('for');
  const [voteReason, setVoteReason] = useState('');
  const [userVotingPower] = useState(25000);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'passed' | 'rejected'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-blue-400 bg-blue-400/20';
      case 'passed':
        return 'text-green-400 bg-green-400/20';
      case 'rejected':
        return 'text-red-400 bg-red-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'treasury':
        return 'text-purple-400 bg-purple-400/20';
      case 'protocol':
        return 'text-blue-400 bg-blue-400/20';
      case 'governance':
        return 'text-green-400 bg-green-400/20';
      case 'partnership':
        return 'text-orange-400 bg-orange-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-orange-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const calculateProgress = (proposal: Proposal) => {
    const total = proposal.votesFor + proposal.votesAgainst + proposal.abstain;
    return total > 0
      ? {
          for: (proposal.votesFor / total) * 100,
          against: (proposal.votesAgainst / total) * 100,
          abstain: (proposal.abstain / total) * 100,
        }
      : { for: 0, against: 0, abstain: 0 };
  };

  const isQuorumMet = (proposal: Proposal) => {
    return proposal.totalVotes >= proposal.quorum;
  };

  const getTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const submitVote = async () => {
    if (!selectedProposal || !isConnected) return;

    setLoading(true);
    try {
      // Simulate vote submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const updatedProposals = proposals.map((p) => {
        if (p.id === selectedProposal.id) {
          const newProposal = { ...p };
          if (voteChoice === 'for') {
            newProposal.votesFor += userVotingPower;
          } else if (voteChoice === 'against') {
            newProposal.votesAgainst += userVotingPower;
          } else {
            newProposal.abstain += userVotingPower;
          }
          newProposal.totalVotes += userVotingPower;
          return newProposal;
        }
        return p;
      });

      setProposals(updatedProposals);
      setShowVoteModal(false);
      setVoteReason('');
    } catch (error) {
      console.error('Vote submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProposals = proposals.filter((p) => filter === 'all' || p.status === filter);

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
                <Vote className="w-8 h-8 mr-3 text-blue-400" />
                Governance
              </h1>
              <p className="text-gray-400 mt-1">
                Participate in protocol governance and shape the future of AGROTM
              </p>
            </div>

            <div className="flex items-center gap-4">
              {isConnected && (
                <div className="text-right">
                  <p className="text-sm text-gray-400">Voting Power</p>
                  <p className="text-lg font-semibold text-white">
                    {userVotingPower.toLocaleString()} AGROTM
                  </p>
                </div>
              )}

              {!isConnected && <NeonButton onClick={connectWallet}>Connect Wallet</NeonButton>}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-wrap gap-2">
            {['all', 'active', 'passed', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Proposals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProposals.map((proposal, index) => {
            const progress = calculateProgress(proposal);
            const quorumMet = isQuorumMet(proposal);
            const timeRemaining = getTimeRemaining(proposal.endTime);

            return (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AnimatedCard className="p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(proposal.status)}`}
                        >
                          {proposal.status.toUpperCase()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(proposal.category)}`}
                        >
                          {proposal.category.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{proposal.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-3">{proposal.description}</p>
                    </div>
                  </div>

                  {/* Voting Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Voting Progress</span>
                      <span className="text-sm text-gray-400">
                        {proposal.totalVotes.toLocaleString()} votes
                      </span>
                    </div>

                    <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                      <div className="flex h-full rounded-full overflow-hidden">
                        <div className="bg-green-500" style={{ width: `${progress.for}%` }} />
                        <div className="bg-red-500" style={{ width: `${progress.against}%` }} />
                        <div className="bg-gray-500" style={{ width: `${progress.abstain}%` }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <ThumbsUp className="w-4 h-4 text-green-400 mr-1" />
                        <span className="text-white">{progress.for.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center">
                        <ThumbsDown className="w-4 h-4 text-red-400 mr-1" />
                        <span className="text-white">{progress.against.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center">
                        <Minus className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-white">{progress.abstain.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Proposal Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-400">Quorum</p>
                      <div className="flex items-center">
                        {quorumMet ? (
                          <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 mr-1" />
                        )}
                        <span className="text-white">
                          {((proposal.totalVotes / proposal.quorum) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400">Time Remaining</p>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-blue-400 mr-1" />
                        <span className="text-white">{timeRemaining}</span>
                      </div>
                    </div>
                  </div>

                  {/* Impact & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle
                        className={`w-4 h-4 mr-1 ${getImpactColor(proposal.impact)}`}
                      />
                      <span className={`text-sm font-semibold ${getImpactColor(proposal.impact)}`}>
                        {proposal.impact.toUpperCase()} IMPACT
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedProposal(proposal)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View Details
                      </button>
                      {proposal.status === 'active' && isConnected && (
                        <NeonButton
                          onClick={() => {
                            setSelectedProposal(proposal);
                            setShowVoteModal(true);
                          }}
                          size="sm"
                        >
                          Vote
                        </NeonButton>
                      )}
                    </div>
                  </div>
                </AnimatedCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Vote Modal */}
      <Modal
        isOpen={showVoteModal}
        onClose={() => setShowVoteModal(false)}
        title="Cast Your Vote"
        size="md"
      >
        {selectedProposal && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">{selectedProposal.title}</h3>
              <p className="text-gray-400 text-sm">
                Your voting power: {userVotingPower.toLocaleString()} AGROTM
              </p>
            </div>

            {/* Vote Options */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-300">Choose your vote:</p>
              {[
                { value: 'for', label: 'For', icon: ThumbsUp, color: 'green' },
                { value: 'against', label: 'Against', icon: ThumbsDown, color: 'red' },
                { value: 'abstain', label: 'Abstain', icon: Minus, color: 'gray' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setVoteChoice(option.value as any)}
                  className={`w-full p-4 rounded-lg border-2 transition-colors flex items-center ${
                    voteChoice === option.value
                      ? `border-${option.color}-400 bg-${option.color}-400/10`
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <option.icon className={`w-5 h-5 mr-3 text-${option.color}-400`} />
                  <span className="text-white font-medium">{option.label}</span>
                </button>
              ))}
            </div>

            {/* Vote Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reason (Optional)
              </label>
              <textarea
                value={voteReason}
                onChange={(e) => setVoteReason(e.target.value)}
                placeholder="Explain your vote..."
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
                rows={3}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowVoteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <NeonButton onClick={submitVote} loading={loading} className="flex-1">
                Submit Vote
              </NeonButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
