'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, Star } from 'lucide-react';

const roadmapItems = [
  {
    phase: 'Phase 1',
    title: 'Foundation & Launch',
    description: 'Core platform development and initial launch',
    status: 'completed',
    items: [
      'Smart contract development and auditing',
      'Platform MVP launch',
      'Basic staking functionality',
      'Community building',
    ],
    date: 'Q1 2024',
  },
  {
    phase: 'Phase 2',
    title: 'Expansion & Features',
    description: 'Advanced features and ecosystem expansion',
    status: 'in-progress',
    items: [
      'Advanced yield farming protocols',
      'NFT marketplace launch',
      'Cross-chain bridge implementation',
      'Mobile app development',
    ],
    date: 'Q2 2024',
  },
  {
    phase: 'Phase 3',
    title: 'Governance & DAO',
    description: 'Decentralized governance and community ownership',
    status: 'upcoming',
    items: [
      'DAO governance implementation',
      'Community voting system',
      'Treasury management',
      'Partnership expansion',
    ],
    date: 'Q3 2024',
  },
  {
    phase: 'Phase 4',
    title: 'Ecosystem & Innovation',
    description: 'Advanced DeFi protocols and ecosystem growth',
    status: 'upcoming',
    items: [
      'Advanced DeFi protocols',
      'AI-powered yield optimization',
      'Institutional partnerships',
      'Global expansion',
    ],
    date: 'Q4 2024',
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-6 h-6 text-green-400" />;
    case 'in-progress':
      return <Clock className="w-6 h-6 text-yellow-400" />;
    case 'upcoming':
      return <Star className="w-6 h-6 text-blue-400" />;
    default:
      return <Clock className="w-6 h-6 text-gray-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'border-green-500 bg-green-500/10';
    case 'in-progress':
      return 'border-yellow-500 bg-yellow-500/10';
    case 'upcoming':
      return 'border-blue-500 bg-blue-500/10';
    default:
      return 'border-gray-500 bg-gray-500/10';
  }
};

export function Roadmap() {
  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-6"
          >
            Development Roadmap
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6"
          >
            Our Journey to{' '}
            <span className="gradient-text">Success</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-3xl mx-auto"
          >
            Follow our development roadmap as we build the most advanced DeFi platform 
            for sustainable agriculture on Solana blockchain.
          </motion.p>
        </div>

        {/* Roadmap Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-accent-500 to-blue-500" />
          
          <div className="space-y-12">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 transform -translate-x-1/2 z-10">
                  <div className={`w-4 h-4 rounded-full border-2 ${getStatusColor(item.status)}`} />
                </div>

                {/* Content Card */}
                <div className={`w-full max-w-md ${index % 2 === 0 ? 'ml-16' : 'mr-16'}`}>
                  <div className="card hover:scale-105 transition-all duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(item.status)}
                        <div>
                          <div className="text-sm font-medium text-primary-400">{item.phase}</div>
                          <div className="text-lg font-bold text-white">{item.title}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">{item.date}</div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 mb-4">{item.description}</p>

                    {/* Items List */}
                    <ul className="space-y-2">
                      {item.items.map((listItem, itemIndex) => (
                        <motion.li
                          key={itemIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 + itemIndex * 0.1 }}
                          className="flex items-center space-x-2 text-sm text-gray-400"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                          <span>{listItem}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Status Badge */}
                    <div className="mt-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                        item.status === 'in-progress' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>
                        {item.status === 'completed' ? 'Completed' :
                         item.status === 'in-progress' ? 'In Progress' :
                         'Upcoming'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Join Our Journey
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Be part of the future of DeFi and sustainable agriculture. Follow our progress 
              and contribute to building the most advanced platform on Solana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Join Community
              </button>
              <button className="btn-outline">
                View GitHub
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}