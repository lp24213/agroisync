import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const AgroisyncHeaderPrompt = () => {
  useEffect(() => {
    // Carregar o script de controle do header
    const script = document.createElement('script');
    script.src = '/src/scripts/agroisync-prompt.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="/src/scripts/agroisync-prompt.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <>
      {/* HEADER HTML (copiar para TODOS os templates/layouts) */}
      <header id="main-header" className="header-default">
        <div className="header-inner">
          <div className="logo-wrap">
            <Link to="/" className="logo-link" aria-label="Agroisync - Início">
              <img src="/assets/logo.png" alt="Agroisync" id="site-logo" />
            </Link>
            {/* REMOVIDO nav.tagline */}
          </div>

          <nav id="main-nav" aria-label="Menu principal">
            <ul className="nav-list">
              <li><Link to="/">Início</Link></li>
              <li><Link to="/loja">Loja</Link></li>
              <li><Link to="/agroconecta">AgroConecta</Link></li>
              <li><Link to="/marketplace">Marketplace</Link></li>
              <li><Link to="/tecnologia">Tecnologia</Link></li>
              <li><Link to="/parcerias">Parcerias</Link></li>
            </ul>
          </nav>

          <div className="actions">
            <div className="lang-select" id="lang-select">
              <select>
                <option value="pt">PT</option>
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="zh">ZH</option>
              </select>
            </div>
            <Link to="/login" className="btn-login">Entrar</Link>
            <Link to="/register" className="btn-cta">Cadastrar</Link>
            <button id="hamburger" className="hamburger" aria-label="Abrir menu">☰</button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className="mobile-menu">
        <nav aria-label="Menu mobile">
          <ul className="nav-list">
            <li><Link to="/">Início</Link></li>
            <li><Link to="/loja">Loja</Link></li>
            <li><Link to="/agroconecta">AgroConecta</Link></li>
            <li><Link to="/marketplace">Marketplace</Link></li>
            <li><Link to="/tecnologia">Tecnologia</Link></li>
            <li><Link to="/parcerias">Parcerias</Link></li>
          </ul>
        </nav>
        <div className="mobile-actions">
          <Link to="/login" className="btn-login">Entrar</Link>
          <Link to="/register" className="btn-cta">Cadastrar</Link>
        </div>
      </div>
    </>
  );
};

export default AgroisyncHeaderPrompt;
