import React, { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingCart, MapPin, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl } from '../utils/apiHelper';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const apiUrl = getApiUrl('favorites');
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
    setLoading(false);
  }

  async function removeFavorite(productId) {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = getApiUrl('favorites');
      
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });

      loadFavorites();
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <p>Carregando favoritos...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Heart className="w-10 h-10 text-red-500" fill="currentColor" />
          Meus Favoritos
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          {favorites.length} {favorites.length === 1 ? 'produto salvo' : 'produtos salvos'}
        </p>
      </div>

      {/* LISTA DE FAVORITOS */}
      {favorites.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: '#f9fafb',
          borderRadius: '20px',
          border: '2px dashed #d1d5db'
        }}>
          <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
            Nenhum produto favorito ainda
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '16px' }}>
            Adicione produtos aos favoritos para acessá-los rapidamente!
          </p>
          <button
            onClick={() => navigate('/marketplace')}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #2F5233 0%, #4a7c59 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(47, 82, 51, 0.3)'
            }}
            aria-label="Explorar marketplace"
          >
            Explorar Marketplace
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {favorites.map((fav, idx) => (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -8, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  position: 'relative'
                }}
              >
                {/* IMAGEM */}
                <div 
                  onClick={() => navigate(`/product/${fav.product_id}`)}
                  style={{ position: 'relative' }}
                >
                  {fav.images && JSON.parse(fav.images)[0] ? (
                    <img
                      src={JSON.parse(fav.images)[0]}
                      alt={fav.name}
                      style={{
                        width: '100%',
                        height: '220px',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '220px',
                      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '64px'
                    }}>
                      🌾
                    </div>
                  )}

                  {/* BOTÃO REMOVER */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(fav.product_id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '10px',
                      background: 'rgba(255,255,255,0.95)',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fee2e2';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    aria-label={`Remover ${fav.name} dos favoritos`}
                  >
                    <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
                  </button>
                </div>

                {/* INFORMAÇÕES */}
                <div 
                  onClick={() => navigate(`/product/${fav.product_id}`)}
                  style={{ padding: '20px' }}
                >
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    color: '#111827',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {fav.name}
                  </h3>

                  <div style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold', 
                    color: '#2F5233',
                    marginBottom: '12px'
                  }}>
                    R$ {parseFloat(fav.price).toFixed(2)}
                  </div>

                  {fav.origin_city && (
                    <div style={{ 
                      fontSize: '13px', 
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '16px'
                    }}>
                      <MapPin className="w-4 h-4" />
                      {fav.origin_city}/{fav.origin_state}
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${fav.product_id}`);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#2F5233',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#1e3a22'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#2F5233'}
                    aria-label={`Ver detalhes de ${fav.name}`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Ver Detalhes
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Favorites;

