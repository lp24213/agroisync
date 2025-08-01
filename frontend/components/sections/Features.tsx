'use client';

import { motion } from 'framer-motion';
import {
  Shield,
  Zap,
  TrendingUp,
  Users,
  Lock,
  Globe,
  BarChart3,
  Smartphone,
  Wallet,
  Coins,
  Leaf,
  Target,
} from 'lucide-react';

const features = [
  {
    name: 'Advanced Security',
    description:
      'Multi-layer security with smart contract audits, insurance coverage, and real-time monitoring.',
    icon: Shield,
    color: 'from-red-500 to-pink-500',
  },
  {
    name: 'High Performance',
    description:
      'Lightning-fast transactions with sub-second finality powered by Solana blockchain.',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    name: 'Yield Optimization',
    description: 'AI-powered yield farming strategies that automatically optimize your returns.',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Community Governance',
    description:
      'Decentralized governance with voting power based on token holdings and participation.',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Cross-Chain Bridge',
    description: 'Seamlessly bridge assets between Ethereum, BSC, and Solana networks.',
    icon: Globe,
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Real-time Analytics',
    description: 'Comprehensive analytics dashboard with real-time data and performance metrics.',
    icon: BarChart3,
    color: 'from-indigo-500 to-purple-500',
  },
  {
    name: 'Mobile App',
    description: 'Full-featured mobile application for trading and portfolio management on the go.',
    icon: Smartphone,
    color: 'from-teal-500 to-blue-500',
  },
  {
    name: 'Multi-Wallet Support',
    description: 'Support for all major wallets including Phantom, Solflare, and MetaMask.',
    icon: Wallet,
    color: 'from-amber-500 to-yellow-500',
  },
  {
    name: 'Liquidity Mining',
    description: 'Earn rewards by providing liquidity to our automated market makers.',
    icon: Coins,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Sustainable Farming',
    description: 'Agriculture-focused DeFi protocols supporting sustainable farming practices.',
    icon: Leaf,
    color: 'from-green-600 to-emerald-600',
  },
  {
    name: 'Risk Management',
    description: 'Advanced risk management tools with automated stop-loss and position sizing.',
    icon: Target,
    color: 'from-red-600 to-pink-600',
  },
  {
    name: 'Zero-Fee Trading',
    description: 'Trade with zero fees on selected pairs and enjoy competitive spreads.',
    icon: Lock,
    color: 'from-gray-500 to-slate-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function Features() {
  return (
    <section className='py-24 bg-gradient-to-b from-black to-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-6'
          >
            Features
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className='text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6'
          >
            Why Choose <span className='gradient-text'>AGROTM</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-lg text-gray-300 max-w-3xl mx-auto'
          >
            Experience the next generation of DeFi with cutting-edge features designed for maximum
            efficiency, security, and profitability.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-100px' }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
        >
          {features.map(feature => (
            <motion.div key={feature.name} variants={itemVariants} className='group relative'>
              <div className='card hover:scale-105 transition-all duration-300 h-full'>
                {/* Icon */}
                <div className='flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 mb-4 group-hover:scale-110 transition-transform duration-300'>
                  <feature.icon className='w-6 h-6 text-white' />
                </div>

                {/* Content */}
                <h3 className='text-xl font-semibold text-white mb-3 group-hover:text-primary-400 transition-colors duration-300'>
                  {feature.name}
                </h3>

                <p className='text-gray-400 leading-relaxed'>{feature.description}</p>

                {/* Hover Effect */}
                <div className='absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className='mt-20 grid grid-cols-2 md:grid-cols-4 gap-8'
        >
          <div className='text-center'>
            <div className='text-3xl font-bold text-primary-400 mb-2'>99.9%</div>
            <div className='text-sm text-gray-400'>Uptime</div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-primary-400 mb-2'>$2.5B+</div>
            <div className='text-sm text-gray-400'>TVL</div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-primary-400 mb-2'>50K+</div>
            <div className='text-sm text-gray-400'>Users</div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-primary-400 mb-2'>15.3%</div>
            <div className='text-sm text-gray-400'>Avg APY</div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className='mt-16 text-center'
        >
          <div className='bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 rounded-2xl p-8'>
            <h3 className='text-2xl font-bold text-white mb-4'>Ready to Start Earning?</h3>
            <p className='text-gray-300 mb-6 max-w-2xl mx-auto'>
              Join thousands of users who are already earning passive income with AGROTM&apos;s
              advanced DeFi protocols.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button className='btn-primary'>Start Staking Now</button>
              <button className='btn-outline'>View Documentation</button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
