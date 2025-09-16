import React from 'react';
import { motion } from 'framer-motion';
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
      title: 'A AGROISYNC',
      links: [
        { label: 'Sobre Nós', path: '/about' },
        { label: 'Seja Parceiro', path: '/partnership' },
        { label: 'Trabalhe Conosco', path: '/careers' },
        { label: 'Política de Privacidade', path: '/privacy' }
      ]
    },
    {
      title: 'Contato',
      links: [
        { label: 'Fale Conosco', path: '/contact' },
        { label: 'Suporte Técnico', path: '/support' },
        { label: 'FAQ', path: '/faq' },
        { label: 'Central de Ajuda', path: '/help' }
      ]
    },
    {
      title: 'Suporte',
      links: [
        { label: 'Documentação', path: '/docs' },
        { label: 'Tutoriais', path: '/tutorials' },
        { label: 'API', path: '/api' },
        { label: 'Integrações', path: '/integrations' }
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
            <div className="agro-footer-brand">
              <div className="agro-footer-logo">
                <img src="/assets/logo.png" alt="Agroisync" className="agro-footer-logo-img" />
              </div>
              <p className="agro-footer-description">
                Conectando o agronegócio brasileiro através de tecnologia inovadora, 
                facilitando transações e otimizando a cadeia produtiva.
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
                  <span>contato@agroisync.com.br</span>
                </div>
                <div className="agro-contact-item">
                  <Globe size={16} />
                  <span>www.agroisync.com.br</span>
                </div>
              </div>
            </div>

            {/* Footer Sections */}
            <div className="agro-footer-sections">
              {footerSections.map((section, index) => (
                <div
                  key={section.title}
                  className="agro-footer-section"
                >
                  <h3 className="agro-footer-section-title">{section.title}</h3>
                  <ul className="agro-footer-links">
                    {section.links.map((link) => (
                      <li key={link.path}>
                        <Link to={link.path} className="agro-footer-link">
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
                  Sinop - MT | (66) 99236-2830
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
        .agro-footer {
          background: var(--agro-gradient-primary);
          color: var(--agro-light-gray);
          padding: 3rem 0 1rem;
          margin-top: 4rem;
          border-top: 1px solid rgba(57, 255, 20, 0.2);
          position: relative;
        }

        .agro-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--agro-gradient-accent);
        }

        .agro-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .agro-footer-main {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 3rem;
          margin-bottom: 2rem;
        }

        .agro-footer-brand {
          max-width: 400px;
        }

        .agro-footer-logo {
          margin-bottom: 1rem;
        }

        .agro-footer-logo-text {
          display: block;
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--agro-neon-green);
          margin-bottom: 0.25rem;
          text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
        }

        .agro-footer-tagline {
          font-size: 0.875rem;
          color: var(--agro-neon-blue);
          font-weight: 500;
        }

        .agro-footer-description {
          color: var(--agro-light-gray);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .agro-contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .agro-contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--agro-light-gray);
          font-size: 0.875rem;
        }

        .agro-contact-item svg {
          color: var(--txc-light-green);
          flex-shrink: 0;
        }

        .agro-footer-sections {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .agro-footer-section-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
        }

        .agro-footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .agro-footer-links li {
          margin-bottom: 0.5rem;
        }

        .agro-footer-link {
          color: var(--agro-light-gray);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.3s ease;
        }

        .agro-footer-link:hover {
          color: var(--txc-light-green);
        }

        .agro-footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1.5rem;
        }

        .agro-footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .agro-footer-copyright p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--agro-light-gray);
        }

        .agro-footer-location {
          color: var(--txc-light-green) !important;
          font-weight: 500;
        }

        .agro-footer-legal {
          display: flex;
          gap: 1.5rem;
        }

        .agro-footer-legal-link {
          color: var(--agro-light-gray);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.3s ease;
        }

        .agro-footer-legal-link:hover {
          color: var(--txc-light-green);
        }

        @media (max-width: 768px) {
          .agro-footer-main {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .agro-footer-sections {
            grid-template-columns: 1fr;
            gap: 1.5rem;
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
          .agro-footer {
            padding: 2rem 0 1rem;
          }

          .agro-footer-legal {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default AgroisyncFooter;