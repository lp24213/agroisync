'use client';

import { motion } from 'framer-motion';
import {
  Discord,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Telegram,
  Twitter,
  Youtube,
} from 'lucide-react';
import Link from 'next/link';

const footerLinks = {
  product: [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Farming', href: '/farm' },
    { name: 'Staking', href: '/staking' },
    { name: 'Swap', href: '/swap' },
    { name: 'NFTs', href: '/nft-marketplace' },
    { name: 'Analytics', href: '/analytics' },
  ],
  ecosystem: [
    { name: 'AGROTM Token', href: '/token' },
    { name: 'Governance', href: '/governance' },
    { name: 'Developers', href: '/developers' },
    { name: 'Partners', href: '/partners' },
    { name: 'Community', href: '/community' },
    { name: 'Grants', href: '/grants' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Documentation', href: '/docs' },
    { name: 'Status', href: '/status' },
    { name: 'Contact', href: '/contact' },
    { name: 'Bug Report', href: '/bug-report' },
    { name: 'Feature Request', href: '/feature-request' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Security', href: '/security' },
    { name: 'Compliance', href: '/compliance' },
    { name: 'Licenses', href: '/licenses' },
  ],
};

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/agrotm', icon: Twitter },
  { name: 'Discord', href: 'https://discord.gg/agrotm', icon: Discord },
  { name: 'Telegram', href: 'https://t.me/agrotm', icon: Telegram },
  { name: 'GitHub', href: 'https://github.com/agrotm', icon: Github },
  { name: 'YouTube', href: 'https://youtube.com/agrotm', icon: Youtube },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/agrotm', icon: Linkedin },
];

const contactInfo = [
  { icon: Mail, text: 'hello@agrotm.com', href: 'mailto:hello@agrotm.com' },
  { icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
  { icon: MapPin, text: 'Global DeFi Platform', href: '#' },
  { icon: Globe, text: 'agrotm.com', href: 'https://agrotm.com' },
];

export function PremiumFooter() {
  return (
    <footer className='relative bg-gradient-to-br from-black via-gray-900 to-black border-t border-white/10'>
      {/* Background Elements */}
      <div className='absolute inset-0'>
        <div className='absolute bottom-0 left-0 w-full h-full'>
          <div className='absolute bottom-20 left-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl' />
          <div className='absolute bottom-10 right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl' />
        </div>
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Main Footer Content */}
        <div className='py-16'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8'>
            {/* Brand Section */}
            <div className='lg:col-span-2'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className='mb-6'
              >
                <Link href='/' className='flex items-center space-x-3'>
                  <div className='relative'>
                    <div className='w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center'>
                      <Sparkles className='w-7 h-7 text-white' />
                    </div>
                    <div className='absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse' />
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent'>
                      AGROTM
                    </h3>
                    <p className='text-sm text-gray-400'>DeFi Agriculture</p>
                  </div>
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='text-gray-400 mb-6 leading-relaxed'
              >
                Revolutionizing decentralized finance with cutting-edge agricultural DeFi
                technology. Experience the future of farming, staking, and earning.
              </motion.p>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className='space-y-3'
              >
                {contactInfo.map((contact, index) => (
                  <Link
                    key={index}
                    href={contact.href}
                    className='flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-200'
                  >
                    <contact.icon className='w-4 h-4' />
                    <span className='text-sm'>{contact.text}</span>
                  </Link>
                ))}
              </motion.div>
            </div>

            {/* Product Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className='text-lg font-semibold text-white mb-6'>Product</h4>
              <ul className='space-y-3'>
                {footerLinks.product.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className='text-gray-400 hover:text-white transition-colors duration-200 text-sm'
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Ecosystem Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className='text-lg font-semibold text-white mb-6'>Ecosystem</h4>
              <ul className='space-y-3'>
                {footerLinks.ecosystem.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className='text-gray-400 hover:text-white transition-colors duration-200 text-sm'
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className='text-lg font-semibold text-white mb-6'>Support</h4>
              <ul className='space-y-3'>
                {footerLinks.support.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className='text-gray-400 hover:text-white transition-colors duration-200 text-sm'
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h4 className='text-lg font-semibold text-white mb-6'>Legal</h4>
              <ul className='space-y-3'>
                {footerLinks.legal.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className='text-gray-400 hover:text-white transition-colors duration-200 text-sm'
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-white/10 py-8'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className='text-gray-400 text-sm'
            >
              © 2024 AGROTM. All rights reserved. Built with ❤️ for the DeFi community.
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className='flex items-center space-x-4'
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className='w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300'
                >
                  <social.icon className='w-5 h-5' />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className='mt-8 pt-8 border-t border-white/10'
          >
            <div className='text-center'>
              <h4 className='text-lg font-semibold text-white mb-4'>Stay Updated</h4>
              <p className='text-gray-400 mb-6'>
                Get the latest updates on AGROTM features and DeFi insights.
              </p>
              <div className='flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto'>
                <input
                  type='email'
                  placeholder='Enter your email'
                  className='flex-1 w-full sm:w-auto px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors duration-300'
                />
                <button className='w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105'>
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
