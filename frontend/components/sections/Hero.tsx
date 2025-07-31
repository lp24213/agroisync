'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, TrendingUp, Users, Zap } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const stats = [
  { id: 1, name: 'Total Value Locked', value: '$2.5B+', icon: TrendingUp },
  { id: 2, name: 'Active Users', value: '50K+', icon: Users },
  { id: 3, name: 'APY Average', value: '15.3%', icon: Zap },
  { id: 4, name: 'Security Score', value: '9.8/10', icon: Star },
];

export function Hero() {
  const [currentStat, setCurrentStat] = useState(0);
  const { connected } = useWallet();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
      {/* Background Effects */}
      <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' />
      <div className="absolute inset-0 bg-[url('/assets/img/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Floating Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className='absolute top-20 left-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl'
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className='absolute top-40 right-20 w-32 h-32 bg-accent-500/20 rounded-full blur-xl'
        />
        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className='absolute bottom-40 left-1/4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl'
        />
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:px-8'>
        <div className='text-center'>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-8'
          >
            <Star className='w-4 h-4 mr-2' />
            #1 DeFi Platform on Solana
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl'
          >
            The Future of <span className='gradient-text'>DeFi</span>
            <br />
            is Here
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='mt-6 text-lg leading-8 text-gray-300 max-w-3xl mx-auto'
          >
            Experience the most advanced DeFi platform on Solana blockchain. Stake, farm, and earn
            with sustainable agriculture-focused protocols.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className='mt-10 flex items-center justify-center gap-x-6'
          >
            {connected ? (
              <Link href='/dashboard' className='btn-primary'>
                Go to Dashboard
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            ) : (
              <WalletMultiButton className='btn-primary' />
            )}
            <Link href='/about' className='btn-outline'>
              Learn More
            </Link>
            <button className='flex items-center text-gray-300 hover:text-white transition-colors duration-200'>
              <Play className='w-5 h-5 mr-2' />
              Watch Demo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className='mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4'
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className={`text-center p-4 rounded-lg transition-all duration-300 ${
                  currentStat === index
                    ? 'bg-white/10 backdrop-blur-lg border border-white/20'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <stat.icon className='w-6 h-6 text-primary-400 mx-auto mb-2' />
                <div className='text-2xl font-bold text-white'>{stat.value}</div>
                <div className='text-sm text-gray-400'>{stat.name}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className='mt-16'
          >
            <p className='text-sm text-gray-400 mb-4'>Trusted by leading protocols</p>
            <div className='flex items-center justify-center space-x-8 opacity-50'>
              <div className='text-gray-400 text-sm font-medium'>Serum</div>
              <div className='text-gray-400 text-sm font-medium'>Raydium</div>
              <div className='text-gray-400 text-sm font-medium'>Orca</div>
              <div className='text-gray-400 text-sm font-medium'>Jupiter</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className='w-6 h-10 border-2 border-white/30 rounded-full flex justify-center'
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className='w-1 h-3 bg-white/60 rounded-full mt-2'
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
