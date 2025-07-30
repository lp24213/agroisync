'use client';

import { motion } from 'framer-motion';
import { Cpu, Globe, Network, Shield, Star, Zap } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'Multi-layer security with military-grade encryption and regular audits by leading security firms.',
    gradient: 'from-blue-500 to-cyan-500',
    stats: ['99.9% Uptime', '256-bit Encryption', '24/7 Monitoring'],
  },
  {
    icon: Zap,
    title: 'Lightning Performance',
    description: 'Sub-second transaction confirmations powered by Solana blockchain technology.',
    gradient: 'from-yellow-500 to-orange-500',
    stats: ['<1s Confirmations', '65K TPS', 'Low Fees'],
  },
  {
    icon: Globe,
    title: 'Global Accessibility',
    description: 'Available worldwide with multi-language support and 24/7 customer service.',
    gradient: 'from-green-500 to-emerald-500',
    stats: ['150+ Countries', '20+ Languages', '24/7 Support'],
  },
  {
    icon: Star,
    title: 'Premium Rewards',
    description: 'Highest yields in DeFi agriculture with innovative farming strategies.',
    gradient: 'from-purple-500 to-pink-500',
    stats: ['Up to 500% APY', 'Auto-compound', 'Risk Management'],
  },
  {
    icon: Cpu,
    title: 'AI-Powered Analytics',
    description:
      'Advanced machine learning algorithms for optimal farming strategies and risk assessment.',
    gradient: 'from-indigo-500 to-purple-500',
    stats: ['ML Algorithms', 'Real-time Data', 'Predictive Analytics'],
  },
  {
    icon: Network,
    title: 'Cross-Chain Integration',
    description:
      'Seamless integration with multiple blockchains for maximum liquidity and opportunities.',
    gradient: 'from-red-500 to-pink-500',
    stats: ['Multi-Chain', 'Bridge Support', 'Liquidity Aggregation'],
  },
];

const technologies = [
  { name: 'Solana', icon: '⚡', description: 'High-performance blockchain' },
  { name: 'Rust', icon: '🦀', description: 'Memory-safe smart contracts' },
  { name: 'React', icon: '⚛️', description: 'Modern UI framework' },
  { name: 'TypeScript', icon: '📘', description: 'Type-safe development' },
  { name: 'GraphQL', icon: '🔍', description: 'Efficient data queries' },
  { name: 'Docker', icon: '🐳', description: 'Containerized deployment' },
];

export function PremiumFeatures() {
  return (
    <section className='relative py-24 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden'>
      {/* Background Elements */}
      <div className='absolute inset-0'>
        <div className='absolute top-0 left-0 w-full h-full'>
          <div className='absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl' />
          <div className='absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl' />
        </div>
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-20'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-6 py-3 mb-8'
          >
            <Star className='w-5 h-5 text-green-400' />
            <span className='text-green-400 font-medium'>Premium Features</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-4xl md:text-6xl font-bold text-white mb-6'
          >
            <span className='bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent'>
              Revolutionary
            </span>
            <br />
            <span className='text-white'>DeFi Technology</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='text-xl text-gray-400 max-w-3xl mx-auto'
          >
            Experience the future of decentralized finance with cutting-edge technology and
            innovative features designed for maximum efficiency and security.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20'>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className='group relative'
            >
              <div className='relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 h-full'>
                {/* Icon */}
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className='w-8 h-8 text-white' />
                </div>

                {/* Content */}
                <h3 className='text-2xl font-bold text-white mb-4'>{feature.title}</h3>
                <p className='text-gray-400 mb-6 leading-relaxed'>{feature.description}</p>

                {/* Stats */}
                <div className='space-y-2'>
                  {feature.stats.map((stat, statIndex) => (
                    <div key={statIndex} className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-green-400 rounded-full' />
                      <span className='text-sm text-gray-300'>{stat}</span>
                    </div>
                  ))}
                </div>

                {/* Hover Effect */}
                <div className='absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-16'
        >
          <h3 className='text-3xl font-bold text-white mb-8'>Built with Modern Technology</h3>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className='group'
              >
                <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300'>
                  <div className='text-3xl mb-3'>{tech.icon}</div>
                  <h4 className='font-semibold text-white mb-1'>{tech.name}</h4>
                  <p className='text-sm text-gray-400'>{tech.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='grid grid-cols-1 md:grid-cols-3 gap-8'
        >
          <div className='text-center'>
            <div className='text-4xl font-bold text-green-400 mb-2'>99.9%</div>
            <div className='text-gray-400'>Uptime</div>
          </div>
          <div className='text-center'>
            <div className='text-4xl font-bold text-blue-400 mb-2'>&lt;1s</div>
            <div className='text-gray-400'>Transaction Speed</div>
          </div>
          <div className='text-center'>
            <div className='text-4xl font-bold text-purple-400 mb-2'>500%</div>
            <div className='text-gray-400'>Max APY</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
