// 💰 COMPONENTE DE BANNER PUBLICITÁRIO
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { getApiUrl } from '../../config/constants';

const AdBanner = ({ placement = 'sidebar', closeable = true }) => {
  const [ad, setAd] = useState(null);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAd();
  }, [placement]);

  const fetchAd = async () => {
    try {
      const response = await fetch(`${getApiUrl('')}/monetization/ads?placement=${placement}`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const randomAd = data.data[Math.floor(Math.random() * data.data.length)];
        setAd(randomAd);
        
        // Registrar impressão
        trackImpression(randomAd.id);
      }
    } catch (error) {
      console.error('Error fetching ad:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackImpression = async (adId) => {
    try {
      await fetch(`${getApiUrl('')}/monetization/ads/track/impression`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId })
      });
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  };

  const trackClick = async () => {
    if (!ad) return;
    
    try {
      await fetch(`${getApiUrl('')}/monetization/ads/track/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: ad.id })
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const handleClick = () => {
    trackClick();
    if (ad.link_url) {
      window.open(ad.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  if (loading || !ad || !visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '2px solid #d1d5db',
        cursor: ad.link_url ? 'pointer' : 'default',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        marginBottom: '1.5rem'
      }}
      onClick={ad.link_url ? handleClick : undefined}
    >
      {/* Badge "Patrocinado" */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(59, 130, 246, 0.9)',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: '700',
          zIndex: 10,
          backdropFilter: 'blur(8px)'
        }}
      >
        💼 PATROCINADO
      </div>

      {/* Botão fechar */}
      {closeable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s',
            backdropFilter: 'blur(4px)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(220, 38, 38, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.5)';
          }}
        >
          <X size={16} />
        </button>
      )}

      {/* Imagem do anúncio */}
      {ad.image_url && (
        <img
          src={ad.image_url}
          alt={ad.title}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '200px',
            objectFit: 'cover'
          }}
          loading="lazy"
        />
      )}

      {/* Conteúdo do anúncio */}
      <div style={{ padding: '1.25rem' }}>
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.5rem',
            lineHeight: '1.4'
          }}
        >
          {ad.title}
        </h3>
        
        {ad.description && (
          <p
            style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              lineHeight: '1.5',
              marginBottom: '1rem'
            }}
          >
            {ad.description}
          </p>
        )}

        {ad.link_url && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#3b82f6',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            Saiba mais
            <ExternalLink size={16} />
          </div>
        )}
      </div>

      {/* Hover effect */}
      <style>{`
        motion.div:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </motion.div>
  );
};

export default AdBanner;

