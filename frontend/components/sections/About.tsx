'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const benefits = [
  'Sustainable agriculture focus',
  'High yield opportunities',
  'Advanced security protocols',
  'Community governance',
  'Real-time analytics',
  'Multi-wallet support',
];

export function About() {
  return (
    <section className="py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base font-semibold leading-7 text-primary-400">About Agrotm</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Revolutionizing DeFi with{' '}
                  <span className="gradient-text">Sustainable Agriculture</span>
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  Agrotm Solana is the first DeFi platform to bridge the gap between traditional agriculture and blockchain technology. 
                  We're creating a sustainable ecosystem where farmers and investors can benefit from transparent, efficient, and profitable protocols.
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-300 lg:max-w-none">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="relative pl-9"
                    >
                      <dt className="inline font-semibold text-white">
                        <CheckCircle className="absolute left-1 top-1 h-5 w-5 text-primary-400" aria-hidden="true" />
                        {benefit}
                      </dt>
                    </motion.div>
                  ))}
                </dl>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link href="/about" className="btn-primary">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link href="/whitepaper" className="text-sm font-semibold leading-6 text-white hover:text-primary-400">
                    Read Whitepaper <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-72 h-72 bg-accent-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Total Value Locked</span>
                      <span className="text-lg font-bold text-white">$2.5B+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Active Users</span>
                      <span className="text-lg font-bold text-white">50K+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Average APY</span>
                      <span className="text-lg font-bold text-primary-400">15.3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Security Score</span>
                      <span className="text-lg font-bold text-green-400">9.8/10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 