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
        className="agro-hero-section" 
        id="home-hero" 
        data-hero="true"
        data-hero-img={heroImage}
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="agro-hero-content">
          <h1 className="agro-hero-title">{title}</h1>
          <p className="agro-hero-subtitle">{subtitle}</p>
          {showCTA && (
            <div className="agro-hero-buttons">
              <Link to="/marketplace" className="agro-btn-primary">Explorar Marketplace</Link>
              <Link to="/about" className="agro-btn-outline">Saiba Mais</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AgroisyncHeroPrompt;
