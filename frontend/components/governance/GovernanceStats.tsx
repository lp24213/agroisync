'use client';

import { motion } from 'framer-motion';
import { Vote, CheckCircle2, XCircle, Clock, Info } from 'lucide-react';

interface GovernanceStatsProps {
  votingPower: number;
  totalProposals: {
    active: number;
    passed: number;
    rejected: number;
    pending: number;
  };
}

export function GovernanceStats({ votingPower, totalProposals }: GovernanceStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="cyberpunk-border p-0.5 rounded-lg overflow-hidden">
        <div className="bg-agro-darker/90 backdrop-blur-md p-6 rounded-lg">
          <p className="text-gray-400 mb-2">Your Voting Power</p>
          <div className="flex items-baseline">
            <h3 className="text-3xl font-bold text-white">
              {votingPower.toLocaleString()} AGROTM
            </h3>
          </div>
          <div className="mt-2 text-sm text-gray-400 flex items-center">
            <Info className="h-4 w-4 mr-1" />
            <span>Voting power equals your staked AGROTM tokens</span>
          </div>
        </div>
      </div>
      
      <div className="cyberpunk-border p-0.5 rounded-lg overflow-hidden">
        <div className="bg-agro-darker/90 backdrop-blur-md p-6 rounded-lg">
          <p className="text-gray-400 mb-2">Proposal Status</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-agro-dark/30 p-2 rounded-lg">
              <div className="flex items-center">
                <Vote className="h-4 w-4 text-agro-blue mr-1" />
                <span className="text-sm text-gray-300">Active</span>
              </div>
              <p className="text-xl font-bold text-white">{totalProposals.active}</p>
            </div>
            <div className="bg-agro-dark/30 p-2 rounded-lg">
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-agro-green mr-1" />
                <span className="text-sm text-gray-300">Passed</span>
              </div>
              <p className="text-xl font-bold text-white">{totalProposals.passed}</p>
            </div>
            <div className="bg-agro-dark/30 p-2 rounded-lg">
              <div className="flex items-center">
                <XCircle className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-gray-300">Rejected</span>
              </div>
              <p className="text-xl font-bold text-white">{totalProposals.rejected}</p>
            </div>
            <div className="bg-agro-dark/30 p-2 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm text-gray-300">Pending</span>
              </div>
              <p className="text-xl font-bold text-white">{totalProposals.pending}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="cyberpunk-border p-0.5 rounded-lg overflow-hidden">
        <div className="bg-agro-darker/90 backdrop-blur-md p-6 rounded-lg">
          <p className="text-gray-400 mb-2">Create Proposal</p>
          <p className="text-sm text-gray-300 mb-4">
            Have an idea to improve AgroTM? Create a proposal and let the community decide.
          </p>
          <motion.button
            onClick={() => window.open('#', '_blank')}
            className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-agro-blue to-agro-green hover:opacity-90 transition-all cyberpunk-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center">
              <span>Create Proposal</span>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}