import React from 'react';
import { Link } from 'react-router-dom';

const AgroisyncFooterPrompt = () => {
  return (
    <>
      {/* FOOTER (LOGO aparece aqui também em todas as páginas) */}
      <footer className="site-footer">
        <div className="footer-inner">
          <Link to="/" className="footer-logo">
            <img src="/assets/logo.png" alt="Agroisync" />
          </Link>
          <div className="footer-links">
            <Link to="/about">Sobre</Link>
            <Link to="/contact">Contato</Link>
            <Link to="/privacy">Privacidade</Link>
            <Link to="/terms">Termos</Link>
            <Link to="/support">Suporte</Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AgroisyncFooterPrompt;
