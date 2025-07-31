'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Eye,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Hash,
  Copy,
} from 'lucide-react';

const transactions = [
  {
    id: '0x1234567890abcdef...',
    type: 'stake',
    status: 'completed',
    amount: '5,000 AGROTM',
    value: '$750.00',
    timestamp: '2024-01-15T10:30:00Z',
    blockNumber: 12345678,
    gasUsed: '0.0023 ETH',
    gasPrice: '25 Gwei',
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    pool: 'Flexible Staking',
    apy: '8.5%',
  },
  {
    id: '0xabcdef1234567890...',
    type: 'reward',
    status: 'completed',
    amount: '150 AGROTM',
    value: '$22.50',
    timestamp: '2024-01-15T09:15:00Z',
    blockNumber: 12345675,
    gasUsed: '0.0018 ETH',
    gasPrice: '25 Gwei',
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    pool: '90-Day Lock',
    apy: '15.7%',
  },
  {
    id: '0x7890abcdef123456...',
    type: 'unstake',
    status: 'pending',
    amount: '2,000 AGROTM',
    value: '$300.00',
    timestamp: '2024-01-15T08:45:00Z',
    blockNumber: 12345672,
    gasUsed: '0.0031 ETH',
    gasPrice: '25 Gwei',
    hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    pool: '30-Day Lock',
    apy: '12.3%',
  },
  {
    id: '0x4567890abcdef123...',
    type: 'swap',
    status: 'failed',
    amount: '1,000 AGROTM',
    value: '$150.00',
    timestamp: '2024-01-15T08:00:00Z',
    blockNumber: 12345670,
    gasUsed: '0.0025 ETH',
    gasPrice: '25 Gwei',
    hash: '0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123',
    pool: 'DEX Swap',
    apy: 'N/A',
  },
  {
    id: '0xdef1234567890abc...',
    type: 'stake',
    status: 'completed',
    amount: '3,500 AGROTM',
    value: '$525.00',
    timestamp: '2024-01-14T16:20:00Z',
    blockNumber: 12345665,
    gasUsed: '0.0020 ETH',
    gasPrice: '25 Gwei',
    hash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
    pool: '180-Day Lock',
    apy: '18.2%',
  },
  {
    id: '0x234567890abcdef1...',
    type: 'reward',
    status: 'completed',
    amount: '89 AGROTM',
    value: '$13.35',
    timestamp: '2024-01-14T14:30:00Z',
    blockNumber: 12345660,
    gasUsed: '0.0015 ETH',
    gasPrice: '25 Gwei',
    hash: '0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1',
    pool: 'Flexible Staking',
    apy: '8.5%',
  },
];

const transactionTypes = [
  { value: 'all', label: 'All Types', color: 'bg-gray-500' },
  { value: 'stake', label: 'Stake', color: 'bg-green-500' },
  { value: 'unstake', label: 'Unstake', color: 'bg-red-500' },
  { value: 'reward', label: 'Reward', color: 'bg-blue-500' },
  { value: 'swap', label: 'Swap', color: 'bg-purple-500' },
];

const statusTypes = [
  { value: 'all', label: 'All Status', color: 'bg-gray-500' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { value: 'failed', label: 'Failed', color: 'bg-red-500' },
];

export function RecentTransactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch =
        tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.pool.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.amount.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || tx.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || tx.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, selectedType, selectedStatus]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className='w-4 h-4 text-green-400' />;
      case 'pending':
        return <Clock className='w-4 h-4 text-yellow-400' />;
      case 'failed':
        return <XCircle className='w-4 h-4 text-red-400' />;
      default:
        return <AlertCircle className='w-4 h-4 text-gray-400' />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stake':
        return <ArrowUpRight className='w-4 h-4 text-green-400' />;
      case 'unstake':
        return <ArrowDownRight className='w-4 h-4 text-red-400' />;
      case 'reward':
        return <ArrowUpRight className='w-4 h-4 text-blue-400' />;
      case 'swap':
        return <ArrowUpRight className='w-4 h-4 text-purple-400' />;
      default:
        return <ArrowUpRight className='w-4 h-4 text-gray-400' />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-white'>Recent Transactions</h2>
          <p className='text-gray-400'>Track your transaction history and status</p>
        </div>
        <div className='flex items-center space-x-3'>
          <button className='btn-outline flex items-center'>
            <Download className='w-4 h-4 mr-2' />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='card'>
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* Search */}
          <div className='flex-1'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
              <input
                type='text'
                placeholder='Search transactions...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500'
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className='flex items-center space-x-2'>
            <Filter className='w-4 h-4 text-gray-400' />
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className='px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500'
            >
              {transactionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className='flex items-center space-x-2'>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className='px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500'
            >
              {statusTypes.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='card'
      >
        <div className='space-y-4'>
          {filteredTransactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                selectedTransaction === tx.id
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
              onClick={() => setSelectedTransaction(selectedTransaction === tx.id ? null : tx.id)}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  {getTypeIcon(tx.type)}
                  <div>
                    <p className='text-sm font-medium text-white capitalize'>{tx.type}</p>
                    <p className='text-xs text-gray-400'>{tx.pool}</p>
                  </div>
                </div>

                <div className='text-right'>
                  <p className='text-sm font-medium text-white'>{tx.amount}</p>
                  <p className='text-xs text-gray-400'>{tx.value}</p>
                </div>

                <div className='flex items-center space-x-2'>
                  {getStatusIcon(tx.status)}
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      tx.status === 'completed'
                        ? 'bg-green-500/20 text-green-400'
                        : tx.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>

                <div className='text-right'>
                  <p className='text-xs text-gray-400'>{formatDate(tx.timestamp)}</p>
                  <p className='text-xs text-gray-400'>Block #{tx.blockNumber}</p>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedTransaction === tx.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='mt-4 pt-4 border-t border-white/10'
                >
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-xs text-gray-400'>Transaction Hash:</span>
                        <div className='flex items-center space-x-2'>
                          <span className='text-xs text-white font-mono'>
                            {tx.hash.slice(0, 20)}...
                          </span>
                          <button
                            onClick={() => copyToClipboard(tx.hash)}
                            className='p-1 hover:bg-white/10 rounded'
                          >
                            <Copy className='w-3 h-3 text-gray-400' />
                          </button>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-xs text-gray-400'>Gas Used:</span>
                        <span className='text-xs text-white'>{tx.gasUsed}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-xs text-gray-400'>Gas Price:</span>
                        <span className='text-xs text-white'>{tx.gasPrice}</span>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-xs text-gray-400'>APY:</span>
                        <span className='text-xs text-green-400'>{tx.apy}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-xs text-gray-400'>Pool:</span>
                        <span className='text-xs text-white'>{tx.pool}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-xs text-gray-400'>Status:</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            tx.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : tx.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='mt-4 flex items-center justify-between'>
                    <button className='flex items-center text-xs text-primary-400 hover:text-primary-300 transition-colors'>
                      <Hash className='w-3 h-3 mr-1' />
                      View on Explorer
                    </button>
                    <button className='flex items-center text-xs text-primary-400 hover:text-primary-300 transition-colors'>
                      <Eye className='w-3 h-3 mr-1' />
                      View Details
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className='text-center py-8'>
            <p className='text-gray-400'>No transactions found</p>
          </div>
        )}

        {filteredTransactions.length > 0 && (
          <div className='mt-6 pt-4 border-t border-white/10'>
            <button className='w-full text-sm text-primary-400 hover:text-primary-300 transition-colors'>
              View All Transactions
            </button>
          </div>
        )}
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='grid grid-cols-1 md:grid-cols-3 gap-6'
      >
        <div className='card'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-400'>Total Transactions</p>
              <p className='text-2xl font-bold text-white'>{transactions.length}</p>
            </div>
            <div className='p-2 bg-blue-500/20 rounded-lg'>
              <Hash className='w-6 h-6 text-blue-400' />
            </div>
          </div>
        </div>

        <div className='card'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-400'>Success Rate</p>
              <p className='text-2xl font-bold text-white'>
                {Math.round(
                  (transactions.filter(tx => tx.status === 'completed').length /
                    transactions.length) *
                    100,
                )}
                %
              </p>
            </div>
            <div className='p-2 bg-green-500/20 rounded-lg'>
              <CheckCircle className='w-6 h-6 text-green-400' />
            </div>
          </div>
        </div>

        <div className='card'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-400'>Total Gas Used</p>
              <p className='text-2xl font-bold text-white'>
                {transactions.reduce((sum, tx) => sum + parseFloat(tx.gasUsed), 0).toFixed(4)} ETH
              </p>
            </div>
            <div className='p-2 bg-purple-500/20 rounded-lg'>
              <ExternalLink className='w-6 h-6 text-purple-400' />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
