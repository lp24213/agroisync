import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe
} from 'lucide-react';

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
      title: 'Parcérias',
      links: [
        { label: 'Seja Parceiro', path: '/partnerships' },
        { label: 'Parceiros Atuais', path: '/partnerships/current' },
        { label: 'Benefícios', path: '/partnerships/benefits' },
        { label: 'Contato Comercial', path: '/partnerships/contact' }
      ]
    }
  ];

  return (
    <>
      <footer className="agro-footer-new">
        <div className="agro-footer-container">
          {/* Main Footer Content */}
          <div className="agro-footer-main">
            {/* Company Info */}
            <div className="agro-footer-brand agro-card-animated">
              <div className="agro-footer-logo">
                <img src="/assets/LOGOTIPO-EM-BRANCO.png" alt="Agroisync" className="agro-footer-logo-img" />
              </div>
              <p className="agro-footer-description">
                A plataforma mais futurista e sofisticada do mundo para conectar produtores, 
                compradores e transportadores. Design premium, tecnologia de ponta e performance excepcional.
              </p>
              
              {/* Contact Info */}
              <div className="agro-contact-info">
                <div className="agro-contact-item">
                  <MapPin size={16} />
                  <span>Sinop - MT, Brasil</span>
                </div>
                <div className="agro-contact-item">
                  <Phone size={16} />
                  <span>(66) 99236-2830</span>
                </div>
                <div className="agro-contact-item">
                  <Mail size={16} />
                  <span>suporte@agroisync.com</span>
                </div>
                <div className="agro-contact-item">
                  <Globe size={16} />
                  <span>www.agroisync.com</span>
                </div>
              </div>
            </div>

            {/* Footer Sections */}
            <div className="agro-footer-sections agro-card-animated">
              {footerSections.map((section, index) => (
                <div
                  key={section.title}
                  className="agro-footer-section"
                >
                  <h3 className="agro-footer-section-title">{section.title}</h3>
                  <ul className="agro-footer-links">
                    {section.links.map((link) => (
                      <li key={link.path}>
                        <Link to={link.path} className="agro-footer-link agro-btn-animated">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="agro-footer-bottom">
            <div className="agro-footer-bottom-content">
              <div className="agro-footer-copyright">
                <p>
                  © {currentYear} AGROISYNC. Todos os direitos reservados.
                </p>
                <p className="agro-footer-location">
                  Sinop - MT | suporte@agroisync.com
                </p>
              </div>
              
              <div className="agro-footer-legal">
                <Link to="/terms" className="agro-footer-legal-link">
                  Termos de Uso
                </Link>
                <Link to="/privacy" className="agro-footer-legal-link">
                  Privacidade
                </Link>
                <Link to="/cookies" className="agro-footer-legal-link">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .agro-footer-new {
          background: var(--bg-primary);
          border-top: 1px solid var(--border-light);
          margin-top: var(--space-3xl);
        }

        .agro-footer-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: var(--space-3xl) var(--space-lg) var(--space-xl);
        }

        .agro-footer-main {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: var(--space-3xl);
          margin-bottom: var(--space-xl);
        }

        .agro-footer-brand {
          max-width: 400px;
        }

        .agro-footer-logo {
          margin-bottom: var(--space-md);
        }

        .agro-footer-logo-img {
          height: 40px;
          width: auto;
        }

        .agro-footer-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: var(--space-lg);
          font-family: var(--font-primary);
        }

        .agro-contact-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .agro-contact-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          color: var(--text-secondary);
          font-size: var(--text-sm);
          font-family: var(--font-primary);
        }

        .agro-contact-item svg {
          color: var(--agro-clean-green);
          flex-shrink: 0;
        }

        .agro-footer-sections {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-xl);
        }

        .agro-footer-section-title {
          font-size: var(--text-lg);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin-bottom: var(--space-md);
          font-family: var(--font-display);
        }

        .agro-footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .agro-footer-links li {
          margin-bottom: var(--space-sm);
        }

        .agro-footer-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: var(--text-sm);
          transition: var(--transition-normal);
          font-family: var(--font-primary);
        }

        .agro-footer-link:hover {
          color: var(--agro-clean-green);
        }

        .agro-footer-bottom {
          border-top: 1px solid var(--border-light);
          padding-top: var(--space-lg);
        }

        .agro-footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-md);
        }

        .agro-footer-copyright p {
          margin: 0;
          font-size: var(--text-sm);
          color: var(--text-secondary);
          font-family: var(--font-primary);
        }

        .agro-footer-location {
          color: var(--agro-clean-green) !important;
          font-weight: var(--font-medium);
        }

        .agro-footer-legal {
          display: flex;
          gap: var(--space-lg);
        }

        .agro-footer-legal-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: var(--text-sm);
          transition: var(--transition-normal);
          font-family: var(--font-primary);
        }

        .agro-footer-legal-link:hover {
          color: var(--agro-clean-green);
        }

        @media (max-width: 768px) {
          .agro-footer-main {
            grid-template-columns: 1fr;
            gap: var(--space-xl);
          }

          .agro-footer-sections {
            grid-template-columns: 1fr;
            gap: var(--space-lg);
          }

          .agro-footer-bottom-content {
            flex-direction: column;
            text-align: center;
          }

          .agro-footer-legal {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .agro-footer-container {
            padding: var(--space-xl) var(--space-md) var(--space-lg);
          }

          .agro-footer-legal {
            flex-direction: column;
            gap: var(--space-sm);
          }
        }
      `}</style>
    </>
  );
};

export default AgroisyncFooter;