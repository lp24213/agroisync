'use client';

import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  TrendingUp, 
  Users, 
  Globe, 
  Lock,
  BarChart3,
  Wallet
} from 'lucide-react';

const features = [
  {
    name: 'High Yield Staking',
    description: 'Earn up to 25% APY with our optimized staking pools backed by sustainable agriculture protocols.',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Advanced Security',
    description: 'Multi-layer security with audited smart contracts and real-time monitoring systems.',
    icon: Shield,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Lightning Fast',
    description: 'Built on Solana for sub-second transactions and minimal gas fees.',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    name: 'Community Driven',
    description: 'Governance tokens give you voting power on platform decisions and new features.',
    icon: Users,
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Global Access',
    description: 'Access DeFi opportunities from anywhere in the world with our borderless platform.',
    icon: Globe,
    color: 'from-indigo-500 to-purple-500',
  },
  {
    name: 'Privacy Focused',
    description: 'Your data stays private with zero-knowledge proofs and decentralized identity.',
    icon: Lock,
    color: 'from-red-500 to-pink-500',
  },
  {
    name: 'Real-time Analytics',
    description: 'Advanced charts and metrics to track your portfolio performance and market trends.',
    icon: BarChart3,
    color: 'from-teal-500 to-green-500',
  },
  {
    name: 'Multi-Wallet Support',
    description: 'Connect with Phantom, Solflare, and other popular Solana wallets seamlessly.',
    icon: Wallet,
    color: 'from-violet-500 to-purple-500',
  },
];

export function Features() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-base font-semibold leading-7 text-primary-400"
          >
            Advanced Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Everything you need for{' '}
            <span className="gradient-text">successful DeFi</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-6 text-lg leading-8 text-gray-300"
          >
            Our platform combines cutting-edge technology with user-friendly design to provide the best DeFi experience on Solana.
          </motion.p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r ${feature.color}`}>
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <a href="#" className="text-sm font-semibold leading-6 text-primary-400 hover:text-primary-300">
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
} 