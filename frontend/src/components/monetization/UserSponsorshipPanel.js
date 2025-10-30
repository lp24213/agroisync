// 💼 PAINEL DE PATROCÍNIO DO USUÁRIO
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Zap, DollarSign, Calendar, Eye, MousePointer, Award } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getApiUrl } from '../../config/constants';

const UserSponsorshipPanel = ({ userId }) => {
  const [myItems, setMyItems] = useState({ products: [], freights: [] });
  const [sponsoredItems, setSponsoredItems] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const getToken = () => localStorage.getItem('token') || localStorage.getItem('authToken');

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Buscar produtos e fretes do usuário
      const [productsRes, freightsRes, metricsRes] = await Promise.all([
        fetch(`${getApiUrl('')}/products/my`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        }),
        fetch(`${getApiUrl('')}/freights/my`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        }),
        fetch(`${getApiUrl('')}/monetization/user/${userId}/metrics`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        })
      ]);

      const productsData = await productsRes.json();
      const freightsData = await freightsRes.json();
      const metricsData = await metricsRes.json();

      setMyItems({
        products: productsData.products || productsData.data || [],
        freights: freightsData.data || freightsData.freights || []
      });

      if (metricsData.success) {
        setMetrics(metricsData.data);
        setSponsoredItems(metricsData.data.sponsored_items || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSponsorItem = async (item, itemType, sponsorshipType, duration) => {
    try {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + duration);

      const prices = {
        featured: { 7: 19.90, 15: 34.90, 30: 49.90 },
        top_listing: { 7: 29.90, 15: 49.90, 30: 69.90 },
        highlighted: { 7: 14.90, 15: 24.90, 30: 39.90 }
      };

      const price = prices[sponsorshipType]?.[duration] || 49.90;

      const response = await fetch(`${getApiUrl('')}/monetization/sponsor`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          item_id: item.id,
          item_type: itemType,
          user_id: userId,
          sponsorship_type: sponsorshipType,
          start_date: new Date().toISOString(),
          end_date: endDate.toISOString(),
          price: price,
          payment_status: 'pending'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Item patrocinado! Aguardando pagamento...');
        // Redirecionar para pagamento
        window.location.href = `/payment/pix?amount=${price}&description=Patrocínio ${itemType}`;
      } else {
        toast.error(data.error || 'Erro ao patrocinar item');
      }
    } catch (error) {
      console.error('Error sponsoring item:', error);
      toast.error('Erro ao processar patrocínio');
    }
  };

  if (loading) {
    return (
      <div className='text-center py-12'>
        <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header com métricas */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6'>
          <Award className='h-8 w-8 mb-2' />
          <h3 className='text-2xl font-bold mb-1'>{sponsoredItems.length}</h3>
          <p className='text-sm opacity-90'>Itens Patrocinados</p>
        </div>

        <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6'>
          <Eye className='h-8 w-8 mb-2' />
          <h3 className='text-2xl font-bold mb-1'>
            {sponsoredItems.reduce((sum, item) => sum + (item.impressions || 0), 0)}
          </h3>
          <p className='text-sm opacity-90'>Total de Visualizações</p>
        </div>

        <div className='bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6'>
          <DollarSign className='h-8 w-8 mb-2' />
          <h3 className='text-2xl font-bold mb-1'>
            R$ {(metrics?.total_spent || 0).toFixed(2)}
          </h3>
          <p className='text-sm opacity-90'>Total Investido</p>
        </div>
      </div>

      {/* Meus itens patrocinados */}
      <div className='bg-white rounded-xl p-6 shadow-lg'>
        <h3 className='text-xl font-bold text-gray-900 mb-4'>⭐ Meus Itens em Destaque</h3>
        {sponsoredItems.length > 0 ? (
          <div className='space-y-3'>
            {sponsoredItems.map(item => (
              <div key={item.id} className='border border-gray-200 rounded-lg p-4 hover:border-green-400 transition-colors'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <span className='text-lg'>{item.item_type === 'product' ? '📦' : '🚛'}</span>
                      <h4 className='font-bold text-gray-900'>{item.item_title}</h4>
                      <span className='px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold'>
                        {item.status}
                      </span>
                    </div>
                    
                    <div className='grid grid-cols-4 gap-3 text-sm'>
                      <div>
                        <p className='text-gray-600 text-xs'>Tipo</p>
                        <p className='font-semibold'>{item.sponsorship_type}</p>
                      </div>
                      <div>
                        <p className='text-gray-600 text-xs'>Impressões</p>
                        <p className='font-semibold text-blue-600'>{item.impressions}</p>
                      </div>
                      <div>
                        <p className='text-gray-600 text-xs'>Cliques</p>
                        <p className='font-semibold text-green-600'>{item.clicks}</p>
                      </div>
                      <div>
                        <p className='text-gray-600 text-xs'>Válido até</p>
                        <p className='font-semibold'>{new Date(item.end_date).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-center text-gray-600 py-8'>Você ainda não tem itens patrocinados</p>
        )}
      </div>

      {/* Patrocinar novos itens */}
      <div className='bg-white rounded-xl p-6 shadow-lg'>
        <h3 className='text-xl font-bold text-gray-900 mb-4'>🚀 Patrocinar Itens</h3>
        
        {/* Produtos */}
        {myItems.products.length > 0 && (
          <div className='mb-6'>
            <h4 className='font-semibold text-gray-800 mb-3'>📦 Meus Produtos</h4>
            <div className='grid gap-3'>
              {myItems.products.slice(0, 5).map(product => (
                <SponsorableItem
                  key={product.id}
                  item={product}
                  itemType='product'
                  onSponsor={() => setSelectedItem({ ...product, type: 'product' })}
                  isSponsored={sponsoredItems.some(s => s.item_id === product.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Fretes */}
        {myItems.freights.length > 0 && (
          <div>
            <h4 className='font-semibold text-gray-800 mb-3'>🚛 Meus Fretes</h4>
            <div className='grid gap-3'>
              {myItems.freights.slice(0, 5).map(freight => (
                <SponsorableItem
                  key={freight.id}
                  item={freight}
                  itemType='freight'
                  onSponsor={() => setSelectedItem({ ...freight, type: 'freight' })}
                  isSponsored={sponsoredItems.some(s => s.item_id === freight.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de escolher plano de patrocínio */}
      {selectedItem && (
        <SponsorshipModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onConfirm={handleSponsorItem}
        />
      )}
    </div>
  );
};

// Componente de item que pode ser patrocinado
const SponsorableItem = ({ item, itemType, onSponsor, isSponsored }) => {
  return (
    <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-400 transition-colors'>
      <div className='flex-1'>
        <h5 className='font-semibold text-gray-900'>{item.title || item.name}</h5>
        <p className='text-sm text-gray-600'>
          {itemType === 'product' ? `R$ ${item.price}` : `${item.origin_city} → ${item.dest_city}`}
        </p>
      </div>
      
      {isSponsored ? (
        <span className='px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-bold'>
          ⭐ Patrocinado
        </span>
      ) : (
        <button
          onClick={onSponsor}
          className='px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-bold hover:from-green-700 hover:to-green-800 transition-all'
        >
          🚀 Patrocinar
        </button>
      )}
    </div>
  );
};

// Modal de escolha de plano de patrocínio
const SponsorshipModal = ({ item, onClose, onConfirm }) => {
  const [selectedType, setSelectedType] = useState('featured');
  const [selectedDuration, setSelectedDuration] = useState(30);

  const plans = {
    featured: {
      name: 'Destaque ⭐',
      description: 'Aparece na vitrine "Destaques da Semana"',
      icon: <Star />,
      color: '#fbbf24',
      prices: { 7: 19.90, 15: 34.90, 30: 49.90 }
    },
    top_listing: {
      name: 'Top Listing 🔥',
      description: 'Aparece no topo das listagens',
      icon: <TrendingUp />,
      color: '#3b82f6',
      prices: { 7: 29.90, 15: 49.90, 30: 69.90 }
    },
    highlighted: {
      name: 'Realçado ⚡',
      description: 'Borda dourada e selo premium',
      icon: <Zap />,
      color: '#10b981',
      prices: { 7: 14.90, 15: 24.90, 30: 39.90 }
    }
  };

  const selectedPlan = plans[selectedType];
  const price = selectedPlan.prices[selectedDuration];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>
            🚀 Patrocinar Item
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            {item.title || item.name}
          </p>

          {/* Escolher tipo de patrocínio */}
          <div className='space-y-3 mb-6'>
            <label className='text-sm font-semibold text-gray-700'>Escolha o tipo de destaque:</label>
            {Object.entries(plans).map(([key, plan]) => (
              <div
                key={key}
                onClick={() => setSelectedType(key)}
                style={{
                  padding: '1rem',
                  border: selectedType === key ? `3px solid ${plan.color}` : '2px solid #e5e7eb',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: selectedType === key ? `${plan.color}10` : 'white',
                  transition: 'all 0.2s'
                }}
              >
                <div className='flex items-center gap-3'>
                  <div style={{ color: plan.color }}>{plan.icon}</div>
                  <div className='flex-1'>
                    <h4 className='font-bold text-gray-900'>{plan.name}</h4>
                    <p className='text-sm text-gray-600'>{plan.description}</p>
                  </div>
                  {selectedType === key && <span style={{ fontSize: '20px' }}>✅</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Escolher duração */}
          <div className='mb-6'>
            <label className='text-sm font-semibold text-gray-700 mb-3 block'>Escolha a duração:</label>
            <div className='grid grid-cols-3 gap-3'>
              {[7, 15, 30].map(days => (
                <div
                  key={days}
                  onClick={() => setSelectedDuration(days)}
                  style={{
                    padding: '1rem',
                    border: selectedDuration === days ? '3px solid #22c55e' : '2px solid #e5e7eb',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    background: selectedDuration === days ? '#f0fdf4' : 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  <p className='text-2xl font-bold text-gray-900 mb-1'>{days}</p>
                  <p className='text-xs text-gray-600'>dias</p>
                  <p className='text-sm font-bold text-green-600 mt-2'>
                    R$ {selectedPlan.prices[days].toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className='bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-700 font-semibold'>Total a pagar:</span>
              <span className='text-2xl font-bold text-green-600'>R$ {price.toFixed(2)}</span>
            </div>
          </div>

          {/* Botões */}
          <div className='flex gap-3'>
            <button
              onClick={onClose}
              className='flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors'
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirm(item, item.type, selectedType, selectedDuration)}
              className='flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg'
            >
              💳 Pagar e Patrocinar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserSponsorshipPanel;

