'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Leaf,
  Globe,
  Play,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const stats = [
  { label: 'Total Value Locked', value: '$2.4B', change: '+12.5%', icon: TrendingUp },
  { label: 'Active Users', value: '45.2K', change: '+8.3%', icon: Users },
  { label: 'Total Farms', value: '156', change: '+5.2%', icon: Leaf },
  { label: 'APY Average', value: '24.8%', change: '+2.1%', icon: TrendingUp },
];

const features = [
  {
    icon: Shield,
    title: 'Secure & Audited',
    description: 'Multi-layer security with regular audits',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Sub-second transaction confirmations',
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Available worldwide 24/7',
  },
  {
    icon: Star,
    title: 'Premium Rewards',
    description: 'Highest yields in DeFi agriculture',
  },
];

export function PremiumHero() {
  const [currentStat, setCurrentStat] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black'>
      {/* Animated Background */}
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-emerald-500/10 animate-pulse' />
        <div className='absolute top-0 left-0 w-full h-full'>
          <div className='absolute top-20 left-20 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse' />
          <div className='absolute top-40 right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000' />
          <div className='absolute bottom-20 left-1/2 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000' />
        </div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16'>
        <div className='text-center'>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-6 py-3 mb-8'
          >
            <Sparkles className='w-5 h-5 text-green-400' />
            <span className='text-green-400 font-medium'>
              Revolutionary DeFi Agriculture Platform
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6'
          >
            <span className='bg-gradient-to-r from-green-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent'>
              AGROTM
            </span>
            <br />
            <span className='text-3xl md:text-4xl lg:text-5xl text-gray-300 font-light'>
              The Future of
            </span>
            <br />
            <span className='bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent'>
              DeFi Agriculture
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed'
          >
            Experience the next generation of decentralized finance. Farm, stake, and earn with the
            most advanced agricultural DeFi platform on Solana.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className='flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16'
          >
            <Link href='/dashboard'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl font-semibold text-white shadow-2xl hover:shadow-green-500/25 transition-all duration-300'
              >
                <span className='flex items-center space-x-2'>
                  <span>Launch App</span>
                  <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform duration-300' />
                </span>
                <div className='absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVideoPlaying(true)}
              className='group flex items-center space-x-3 px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl font-semibold text-white hover:bg-white/20 transition-all duration-300'
            >
              <Play className='w-5 h-5' />
              <span>Watch Demo</span>
            </motion.button>
          </motion.div>

          {/* Live Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-16'
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className='relative group'
              >
                <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300'>
                  <div className='flex items-center justify-between mb-2'>
                    <stat.icon className='w-6 h-6 text-green-400' />
                    <span className='text-green-400 text-sm font-medium'>{stat.change}</span>
                  </div>
                  <div className='text-2xl font-bold text-white mb-1'>{stat.value}</div>
                  <div className='text-sm text-gray-400'>{stat.label}</div>
                </div>
                {currentStat === index && (
                  <motion.div
                    layoutId='activeStat'
                    className='absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/30'
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                className='group relative'
              >
                <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300'>
                  <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300'>
                    <feature.icon className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='text-lg font-semibold text-white mb-2'>{feature.title}</h3>
                  <p className='text-gray-400 text-sm'>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className='absolute inset-0 pointer-events-none'>
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute top-1/4 left-10 w-4 h-4 bg-green-400 rounded-full opacity-60'
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className='absolute top-1/3 right-20 w-3 h-3 bg-emerald-400 rounded-full opacity-60'
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className='absolute bottom-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60'
        />
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm'
            onClick={() => setIsVideoPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className='relative w-full max-w-4xl mx-4 aspect-video bg-black rounded-2xl overflow-hidden'
              onClick={e => e.stopPropagation()}
            >
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='text-white text-center'>
                  <Play className='w-16 h-16 mx-auto mb-4' />
                  <p className='text-xl'>Demo Video Coming Soon</p>
                </div>
              </div>
              <button
                onClick={() => setIsVideoPlaying(false)}
                className='absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors'
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
