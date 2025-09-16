import React from 'react';
import { Link } from 'react-router-dom';

const AgroisyncHeroPrompt = ({ 
  title = "Agroisync", 
  subtitle = "A Plataforma de Agronegócio Mais Futurista do Mundo",
  heroImage = "/assets/hero-plantacao-4k.jpg",
  showCTA = true 
}) => {
  return (
    <>
      {/* HERO: apenas nas páginas com imagem (HOME, banners) */}
      <section 
        className="hero hero-image" 
        id="home-hero" 
        data-hero="true"
        data-hero-img={heroImage}
        style={{ backgroundImage: `url('${heroImage}')` }}
      >
        <div className="hero-inner">
          <h1 className="hero-title">{title}</h1>
          <p className="hero-sub">{subtitle}</p>
          {showCTA && (
            <div className="hero-cta">
              <Link to="/marketplace" className="btn-primary">Explorar Marketplace</Link>
              <Link to="/about" className="btn-outline">Saiba Mais</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AgroisyncHeroPrompt;
