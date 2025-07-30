'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react';

const transactions = [
  {
    id: 1,
    type: 'stake',
    token: 'SOL',
    amount: 10.5,
    status: 'completed',
    timestamp: '2 hours ago',
    txHash: '0x1234...5678',
  },
  {
    id: 2,
    type: 'unstake',
    token: 'AGROTM',
    amount: 500,
    status: 'pending',
    timestamp: '4 hours ago',
    txHash: '0x8765...4321',
  },
  {
    id: 3,
    type: 'claim',
    token: 'RAY',
    amount: 2.34,
    status: 'completed',
    timestamp: '1 day ago',
    txHash: '0xabcd...efgh',
  },
  {
    id: 4,
    type: 'stake',
    token: 'USDC',
    amount: 1000,
    status: 'failed',
    timestamp: '2 days ago',
    txHash: '0x9876...5432',
  },
  {
    id: 5,
    type: 'unstake',
    token: 'SOL',
    amount: 5.25,
    status: 'completed',
    timestamp: '3 days ago',
    txHash: '0x5678...1234',
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-400" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-400" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-400';
    case 'pending':
      return 'text-yellow-400';
    case 'failed':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

export function RecentTransactions() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          <p className="text-sm text-gray-400">Your latest activity</p>
        </div>
        <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {transactions.map((tx, index) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                tx.type === 'stake' 
                  ? 'bg-green-500/10 text-green-400' 
                  : tx.type === 'unstake'
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-blue-500/10 text-blue-400'
              }`}>
                {tx.type === 'stake' ? (
                  <ArrowDownLeft className="h-4 w-4" />
                ) : tx.type === 'unstake' ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-white capitalize">{tx.type}</p>
                  <span className="text-xs text-gray-400">{tx.token}</span>
                </div>
                <p className="text-xs text-gray-400">{tx.timestamp}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2">
                {getStatusIcon(tx.status)}
                <span className={`text-sm font-medium ${getStatusColor(tx.status)}`}>
                  {tx.status}
                </span>
              </div>
              <p className="text-sm font-medium text-white">
                {tx.amount.toLocaleString()} {tx.token}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Transaction Hash Info */}
      <div className="mt-6 p-3 bg-white/5 rounded-lg">
        <p className="text-xs text-gray-400 mb-2">Latest Transaction Hash</p>
        <div className="flex items-center justify-between">
          <code className="text-xs text-gray-300 font-mono">
            {transactions[0].txHash}
          </code>
          <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
            Copy
          </button>
        </div>
      </div>
    </div>
  );
} 