import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, MessageCircle } from 'lucide-react';

const AgroisyncFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Produtos',
      links: [
        { label: 'Produtos', path: '/produtos' },
        { label: 'Categorias', path: '/produtos/categories' },
        { label: 'Vendedores', path: '/produtos/sellers' },
        { label: 'Como Vender', path: '/produtos/sell' }
      ]
    },
    {
      title: 'Frete',
      links: [
        { label: 'Buscar Frete', path: '/frete' },
        { label: 'Oferecer Frete', path: '/frete/offer' },
        { label: 'Transportadores', path: '/frete/carriers' },
        { label: 'Rastreamento', path: '/frete/tracking' }
      ]
    },
    {
      title: 'Parcerias',
      links: [
        { label: 'Seja Parceiro', path: '/partnerships' },
        { label: 'Parceiros Atuais', path: '/partnerships/current' },
        { label: 'Benefícios', path: '/partnerships/benefits' },
        { label: 'Contato Comercial', path: '/partnerships/contact' }
      ]
    }
  ];

  return (
    <footer className='border-t border-gray-200 bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 py-1'>
        {/* Main Footer Content */}
  <div className='mb-1 grid grid-cols-1 gap-3 md:grid-cols-4'>
          {/* Company Info */}
          <div className='md:col-span-1'>
            <div className='mb-2 flex items-center gap-3'>
              <img src='/agroisync-logo.svg' alt='Agroisync' className='h-8 w-auto' loading='eager' />
            </div>
            <p className='mb-2 text-sm text-gray-600'>
              A plataforma mais futurista e sofisticada do mundo para conectar produtores, compradores e
              transportadores.
            </p>
            <div className='space-y-1'>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <MapPin className='h-4 w-4 text-green-600' />
                <span>Sinop - MT, Brasil</span>
              </div>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Phone className='h-4 w-4 text-green-600' />
                <span>(66) 99236-2830</span>
              </div>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Mail className='h-4 w-4 text-green-600' />
                <span>contato@agroisync.com</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className='mb-2 font-semibold text-gray-900'>{section.title}</h3>
              <ul className='space-y-1'>
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link to={link.path} className='text-sm text-gray-600 transition-colors hover:text-green-600'>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className='flex flex-col items-center justify-between border-t border-gray-200 pt-1 md:flex-row'>
          <div className='mb-2 text-sm text-gray-600 md:mb-0'>
            © {currentYear} AGROISYNC - Sinop - MT, Brasil - Todos os direitos reservados.
          </div>
          <div className='flex items-center gap-4'>
            <Link to='/terms' className='text-sm text-gray-600 transition-colors hover:text-green-600'>
              Termos de Uso
            </Link>
            <Link to='/privacy' className='text-sm text-gray-600 transition-colors hover:text-green-600'>
              Privacidade
            </Link>
            <a
              href='https://instagram.com/agroisync'
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-600 transition-colors hover:text-pink-600'
              aria-label='Instagram'
            >
              <Instagram className='h-5 w-5' />
            </a>
            <a
              href='https://wa.me/5566992362830'
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-600 transition-colors hover:text-green-600'
              aria-label='WhatsApp'
            >
              <MessageCircle className='h-5 w-5' />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AgroisyncFooter;
