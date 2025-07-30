'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
  { id: 1, name: 'Total Value Locked', value: '2.5B', suffix: '+', description: 'USD' },
  { id: 2, name: 'Active Users', value: '50K', suffix: '+', description: 'Monthly' },
  { id: 3, name: 'Average APY', value: '15.3', suffix: '%', description: 'Across all pools' },
  { id: 4, name: 'Transactions', value: '1.2M', suffix: '+', description: 'Processed' },
  { id: 5, name: 'Security Score', value: '9.8', suffix: '/10', description: 'Audit rating' },
  { id: 6, name: 'Supported Tokens', value: '150', suffix: '+', description: 'SPL tokens' },
];

export function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Trusted by millions of users worldwide
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-lg leading-8 text-gray-300"
            >
              Our platform has processed billions in transactions and continues to grow
            </motion.p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col bg-white/5 backdrop-blur-lg p-8 border border-white/10"
              >
                <dt className="text-sm font-semibold leading-6 text-gray-300">{stat.name}</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-white">
                  {stat.value}
                  <span className="text-primary-400">{stat.suffix}</span>
                </dd>
                <dd className="text-sm leading-6 text-gray-400">{stat.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
} 