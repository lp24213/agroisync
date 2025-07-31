'use client';

import { motion } from 'framer-motion';
import { Leaf, Shield, Zap, Users, Globe, Target, ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  {
    title: 'Sustainable Agriculture',
    description:
      'Our platform focuses on supporting sustainable farming practices through DeFi protocols.',
    icon: Leaf,
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Advanced Security',
    description: 'Multi-layer security with smart contract audits and real-time monitoring.',
    icon: Shield,
    color: 'from-red-500 to-pink-500',
  },
  {
    title: 'High Performance',
    description: 'Built on Solana for lightning-fast transactions and minimal fees.',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    title: 'Community Driven',
    description: 'Governance tokens give users voting power on platform decisions.',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Global Access',
    description: 'Access DeFi opportunities from anywhere in the world.',
    icon: Globe,
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Transparent Operations',
    description: 'All transactions and operations are publicly verifiable on-chain.',
    icon: Target,
    color: 'from-indigo-500 to-purple-500',
  },
];

const benefits = [
  'Earn up to 25% APY on staking pools',
  'Zero hidden fees or charges',
  '24/7 customer support',
  'Mobile app for on-the-go trading',
  'Cross-chain bridge support',
  'Advanced risk management tools',
  'Real-time portfolio tracking',
  'Community governance participation',
];

export function About() {
  return (
    <section className='py-24 bg-gradient-to-b from-black to-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-6'
            >
              About AGROTM
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6'
            >
              Revolutionizing <span className='gradient-text'>DeFi</span>
              <br />
              for Agriculture
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='text-lg text-gray-300 mb-8 leading-relaxed'
            >
              AGROTM is the most advanced DeFi platform on Solana blockchain, specifically designed
              to support sustainable agriculture through innovative financial protocols. We combine
              cutting-edge blockchain technology with traditional farming wisdom to create a
              sustainable ecosystem for the future.
            </motion.p>

            {/* Benefits List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8'
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className='flex items-center space-x-3'
                >
                  <CheckCircle className='w-5 h-5 text-primary-400 flex-shrink-0' />
                  <span className='text-gray-300 text-sm'>{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <button className='btn-primary'>
                Learn More About Our Mission
                <ArrowRight className='ml-2 h-4 w-4' />
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column - Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='grid grid-cols-1 sm:grid-cols-2 gap-6'
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className='group'
              >
                <div className='card hover:scale-105 transition-all duration-300 h-full'>
                  {/* Icon */}
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className='w-6 h-6 text-white' />
                  </div>

                  {/* Content */}
                  <h3 className='text-lg font-semibold text-white mb-3 group-hover:text-primary-400 transition-colors duration-300'>
                    {feature.title}
                  </h3>

                  <p className='text-gray-400 text-sm leading-relaxed'>{feature.description}</p>

                  {/* Hover Effect */}
                  <div className='absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Section - Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className='mt-20 text-center'
        >
          <div className='bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 rounded-2xl p-8'>
            <h3 className='text-2xl font-bold text-white mb-4'>Our Mission</h3>
            <p className='text-gray-300 max-w-4xl mx-auto leading-relaxed'>
              To democratize access to sustainable agriculture financing through blockchain
              technology, creating a more equitable and environmentally conscious financial
              ecosystem. We believe that by connecting traditional farming with modern DeFi
              protocols, we can build a sustainable future for generations to come.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
