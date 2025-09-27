import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe
} from 'lucide-react';
import CryptoHash from './CryptoHash';

const AgroisyncFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Marketplace',
      links: [
        { label: 'Produtos', path: '/marketplace' },
        { label: 'Categorias', path: '/marketplace/categories' },
        { label: 'Vendedores', path: '/marketplace/sellers' },
        { label: 'Como Vender', path: '/marketplace/sell' }
      ]
    },
    {
      title: 'AgroConecta',
      links: [
        { label: 'Buscar Frete', path: '/agroconecta' },
        { label: 'Oferecer Frete', path: '/agroconecta/offer' },
        { label: 'Transportadores', path: '/agroconecta/carriers' },
        { label: 'Rastreamento', path: '/agroconecta/tracking' }
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
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/agroisync-logo.svg" alt="Agroisync" className="h-8 w-auto" loading="eager" />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              A plataforma mais futurista e sofisticada do mundo para conectar produtores, compradores e transportadores.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-green-600" />
                <span>Sinop - MT, Brasil</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-green-600" />
                <span>(66) 99236-2830</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-green-600" />
                <span>suporte@agroisync.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="w-4 h-4 text-green-600" />
                <span>www.agroisync.com</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.path} 
                      className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600 mb-4 md:mb-0">
            © {currentYear} AGROISYNC. Todos os direitos reservados.
          </div>
          <div className="flex gap-6 items-center">
            <Link to="/terms" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacy" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
              Privacidade
            </Link>
            <CryptoHash pageName="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AgroisyncFooter;