import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AgroNewsCarousel = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dados mockados de notícias do agronegócio (simulando API)
  const mockNews = [
    {
      id: 1,
      title: "Soja atinge nova máxima histórica com alta de 15%",
      subtitle: "Preços sobem impulsionados pela demanda chinesa e condições climáticas adversas",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=400&fit=crop",
      link: "#",
      category: "Commodities"
    },
    {
      id: 2,
      title: "Tecnologia 5G revoluciona agricultura de precisão",
      subtitle: "Fazendas conectadas aumentam produtividade em até 30% com IoT",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=400&fit=crop",
      link: "#",
      category: "Tecnologia"
    },
    {
      id: 3,
      title: "Milho: safra 2024 supera expectativas",
      subtitle: "Produtores comemoram resultado acima da média nacional",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop",
      link: "#",
      category: "Produção"
    },
    {
      id: 4,
      title: "Sustentabilidade: fazendas carbono neutro",
      subtitle: "Iniciativas verdes ganham força no agronegócio brasileiro",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=400&fit=crop",
      link: "#",
      category: "Sustentabilidade"
    },
    {
      id: 5,
      title: "Exportações agrícolas batem recorde",
      subtitle: "Brasil lidera vendas internacionais de commodities",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop",
      link: "#",
      category: "Exportação"
    }
  ];

  useEffect(() => {
    // Simular carregamento de API
    const loadNews = async () => {
      setIsLoading(true);
      try {
        // Aqui você pode integrar com APIs reais como:
        // - Globo Rural API
        // - Canal Rural API
        // - Outras APIs de notícias agro
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setNews(mockNews);
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        setNews(mockNews); // Fallback para dados mockados
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % news.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + news.length) % news.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play do carrossel
  useEffect(() => {
    if (news.length > 1) {
      const interval = setInterval(nextSlide, 5000); // Muda a cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [news.length]);

  if (isLoading) {
    return (
      <div className="txc-section">
        <div className="txc-container">
          <div className="txc-carousel" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="txc-text">Carregando notícias do agronegócio...</div>
          </div>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="txc-section">
        <div className="txc-container">
          <div className="txc-carousel" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="txc-text">Nenhuma notícia disponível no momento.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="txc-section">
      <div className="txc-container">
        <div className="txc-title h2" style={{ textAlign: 'center', marginBottom: 'var(--txc-space-2xl)' }}>
          {t('home.news.title', 'Notícias do Agronegócio')}
        </div>
        
        <div className="txc-carousel">
          <div 
            className="txc-carousel-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {news.map((item, index) => (
              <div key={item.id} className="txc-carousel-slide">
                <div 
                  className="txc-carousel-content"
                  style={{
                    backgroundImage: `linear-gradient(rgba(31, 46, 31, 0.7), rgba(31, 46, 31, 0.7)), url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative'
                  }}
                >
                  <div style={{ maxWidth: '800px', padding: 'var(--txc-space-xl)' }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div 
                        style={{
                          background: 'var(--txc-light-green)',
                          color: 'var(--txc-dark-green)',
                          padding: 'var(--txc-space-xs) var(--txc-space-md)',
                          borderRadius: 'var(--txc-radius-full)',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          display: 'inline-block',
                          marginBottom: 'var(--txc-space-md)'
                        }}
                      >
                        {item.category}
                      </div>
                      
                      <h2 
                        className="txc-title h2"
                        style={{ 
                          marginBottom: 'var(--txc-space-md)',
                          fontSize: '2.5rem',
                          lineHeight: '1.2'
                        }}
                      >
                        {item.title}
                      </h2>
                      
                      <p 
                        className="txc-subtitle"
                        style={{ 
                          marginBottom: 'var(--txc-space-xl)',
                          fontSize: '1.25rem',
                          maxWidth: '600px',
                          margin: '0 auto var(--txc-space-xl) auto'
                        }}
                      >
                        {item.subtitle}
                      </p>
                      
                      <motion.a
                        href={item.link}
                        className="txc-btn-primary"
                        style={{ 
                          padding: 'var(--txc-space-md) var(--txc-space-xl)',
                          fontSize: '1rem',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 'var(--txc-space-sm)'
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {t('home.news.readMore', 'Leia mais')}
                        <ExternalLink size={18} />
                      </motion.a>
                    </motion.div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navegação */}
          {news.length > 1 && (
            <>
              <button 
                className="txc-carousel-nav prev"
                onClick={prevSlide}
                aria-label="Notícia anterior"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button 
                className="txc-carousel-nav next"
                onClick={nextSlide}
                aria-label="Próxima notícia"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Indicadores */}
          {news.length > 1 && (
            <div className="txc-carousel-dots">
              {news.map((_, index) => (
                <button
                  key={index}
                  className={`txc-carousel-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Ir para notícia ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgroNewsCarousel;
