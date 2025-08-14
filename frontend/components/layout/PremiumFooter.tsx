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
          { name: 'Twitter', href: 'https://twitter.com/agroisync', icon: Twitter },
  // { name: 'Discord', href: 'https://discord.gg/agrotm', icon: Discord },
  // { name: 'Telegram', href: 'https://t.me/agrotm', icon: Telegram },
          { name: 'GitHub', href: 'https://github.com/agroisync', icon: Github },
          { name: 'YouTube', href: 'https://youtube.com/agroisync', icon: Youtube },
          { name: 'LinkedIn', href: 'https://linkedin.com/company/agroisync', icon: Linkedin },
];

const contactInfo = [
  { icon: Mail, text: 'contato@agroisync.com', href: 'mailto:contato@agroisync.com' },
  { icon: Phone, text: '+55 (66) 99236-2830', href: 'tel:+5566992362830' },
  { icon: MapPin, text: 'Global DeFi Platform', href: '#' },
  { icon: Globe, text: 'agroisync.com', href: 'https://agroisync.com' },
];

export function PremiumFooter() {
  return (
    <footer className='relative bg-[#000000] border-t border-[#00bfff]/20'>
      {/* Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute bottom-20 left-20 w-96 h-96 bg-[#00bfff]/5 rounded-full blur-3xl' />
        <div className='absolute bottom-10 right-20 w-80 h-80 bg-[#00bfff]/5 rounded-full blur-3xl' />
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {/* Top Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
          {/* Brand */}
          <div className='lg:col-span-1'>
            <div className='flex items-center mb-6'>
              <div className='w-12 h-12 bg-gradient-to-br from-[#00FF7F] to-[#00d4e0] rounded-xl flex items-center justify-center'>
                <span className='text-black font-bold text-lg'>A</span>
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-[#00FF7F] rounded-full animate-pulse' />
              </div>
              <div className='ml-3'>
                <h3 className='text-2xl font-orbitron font-bold text-[#00FF7F]'>AGROISYNC</h3>
                <p className='text-[#cccccc] text-sm'>DeFi Agriculture</p>
              </div>
            </div>
            <p className='text-[#cccccc] mb-6 leading-relaxed'>
              Revolucionando o agronegócio através da tecnologia blockchain e inovação digital.
            </p>
            <div className='space-y-3'>
              {contactInfo.map((contact, index) => (
                <div
                  key={index}
                  className='flex items-center space-x-3 text-[#cccccc] hover:text-[#00FF7F] transition-colors duration-300'
                >
                  <contact.icon className='w-4 h-4 text-[#00FF7F]' />
                  <span className='text-sm'>{contact.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-lg font-orbitron font-semibold text-[#00FF7F] mb-4'>
              Links Rápidos
            </h3>
            <ul className='space-y-2'>
              {footerLinks.product.map((link, index) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className='text-[#cccccc] hover:text-[#00FF7F] transition-colors duration-300 text-sm'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className='text-lg font-orbitron font-semibold text-[#00FF7F] mb-4'>
              Recursos
            </h3>
            <ul className='space-y-2'>
              {footerLinks.ecosystem.map((link, index) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className='text-[#cccccc] hover:text-[#00FF7F] transition-colors duration-300 text-sm'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className='text-lg font-orbitron font-semibold text-[#00FF7F] mb-4'>
              Redes Sociais
            </h3>
            <ul className='space-y-2'>
              {socialLinks.map((social, index) => (
                <li key={social.name}>
                  <Link
                    href={social.href}
                    className='text-[#cccccc] hover:text-[#00FF7F] transition-colors duration-300 text-sm'
                  >
                    {social.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-[#00FF7F]/20 py-8'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='text-center md:text-left mb-4 md:mb-0'>
              <p className='text-[#cccccc] text-sm'>
                © 2024 AGROISYNC. Todos os direitos reservados.
              </p>
            </div>
            <div className='flex space-x-4'>
              {socialLinks.map((social, index) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className='w-10 h-10 bg-black/50 border border-[#00FF7F]/20 rounded-lg flex items-center justify-center text-[#00FF7F] hover:bg-[#00FF7F]/10 hover:border-[#00FF7F] transition-all duration-300'
                >
                  <social.icon className='w-4 h-4' />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
