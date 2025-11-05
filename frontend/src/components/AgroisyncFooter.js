import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Instagram, MessageCircle } from 'lucide-react';

const AgroisyncFooter = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const currentSearch = location && location.search ? location.search : '';
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: t('nav.products'),
      links: [
        { label: t('nav.products'), path: '/produtos' },
        { label: t('nav.categories'), path: '/produtos/categories' },
        { label: t('nav.sellers'), path: '/produtos/sellers' },
        { label: t('nav.howToSell'), path: '/produtos/sell' }
      ]
    },
    {
      title: t('footer.freight'),
      links: [
        { label: t('nav.searchFreight'), path: '/frete' },
        { label: t('nav.offerFreight'), path: '/frete/offer' },
        { label: t('nav.carriers'), path: '/frete/carriers' },
        { label: t('nav.tracking'), path: '/frete/tracking' }
      ]
    },
    {
      title: t('footer.resources'),
      links: [
        { label: t('footer.weatherSupplies'), path: '/clima' },
        { label: '🔑 API', path: '/api' },
        { label: t('footer.store'), path: '/loja' },
        { label: '📧 Contato', path: '/contact' }
      ]
    },
    {
      title: t('nav.partnerships'),
      links: [
        { label: t('nav.bePartner'), path: '/partnerships' },
        { label: t('nav.currentPartners'), path: '/partnerships/current' },
        { label: t('nav.benefits'), path: '/partnerships/benefits' },
        { label: t('nav.businessContact'), path: '/partnerships/contact' }
      ]
    }
  ];

  return (
    <footer className='bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 py-1'>
        {/* Main Footer Content */}
  <div className='mb-1 grid grid-cols-1 gap-2 md:grid-cols-4'>
          {/* Company Info */}
          <div className='md:col-span-1'>
            <div className='mb-2 flex items-center gap-3'>
              <img src='/LOGO_AGROISYNC_TRANSPARENTE.png' alt='Agroisync' className='h-16 w-auto md:h-20' loading='eager' />
            </div>
            <p className='mb-2 text-sm text-gray-600'>
              {t('footer.description')}
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
                    <Link to={{ pathname: link.path, search: currentSearch }} className='text-sm text-gray-600 transition-colors hover:text-green-600'>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className='border-t border-gray-200 pt-4 pb-3'>
          <div className='flex flex-col items-center justify-center gap-3'>
            <h4 className='text-sm font-semibold text-gray-700'>💳 {t('footer.paymentMethods')}</h4>
            <div className='flex flex-wrap items-center justify-center gap-3'>
              <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/200px-Mastercard_2019_logo.svg.png' alt='Mastercard' className='h-6 opacity-70 hover:opacity-100 transition-opacity' />
              <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png' alt='Visa' className='h-6 opacity-70 hover:opacity-100 transition-opacity' />
              <span className='bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md'>PIX 💸</span>
              <span className='bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-lg text-xs font-bold'>Boleto 📄</span>
            </div>
            <p className='text-xs text-gray-500'>{t('footer.secureTransactions')}</p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className='flex flex-col items-center justify-between pt-3 md:flex-row'>
          <div className='mb-1 text-xs text-gray-600 md:mb-0'>
            © {currentYear} AGROISYNC - Sinop - MT - {t('footer.allRightsReserved')}
          </div>
          <div className='flex items-center gap-4'>
            <Link to={{ pathname: '/api', search: currentSearch }} className='text-sm text-gray-600 transition-colors hover:text-green-600 font-semibold'>
              🔑 API
            </Link>
            <a href='/termos-uso.html' target='_blank' rel='noopener noreferrer' className='text-sm text-gray-600 transition-colors hover:text-green-600'>
              {t('footer.terms')}
            </a>
            <a href='/politica-privacidade.html' target='_blank' rel='noopener noreferrer' className='text-sm text-gray-600 transition-colors hover:text-green-600'>
              {t('footer.privacy')}
            </a>
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
