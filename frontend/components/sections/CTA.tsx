'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, TrendingUp, Shield } from 'lucide-react';

const benefits = [
  {
    icon: Star,
    text: 'Join 50K+ users earning passive income',
  },
  {
    icon: TrendingUp,
    text: 'Earn up to 25% APY on staking pools',
  },
  {
    icon: Shield,
    text: 'Audited smart contracts & insurance coverage',
  },
  {
    icon: Users,
    text: 'Active community & governance participation',
  },
];

export function CTA() {
  return (
    <section className='py-24 bg-gradient-to-br from-primary-500/10 via-accent-500/5 to-purple-500/10 relative overflow-hidden'>
      {/* Background Effects */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5' />
      <div className='absolute top-0 left-1/4 w-72 h-72 bg-primary-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow' />
      <div className='absolute bottom-0 right-1/4 w-72 h-72 bg-accent-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow animation-delay-2000' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='text-center'>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-white/10 text-white border border-white/20 mb-8'
          >
            <Star className='w-4 h-4 mr-2' />
            Limited Time Offer
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className='text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6'
          >
            Ready to Start <span className='gradient-text'>Earning</span>
            <br />
            Today?
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-xl text-gray-300 max-w-3xl mx-auto mb-12'
          >
            Join thousands of users who are already earning passive income with AGROTM's advanced
            DeFi protocols. Start your journey to financial freedom today.
          </motion.p>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className='flex items-center justify-center space-x-3 text-white'
              >
                <benefit.icon className='w-5 h-5 text-primary-400 flex-shrink-0' />
                <span className='text-sm font-medium'>{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className='flex flex-col sm:flex-row gap-4 justify-center items-center'
          >
            <button className='bg-white text-black font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center'>
              Start Staking Now
              <ArrowRight className='ml-2 h-5 w-5' />
            </button>
            <button className='border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105'>
              View Documentation
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className='mt-16'
          >
            <p className='text-sm text-gray-400 mb-6'>Trusted by leading protocols</p>
            <div className='flex items-center justify-center space-x-8 opacity-50'>
              <div className='text-gray-400 text-sm font-medium'>Serum</div>
              <div className='text-gray-400 text-sm font-medium'>Raydium</div>
              <div className='text-gray-400 text-sm font-medium'>Orca</div>
              <div className='text-gray-400 text-sm font-medium'>Jupiter</div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className='mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto'
          >
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>$2.5B+</div>
              <div className='text-sm text-gray-400'>Total Value Locked</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>50K+</div>
              <div className='text-sm text-gray-400'>Active Users</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>15.3%</div>
              <div className='text-sm text-gray-400'>Average APY</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
