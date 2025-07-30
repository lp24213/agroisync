'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Twitter, 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink,
  Shield,
  Zap,
  Users,
  TrendingUp
} from 'lucide-react';

const navigation = {
  product: [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Staking', href: '/staking' },
    { name: 'NFTs', href: '/nft-marketplace' },
    { name: 'Governance', href: '/governance' },
    { name: 'Analytics', href: '/analytics' },
  ],
  defi: [
    { name: 'Liquidity Pools', href: '/pools' },
    { name: 'Yield Farming', href: '/farming' },
    { name: 'Swap', href: '/swap' },
    { name: 'APR Calculator', href: '/calculator' },
  ],
  resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/api' },
    { name: 'Whitepaper', href: '/whitepaper' },
    { name: 'Security', href: '/security' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Team', href: '/team' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  social: [
    {
      name: 'Twitter',
      href: 'https://twitter.com/agrotm',
      icon: Twitter,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/agrotm',
      icon: Github,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/agrotm',
      icon: Linkedin,
    },
    {
      name: 'Email',
      href: 'mailto:contact@agrotm.com',
      icon: Mail,
    },
  ],
};

const stats = [
  { name: 'Total Value Locked', value: '$2.5B+', icon: TrendingUp },
  { name: 'Active Users', value: '50K+', icon: Users },
  { name: 'Security Score', value: '9.8/10', icon: Shield },
  { name: 'Average APY', value: '15.3%', icon: Zap },
];

export function Footer() {
  return (
    <footer className="bg-black/90 backdrop-blur-lg border-t border-white/10">
      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-8 h-8 text-primary-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.name}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-white font-bold text-xl">AGROTM</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              The most advanced DeFi platform on Solana blockchain, focused on sustainable agriculture and yield farming.
            </p>
            <div className="flex space-x-4">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* DeFi */}
          <div>
            <h3 className="text-white font-semibold mb-4">DeFi</h3>
            <ul className="space-y-2">
              {navigation.defi.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 AGROTM. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="bg-black/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3 text-primary-400" />
              <span>Audited by CertiK</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3 text-primary-400" />
              <span>Insurance by Nexus Mutual</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3 text-primary-400" />
              <span>Multi-Sig Treasury</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}