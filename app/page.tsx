'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useWeb3 } from '@/hooks/useWeb3';
import { AnimatedCard } from '@/components/AnimatedCard';
import { NeonButton } from '@/components/NeonButton';
import { PriceWidget } from '@/components/widgets/PriceWidget';
import { TVLWidget } from '@/components/widgets/TVLWidget';
import { APRWidget } from '@/components/widgets/APRWidget';
import {
  Leaf,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  BarChart3,
  Lock,
  Coins,
  Wallet,
  ChevronDown,
} from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Sustainable Agriculture',
    description:
      'Supporting eco-friendly farming practices through blockchain technology and DeFi incentives.',
  },
  {
    icon: Shield,
    title: 'Secure & Audited',
    description:
      'Smart contracts audited by leading security firms with multi-signature protection.',
  },
  {
    icon: TrendingUp,
    title: 'High Yield Farming',
    description:
      'Earn competitive APRs through our optimized staking and liquidity provision protocols.',
  },
  {
    icon: Globe,
    title: 'Cross-Chain Compatible',
    description: 'Seamlessly bridge assets across multiple blockchains for maximum flexibility.',
  },
  {
    icon: Users,
    title: 'Community Governed',
    description: 'Decentralized governance allowing token holders to shape the future of AGROTM.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Built on Solana for instant transactions with minimal fees and maximum efficiency.',
  },
];

const stats = [
  { label: 'Total Value Locked', value: '$12.5M', icon: Lock },
  { label: 'Active Users', value: '25,000+', icon: Users },
  { label: 'Transactions', value: '1.2M+', icon: BarChart3 },
  { label: 'Average APR', value: '18.5%', icon: TrendingUp },
];

const roadmapItems = [
  {
    quarter: 'Q1 2024',
    title: 'Platform Launch',
    description: 'Core staking and farming features with Solana integration',
    status: 'completed',
  },
  {
    quarter: 'Q2 2024',
    title: 'Cross-Chain Bridge',
    description: 'Multi-chain support for Ethereum, BSC, and Polygon',
    status: 'in-progress',
  },
  {
    quarter: 'Q3 2024',
    title: 'NFT Marketplace',
    description: 'Agricultural NFTs and carbon credit tokenization',
    status: 'upcoming',
  },
  {
    quarter: 'Q4 2024',
    title: 'Mobile App',
    description: 'Native mobile applications for iOS and Android',
    status: 'upcoming',
  },
];

export default function HomePage() {
  const { isConnected, connectWallet } = useWeb3();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Leaf className="w-8 h-8 text-blue-400 mr-2" />
              <span className="text-xl font-bold text-white">AGROTM</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('stats')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Stats
              </button>
              <button
                onClick={() => scrollToSection('roadmap')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Roadmap
              </button>

              {isConnected ? (
                <Link href="/dashboard">
                  <NeonButton size="md">Dashboard</NeonButton>
                </Link>
              ) : (
                <NeonButton onClick={connectWallet} size="md">
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </NeonButton>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              The Future of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                {' '}
                Agriculture{' '}
              </span>
              DeFi
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Revolutionizing sustainable farming through blockchain technology. Stake, farm, and
              earn while supporting eco-friendly agricultural practices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isConnected ? (
                <Link href="/staking">
                  <NeonButton size="md" className="w-full sm:w-auto">
                    <Coins className="w-5 h-5 mr-2" />
                    Start Staking
                  </NeonButton>
                </Link>
              ) : (
                <NeonButton onClick={connectWallet} size="md" className="w-full sm:w-auto">
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Wallet
                </NeonButton>
              )}

              <NeonButton
                variant="secondary"
                size="md"
                className="w-full sm:w-auto"
                onClick={() => scrollToSection('features')}
              >
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </NeonButton>
            </div>
          </motion.div>

          {/* Market Widgets */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <PriceWidget />
            <TVLWidget />
            <APRWidget />
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center"
          >
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-400 hover:text-white transition-colors animate-bounce"
            >
              <ChevronDown className="w-8 h-8" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose AGROTM?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the next generation of agricultural DeFi with cutting-edge features
              designed for maximum yield and sustainability.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AnimatedCard className="p-6 h-full">
                  <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        id="stats"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/20 to-green-900/20"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Platform Statistics</h2>
            <p className="text-xl text-gray-300">
              Join thousands of users earning rewards through sustainable agriculture
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AnimatedCard className="p-6 text-center">
                  <stat.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-gray-300">{stat.label}</p>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Development Roadmap</h2>
            <p className="text-xl text-gray-300">
              Our journey towards revolutionizing agricultural DeFi
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AnimatedCard className="p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-blue-400">{item.quarter}</span>
                    {item.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                    {item.status === 'in-progress' && (
                      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    )}
                    {item.status === 'upcoming' && <Star className="w-5 h-5 text-gray-400" />}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3>

                  <p className="text-gray-300 text-sm">{item.description}</p>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/20 to-green-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Earning?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the agricultural revolution and start earning rewards today. Connect your wallet
              and begin your DeFi journey with AGROTM.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isConnected ? (
                <>
                  <Link href="/staking">
                    <NeonButton size="md" className="w-full sm:w-auto">
                      <Coins className="w-5 h-5 mr-2" />
                      Start Staking
                    </NeonButton>
                  </Link>
                  <Link href="/dashboard">
                    <NeonButton variant="secondary" size="md" className="w-full sm:w-auto">
                      View Dashboard
                    </NeonButton>
                  </Link>
                </>
              ) : (
                <NeonButton onClick={connectWallet} size="md" className="w-full sm:w-auto">
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Wallet to Begin
                </NeonButton>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Leaf className="w-8 h-8 text-blue-400 mr-2" />
              <span className="text-xl font-bold text-white">AGROTM</span>
            </div>

            <p className="text-gray-400 text-sm">
              © 2024 AGROTM. Building the future of sustainable agriculture.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
