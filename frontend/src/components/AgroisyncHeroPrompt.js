import React from 'react';
import { Link } from 'react-router-dom';

const AgroisyncHeroPrompt = ({ 
  title = "Agroisync", 
  subtitle = "A Plataforma de Agronegócio Mais Futurista do Mundo",
  heroImage = "/images/marketplace.png",
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          position: 'relative',
          padding: '4rem 20px'
        }}
      >
        <div className="agro-hero-content" style={{
          textAlign: 'center',
          maxWidth: '800px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '3rem',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 className="agro-hero-title" style={{ marginBottom: '1rem', fontSize: '3rem', fontWeight: 'bold', color: '#2a7f4f' }}>{title}</h1>
          <p className="agro-hero-subtitle" style={{ marginBottom: '2rem', fontSize: '1.2rem', color: '#666' }}>{subtitle}</p>
          {showCTA && (
            <div className="agro-hero-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/marketplace" className="agro-btn-primary" style={{ padding: '1rem 2rem', backgroundColor: '#2a7f4f', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '600' }}>Explorar Marketplace</Link>
              <Link to="/about" className="agro-btn-outline" style={{ padding: '1rem 2rem', border: '2px solid #2a7f4f', color: '#2a7f4f', textDecoration: 'none', borderRadius: '10px', fontWeight: '600' }}>Saiba Mais</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AgroisyncHeroPrompt;
