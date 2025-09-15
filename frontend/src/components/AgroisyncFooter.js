import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Twitter
} from 'lucide-react';

const AgroisyncFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'A AGROISYNC',
      links: [
        { label: 'Sobre Nós', path: '/about' },
        { label: 'Nossa Missão', path: '/mission' },
        { label: 'Seja Parceiro', path: '/partnership' },
        { label: 'Trabalhe Conosco', path: '/careers' },
        { label: 'Imprensa', path: '/press' }
      ]
    },
    {
      title: 'Contato',
      links: [
        { label: 'Fale Conosco', path: '/contact' },
        { label: 'Suporte Técnico', path: '/support' },
        { label: 'FAQ', path: '/faq' },
        { label: 'Central de Ajuda', path: '/help' },
        { label: 'Status do Sistema', path: '/status' }
      ]
    },
    {
      title: 'Suporte',
      links: [
        { label: 'Documentação', path: '/docs' },
        { label: 'Tutoriais', path: '/tutorials' },
        { label: 'API', path: '/api' },
        { label: 'Integrações', path: '/integrations' },
        { label: 'Treinamentos', path: '/training' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' }
  ];

  return (
    <>
      <footer className="agro-footer">
      <div className="agro-container">
        {/* Main Footer Content */}
        <div className="agro-footer-main">
          {/* Company Info */}
          <div className="agro-footer-brand">
            <div className="agro-footer-logo">
              <span className="agro-footer-logo-text">AGROISYNC</span>
              <span className="agro-footer-tagline">AgroTech Solutions</span>
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
              <motion.div
                key={section.title}
                className="agro-footer-section"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h4 className="agro-footer-section-title">{section.title}</h4>
                <ul className="agro-footer-links">
                  {section.links.map((link) => (
                    <li key={link.label} className="agro-footer-link-item">
                      <Link to={link.path} className="agro-footer-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
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
              <div className="agro-footer-legal">
                <Link to="/privacy" className="agro-footer-legal-link">
                  Política de Privacidade
                </Link>
                <Link to="/terms" className="agro-footer-legal-link">
                  Termos de Uso
                </Link>
                <Link to="/cookies" className="agro-footer-legal-link">
                  Política de Cookies
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="agro-footer-social">
              <span className="agro-social-label">Siga-nos:</span>
              <div className="agro-social-icons">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="agro-social-icon"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </footer>

      <style jsx>{`
        .agro-footer {
          background: var(--agro-dark-green);
          color: var(--agro-light-gray);
          padding: 60px 0 20px;
          margin-top: 80px;
        }

        .agro-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .agro-footer-main {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 60px;
          margin-bottom: 40px;
        }

        .agro-footer-brand {
          max-width: 400px;
        }

        .agro-footer-logo {
          margin-bottom: 20px;
        }

        .agro-footer-logo-text {
          font-size: 32px;
          font-weight: 900;
          font-family: var(--agro-font-secondary);
          color: white;
          display: block;
          line-height: 1;
        }

        .agro-footer-tagline {
          font-size: 14px;
          color: var(--agro-green-accent);
          font-weight: 500;
          margin-top: 4px;
          display: block;
        }

        .agro-footer-description {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 30px;
          color: var(--agro-light-gray);
        }

        .agro-contact-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .agro-contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: var(--agro-light-gray);
        }

        .agro-contact-item svg {
          color: var(--agro-green-accent);
          flex-shrink: 0;
        }

        .agro-footer-sections {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        .agro-footer-section-title {
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin-bottom: 20px;
          font-family: var(--agro-font-secondary);
        }

        .agro-footer-links {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .agro-footer-link-item {
          margin-bottom: 12px;
        }

        .agro-footer-link {
          color: var(--agro-light-gray);
          text-decoration: none;
          font-size: 14px;
          transition: all 0.3s ease;
          position: relative;
        }

        .agro-footer-link:hover {
          color: var(--agro-green-accent);
          padding-left: 8px;
        }

        .agro-footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 30px;
        }

        .agro-footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .agro-footer-copyright p {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: var(--agro-light-gray);
        }

        .agro-footer-legal {
          display: flex;
          gap: 20px;
        }

        .agro-footer-legal-link {
          color: var(--agro-light-gray);
          text-decoration: none;
          font-size: 12px;
          transition: color 0.3s ease;
        }

        .agro-footer-legal-link:hover {
          color: var(--agro-green-accent);
        }

        .agro-footer-social {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .agro-social-label {
          font-size: 14px;
          color: var(--agro-light-gray);
          font-weight: 500;
        }

        .agro-social-icons {
          display: flex;
          gap: 12px;
        }

        .agro-social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: var(--agro-light-gray);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .agro-social-icon:hover {
          background: var(--agro-green-accent);
          color: var(--agro-dark-green);
        }

        @media (max-width: 1024px) {
          .agro-footer-main {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .agro-footer-sections {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }
        }

        @media (max-width: 768px) {
          .agro-footer {
            padding: 40px 0 20px;
          }

          .agro-footer-sections {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .agro-footer-bottom-content {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }

          .agro-footer-legal {
            justify-content: center;
          }

          .agro-footer-social {
            flex-direction: column;
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .agro-container {
            padding: 0 16px;
          }

          .agro-footer-logo-text {
            font-size: 28px;
          }

          .agro-footer-description {
            font-size: 14px;
          }

          .agro-footer-legal {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </>
  );
};

export default AgroisyncFooter;
