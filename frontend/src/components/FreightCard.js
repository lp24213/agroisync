import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Package, Truck, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/**
 * FreightCard - Card de frete com limitações visuais
 * 
 * REGRAS:
 * - Usuários NÃO logados: blur nos dados sensíveis
 * - Usuários GRATUITOS: blur em alguns dados + badge upgrade
 * - Usuários PREMIUM: tudo desbloqueado
 */
const FreightCard = ({ freight, index }) => {
  const { user } = useAuth();
  
  const isLoggedIn = !!user;
  const userPlan = user?.plan || 'gratuito';
  const isPremium = isLoggedIn && (userPlan === 'profissional' || userPlan === 'enterprise');
  
  // Determinar o que deve ser borrado
  const shouldBlur = !isLoggedIn || !isPremium;
  const showUpgradePrompt = index >= 5 && !isPremium; // Depois de 5 fretes, mostrar upgrade

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.5) }}
      className='agro-card-animated'
      style={{
        padding: 'clamp(1rem, 3vw, 1.5rem)',
        background: 'var(--card-bg)',
        borderRadius: '16px',
        boxShadow: shouldBlur ? '0 4px 20px rgba(234, 179, 8, 0.15)' : '0 4px 20px rgba(15, 15, 15, 0.08)',
        border: shouldBlur ? '2px solid rgba(234, 179, 8, 0.3)' : '2px solid rgba(42, 127, 79, 0.1)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
      whileHover={{
        y: -8,
        boxShadow: shouldBlur ? '0 8px 30px rgba(234, 179, 8, 0.3)' : '0 8px 30px rgba(42, 127, 79, 0.2)',
        borderColor: shouldBlur ? 'rgba(234, 179, 8, 0.5)' : 'rgba(42, 127, 79, 0.3)'
      }}
    >
      {/* Badge Premium no canto */}
      {shouldBlur && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          padding: '0.4rem 0.8rem',
          borderRadius: '20px',
          fontSize: '0.7rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          zIndex: 10,
          boxShadow: '0 2px 10px rgba(245, 158, 11, 0.4)'
        }}>
          <Lock size={12} />
          PREMIUM
        </div>
      )}

      {/* Header */}
      <div style={{ 
        marginBottom: '1rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid rgba(42, 127, 79, 0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          <h4 style={{ 
            color: 'var(--accent)', 
            margin: 0,
            fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
            fontWeight: '700'
          }}>
            Frete #{freight.id}
          </h4>
          <span style={{
            background: freight.status === 'available' 
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
              : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: '600',
            textTransform: 'uppercase'
          }}>
            {freight.status === 'available' ? '✓ Disponível' : '✗ Indisponível'}
          </span>
        </div>
      </div>

      {/* Rotas */}
      <div style={{ marginBottom: '1rem', flex: 1 }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          marginBottom: '0.75rem',
          padding: '0.75rem',
          background: 'rgba(42, 127, 79, 0.05)',
          borderRadius: '8px',
          position: 'relative'
        }}>
          <MapPin size={18} style={{ color: '#10b981', flexShrink: 0 }} />
          <div style={{ 
            flex: 1, 
            minWidth: 0,
            filter: shouldBlur ? 'blur(4px)' : 'none',
            userSelect: shouldBlur ? 'none' : 'auto',
            pointerEvents: shouldBlur ? 'none' : 'auto'
          }}>
            <div style={{ 
              fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', 
              fontWeight: '600',
              color: 'var(--text)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              <span style={{ whiteSpace: 'nowrap' }}>
                {freight.origin_city || 'N/A'}/{freight.origin_state || 'N/A'}
              </span>
              <span style={{ color: 'var(--accent)' }}>→</span>
              <span style={{ whiteSpace: 'nowrap' }}>
                {freight.destination_city || freight.dest_city || 'N/A'}/{freight.destination_state || freight.dest_state || 'N/A'}
              </span>
            </div>
          </div>
          
          {/* Overlay de blur com mensagem */}
          {shouldBlur && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(234, 179, 8, 0.95)',
              color: 'white',
              padding: '0.3rem 0.6rem',
              borderRadius: '6px',
              fontSize: '0.7rem',
              fontWeight: '700',
              whiteSpace: 'nowrap',
              zIndex: 5
            }}>
              🔒 Faça Login Premium
            </div>
          )}
        </div>

        {/* Detalhes */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.5rem',
            background: 'rgba(59, 130, 246, 0.05)',
            borderRadius: '6px',
            filter: shouldBlur ? 'blur(3px)' : 'none',
            userSelect: shouldBlur ? 'none' : 'auto'
          }}>
            <Package size={16} style={{ color: '#3b82f6', flexShrink: 0 }} />
            <span style={{ color: 'var(--muted)', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {freight.freight_type || freight.cargo_type || 'Carga'}
            </span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.5rem',
            background: 'rgba(168, 85, 247, 0.05)',
            borderRadius: '6px',
            filter: shouldBlur ? 'blur(3px)' : 'none',
            userSelect: shouldBlur ? 'none' : 'auto'
          }}>
            <Truck size={16} style={{ color: '#a855f7', flexShrink: 0 }} />
            <span style={{ color: 'var(--muted)', fontWeight: '500' }}>
              {freight.capacity ? `${freight.capacity}kg` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer - Preço e Ação */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1rem',
        borderTop: '2px solid rgba(42, 127, 79, 0.1)',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1 1 auto' }}>
          <div style={{ 
            fontSize: '0.7rem', 
            color: 'var(--muted)',
            marginBottom: '0.25rem',
            fontWeight: '500'
          }}>
            Preço/km
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'baseline',
            gap: '0.25rem',
            filter: shouldBlur ? 'blur(4px)' : 'none',
            userSelect: shouldBlur ? 'none' : 'auto'
          }}>
            <span style={{ 
              fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', 
              color: 'var(--accent)',
              fontWeight: '600'
            }}>
              R$
            </span>
            <strong style={{ 
              color: 'var(--accent)', 
              fontSize: 'clamp(1.2rem, 3vw, 1.4rem)',
              fontWeight: '800'
            }}>
              {freight.price_per_km ? (freight.price_per_km / 100).toFixed(2) : '0.00'}
            </strong>
          </div>
        </div>

        <button
          className='agro-btn-animated'
          onClick={() => {
            if (shouldBlur) {
              // Redirecionar para planos
              window.location.href = '/plans';
            } else {
              // Redirecionar para detalhes
              const token = localStorage.getItem('token');
              if (!token) {
                window.location.href = '/login';
              } else {
                window.location.href = `/freight/${freight.id}`;
              }
            }
          }}
          style={{
            padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
            fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
            fontWeight: '700',
            background: shouldBlur 
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              : 'linear-gradient(135deg, var(--accent) 0%, #2e7d32 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: shouldBlur
              ? '0 4px 15px rgba(245, 158, 11, 0.4)'
              : '0 4px 15px rgba(42, 127, 79, 0.3)',
            whiteSpace: 'nowrap',
            flex: '0 0 auto'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = shouldBlur
              ? '0 6px 20px rgba(245, 158, 11, 0.5)'
              : '0 6px 20px rgba(42, 127, 79, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = shouldBlur
              ? '0 4px 15px rgba(245, 158, 11, 0.4)'
              : '0 4px 15px rgba(42, 127, 79, 0.3)';
          }}
        >
          {shouldBlur ? '🔓 Desbloquear' : '📞 Contratar'}
        </button>
      </div>

      {/* Mensagem de Upgrade (aparece após o 5º frete) */}
      {showUpgradePrompt && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
          border: '2px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ 
            margin: '0 0 0.5rem 0', 
            fontSize: '0.85rem', 
            color: '#d97706',
            fontWeight: '600'
          }}>
            ⚡ Limite de 5 fretes atingido!
          </p>
          <button
            onClick={() => window.location.href = '/plans'}
            style={{
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            🚀 Fazer Upgrade Agora
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default FreightCard;

