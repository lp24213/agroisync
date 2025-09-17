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
    <>
      <footer className="agro-footer-new">
        <div className="agro-footer-container">
          {/* Main Footer Content */}
          <div className="agro-footer-main">
            {/* Company Info */}
            <div className="agro-footer-brand agro-card-animated">
              <div className="agro-footer-logo">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJ3aGVhdEdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM5MEVFRTAiLz4KPHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiMzMkNEMzIiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMjI4QjIyIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0idGV4dEdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM5MEVFRTAiLz4KPHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiMzMkNEMzIiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMjI4QjIyIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxmaWx0ZXIgaWQ9ImRyb3BTaGFkb3ciIHg9Ii01MCUiIHk9Ii01MCUiIHdpZHRoPSIyMDAlIiBoZWlnaHQ9IjIwMCUiPgo8ZmVHYXVzc2lhbkJsdXIgaW49IlNvdXJjZUdyYXBoaWMiIHN0ZERldmlhdGlvbj0iMiIvPgo8ZmVPZmZzZXQgZHg9IjEiIGR5PSIxIiByZXN1bHQ9Im9mZnNldCIvPgo8ZmVGbG9vZCBmbG9vZC1jb2xvcj0icmdiYSgwLDAsMCwwLjEpIi8+CjxmZUNvbXBvc2l0ZSBpbj0ib2Zmc2V0IiBvcGVyYXRvcj0iaW4iLz4KPGZlTWVyZ2U+CjxmZU1lcmdlTm9kZS8+CjxmZU1lcmdlTm9kZSBpbj0iU291cmNlR3JhcGhpYyIvPgo8L2ZlTWVyZ2U+CjwvZmlsdGVyPgo8L2RlZnM+CjxnIGZpbHRlcj0idXJsKCNkcm9wU2hhZG93KSI+CjxnPgo8cGF0aCBkPSJNNDUgNTUgUTUwIDUwIDU1IDQ1IiBzdHJva2U9InVybCgjd2hlYXRHcmFkaWVudCkiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNNDcgNTIgUTQyIDQ4IDQwIDQ1IiBzdHJva2U9InVybCgjd2hlYXRHcmFkaWVudCkiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNNDkgNTAgUTQ0IDQ2IDQyIDQzIiBzdHJva2U9InVybCgjd2hlYXRHcmFkaWVudCkiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8ZWxsaXBzZSBjeD0iNTUiIGN5PSI0NSIgcng9IjgiIHJ5PSIxMiIgZmlsbD0idXJsKCN3aGVhdEdyYWRpZW50KSIgb3BhY2l0eT0iMC44Ii8+CjxlbGxpcHNlIGN4PSI1NSIgY3k9IjQ1IiByeD0iNiIgcnk9IjEwIiBmaWxsPSJ1cmwoI3doZWF0R3JhZGllbnQpIi8+CjxsaW5lIHgxPSI1MCIgeTE9IjM1IiB4Mj0iNTAiIHkyPSIzMCIgc3Ryb2tlPSJ1cmwoI3doZWF0R3JhZGllbnQpIiBzdHJva2Utd2lkdGg9IjEuNSIvPgo8bGluZSB4MT0iNTIiIHkxPSIzNiIgeDI9IjUyIiB5Mj0iMzEiIHN0cm9rZT0idXJsKCN3aGVhdEdyYWRpZW50KSIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPGxpbmUgeDE9IjU0IiB5MT0iMzciIHgyPSI1NCIgeTI9IjMyIiBzdHJva2U9InVybCgjd2hlYXRHcmFkaWVudCkiIHN0cm9rZS13aWR0aD0iMS41Ii8+CjxsaW5lIHgxPSI1NiIgeTE9IjM2IiB4Mj0iNTYiIHkyPSIzMSIgc3Ryb2tlPSJ1cmwoI3doZWF0R3JhZGllbnQpIiBzdHJva2Utd2lkdGg9IjEuNSIvPgo8bGluZSB4MT0iNTgiIHkxPSIzNSIgeDI9IjU4IiB5Mj0iMzAiIHN0cm9rZT0idXJsKCN3aGVhdEdyYWRpZW50KSIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPGxpbmUgeDE9IjYwIiB5MT0iMzYiIHgyPSI2MCIgeTI9IjMxIiBzdHJva2U9InVybCgjd2hlYXRHcmFkaWVudCkiIHN0cm9rZS13aWR0aD0iMS41Ii8+CjwvZz4KPGcgb3BhY2l0eT0iMC43Ij4KPHBhdGggZD0iTTY1IDU4IFE3MCA1MyA3NSA0OCIgc3Ryb2tlPSJ1cmwoI3doZWF0R3JhZGllbnQpIiBzdHJva2Utd2lkdGg9IjIuNSIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNNjcgNTUgUTYyIDUxIDYwIDQ4IiBzdHJva2U9InVybCgjd2hlYXRHcmFkaWVudCkiIHN0cm9rZS13aWR0aD0iMS41IiBmaWxsPSJub25lIi8+CjxlbGxpcHNlIGN4PSI3NSIgY3k9IjQ4IiByeD0iNiIgcnk9IjkiIGZpbGw9InVybCgjd2hlYXRHcmFkaWVudCkiIG9wYWNpdHk9IjAuOCIvPgo8ZWxsaXBzZSBjeD0iNzUiIGN5PSI0OCIgcng9IjQiIHJ5PSI3IiBmaWxsPSJ1cmwoI3doZWF0R3JhZGllbnQpIi8+CjxsaW5lIHgxPSI3MiIgeTE9IjQwIiB4Mj0iNzIiIHkyPSIzNiIgc3Ryb2tlPSJ1cmwoI3doZWF0R3JhZGllbnQpIiBzdHJva2Utd2lkdGg9IjEiLz4KPGxpbmUgeDE9Ijc0IiB5MT0iNDEiIHgyPSI3NCIgeTI9IjM3IiBzdHJva2U9InVybCgjd2hlYXRHcmFkaWVudCkiIHN0cm9rZS13aWR0aD0iMSIvPgo8bGluZSB4MT0iNzYiIHkxPSI0MiIgeDI9Ijc2IiB5Mj0iMzgiIHN0cm9rZT0idXJsKCN3aGVhdEdyYWRpZW50KSIgc3Ryb2tlLXdpZHRoPSIxIi8+CjxsaW5lIHgxPSI3OCIgeTE9IjQxIiB4Mj0iNzgiIHkyPSIzNyIgc3Ryb2tlPSJ1cmwoI3doZWF0R3JhZGllbnQpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9nPgo8cGF0aCBkPSJNNDAgNjAgUTUwIDU4IDYwIDYwIFE3MCA2MiA4MCA2MCIgc3Ryb2tlPSJ1cmwoI3doZWF0R3JhZGllbnQpIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPC9nPgo8dGV4dCB4PSIxMDAiIHk9IjcwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI2MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9InVybCgjdGV4dEdyYWRpZW50KSIgZmlsdGVyPSJ1cmwoI2Ryb3BTaGFkb3cpIj4KYWdyb2lzeW5jCjwvdGV4dD4KPC9zdmc+" alt="Agroisync" className="agro-footer-logo-img" />
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