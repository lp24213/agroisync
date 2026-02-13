import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Bell } from 'lucide-react';
import cotacoesService from '../../services/cotacoesService';
import { motion } from 'framer-motion';

const CotacoesWidget = ({ produtos = ['soja', 'milho', 'cafe', 'boi-gordo'], compact = false }) => {
  const [cotacoes, setCotacoes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadCotacoes();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(loadCotacoes, 5 * 60 * 1000); // Atualizar a cada 5min
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, produtos]);

  async function loadCotacoes() {
    setLoading(true);
    const result = await cotacoesService.getCotacoes(produtos);
    
    if (result.success) {
      setCotacoes(result.data);
      setLastUpdate(new Date());
    }
    
    setLoading(false);
  }

  function getTimeSinceUpdate() {
    if (!lastUpdate) return 'Carregando...';
    
    const seconds = Math.floor((new Date() - lastUpdate) / 1000);
    
    if (seconds < 60) return 'Agora mesmo';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min atrás`;
    return `${Math.floor(seconds / 3600)}h atrás`;
  }

  if (loading && !cotacoes) {
    return (
      <div 
        className="cotacoes-widget loading"
        style={{ 
          padding: '20px', 
          background: 'white', 
          borderRadius: '12px',
          textAlign: 'center' 
        }}
      >
        <RefreshCw className="w-6 h-6 animate-spin inline-block text-gray-400" />
        <p style={{ marginTop: '10px', color: '#6b7280' }}>
          Carregando cotações...
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      className="cotacoes-widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ 
        background: 'white', 
        borderRadius: '16px',
        padding: compact ? '16px' : '24px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        border: '1px solid #e5e7eb'
      }}
      role="region"
      aria-label="Cotações em tempo real de produtos agrícolas"
    >
      {/* HEADER */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px' 
      }}>
        <h3 style={{ 
          fontSize: compact ? '16px' : '20px', 
          fontWeight: 'bold',
          margin: 0 
        }}>
          📊 Cotações em Tempo Real
        </h3>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            {getTimeSinceUpdate()}
          </span>
          
          <button
            onClick={loadCotacoes}
            disabled={loading}
            style={{
              padding: '6px',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            aria-label="Atualizar cotações"
            title="Atualizar cotações"
          >
            <RefreshCw 
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              style={{ color: '#6b7280' }}
            />
          </button>
        </div>
      </div>

      {/* GRID DE COTAÇÕES */}
      <div 
        className="cotacoes-grid"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: compact ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px'
        }}
      >
        {cotacoes && Object.entries(cotacoes).map(([produto, dados]) => (
          <motion.div
            key={produto}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: dados.variacao > 0 ? '#ecfdf5' : dados.variacao < 0 ? '#fef2f2' : '#f9fafb',
              borderRadius: '12px',
              padding: compact ? '12px' : '16px',
              border: `2px solid ${dados.variacao > 0 ? '#10b981' : dados.variacao < 0 ? '#ef4444' : '#e5e7eb'}`,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={() => window.location.href = `/marketplace?categoria=graos&produto=${produto}`}
            role="article"
            aria-label={`Cotação de ${produto}: R$ ${dados.preco.toFixed(2)}, variação de ${dados.variacao > 0 ? '+' : ''}${dados.variacao.toFixed(2)}%`}
          >
            {/* NOME DO PRODUTO */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span style={{ 
                fontSize: compact ? '13px' : '14px', 
                fontWeight: '600',
                color: '#374151',
                textTransform: 'capitalize'
              }}>
                {produto.replace('-', ' ')}
              </span>
              
              {dados.variacao !== 0 && (
                dados.variacao > 0 ? (
                  <TrendingUp 
                    className="w-4 h-4" 
                    style={{ color: '#10b981' }}
                    aria-label="Preço em alta"
                  />
                ) : (
                  <TrendingDown 
                    className="w-4 h-4" 
                    style={{ color: '#ef4444' }}
                    aria-label="Preço em baixa"
                  />
                )
              )}
            </div>

            {/* PREÇO */}
            <div style={{ 
              fontSize: compact ? '20px' : '24px', 
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '4px'
            }}>
              R$ {dados.preco.toFixed(2)}
            </div>

            {/* VARIAÇÃO */}
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: '600',
                color: dados.variacao > 0 ? '#10b981' : dados.variacao < 0 ? '#ef4444' : '#6b7280'
              }}>
                {dados.variacao > 0 ? '+' : ''}{dados.variacao.toFixed(2)}%
              </span>
              
              <span style={{ 
                fontSize: '11px', 
                color: '#9ca3af'
              }}>
                /{dados.unidade || 'sc'}
              </span>
            </div>

            {/* FONTE */}
            {dados.fonte && (
              <div style={{ 
                fontSize: '10px', 
                color: '#9ca3af',
                marginTop: '4px',
                textAlign: 'right'
              }}>
                {dados.fonte.toUpperCase()}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* FOOTER */}
      <div style={{ 
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '11px', color: '#9ca3af' }}>
          Fonte: CEPEA/ESALQ • B3 • Agrolink
        </div>
        
        <button
          onClick={() => window.location.href = '/price-alerts'}
          style={{
            padding: '6px 12px',
            background: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          aria-label="Criar alerta de preço"
          title="Criar alerta de preço"
        >
          <Bell className="w-3 h-3" />
          Criar Alerta
        </button>
      </div>
    </motion.div>
  );
};

export default CotacoesWidget;

