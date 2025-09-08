import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowUp } from 'lucide-react'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = {
    empresa: [
      { name: 'Sobre Nós', href: '/sobre' },
      { name: 'Nossa História', href: '/sobre#historia' },
      { name: 'Equipe', href: '/sobre#equipe' },
      { name: 'Carreiras', href: '/carreiras' }
    ],
    servicos: [
      { name: 'Marketplace', href: '/marketplace' },
      { name: 'AgroConecta', href: '/agroconecta' },
      { name: 'Analytics', href: '/analytics' },
      { name: 'API', href: '/api' }
    ],
    suporte: [
      { name: 'Central de Ajuda', href: '/help' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Contato', href: '/contato' },
      { name: 'Status', href: '/status' }
    ],
    legal: [
      { name: 'Termos de Uso', href: '/terms' },
      { name: 'Política de Privacidade', href: '/privacy' },
      { name: 'Cookies', href: '/cookies' },
      { name: 'LGPD', href: '/lgpd' }
    ]
  }

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/agrosync' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/agrosync' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/agrosync' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/agrosync' }
  ]

  return (
    <footer className='footer-futuristic'>
      <div className='container-futuristic'>
        {/* Main Footer Content */}
        <div className='mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5'>
          {/* Company Info */}
          <div className='lg:col-span-2'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link to='/' className='mb-6 flex items-center gap-3'>
                <div className='bg-primary-gradient flex h-12 w-12 items-center justify-center rounded-xl'>
                  <span className='text-xl font-bold text-white'>A</span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-gradient text-2xl font-bold'>AgroSync</span>
                  <span className='text-muted text-sm'>Futurista</span>
                </div>
              </Link>

              <p className='text-secondary mb-6 leading-relaxed'>
                A plataforma mais avançada e futurista do mundo para conectar produtores, compradores e transportadores
                do agronegócio.
              </p>

              {/* Contact Info */}
              <div className='space-y-3'>
                <div className='text-secondary flex items-center gap-3'>
                  <Mail size={16} className='text-primary' />
                  <a href='mailto:contato@agroisync.com' className='hover:text-primary transition-colors'>
                    contato@agroisync.com
                  </a>
                </div>

                <div className='text-secondary flex items-center gap-3'>
                  <Phone size={16} className='text-primary' />
                  <a
                    href='https://wa.me/5566992362830'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:text-primary transition-colors'
                  >
                    (66) 99236-2830
                  </a>
                </div>

                <div className='text-secondary flex items-center gap-3'>
                  <MapPin size={16} className='text-primary' />
                  <span>Sinop - MT, Brasil</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className='text-primary mb-4 text-lg font-semibold capitalize'>{category}</h3>
              <ul className='space-y-3'>
                {links.map(link => (
                  <li key={link.name}>
                    <Link to={link.href} className='text-secondary hover:text-primary transition-colors'>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social Links & Copyright */}
        <div className='border-light border-t pt-8'>
          <div className='flex flex-col items-center justify-between gap-6 md:flex-row'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className='flex items-center gap-4'
            >
              <span className='text-secondary'>Siga-nos:</span>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-secondary text-secondary hover:bg-primary flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:text-white'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className='flex items-center gap-4'
            >
              <p className='text-secondary text-sm'>© 2024 AgroSync. Todos os direitos reservados.</p>

              <motion.button
                onClick={scrollToTop}
                className='bg-primary-gradient flex h-10 w-10 items-center justify-center rounded-lg text-white transition-transform hover:scale-110'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowUp size={18} />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
