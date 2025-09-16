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
          backgroundRepeat: 'no-repeat',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'start',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '4rem 20px'
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
        <div className="agro-store-section">
          <h3 className="agro-store-title">Loja Agroisync</h3>
          <div className="agro-store-item">
            <div className="agro-store-item-image">🚜</div>
            <div className="agro-store-item-info">
              <div className="agro-store-item-name">Trator John Deere 8584</div>
              <div className="agro-store-item-price">R$ 120.000</div>
            </div>
          </div>
          <div className="agro-store-item">
            <div className="agro-store-item-image">🌱</div>
            <div className="agro-store-item-info">
              <div className="agro-store-item-name">Semeadora John Deere</div>
              <div className="agro-store-item-price">R$ 60.000</div>
            </div>
          </div>
          <div className="agro-store-item">
            <div className="agro-store-item-image">🌾</div>
            <div className="agro-store-item-info">
              <div className="agro-store-item-name">Colheitadeira Case®</div>
              <div className="agro-store-item-price">R$ 850.000</div>
            </div>
          </div>
          <div className="agro-store-item">
            <div className="agro-store-item-image">⚙️</div>
            <div className="agro-store-item-info">
              <div className="agro-store-item-name">Implemento Agrícola</div>
              <div className="agro-store-item-price">R$ 12.600</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AgroisyncHeroPrompt;
