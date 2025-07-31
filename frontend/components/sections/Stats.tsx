'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TrendingUp, Users, DollarSign, Shield, Zap, Globe, BarChart3, Coins } from 'lucide-react';

const stats = [
  {
    name: 'Total Value Locked',
    value: '$2.5B',
    suffix: '+',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
    description: 'Total value locked across all protocols',
  },
  {
    name: 'Active Users',
    value: '50K',
    suffix: '+',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    description: 'Monthly active users',
  },
  {
    name: 'Average APY',
    value: '15.3',
    suffix: '%',
    icon: TrendingUp,
    color: 'from-yellow-500 to-orange-500',
    description: 'Average annual percentage yield',
  },
  {
    name: 'Security Score',
    value: '9.8',
    suffix: '/10',
    icon: Shield,
    color: 'from-red-500 to-pink-500',
    description: 'Platform security rating',
  },
  {
    name: 'Transactions',
    value: '1.2M',
    suffix: '+',
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    description: 'Total transactions processed',
  },
  {
    name: 'Countries',
    value: '150',
    suffix: '+',
    icon: Globe,
    color: 'from-indigo-500 to-purple-500',
    description: 'Countries with active users',
  },
  {
    name: 'Supported Tokens',
    value: '200',
    suffix: '+',
    icon: Coins,
    color: 'from-teal-500 to-blue-500',
    description: 'Supported cryptocurrencies',
  },
  {
    name: 'Uptime',
    value: '99.9',
    suffix: '%',
    icon: BarChart3,
    color: 'from-emerald-500 to-teal-500',
    description: 'Platform availability',
  },
];

export function Stats() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className='py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden'>
      {/* Background Effects */}
      <div className='absolute inset-0 opacity-50 bg-gradient-to-br from-primary-500/5 to-accent-500/5' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Header */}
        <div className='text-center mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-6'
          >
            Platform Statistics
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className='text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6'
          >
            Trusted by <span className='gradient-text'>Millions</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-lg text-gray-300 max-w-3xl mx-auto'
          >
            Our platform has achieved remarkable milestones, serving users worldwide with secure,
            efficient, and profitable DeFi solutions.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div ref={ref} className='grid grid-cols-2 md:grid-cols-4 gap-8'>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className='group relative'
            >
              <div className='card text-center hover:scale-105 transition-all duration-300'>
                {/* Icon */}
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className='w-6 h-6 text-white' />
                </div>

                {/* Value */}
                <div className='text-3xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors duration-300'>
                  {stat.value}
                  <span className='text-primary-400'>{stat.suffix}</span>
                </div>

                {/* Name */}
                <div className='text-sm text-gray-400 mb-2 font-medium'>{stat.name}</div>

                {/* Description */}
                <div className='text-xs text-gray-500'>{stat.description}</div>

                {/* Hover Effect */}
                <div className='absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8'
        >
          <div className='text-center'>
            <div className='text-2xl font-bold text-primary-400 mb-2'>24/7</div>
            <div className='text-sm text-gray-400'>Customer Support</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-primary-400 mb-2'>100%</div>
            <div className='text-sm text-gray-400'>Transparent</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-primary-400 mb-2'>0%</div>
            <div className='text-sm text-gray-400'>Hidden Fees</div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className='mt-16 text-center'
        >
          <p className='text-sm text-gray-400 mb-6'>Audited by leading security firms</p>
          <div className='flex items-center justify-center space-x-8 opacity-50'>
            <div className='text-gray-400 text-sm font-medium'>CertiK</div>
            <div className='text-gray-400 text-sm font-medium'>OpenZeppelin</div>
            <div className='text-gray-400 text-sm font-medium'>Trail of Bits</div>
            <div className='text-gray-400 text-sm font-medium'>Consensys Diligence</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
