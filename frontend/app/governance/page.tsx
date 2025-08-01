'use client';

import { ProposalFilter } from '../../components/governance/ProposalFilter';
import { Button } from '../../components/ui/Button';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Info,
  RefreshCw,
  Users,
  Vote,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Types
interface ProposalVotes {
  for: number;
  against: number;
  abstain: number;
}

interface ProposalDetail {
  title: string;
  content: string;
}

interface ProposalComment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  votes: number;
}

interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  startDate: string;
  endDate: string;
  votes: ProposalVotes;
  quorum: number;
  details: ProposalDetail[];
  comments: ProposalComment[];
}

interface ProposalCardProps {
  proposal: Proposal;
  onVote: (proposalId: number, voteType: string) => void;
}

type VoteType = 'for' | 'against' | 'abstain' | null;

const proposals = [
  {
    id: 1,
    title: 'AIP-01: Increase Farming Rewards by 20%',
    description:
      'This proposal aims to increase the farming rewards for all pools by 20% to incentivize more liquidity providers and boost the ecosystem growth.',
    proposer: '8xzt...3kWF',
    status: 'active' as const,
    startDate: '2023-10-15',
    endDate: '2023-10-22',
    votes: {
      for: 1250000,
      against: 450000,
      abstain: 75000,
    },
    quorum: 1500000,
    details: [
      {
        title: 'Background',
        content:
          'The current farming rewards have been in place for 3 months. During this period, we have seen a steady growth in TVL, but the rate of growth has slowed down in the past month. To maintain the momentum and attract more liquidity providers, we propose increasing the rewards.',
      },
      {
        title: 'Proposal',
        content:
          'Increase the farming rewards for all pools by 20% for the next 3 months. This will be funded from the ecosystem development fund, which currently has sufficient reserves to support this increase without affecting other planned initiatives.',
      },
      {
        title: 'Benefits',
        content:
          'Higher rewards will attract more liquidity providers, increasing the TVL and making the platform more attractive for traders. This, in turn, will generate more trading fees and create a positive feedback loop for the ecosystem.',
      },
      {
        title: 'Risks',
        content:
          'The increased rewards will accelerate the token emission, which might put downward pressure on the token price if not matched by increased demand. However, we believe that the benefits of higher TVL and more trading activity will outweigh this risk.',
      },
    ],
    comments: [
      {
        id: 1,
        author: 'CryptoFarmer',
        content:
          'I strongly support this proposal. Higher rewards will definitely attract more liquidity and benefit the ecosystem in the long run.',
        timestamp: '2 days ago',
        votes: 45,
      },
      {
        id: 2,
        author: 'TokenAnalyst',
        content:
          'While I understand the intention, I am concerned about the increased token emission. Have we considered other ways to incentivize liquidity providers?',
        timestamp: '1 day ago',
        votes: 32,
      },
      {
        id: 3,
        author: 'DeFiMaximalist',
        content:
          'The proposal makes sense, but I would suggest a gradual increase rather than a sudden 20% jump. Perhaps 10% now and another 10% after evaluating the impact?',
        timestamp: '12 hours ago',
        votes: 18,
      },
    ],
  },
  {
    id: 2,
    title: 'AIP-02: Launch Sustainable Farming Initiative',
    description:
      'This proposal suggests allocating 5% of the treasury to fund real-world sustainable farming projects that align with our mission of promoting agricultural technology.',
    proposer: '3jKm...9pQr',
    status: 'pending' as const,
    startDate: '2023-10-25',
    endDate: '2023-11-01',
    votes: {
      for: 0,
      against: 0,
      abstain: 0,
    },
    quorum: 1500000,
    details: [
      {
        title: 'Background',
        content:
          'AgroTM was founded with a mission to bridge the gap between blockchain technology and sustainable agriculture. While we have made significant progress in building a robust DeFi platform, we have yet to make a direct impact on real-world agricultural practices.',
      },
      {
        title: 'Proposal',
        content:
          'Allocate 5% of the treasury (approximately 2.5 million AGROTM tokens) to establish a Sustainable Farming Fund. This fund will provide grants to innovative agricultural projects that leverage technology to improve sustainability, efficiency, and yield.',
      },
      {
        title: 'Implementation',
        content:
          'A committee of 5 members (3 from the core team and 2 elected by the community) will oversee the fund. Grant applications will be reviewed quarterly, and approved projects will receive funding in AGROTM tokens. Projects will be required to provide regular updates and demonstrate measurable impact.',
      },
      {
        title: 'Benefits',
        content:
          'This initiative will strengthen our brand as a leader in the intersection of blockchain and agriculture, attract partners from the agricultural sector, and create real-world use cases for AGROTM tokens. It will also generate positive PR and potentially attract ESG-focused investors.',
      },
    ],
    comments: [
      {
        author: 'GreenInvestor',
        avatar: '/images/avatar4.jpg',
        content:
          'This is exactly the kind of initiative that attracted me to AGROTM in the first place. Fully support this proposal!',
        timestamp: '3 hours ago',
        votes: 12,
      },
      {
        author: 'FarmTech',
        avatar: '/images/avatar5.jpg',
        content:
          'As someone working in agricultural technology, I see immense potential in this fund. Would love to see specific focus areas or criteria for the grants.',
        timestamp: '2 hours ago',
        votes: 8,
      },
    ],
  },
  {
    id: 3,
    title: 'AIP-03: Reduce Transaction Fees by 25%',
    description:
      'This proposal suggests reducing the platform transaction fees from 0.3% to 0.225% to make the platform more competitive and attract more users.',
    proposer: '5tRw...7zXy',
    status: 'passed' as const,
    startDate: '2023-09-28',
    endDate: '2023-10-05',
    votes: {
      for: 1850000,
      against: 320000,
      abstain: 130000,
    },
    quorum: 1500000,
    details: [
      {
        title: 'Background',
        content:
          'Our current transaction fee of 0.3% is in line with many DEXs but higher than some of our direct competitors who charge between 0.1% and 0.25%. This has been identified as a barrier to attracting high-volume traders.',
      },
      {
        title: 'Proposal',
        content:
          'Reduce the transaction fee from 0.3% to 0.225% (a 25% reduction). This will apply to all trading pairs on the platform. The fee distribution model will remain unchanged: 60% to liquidity providers, 20% to stakers, and 20% to the treasury.',
      },
      {
        title: 'Expected Impact',
        content:
          "Based on our analysis, we expect a 15-20% increase in trading volume following the fee reduction. While this won't fully offset the revenue loss in the short term, we project that the increased volume will lead to higher overall revenue within 3-4 months.",
      },
      {
        title: 'Implementation Timeline',
        content:
          'If approved, the fee reduction will be implemented within 2 weeks of the proposal passing. We will monitor the impact closely and report back to the community after 3 months.',
      },
    ],
    comments: [
      {
        id: 6,
        author: 'TradingWhale',
        content:
          'This is a smart move. Lower fees will definitely attract more volume, especially from algorithmic traders and arbitrageurs.',
        timestamp: '1 week ago',
        votes: 65,
      },
      {
        id: 7,
        author: 'LiquidityProvider',
        content:
          "As a liquidity provider, I'm concerned about the reduced income. But if it truly leads to higher volume, it might be worth it in the long run.",
        timestamp: '6 days ago',
        votes: 41,
      },
      {
        id: 8,
        author: 'TokenomicsExpert',
        content:
          'The analysis seems sound. I would suggest implementing this gradually - perhaps start with a 15% reduction and then move to 25% if the volume increase meets expectations.',
        timestamp: '5 days ago',
        votes: 37,
      },
    ],
  },
  {
    id: 4,
    title: 'AIP-04: Integrate with Solana Pay for Merchant Payments',
    description:
      'This proposal suggests integrating with Solana Pay to enable merchants to accept AGROTM tokens as payment, expanding the token utility beyond the DeFi ecosystem.',
    proposer: '7yUv...2mNb',
    status: 'rejected' as const,
    startDate: '2023-09-10',
    endDate: '2023-09-17',
    votes: {
      for: 980000,
      against: 1120000,
      abstain: 250000,
    },
    quorum: 1500000,
    details: [
      {
        title: 'Background',
        content:
          'Currently, AGROTM tokens are primarily used within our DeFi ecosystem for staking, farming, and governance. Expanding the utility to real-world payments would create additional demand and use cases for the token.',
      },
      {
        title: 'Proposal',
        content:
          "Integrate with Solana Pay to enable merchants to accept AGROTM tokens as payment. Develop a merchant dashboard for tracking payments, managing inventory, and converting tokens to stablecoins if desired. Initially target agricultural businesses and farmers' markets as early adopters.",
      },
      {
        title: 'Technical Implementation',
        content:
          'The integration will require developing a payment gateway that connects to Solana Pay, creating merchant onboarding tools, and building a user-friendly mobile interface for customers. We estimate the development will take 3 months and cost approximately 500,000 AGROTM tokens from the development fund.',
      },
      {
        title: 'Benefits and Challenges',
        content:
          'Benefits include expanded token utility, increased adoption, and potential partnerships with agricultural businesses. Challenges include merchant education, volatility concerns, and competition from established payment solutions. We plan to address these through comprehensive documentation, optional stablecoin conversion, and targeted marketing highlighting our unique agricultural focus.',
      },
    ],
    comments: [
      {
        id: 9,
        author: 'PaymentGuru',
        avatar: '/images/avatar9.jpg',
        content:
          'While I like the idea in principle, I think the cost and timeline are underestimated. Payment integrations are complex and require significant testing and compliance work.',
        timestamp: '3 weeks ago',
        votes: 52,
      },
      {
        id: 10,
        author: 'AgriBusinessOwner',
        avatar: '/images/avatar10.jpg',
        content:
          "As someone running an agricultural business, I'm not convinced there's enough demand for crypto payments yet. Most of our customers still prefer traditional payment methods.",
        timestamp: '2 weeks ago',
        votes: 48,
      },
      {
        id: 11,
        author: 'BlockchainDeveloper',
        avatar: '/images/avatar11.jpg',
        content:
          'I think this is premature. We should focus on strengthening our core DeFi offerings before expanding into payments. The resources could be better used elsewhere.',
        timestamp: '2 weeks ago',
        votes: 61,
      },
    ],
  },
  {
    id: 5,
    title: 'AIP-05: Establish Cross-Chain Bridges to Ethereum and BSC',
    description:
      'This proposal suggests building bridges to Ethereum and Binance Smart Chain to expand the reach of AGROTM tokens and tap into larger liquidity pools.',
    proposer: '2pQz...6rTy',
    status: 'active', // active, passed, rejected, pending
    startDate: '2023-10-12',
    endDate: '2023-10-19',
    votes: {
      for: 950000,
      against: 780000,
      abstain: 120000,
    },
    quorum: 1500000,
    details: [
      {
        title: 'Background',
        content:
          'While Solana offers excellent performance and low fees, Ethereum and Binance Smart Chain have larger user bases and more established DeFi ecosystems. By building bridges to these chains, we can expand the reach of AGROTM tokens and tap into these larger liquidity pools.',
      },
      {
        title: 'Proposal',
        content:
          'Develop and deploy cross-chain bridges connecting our Solana-based AGROTM token to Ethereum (as an ERC-20 token) and Binance Smart Chain (as a BEP-20 token). Users will be able to transfer their tokens between chains with minimal fees and waiting times.',
      },
      {
        title: 'Technical Approach',
        content:
          'We will use a combination of Wormhole for the Ethereum bridge and a custom-built solution for the BSC bridge. Both will implement multi-signature security, rate limiting, and comprehensive monitoring to ensure safe and reliable operation. The bridges will be audited by a reputable security firm before deployment.',
      },
      {
        title: 'Timeline and Budget',
        content:
          'Development is estimated to take 4 months, with the Ethereum bridge launching first (in 3 months) followed by the BSC bridge. The total budget required is 1.2 million AGROTM tokens, allocated from the ecosystem development fund.',
      },
    ],
    comments: [
      {
        id: 12,
        author: 'CrossChainEnthusiast',
        avatar: '/images/avatar12.jpg',
        content:
          'This is a crucial step for growth. Being limited to one chain severely restricts our potential user base. Fully support this!',
        timestamp: '4 days ago',
        votes: 39,
      },
      {
        id: 13,
        author: 'SecurityFirst',
        avatar: '/images/avatar13.jpg',
        content:
          "Bridge security is paramount. We've seen numerous bridge hacks in the past year. I would allocate more resources to security audits and consider using established bridge solutions rather than building custom ones.",
        timestamp: '3 days ago',
        votes: 42,
      },
      {
        id: 14,
        author: 'SolanaMaximalist',
        avatar: '/images/avatar14.jpg',
        content:
          "I'm against this proposal. We should focus on building the best experience on Solana rather than diluting our efforts across multiple chains. Solana's ecosystem is growing rapidly and will soon rival Ethereum's.",
        timestamp: '2 days ago',
        votes: 31,
      },
    ],
  },
];

const ProposalCard = ({ proposal, onVote }: ProposalCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'details' | 'comments'>('details');
  const [voteType, setVoteType] = useState<VoteType>(null);
  const [isVoting, setIsVoting] = useState(false);

  const totalVotes = proposal.votes.for + proposal.votes.against + proposal.votes.abstain;
  const forPercentage = totalVotes > 0 ? (proposal.votes.for / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (proposal.votes.against / totalVotes) * 100 : 0;
  const abstainPercentage = totalVotes > 0 ? (proposal.votes.abstain / totalVotes) * 100 : 0;
  const quorumPercentage = totalVotes > 0 ? (totalVotes / proposal.quorum) * 100 : 0;

  const handleVote = () => {
    if (!voteType) return;

    setIsVoting(true);

    // Simulate voting process
    setTimeout(() => {
      onVote(proposal.id, voteType);
      setIsVoting(false);
      setVoteType(null);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-agro-blue';
      case 'passed':
        return 'text-agro-green';
      case 'rejected':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Vote className='h-5 w-5 text-agro-blue' />;
      case 'passed':
        return <CheckCircle2 className='h-5 w-5 text-agro-green' />;
      case 'rejected':
        return <XCircle className='h-5 w-5 text-red-500' />;
      case 'pending':
        return <Clock className='h-5 w-5 text-yellow-500' />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <motion.div
      className='cyberpunk-border p-0.5 rounded-lg overflow-hidden'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='bg-agro-darker/90 backdrop-blur-md rounded-lg overflow-hidden'>
        {/* Proposal Header */}
        <div className='p-5'>
          <div className='flex items-start justify-between mb-3'>
            <div>
              <div className='flex items-center space-x-2 mb-1'>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(proposal.status)} bg-opacity-20`}
                >
                  {getStatusIcon(proposal.status)}
                  <span className='ml-1 capitalize'>{proposal.status}</span>
                </div>
                <div className='text-xs text-gray-400'>
                  {formatDate(proposal.startDate)} - {formatDate(proposal.endDate)}
                </div>
              </div>
              <h3 className='text-xl font-bold text-white'>{proposal.title}</h3>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className='p-2 rounded-lg bg-agro-dark/50 text-gray-300 hover:bg-agro-dark/80 hover:text-white transition-colors'
            >
              {expanded ? <ChevronUp className='h-5 w-5' /> : <ChevronDown className='h-5 w-5' />}
            </button>
          </div>

          <p className='text-gray-300 mb-4'>{proposal.description}</p>

          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div>
              <p className='text-sm text-gray-400 mb-1'>Proposer</p>
              <p className='text-white font-mono'>{proposal.proposer}</p>
            </div>
            <div>
              <p className='text-sm text-gray-400 mb-1'>Quorum</p>
              <div className='flex items-center'>
                <p className='text-white'>
                  {formatNumber(totalVotes)} / {formatNumber(proposal.quorum)}
                </p>
                <div className='ml-2 w-16 h-2 bg-agro-dark/50 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-agro-blue'
                    style={{ width: `${Math.min(quorumPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Voting Results */}
          <div className='mb-4'>
            <div className='flex justify-between items-center mb-1'>
              <p className='text-sm text-gray-400'>For</p>
              <p className='text-sm text-white'>
                {formatNumber(proposal.votes.for)} ({forPercentage.toFixed(1)}%)
              </p>
            </div>
            <div className='w-full h-2 bg-agro-dark/50 rounded-full overflow-hidden mb-2'>
              <div className='h-full bg-agro-green' style={{ width: `${forPercentage}%` }}></div>
            </div>

            <div className='flex justify-between items-center mb-1'>
              <p className='text-sm text-gray-400'>Against</p>
              <p className='text-sm text-white'>
                {formatNumber(proposal.votes.against)} ({againstPercentage.toFixed(1)}%)
              </p>
            </div>
            <div className='w-full h-2 bg-agro-dark/50 rounded-full overflow-hidden mb-2'>
              <div className='h-full bg-red-500' style={{ width: `${againstPercentage}%` }}></div>
            </div>

            <div className='flex justify-between items-center mb-1'>
              <p className='text-sm text-gray-400'>Abstain</p>
              <p className='text-sm text-white'>
                {formatNumber(proposal.votes.abstain)} ({abstainPercentage.toFixed(1)}%)
              </p>
            </div>
            <div className='w-full h-2 bg-agro-dark/50 rounded-full overflow-hidden'>
              <div
                className='h-full bg-yellow-500'
                style={{ width: `${abstainPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Voting Actions (only for active proposals) */}
          {proposal.status === 'active' && (
            <div className='bg-agro-dark/30 p-4 rounded-lg'>
              <h4 className='text-white font-medium mb-3'>Cast Your Vote</h4>
              <div className='flex space-x-3 mb-4'>
                <button
                  onClick={() => setVoteType('for')}
                  className={`flex-1 py-2 rounded-lg text-white ${voteType === 'for' ? 'bg-agro-green' : 'bg-agro-dark/50 hover:bg-agro-dark/80'} transition-colors`}
                >
                  For
                </button>
                <button
                  onClick={() => setVoteType('against')}
                  className={`flex-1 py-2 rounded-lg text-white ${voteType === 'against' ? 'bg-red-500' : 'bg-agro-dark/50 hover:bg-agro-dark/80'} transition-colors`}
                >
                  Against
                </button>
                <button
                  onClick={() => setVoteType('abstain')}
                  className={`flex-1 py-2 rounded-lg text-white ${voteType === 'abstain' ? 'bg-yellow-500' : 'bg-agro-dark/50 hover:bg-agro-dark/80'} transition-colors`}
                >
                  Abstain
                </button>
              </div>
              <motion.button
                onClick={handleVote}
                disabled={!voteType || isVoting}
                className={`w-full py-3 rounded-lg font-medium text-white ${!voteType ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-agro-blue to-agro-green hover:opacity-90'} transition-all`}
                whileHover={voteType && !isVoting ? { scale: 1.02 } : {}}
                whileTap={voteType && !isVoting ? { scale: 0.98 } : {}}
              >
                {isVoting ? (
                  <span className='flex items-center justify-center'>
                    <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                    Submitting Vote
                  </span>
                ) : (
                  'Submit Vote'
                )}
              </motion.button>
            </div>
          )}
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
                <div className='flex space-x-4 mb-4'>
                  <button
                    onClick={() => setSelectedTab('details')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedTab === 'details' ? 'bg-agro-blue text-white' : 'bg-agro-dark/50 text-gray-300 hover:bg-agro-dark/80'} transition-colors`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setSelectedTab('comments')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedTab === 'comments' ? 'bg-agro-blue text-white' : 'bg-agro-dark/50 text-gray-300 hover:bg-agro-dark/80'} transition-colors`}
                  >
                    Comments ({proposal.comments.length})
                  </button>
                </div>

                {selectedTab === 'details' && (
                  <div className='space-y-4'>
                    {proposal.details.map((detail, index) => (
                      <div key={index} className='bg-agro-dark/30 p-4 rounded-lg'>
                        <h4 className='text-white font-medium mb-2'>{detail.title}</h4>
                        <p className='text-gray-300'>{detail.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTab === 'comments' && (
                  <div className='space-y-4'>
                    {proposal.comments.map((comment, index) => (
                      <div key={index} className='bg-agro-dark/30 p-4 rounded-lg'>
                        <div className='flex items-start space-x-3 mb-3'>
                          <div className='w-10 h-10 rounded-full bg-agro-dark/50 flex items-center justify-center'>
                            <span className='text-white font-medium'>
                              {comment.author.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className='flex items-center'>
                              <h5 className='text-white font-medium'>{comment.author}</h5>
                              <span className='text-xs text-gray-400 ml-2'>
                                {comment.timestamp}
                              </span>
                            </div>
                            <p className='text-gray-300 mt-1'>{comment.content}</p>
                          </div>
                        </div>
                        <div className='flex justify-end items-center'>
                          <button className='flex items-center space-x-1 text-gray-400 hover:text-white transition-colors'>
                            <Vote className='h-4 w-4' />
                            <span>{comment.votes}</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className='bg-agro-dark/30 p-4 rounded-lg'>
                      <textarea
                        placeholder='Add your comment...'
                        className='w-full bg-agro-dark/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-agro-blue transition-colors resize-none h-24'
                      ></textarea>
                      <div className='flex justify-end mt-2'>
                        <button className='px-4 py-2 rounded-lg bg-agro-blue text-white hover:bg-agro-blue/90 transition-colors text-sm font-medium'>
                          Post Comment
                        </button>
                      </div>
                    </div>
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

export default function GovernancePage() {
  const [activeProposals, setActiveProposals] = useState(proposals);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, passed, rejected, pending
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, most_votes
  const [userVotingPower] = useState(50000);
  const [totalProposals] = useState({
    active: proposals.filter(p => p.status === 'active').length,
    passed: proposals.filter(p => p.status === 'passed').length,
    rejected: proposals.filter(p => p.status === 'rejected').length,
    pending: proposals.filter(p => p.status === 'pending').length,
  });

  // Filter and sort proposals
  useEffect(() => {
    let filtered = [...proposals];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        proposal =>
          proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(proposal => proposal.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'oldest':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'most_votes': {
          const totalVotesA = a.votes.for + a.votes.against + a.votes.abstain;
          const totalVotesB = b.votes.for + b.votes.against + b.votes.abstain;
          return totalVotesB - totalVotesA;
        }
        default:
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
    });

    setActiveProposals(filtered);
  }, [searchTerm, filterStatus, sortBy]);

  const handleVote = (proposalId: number, voteType: string) => {
    // In a real app, this would call a contract method
    console.log(`Voting ${voteType} on proposal ${proposalId}`);
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
              Governance
            </span>
          </h1>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
            Shape the future of AgroTM through community-driven proposals and voting
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
              <p className='text-gray-400 mb-2'>Your Voting Power</p>
              <div className='flex items-baseline'>
                <h3 className='text-3xl font-bold text-white'>
                  {userVotingPower.toLocaleString()} AGROTM
                </h3>
              </div>
              <div className='mt-2 text-sm text-gray-400 flex items-center'>
                <Info className='h-4 w-4 mr-1' />
                <span>Voting power equals your staked AGROTM tokens</span>
              </div>
            </div>
          </div>

          <div className='cyberpunk-border p-0.5 rounded-lg overflow-hidden'>
            <div className='bg-agro-darker/90 backdrop-blur-md p-6 rounded-lg'>
              <p className='text-gray-400 mb-2'>Proposal Status</p>
              <div className='grid grid-cols-2 gap-2'>
                <div className='bg-agro-dark/30 p-2 rounded-lg'>
                  <div className='flex items-center'>
                    <Vote className='h-4 w-4 text-agro-blue mr-1' />
                    <span className='text-sm text-gray-300'>Active</span>
                  </div>
                  <p className='text-xl font-bold text-white'>{totalProposals.active}</p>
                </div>
                <div className='bg-agro-dark/30 p-2 rounded-lg'>
                  <div className='flex items-center'>
                    <CheckCircle2 className='h-4 w-4 text-agro-green mr-1' />
                    <span className='text-sm text-gray-300'>Passed</span>
                  </div>
                  <p className='text-xl font-bold text-white'>{totalProposals.passed}</p>
                </div>
                <div className='bg-agro-dark/30 p-2 rounded-lg'>
                  <div className='flex items-center'>
                    <XCircle className='h-4 w-4 text-red-500 mr-1' />
                    <span className='text-sm text-gray-300'>Rejected</span>
                  </div>
                  <p className='text-xl font-bold text-white'>{totalProposals.rejected}</p>
                </div>
                <div className='bg-agro-dark/30 p-2 rounded-lg'>
                  <div className='flex items-center'>
                    <Clock className='h-4 w-4 text-yellow-500 mr-1' />
                    <span className='text-sm text-gray-300'>Pending</span>
                  </div>
                  <p className='text-xl font-bold text-white'>{totalProposals.pending}</p>
                </div>
              </div>
            </div>
          </div>

          <div className='cyberpunk-border p-0.5 rounded-lg overflow-hidden'>
            <div className='bg-agro-darker/90 backdrop-blur-md p-6 rounded-lg'>
              <p className='text-gray-400 mb-2'>Create Proposal</p>
              <p className='text-sm text-gray-300 mb-4'>
                Have an idea to improve AgroTM? Create a proposal and let the community decide.
              </p>
              <Button
                onClick={() => window.open('#', '_blank')}
                className='bg-agro-blue hover:bg-agro-blue/90'
              >
                Create Proposal
              </Button>
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
          <ProposalFilter
            onSearch={setSearchTerm}
            onFilter={setFilterStatus}
            onSort={setSortBy}
            currentFilter={filterStatus}
            currentSort={sortBy}
          />
        </motion.div>

        {/* Proposals List */}
        <div className='space-y-6'>
          {activeProposals.length > 0 ? (
            activeProposals.map(proposal => (
              <ProposalCard key={proposal.id} proposal={proposal as Proposal} onVote={handleVote} />
            ))
          ) : (
            <div className='text-center py-12 bg-agro-dark/30 rounded-lg'>
              <AlertCircle className='h-12 w-12 text-gray-500 mx-auto mb-4' />
              <h3 className='text-xl font-bold text-white mb-2'>No Proposals Found</h3>
              <p className='text-gray-400'>Try adjusting your filters or search term</p>
            </div>
          )}
        </div>

        {/* Governance Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='mt-12'
        >
          <div className='cyberpunk-border p-0.5 rounded-lg overflow-hidden'>
            <div className='bg-agro-darker/90 backdrop-blur-md p-6 rounded-lg'>
              <h2 className='text-2xl font-bold text-white mb-4'>Governance Guide</h2>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-agro-dark/30 p-4 rounded-lg'>
                  <div className='flex items-center space-x-3 mb-3'>
                    <div className='w-10 h-10 rounded-lg bg-agro-blue/20 flex items-center justify-center'>
                      <Users className='h-5 w-5 text-agro-blue' />
                    </div>
                    <h3 className='text-lg font-bold text-white'>Participation</h3>
                  </div>
                  <p className='text-gray-300 text-sm'>
                    To participate in governance, you need to stake AGROTM tokens. Your voting power
                    is proportional to your staked amount. The more you stake, the more influence
                    you have.
                  </p>
                </div>

                <div className='bg-agro-dark/30 p-4 rounded-lg'>
                  <div className='flex items-center space-x-3 mb-3'>
                    <div className='w-10 h-10 rounded-lg bg-agro-green/20 flex items-center justify-center'>
                      <Vote className='h-5 w-5 text-agro-green' />
                    </div>
                    <h3 className='text-lg font-bold text-white'>Voting</h3>
                  </div>
                  <p className='text-gray-300 text-sm'>
                    Each proposal has a voting period of 7 days. You can vote &quot;For&quot;,
                    &quot;Against&quot;, or &quot;Abstain&quot;. For a proposal to pass, it must
                    reach quorum (minimum participation) and have more &quot;For&quot; votes than
                    &quot;Against&quot;.
                  </p>
                </div>

                <div className='bg-agro-dark/30 p-4 rounded-lg'>
                  <div className='flex items-center space-x-3 mb-3'>
                    <div className='w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center'>
                      <BarChart3 className='h-5 w-5 text-yellow-500' />
                    </div>
                    <h3 className='text-lg font-bold text-white'>Proposals</h3>
                  </div>
                  <p className='text-gray-300 text-sm'>
                    To create a proposal, you need to stake at least 10,000 AGROTM tokens. Proposals
                    should be well-researched and include clear implementation details. The
                    community can discuss and suggest improvements before voting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
