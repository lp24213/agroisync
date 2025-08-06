'use client';

import { motion } from 'framer-motion';
import {
  // Discord,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  // Telegram,
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
  // { name: 'Discord', href: 'https://discord.gg/agrotm', icon: Discord },
  // { name: 'Telegram', href: 'https://t.me/agrotm', icon: Telegram },
  { name: 'GitHub', href: 'https://github.com/agrotm', icon: Github },
  { name: 'YouTube', href: 'https://youtube.com/agrotm', icon: Youtube },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/agrotm', icon: Linkedin },
];

const contactInfo = [
  { icon: Mail, text: 'contato@agrotm.com.br', href: 'mailto:contato@agrotm.com.br' },
  { icon: Phone, text: '+55 (66) 99236-2830', href: 'tel:+5566992362830' },
  { icon: MapPin, text: 'Global DeFi Platform', href: '#' },
  { icon: Globe, text: 'agrotm.com', href: 'https://agrotm.com' },
];

export function PremiumFooter() {
  return (
    <footer className='relative bg-[#000000] border-t border-[#00F0FF]/20'>
      {/* Background Elements */}
      <div className='absolute inset-0'>
        <div className='absolute bottom-0 left-0 w-full h-full'>
          <div className='absolute bottom-20 left-20 w-96 h-96 bg-[#00F0FF]/5 rounded-full blur-3xl' />
          <div className='absolute bottom-10 right-20 w-80 h-80 bg-[#00F0FF]/5 rounded-full blur-3xl' />
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
                    <div className='w-12 h-12 bg-gradient-to-br from-[#00F0FF] to-[#00d4e0] rounded-xl flex items-center justify-center'>
                      <Sparkles className='w-7 h-7 text-black' />
                    </div>
                    <div className='absolute -top-1 -right-1 w-3 h-3 bg-[#00F0FF] rounded-full animate-pulse' />
                  </div>
                  <div>
                    <h3 className='text-2xl font-orbitron font-bold text-[#00F0FF]'>AGROTM</h3>
                    <p className='text-[#cccccc] text-sm'>Agricultura Tokenizada do Futuro</p>
                  </div>
                </Link>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className='text-[#cccccc] mb-6 max-w-md'
              >
                Plataforma DeFi revolucionária que tokeniza ativos agrícolas e conecta agricultores ao mundo digital.
              </motion.p>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='space-y-3'
              >
                {contactInfo.map((contact, index) => (
                  <motion.a
                    key={contact.text}
                    href={contact.href}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className='flex items-center space-x-3 text-[#cccccc] hover:text-[#00F0FF] transition-colors duration-300'
                  >
                    <contact.icon className='w-4 h-4 text-[#00F0FF]' />
                    <span className='text-sm'>{contact.text}</span>
                  </motion.a>
                ))}
              </motion.div>
            </div>

            {/* Product Links */}
            <div>
              <motion.h4
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className='text-lg font-orbitron font-semibold text-[#00F0FF] mb-4'
              >
                Produto
              </motion.h4>
              <motion.ul
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className='space-y-2'
              >
                {footerLinks.product.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className='text-[#cccccc] hover:text-[#00F0FF] transition-colors duration-300 text-sm'
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* Ecosystem Links */}
            <div>
              <motion.h4
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className='text-lg font-orbitron font-semibold text-[#00F0FF] mb-4'
              >
                Ecossistema
              </motion.h4>
              <motion.ul
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className='space-y-2'
              >
                {footerLinks.ecosystem.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className='text-[#cccccc] hover:text-[#00F0FF] transition-colors duration-300 text-sm'
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* Support Links */}
            <div>
              <motion.h4
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className='text-lg font-orbitron font-semibold text-[#00F0FF] mb-4'
              >
                Suporte
              </motion.h4>
              <motion.ul
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className='space-y-2'
              >
                {footerLinks.support.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className='text-[#cccccc] hover:text-[#00F0FF] transition-colors duration-300 text-sm'
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* Legal Links */}
            <div>
              <motion.h4
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className='text-lg font-orbitron font-semibold text-[#00F0FF] mb-4'
              >
                Legal
              </motion.h4>
              <motion.ul
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className='space-y-2'
              >
                {footerLinks.legal.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className='text-[#cccccc] hover:text-[#00F0FF] transition-colors duration-300 text-sm'
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-[#00F0FF]/20 py-8'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-[#cccccc] text-sm'
            >
              © 2024 AGROTM. Todos os direitos reservados.
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='flex space-x-4'
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className='w-10 h-10 bg-black/50 border border-[#00F0FF]/20 rounded-lg flex items-center justify-center text-[#00F0FF] hover:bg-[#00F0FF]/10 hover:border-[#00F0FF] transition-all duration-300'
                >
                  <social.icon className='w-5 h-5' />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
