import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare,
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin
} from 'lucide-react';
import AgroSyncLogo from './AgroSyncLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Coluna 1: Logo e Contato */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            className="footer-column"
          >
            <div className="footer-logo mb-4">
              <AgroSyncLogo variant="text" size="medium" />
            </div>
            <h3 className="footer-title">Contato</h3>
            <div className="footer-contact">
              <div className="contact-item">
                <Mail size={16} />
                <span>contato@agrosync.com</span>
                </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+55 (66) 99236-2830</span>
                </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>Sinop - MT, Brasil</span>
                </div>
              </div>
            </motion.div>
          
          {/* Coluna 2: Empresa / Serviços */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            className="footer-column"
          >
            <h3 className="footer-title">Empresa</h3>
            <div className="footer-links">
              <a href="/about" className="footer-link">Sobre Nós</a>
              <a href="/marketplace" className="footer-link">Marketplace</a>
              <a href="/agroconecta" className="footer-link">AgroConecta</a>
              <a href="/loja" className="footer-link">Loja Agroisync</a>
              <a href="/plans" className="footer-link">Planos</a>
            </div>
            </motion.div>
        
          {/* Coluna 3: Suporte / Legal / Redes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            className="footer-column"
          >
            <h3 className="footer-title">Suporte</h3>
            <div className="footer-links">
              <a href="/help" className="footer-link">Central de Ajuda</a>
              <a href="/contact" className="footer-link">Fale Conosco</a>
              <a href="/terms" className="footer-link">Termos de Uso</a>
              <a href="/privacy" className="footer-link">Privacidade</a>
            </div>
            
            <div className="footer-social">
              <h4 className="social-title">Redes Sociais</h4>
              <div className="social-links">
                <a href="https://facebook.com" className="social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <Facebook size={18} />
                </a>
                <a href="https://twitter.com" className="social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                  <Twitter size={18} />
                </a>
                <a href="https://instagram.com" className="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <Instagram size={18} />
                </a>
                <a href="https://linkedin.com" className="social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
            </motion.div>
        </div>
            
        {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
          className="footer-cta"
        >
          <div className="cta-content">
            <h4>Precisa de ajuda especializada?</h4>
            <p>Nossa equipe está pronta para ajudar você a encontrar a melhor solução.</p>
            <button className="btn btn-primary btn-sm">
              <MessageSquare size={16} />
              Falar com Especialista
            </button>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="footer-bottom"
        >
          <div className="flex items-center justify-center space-x-4">
            <AgroSyncLogo variant="text" size="small" />
            <p className="copyright">
              © {currentYear} Agroisync. Todos os direitos reservados.
            </p>
          </div>
            </motion.div>
          </div>
      
      <style jsx>{`
        .footer {
          background: var(--panel-bg);
          border-top: 1px solid var(--border-light);
          padding: var(--spacing-xl) 0 var(--spacing-lg);
          margin-top: var(--spacing-xl);
        }
        
        .footer-content {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
        }
        
        .footer-column {
          display: flex;
          flex-direction: column;
        }
        
        .footer-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-md);
        }
        
        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--muted);
          font-size: 0.875rem;
        }
        
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        
        .footer-link {
          color: var(--muted);
          font-size: 0.875rem;
          transition: color var(--transition);
        }
        
        .footer-link:hover {
          color: var(--text);
        }
        
        .footer-social {
          margin-top: var(--spacing-md);
        }
        
        .social-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text);
          margin-bottom: var(--spacing-sm);
        }
        
        .social-links {
          display: flex;
          gap: var(--spacing-sm);
        }
        
        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: var(--bg);
          border-radius: var(--radius-sm);
          color: var(--muted);
          transition: all var(--transition);
        }
        
        .social-link:hover {
          background: var(--accent-metal);
          color: var(--text);
          transform: translateY(-2px);
        }
        
        .footer-cta {
          background: var(--bg);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
          text-align: center;
        }
        
        .cta-content h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-sm);
        }
        
        .cta-content p {
          color: var(--muted);
          margin-bottom: var(--spacing-md);
          font-size: 0.875rem;
        }
        
        .footer-bottom {
          text-align: center;
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--border-light);
        }
        
        .copyright {
          color: var(--muted);
          font-size: 0.875rem;
        }
        
        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg);
          }
          
          .footer {
            padding: var(--spacing-lg) 0;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
