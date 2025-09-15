import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const TXCFooter = () => {
  const footerSections = [
    {
      title: 'A AGROISYNC',
      links: [
        { label: 'Sobre Nós', href: '/about' },
        { label: 'Seja um Parceiro', href: '/partners' },
        { label: 'Seja um Fornecedor', href: '/suppliers' },
        { label: 'Encontre uma AGROISYNC', href: '/locations' },
        { label: 'Trabalhe Conosco', href: '/careers' },
      ]
    },
    {
      title: 'Contato',
      links: [
        { label: 'Email', href: 'mailto:contato@agroisync.com' },
        { label: 'Compre pelo WhatsApp', href: 'https://wa.me/5511999999999' },
        { label: 'Denúncia de Falsificação', href: '/report' },
        { label: 'Trabalhe Conosco', href: '/careers' },
        { label: 'Atendimento à imprensa', href: '/press' },
      ]
    },
    {
      title: 'Suporte',
      links: [
        { label: 'Rastreio de Pedido', href: '/tracking' },
        { label: 'Trocas & Devoluções', href: '/returns' },
        { label: 'Segurança', href: '/security' },
        { label: 'Envio', href: '/shipping' },
        { label: 'Pagamento', href: '/payment' },
        { label: 'Tempo de Garantia', href: '/warranty' },
        { label: 'Política de Privacidade', href: '/privacy' },
        { label: 'Fale Conosco', href: '/contact' },
        { label: 'Site Seguro', href: '/security' },
      ]
    }
  ];

  return (
    <>
      {/* Footer TXC */}
      <footer className="txc-footer">
        <div className="txc-footer-content">
          {/* Brand Section */}
          <div className="txc-footer-brand">
            <div className="txc-footer-logo">
              AGROISYNC
            </div>
            <div className="txc-footer-text">
              © 2025 AGROISYNC LTDA
            </div>
            <div className="txc-footer-text">
              CNPJ: 42.548.082/0005-87
            </div>
            <div className="txc-footer-text">
              Todos os direitos reservados.
            </div>
            <div className="txc-footer-text">
              Rua das Flores, nº 123, Quadra 45 Lote 12.
              <br />
              Jardim Verde, São Paulo - SP - Brasil.
              <br />
              CEP: 01234-567
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="txc-footer-section">
              <h3 className="txc-footer-title">{section.title}</h3>
              {section.links.map((link, linkIndex) => (
                <Link
                  key={linkIndex}
                  to={link.href}
                  className="txc-footer-link"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="txc-footer-bottom">
          <p>
            AGROISYNC - Conectando o agronegócio brasileiro com tecnologia e inovação.
            <br />
            Desenvolvido com ❤️ para revolucionar o campo.
          </p>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <motion.div
        className="txc-whatsapp-float"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          background: '#25D366',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
          zIndex: 1000,
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
        title="Fale conosco no WhatsApp"
      >
        <MessageCircle size={28} />
      </motion.div>
    </>
  );
};

export default TXCFooter;